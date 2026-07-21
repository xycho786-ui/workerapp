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

    const cartItems = await prisma.cartItem.findMany({
      where: { customerId: user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, cart: cartItems });
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

    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    const targetQty = quantity !== undefined ? Number(quantity) : 1;

    // Check product existence
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        customerId_productId: {
          customerId: user.id,
          productId: productId
        }
      }
    });

    let cartItem;
    if (existingCartItem) {
      if (targetQty <= 0) {
        await prisma.cartItem.delete({
          where: { id: existingCartItem.id }
        });
        return NextResponse.json({ success: true, message: 'Item removed from cart' });
      } else {
        cartItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: targetQty },
          include: { product: true }
        });
      }
    } else {
      if (targetQty <= 0) {
        return NextResponse.json({ success: false, error: 'Invalid quantity' }, { status: 400 });
      }
      cartItem = await prisma.cartItem.create({
        data: {
          customerId: user.id,
          productId: productId,
          quantity: targetQty
        },
        include: { product: true }
      });
    }

    return NextResponse.json({ success: true, cartItem });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (productId) {
      await prisma.cartItem.deleteMany({
        where: {
          customerId: user.id,
          productId: productId
        }
      });
    } else {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { customerId: user.id }
      });
    }

    return NextResponse.json({ success: true, message: 'Cart updated' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
