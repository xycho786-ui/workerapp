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
  Search,
  Filter,
  RefreshCw,
  Send,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import Portal from "@/components/Portal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserSummary {
  name: string;
  email: string;
}

interface WorkerSummary {
  profession: string[];
  user: { name: string; email: string };
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
  customer: UserSummary;
  booking: BookingSummary;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  totalAmount: number;
  emailStatus: "PENDING" | "SENT" | "FAILED";
  emailSentAt: string | null;
  emailAttempts: number;
  createdAt: string;
  payment: PaymentSummary;
}

interface AdminInvoicesClientProps {
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
        <AlertCircle size={9} /> Failed
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

export default function AdminInvoicesClient({
  invoices: initialInvoices,
  userName,
  userEmail,
}: AdminInvoicesClientProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewingHtml, setViewingHtml] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SENT" | "FAILED" | "PENDING">("ALL");
  const [resending, setResending] = useState<string | null>(null);

  const initials = (userName || "AD").substring(0, 2).toUpperCase();

  // Handle Download HTML
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

  // Handle Resend Email
  const handleResendEmail = async (invoice: Invoice) => {
    setResending(invoice.id);
    try {
      const res = await fetch(`/api/admin/invoices/${invoice.id}/resend`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Update local state
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === invoice.id
              ? {
                  ...inv,
                  emailStatus: data.emailStatus,
                  emailSentAt: new Date().toISOString(),
                  emailAttempts: data.emailAttempts,
                }
              : inv
          )
        );
        // Update selected modal view if open
        if (selectedInvoice && selectedInvoice.id === invoice.id) {
          setSelectedInvoice((prev) =>
            prev
              ? {
                  ...prev,
                  emailStatus: data.emailStatus,
                  emailSentAt: new Date().toISOString(),
                  emailAttempts: data.emailAttempts,
                }
              : null
          );
        }
        alert(`Receipt resent successfully! Ethereal URL: ${data.previewUrl || "N/A"}`);
      } else {
        throw new Error(data.error || "Failed to resend");
      }
    } catch (err: any) {
      alert(err.message || "Failed to resend email. Please try again.");
    } finally {
      setResending(null);
    }
  };

  // Filtered list
  const filteredInvoices = invoices.filter((inv) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      inv.invoiceNumber.toLowerCase().includes(query) ||
      inv.payment.customer.name.toLowerCase().includes(query) ||
      inv.payment.customer.email.toLowerCase().includes(query) ||
      inv.payment.booking.worker.user.name.toLowerCase().includes(query) ||
      inv.payment.booking.jobDetails.toLowerCase().includes(query);

    const matchesStatus = statusFilter === "ALL" || inv.emailStatus === statusFilter;

    return matchesQuery && matchesStatus;
  });

  // Aggregated Stats
  const totalInvoices = invoices.length;
  const totalVolume = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const totalFees = invoices.reduce((s, i) => s + i.payment.platformFee, 0);
  const sentEmails = invoices.filter((i) => i.emailStatus === "SENT").length;
  const deliveryRate = totalInvoices > 0 ? Math.round((sentEmails / totalInvoices) * 100) : 100;

  return (
    <div className="flex flex-col min-h-full bg-[#F8F9FC] font-sans pb-28">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sticky top-0 z-40 border-b border-[#F0F0F0]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-extrabold text-[15px] border-[2px] border-white shadow-sm">
              {initials}
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-800 tracking-tight">
                Admin Control Panel
              </h1>
              <p className="text-[10px] text-[#E8514A] font-bold uppercase tracking-wider">System Invoices</p>
            </div>
          </div>
          <Link
            href="/profile/settings"
            className="text-[11px] font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full transition-colors"
          >
            ← Settings
          </Link>
        </div>
      </div>

      {/* ── Summary Stats ────────────────────────────────────────────────────── */}
      <div className="px-4 pt-5 pb-2">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Invoices</div>
            <div className="text-2xl font-black text-[#1A2340] mt-1">{totalInvoices}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Platform Volume</div>
            <div className="text-2xl font-black text-emerald-650 mt-1">₹{totalVolume.toFixed(0)}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Fees Collected</div>
            <div className="text-2xl font-black text-[#E8514A] mt-1">₹{totalFees.toFixed(0)}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Email Success</div>
            <div className="text-2xl font-black text-blue-500 mt-1">{deliveryRate}%</div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by INV, customer, worker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
          />
        </div>
        <div className="relative shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer appearance-none pr-8"
          >
            <option value="ALL">All Statuses</option>
            <option value="SENT">Emailed</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
          </select>
          <Filter className="absolute right-3 top-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Invoice List ─────────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 space-y-3">
        {filteredInvoices.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 flex flex-col items-center justify-center border border-slate-100 shadow-sm text-center mt-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <Receipt size={28} className="text-slate-300" />
            </div>
            <h3 className="text-base font-black text-slate-800 mb-1">No Invoices Found</h3>
            <p className="text-xs text-slate-400 font-medium max-w-[200px] leading-relaxed">
              No platform invoices match your current search queries or filters.
            </p>
          </div>
        ) : (
          filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden"
            >
              {/* Card Header */}
              <div className="px-4 py-3.5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                    <FileText size={18} className="text-slate-600" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-850">
                      {invoice.invoiceNumber}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {formatDate(invoice.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-sm font-black text-slate-850">
                    ₹{invoice.totalAmount.toFixed(2)}
                  </span>
                  <EmailStatusBadge status={invoice.emailStatus} />
                </div>
              </div>

              {/* Service Summary & Customer/Worker details */}
              <div className="px-4 pb-3 border-t border-slate-50 text-[11px] text-slate-500 font-semibold space-y-1 pt-2 bg-slate-50/20">
                <div className="flex items-center gap-1.5">
                  <Briefcase size={11} className="text-slate-350" />
                  <span className="line-clamp-1">{invoice.payment.booking.jobDetails}</span>
                </div>
                <div className="flex items-center justify-between gap-1.5 pt-0.5">
                  <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                    <UserIcon size={11} className="text-slate-350" />
                    Cust: {invoice.payment.customer.name} ({invoice.payment.customer.email.split('@')[0]})
                  </span>
                  <span className="text-slate-400 font-medium">
                    Work: {invoice.payment.booking.worker.user.name}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 py-3 border-t border-slate-50 flex gap-2">
                <button
                  onClick={() => setSelectedInvoice(invoice)}
                  className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye size={13} /> Details
                </button>
                <button
                  onClick={() => setViewingHtml(invoice.id)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText size={13} /> View HTML
                </button>
                
                {/* Resend Email Button */}
                <button
                  onClick={() => handleResendEmail(invoice)}
                  disabled={resending === invoice.id}
                  className="w-9 h-9 flex-shrink-0 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50"
                  title="Resend Invoice Email"
                >
                  {resending === invoice.id ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
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
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
                  <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">Total Paid</div>
                  <div className="text-3xl font-black">₹{selectedInvoice.totalAmount.toFixed(2)}</div>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-white/75 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400" />
                      Status: Successful
                    </span>
                    <span>Fee: ₹{selectedInvoice.payment.platformFee.toFixed(2)}</span>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Financial Breakdown</h3>
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Service Cost</span>
                    <span>₹{selectedInvoice.payment.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Platform Service Fee</span>
                    <span>₹{selectedInvoice.payment.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-[#1A2340]">
                    <span>Total Amount</span>
                    <span>₹{selectedInvoice.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Parties details */}
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Transaction Parties</h3>
                  </div>
                  <div className="px-4 py-3 space-y-2 text-xs">
                    <div>
                      <p className="font-bold text-slate-700">Customer (Client):</p>
                      <p className="text-slate-500 font-medium mt-0.5">{selectedInvoice.payment.customer.name}</p>
                      <p className="text-slate-400 font-medium text-[10px]">{selectedInvoice.payment.customer.email}</p>
                    </div>
                    <div className="border-t border-slate-50 pt-2">
                      <p className="font-bold text-slate-700">Worker (Provider):</p>
                      <p className="text-slate-500 font-medium mt-0.5">{selectedInvoice.payment.booking.worker.user.name}</p>
                      <p className="text-slate-400 font-medium text-[10px] capitalize">
                        {selectedInvoice.payment.booking.worker.profession?.join(", ") || "Specialist"} · {selectedInvoice.payment.booking.worker.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Job details */}
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Job Details</h3>
                  </div>
                  <div className="px-4 py-3 space-y-1.5 text-xs text-slate-600">
                    <p className="font-semibold leading-relaxed">{selectedInvoice.payment.booking.jobDetails}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Method: {METHOD_LABELS[selectedInvoice.payment.method ?? ""] ?? "—"}
                    </p>
                    {selectedInvoice.payment.transactionId && (
                      <p className="text-[9px] text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-100 break-all">
                        TXN ID: {selectedInvoice.payment.transactionId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Delivery */}
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Dispatch History</h3>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-350" />
                      <div>
                        <div className="font-semibold text-slate-800">
                          {selectedInvoice.emailStatus === "SENT"
                            ? "Successfully delivered"
                            : selectedInvoice.emailStatus === "FAILED"
                            ? "Delivery failure"
                            : "Queued for sending"}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          Attempts: {selectedInvoice.emailAttempts}
                          {selectedInvoice.emailSentAt && ` · ${formatDate(selectedInvoice.emailSentAt)}`}
                        </div>
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
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye size={13} /> View HTML
                </button>
                
                {/* Resend Action */}
                <button
                  onClick={() => handleResendEmail(selectedInvoice)}
                  disabled={resending === selectedInvoice.id}
                  className="flex-1 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {resending === selectedInvoice.id ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={13} /> Resend Receipt
                    </>
                  )}
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
