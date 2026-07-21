"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookOpenWrapper from "../BookOpenWrapper";
import { Mail, Lock, ArrowRight, Loader2, UserCheck, ChevronRight } from "lucide-react";

// Canonical mapping: role + userType → { route, cookieRole }
function resolveRoleRoute(role: string, userType: string | null): { route: string; cookieRole: string; label: string } {
  if (role === "CUSTOMER") {
    return { route: "/customer/dashboard", cookieRole: "customer", label: "Continue as Customer" };
  }
  if (role === "WORKER") {
    if (userType === "freelancer") {
      return { route: "/worker/dashboard", cookieRole: "freelancer", label: "Continue as Freelancer" };
    }
    if (userType === "business") {
      return { route: "/worker/dashboard", cookieRole: "business", label: "Continue as Small Business" };
    }
    return { route: "/worker/dashboard", cookieRole: "worker", label: "Continue as Worker" };
  }
  return { route: "/customer/dashboard", cookieRole: "customer", label: "Continue" };
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [availableAccounts, setAvailableAccounts] = useState<{ role: string; userType: string | null }[]>([]);

  const selectedAccountRef = useRef<{ role: string; userType: string | null; route: string; cookieRole: string }>({
    role: "CUSTOMER",
    userType: null,
    route: "/customer/dashboard",
    cookieRole: "customer",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [displayRole, setDisplayRole] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/auth/check?email=${encodeURIComponent(formData.email)}`);
      if (res.ok) {
        const data = await res.json();
        const accounts: { role: string; userType: string | null }[] =
          data.accounts || (data.roles || []).map((r: string) => ({ role: r, userType: null }));

        if (accounts.length > 0) {
          setAvailableAccounts(accounts);
          if (accounts.length === 1) {
            const resolved = resolveRoleRoute(accounts[0].role, accounts[0].userType);
            selectedAccountRef.current = {
              role: accounts[0].role,
              userType: accounts[0].userType,
              route: resolved.route,
              cookieRole: resolved.cookieRole,
            };
            setDisplayRole(resolved.cookieRole);
            setStep(3);
          } else {
            setStep(2);
          }
        } else {
          setError("No account found with this email. Please sign up.");
        }
      } else {
        throw new Error("Failed to verify account.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify account.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = (role: string, userType: string | null) => {
    const resolved = resolveRoleRoute(role, userType);
    selectedAccountRef.current = {
      role,
      userType,
      route: resolved.route,
      cookieRole: resolved.cookieRole,
    };
    setDisplayRole(resolved.cookieRole);
    setStep(3);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setError("Server needs to be restarted!");
      setLoading(false);
      return;
    }

    const { role: selectedRole, route: targetRoute, cookieRole } = selectedAccountRef.current;

    try {
      const internalEmail = `${selectedRole.toLowerCase()}_${formData.email}`;
      let { error: authError } = await supabase.auth.signInWithPassword({
        email: internalEmail,
        password: formData.password,
      });

      if (authError && (authError.message?.toLowerCase().includes("invalid") || authError.status === 400)) {
        const { error: fallbackError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (!fallbackError) {
          authError = null;
        }
      }

      if (authError) throw authError;

      document.cookie = `sb-active-role=${cookieRole}; path=/; max-age=31536000; SameSite=Lax`;

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        try {
          await supabase.auth.updateUser({
            data: { activeRole: cookieRole },
          });
        } catch (metaErr) {
          console.error("Failed to update activeRole in user metadata:", metaErr);
        }

        const rawRole = authUser.user_metadata?.role;
        const userRole = rawRole ? String(rawRole).toUpperCase() : selectedRole;

        try {
          await fetch("/api/auth/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: authUser.id,
              email: formData.email,
              name: authUser.user_metadata?.full_name || formData.email.split("@")[0],
              role: userRole,
            }),
          });
        } catch (syncErr) {
          console.error("Sync error during login:", syncErr);
        }
      }

      router.push(targetRoute);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookOpenWrapper title="Welcome Back" subtitle="Please log in to your account.">
      <div className="w-full max-w-sm mx-auto space-y-6">
        <div className="text-center stagger-reveal stagger-delay-1">
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Please log in to access your platform dashboard.</p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-650 border border-red-100 rounded-2xl text-xs font-bold leading-relaxed stagger-reveal stagger-delay-2 animate-pulse">
              {error}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleCheckEmail} className="space-y-4">
              <div className="space-y-1 stagger-reveal stagger-delay-2 relative">
                <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider block">Email</label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50 rounded-2xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 font-semibold text-slate-800 shadow-inner"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !formData.email}
                className="w-full mt-6 bg-[#F08080] hover:bg-[#F08080]/90 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-[#F08080]/25 disabled:opacity-70 cursor-pointer stagger-reveal stagger-delay-3 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Role Selection */}
          {step === 2 && (
            <div className="space-y-4 stagger-reveal stagger-delay-2">
              <p className="text-xs text-slate-400 font-bold text-center">Select the active workspace account:</p>
              <div className="flex flex-col gap-2">
                {availableAccounts.map((acc, index) => {
                  const resolved = resolveRoleRoute(acc.role, acc.userType);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectRole(acc.role, acc.userType)}
                      className="py-3 px-4 text-xs font-bold rounded-2xl border border-slate-100 bg-white hover:border-[#F08080]/30 hover:shadow-sm transition-all text-slate-800 text-left flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <UserCheck size={14} className="text-[#F08080]" />
                        {resolved.label}
                      </span>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 w-full text-center hover:underline pt-2 cursor-pointer"
              >
                Back to email
              </button>
            </div>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1 stagger-reveal stagger-delay-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider block">Email</label>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[10px] font-extrabold text-[#F08080] hover:underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="block w-full px-4 py-3 border border-slate-100 bg-slate-100 rounded-2xl text-xs font-semibold text-slate-400"
                />
              </div>

              {availableAccounts.length > 1 && (
                <div className="text-[10px] font-bold text-slate-400 flex justify-between stagger-reveal stagger-delay-3 pt-1">
                  <span>
                    Logging in as:{" "}
                    <span className="font-extrabold text-slate-600 capitalize">{displayRole}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-[#F08080] hover:underline cursor-pointer"
                  >
                    Change role
                  </button>
                </div>
              )}

              <div className="space-y-1 stagger-reveal stagger-delay-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider block">Password</label>
                  <a href="#" className="text-[10px] font-extrabold text-[#F08080] hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50 rounded-2xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 font-semibold text-slate-800 shadow-inner"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.password}
                className="w-full mt-6 bg-[#F08080] hover:bg-[#F08080]/90 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-[#F08080]/25 disabled:opacity-70 cursor-pointer stagger-reveal stagger-delay-5 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="text-center text-xs font-semibold text-slate-400 stagger-reveal stagger-delay-6 pt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#F08080] font-extrabold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </BookOpenWrapper>
  );
}
