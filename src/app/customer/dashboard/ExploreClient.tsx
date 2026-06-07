"use client";

import { useState, useEffect } from "react";
import { Search, Mic, ChevronRight, Wrench, Zap, Sparkles, Wind, Paintbrush, Hammer, Bug, Scissors, Star, Briefcase, MapPin, X, ShieldCheck, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=300&h=200";

const CATEGORIES = [
  { name: "Plumbing", icon: Wrench },
  { name: "Electrical", icon: Zap },
  { name: "Cleaning", icon: Sparkles },
  { name: "AC Repair", icon: Wind },
  { name: "Painting", icon: Paintbrush },
  { name: "Carpentry", icon: Hammer },
  { name: "Pest Control", icon: Bug },
  { name: "Salon", icon: Scissors },
];

const FILTERS = ["Nearby", "Top Rated", "Budget", "Specialist", "Available Now", "Verified"];

export default function ExploreClient({ initialWorkers, initialSearch }: { initialWorkers: any[], initialSearch: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isSearching, setIsSearching] = useState(!!initialSearch);
  const [activeFilter, setActiveFilter] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set("search", searchQuery);
      } else {
        params.delete("search");
      }
      // Use replace instead of push to avoid breaking the back button history stack
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, router, searchParams]);

  const handleFocus = () => {
    setIsSearching(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    // We intentionally do NOT set setIsSearching(false) here, 
    // so the user stays in the search results view even with an empty query.
  };

  const closeSearchLayout = () => {
    setIsSearching(false);
    setSearchQuery("");
    setActiveFilter("");
  };

  const startVoiceSearch = () => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser does not support voice search.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsSearching(true);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'aborted') {
        console.log("Speech recognition aborted");
      } else {
        console.error("Speech recognition error", event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition", e);
      setIsListening(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Search Bar - Sticky */}
      <div className="sticky top-0 z-30 bg-[#F5F5F7] px-5 py-4 transition-all duration-300">
        <div className="relative flex items-center">
          {isSearching ? (
            <button onClick={closeSearchLayout} className="absolute left-3 p-1 text-slate-400 hover:text-slate-800 transition-colors z-10">
              <ChevronRight size={22} className="rotate-180" />
            </button>
          ) : (
            <div className="absolute left-4 text-slate-400">
              <Search size={20} />
            </div>
          )}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
            placeholder={t("explore.searchPlaceholder", "Try: Fix my leaky tap")}
            className={`w-full ${isSearching ? 'pl-10' : 'pl-11'} pr-20 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 font-medium text-slate-800 shadow-sm shadow-slate-100`}
          />
          {searchQuery && (
            <button onClick={clearSearch} className="absolute right-12 p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={18} />
            </button>
          )}
          <button 
            type="button" 
            onClick={startVoiceSearch}
            className={`absolute right-2 p-2 rounded-xl transition-all shadow-sm active:scale-95 ${
              isListening 
                ? 'bg-red-500 text-white shadow-red-500/30 animate-pulse' 
                : 'bg-primary text-white hover:opacity-90 shadow-primary/20'
            }`}
          >
            <Mic size={18} />
          </button>
        </div>
        
        {/* Filter Chips - Show only when searching */}
        <div className={`transition-all duration-300 overflow-hidden ${isSearching ? 'max-h-20 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(activeFilter === filter ? "" : filter)}
                className={`snap-start whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 border ${
                  activeFilter === filter 
                    ? 'bg-slate-800 text-white border-slate-800 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {activeFilter === filter ? `${t(`explore.filters.${filter}`, filter)} \u00D7` : t(`explore.filters.${filter}`, filter)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-5 pt-2 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {!isSearching ? (
          /* Default Explore View */
          <div className="space-y-8">
            {/* Service Categories Grid */}
            <div>
              <h3 className="text-[17px] font-bold text-slate-800 mb-4">{t("explore.helpWith", "What do you need help with?")}</h3>
              <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                {CATEGORIES.map((service, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      router.push(`/customer/request?category=${service.name}`);
                    }} 
                    className="flex flex-col items-center gap-2.5 group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:shadow-md transition-all group-active:scale-95">
                      <service.icon size={26} className="stroke-[1.5]" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 text-center">{t(`explore.categories.${service.name}`, service.name)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Promotional Banner Section */}
            <div>
              <h3 className="text-[17px] font-bold text-slate-800 mb-4">{t("explore.seasonalServices", "Seasonal Services")}</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide snap-x">
                {/* Banner 1 */}
                <div className="min-w-[280px] bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex-shrink-0 snap-start">
                  <div className="h-32 w-full bg-slate-200 relative">
                    <Image src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=400&h=200" alt="Roof Checkup" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-sm">
                      {t("explore.limitedOffer", "Limited Offer")}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-slate-800 mb-1">{t("explore.roofCheckup", "Monsoon Roof Leak Checkup")}</h4>
                    <p className="text-xs text-slate-500 font-medium">{t("explore.startingFrom", "Starting from $49")}</p>
                  </div>
                </div>
                {/* Banner 2 */}
                <div className="min-w-[280px] bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex-shrink-0 snap-start">
                  <div className="h-32 w-full relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F8AD9D] to-primary" />
                    <div className="absolute top-3 left-3 bg-white text-primary text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-sm">
                      {t("explore.sale", "Sale")}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <Wind size={80} className="text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-slate-800 mb-1">{t("explore.acService", "AC Service & Maintenance")}</h4>
                    <p className="text-xs text-slate-500 font-medium">{t("explore.flatOff", "Flat 20% off")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Search Results View */
          <div className="space-y-4">
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-[13px] font-medium text-slate-600">
                {initialWorkers.length} {t("explore.professionalsFound", "Professionals found in")} Coimbatore, TN
              </h3>
              <button className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-primary transition-colors">
                <SlidersHorizontal size={12} /> {t("explore.relevance", "Relevance")}
              </button>
            </div>

            {initialWorkers.map((worker: any) => (
              <div key={worker.id} className="bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                
                {/* Worker Result Card - Image Section */}
                <div className="h-44 w-full relative bg-slate-100">
                  <Image src={FALLBACK_IMAGE} alt={worker.user.name} fill className="object-cover" />
                  {/* Verified Badge Overlay */}
                  <div className="absolute bottom-3 right-3 bg-[#10b981] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide flex items-center gap-1 shadow-md">
                    <ShieldCheck size={12} /> {t("explore.verified", "Verified")}
                  </div>
                </div>

                {/* Card Content Section */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-800 text-[18px]">{worker.user.name}</h4>
                    <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs font-bold flex-shrink-0">
                      <Star size={12} className="fill-primary" /> {worker.rating || "4.9"}
                    </div>
                  </div>
                  
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                    {t(`explore.categories.${worker.category?.name}`, worker.category?.name) || t("explore.expertPro", "Expert Professional")}
                  </p>
                  
                  <div className="flex items-center gap-4 text-[12px] text-slate-500 font-medium mb-5">
                    <div className="flex items-center gap-1.5">
                      <Briefcase size={14} className="text-slate-400" />
                      {worker.experience || "10+"} {t("explore.years", "Years")}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-400" />
                      {t("explore.away", "1.2 km away")}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[13px] text-slate-500 font-medium">{t("explore.from", "From")}</span>
                      <p className="text-xl font-bold text-slate-800">${worker.hourlyRate || "55"}</p>
                    </div>
                    <Link href={`/jobs/${worker.id}`} className="font-bold text-white bg-primary hover:opacity-90 px-6 py-3 rounded-xl transition-colors active:scale-95 shadow-sm shadow-primary/20 text-sm">
                      {t("explore.bookNow", "Book Now")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {initialWorkers.length === 0 && (
              <div className="text-center py-16 bg-white rounded-[20px] border border-slate-100 shadow-sm mt-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-slate-400" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">{t("explore.noProfessionals", "No professionals found")}</h4>
                <p className="text-sm text-slate-500 max-w-[250px] mx-auto leading-relaxed">
                  {t("explore.adjustFilters", "Try adjusting your filters or search term to find more results.")}
                </p>
                <button onClick={clearSearch} className="mt-6 text-sm font-bold text-primary hover:text-primary/80">
                  {t("explore.clearSearch", "Clear Search")}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
