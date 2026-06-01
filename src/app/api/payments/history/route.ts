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

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // A user might be a customer AND a worker
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "customer"; // 'customer' or 'worker'

    let payments = [];

    if (type === "worker" && dbUser.workerProfile) {
      payments = await prisma.payment.findMany({
        where: { workerId: dbUser.workerProfile.id },
        include: { invoice: true, customer: true, booking: true },
        orderBy: { createdAt: "desc" }
      });
    } else {
      payments = await prisma.payment.findMany({
        where: { customerId: dbUser.id },
        include: { invoice: true, worker: { include: { user: true } }, booking: true },
        orderBy: { createdAt: "desc" }
      });
    }

    return NextResponse.json({ success: true, payments });
  } catch (error) {
    console.error("Payment history error:", error);
    return NextResponse.json({ error: "Failed to fetch payment history" }, { status: 500 });
  }
}
