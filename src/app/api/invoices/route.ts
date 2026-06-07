import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/invoices
 * Returns all invoices for the authenticated customer, newest first.
 * htmlContent is excluded from the list response (large field — fetch individually if needed).
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        payment: {
          customerId: dbUser.id,
        },
      },
      select: {
        id: true,
        invoiceNumber: true,
        date: true,
        totalAmount: true,
        emailStatus: true,
        emailSentAt: true,
        emailAttempts: true,
        createdAt: true,
        // htmlContent intentionally omitted from list — load on demand
        payment: {
          select: {
            id: true,
            amount: true,
            platformFee: true,
            method: true,
            transactionId: true,
            status: true,
            booking: {
              select: {
                id: true,
                jobDetails: true,
                price: true,
                scheduledAt: true,
                worker: {
                  select: {
                    profession: true,
                    user: {
                      select: { name: true, email: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, invoices });
  } catch (error) {
    console.error("[GET /api/invoices] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
