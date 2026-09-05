"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookOpenWrapper from "../BookOpenWrapper";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ArrowRight, 
  Loader2, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Compute password strength score (0 to 3)
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: "", color: "bg-slate-200" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10 && /[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score++;

    if (score === 1) return { score: 1, text: "Weak", color: "bg-rose-400" };
    if (score === 2) return { score: 2, text: "Medium", color: "bg-amber-400" };
    return { score: 3, text: "Strong", color: "bg-emerald-500" };
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      setError("Please agree to the Terms of Service to create an account.");
      return;
    }

    setLoading(true);
    setError(null);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setError("Server environment configuration error.");
      setLoading(false);
      return;
    }

    try {
      const dbRole = "CUSTOMER";
      const selectedRoles = ["customer"];
      const primaryUserType = "customer";

      // 1. Sign up with Supabase using role-prefixed email
      const internalEmail = `customer_${formData.email}`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: internalEmail,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: dbRole,
            roles: selectedRoles,
            phone: formData.phone || undefined,
            userType: primaryUserType,
          }
        }
      });

      if (authError) throw authError;

      // 2. Set active role cookie
      document.cookie = `sb-active-role=customer; path=/; max-age=31536000; SameSite=Lax`;

      // 3. Non-blocking background sync to Postgres database
      if (authData.user) {
        fetch("/api/auth/sync", {
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
        }).catch(() => {});
      }

      setSuccess(true);
      window.location.href = "/customer/dashboard";
    } catch (err: any) {
      setError(err.message || "Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 h-full space-y-4">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 border border-emerald-200/80 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/15 animate-bounce">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Customer Account Created!</h2>
        <p className="text-xs text-slate-500 font-bold max-w-[220px]">
          Welcome to WBSP! Redirecting to your Customer Dashboard...
        </p>
      </div>
    );
  }

  return (
    <BookOpenWrapper title="Create Customer Account" subtitle="Join WBSP to book trusted local workers & products.">
      <div className="w-full max-w-sm mx-auto space-y-4">
        
        <div className="text-center stagger-reveal stagger-delay-1">
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-1.5">
            Create Account <Sparkles size={18} className="text-[#F08080]" />
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Start your Customer account in under 1 minute.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-3">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-2xl text-xs font-bold leading-relaxed stagger-reveal stagger-delay-2 animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1 stagger-reveal stagger-delay-2 relative">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={15} />
              </div>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50/70 rounded-2xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] transition-all placeholder:text-slate-400 font-semibold text-slate-800 shadow-inner"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1 stagger-reveal stagger-delay-3 relative">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={15} />
              </div>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50/70 rounded-2xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] transition-all placeholder:text-slate-400 font-semibold text-slate-800 shadow-inner"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1 stagger-reveal stagger-delay-4 relative">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Phone Number (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone size={15} />
              </div>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50/70 rounded-2xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] transition-all placeholder:text-slate-400 font-semibold text-slate-800 shadow-inner"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1 stagger-reveal stagger-delay-5 relative">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={15} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 bg-slate-50/70 rounded-2xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] transition-all placeholder:text-slate-400 font-semibold text-slate-800 shadow-inner"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Password strength meter */}
            {formData.password && (
              <div className="pt-1 space-y-1">
                <div className="flex items-center justify-between text-[9px] font-extrabold">
                  <span className="text-slate-400">Strength:</span>
                  <span className={strength.score === 3 ? "text-emerald-600" : strength.score === 2 ? "text-amber-600" : "text-rose-500"}>
                    {strength.text}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : "bg-slate-200"}`} />
                  <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : "bg-slate-200"}`} />
                  <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : "bg-slate-200"}`} />
                </div>
              </div>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2 pt-1 stagger-reveal stagger-delay-6">
            <input
              type="checkbox"
              id="terms"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#F08080] focus:ring-[#F08080] cursor-pointer"
            />
            <label htmlFor="terms" className="text-[10px] font-semibold text-slate-500 cursor-pointer">
              I agree to the <span className="text-[#F08080] font-extrabold hover:underline">Terms of Service</span> and <span className="text-[#F08080] font-extrabold hover:underline">Privacy Policy</span>.
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-3 bg-gradient-to-r from-[#F08080] to-rose-400 hover:opacity-95 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-[#F08080]/25 disabled:opacity-60 cursor-pointer stagger-reveal stagger-delay-7 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Creating Customer Account...</span>
              </>
            ) : (
              <>
                <span>Sign Up as Customer</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs font-semibold text-slate-400 stagger-reveal stagger-delay-7 pt-1">
          Already have an account?{" "}
          <Link href="/login" className="text-[#F08080] font-extrabold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </BookOpenWrapper>
  );
}
