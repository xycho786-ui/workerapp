"use client";

import { useState } from "react";
import { Search, Bell, User as UserIcon, Wrench, Zap, Sparkles, Paintbrush, ShieldCheck, Star, ArrowRight, Briefcase, Store, MessageCircle, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CustomerSidebarDrawer from "@/components/CustomerSidebarDrawer";

interface HomepageClientProps {
  userName: string;
  recommendedWorkers: any[];
}

export default function HomepageClient({ userName, recommendedWorkers }: HomepageClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Redirect to explore with search query
    router.push(`/customer/explore?search=${encodeURIComponent(searchQuery)}`);
  };

  // Mock popular categories
  const categories = [
    { name: "Cleaning", icon: Sparkles, route: "/customer/request?category=Cleaning", bg: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { name: "Plumbing", icon: Wrench, route: "/customer/request?category=Plumbing", bg: "bg-blue-50 text-blue-600 border-blue-100" },
    { name: "Electrician", icon: Zap, route: "/customer/request?category=Electrical", bg: "bg-amber-50 text-amber-600 border-amber-100" },
    { name: "Painting", icon: Paintbrush, route: "/customer/request?category=Painting", bg: "bg-rose-50 text-rose-600 border-rose-100" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 pb-8 font-sans">
      
      {/* 1. Header Area */}
      <div className="bg-white px-5 pt-12 pb-5 border-b border-slate-100 sticky top-0 z-20 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-4">
          <CustomerSidebarDrawer />
          
          <div className="flex items-center gap-2.5">
            <Link 
              href="/customer/notifications" 
              className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors relative"
            >
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border border-white"></span>
            </Link>
            <Link 
              href="/customer/profile"
              className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden transition-colors"
            >
              <UserIcon size={18} />
            </Link>
          </div>
        </div>

        {/* 2. Welcome Headline */}
        <div className="mb-4">
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-1.5">
            Hi, {userName || "John"}!
            <span className="text-xl animate-bounce">👋</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">What are you looking for today?</p>
        </div>

        {/* 3. Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search services, freelancers or products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 bg-slate-50 rounded-2xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 font-semibold text-slate-800 shadow-inner"
          />
        </form>
      </div>

      <div className="px-5 pt-6 space-y-5">
        
        {/* Prominent Create Job Banner Card */}
        <Link 
          href="/customer/request"
          className="bg-slate-900 hover:bg-slate-800 rounded-3xl p-5 text-white shadow-lg shadow-slate-950/15 hover:shadow-xl hover:-translate-y-0.5 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
              <Zap size={20} className="fill-white stroke-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-[15px] leading-tight">Create Job</h3>
              <p className="text-[10px] text-slate-300 font-medium mt-1 leading-snug">Post a custom request to nearby professionals</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 text-white transition-all">
            <ArrowRight size={14} className="stroke-[2.5]" />
          </div>
        </Link>

        {/* 4. Ecosystem Portals (Two Cards) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Services Card (Green Theme) */}
          <Link 
            href="/customer/services"
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-5 text-white shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/15 hover:-translate-y-0.5 transition-all group flex flex-col justify-between min-h-[160px] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center shadow-md">
              <Briefcase size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-[15px] leading-tight">Services</h3>
              <p className="text-[10px] text-emerald-100 font-medium mt-1 leading-snug">Hire informal local workers</p>
              <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-emerald-100 group-hover:text-white transition-colors">
                <span>Hire Now</span>
                <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Explore Card (Purple Theme) */}
          <Link 
            href="/customer/explore"
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-5 text-white shadow-lg shadow-indigo-500/10 hover:shadow-xl hover:shadow-indigo-500/15 hover:-translate-y-0.5 transition-all group flex flex-col justify-between min-h-[160px] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center shadow-md">
              <Store size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-[15px] leading-tight">Explore</h3>
              <p className="text-[10px] text-indigo-100 font-medium mt-1 leading-snug">Freelancers, portfolios & products</p>
              <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-indigo-100 group-hover:text-white transition-colors">
                <span>Discover</span>
                <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* 5. Popular Categories */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-primary rounded-full inline-block"></span>
              Popular Categories
            </h3>
            <Link href="/customer/services" className="text-xs font-bold text-primary hover:opacity-95">See All</Link>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {categories.map((cat, i) => (
              <Link 
                key={i} 
                href={cat.route}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-primary/20 transition-all duration-300 group-active:scale-95 ${cat.bg}`}>
                  <cat.icon size={20} className="stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 text-center leading-tight truncate w-full group-hover:text-slate-700 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 6. Recommended For You */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-primary rounded-full inline-block"></span>
              Recommended For You
            </h3>
          </div>

          <div className="space-y-3.5">
            {recommendedWorkers.map((worker) => (
              <Link 
                href={`/customer/services/workers/${worker.id}`}
                key={worker.id}
                className="bg-white rounded-3xl p-4 border border-slate-100 hover:border-primary/20 hover:shadow-md hover:shadow-slate-100/50 transition-all duration-300 flex items-center justify-between gap-4 group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center font-bold text-xl shadow-inner relative flex-shrink-0">
                    {worker.user.image ? (
                      <Image src={worker.user.image} alt={worker.user.name} fill className="object-cover rounded-2xl" />
                    ) : (
                      <span>{worker.user.name.substring(0, 1)}</span>
                    )}
                    {worker.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight truncate group-hover:text-primary transition-colors">{worker.user.name}</h4>
                      <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider truncate">
                      {worker.skills[0] || worker.category?.name || "Professional"}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 mt-1">
                      <Star size={11} className="fill-amber-500 stroke-[1.5]" />
                      <span>{worker.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-semibold">({worker.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[13px] font-black text-slate-800 block">₹{worker.hourlyRate}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Per Hour</span>
                </div>
              </Link>
            ))}

            {/* Dummy Product Recommendation */}
            <Link 
              href="/customer/explore"
              className="bg-white rounded-3xl p-4 border border-slate-100 hover:border-primary/20 hover:shadow-md hover:shadow-slate-100/50 transition-all duration-300 flex items-center justify-between gap-4 group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold text-xl shadow-inner relative flex-shrink-0">
                  🧼
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight truncate group-hover:text-primary transition-colors">Handmade Soap</h4>
                    <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Organic</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider truncate">
                    By Natural Care
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 mt-1">
                    <Star size={11} className="fill-amber-500 stroke-[1.5]" />
                    <span>4.5</span>
                    <span className="text-slate-400 font-semibold">(80 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-[13px] font-black text-slate-800 block">₹120</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Per Piece</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
