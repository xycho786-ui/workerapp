"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookOpenWrapper from "../BookOpenWrapper";
import { User, Mail, Phone, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setError("Server needs to be restarted!");
      setLoading(false);
      return;
    }

    try {
      const dbRole = "CUSTOMER";
      const selectedRoles = ["customer"];
      const primaryUserType = "customer";

      // 1. Sign up with Supabase using role-prefixed email
      const internalEmail = `${dbRole.toLowerCase()}_${formData.email}`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: internalEmail,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: dbRole,
            roles: selectedRoles,
            phone: formData.phone || undefined,
          }
        }
      });

      if (authError) throw authError;

      // 2. Sync to Postgres database
      if (authData.user) {
        const res = await fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: authData.user.id, 
            email: formData.email,
            name: formData.name,
            phone: formData.phone || null,
            role: dbRole,
            userType: primaryUserType,
          }),
        });

        if (!res.ok) {
          let errorMessage = "Failed to create user profile";
          try {
            const apiError = await res.json();
            errorMessage = apiError.message || errorMessage;
          } catch (jsonParseError) {
            errorMessage = `Server error (${res.status}): Please check the server logs.`;
          }
          throw new Error(errorMessage);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Something went wrong during signup.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 h-full space-y-4">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-2xl mb-2 animate-bounce">✓</div>
        <h2 className="text-xl font-black text-slate-800">Account Created!</h2>
        <p className="text-xs text-slate-400 font-semibold">You are being redirected to the home page...</p>
      </div>
    );
  }

  return (
    <BookOpenWrapper title="Create Account" subtitle="Join the WBSP community today.">
      <div className="w-full max-w-sm mx-auto space-y-6">
        <div className="text-center stagger-reveal stagger-delay-1">
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Create Account</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Start your journey as a Customer today.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-650 border border-red-100 rounded-2xl text-xs font-bold leading-relaxed stagger-reveal stagger-delay-2 animate-pulse">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1 stagger-reveal stagger-delay-2 relative">
            <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider block">Full Name</label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={16} />
              </div>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50 rounded-2xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 font-semibold text-slate-800 shadow-inner"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1 stagger-reveal stagger-delay-3 relative">
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

          {/* Phone */}
          <div className="space-y-1 stagger-reveal stagger-delay-4 relative">
            <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider block">Phone (Optional)</label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone size={16} />
              </div>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50 rounded-2xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 font-semibold text-slate-800 shadow-inner"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1 stagger-reveal stagger-delay-5 relative">
            <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider block">Password</label>
            <div className="relative mt-1">
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
            disabled={loading}
            className="w-full mt-6 bg-[#F08080] hover:bg-[#F08080]/90 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-[#F08080]/25 disabled:opacity-70 cursor-pointer stagger-reveal stagger-delay-6 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs font-semibold text-slate-400 stagger-reveal stagger-delay-7 pt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[#F08080] font-extrabold hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </BookOpenWrapper>
  );
}
