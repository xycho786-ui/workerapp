"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu, SlidersHorizontal, Search, X, Home, UserCircle, Briefcase, HelpCircle, LogOut } from "lucide-react";
import Link from "next/link";

export default function HomeInteractions({ userName, userEmail }: { userName?: string, userEmail?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const currentSearch = searchParams.get("search") || "";
  const currentFilter = searchParams.get("filter") || "newest";

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      router.push(`/customer/explore?${params.toString()}`);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, router, searchParams]);

  const handleFilterSelect = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", filter);
    router.push(`/customer/explore?${params.toString()}`);
    setIsFilterOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-4 bg-white sticky top-0 z-20 border-b border-gray-100">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Find Work</h1>
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="p-2 -mr-2 text-primary hover:bg-primary/10 rounded-full transition-colors relative"
        >
          <SlidersHorizontal size={22} />
          {currentFilter !== "newest" && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>
      </header>

      {/* Search & Quick Filters (Rendered below header in page flow) */}
      <div className="px-4 pt-4 pb-2 space-y-4 bg-gray-50/50">
        <div className="relative z-0">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-10 py-3.5 border border-gray-200 rounded-2xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] transition-all"
            placeholder="Search e.g. Electrician"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Quick Filter Chips */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          <button 
            onClick={() => handleFilterSelect("nearby")}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-transform active:scale-95 ${currentFilter === "nearby" ? "bg-primary text-white shadow-sm shadow-primary/30" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
          >
            Nearby
          </button>
          <button 
            onClick={() => handleFilterSelect("newest")}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-transform active:scale-95 ${currentFilter === "newest" ? "bg-primary text-white shadow-sm shadow-primary/30" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
          >
            Newest
          </button>
          <button 
            onClick={() => handleFilterSelect("top_rated")}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-transform active:scale-95 ${currentFilter === "top_rated" ? "bg-primary text-white shadow-sm shadow-primary/30" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
          >
            Top Rated
          </button>
        </div>
      </div>

      {/* Dropdown Menu Overlay */}
      {isSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div className="absolute top-[72px] left-4 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-gradient-to-b from-primary/10 to-transparent">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-2">
                <UserCircle size={28} className="text-primary" />
              </div>
              <h2 className="font-bold text-gray-900 text-base">{userName || "Guest"}</h2>
              <p className="text-xs text-gray-500">{userEmail || "Sign in to manage account"}</p>
            </div>
            
            <nav className="flex-1 px-3 py-3 space-y-1">
              <Link href="/customer/dashboard" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors text-sm">
                <Home size={18} className="text-gray-400" /> Home
              </Link>
              <Link href="/customer/profile" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors text-sm">
                <UserCircle size={18} className="text-gray-400" /> Profile
              </Link>
              <Link href="/customer/jobs" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors text-sm">
                <Briefcase size={18} className="text-gray-400" /> My Bookings
              </Link>
            </nav>
            
            <div className="p-3 border-t border-gray-100">
              <Link href="/profile/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors text-sm">
                <HelpCircle size={18} className="text-gray-400" /> Support
              </Link>
              {userEmail ? (
                <form action="/api/auth/signout" method="POST">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 font-medium transition-colors mt-1 text-sm">
                    <LogOut size={18} /> Logout
                  </button>
                </form>
              ) : (
                <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 text-primary font-medium transition-colors mt-1 text-sm">
                  <UserCircle size={18} /> Login
                </Link>
              )}
            </div>
          </div>
        </>
      )}

      {/* Filter Bottom Sheet */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFilterOpen(false)}
          ></div>
          <div className="relative w-full sm:w-[400px] bg-white rounded-t-3xl sm:rounded-3xl p-6 pb-10 sm:pb-6 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Sort & Filter</h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => handleFilterSelect("top_rated")}
                className={`w-full flex items-center justify-between p-4 rounded-xl border ${currentFilter === 'top_rated' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-700'} font-medium transition-colors`}
              >
                Top Rated
                {currentFilter === 'top_rated' && <span className="w-3 h-3 bg-primary rounded-full"></span>}
              </button>
              <button 
                onClick={() => handleFilterSelect("newest")}
                className={`w-full flex items-center justify-between p-4 rounded-xl border ${currentFilter === 'newest' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-700'} font-medium transition-colors`}
              >
                Newest Arrivals
                {currentFilter === 'newest' && <span className="w-3 h-3 bg-primary rounded-full"></span>}
              </button>
              <button 
                onClick={() => handleFilterSelect("nearby")}
                className={`w-full flex items-center justify-between p-4 rounded-xl border ${currentFilter === 'nearby' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-700'} font-medium transition-colors`}
              >
                Nearby First
                {currentFilter === 'nearby' && <span className="w-3 h-3 bg-primary rounded-full"></span>}
              </button>
            </div>
            
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="w-full mt-6 bg-gray-900 text-white py-4 rounded-xl font-bold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
}
