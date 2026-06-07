import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { generateInvoiceHtml, sendInvoiceEmail } from "@/utils/email";

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
      include: {
        invoice: true, // for idempotency check
        booking: {
          include: {
            customer: true,
            worker: {
              include: {
                user: true // required for email template — worker name/profession
              }
            }
          }
        }
      }
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // ── Idempotency Guard ─────────────────────────────────────────────────────
    // If this payment was already verified and an invoice exists, return the
    // existing data without creating duplicates.
    if (payment.invoice) {
      console.log(`[Invoice] Idempotent hit — invoice ${payment.invoice.invoiceNumber} already exists for payment ${paymentId}`);
      return NextResponse.json({
        success: true,
        idempotent: true,
        payment,
        invoice: payment.invoice,
      });
    }

    const simulatedTransactionId =
      transactionId || `TXN_${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

    // ── Generate HTML before the transaction ──────────────────────────────────
    // Pure function — safe to call outside the DB transaction.
    const invoiceNumber = `INV-${new Date().getFullYear()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const htmlContent = generateInvoiceHtml(
      {
        id: "pending", // will be replaced by actual ID after creation
        invoiceNumber,
        totalAmount: payment.totalAmount,
        paymentId: payment.id,
      },
      payment.booking as any
    );

    // ── Atomic Transaction ────────────────────────────────────────────────────
    const [updatedPayment, updatedBooking, invoice] = await prisma.$transaction([
      // 1. Mark payment as successful
      prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "SUCCESSFUL",
          transactionId: simulatedTransactionId,
        },
      }),
      // 2. Mark booking as payment completed
      prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: "PAYMENT_COMPLETED" },
      }),
      // 3. Create invoice with stored HTML (immutable record)
      prisma.invoice.create({
        data: {
          invoiceNumber,
          totalAmount: payment.totalAmount,
          htmlContent,          // stored in DB — no filesystem dependency
          emailStatus: "PENDING",
          emailAttempts: 0,
          paymentId: payment.id,
        },
      }),
    ]);

    // ── Send Invoice Email (non-blocking, tracked) ────────────────────────────
    let emailResult: { success: boolean; previewUrl?: string; messageId?: string; error?: unknown } = {
      success: false,
      previewUrl: undefined,
    };
    if (payment.booking?.customer) {
      emailResult = await sendInvoiceEmail(
        payment.booking.customer.email,
        invoice,
        payment.booking as any,
        htmlContent // pass pre-generated HTML — no double-rendering
      );

      // Update emailStatus based on dispatch result
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          emailStatus: emailResult.success ? "SENT" : "FAILED",
          emailSentAt: emailResult.success ? new Date() : null,
          emailAttempts: { increment: 1 },
        },
      });
    }

    // ── Worker Notification ───────────────────────────────────────────────────
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { id: payment.workerId },
    });

    if (workerProfile) {
      await prisma.notification.create({
        data: {
          userId: workerProfile.userId,
          title: "💰 Payment Received",
          message: `You have received ₹${payment.amount} for booking #${payment.bookingId.slice(0, 6).toUpperCase()}`,
          type: "SUCCESS",
          category: "PAYMENTS",
          relatedId: payment.bookingId,
        },
      });
    }

    // ── Customer Notification ─────────────────────────────────────────────────
    await prisma.notification.create({
      data: {
        userId: payment.customerId,
        title: "✅ Payment Successful",
        message: `Your payment of ₹${payment.totalAmount} was successful. Invoice ${invoice.invoiceNumber} has been generated${emailResult.success ? " and emailed to you" : ""}.`,
        type: "SUCCESS",
        category: "PAYMENTS",
        relatedId: payment.bookingId,
      },
    });

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      invoice: {
        ...invoice,
        htmlContent: undefined, // don't send large HTML in the API response
      },
      emailPreviewUrl: emailResult.previewUrl,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
