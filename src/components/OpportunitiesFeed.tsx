"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Zap, Sparkles, Wind, Paintbrush, Hammer, Bug, Scissors, Briefcase, Loader2, DollarSign } from "lucide-react";

const CATEGORY_ICONS: Record<string, any> = {
  'Plumbing': Wrench,
  'Electrical': Zap,
  'Cleaning': Sparkles,
  'AC Repair': Wind,
  'Painting': Paintbrush,
  'Carpentry': Hammer,
  'Pest Control': Bug,
  'Salon': Scissors,
};

interface Opportunity {
  id: string;
  customerId: string;
  category: string;
  description: string;
  budget: number | null;
  createdAt: string;
  customer: {
    name: string;
  };
}

interface OpportunitiesFeedProps {
  initialOpportunities: Opportunity[];
}

export default function OpportunitiesFeed({ initialOpportunities = [] }: OpportunitiesFeedProps) {
  const router = useRouter();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const handleAccept = async (requestId: string) => {
    setAcceptingId(requestId);
    try {
      const res = await fetch("/api/requests/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to accept job");
      }

      router.refresh();
    } catch (error: any) {
      alert(error.message || "Something went wrong while accepting the job.");
    } finally {
      setAcceptingId(null);
    }
  };

  if (initialOpportunities.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center text-center">
        <div className="text-3xl mb-2">🔍</div>
        <div className="text-[14px] font-bold text-[#1A2340]">No jobs available yet</div>
        <div className="text-[13px] text-[#888BA0] mt-1">We'll notify you when new opportunities appear in your area.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {initialOpportunities.map((op) => {
        const Icon = CATEGORY_ICONS[op.category] || Briefcase;
        const timeAgo = "Just now"; // Simple indicator, can be expanded to dynamic time ago if needed
        const isAccepting = acceptingId === op.id;

        return (
          <div key={op.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Icon size={20} className="stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="font-bold text-[15px] text-[#1A2340]">{op.category}</h4>
                  <p className="text-[11px] text-[#888BA0] font-semibold">Posted by {op.customer.name}</p>
                </div>
              </div>
              
              {op.budget !== null && (
                <div className="text-right">
                  <span className="text-[10px] text-[#888BA0] font-bold block uppercase tracking-wide">Budget</span>
                  <span className="text-base font-extrabold text-[#E8514A]">₹{op.budget}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
              {op.description}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-[11px] text-slate-400 font-semibold">{timeAgo}</span>
              <button
                type="button"
                onClick={() => handleAccept(op.id)}
                disabled={acceptingId !== null}
                className="bg-primary hover:bg-primary-light text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm shadow-primary/20 disabled:opacity-75 flex items-center gap-1.5 active:scale-[0.98]"
              >
                {isAccepting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Accepting...
                  </>
                ) : (
                  "Accept Opportunity"
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
