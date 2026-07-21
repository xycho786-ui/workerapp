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

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { customerId: user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, wishlist: wishlistItems });
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
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    // Toggle logic
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        customerId_productId: {
          customerId: user.id,
          productId: productId
        }
      }
    });

    let added = false;
    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id }
      });
    } else {
      await prisma.wishlistItem.create({
        data: {
          customerId: user.id,
          productId: productId
        }
      });
      added = true;
    }

    return NextResponse.json({ success: true, added });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
