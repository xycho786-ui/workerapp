import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json({ message: 'Booking ID is required' }, { status: 400 });
    }

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        worker: {
          include: {
            user: true
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Resolve current DB user
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!dbUser) {
      return NextResponse.json({ message: 'User not found in database' }, { status: 404 });
    }

    // Security check: Only participant of the booking can view messages
    const isCustomer = booking.customerId === dbUser.id;
    const isWorker = booking.worker.userId === dbUser.id;

    if (!isCustomer && !isWorker) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Find the conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        customerId_workerId: {
          customerId: booking.customerId,
          workerId: booking.workerId
        }
      }
    });

    if (!conversation) {
      return NextResponse.json({ messages: [], bookingStatus: booking.status });
    }

    // Fetch messages
    const rawMessages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' }
    });

    // Parse and filter messages belonging to this specific bookingId
    const filteredMessages = rawMessages.map(msg => {
      try {
        const payload = JSON.parse(msg.content);
        if (payload.bookingId === bookingId) {
          return {
            id: msg.id,
            senderId: msg.senderId,
            createdAt: msg.createdAt,
            isRead: msg.isRead,
            type: payload.type || 'text',
            text: payload.text || '',
            voiceUrl: payload.voiceUrl || null,
            duration: payload.duration || 0,
            lat: payload.lat || 0,
            lng: payload.lng || 0,
            address: payload.address || ''
          };
        }
        return null;
      } catch (e) {
        // Fallback for legacy text messages
        return {
          id: msg.id,
          senderId: msg.senderId,
          createdAt: msg.createdAt,
          isRead: msg.isRead,
          type: 'text',
          text: msg.content,
          voiceUrl: null,
          duration: 0,
          lat: 0,
          lng: 0,
          address: ''
        };
      }
    }).filter(Boolean);

    // Update unread status for messages sent by the other participant
    try {
      await prisma.message.updateMany({
        where: {
          conversationId: conversation.id,
          senderId: { not: dbUser.id },
          isRead: false
        },
        data: { isRead: true }
      });
    } catch (updateError) {
      console.warn("Failed to mark messages as read:", updateError);
    }

    return NextResponse.json({ 
      messages: filteredMessages, 
      bookingStatus: booking.status,
      participant: isCustomer 
        ? { name: booking.worker.user.name, email: booking.worker.user.email, id: booking.worker.userId, role: 'WORKER' }
        : { name: booking.customer.name, email: booking.customer.email, id: booking.customer.id, role: 'CUSTOMER' }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      bookingId, 
      type, 
      text = '', 
      voiceUrl = null, 
      duration = 0, 
      lat = 0, 
      lng = 0, 
      address = '' 
    } = body;

    if (!bookingId || !type) {
      return NextResponse.json({ message: 'Booking ID and type are required' }, { status: 400 });
    }

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        worker: {
          include: {
            user: true
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Verify booking status is active
    const isCompleted = booking.status === "COMPLETED" || booking.status === "CANCELLED" || booking.status === "REJECTED";
    if (isCompleted) {
      return NextResponse.json({ message: 'This conversation has been closed because the booking has ended.' }, { status: 400 });
    }

    // Resolve current DB user
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!dbUser) {
      return NextResponse.json({ message: 'User not found in database' }, { status: 404 });
    }

    // Security check: Only participant of the booking can send messages
    const isCustomer = booking.customerId === dbUser.id;
    const isWorker = booking.worker.userId === dbUser.id;

    if (!isCustomer && !isWorker) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Find or create conversation
    const conversation = await prisma.conversation.upsert({
      where: {
        customerId_workerId: {
          customerId: booking.customerId,
          workerId: booking.workerId
        }
      },
      update: {},
      create: {
        customerId: booking.customerId,
        workerId: booking.workerId
      }
    });

    // Encode message payload
    const jsonContent = JSON.stringify({
      bookingId,
      type,
      text,
      voiceUrl,
      duration,
      lat,
      lng,
      address
    });

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: dbUser.id,
        content: jsonContent,
        isRead: false
      }
    });

    // Also trigger a notification for the other participant
    try {
      const recipientId = isCustomer ? booking.worker.userId : booking.customerId;
      const typeLabel = type === 'voice' ? 'voice message' : type === 'location' ? 'location share' : 'new message';
      
      await prisma.notification.create({
        data: {
          userId: recipientId,
          title: `💬 New Message`,
          message: `You received a ${typeLabel} from ${dbUser.name}.`,
          type: 'INFO',
          category: 'MESSAGES',
          relatedId: bookingId
        }
      });
    } catch (notifError) {
      console.warn("Failed to create notification for message:", notifError);
    }

    return NextResponse.json({ 
      success: true,
      message: {
        id: message.id,
        senderId: message.senderId,
        createdAt: message.createdAt,
        isRead: message.isRead,
        type,
        text,
        voiceUrl,
        duration,
        lat,
        lng,
        address
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
