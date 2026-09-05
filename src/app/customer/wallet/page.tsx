"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Wallet, Plus, CreditCard, ShieldCheck, ArrowUpRight, ArrowDownLeft, X, Loader2, DollarSign, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomerSidebarDrawer from "@/components/CustomerSidebarDrawer";

interface Transaction {
  id: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  description: string;
  createdAt: string;
}

export default function WalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);

  // Add funds form state
  const [addAmount, setAddAmount] = useState("1000");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [addingFunds, setAddingFunds] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchWallet = async () => {
    try {
      const res = await fetch("/api/wallet");
      const data = await res.json();
      if (data.success) {
        setBalance(data.balance);
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Failed to load wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleAddFundsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addAmount || Number(addAmount) <= 0) return;

    setAddingFunds(true);
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(addAmount), method: paymentMethod })
      });
      const data = await res.json();
      if (data.success) {
        setBalance(data.balance);
        setTransactions(data.transactions);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsAddFundsOpen(false);
        }, 1500);
      } else {
        alert(data.error || "Failed to add funds");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setAddingFunds(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50 pb-20 font-sans">
      
      {/* 1. Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center justify-between shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.back()} 
            className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border-none bg-transparent"
            title="Go Back"
          >
            <ArrowLeft size={20} className="stroke-[2.5]" />
          </button>
          <CustomerSidebarDrawer />
          <div>
            <h1 className="text-base font-black text-slate-800">My Wallet</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Balances & Transactions</p>
          </div>
        </div>
      </header>

      {/* 2. Wallet Core Card */}
      <main className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 size={32} className="text-primary animate-spin mb-3" />
            <p className="text-xs font-bold">Loading wallet details...</p>
          </div>
        ) : (
          <>
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[180px]">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full pointer-events-none"></div>
              
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Wallet size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">WBSP Escrow Wallet</span>
                </div>
                <ShieldCheck className="text-emerald-400 stroke-[2.5]" size={22} />
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Balance</span>
                <h2 className="text-3xl font-black tracking-tight mt-1">₹{balance.toFixed(2)}</h2>
              </div>

              <div className="flex justify-between items-end border-t border-white/15 pt-4 mt-2">
                <span className="text-[9px] font-semibold text-slate-400 tracking-wider">100% SECURE ESCROW PROTECTION</span>
                <button 
                  onClick={() => setIsAddFundsOpen(true)}
                  className="bg-white hover:bg-slate-100 text-slate-900 text-[10px] font-black px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} className="stroke-[3]" />
                  Add Funds
                </button>
              </div>
            </div>

            {/* Transactions Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 px-1">
                <span className="w-1.5 h-3 bg-primary rounded-full inline-block"></span>
                Transaction History
              </h3>

              <div className="space-y-3">
                {transactions.length > 0 ? (
                  transactions.map((tx) => {
                    const isCredit = tx.type === "CREDIT";
                    const formattedDate = new Date(tx.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    });

                    return (
                      <div 
                        key={tx.id}
                        className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
                            isCredit 
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                              : "bg-red-50 text-red-600 border-red-100"
                          }`}>
                            {isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight">{tx.description}</h4>
                            <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{formattedDate}</span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className={`text-[13px] font-black block ${
                            isCredit ? "text-emerald-600" : "text-slate-800"
                          }`}>
                            {isCredit ? "+" : "-"} ₹{tx.amount}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                    <p className="text-xs text-slate-400 font-bold">No transactions found.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

      </main>

      {/* 3. Add Funds Modal Dialog */}
      {isAddFundsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#09112A]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-lg font-black text-slate-800">Add Wallet Funds</h2>
                <div className="flex items-center gap-1 mt-0.5 text-slate-400">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Secured Simulated Checkout</span>
                </div>
              </div>
              {!addingFunds && !success && (
                <button 
                  onClick={() => setIsAddFundsOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {success ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6 relative">
                  <Check className="text-emerald-500 stroke-[3]" size={32} />
                  <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-25"></div>
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-1">Funds Added!</h3>
                <p className="text-xs text-slate-400 font-semibold">Your wallet balance has been updated.</p>
              </div>
            ) : (
              <form onSubmit={handleAddFundsSubmit} className="p-6 space-y-5">
                {/* Amount selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Select Amount (₹)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["500", "1000", "2000"].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAddAmount(val)}
                        className={`py-3.5 rounded-2xl border-2 text-xs font-black transition-all ${
                          addAmount === val
                            ? "border-slate-800 bg-slate-50 text-slate-800"
                            : "border-slate-100 hover:border-slate-200 text-slate-500"
                        }`}
                      >
                        ₹{val}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom input */}
                  <div className="relative mt-2">
                    <input
                      type="number"
                      required
                      min="100"
                      placeholder="Or enter custom amount (Min: ₹100)"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      className="block w-full px-4 py-3.5 border border-slate-200 bg-slate-50 rounded-2xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "UPI", name: "UPI App" },
                      { id: "Card", name: "Credit / Debit Card" }
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`py-3.5 rounded-2xl border-2 text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                          paymentMethod === method.id
                            ? "border-slate-800 bg-slate-50 text-slate-800"
                            : "border-slate-100 hover:border-slate-200 text-slate-500"
                        }`}
                      >
                        <CreditCard size={14} />
                        {method.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={addingFunds}
                  className="w-full mt-4 bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white rounded-2xl text-xs font-black py-4 uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-slate-800/20 cursor-pointer"
                >
                  {addingFunds ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Connecting Payment Gateway...
                    </>
                  ) : (
                    "Authorize Deposit"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
