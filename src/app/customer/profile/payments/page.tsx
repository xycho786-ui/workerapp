"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2, Clock, ShieldCheck, Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Payment {
  id: string;
  amount: number;
  platformFee: number;
  totalAmount: number;
  status: string;
  method: string;
  transactionId: string;
  createdAt: string;
  booking: {
    id: string;
    jobDetails: string;
  };
  worker: {
    user: {
      name: string;
    }
  };
  invoice: {
    invoiceNumber: string;
  } | null;
}

export default function CustomerPaymentHistory() {
  const { t } = useLanguage();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch("/api/payments/history?type=customer");
        const data = await res.json();
        if (data.success) {
          setPayments(data.payments);
        }
      } catch (error) {
        console.error("Failed to load payments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pb-28">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sticky top-0 z-40 border-b border-[#F0F0F0] flex items-center gap-3">
        <Link href="/customer/profile" className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-black text-[#1A2340] tracking-tight">Payment History</h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 mt-12 text-center text-slate-500">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-[#E8514A] rounded-full animate-spin mb-4"></div>
          <p className="font-bold text-sm">Loading transactions...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-6 mt-12">
          <div className="w-24 h-24 bg-[#FFF5F5] rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">💳</span>
          </div>
          <h3 className="text-lg font-extrabold text-[#1A2340] mb-2">No Payments Yet</h3>
          <p className="text-[13px] text-[#888BA0] max-w-[250px] leading-relaxed font-medium">
            You haven't made any payments on the platform yet.
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-4 mt-2">
          {payments.map((payment) => {
            const date = new Date(payment.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric"
            });
            
            const isSuccess = payment.status === "SUCCESSFUL";

            return (
              <div 
                key={payment.id}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.01)] relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 ${isSuccess ? "bg-emerald-500" : "bg-amber-500"}`}></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSuccess ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                      {isSuccess ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#1A2340] text-[15px] flex items-center gap-1.5">
                        {payment.worker.user.name}
                        {isSuccess && <ShieldCheck size={12} className="text-emerald-500" />}
                      </h4>
                      <p className="text-[11px] text-[#888BA0] font-semibold mt-0.5">
                        {payment.booking.jobDetails.split(":")[0]} • {date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-[#1A2340] text-lg leading-tight">
                      ₹{payment.totalAmount.toFixed(2)}
                    </span>
                    <span className={`text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full inline-block mt-1 border ${
                      isSuccess ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-500 flex items-center gap-2">
                    <span className="uppercase tracking-wider">Via {payment.method || "System"}</span>
                    {payment.transactionId && <span className="opacity-50">| TXN: {payment.transactionId.substring(0, 8)}...</span>}
                  </div>
                  
                  {isSuccess && payment.invoice && (
                    <Link 
                      href={`/invoice/${payment.invoice.invoiceNumber}`}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#E8514A] hover:text-[#D1403A] bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-colors active:scale-95"
                    >
                      <FileText size={13} />
                      Receipt
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
