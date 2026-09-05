import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { db as firebaseDb, messaging } from '@/lib/firebaseAdmin';

const DEFAULT_MESSAGE_LIMIT = 50;
const MAX_MESSAGE_LIMIT = 100;
const FETCH_WINDOW_MULTIPLIER = 4;

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    const before = searchParams.get('before');
    const requestedLimit = Number(searchParams.get('limit'));
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), MAX_MESSAGE_LIMIT)
      : DEFAULT_MESSAGE_LIMIT;

    if (!bookingId) {
      return NextResponse.json({ message: 'Booking ID is required' }, { status: 400 });
    }

    // Fetch booking and dbUser in parallel
    const [booking, dbUser] = await Promise.all([
      prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          customer: true,
          worker: {
            include: {
              user: true
            }
          }
        }
      }),
      prisma.user.findUnique({
        where: { id: user.id }
      })
    ]);

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    if (!dbUser) {
      return NextResponse.json({ message: 'User not found in database' }, { status: 404 });
    }

    // Security check: Only participant of the booking can view messages
    const isCustomer = booking.customerId === dbUser.id;
    const isWorker = booking.worker.userId === dbUser.id;

    if (!isCustomer && !isWorker) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const participant = isCustomer
      ? { name: booking.worker.user.name, email: booking.worker.user.email, id: booking.worker.userId, role: 'WORKER' }
      : { name: booking.customer.name, email: booking.customer.email, id: booking.customer.id, role: 'CUSTOMER' };

    // If job is finished (COMPLETED, CANCELLED, REJECTED), close chat facility and clear active messages
    const isFinished = booking.status === "COMPLETED" || booking.status === "CANCELLED" || booking.status === "REJECTED";
    if (isFinished) {
      return NextResponse.json({ 
        messages: [], 
        chatEnabled: false, 
        isCompleted: true, 
        bookingStatus: booking.status,
        participant
      }, { status: 200 });
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
      return NextResponse.json({ messages: [], bookingStatus: booking.status, participant, chatEnabled: true, isCompleted: false });
    }

    // Fetch messages from Firestore if connected, otherwise fallback to local Prisma DB
    let rawMessages: any[] = [];
    let fetchedFromFirebase = false;
    const fetchWindow = limit * FETCH_WINDOW_MULTIPLIER;

    if (firebaseDb) {
      try {
        let query = firebaseDb
          .collection('conversations')
          .doc(conversation.id)
          .collection('messages')
          .orderBy('createdAt', 'desc')
          .limit(fetchWindow);

        if (before) {
          query = query.where('createdAt', '<', before);
        }

        const snapshot = await query.get();

        rawMessages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            senderId: data.senderId,
            content: data.content,
            isRead: data.isRead,
            createdAt: new Date(data.createdAt)
          };
        }).reverse();
        fetchedFromFirebase = true;
      } catch (fbGetErr) {
        console.error('Failed to get messages from Firestore, falling back to local database:', fbGetErr);
      }
    }

    if (!fetchedFromFirebase) {
      const fetchedMessages = await prisma.message.findMany({
        where: {
          conversationId: conversation.id,
          ...(before ? { createdAt: { lt: new Date(before) } } : {})
        },
        orderBy: { createdAt: 'desc' },
        take: fetchWindow
      });
      rawMessages = fetchedMessages.reverse();
    }

    // Parse and filter messages belonging to this specific bookingId
    const allFilteredMessages = rawMessages.map(msg => {
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

    const filteredMessages = allFilteredMessages.slice(-limit);
    const hasMore = allFilteredMessages.length > limit || rawMessages.length === fetchWindow;
    const nextCursor = filteredMessages.length > 0 ? filteredMessages[0]?.createdAt : null;

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

      // Update in Firestore
      if (firebaseDb) {
        const unreadSnapshot = await firebaseDb
          .collection('conversations')
          .doc(conversation.id)
          .collection('messages')
          .where('senderId', '!=', dbUser.id)
          .where('isRead', '==', false)
          .get();

        if (!unreadSnapshot.empty) {
          const batch = firebaseDb.batch();
          unreadSnapshot.docs.forEach(doc => {
            batch.update(doc.ref, { isRead: true });
          });
          await batch.commit();
        }
      }
    } catch (updateError) {
      console.warn("Failed to mark messages as read:", updateError);
    }

    return NextResponse.json({ 
      messages: filteredMessages, 
      hasMore,
      nextCursor,
      bookingStatus: booking.status,
      participant
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
    if (booking.status === "PENDING") {
      return NextResponse.json({ message: 'Messaging is disabled until the booking has been accepted by both the customer and the worker.' }, { status: 400 });
    }

    const isCompleted = booking.status === "COMPLETED" || booking.status === "CANCELLED" || booking.status === "REJECTED";
    if (isCompleted) {
      return NextResponse.json({ message: 'This conversation has been closed because the booking has ended.' }, { status: 400 });
    }

    // Resolve current DB user
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
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

    // Create the message locally
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: dbUser.id,
        content: jsonContent,
        isRead: false
      }
    });

    // Save message to Firebase Firestore
    if (firebaseDb) {
      try {
        await firebaseDb
          .collection('conversations')
          .doc(conversation.id)
          .collection('messages')
          .doc(message.id)
          .set({
            id: message.id,
            conversationId: conversation.id,
            senderId: dbUser.id,
            content: jsonContent,
            isRead: false,
            createdAt: message.createdAt.toISOString()
          });
      } catch (fbErr) {
        console.error('Failed to write message to Firestore:', fbErr);
      }
    }

    // Trigger FCM Notification to recipient
    const recipientId = isCustomer ? booking.worker.userId : booking.customerId;
    const recipientUser = await prisma.user.findUnique({
      where: { id: recipientId }
    });

    if (recipientUser && recipientUser.fcmToken && messaging) {
      try {
        const typeLabel = type === 'voice' ? 'voice message' : type === 'location' ? 'location share' : 'message';
        const notificationTitle = `💬 New message from ${dbUser.name}`;
        const notificationBody = type === 'text' 
          ? (text.length > 50 ? `${text.substring(0, 50)}...` : text) 
          : `Sent you a ${typeLabel}.`;

        await messaging.send({
          token: recipientUser.fcmToken,
          notification: {
            title: notificationTitle,
            body: notificationBody
          },
          data: {
            bookingId,
            senderId: dbUser.id,
            type,
            click_action: 'FLUTTER_NOTIFICATION_CLICK'
          }
        });
      } catch (fcmError) {
        console.warn("Failed to send FCM push notification:", fcmError);
      }
    }

    // Trigger app local Notification for fallback
    try {
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
      console.warn("Failed to create local notification for message:", notifError);
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
