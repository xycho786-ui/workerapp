"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ShieldCheck } from "lucide-react";

interface BookOpenWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function BookOpenWrapper({ children, title, subtitle }: BookOpenWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isLogin = pathname?.includes("/login");

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <div className="book-viewport min-h-screen py-8 px-4 flex flex-col items-center justify-center bg-slate-900/95 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      
      {/* Top Branding & Mode Switcher */}
      <div className="mb-6 flex flex-col items-center gap-3 z-20">
        <Link href="/customer/dashboard" className="flex items-center gap-2 text-white group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F08080] to-rose-400 flex items-center justify-center text-white shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform">
            <Sparkles size={18} className="fill-white stroke-white" />
          </div>
          <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            WBSP Customer Portal
          </span>
        </Link>

        {/* Tab Switcher Pills */}
        <div className="bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60 shadow-xl backdrop-blur-md flex items-center gap-1">
          <Link
            href="/login"
            className={`px-5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-300 ${
              isLogin
                ? "bg-[#F08080] text-white shadow-md shadow-[#F08080]/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
            }`}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className={`px-5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-300 ${
              !isLogin
                ? "bg-[#F08080] text-white shadow-md shadow-[#F08080]/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
            }`}
          >
            Sign Up
          </Link>
        </div>
      </div>

      <div className={`book-container ${isOpen ? "is-open" : ""}`}>
        {/* Left Page of Cover */}
        <div className="book-page book-page-left">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-1">
              <ShieldCheck size={28} className="text-rose-300" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-white/95">{title}</h2>
          </div>
        </div>

        {/* Right Page of Cover */}
        <div className="book-page book-page-right">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/80 bg-white/15 px-3 py-1 rounded-full">
              Verified Gateway
            </span>
            <p className="text-xs text-white/80 max-w-[170px] font-medium leading-snug">{subtitle}</p>
          </div>
        </div>

        {/* Real Form Content Inside */}
        <div className="book-content-inside">
          {children}
        </div>
      </div>
    </div>
  );
}
