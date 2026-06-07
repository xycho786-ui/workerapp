import nodemailer from "nodemailer";

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  paymentId: string;
}

interface BookingData {
  id: string;
  jobDetails: string;
  price: number | null;
  customer: {
    name: string;
    email: string;
  };
  worker: {
    user: {
      name: string;
      email: string;
    };
    profession: string[];
  };
}

/**
 * Pure function — generates the invoice HTML string.
 * No side effects, no I/O. Safe to call from server-side code or transactions.
 */
export function generateInvoiceHtml(invoice: InvoiceData, booking: BookingData): string {
  const subtotal = booking.price ?? (invoice.totalAmount - 25);
  const platformFee = 25.0;
  const tax = 0.0;
  const dateStr = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1A2340;
      background-color: #F0F4FA;
      padding: 40px 20px;
      -webkit-font-smoothing: antialiased;
    }
    .email-wrapper { max-width: 620px; margin: 0 auto; }
    .email-container {
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 8px 40px rgba(26, 35, 64, 0.08);
      border: 1px solid #E2E8F0;
    }
    .header-banner {
      background: linear-gradient(135deg, #1A2340 0%, #2D3F6A 100%);
      padding: 40px 35px;
      text-align: center;
      color: #ffffff;
      position: relative;
    }
    .header-banner::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 20px;
      background: #fff;
      border-radius: 20px 20px 0 0;
    }
    .brand-name { font-size: 13px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; opacity: 0.6; margin-bottom: 10px; }
    .header-banner h1 { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; }
    .header-banner p { font-size: 13px; opacity: 0.75; font-weight: 500; margin-top: 6px; }
    .content-body { padding: 36px 40px 40px; }
    .success-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background-color: #E6FBF5; color: #00A87A; font-size: 11px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 1px; padding: 8px 16px;
      border-radius: 100px; border: 1px solid #C2F3E5; margin-bottom: 24px;
    }
    .invoice-meta {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 12px; color: #888BA0; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.5px; border-bottom: 1px dashed #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;
    }
    .invoice-meta strong { color: #1A2340; font-size: 13px; }
    .party-grid { display: flex; gap: 16px; margin-bottom: 24px; }
    .party-col {
      flex: 1; background-color: #F8F9FC; padding: 18px 20px;
      border-radius: 16px; border: 1px solid #EEF0F5;
    }
    .party-col h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #888BA0; margin-bottom: 8px; }
    .party-col .name { font-size: 14px; font-weight: 800; color: #1A2340; }
    .party-col .sub { font-size: 11px; color: #888BA0; font-weight: 500; margin-top: 3px; }
    .job-card {
      background: linear-gradient(135deg, #FFF5F5 0%, #FFF8F5 100%);
      border: 1px solid #FFE8E8; padding: 20px;
      border-radius: 16px; margin-bottom: 24px;
    }
    .job-card h4 { font-size: 10px; color: #E8514A; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; margin-bottom: 8px; }
    .job-card p { font-size: 13px; color: #2D3F6A; line-height: 1.6; font-weight: 600; }
    .price-section { margin-bottom: 28px; }
    .price-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 0; border-bottom: 1px solid #F0F2F5;
      font-size: 13px; font-weight: 600; color: #5A6A85;
    }
    .price-row:last-child { border-bottom: none; }
    .price-row.total {
      border-top: 2px solid #1A2340; padding-top: 18px; margin-top: 6px;
      font-size: 16px; font-weight: 900; color: #1A2340;
    }
    .price-row.total .amount { color: #00A87A; }
    .txn-box {
      background: #F0F4FA; border-radius: 12px; padding: 14px 18px;
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px;
    }
    .txn-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #888BA0; font-weight: 600; }
    .txn-value { font-size: 12px; font-weight: 800; color: #1A2340; font-family: monospace; }
    .footer-note {
      text-align: center; font-size: 11px; color: #A0A8BE; line-height: 1.7;
      border-top: 1px solid #EEF0F5; padding-top: 24px;
    }
    .footer-note strong { color: #1A2340; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="header-banner">
        <div class="brand-name">ServiceHub</div>
        <h1>Payment Receipt</h1>
        <p>Thank you for your payment</p>
      </div>

      <div class="content-body">
        <div style="text-align:center; margin-bottom: 4px;">
          <span class="success-badge">✓ &nbsp;Paid Successfully</span>
        </div>

        <div class="invoice-meta">
          <div>Invoice: <strong>${invoice.invoiceNumber}</strong></div>
          <div>Date: <strong>${dateStr}</strong></div>
        </div>

        <div class="party-grid">
          <div class="party-col">
            <h3>Bill To</h3>
            <div class="name">${booking.customer.name}</div>
            <div class="sub">${booking.customer.email}</div>
          </div>
          <div class="party-col">
            <h3>Service By</h3>
            <div class="name">${booking.worker.user.name}</div>
            <div class="sub">${booking.worker.profession[0] ?? "Service Specialist"}</div>
          </div>
        </div>

        <div class="job-card">
          <h4>Service Details</h4>
          <p>${booking.jobDetails}</p>
        </div>

        <div class="price-section">
          <div class="price-row">
            <span>Service Charges</span>
            <span>₹${subtotal.toFixed(2)}</span>
          </div>
          <div class="price-row">
            <span>Platform Fee</span>
            <span>₹${platformFee.toFixed(2)}</span>
          </div>
          <div class="price-row">
            <span>GST / Service Tax</span>
            <span>₹${tax.toFixed(2)}</span>
          </div>
          <div class="price-row total">
            <span>Total Paid</span>
            <span class="amount">₹${invoice.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div class="txn-box">
          <span class="txn-label">Invoice Reference</span>
          <span class="txn-value">${invoice.invoiceNumber}</span>
        </div>

        <div class="footer-note">
          This is an automatically generated receipt. Please do not reply to this email.<br>
          Questions? Contact us at <strong>support@servicehub.com</strong><br><br>
          <strong>&copy; ${new Date().getFullYear()} ServiceHub Inc. All rights reserved.</strong>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Sends invoice email to customer.
 * Returns structured result so the caller can update emailStatus in the DB.
 */
export async function sendInvoiceEmail(
  customerEmail: string,
  invoice: InvoiceData,
  booking: BookingData,
  preGeneratedHtml?: string
): Promise<{ success: boolean; messageId?: string; previewUrl?: string; error?: unknown }> {
  try {
    const htmlContent = preGeneratedHtml ?? generateInvoiceHtml(invoice, booking);
    const totalAmount = invoice.totalAmount;

    // Create Ethereal test account (dev only — swap for Resend/SendGrid in production)
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"ServiceHub Receipts" <receipts@servicehub.com>',
      to: customerEmail,
      subject: `[Receipt] ${invoice.invoiceNumber} — ₹${totalAmount.toFixed(2)} paid`,
      text: [
        `Hello ${booking.customer.name},`,
        ``,
        `Your payment of ₹${totalAmount.toFixed(2)} was successful.`,
        `Invoice Number: ${invoice.invoiceNumber}`,
        `Service: ${booking.jobDetails}`,
        `Worker: ${booking.worker.user.name}`,
        ``,
        `View your invoice history at: http://localhost:3000/customer/invoices`,
        ``,
        `— ServiceHub Team`,
      ].join("\n"),
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
    console.log(`[Invoice] Email sent to ${customerEmail}. ID: ${info.messageId}`);
    if (previewUrl) console.log(`[Invoice] Ethereal preview: ${previewUrl}`);

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error("[Invoice] Email dispatch failed:", error);
    return { success: false, error };
  }
}
