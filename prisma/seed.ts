import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Role } from '@prisma/client';

async function main() {
  const { prisma } = await import('../src/lib/prisma');
  console.log('Seeding database...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  // Create some users
  let user1 = await prisma.user.findFirst({
    where: {
      email: 'alex@example.com',
      role: Role.WORKER,
    },
  });
  if (!user1) {
    user1 = await prisma.user.create({
      data: {
        email: 'alex@example.com',
        name: 'Alex Johnson',
        role: Role.WORKER,
      },
    });
  }

  let user2 = await prisma.user.findFirst({
    where: {
      email: 'michael@example.com',
      role: Role.WORKER,
    },
  });
  if (!user2) {
    user2 = await prisma.user.create({
      data: {
        email: 'michael@example.com',
        name: 'Michael Brown',
        role: Role.WORKER,
      },
    });
  }

  // Create Locations first to avoid nested relation issues
  const loc1 = await prisma.location.create({
    data: {
      lat: 40.7128,
      lng: -74.0060,
      address: 'Downtown, Metropolis',
    }
  });

  const loc2 = await prisma.location.create({
    data: {
      lat: 40.7306,
      lng: -73.9352,
      address: 'City Center, Metropolis',
    }
  });

  // Create Worker Profiles
  const profile1 = await prisma.workerProfile.findUnique({
    where: { userId: user1.id },
  });
  if (!profile1) {
    await prisma.workerProfile.create({
      data: {
        userId: user1.id,
        skills: ['Electrician', 'Residential'],
        experience: 10,
        hourlyRate: 45,
        isOnline: true,
        locationId: loc1.id,
      },
    });
  } else {
    await prisma.workerProfile.update({
      where: { userId: user1.id },
      data: { locationId: loc1.id },
    });
  }

  const profile2 = await prisma.workerProfile.findUnique({
    where: { userId: user2.id },
  });
  if (!profile2) {
    await prisma.workerProfile.create({
      data: {
        userId: user2.id,
        skills: ['Plumber', 'Commercial'],
        experience: 8,
        hourlyRate: 55,
        isOnline: false,
        locationId: loc2.id,
      },
    });
  } else {
    await prisma.workerProfile.update({
      where: { userId: user2.id },
      data: { locationId: loc2.id },
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    const { prisma } = await import('../src/lib/prisma');
    await prisma.$disconnect();
  });
