import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Download, Printer } from "lucide-react";

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const invoice = await prisma.invoice.findUnique({
    where: { invoiceNumber: params.id },
    include: {
      payment: {
        include: {
          customer: true,
          worker: {
            include: { user: true }
          },
          booking: true
        }
      }
    }
  });

  if (!invoice) {
    return notFound();
  }

  const { payment } = invoice;
  const { customer, worker, booking } = payment;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center font-sans">
      <div className="max-w-3xl w-full">
        {/* Actions Bar */}
        <div className="flex justify-end gap-3 mb-6 print:hidden">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm"
          >
            <Download size={16} />
            Download PDF
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-[#1A2340] text-white font-bold rounded-lg hover:bg-[#2D3F6A] transition-colors shadow-sm text-sm"
          >
            <Printer size={16} />
            Print Receipt
          </button>
        </div>

        {/* Invoice Document */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden print:shadow-none print:border-none">
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black text-[#1A2340] tracking-tight">ServiceHub</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">Professional Services Marketplace</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-slate-300 uppercase tracking-widest">Receipt</h2>
              <p className="text-sm font-semibold text-[#1A2340] mt-1">{invoice.invoiceNumber}</p>
              <p className="text-xs text-slate-500 mt-0.5">{format(new Date(invoice.date), "PPP")}</p>
            </div>
          </div>

          {/* Details */}
          <div className="p-8 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Billed To</h3>
              <p className="font-bold text-[#1A2340] text-base">{customer.name}</p>
              <p className="text-sm text-slate-500 mt-1">{customer.email}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Service By</h3>
              <p className="font-bold text-[#1A2340] text-base">{worker.user.name}</p>
              <p className="text-sm text-slate-500 mt-1">{worker.profession.join(", ")}</p>
            </div>
          </div>

          {/* Line Items */}
          <div className="px-8 pb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y border-slate-200">
                  <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-4">
                    <p className="font-bold text-[#1A2340] text-sm">{booking.jobDetails}</p>
                    <p className="text-xs text-slate-500 mt-1">Service execution fee</p>
                  </td>
                  <td className="py-4 text-right font-bold text-[#1A2340] text-sm">₹{payment.amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-4">
                    <p className="font-bold text-[#1A2340] text-sm">Platform Convenience Fee</p>
                  </td>
                  <td className="py-4 text-right font-bold text-[#1A2340] text-sm">₹{payment.platformFee.toFixed(2)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200">
                  <td className="py-4 text-right font-bold text-[#1A2340] uppercase tracking-wider pr-6">Total Paid</td>
                  <td className="py-4 text-right font-black text-[#1A2340] text-xl">₹{invoice.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 p-6 text-center border-t border-slate-200">
            <p className="text-xs text-slate-500 font-medium">
              Payment made securely via {payment.method || "System"}. Transaction ID: {payment.transactionId}
            </p>
            <p className="text-xs font-bold text-emerald-600 mt-2">
              Thank you for trusting ServiceHub!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
