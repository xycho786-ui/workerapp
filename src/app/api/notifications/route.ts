import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Fetch all notifications for user sorted by newest first
    const notifications = await prisma.notification.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ notifications }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const { notificationId, markAll = false } = body;

    if (markAll) {
      // Mark all notifications as read for this user
      await prisma.notification.updateMany({
        where: { userId: dbUser.id, isRead: false },
        data: { isRead: true }
      });
      return NextResponse.json({ success: true, message: 'All notifications marked as read' }, { status: 200 });
    }

    if (!notificationId) {
      return NextResponse.json({ message: 'Notification ID is required' }, { status: 400 });
    }

    // Update single notification read status
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification || notification.userId !== dbUser.id) {
      return NextResponse.json({ message: 'Notification not found or access forbidden' }, { status: 404 });
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });

    return NextResponse.json({ success: true, message: 'Notification marked as read' }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
