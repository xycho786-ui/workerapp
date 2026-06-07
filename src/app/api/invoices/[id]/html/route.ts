import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/invoices/[id]/html
 * Streams the stored invoice HTML directly to the browser.
 * Used for the "View Invoice" iframe and "Download" link in the UI.
 *
 * Ownership check: validates the invoice belongs to the requesting customer.
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
      return new Response("Unauthorized", { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    });

    if (!dbUser) {
      return new Response("User not found", { status: 404 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      select: {
        htmlContent: true,
        invoiceNumber: true,
        payment: { select: { customerId: true } },
      },
    });

    if (!invoice) {
      return new Response("Invoice not found", { status: 404 });
    }

    // Ownership check
    if (invoice.payment.customerId !== dbUser.id) {
      return new Response("Forbidden", { status: 403 });
    }

    if (!invoice.htmlContent) {
      return new Response("Invoice content not available", { status: 404 });
    }

    // Return raw HTML with download-friendly headers
    const isDownload = false; // always inline (iframe); download is triggered client-side via blob
    return new Response(invoice.htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": isDownload
          ? `attachment; filename="invoice-${invoice.invoiceNumber}.html"`
          : "inline",
        // Prevent caching of sensitive documents
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[GET /api/invoices/[id]/html] Error:", error);
    return new Response("Failed to serve invoice", { status: 500 });
  }
}
