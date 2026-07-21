import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/invoices/[id]
 * Returns full invoice detail including htmlContent for a specific invoice.
 * Validates that the invoice belongs to the authenticated customer (ownership check).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        payment: {
          include: {
            booking: {
              include: {
                customer: { select: { name: true, email: true } },
                worker: {
                  include: {
                    user: { select: { name: true, email: true } },
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

    // ── Ownership / Authorization check ───────────────────────────────────────
    // Ensure the invoice belongs to the customer, the worker, or the user is an admin.
    const isCustomer = invoice.payment.customerId === dbUser.id;
    const isWorker = invoice.payment.booking.worker.userId === dbUser.id;
    const isAdmin = dbUser.role === "ADMIN";

    if (!isCustomer && !isWorker && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    console.error("[GET /api/invoices/[id]] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}
