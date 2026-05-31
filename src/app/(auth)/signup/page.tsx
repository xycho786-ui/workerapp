"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wrench, Zap, Sparkles, Wind, Paintbrush, Hammer, Bug, Scissors, Briefcase } from "lucide-react";

const PROFESSIONS = [
  { name: "Plumbing", icon: Wrench },
  { name: "Electrical", icon: Zap },
  { name: "Cleaning", icon: Sparkles },
  { name: "AC Repair", icon: Wind },
  { name: "Painting", icon: Paintbrush },
  { name: "Carpentry", icon: Hammer },
  { name: "Pest Control", icon: Bug },
  { name: "Salon", icon: Scissors },
  { name: "Others", icon: Briefcase },
];


export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [customProfession, setCustomProfession] = useState("");

  const handleToggleProfession = (name: string) => {
    setSelectedProfessions(prev => {
      if (prev.includes(name)) {
        const next = prev.filter(p => p !== name);
        if (name === "Others") {
          setCustomProfession("");
        }
        return next;
      } else {
        return [...prev, name];
      }
    });
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "CUSTOMER", // Default role
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // CRITICAL CHECK: Ensure env vars are loaded
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setError("Server needs to be restarted! Press Ctrl+C in your terminal and run 'npm run dev' again to load the new .env.local file.");
      setLoading(false);
      return;
    }

    // Validation rules for worker profession selection
    if (formData.role === "WORKER") {
      if (selectedProfessions.length === 0) {
        setError("Please select your profession.");
        setLoading(false);
        return;
      }
      if (selectedProfessions.includes("Others") && !customProfession.trim()) {
        setError("Please enter your profession.");
        setLoading(false);
        return;
      }
    }

    try {
      // 1. Sign up with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: formData.role,
            phone: formData.phone,
            profession: formData.role === "WORKER" ? selectedProfessions : undefined,
            customProfession: formData.role === "WORKER" && selectedProfessions.includes("Others") ? customProfession.trim() : undefined,
          }
        }
      });

      if (authError) throw authError;

      // 2. Sync to MongoDB via our API route
      if (authData.user) {
        const res = await fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: authData.user.id, 
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
            role: formData.role,
            profession: formData.role === "WORKER" ? selectedProfessions : undefined,
            customProfession: formData.role === "WORKER" && selectedProfessions.includes("Others") ? customProfession.trim() : undefined,
          }),
        });

        if (!res.ok) {
          let errorMessage = "Failed to create user profile";
          try {
            const apiError = await res.json();
            errorMessage = apiError.message || errorMessage;
          } catch (jsonParseError) {
            console.error("API returned non-JSON error response:", res.status, res.statusText);
            errorMessage = `Server error (${res.status}): Please check the server logs. Database connection might be failing.`;
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
      <div className="flex flex-col items-center justify-center text-center space-y-4 pt-12">
        <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center text-2xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-900">Account Created!</h2>
        <p className="text-gray-600">You are being redirected to the home page...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
        <p className="text-sm text-gray-500 mt-2">Join the WBSP community today.</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">I want to...</label>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "CUSTOMER" })}
              className={`py-2 text-sm font-semibold rounded-xl border transition-colors ${
                formData.role === "CUSTOMER" 
                ? "bg-primary text-white border-primary shadow-sm shadow-primary/20" 
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Hire Workers
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "WORKER" })}
              className={`py-2 text-sm font-semibold rounded-xl border transition-colors ${
                formData.role === "WORKER" 
                ? "bg-primary text-white border-primary shadow-sm shadow-primary/20" 
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Find Work
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input 
            type="text" 
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Phone (Optional)</label>
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            placeholder="+1 234 567 890"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            placeholder="••••••••"
          />
        </div>

        {formData.role === "WORKER" && (
          <div className="space-y-4 pt-2">
            <label className="text-sm font-semibold text-gray-700 block">Select Your Profession</label>
            <div className="grid grid-cols-3 gap-3">
              {PROFESSIONS.map((p) => {
                const Icon = p.icon;
                const isSelected = selectedProfessions.includes(p.name);
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleToggleProfession(p.name)}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center shadow-sm transition-all group-active:scale-95 ${
                      isSelected
                        ? "bg-primary/15 border-primary shadow-md text-primary ring-2 ring-primary/20"
                        : "bg-primary/5 border-primary/10 text-primary group-hover:bg-primary/10 group-hover:border-primary/20"
                    }`}>
                      <Icon size={26} className="stroke-[1.5]" />
                    </div>
                    <span className={`text-[11px] font-semibold text-center transition-colors ${
                      isSelected ? "text-primary font-bold" : "text-slate-600"
                    }`}>{p.name}</span>
                  </button>
                );
              })}
            </div>

            {selectedProfessions.includes("Others") && (
              <div className="space-y-1.5 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="text-xs font-semibold text-gray-500">Your Profession</label>
                <input
                  type="text"
                  value={customProfession}
                  onChange={(e) => setCustomProfession(e.target.value)}
                  placeholder="Enter your profession"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-gray-800"
                  required
                />
              </div>
            )}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-4 bg-primary hover:bg-primary-light text-white font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-sm shadow-primary/20 disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
