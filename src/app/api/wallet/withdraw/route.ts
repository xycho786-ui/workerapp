import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (dbUser.walletBalance < Number(amount)) {
      return NextResponse.json({ success: false, error: 'Insufficient balance' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        walletBalance: {
          decrement: Number(amount)
        },
        transactions: {
          create: {
            amount: Number(amount),
            type: 'DEBIT',
            description: `Withdrawal to registered bank account`
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      balance: updatedUser.walletBalance
    });
  } catch (error: any) {
    console.error('Wallet withdraw error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
