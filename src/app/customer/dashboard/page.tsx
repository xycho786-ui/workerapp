import { MapPin, Bell, UserIcon } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerLanguage } from "@/utils/serverLanguage";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import HomepageClient from "./HomepageClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const { t } = await getServerLanguage();

  // Fetch user and workers in parallel
  const [dbUser, workers] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
    }),
    prisma.workerProfile.findMany({
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
    })
  ]);

  if (!dbUser) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F5F7] pb-20">
      <HomepageClient userName={dbUser.name} recommendedWorkers={workers} />
    </div>
  );
}
