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

  let dbUser = null;
  if (user?.id) {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
  }

  if (!dbUser) {
    dbUser = await prisma.user.findFirst({
      where: { role: "CUSTOMER" },
    }) || await prisma.user.findFirst();
  }

  const workers = await prisma.workerProfile.findMany({
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

  const userName = dbUser?.name || "mohammedanfas234";

  return (
    <div className="flex flex-col h-full bg-[#F5F5F7] pb-20">
      <HomepageClient userName={userName} recommendedWorkers={workers} />
    </div>
  );
}
