import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import nodemailer from 'nodemailer';

export interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  customerName: string;
  customerEmail: string;
  workerName: string;
  serviceDetails: string;
  amount: number;
  platformFee: number;
  tax: number;
  totalAmount: number;
  paymentId: string;
}

export async function generateAndSendInvoice(data: InvoiceData) {
  try {
    // 1. Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const { width, height } = page.getSize();
    
    // Header
    page.drawText('WBSP PLATFORM INVOICE', { x: 50, y: height - 60, size: 24, font: boldFont, color: rgb(0.1, 0.1, 0.4) });
    
    // Invoice Info
    page.drawText(`Invoice Number: ${data.invoiceNumber}`, { x: 50, y: height - 100, size: 12, font });
    page.drawText(`Date: ${new Date(data.date).toLocaleDateString()}`, { x: 50, y: height - 120, size: 12, font });
    page.drawText(`Payment ID: ${data.paymentId}`, { x: 50, y: height - 140, size: 12, font });
    
    // Customer Info
    page.drawText('Billed To:', { x: 50, y: height - 180, size: 14, font: boldFont });
    page.drawText(`${data.customerName}`, { x: 50, y: height - 200, size: 12, font });
    page.drawText(`${data.customerEmail}`, { x: 50, y: height - 220, size: 12, font });
    
    // Worker Info
    page.drawText('Service Provider:', { x: 350, y: height - 180, size: 14, font: boldFont });
    page.drawText(`${data.workerName}`, { x: 350, y: height - 200, size: 12, font });
    
    // Line Items Header
    page.drawLine({ start: { x: 50, y: height - 260 }, end: { x: 550, y: height - 260 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    page.drawText('Description', { x: 50, y: height - 280, size: 12, font: boldFont });
    page.drawText('Amount', { x: 450, y: height - 280, size: 12, font: boldFont });
    page.drawLine({ start: { x: 50, y: height - 295 }, end: { x: 550, y: height - 295 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    
    // Line Items
    page.drawText(data.serviceDetails.substring(0, 50), { x: 50, y: height - 320, size: 12, font });
    page.drawText(`Rs. ${data.amount.toFixed(2)}`, { x: 450, y: height - 320, size: 12, font });
    
    page.drawText('Platform Fee', { x: 50, y: height - 350, size: 12, font });
    page.drawText(`Rs. ${data.platformFee.toFixed(2)}`, { x: 450, y: height - 350, size: 12, font });
    
    page.drawText('Tax', { x: 50, y: height - 380, size: 12, font });
    page.drawText(`Rs. ${data.tax.toFixed(2)}`, { x: 450, y: height - 380, size: 12, font });
    
    // Total
    page.drawLine({ start: { x: 50, y: height - 410 }, end: { x: 550, y: height - 410 }, thickness: 2, color: rgb(0.1, 0.1, 0.4) });
    page.drawText('Total Paid:', { x: 350, y: height - 435, size: 14, font: boldFont });
    page.drawText(`Rs. ${data.totalAmount.toFixed(2)}`, { x: 450, y: height - 435, size: 14, font: boldFont, color: rgb(0.1, 0.6, 0.3) });
    
    // Footer
    page.drawText('Thank you for using WBSP!', { x: 220, y: 50, size: 12, font: boldFont, color: rgb(0.5, 0.5, 0.5) });

    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    // 2. Send Email
    // Using test account or actual SMTP if provided
    let transporter;
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback to ethereal for testing if no SMTP config
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log("Created Ethereal test account for emails");
    }

    const info = await transporter.sendMail({
      from: '"WBSP Billing" <billing@wbsp.com>',
      to: data.customerEmail,
      subject: `Your Invoice from WBSP: ${data.invoiceNumber}`,
      text: `Hello ${data.customerName},\n\nThank you for your payment. Please find your invoice attached.\n\nBest regards,\nWBSP Team`,
      html: `<p>Hello <strong>${data.customerName}</strong>,</p><p>Thank you for your payment. Please find your invoice attached.</p><p>Best regards,<br/>WBSP Team</p>`,
      attachments: [
        {
          filename: `invoice-${data.invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        }
      ]
    });

    console.log("Invoice email sent:", info.messageId);
    
    if (!process.env.SMTP_HOST) {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }
    
    // Return base64 pdf for saving in DB if needed
    return {
      success: true,
      pdfBase64: pdfBuffer.toString('base64'),
      messageId: info.messageId
    };

  } catch (error) {
    console.error("Error generating or sending invoice:", error);
    return {
      success: false,
      error: error
    };
  }
}
