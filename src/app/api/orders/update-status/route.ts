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
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ message: 'Order ID and status are required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    // Notify customer about the order status update
    await prisma.notification.create({
      data: {
        userId: order.customerId,
        title: `📦 Order Update: ${status}`,
        message: `Your order #${orderId.slice(0, 8).toUpperCase()} has been updated to ${status}.`,
        category: 'ORDERS',
        relatedId: order.id,
        type: status === 'DELIVERED' ? 'SUCCESS' : 'INFO'
      }
    });

    // If order is completed, release wallet earnings to the seller
    if (status === 'DELIVERED') {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          walletBalance: {
            increment: order.totalAmount
          },
          transactions: {
            create: {
              amount: order.totalAmount,
              type: 'CREDIT',
              description: `Earnings from order #${orderId.slice(0, 8).toUpperCase()}`
            }
          }
        }
      });
    }

    return NextResponse.json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
