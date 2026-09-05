import { MapPin, Bell, UserIcon } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerLanguage } from "@/utils/serverLanguage";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import HomepageClient from "./HomepageClient";

export default async function DashboardPage() {
  let dbUser = null;
  let workers: any[] = [];

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user?.id) {
      dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
    }
  } catch (e) {
    console.warn("User session check skipped in dashboard:", e);
  }

  try {
    if (!dbUser) {
      dbUser = await prisma.user.findFirst({
        where: { role: "CUSTOMER" },
      }) || await prisma.user.findFirst();
    }

    workers = await prisma.workerProfile.findMany({
      where: {
        userType: "worker"
      },
      include: {
        user: true,
        category: true,
        location: true,
      },
      take: 5,
      orderBy: { rating: 'desc' },
    });
  } catch (e) {
    console.warn("Prisma data fetch warning in dashboard:", e);
  }

  const userName = dbUser?.name || "Customer";

  return (
    <div className="flex flex-col h-full bg-[#F5F5F7] pb-20">
      <HomepageClient userName={userName} recommendedWorkers={workers} />
    </div>
  );
}
