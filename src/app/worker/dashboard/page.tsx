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
      customer: true
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

  // Fetch recent customer reviews left for this worker
  const reviews = await prisma.review.findMany({
    where: { workerId: dbUser.workerProfile.id },
    include: {
      reviewer: true
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <WorkerDashboardClient
      workerProfile={dbUser.workerProfile as any}
      userName={dbUser.name}
      userEmail={dbUser.email}
      openRequests={openRequests as any}
      bookings={bookings as any}
      reviews={reviews as any}
    />
  );
}

