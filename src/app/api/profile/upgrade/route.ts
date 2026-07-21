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
    const { skills, experience, locationAddress, hourlyRate } = body;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { workerProfile: true }
    });

    if (!dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (dbUser.workerProfile) {
      return NextResponse.json({ message: 'You are already a worker!' }, { status: 400 });
    }

    // Upgrade user to WORKER
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { role: 'WORKER' }
    });

    // Create Worker Profile
    await prisma.workerProfile.create({
      data: {
        userId: dbUser.id,
        skills: skills ? skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        experience: experience ? parseInt(experience) : 0,
        locationAddress: locationAddress || null,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
      }
    });

    return NextResponse.json({ message: 'Successfully upgraded to worker!' }, { status: 200 });
  } catch (error: any) {
    console.error('Error upgrading to worker:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
