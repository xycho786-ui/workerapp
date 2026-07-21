import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { sendInvoiceEmail } from "@/utils/email";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Authenticate user and assert ADMIN role
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Fetch invoice with relationships
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        payment: {
          include: {
            customer: true,
            booking: {
              include: {
                customer: true,
                worker: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const booking = invoice.payment.booking;
    const customerEmail = invoice.payment.customer.email;

    // 3. Dispatch invoice email with pre-generated HTML snapshot
    const emailResult = await sendInvoiceEmail(
      customerEmail,
      {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        totalAmount: invoice.totalAmount,
        paymentId: invoice.paymentId,
      },
      {
        id: booking.id,
        jobDetails: booking.jobDetails,
        price: booking.price,
        customer: {
          name: booking.customer.name,
          email: booking.customer.email,
        },
        worker: {
          user: {
            name: booking.worker.user.name,
            email: booking.worker.user.email,
          },
          profession: booking.worker.profession,
        },
      },
      invoice.htmlContent ?? undefined
    );

    // 4. Update status in database
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        emailStatus: emailResult.success ? "SENT" : "FAILED",
        emailSentAt: emailResult.success ? new Date() : null,
        emailAttempts: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: emailResult.success,
      emailStatus: updatedInvoice.emailStatus,
      emailAttempts: updatedInvoice.emailAttempts,
      previewUrl: emailResult.previewUrl,
    });
  } catch (error: any) {
    console.error("[POST /api/admin/invoices/[id]/resend] Error:", error);
    return NextResponse.json(
      { error: "Failed to resend invoice", details: error.message },
      { status: 500 }
    );
  }
}
