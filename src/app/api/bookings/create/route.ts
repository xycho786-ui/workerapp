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
    const { workerId, jobDetails, price, scheduledAt, category, priority, voiceUrl } = body;

    if (!workerId || !jobDetails) {
      return NextResponse.json({ message: 'Worker ID and job details are required' }, { status: 400 });
    }

    const customer = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!customer) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        workerId: workerId,
        jobDetails: jobDetails,
        status: 'PENDING',
        price: price ? Number(price) : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        category: category || 'General',
        priority: priority || 'NORMAL',
        voiceUrl: voiceUrl || null,
        chatEnabled: false,
        contactShared: false
      }
    });

    // Notify the worker with priority context
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { id: workerId }
    });
    if (workerProfile) {
      let notifTitle = "New Booking Request";
      if (priority === "URGENT") notifTitle = "🚨 Urgent Booking Request";
      if (priority === "IMMEDIATE") notifTitle = "⚡ Immediate Booking Request";

      await prisma.notification.create({
        data: {
          userId: workerProfile.userId,
          title: notifTitle,
          message: `New request for ${category || 'services'} from ${customer.name || 'Customer'}. Priority: ${priority || 'NORMAL'}.`,
          type: priority === "NORMAL" ? "INFO" : priority === "URGENT" ? "WARNING" : "ERROR",
          category: "BOOKING",
          relatedId: booking.id
        }
      });
    }

    return NextResponse.json({ message: 'Booking created successfully', booking }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
