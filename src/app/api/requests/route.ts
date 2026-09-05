import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { getDistance } from '@/utils/distance';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Log for debugging
    console.log('Received service request submission');
    
    // Resolve a valid customer ID to satisfy database foreign key constraints
    let customerId = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { id: true }
        });
        if (dbUser) {
          customerId = dbUser.id;
        }
      }
    } catch (e) {
      console.warn("Failed to get authenticated user session", e);
    }

    if (!customerId) {
      const dbUser = await prisma.user.findFirst({
        where: { role: 'CUSTOMER' },
        select: { id: true }
      });
      if (dbUser) {
        customerId = dbUser.id;
      }
    }

    if (!customerId) {
      return NextResponse.json({ message: 'No valid customer user found in database to link the request' }, { status: 400 });
    } 
    
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const budgetStr = formData.get('budget') as string;
    const budget = budgetStr ? parseFloat(budgetStr) : null;
    const latitudeStr = formData.get('latitude') as string;
    const longitudeStr = formData.get('longitude') as string;
    const latitude = latitudeStr ? parseFloat(latitudeStr) : 40.7128;
    const longitude = longitudeStr ? parseFloat(longitudeStr) : -74.0060;
    
    if (!category || !description) {
      return NextResponse.json({ message: 'Category and description are required' }, { status: 400 });
    }

    const requestId = crypto.randomUUID();
    
    // Find workers whose professions contain the category, and identify the closest one
    let assignedWorkerId: string | null = null;
    try {
      const matchingWorkers = await prisma.workerProfile.findMany({
        where: {
          profession: {
            has: category
          }
        },
        include: {
          location: true
        }
      });

      if (matchingWorkers.length > 0) {
        // Prioritize online workers first
        let activeWorkers = matchingWorkers.filter(w => w.isOnline);
        if (activeWorkers.length === 0) {
          // Fallback to all matching workers if none are online
          activeWorkers = matchingWorkers;
        }

        const workersWithDistance = activeWorkers.map(w => {
          const lat = w.locationLat ?? w.location?.lat ?? 40.7128;
          const lng = w.locationLng ?? w.location?.lng ?? -74.0060;
          const distance = getDistance(latitude, longitude, lat, lng);
          return { id: w.id, userId: w.userId, distance };
        });

        // Sort by distance ascending
        workersWithDistance.sort((a, b) => a.distance - b.distance);

        assignedWorkerId = workersWithDistance[0].id;
        const assignedWorkerUserId = workersWithDistance[0].userId;

        // Create notification for only the closest worker
        try {
          await prisma.notification.create({
            data: {
              userId: assignedWorkerUserId,
              title: "📥 New Service Request",
              message: `A customer has requested your ${category} service.`,
              category: "BOOKINGS",
              relatedId: requestId,
              type: "INFO"
            }
          });
        } catch (notifErr) {
          console.error("Failed to notify closest worker:", notifErr);
        }
      }
    } catch (workerSearchErr) {
      console.error("Failed to search and notify matching workers by distance:", workerSearchErr);
    }

    // Handle file uploads to Supabase storage (Voice, Images, Videos) with fallback
    const mediaRecords: Array<{ id: string; url: string; type: 'IMAGE' | 'VIDEO' | 'AUDIO' }> = [];
    const files = formData.getAll('media');

    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        const mediaId = crypto.randomUUID();
        let type: 'IMAGE' | 'VIDEO' | 'AUDIO' = 'IMAGE';
        if (file.type.startsWith('video/')) type = 'VIDEO';
        else if (file.type.startsWith('audio/')) type = 'AUDIO';

        const ext = file.name.split('.').pop() || 'bin';
        const filePath = `${requestId}/${mediaId}.${ext}`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let mediaUrl = "";
        try {
          const supabase = await createClient();
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('service-media')
            .upload(filePath, buffer, {
              contentType: file.type,
              upsert: true
            });

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from('service-media')
              .getPublicUrl(filePath);
            mediaUrl = urlData.publicUrl;
          } else {
            console.warn('Supabase storage upload returned error:', uploadError.message);
          }
        } catch (storageErr: any) {
          console.warn('Supabase storage upload failed, using fallback:', storageErr?.message);
        }

        // Fallback to data URL if storage upload failed or returned no URL
        if (!mediaUrl) {
          mediaUrl = `data:${file.type || 'image/png'};base64,${buffer.toString('base64')}`;
        }

        mediaRecords.push({
          id: mediaId,
          url: mediaUrl,
          type
        });
      }
    }

    // Create the ServiceRequest and all media records in a single atomic Prisma call
    await prisma.serviceRequest.create({
      data: {
        id: requestId,
        customerId,
        category,
        description,
        budget,
        status: 'OPEN',
        latitude,
        longitude,
        assignedWorkerId,
        media: {
          create: mediaRecords.map(record => ({
            id: record.id,
            url: record.url,
            type: record.type
          }))
        }
      }
    });

    // Create notification for customer
    try {
      await prisma.notification.create({
        data: {
          userId: customerId,
          title: "Booking Request Submitted",
          message: "Your request has been sent successfully.",
          category: "SYSTEM",
          relatedId: requestId,
          type: "SUCCESS"
        }
      });
    } catch (custNotifErr) {
      console.error("Failed to create customer request notification:", custNotifErr);
    }

    return NextResponse.json({ message: 'Request created successfully', id: requestId }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create service request:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
