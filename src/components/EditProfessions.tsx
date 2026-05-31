"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Zap, Sparkles, Wind, Paintbrush, Hammer, Bug, Scissors, Briefcase, Check, X, Loader2 } from "lucide-react";

const PROFESSIONS = [
  { name: "Plumbing", icon: Wrench },
  { name: "Electrical", icon: Zap },
  { name: "Cleaning", icon: Sparkles },
  { name: "AC Repair", icon: Wind },
  { name: "Painting", icon: Paintbrush },
  { name: "Carpentry", icon: Hammer },
  { name: "Pest Control", icon: Bug },
  { name: "Salon", icon: Scissors },
  { name: "Others", icon: Briefcase },
];

interface EditProfessionsProps {
  initialProfessions: string[];
  initialCustomProfession: string;
}

export default function EditProfessions({
  initialProfessions = [],
  initialCustomProfession = "",
}: EditProfessionsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>(initialProfessions);
  const [customProfession, setCustomProfession] = useState(initialCustomProfession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleProfession = (name: string) => {
    setSelectedProfessions((prev) => {
      if (prev.includes(name)) {
        const next = prev.filter((p) => p !== name);
        if (name === "Others") {
          setCustomProfession("");
        }
        return next;
      } else {
        return [...prev, name];
      }
    });
  };

  const handleSave = async () => {
    if (selectedProfessions.length === 0) {
      setError("Please select at least one profession.");
      return;
    }
    if (selectedProfessions.includes("Others") && !customProfession.trim()) {
      setError("Please enter your custom profession.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profession: selectedProfessions,
          customProfession: selectedProfessions.includes("Others") ? customProfession.trim() : "",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update professions");
      }

      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Current Professions Display */}
      <div className="mt-2 bg-white p-4 border-b border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-extrabold text-[15px] text-[#1A2340]">My Professions</h3>
          <button 
            type="button"
            onClick={() => {
              setSelectedProfessions(initialProfessions);
              setCustomProfession(initialCustomProfession);
              setIsOpen(true);
            }}
            className="text-xs font-bold text-[#E8514A] hover:opacity-85 active:scale-95 transition-all"
          >
            Edit
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {initialProfessions.length > 0 ? (
            initialProfessions.map((prof) => {
              const displayVal = prof === "Others" && initialCustomProfession ? initialCustomProfession : prof;
              return (
                <span 
                  key={prof} 
                  className="px-3 py-1.5 bg-[#FFF5F5] text-[#E8514A] font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm border border-[#E8514A10]"
                >
                  {displayVal}
                </span>
              );
            })
          ) : (
            <span className="text-xs text-slate-400 font-semibold italic">No professions selected yet.</span>
          )}
        </div>
      </div>

      {/* Edit Professions Slide-up Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#F7F7F8] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="font-extrabold text-[#1A2340] text-[16px]">Edit Professions</h3>
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 border border-slate-200/60 shadow-sm transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 font-semibold">
                  {error}
                </div>
              )}

              <p className="text-[13px] text-[#888BA0] font-medium leading-relaxed">
                Select one or more professions. These will define what services you offer and let clients search for you.
              </p>

              <div className="grid grid-cols-3 gap-3">
                {PROFESSIONS.map((p) => {
                  const Icon = p.icon;
                  const isSelected = selectedProfessions.includes(p.name);
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handleToggleProfession(p.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border aspect-square relative transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 group shadow-[0_4px_12px_rgba(0,0,0,0.02)] ${
                        isSelected
                          ? "bg-gradient-to-br from-[#E8514A] to-[#F4978E] border-transparent shadow-lg shadow-[#E8514A]/20 text-white"
                          : "bg-white border-slate-100 hover:border-[#E8514A]/25 text-slate-600 hover:shadow-md"
                      }`}
                    >
                      {/* Checkmark Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-white text-[#E8514A] rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-200">
                          <Check size={11} className="stroke-[3]" />
                        </div>
                      )}
                      
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        isSelected ? "bg-white/15 text-white" : "bg-[#E8514A]/5 text-[#E8514A] group-hover:bg-[#E8514A]/10"
                      }`}>
                        <Icon size={22} className="stroke-[1.75]" />
                      </div>
                      
                      <span className={`text-[11px] font-bold text-center mt-2.5 leading-tight truncate w-full transition-colors duration-300 ${
                        isSelected ? "text-white" : "text-slate-700 group-hover:text-[#E8514A]"
                      }`}>
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedProfessions.includes("Others") && (
                <div className="space-y-1.5 mt-4 animate-in fade-in slide-in-from-top-2 duration-200 bg-white p-4 rounded-2xl border border-slate-100">
                  <label className="text-xs font-semibold text-slate-500">Your Custom Profession</label>
                  <input
                    type="text"
                    value={customProfession}
                    onChange={(e) => setCustomProfession(e.target.value)}
                    placeholder="Enter your profession"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#F7F7F8] focus:outline-none focus:ring-2 focus:ring-[#E8514A]/20 focus:border-[#E8514A] transition-all text-sm text-slate-800"
                    required
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="flex-1 py-3 bg-[#E8514A] hover:bg-[#E8514A]/90 text-white font-bold rounded-xl text-sm transition-colors active:scale-[0.98] shadow-md shadow-[#E8514A]/20 flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
