"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet, TrendingUp, Calendar, CheckCircle2, Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Payment {
  id: string;
  amount: number;
  platformFee: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  customer: {
    name: string;
  };
  booking: {
    jobDetails: string;
  };
}

interface EarningsData {
  earningsToday: number;
  earningsWeek: number;
  earningsMonth: number;
  earningsLifetime: number;
  recentPayments: Payment[];
}

export default function WorkerEarningsDashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEarnings() {
      try {
        const res = await fetch("/api/worker/earnings");
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to load earnings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-12 text-slate-500">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#00A87A] rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-sm">Loading earnings data...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pb-28">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sticky top-0 z-40 border-b border-[#F0F0F0] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/worker/profile" className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-black text-[#1A2340] tracking-tight">Earnings Dashboard</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 mt-2">
        {/* Main Stats Card */}
        <div className="bg-[#1A2340] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-48 bg-gradient-to-br from-[#00A87A]/30 to-transparent rounded-full filter blur-2xl"></div>
          
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={16} className="text-[#8A9BBF]" />
            <span className="text-[11px] text-[#8A9BBF] font-bold uppercase tracking-wider">Lifetime Earnings</span>
          </div>
          
          <div className="text-4xl font-black tracking-tight mb-8">
            ₹{data.earningsLifetime.toFixed(2)}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-2xl p-3 border border-white/5 backdrop-blur-sm">
              <span className="text-[10px] text-[#8A9BBF] font-semibold uppercase tracking-wider block mb-1">Today</span>
              <span className="text-base font-extrabold text-white block">₹{data.earningsToday.toFixed(2)}</span>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 border border-white/5 backdrop-blur-sm">
              <span className="text-[10px] text-[#8A9BBF] font-semibold uppercase tracking-wider block mb-1">This Week</span>
              <span className="text-base font-extrabold text-white block">₹{data.earningsWeek.toFixed(2)}</span>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 border border-white/5 backdrop-blur-sm">
              <span className="text-[10px] text-[#8A9BBF] font-semibold uppercase tracking-wider block mb-1">This Month</span>
              <span className="text-base font-extrabold text-[#00A87A] block">₹{data.earningsMonth.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Recent Payouts */}
        <div>
          <h3 className="text-sm font-extrabold text-[#1A2340] uppercase tracking-wider px-1 mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#00A87A]" />
            Recent Payments
          </h3>

          {data.recentPayments.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wallet size={24} className="text-slate-300" />
              </div>
              <p className="text-sm font-bold text-[#1A2340]">No payments yet</p>
              <p className="text-xs text-slate-500 mt-1">Complete jobs to start earning.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentPayments.map(payment => (
                <div key={payment.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1A2340] text-sm">{payment.customer.name}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5 max-w-[150px] truncate">
                        {payment.booking.jobDetails}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-[#00A87A] text-base">+₹{payment.amount.toFixed(2)}</span>
                    <span className="text-[9px] text-slate-400 font-bold mt-0.5 block flex items-center justify-end gap-1">
                      <Calendar size={10} />
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
