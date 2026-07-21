import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: { customerId: user.id },
      include: {
        worker: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const active = bookings.filter(
      b => b.status === "PENDING" || b.status === "ACCEPTED" || b.status === "IN_PROGRESS" || b.status === "AWAITING_PAYMENT"
    );

    const completed = bookings.filter(
      b => b.status === "COMPLETED" || b.status === "CANCELLED" || b.status === "REJECTED" || b.status === "PAYMENT_COMPLETED"
    );

    return NextResponse.json({ active, completed });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
