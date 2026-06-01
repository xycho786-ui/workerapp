import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { workerProfile: true }
    });

    if (!dbUser || !dbUser.workerProfile) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    const payments = await prisma.payment.findMany({
      where: {
        workerId: dbUser.workerProfile.id,
        status: "SUCCESSFUL"
      },
      include: {
        customer: true,
        booking: true
      },
      orderBy: { createdAt: "desc" }
    });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Start of the week (Sunday)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let earningsToday = 0;
    let earningsWeek = 0;
    let earningsMonth = 0;
    let earningsLifetime = 0;

    payments.forEach(p => {
      earningsLifetime += p.amount;
      const createdAt = new Date(p.createdAt);

      if (createdAt >= today) earningsToday += p.amount;
      if (createdAt >= weekStart) earningsWeek += p.amount;
      if (createdAt >= monthStart) earningsMonth += p.amount;
    });

    return NextResponse.json({
      success: true,
      earningsToday,
      earningsWeek,
      earningsMonth,
      earningsLifetime,
      recentPayments: payments.slice(0, 50)
    });
  } catch (error) {
    console.error("Earnings fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch earnings" }, { status: 500 });
  }
}
