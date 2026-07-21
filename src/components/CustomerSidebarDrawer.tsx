"use client";

import { useState, useEffect } from "react";
import { 
  Menu, 
  X, 
  Home, 
  MessageSquare, 
  Wallet, 
  User, 
  Briefcase, 
  History, 
  ChevronRight, 
  Zap, 
  Loader2,
  Database,
  Moon,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

interface Booking {
  id: string;
  status: string;
  jobDetails: string;
  price: number | null;
  scheduledAt: string | null;
  worker: {
    user: {
      name: string;
    };
  };
}

export default function CustomerSidebarDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      const fetchBookings = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/customer/bookings-summary");
          if (res.ok) {
            const data = await res.json();
            setActiveBookings(data.active || []);
          }
        } catch (e) {
          console.error("Failed to load bookings summary:", e);
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { key: "home", href: "/customer/dashboard", icon: <Home className="w-5 h-5" />, label: t ? t("nav.home") : "Home" },
    { key: "messages", href: "/customer/chat", icon: <MessageSquare className="w-5 h-5" />, label: t ? t("nav.messages") : "Messages" },
    { key: "wallet", href: "/customer/wallet", icon: <Wallet className="w-5 h-5" />, label: t ? t("nav.wallet") : "Wallet" },
    { key: "profile", href: "/customer/profile", icon: <User className="w-5 h-5" />, label: t ? t("nav.profile") : "Profile" },
  ];

  return (
    <>
      {/* Hamburger Menu Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-all active:scale-95 cursor-pointer shadow-sm"
      >
        <Menu size={20} className="stroke-[2.5]" />
      </button>

      {/* Backdrop Overlay */}
      <div 
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-slate-900/40 z-50 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sliding Drawer Container */}
      <div 
        className={`fixed top-0 left-0 bottom-0 h-full w-[300px] bg-white text-slate-800 flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } border-r border-slate-100`}
      >
        {/* Header (White Dashboard Style) */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-md">
              <Zap size={20} className="fill-white stroke-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 tracking-tight leading-none">WBSP Portal</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Customer Dashboard</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer border-none bg-transparent"
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
          
          {/* Primary Navigation Links */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13px] font-extrabold transition-all border-none ${
                    isActive 
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span className={`${isActive ? "text-white" : "text-slate-400"}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Current Bookings Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Briefcase size={12} />
                Current Bookings
              </h4>
              {activeBookings.length > 0 && (
                <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-md border border-emerald-100">
                  {activeBookings.length}
                </span>
              )}
            </div>

            <div className="space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-4 text-slate-400">
                  <Loader2 size={16} className="animate-spin mr-1.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Syncing bookings...</span>
                </div>
              ) : activeBookings.length > 0 ? (
                activeBookings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setIsOpen(false);
                      router.push(`/customer/jobs?bookingId=${b.id}`);
                    }}
                    className="bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-xl p-3 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <h5 className="font-extrabold text-[11px] text-slate-800 truncate">
                        {b.jobDetails.split(":")[0] || "Service"}
                      </h5>
                      <p className="text-[9px] font-bold text-slate-500 mt-0.5 truncate">
                        Worker: {b.worker?.user?.name || "Assigned"}
                      </p>
                      <span className="inline-block text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 rounded px-1.5 py-0.5 mt-1 border border-emerald-100/50">
                        {b.status}
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 flex-shrink-0" />
                  </div>
                ))
              ) : (
                <div className="text-center py-5 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                  <p className="text-[10px] text-slate-500 font-bold">No active bookings.</p>
                  <Link 
                    href="/customer/services"
                    className="text-[9px] font-black text-slate-800 underline uppercase tracking-wider mt-1 block hover:text-slate-900"
                  >
                    Book Now
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* History Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 px-1">
              <History size={12} />
              Booking History
            </h4>
            <Link
              href="/customer/jobs?tab=completed"
              className="flex items-center justify-between bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-xl p-3.5 text-xs font-bold text-slate-700 transition-all active:scale-[0.98] border-none"
            >
              <span className="text-[11px]">View Booking History</span>
              <ChevronRight size={14} className="text-slate-400" />
            </Link>
          </div>

        </div>

        {/* Footer (White Dashboard Style Stats) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
          
          {/* Agent Status Pill */}
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 px-3.5 py-2.5 rounded-xl text-[11px] font-extrabold text-emerald-700">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>Agent Active</span>
            </div>
            <span className="text-[9px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md uppercase tracking-wider">Online</span>
          </div>

          {/* Supabase Connection Status */}
          <div className="flex items-center justify-between px-3.5 py-1 text-[11px] font-bold text-slate-500">
            <div className="flex items-center gap-2">
              <Database size={13} className="text-indigo-500" />
              <span>Supabase Connected</span>
            </div>
            <Moon size={13} className="text-indigo-500" />
          </div>
          
        </div>
      </div>
    </>
  );
}
