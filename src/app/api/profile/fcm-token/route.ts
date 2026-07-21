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

    const { fcmToken } = await request.json();

    if (fcmToken === undefined) {
      return NextResponse.json({ message: 'FCM Token is required' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { fcmToken }
    });

    return NextResponse.json({ success: true, message: 'FCM token saved successfully' });
  } catch (error: any) {
    console.error('Error saving FCM token:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
