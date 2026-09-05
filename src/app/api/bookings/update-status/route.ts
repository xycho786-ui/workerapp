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
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json({ message: 'Booking ID and status are required' }, { status: 400 });
    }

    // Retrieve booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        worker: true,
        customer: true
      }
    });

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Verify the logged-in user is the worker assigned to this booking
    if (booking.worker.userId !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Update status
    const updateData: any = { status };
    if (status === 'ACCEPTED') {
      updateData.workerAcceptedAt = new Date();
      updateData.chatEnabled = true;
      updateData.contactShared = true;
    } else if (status === 'COMPLETED' || status === 'CANCELLED' || status === 'REJECTED') {
      updateData.chatEnabled = false;
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData
    });

    // Notify customer about the status update
    await prisma.notification.create({
      data: {
        userId: booking.customerId,
        title: `Booking Status: ${status}`,
        message: `Your booking with ${booking.worker.userType || 'worker'} ${user.user_metadata?.full_name || 'Provider'} has been updated to ${status}.`,
        category: 'BOOKING',
        relatedId: booking.id,
        type: status === 'REJECTED' ? 'WARNING' : status === 'COMPLETED' ? 'SUCCESS' : 'INFO'
      }
    });

    // If completed, add transaction / earnings
    if (status === 'COMPLETED' && booking.price) {
      // Add transaction credit to worker
      await prisma.user.update({
        where: { id: user.id },
        data: {
          walletBalance: {
            increment: booking.price
          },
          transactions: {
            create: {
              amount: booking.price,
              type: 'CREDIT',
              description: `Earnings from booking request #${bookingId.slice(0, 8)}`
            }
          }
        }
      });
    }

    return NextResponse.json({ message: 'Status updated successfully', booking: updatedBooking });
  } catch (error: any) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
