import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import WorkerDashboardClient from "./WorkerDashboardClient";

export default async function WorkerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: { workerProfile: true }
  });

  if (!dbUser || !dbUser.workerProfile) {
    redirect("/login");
  }

  // Fetch open service requests where this worker is the currently active assignee
  const openRequests = await prisma.serviceRequest.findMany({
    where: {
      status: 'OPEN',
      assignedWorkerId: dbUser.workerProfile.id
    },
    include: {
      customer: true,
      media: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Fetch all bookings for this worker (including customer details)
  const bookings = await prisma.booking.findMany({
    where: { workerId: dbUser.workerProfile.id },
    include: {
      customer: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // Fetch corresponding ServiceRequests with media in memory
  const customerIds = bookings.map(b => b.customerId);
  const serviceRequests = await prisma.serviceRequest.findMany({
    where: {
      customerId: {
        in: customerIds
      }
    },
    include: {
      customer: true,
      media: true
    }
  });

  const bookingsWithRequestData = bookings.map(booking => {
    const matchedReq = serviceRequests.find(req => 
      req.customerId === booking.customerId &&
      (booking.jobDetails === `${req.category}: ${req.description}` || 
       booking.jobDetails.includes(req.description))
    );
    return {
      id: booking.id,
      customerId: booking.customerId,
      workerId: booking.workerId,
      status: booking.status,
      jobDetails: booking.jobDetails,
      price: booking.price,
      scheduledAt: booking.scheduledAt ? booking.scheduledAt.toISOString() : null,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      completionImage: booking.completionImage || null,
      customer: {
        name: booking.customer.name,
        email: booking.customer.email
      },
      serviceRequest: matchedReq ? {
        id: matchedReq.id,
        category: matchedReq.category,
        description: matchedReq.description,
        budget: matchedReq.budget,
        status: matchedReq.status,
        createdAt: matchedReq.createdAt.toISOString(),
        customer: {
          name: matchedReq.customer.name,
          email: matchedReq.customer.email
        },
        media: matchedReq.media.map(m => ({
          id: m.id,
          url: m.url,
          type: m.type,
          serviceRequestId: m.serviceRequestId,
          createdAt: m.createdAt.toISOString()
        }))
      } : null
    };
  });

  // Fetch recent customer reviews left for this worker
  const reviews = await prisma.review.findMany({
    where: { workerId: dbUser.workerProfile.id },
    include: {
      reviewer: true
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const cleanOpenRequests = openRequests.map(req => ({
    id: req.id,
    customerId: req.customerId,
    category: req.category,
    description: req.description,
    budget: req.budget,
    status: req.status,
    createdAt: req.createdAt.toISOString(),
    customer: {
      name: req.customer.name,
      email: req.customer.email
    },
    media: req.media.map(m => ({
      id: m.id,
      url: m.url,
      type: m.type,
      serviceRequestId: m.serviceRequestId,
      createdAt: m.createdAt.toISOString()
    }))
  }));

  const cleanReviews = reviews.map(rev => ({
    id: rev.id,
    rating: rev.rating,
    comment: rev.comment,
    createdAt: rev.createdAt.toISOString(),
    reviewer: {
      name: rev.reviewer.name,
      email: rev.reviewer.email
    }
  }));

  const cleanProfile = {
    id: dbUser.workerProfile.id,
    userId: dbUser.workerProfile.userId,
    skills: dbUser.workerProfile.skills,
    experience: dbUser.workerProfile.experience,
    isOnline: dbUser.workerProfile.isOnline,
    hourlyRate: dbUser.workerProfile.hourlyRate,
    rating: dbUser.workerProfile.rating,
    totalReviews: dbUser.workerProfile.totalReviews,
    profession: dbUser.workerProfile.profession,
    availabilityStatus: dbUser.workerProfile.availabilityStatus
  };

  return (
    <WorkerDashboardClient
      workerProfile={cleanProfile as any}
      userName={dbUser.name}
      userEmail={dbUser.email}
      openRequests={cleanOpenRequests as any}
      bookings={bookingsWithRequestData as any}
      reviews={cleanReviews as any}
    />
  );
}

