"use client";

import { useState } from "react";
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Building, 
  Wallet, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck 
} from "lucide-react";

interface PaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  workerName: string;
  serviceCategory: string;
  serviceCharge: number;
  onSuccess: () => void;
}

export default function PaymentSheet({
  isOpen,
  onClose,
  bookingId,
  workerName,
  serviceCategory,
  serviceCharge,
  onSuccess
}: PaymentSheetProps) {
  const platformFee = 25;
  const totalAmount = serviceCharge + platformFee;

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [processingState, setProcessingState] = useState<"IDLE" | "CREATING" | "PROCESSING" | "SUCCESS">("IDLE");

  const methods = [
    { id: "UPI", name: "UPI (Google Pay, PhonePe)", icon: Smartphone },
    { id: "DEBIT_CARD", name: "Debit / Credit Card", icon: CreditCard },
    { id: "NET_BANKING", name: "Net Banking", icon: Building },
    { id: "WALLET", name: "Wallets", icon: Wallet },
  ];

  if (!isOpen) return null;

  const handlePay = async () => {
    if (!selectedMethod) return;
    
    try {
      setProcessingState("CREATING");
      
      // Step 1: Create Payment Intent
      const createRes = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          amount: serviceCharge,
          method: selectedMethod
        })
      });
      
      const createData = await createRes.json();
      if (!createRes.ok || !createData.success) {
        throw new Error(createData.error || "Failed to initialize payment");
      }

      setProcessingState("PROCESSING");

      // Simulate a real payment gateway delay (e.g., OTP verification, bank processing)
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Step 2: Verify Payment
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: createData.paymentId,
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || "Failed to verify payment");
      }

      setProcessingState("SUCCESS");

      // Hold success screen for a moment before closing
      setTimeout(() => {
        onSuccess();
        onClose();
        setProcessingState("IDLE");
      }, 1500);

    } catch (error) {
      console.error(error);
      alert("Payment failed. Please try again.");
      setProcessingState("IDLE");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#09112A]/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className={`w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${processingState === "IDLE" ? "animate-in slide-in-from-bottom-10" : ""}`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-[#1A2340] tracking-tight">Complete Payment</h2>
            <div className="flex items-center gap-1.5 mt-1 text-[#888BA0]">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-xs font-semibold">100% Secure Transaction</span>
            </div>
          </div>
          {processingState === "IDLE" && (
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {processingState === "IDLE" ? (
          <div className="p-6">
            {/* Bill Summary */}
            <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Payment Summary</h3>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-[#5A6383]">Service Charge</span>
                <span className="text-sm font-bold text-[#1A2340]">₹{serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-[#5A6383]">Platform Fee</span>
                <span className="text-sm font-bold text-[#1A2340]">₹{platformFee.toFixed(2)}</span>
              </div>
              
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-base font-black text-[#1A2340]">Total Amount</span>
                <span className="text-xl font-black text-[#1A2340]">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Select Payment Method</h3>
            <div className="space-y-2.5 mb-8">
              {methods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? "border-[#1A2340] bg-[#1A2340]/5" 
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-[#1A2340] text-white" : "bg-white text-slate-500 shadow-sm border border-slate-100"}`}>
                        <Icon size={18} />
                      </div>
                      <span className={`font-bold text-sm ${isSelected ? "text-[#1A2340]" : "text-slate-600"}`}>
                        {method.name}
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? "border-[#1A2340]" : "border-slate-300"
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-[#1A2340] rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={!selectedMethod}
              className={`w-full py-4 rounded-xl font-black text-white text-base shadow-lg transition-all ${
                selectedMethod 
                  ? "bg-[#1A2340] hover:bg-[#2D3F6A] shadow-[#1A2340]/20 active:scale-[0.98]" 
                  : "bg-slate-300 cursor-not-allowed shadow-none"
              }`}
            >
              Pay ₹{totalAmount.toFixed(2)}
            </button>
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
            {processingState === "SUCCESS" ? (
              <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-[#1A2340] mb-2">Payment Successful!</h3>
                <p className="text-[#888BA0] font-medium">Your transaction has been securely processed.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Loader2 size={48} className="text-[#1A2340] animate-spin mb-6" />
                <h3 className="text-lg font-bold text-[#1A2340] mb-2">
                  {processingState === "CREATING" ? "Initializing Gateway..." : "Processing Payment..."}
                </h3>
                <p className="text-sm text-[#888BA0] font-medium max-w-[250px]">
                  Please do not close this window or press the back button.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
