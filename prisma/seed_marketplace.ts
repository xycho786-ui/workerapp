import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Role } from '@prisma/client';

async function main() {
  const { prisma } = await import('../src/lib/prisma');
  console.log('Seeding marketplace data...');

  // 1. Seed Products
  const products = [
    {
      name: "Handmade Soap",
      description: "100% natural handmade soap with essential oils. Good for all skin types.",
      price: 120.0,
      rating: 4.5,
      stock: 50,
      category: "Home",
      sellerName: "Natural Care",
      sellerLocation: "Chennai, India",
      image: "🧼",
    },
    {
      name: "Organic Honey",
      description: "Raw, unpasteurized forest honey sourced directly from local beekeepers.",
      price: 250.0,
      rating: 4.6,
      stock: 35,
      category: "Home",
      sellerName: "Green Life",
      sellerLocation: "Coimbatore, India",
      image: "🍯",
    },
    {
      name: "Wooden Table",
      description: "Handcrafted solid oak side table, perfect for bedrooms or living rooms.",
      price: 2500.0,
      rating: 4.4,
      stock: 8,
      category: "Home",
      sellerName: "Arun Woods",
      sellerLocation: "Coimbatore, TN",
      image: "🪵",
    },
    {
      name: "Wireless Earbuds",
      description: "Active noise cancelling wireless earbuds with 30-hour battery life.",
      price: 1800.0,
      rating: 4.7,
      stock: 25,
      category: "Electronics",
      sellerName: "V-Tech Electronics",
      sellerLocation: "Bangalore, India",
      image: "🎧",
    },
    {
      name: "Casual Cotton Shirt",
      description: "100% breathable organic cotton shirt. Unisex sizing.",
      price: 650.0,
      rating: 4.3,
      stock: 40,
      category: "Fashion",
      sellerName: "Stitch & Style",
      sellerLocation: "Tiruppur, India",
      image: "👕",
    }
  ];

  for (const prod of products) {
    const existing = await prisma.product.findFirst({
      where: { name: prod.name }
    });
    if (!existing) {
      await prisma.product.create({ data: prod });
      console.log(`Created product: ${prod.name}`);
    }
  }

  // 2. Seed Freelancers
  const freelancers = [
    {
      email: "aria@example.com",
      name: "Aria Chen",
      skills: ["Figma", "Branding", "UI Design"],
      hourlyRate: 45,
      experience: 6,
      userType: "freelancer",
      profession: ["Designer"],
    },
    {
      email: "marcus@example.com",
      name: "Marcus Vance",
      skills: ["React", "Next.js", "TypeScript", "Node.js"],
      hourlyRate: 60,
      experience: 8,
      userType: "freelancer",
      profession: ["Developer"],
    },
    {
      email: "elena@example.com",
      name: "Elena Rostova",
      skills: ["SEO", "Copywriting", "Blog Writing"],
      hourlyRate: 35,
      experience: 5,
      userType: "freelancer",
      profession: ["Writer"],
    }
  ];

  for (const f of freelancers) {
    const user = await prisma.user.upsert({
      where: {
        email_role: {
          email: f.email,
          role: Role.WORKER,
        }
      },
      update: {},
      create: {
        email: f.email,
        name: f.name,
        role: Role.WORKER,
      }
    });

    await prisma.workerProfile.upsert({
      where: { userId: user.id },
      update: {
        skills: f.skills,
        hourlyRate: f.hourlyRate,
        experience: f.experience,
        userType: f.userType,
        profession: f.profession,
      },
      create: {
        userId: user.id,
        skills: f.skills,
        experience: f.experience,
        hourlyRate: f.hourlyRate,
        isOnline: true,
        userType: f.userType,
        profession: f.profession,
        rating: 4.8,
        totalReviews: 24,
      }
    });
    console.log(`Seeded freelancer: ${f.name}`);
  }

  // 3. Seed Workers for Services
  const workers = [
    {
      email: "ravi@example.com",
      name: "Ravi Kumar",
      skills: ["Wiring", "Repair", "Installation", "Lighting", "Switch Board"],
      hourlyRate: 500,
      experience: 5,
      userType: "worker",
      profession: ["Electrician"],
      locationAddress: "Anna Nagar, Chennai",
    },
    {
      email: "suresh@example.com",
      name: "Suresh Babu",
      skills: ["Plumbing", "Leaking", "Pipe fitting", "Taps"],
      hourlyRate: 600,
      experience: 8,
      userType: "worker",
      profession: ["Plumber"],
      locationAddress: "RS Puram, Coimbatore",
    },
    {
      email: "lakshmi@example.com",
      name: "Lakshmi Devi",
      skills: ["Cleaning", "Housekeeping", "Dusting", "Deep Clean"],
      hourlyRate: 400,
      experience: 4,
      userType: "worker",
      profession: ["House Cleaning"],
      locationAddress: "Gandhipuram, Coimbatore",
    },
    {
      email: "manoj@example.com",
      name: "Manoj Kumar",
      skills: ["Painting", "Wall painting", "Interior Paint"],
      hourlyRate: 700,
      experience: 10,
      userType: "worker",
      profession: ["Painter"],
      locationAddress: "Peelamedu, Coimbatore",
    }
  ];

  for (const w of workers) {
    const user = await prisma.user.upsert({
      where: {
        email_role: {
          email: w.email,
          role: Role.WORKER,
        }
      },
      update: {},
      create: {
        email: w.email,
        name: w.name,
        role: Role.WORKER,
      }
    });

    await prisma.workerProfile.upsert({
      where: { userId: user.id },
      update: {
        skills: w.skills,
        hourlyRate: w.hourlyRate,
        experience: w.experience,
        userType: w.userType,
        profession: w.profession,
        locationAddress: w.locationAddress,
      },
      create: {
        userId: user.id,
        skills: w.skills,
        experience: w.experience,
        hourlyRate: w.hourlyRate,
        isOnline: true,
        userType: w.userType,
        profession: w.profession,
        locationAddress: w.locationAddress,
        rating: 4.5 + Math.random() * 0.5,
        totalReviews: 10 + Math.floor(Math.random() * 90),
      }
    });
    console.log(`Seeded worker: ${w.name}`);
  }

  console.log('Marketplace seeding completed!');
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
