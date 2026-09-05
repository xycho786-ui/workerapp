import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CustomerJobsClient from "./CustomerJobsClient";

export default async function CustomerJobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    redirect("/login");
  }

  // Fetch bookings and service requests in parallel
  const [bookings, requests] = await Promise.all([
    prisma.booking.findMany({
      where: { customerId: dbUser.id },
      include: {
        worker: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.serviceRequest.findMany({
      where: { customerId: dbUser.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <CustomerJobsClient
      initialBookings={bookings as any}
      initialRequests={requests as any}
      userName={dbUser.name}
      userEmail={dbUser.email}
    />
  );
}

