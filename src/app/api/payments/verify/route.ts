import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentId, transactionId } = await req.json();

    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true }
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // In a real gateway, we would verify the signature using Razorpay/Stripe secrets here.
    // For now, we simulate a successful transaction verification.

    const simulatedTransactionId = transactionId || `TXN_${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

    // Use a transaction to ensure both payment and booking are updated atomically
    const [updatedPayment, updatedBooking, invoice] = await prisma.$transaction([
      // 1. Update Payment
      prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "SUCCESSFUL",
          transactionId: simulatedTransactionId,
        }
      }),
      // 2. Update Booking
      prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
          status: "PAYMENT_COMPLETED"
        }
      }),
      // 3. Create Invoice
      prisma.invoice.create({
        data: {
          invoiceNumber: `INV-${new Date().getFullYear()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
          totalAmount: payment.totalAmount,
          paymentId: payment.id,
        }
      })
    ]);

    const workerProfile = await prisma.workerProfile.findUnique({
      where: { id: payment.workerId }
    });

    if (workerProfile) {
      // Send Notification to Worker
      await prisma.notification.create({
        data: {
          userId: workerProfile.userId,
          title: "Payment Received",
          message: `You have received ₹${payment.amount} for booking #${payment.bookingId.slice(0, 6)}`,
          type: "SUCCESS",
          category: "PAYMENTS",
          relatedId: payment.bookingId,
        }
      });
    }

    // Send Notification to Customer
    await prisma.notification.create({
      data: {
        userId: payment.customerId,
        title: "Payment Successful",
        message: `Your payment of ₹${payment.totalAmount} was successful. Invoice ${invoice.invoiceNumber} has been generated.`,
        type: "SUCCESS",
        category: "PAYMENTS",
        relatedId: payment.bookingId,
      }
    });

    return NextResponse.json({ success: true, payment: updatedPayment, invoice });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
