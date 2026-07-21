"use client";

import { useState } from "react";
import { ArrowLeft, HelpCircle, ChevronDown, Send, MessageSquare, Check, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "How does the escrow payments model work?",
    a: "When you book a service or purchase a product, your funds are secured in our platform escrow. They are only transferred to the worker or seller once you verify completion."
  },
  {
    q: "How do I verify a worker checking in?",
    a: "You will find a 6-digit OTP verification code on your active booking card. Share this code with the worker when they arrive at your location to confirm check-in."
  },
  {
    q: "What is the platform fee?",
    a: "We charge a small, fixed ₹25.00 platform fee on bookings and orders to support escrow safety checks, customer support, and payment security infrastructure."
  },
  {
    q: "How can I request a refund?",
    a: "If a job is cancelled or a product delivery fails, you can request a refund directly from the jobs dashboard. Your funds will be returned to your Wallet instantly."
  }
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Ticket form state
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Technical");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setSubject("");
      setMessage("");
      setTimeout(() => setSuccess(false), 2000);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50 pb-20 font-sans">
      
      {/* 1. Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center gap-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
        <Link 
          href="/customer/profile" 
          className="p-2 -ml-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-xl transition-all"
        >
          <ArrowLeft size={20} className="stroke-[2.5]" />
        </Link>
        <div>
          <h1 className="text-base font-black text-slate-800">Support Center</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Help & FAQs</p>
        </div>
      </header>

      {/* 2. FAQs Section */}
      <main className="flex-1 overflow-y-auto p-5 space-y-6">
        
        <div>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5 px-1">
            <span className="w-1.5 h-3 bg-primary rounded-full inline-block"></span>
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div 
                  key={i}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-800 leading-snug">{faq.q}</span>
                    <ChevronDown 
                      size={16} 
                      className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} 
                    />
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-500 leading-relaxed font-semibold border-t border-slate-50/50 bg-slate-50/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Ticket Form Section */}
        <div>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5 px-1">
            <span className="w-1.5 h-3 bg-primary rounded-full inline-block"></span>
            Submit a Help Ticket
          </h3>

          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-5">
            {success ? (
              <div className="py-6 text-center">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-emerald-500 stroke-[3]" />
                </div>
                <h4 className="text-sm font-extrabold text-slate-800 mb-1">Ticket Submitted!</h4>
                <p className="text-xs text-slate-400 font-semibold max-w-[200px] mx-auto leading-relaxed">
                  We've received your inquiry. A support representative will email you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Briefly state your concern..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-2xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all font-semibold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    <option value="Technical">Technical Support</option>
                    <option value="Billing">Billing & Wallet</option>
                    <option value="Account">Account Security</option>
                    <option value="Feedback">Feedback & Suggestions</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Message Details</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your issue or question in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-2xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all font-semibold text-slate-800 resize-none shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white rounded-2xl text-xs font-black py-4 uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-slate-800/10 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Submitting inquiry...
                    </>
                  ) : (
                    <>
                      <Send size={12} />
                      Send Help Message
                    </>
                  )}
                </button>

              </form>
            )}
          </div>
        </div>

      </main>

    </div>
  );
}
