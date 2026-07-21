import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { bookingId, amount, method } = await req.json();

    if (!bookingId || amount == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { worker: true }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Optional: Only allow creating payment intent if status is AWAITING_PAYMENT
    if (booking.status !== "AWAITING_PAYMENT") {
      return NextResponse.json({ error: "Booking is not awaiting payment" }, { status: 400 });
    }

    const platformFee = 25.0; // Fixed platform fee as discussed
    const tax = 0.0;
    const totalAmount = parseFloat(amount) + platformFee + tax;

    // We simulate creating a payment intent and storing it in the DB
    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        platformFee,
        tax,
        totalAmount,
        status: "PENDING",
        method: method || "UPI",
        bookingId: booking.id,
        customerId: dbUser.id,
        workerId: booking.workerId,
      }
    });

    // In a real scenario, here we'd call Stripe/Razorpay and return the client_secret or order_id
    // return NextResponse.json({ clientSecret: paymentIntent.client_secret });

    // For simulation, we'll return the payment ID
    return NextResponse.json({ success: true, paymentId: payment.id, totalAmount });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }
}
