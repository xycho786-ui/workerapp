"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Briefcase, Wrench, Store, LogOut, ArrowRight, Sparkles, AlertCircle } from "lucide-react";

interface LandingPageProps {
  user: {
    name: string;
    email: string | undefined;
    role: string;
    roles: string[];
  };
}

// Set the active-role cookie synchronously before navigation
function setCookieRole(cookieRole: string) {
  document.cookie = `sb-active-role=${cookieRole}; path=/; max-age=31536000; SameSite=Lax`;
}

export default function LandingPageClient({ user }: LandingPageProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      setLoading("logout");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      document.cookie = "sb-active-role=; path=/; max-age=0";
      router.push("/login");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to log out");
      setLoading(null);
    }
  };

  const handleSelectService = (route: string, id: string, cookieRole?: string) => {
    if (cookieRole) setCookieRole(cookieRole);
    setLoading(id);
    if (typeof window !== "undefined") {
      window.location.href = route;
    } else {
      router.push(route);
    }
  };

  const roles = user.roles || ["customer"];
  const hasCustomer = roles.includes("customer");
  const hasWorker = roles.includes("worker");
  const hasFreelancer = roles.includes("freelancer");
  const hasBusiness = roles.includes("business");
  const hasAnyWorker = hasWorker || hasFreelancer || hasBusiness;

  const showFreelancer = hasFreelancer || !hasAnyWorker;
  const showWorker = hasWorker || !hasAnyWorker;
  const showBusiness = hasBusiness || !hasAnyWorker;

  const isWorkerAndCustomer = hasAnyWorker && hasCustomer;
  // Default route for single-role workers
  const defaultWorkerRole = hasFreelancer ? "freelancer" : hasBusiness ? "business" : hasWorker ? "worker" : "customer";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-8">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 px-5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
            W
          </div>
          <span className="font-extrabold text-lg bg-gradient-to-r from-primary to-dark bg-clip-text text-transparent">
            WBSP Hub
          </span>
        </div>
        <button
          onClick={handleLogout}
          disabled={loading !== null}
          className="p-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          title="Log out"
        >
          {loading === "logout" ? (
            <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <LogOut size={16} />
          )}
          <span>Logout</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pt-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Hello, {user.name}!
            </h1>
            <span className="text-2xl animate-bounce">👋</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Select a service category to explore the WBSP ecosystem.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Services Grid */}
        <div className="space-y-4">
          
          {/* Option 1: Freelancer Services */}
          {showFreelancer && (
            <button
              onClick={() => handleSelectService("/freelance", "freelance")}
              disabled={loading !== null}
              className="w-full text-left bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(240,128,128,0.12)] hover:-translate-y-1 group relative overflow-hidden flex flex-col gap-4 cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300"></div>
              
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-primary flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Briefcase size={24} className="stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold tracking-wider text-slate-400 group-hover:text-primary transition-colors uppercase bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                  Digital
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5 group-hover:text-primary transition-colors">
                  Freelancer Services
                  <Sparkles size={14} className="text-primary animate-pulse" />
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Connect with professional freelancers for digital and remote services.
                </p>
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Designers", "Developers", "Writers", "SEO"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full border border-slate-100 group-hover:bg-primary/5 group-hover:text-primary transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-1 text-slate-400 group-hover:text-primary transition-colors">
                <span className="text-xs font-bold">Explore Freelancers</span>
                {loading === "freelance" ? (
                  <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </button>
          )}

          {/* Option 2: Worker Bookings & Services (Existing Platform) */}
          {showWorker && (
            <div
              className="w-full text-left bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(240,128,128,0.12)] relative overflow-hidden flex flex-col gap-4"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none"></div>

              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                  <Wrench size={22} className="stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                  Local
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-800 text-base">
                  Worker Bookings & Services
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Book informal workers and service providers for home maintenance and manual tasks.
                </p>
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Plumbing", "Electrical", "Cleaning", "AC Repair"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full border border-slate-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {isWorkerAndCustomer ? (
                <div className="flex flex-col gap-2 pt-3 mt-1 border-t border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Active Workspace:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelectService("/customer/dashboard", "bookings-customer", "customer")}
                      disabled={loading !== null}
                      className="flex-1 bg-primary hover:bg-primary-light text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-primary/20 text-center cursor-pointer flex items-center justify-center gap-1"
                    >
                      {loading === "bookings-customer" ? (
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <span>As Customer (Book)</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleSelectService("/customer/jobs", "bookings-worker", defaultWorkerRole)}
                      disabled={loading !== null}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-all text-center cursor-pointer flex items-center justify-center gap-1"
                    >
                      {loading === "bookings-worker" ? (
                        <span className="w-3.5 h-3.5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <span>As Worker (Provide)</span>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleSelectService(
                    hasAnyWorker ? "/customer/jobs" : "/customer/dashboard",
                    "bookings",
                    hasAnyWorker ? defaultWorkerRole : "customer"
                  )}
                  disabled={loading !== null}
                  className="w-full text-left bg-transparent border-t border-slate-50 pt-3 mt-1 flex items-center justify-between text-slate-400 hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold">
                    {hasAnyWorker ? "Go to Worker Dashboard" : "Go to Customer Dashboard"}
                  </span>
                  {loading === "bookings" ? (
                    <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <ArrowRight size={16} />
                  )}
                </button>
              )}
            </div>
          )}

          {/* Option 3: Small Scale Businesses */}
          {showBusiness && (
            <button
              onClick={() => handleSelectService("/businesses", "businesses")}
              disabled={loading !== null}
              className="w-full text-left bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(240,128,128,0.12)] hover:-translate-y-1 group relative overflow-hidden flex flex-col gap-4 cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#F8AD9D]/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300"></div>

              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-secondary/15 text-[#D45E5E] flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Store size={22} className="stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold tracking-wider text-slate-400 group-hover:text-primary transition-colors uppercase bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                  Retail
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-800 text-base group-hover:text-primary transition-colors">
                  Small Scale Businesses
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Discover local entrepreneurs, browse micro-storefronts, products, and social feed.
                </p>
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Local Stores", "Handmade", "Food", "Apparel"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full border border-slate-100 group-hover:bg-primary/5 group-hover:text-primary transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-1 text-slate-400 group-hover:text-primary transition-colors">
                <span className="text-xs font-bold">Explore Businesses</span>
                {loading === "businesses" ? (
                  <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </button>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-8 px-5 text-center text-[10px] font-bold text-slate-400 tracking-wider uppercase">
        © 2026 WBSP Multi-Service Ecosystem
      </footer>
    </div>
  );
}
