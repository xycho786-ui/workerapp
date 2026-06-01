import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

// Get all saved workers for the authenticated customer
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const saved = await prisma.savedWorker.findMany({
      where: {
        customer: { email: user.email }
      },
      include: {
        worker: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(saved, { status: 200 });
  } catch (error: any) {
    console.error('Failed to get saved workers:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}

// Save a worker
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { workerId } = body;

    if (!workerId) {
      return NextResponse.json({ message: 'workerId is required' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const savedWorker = await prisma.savedWorker.upsert({
      where: {
        customerId_workerId: {
          customerId: dbUser.id,
          workerId: workerId
        }
      },
      create: {
        customerId: dbUser.id,
        workerId: workerId
      },
      update: {} // No-op if already exists
    });

    return NextResponse.json({ message: 'Worker saved successfully', savedWorker }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to save worker:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}

// Remove a saved worker
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get('workerId');

    if (!workerId) {
      return NextResponse.json({ message: 'workerId is required' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    await prisma.savedWorker.delete({
      where: {
        customerId_workerId: {
          customerId: dbUser.id,
          workerId: workerId
        }
      }
    });

    return NextResponse.json({ message: 'Worker removed from saved list' }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to remove saved worker:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
