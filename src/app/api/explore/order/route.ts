import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { customerId: user.id },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { customerId: user.id },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ success: false, error: 'Your cart is empty' }, { status: 400 });
    }

    // 2. Calculate total cost
    let totalAmount = 0;
    for (const item of cartItems) {
      totalAmount += item.product.price * item.quantity;
    }

    // 3. Get user balance
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (dbUser.walletBalance < totalAmount) {
      return NextResponse.json({
        success: false,
        error: `Insufficient wallet balance. Total is ₹${totalAmount.toFixed(2)}, but your balance is ₹${dbUser.walletBalance.toFixed(2)}.`
      }, { status: 400 });
    }

    // 4. Perform transaction inside DB transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct wallet balance
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          walletBalance: {
            decrement: totalAmount
          }
        }
      });

      // Log transaction
      const transaction = await tx.transaction.create({
        data: {
          userId: user.id,
          amount: totalAmount,
          type: 'DEBIT',
          description: `Paid for order containing ${cartItems.length} products`
        }
      });

      // Create Order
      const order = await tx.order.create({
        data: {
          customerId: user.id,
          totalAmount: totalAmount,
          status: 'PROCESSING', // Initial status
          items: {
            create: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price
            }))
          }
        },
        include: {
          items: {
            include: { product: true }
          }
        }
      });

      // Empty cart
      await tx.cartItem.deleteMany({
        where: { customerId: user.id }
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: "Order Placed Successfully",
          message: `Your order for ₹${totalAmount.toFixed(2)} has been placed. Tracking ID: ${order.id.substring(0, 8)}`,
          type: "SUCCESS",
          category: "ORDER",
          relatedId: order.id
        }
      });

      return { order, walletBalance: updatedUser.walletBalance };
    });

    return NextResponse.json({
      success: true,
      order: result.order,
      walletBalance: result.walletBalance,
      message: 'Order placed successfully!'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
