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

    // Fetch unread notifications count and unread messages count in parallel via single-query SQL counts
    const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
      prisma.notification.count({
        where: {
          userId: dbUser.id,
          isRead: false
        }
      }),
      prisma.message.count({
        where: {
          conversation: {
            OR: [
              { customerId: dbUser.id },
              { worker: { userId: dbUser.id } }
            ]
          },
          senderId: { not: dbUser.id },
          isRead: false
        }
      })
    ]);

    return NextResponse.json({
      unreadNotificationsCount,
      unreadMessagesCount
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching unread counts:', error);
    return NextResponse.json({ unreadNotificationsCount: 0, unreadMessagesCount: 0, error: error.message }, { status: 500 });
  }
}
