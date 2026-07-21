import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ unreadNotificationsCount: 0, unreadMessagesCount: 0 }, { status: 200 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        workerProfile: true
      }
    });

    if (!dbUser) {
      return NextResponse.json({ unreadNotificationsCount: 0, unreadMessagesCount: 0 }, { status: 200 });
    }

    // 1. Fetch unread notifications count
    const unreadNotificationsCount = await prisma.notification.count({
      where: {
        userId: dbUser.id,
        isRead: false
      }
    });

    // 2. Fetch unread chat messages count
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { customerId: dbUser.id },
          { worker: { userId: dbUser.id } }
        ]
      },
      include: {
        messages: {
          where: {
            senderId: { not: dbUser.id },
            isRead: false
          }
        }
      }
    });

    const unreadMessagesCount = conversations.reduce((acc, conv) => acc + conv.messages.length, 0);

    return NextResponse.json({
      unreadNotificationsCount,
      unreadMessagesCount
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching unread counts:', error);
    return NextResponse.json({ unreadNotificationsCount: 0, unreadMessagesCount: 0, error: error.message }, { status: 500 });
  }
}
