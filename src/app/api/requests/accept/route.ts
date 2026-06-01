import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { requestId } = body;

    if (!requestId) {
      return NextResponse.json({ message: 'Request ID is required' }, { status: 400 });
    }

    // Find the worker profile
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { workerProfile: true }
    });

    if (!dbUser || !dbUser.workerProfile) {
      return NextResponse.json({ message: 'Worker profile not found' }, { status: 404 });
    }

    // Find the service request
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { customer: true }
    });

    if (!serviceRequest) {
      return NextResponse.json({ message: 'Service request not found' }, { status: 404 });
    }

    if (serviceRequest.status !== 'OPEN') {
      return NextResponse.json({ message: 'This request is no longer open' }, { status: 400 });
    }

    // Create the booking and update the service request status inside a transaction
    const [booking, updatedRequest] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          customerId: serviceRequest.customerId,
          workerId: dbUser.workerProfile.id,
          jobDetails: `${serviceRequest.category}: ${serviceRequest.description}`,
          price: serviceRequest.budget,
          status: 'ACCEPTED'
        }
      }),
      prisma.serviceRequest.update({
        where: { id: requestId },
        data: { status: 'MATCHED' }
      })
    ]);

    // Create notifications for customer
    try {
      await prisma.notification.create({
        data: {
          userId: serviceRequest.customerId,
          title: "✅ Worker Accepted Your Request",
          message: `${dbUser.name} has accepted your ${serviceRequest.category} request.`,
          category: "BOOKINGS",
          relatedId: booking.id,
          type: "INFO"
        }
      });

      await prisma.notification.create({
        data: {
          userId: serviceRequest.customerId,
          title: "🔐 Verification OTP Ready",
          message: "Your service verification OTP has been generated.",
          category: "OTP",
          relatedId: booking.id,
          type: "INFO"
        }
      });
    } catch (err) {
      console.error("Failed to create customer acceptance notifications:", err);
    }

    // Create or find a conversation and add a welcome message
    try {
      const conversation = await prisma.conversation.upsert({
        where: {
          customerId_workerId: {
            customerId: serviceRequest.customerId,
            workerId: dbUser.workerProfile.id,
          }
        },
        update: {},
        create: {
          customerId: serviceRequest.customerId,
          workerId: dbUser.workerProfile.id,
        }
      });

      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: dbUser.id,
          content: `Hi! I have accepted your request for "${serviceRequest.category}": "${serviceRequest.description}". I am on my way to help you!`,
        }
      });
    } catch (chatError) {
      console.error("Failed to initialize conversation message:", chatError);
      // Don't fail the whole request if only chat initialization fails
    }

    return NextResponse.json({ 
      message: 'Job accepted successfully', 
      booking 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error accepting request:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
