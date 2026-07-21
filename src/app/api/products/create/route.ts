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
    const { name, description, price, stock, category, image, sellerName, sellerLocation } = body;

    if (!name || !price) {
      return NextResponse.json({ message: 'Product name and price are required' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: Number(price),
        stock: stock ? Number(stock) : 10,
        category: category || 'General',
        image: image || null,
        sellerName: sellerName || user.user_metadata?.full_name || user.email.split('@')[0],
        sellerLocation: sellerLocation || 'Chennai, India'
      }
    });

    return NextResponse.json({ message: 'Product created successfully', product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
