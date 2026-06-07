"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  Briefcase,
  CreditCard,
  ChevronRight,
  Mail,
} from "lucide-react";
import Link from "next/link";
import Portal from "@/components/Portal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkerSummary {
  profession: string[];
  user: { name: string };
}

interface BookingSummary {
  id: string;
  jobDetails: string;
  price: number | null;
  worker: WorkerSummary;
}

interface PaymentSummary {
  id: string;
  amount: number;
  platformFee: number;
  method: string | null;
  transactionId: string | null;
  status: string;
  booking: BookingSummary;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  totalAmount: number;
  emailStatus: "PENDING" | "SENT" | "FAILED";
  emailSentAt: string | null;
  createdAt: string;
  payment: PaymentSummary;
}

interface InvoicesClientProps {
  invoices: Invoice[];
  userName: string;
  userEmail: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const METHOD_LABELS: Record<string, string> = {
  UPI: "UPI",
  DEBIT_CARD: "Debit / Credit Card",
  CREDIT_CARD: "Credit Card",
  NET_BANKING: "Net Banking",
  WALLET: "Wallet",
};

function EmailStatusBadge({ status }: { status: Invoice["emailStatus"] }) {
  if (status === "SENT") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
        <CheckCircle2 size={9} /> Emailed
      </span>
    );
  }
  if (status === "FAILED") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-500 border border-red-100">
        <AlertCircle size={9} /> Email Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-400 border border-slate-100">
      <Clock size={9} /> Pending
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InvoicesClient({
  invoices,
  userName,
  userEmail,
}: InvoicesClientProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewingHtml, setViewingHtml] = useState<string | null>(null); // invoiceId being viewed
  const [downloading, setDownloading] = useState<string | null>(null);

  const initials = (userName || "JD").substring(0, 2).toUpperCase();

  // ── Download invoice as HTML file ─────────────────────────────────────────
  const handleDownload = async (invoice: Invoice) => {
    setDownloading(invoice.id);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/html`);
      if (!res.ok) throw new Error("Failed to fetch invoice");
      const html = await res.text();
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoice.invoiceNumber}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download invoice. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#F8F9FC] font-sans pb-28">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sticky top-0 z-40 border-b border-[#F0F0F0]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A2340]/10 to-[#1A2340]/20 flex items-center justify-center text-[#1A2340] font-extrabold text-[15px] border-[2px] border-white shadow-sm">
              {initials}
            </div>
            <div>
              <h1 className="text-base font-extrabold text-[#1A2340] tracking-tight">
                My Invoices
              </h1>
              <p className="text-[10px] text-slate-400 font-bold">{userEmail}</p>
            </div>
          </div>
          <Link
            href="/customer/jobs"
            className="text-[11px] font-bold text-[#1A2340] bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full transition-colors"
          >
            ← Jobs
          </Link>
        </div>
      </div>

      {/* ── Summary Stats ────────────────────────────────────────────────────── */}
      <div className="px-4 pt-5 pb-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-center">
            <div className="text-xl font-black text-[#1A2340]">{invoices.length}</div>
            <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Total</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-center">
            <div className="text-xl font-black text-emerald-600">
              ₹{invoices.reduce((s, i) => s + i.totalAmount, 0).toFixed(0)}
            </div>
            <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Spent</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-center">
            <div className="text-xl font-black text-blue-500">
              {invoices.filter((i) => i.emailStatus === "SENT").length}
            </div>
            <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Emailed</div>
          </div>
        </div>
      </div>

      {/* ── Invoice List ─────────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 space-y-3">
        {invoices.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 flex flex-col items-center justify-center border border-slate-100 shadow-sm text-center mt-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <Receipt size={28} className="text-slate-300" />
            </div>
            <h3 className="text-base font-black text-[#1A2340] mb-1">No Invoices Yet</h3>
            <p className="text-xs text-slate-400 font-medium max-w-[200px] leading-relaxed">
              Invoices are generated automatically after you complete a payment.
            </p>
            <Link
              href="/customer/jobs"
              className="mt-5 px-5 py-2.5 bg-[#1A2340] text-white text-xs font-bold rounded-xl hover:bg-[#2D3F6A] transition-colors"
            >
              View My Jobs →
            </Link>
          </div>
        ) : (
          invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden"
            >
              {/* Card Header */}
              <div className="px-4 py-3.5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1A2340]/5 flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-[#1A2340]" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#1A2340]">
                      {invoice.invoiceNumber}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {formatDate(invoice.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-sm font-black text-[#1A2340]">
                    ₹{invoice.totalAmount.toFixed(2)}
                  </span>
                  <EmailStatusBadge status={invoice.emailStatus} />
                </div>
              </div>

              {/* Service Summary */}
              <div className="px-4 pb-3 border-t border-slate-50">
                <div className="flex items-center gap-1.5 mt-2.5">
                  <Briefcase size={11} className="text-slate-300" />
                  <span className="text-[11px] text-slate-500 font-semibold line-clamp-1">
                    {invoice.payment.booking.jobDetails}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <CreditCard size={11} className="text-slate-300" />
                  <span className="text-[11px] text-slate-400 font-medium">
                    {METHOD_LABELS[invoice.payment.method ?? ""] ?? "—"} · {invoice.payment.booking.worker.user.name}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 pb-3.5 flex gap-2">
                <button
                  onClick={() => setSelectedInvoice(invoice)}
                  className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye size={13} /> Details
                </button>
                <button
                  onClick={() => setViewingHtml(invoice.id)}
                  className="flex-1 py-2 bg-[#1A2340] hover:bg-[#2D3F6A] text-white text-[11px] font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText size={13} /> View Invoice
                  <ChevronRight size={11} />
                </button>
                <button
                  onClick={() => handleDownload(invoice)}
                  disabled={downloading === invoice.id}
                  className="w-9 h-9 flex-shrink-0 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-600 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50"
                  title="Download HTML"
                >
                  {downloading === invoice.id ? (
                    <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download size={14} />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Invoice Detail Modal ─────────────────────────────────────────────── */}
      {selectedInvoice && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-8 duration-300">

              {/* Modal Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                  <h2 className="text-[15px] font-extrabold text-[#1A2340]">
                    {selectedInvoice.invoiceNumber}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {formatDate(selectedInvoice.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 text-slate-400"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-5 space-y-4">

                {/* Amount Summary */}
                <div className="bg-gradient-to-br from-[#1A2340] to-[#2D3F6A] rounded-2xl p-5 text-white">
                  <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">Total Paid</div>
                  <div className="text-3xl font-black">₹{selectedInvoice.totalAmount.toFixed(2)}</div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span className="text-[11px] text-white/70 font-semibold">Payment Successful</span>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Breakdown</h3>
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Service Charge</span>
                    <span>₹{selectedInvoice.payment.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Platform Fee</span>
                    <span>₹{selectedInvoice.payment.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-[#1A2340]">
                    <span>Total</span>
                    <span>₹{selectedInvoice.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Service Info */}
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Service</h3>
                  </div>
                  <div className="px-4 py-3 space-y-2">
                    <div className="text-xs font-semibold text-[#1A2340] leading-relaxed">
                      {selectedInvoice.payment.booking.jobDetails}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      Worker: {selectedInvoice.payment.booking.worker.user.name} ·{" "}
                      {selectedInvoice.payment.booking.worker.profession[0] ?? "Specialist"}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      Method: {METHOD_LABELS[selectedInvoice.payment.method ?? ""] ?? "—"}
                    </div>
                    {selectedInvoice.payment.transactionId && (
                      <div className="text-[10px] text-slate-400 font-mono bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 break-all">
                        TXN: {selectedInvoice.payment.transactionId}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Status */}
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email Receipt</h3>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-300" />
                      <div>
                        <div className="text-xs font-semibold text-[#1A2340]">
                          {selectedInvoice.emailStatus === "SENT"
                            ? "Receipt sent to your email"
                            : selectedInvoice.emailStatus === "FAILED"
                            ? "Email delivery failed"
                            : "Email queued"}
                        </div>
                        {selectedInvoice.emailSentAt && (
                          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {formatDate(selectedInvoice.emailSentAt)}
                          </div>
                        )}
                      </div>
                    </div>
                    <EmailStatusBadge status={selectedInvoice.emailStatus} />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-white flex gap-2">
                <button
                  onClick={() => {
                    setSelectedInvoice(null);
                    setViewingHtml(selectedInvoice.id);
                  }}
                  className="flex-1 py-3 bg-[#1A2340] hover:bg-[#2D3F6A] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye size={13} /> View Full Invoice
                </button>
                <button
                  onClick={() => handleDownload(selectedInvoice)}
                  disabled={downloading === selectedInvoice.id}
                  className="flex-1 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Download size={13} />
                  {downloading === selectedInvoice.id ? "Downloading..." : "Download"}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* ── Full Invoice Viewer Modal (iframe) ──────────────────────────────── */}
      {viewingHtml && (
        <Portal>
          <div className="fixed inset-0 z-[110] flex flex-col bg-[#09112A]/80 backdrop-blur-sm">

            {/* Viewer Toolbar */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#1A2340] shadow-md flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <FileText size={14} className="text-white" />
                </div>
                <span className="text-white text-sm font-bold">
                  {invoices.find((i) => i.id === viewingHtml)?.invoiceNumber ?? "Invoice"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const inv = invoices.find((i) => i.id === viewingHtml);
                    if (inv) handleDownload(inv);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg transition-colors"
                >
                  <Download size={12} /> Download
                </button>
                <button
                  onClick={() => setViewingHtml(null)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* iframe */}
            <iframe
              src={`/api/invoices/${viewingHtml}/html`}
              className="flex-1 w-full border-0 bg-white"
              title="Invoice Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </Portal>
      )}

    </div>
  );
}
