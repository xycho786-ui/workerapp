"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookOpenWrapper from "../BookOpenWrapper";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  Eye, 
  EyeOff, 
  Sparkles,
  UserCheck
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setError("Server environment not configured properly.");
      setLoading(false);
      return;
    }

    try {
      const selectedRole = "CUSTOMER";
      const cookieRole = "customer";
      const targetRoute = "/customer/dashboard";

      // 1. Authenticate with Supabase
      const internalEmail = `customer_${formData.email}`;
      let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: internalEmail,
        password: formData.password,
      });

      // Fallback to plain email if prefixed fails
      if (authError && (authError.message?.toLowerCase().includes("invalid") || authError.status === 400)) {
        const { data: fallbackData, error: fallbackError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (!fallbackError) {
          authError = null;
          authData = fallbackData;
        }
      }

      if (authError) throw authError;

      // 2. Set active role cookie synchronously
      const maxAge = rememberMe ? 31536000 : 86400;
      document.cookie = `sb-active-role=${cookieRole}; path=/; max-age=${maxAge}; SameSite=Lax`;

      // 3. Non-blocking background sync (fire and forget - does not block redirection)
      const authUser = authData?.user;
      if (authUser) {
        supabase.auth.updateUser({ data: { activeRole: cookieRole } }).catch(() => {});
        fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: authUser.id,
            email: formData.email,
            name: authUser.user_metadata?.full_name || formData.email.split("@")[0],
            role: selectedRole,
          }),
        }).catch(() => {});
      }

      // 4. Instant redirection
      window.location.href = targetRoute;
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <BookOpenWrapper title="Welcome Back" subtitle="Log in to access your WBSP Customer Dashboard.">
      <div className="w-full max-w-sm mx-auto space-y-5">
        
        {/* Header Title */}
        <div className="text-center stagger-reveal stagger-delay-1">
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-1.5">
            Customer Sign In <Sparkles size={18} className="text-[#F08080]" />
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Book local services & track your orders seamlessly.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-2xl text-xs font-bold leading-relaxed stagger-reveal stagger-delay-2 animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1 stagger-reveal stagger-delay-2 relative">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Email Address
            </label>
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
                className="block w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50/70 rounded-2xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] transition-all placeholder:text-slate-400 font-semibold text-slate-800 shadow-inner"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1 stagger-reveal stagger-delay-3 relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                Password
              </label>
              <a href="#" className="text-[10px] font-extrabold text-[#F08080] hover:underline">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-3 border border-slate-200 bg-slate-50/70 rounded-2xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] transition-all placeholder:text-slate-400 font-semibold text-slate-800 shadow-inner"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me option */}
          <div className="flex items-center justify-between pt-0.5 stagger-reveal stagger-delay-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-500">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#F08080] focus:ring-[#F08080]"
              />
              <span>Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.email || !formData.password}
            className="w-full mt-2 bg-gradient-to-r from-[#F08080] to-rose-400 hover:opacity-95 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-[#F08080]/25 disabled:opacity-60 cursor-pointer stagger-reveal stagger-delay-5 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In as Customer</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="text-center text-xs font-semibold text-slate-400 stagger-reveal stagger-delay-6 pt-2">
          New Customer?{" "}
          <Link href="/signup" className="text-[#F08080] font-extrabold hover:underline">
            Create a Customer Account
          </Link>
        </div>
      </div>
    </BookOpenWrapper>
  );
}
