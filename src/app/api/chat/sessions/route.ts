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

    // Resolve current DB user
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: {
        workerProfile: true
      }
    });

    if (!dbUser) {
      return NextResponse.json({ message: 'User not found in database' }, { status: 404 });
    }

    let bookings = [];

    // Query bookings depending on user role
    if (dbUser.role === 'WORKER' && dbUser.workerProfile) {
      bookings = await prisma.booking.findMany({
        where: { workerId: dbUser.workerProfile.id },
        include: {
          customer: true,
          worker: {
            include: {
              user: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
    } else {
      bookings = await prisma.booking.findMany({
        where: { customerId: dbUser.id },
        include: {
          customer: true,
          worker: {
            include: {
              user: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
    }

    // Bulk fetch all relevant conversations and their messages
    const isWorkerRole = dbUser.role === 'WORKER';
    const conversations = await prisma.conversation.findMany({
      where: (isWorkerRole && dbUser.workerProfile)
        ? { workerId: dbUser.workerProfile.id } 
        : { customerId: dbUser.id },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          // Optimization: Only fetch recent/unread messages or let's fetch all for simplicity, but in a single query
        }
      }
    });

    // Create a map for O(1) lookups
    const conversationMap = new Map();
    conversations.forEach(conv => {
      conversationMap.set(`${conv.customerId}_${conv.workerId}`, conv);
    });

    // Format sessions with participant details and unread counts
    const sessions = bookings.map((booking) => {
      const convKey = `${booking.customerId}_${booking.workerId}`;
      const conversation = conversationMap.get(convKey);

      let unreadCount = 0;
      let lastMessageText = 'No messages yet';
      let lastMessageTime = booking.updatedAt.toISOString();

      if (conversation && conversation.messages.length > 0) {
        // Filter messages belonging to this specific booking
        const bookingMessages = conversation.messages.filter((msg: any) => {
          try {
            const payload = JSON.parse(msg.content);
            return payload.bookingId === booking.id;
          } catch {
            // Legacy/fallback text message
            return true; 
          }
        });

        if (bookingMessages.length > 0) {
          const latestMsg = bookingMessages[0];
          lastMessageTime = latestMsg.createdAt.toISOString();
          
          try {
            const payload = JSON.parse(latestMsg.content);
            if (payload.type === 'voice') {
              lastMessageText = '🎤 Voice Message';
            } else if (payload.type === 'location') {
              lastMessageText = '📍 Shared Location';
            } else {
              lastMessageText = payload.text || '';
            }
          } catch {
            lastMessageText = latestMsg.content;
          }

          // Count unread messages sent by the other participant
          unreadCount = bookingMessages.filter(
            (msg: any) => msg.senderId !== dbUser.id && !msg.isRead
          ).length;
        }
      }

      const otherParticipantName = isWorkerRole ? booking.customer.name : booking.worker.user.name;
      const otherParticipantEmail = isWorkerRole ? booking.customer.email : booking.worker.user.email;
      const otherParticipantId = isWorkerRole ? booking.customer.id : booking.worker.userId;

      return {
        bookingId: booking.id,
        status: booking.status,
        jobDetails: booking.jobDetails,
        updatedAt: booking.updatedAt,
        lastMessageText,
        lastMessageTime,
        unreadCount,
        participant: {
          id: otherParticipantId,
          name: otherParticipantName,
          email: otherParticipantEmail,
          role: isWorkerRole ? 'CUSTOMER' : 'WORKER'
        }
      };
    });

    return NextResponse.json({ sessions }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching chat sessions:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
