"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Search, Star, ShieldCheck, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getDistance } from "@/utils/distance";

interface ServicesClientProps {
  initialWorkers: any[];
  selectedCategory: string;
  searchQuery: string;
}

const CATEGORIES = [
  "All",
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Painting",
  "Carpentry",
  "AC Repair",
  "Pest Control",
  "Salon",
  "Appliance Repair",
  "Home Maintenance"
];

// Map filter categories to DB profession tags
const CATEGORY_MAP: Record<string, string[]> = {
  "Plumbing": ["plumber", "plumbing"],
  "Electrical": ["electrician", "electrical", "wiring"],
  "Cleaning": ["cleaning", "house cleaning", "maid", "cleaner"],
  "Painting": ["painter", "painting"],
  "Carpentry": ["carpenter", "carpentry"],
  "AC Repair": ["ac repair", "ac technician", "ac maintenance", "air conditioner"],
  "Pest Control": ["pest control", "fumigation"],
  "Salon": ["salon", "barber", "hairdresser", "beautician"],
  "Appliance Repair": ["appliance repair", "fridge repair", "washing machine repair"],
  "Home Maintenance": ["home maintenance", "handyman", "general worker"]
};

export default function ServicesClient({ initialWorkers, selectedCategory, searchQuery }: ServicesClientProps) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [search, setSearch] = useState(searchQuery);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Geolocation permission denied/failed. Falling back to default location.");
        }
      );
    }
  }, []);

  // Filter and sort workers
  const processedWorkers = useMemo(() => {
    // Default location: Chennai center
    const defaultLat = 13.0827;
    const defaultLng = 80.2707;
    const customerLat = userCoords?.lat || defaultLat;
    const customerLng = userCoords?.lng || defaultLng;

    const workersWithDistance = initialWorkers.map(worker => {
      const wLat = worker.locationLat || worker.location?.lat || defaultLat;
      const wLng = worker.locationLng || worker.location?.lng || defaultLng;
      const distance = getDistance(customerLat, customerLng, wLat, wLng);
      return { ...worker, distance };
    });

    // 1. Filter
    const filtered = workersWithDistance.filter(worker => {
      // Category filter
      if (activeCategory !== "All") {
        const targetTags = CATEGORY_MAP[activeCategory] || [activeCategory.toLowerCase()];
        const matchesCategory = worker.profession.some((p: string) => 
          targetTags.some(tag => p.toLowerCase().includes(tag))
        ) || (worker.category?.name && targetTags.some(tag => worker.category.name.toLowerCase().includes(tag)));
        
        if (!matchesCategory) return false;
      }

      // Search query filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = worker.user.name.toLowerCase().includes(query);
        const matchesProfession = worker.profession.some((p: string) => p.toLowerCase().includes(query));
        const matchesSkills = worker.skills.some((s: string) => s.toLowerCase().includes(query));
        
        if (!matchesName && !matchesProfession && !matchesSkills) return false;
      }

      return true;
    });

    // 2. Sort by: 1) Distance, 2) Availability (isOnline), 3) Rating
    return filtered.sort((a, b) => {
      if (Math.abs(a.distance - b.distance) > 0.1) {
        return a.distance - b.distance;
      }
      if (a.isOnline !== b.isOnline) {
        return a.isOnline ? -1 : 1;
      }
      return b.rating - a.rating;
    });
  }, [initialWorkers, activeCategory, search, userCoords]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 pb-20">
      
      {/* 1. Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center justify-between shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <Link 
            href="/customer/dashboard" 
            className="p-2 -ml-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-xl transition-all"
          >
            <ArrowLeft size={20} className="stroke-[2.5]" />
          </Link>
          <div>
            <h1 className="text-base font-black text-slate-800">Booking Services</h1>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Hire Informal Workers</p>
          </div>
        </div>

        {/* View bookings history */}
        <Link 
          href="/customer/jobs" 
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-2xl text-xs font-black transition-all"
        >
          <Briefcase size={14} className="stroke-[2.5]" />
          Bookings
        </Link>
      </header>

      {/* 2. Search & Filter Bar */}
      <div className="px-5 py-4 bg-white border-b border-slate-100 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search for workers or services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50 rounded-2xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 font-semibold text-slate-800 shadow-inner"
          />
        </div>

        {/* Category Pills (Section 1) */}
        <div>
          <h2 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 px-1">Service Categories</h2>
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-5 px-5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                  activeCategory === cat
                    ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                    : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Workers List (Section 2 - Nearby Workers) */}
      <main className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="flex justify-between items-center mb-2 px-1">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-emerald-500 rounded-full inline-block"></span>
            Nearby Workers
          </h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase">
            {userCoords ? "📍 Using Live GPS" : "📍 Chennai (Default)"}
          </span>
        </div>

        {processedWorkers.length > 0 ? (
          processedWorkers.map((worker) => (
            <div 
              key={worker.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 hover:border-primary/20 hover:shadow-md hover:shadow-slate-100/50 transition-all duration-300 flex flex-col gap-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Profile Image with Online Indicator */}
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center font-bold text-2xl shadow-inner relative flex-shrink-0">
                    {worker.user.image ? (
                      <Image src={worker.user.image} alt={worker.user.name} fill className="object-cover rounded-2xl" />
                    ) : (
                      <span>{worker.user.name.substring(0, 1)}</span>
                    )}
                    {worker.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[3px] border-white shadow-sm"></span>
                    )}
                  </div>

                  {/* Worker Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-slate-800 text-sm leading-tight truncate">
                        {worker.user.name}
                      </h3>
                      <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />
                    </div>
                    
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate">
                      {worker.profession[0] || worker.category?.name || "Professional"}
                    </p>

                    <div className="flex items-center gap-1 text-[10px] font-extrabold text-amber-500 mt-1">
                      <Star size={11} className="fill-amber-500 stroke-[1.5]" />
                      <span>{worker.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-semibold">({worker.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Hourly Rate & Distance */}
                <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
                  <div>
                    <span className="text-sm font-black text-slate-800 block">₹{worker.hourlyRate}</span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Per Hour</span>
                  </div>
                  
                  <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-200/50">
                    🛣️ {worker.distance.toFixed(1)} km away
                  </span>
                </div>
              </div>

              {/* Quick Details (Experience, Description, Status) */}
              <div className="text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                <p className="font-semibold text-slate-600 mb-1">💼 {worker.experience} Years Experience</p>
                <p className="line-clamp-2 text-slate-400 font-medium">{worker.user.name} is a certified expert providing trusted services with escrow security protection.</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-1">
                <Link 
                  href={`/customer/services/workers/${worker.id}`}
                  className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-black rounded-2xl border border-slate-100 text-center transition-all active:scale-[0.98]"
                >
                  View Profile
                </Link>
                <Link 
                  href={`/customer/services/book/${worker.id}?category=${encodeURIComponent(activeCategory === "All" ? (worker.profession[0] || "General") : activeCategory)}`}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-2xl text-center shadow-md shadow-emerald-500/10 transition-all active:scale-[0.98]"
                >
                  Hire
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-800 mb-1">No professionals found</h4>
            <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed">
              Try adjusting your filters or search term to find available workers.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
