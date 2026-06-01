"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Settings, Briefcase, Star, Bell, HelpCircle, Info, 
  Camera, Check, Lock, ChevronRight, Phone, MapPin, Calendar, X, Loader2,
  DollarSign, Clock, Languages, Award, Plus, Trash2, Globe
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Portal from "@/components/Portal";
import { createClient } from "@/utils/supabase/client";

interface WorkerProfileContentProps {
  dbUser: any;
  handleLogoutAction: () => Promise<void>;
}

export default function WorkerProfileContent({ dbUser, handleLogoutAction }: WorkerProfileContentProps) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const workerProfile = dbUser.workerProfile || {};

  // Tab State
  const [activeTab, setActiveTab] = useState<"details" | "portfolio" | "availability" | "reviews" | "help" | "about" | "settings">("details");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(dbUser.image || "");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);

  // Form edit states
  const [name, setName] = useState(dbUser.name || "");
  const [phone, setPhone] = useState(dbUser.phone || "");
  const [address, setAddress] = useState(dbUser.address || "");
  const [experience, setExperience] = useState(workerProfile.experience?.toString() || "0");
  const [hourlyRate, setHourlyRate] = useState(workerProfile.hourlyRate?.toString() || "0");
  const [locationAddress, setLocationAddress] = useState(workerProfile.locationAddress || "");
  const [skillsStr, setSkillsStr] = useState(workerProfile.skills?.join(", ") || "");
  const [languagesStr, setLanguagesStr] = useState(workerProfile.languages?.join(", ") || "English");
  const [workingHours, setWorkingHours] = useState(workerProfile.workingHours || "9:00 AM - 5:00 PM");
  const [professions, setProfessions] = useState<string[]>(workerProfile.profession || []);
  
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  // Password States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Availability / Online state
  const [isOnline, setIsOnline] = useState(workerProfile.isOnline ?? false);
  const [availStatus, setAvailStatus] = useState(workerProfile.availabilityStatus || "AVAILABLE");

  // Portfolio Gallery State
  const [portfolio, setPortfolio] = useState<string[]>(workerProfile.portfolio || []);

  // FAQs open state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calculations details
  const jobs = workerProfile.jobs || [];
  const completedJobs = jobs.filter((j: any) => j.status === "COMPLETED");
  const activeJobs = jobs.filter((j: any) => ["ACCEPTED", "IN_PROGRESS"].includes(j.status));

  // Earnings calculations
  const totalEarnings = completedJobs.reduce((sum: number, j: any) => sum + (j.price || 0), 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const todayEarnings = completedJobs
    .filter((j: any) => new Date(j.updatedAt) >= today)
    .reduce((sum: number, j: any) => sum + (j.price || 0), 0);

  const weeklyEarnings = completedJobs
    .filter((j: any) => new Date(j.updatedAt) >= oneWeekAgo)
    .reduce((sum: number, j: any) => sum + (j.price || 0), 0);

  const monthlyEarnings = completedJobs
    .filter((j: any) => new Date(j.updatedAt) >= oneMonthAgo)
    .reduce((sum: number, j: any) => sum + (j.price || 0), 0);

  const acceptanceRate = jobs.length > 0
    ? Math.round(((completedJobs.length + activeJobs.length) / jobs.length) * 100)
    : 100;

  // Photo Upload Trigger
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      const updateRes = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: data.url }),
      });

      if (!updateRes.ok) throw new Error("Failed to save photo URL");

      setProfileImage(data.url);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Portfolio Upload Trigger
  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPortfolio(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      const newPortfolio = [...portfolio, data.url];
      
      const updateRes = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio: newPortfolio }),
      });

      if (!updateRes.ok) throw new Error("Failed to save portfolio URL");

      setPortfolio(newPortfolio);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to upload portfolio photo");
    } finally {
      setUploadingPortfolio(false);
    }
  };

  // Delete Portfolio Photo
  const handleDeletePortfolio = async (imgUrl: string) => {
    if (!confirm("Are you sure you want to delete this photo from your portfolio?")) return;

    const newPortfolio = portfolio.filter((url: string) => url !== imgUrl);

    try {
      const updateRes = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio: newPortfolio }),
      });

      if (!updateRes.ok) throw new Error("Failed to delete portfolio URL");

      setPortfolio(newPortfolio);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete portfolio photo");
    }
  };

  // Update Profile & Professional details
  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(false);

    try {
      const languagesArray = languagesStr.split(",").map((l: string) => l.trim()).filter(Boolean);

      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          phone, 
          address,
          experience: parseInt(experience) || 0,
          hourlyRate: parseFloat(hourlyRate) || 0,
          locationAddress,
          profession: professions,
          languages: languagesArray,
          workingHours
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile");
      }

      setEditSuccess(true);
      setTimeout(() => {
        setIsEditModalOpen(false);
        setEditSuccess(false);
      }, 1500);
      router.refresh();
    } catch (err: any) {
      setEditError(err.message || "Something went wrong.");
    } finally {
      setEditLoading(false);
    }
  };

  // Toggle isOnline
  const handleToggleOnline = async () => {
    const nextOnline = !isOnline;
    setIsOnline(nextOnline);
    try {
      await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOnline: nextOnline }),
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to toggle online state", err);
    }
  };

  // Update availability status
  const handleUpdateAvailabilityStatus = async (status: string) => {
    setAvailStatus(status);
    try {
      await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availabilityStatus: status }),
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to update availability status", err);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const nameInitials = (dbUser.name || "Worker").substring(0, 2).toUpperCase();
  const primaryProfession = workerProfile.profession?.join(", ") || "Certified Worker";

  return (
    <div className="flex flex-col h-full bg-[#FCFDFD] font-sans pb-24">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-[#F08080]/15 to-transparent px-5 pt-8 pb-5 border-b border-gray-100/50">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-18 h-18 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-light to-primary flex items-center justify-center border-4 border-white shadow-xl shadow-primary/10 relative">
              {profileImage ? (
                <Image 
                  src={profileImage} 
                  alt="Profile" 
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[24px] font-black text-white">{nameInitials}</span>
              )}
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6.5 h-6.5 bg-white hover:bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shadow-md text-gray-500 hover:text-primary transition-all active:scale-95"
            >
              <Camera size={13} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="font-black text-[18px] text-slate-800 leading-tight">{dbUser.name}</h2>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-bold border border-blue-100 uppercase tracking-wider flex items-center gap-0.5">
                <Check size={9} className="stroke-[3]" /> PRO
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5 capitalize font-bold text-[#F08080]">{primaryProfession}</p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">{dbUser.email}</p>
          </div>
        </div>

        {/* Short Profile summary row */}
        <div className="grid grid-cols-3 gap-3 bg-white/70 backdrop-blur-sm border border-slate-100 p-3 rounded-2xl mt-5 shadow-sm">
          <div className="text-center border-r border-slate-50">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Rating</span>
            <div className="flex items-center justify-center gap-0.5 mt-0.5 text-amber-500 font-extrabold text-sm">
              <Star size={13} className="fill-amber-500 stroke-none" />
              <span>{workerProfile.rating?.toFixed(1) || "5.0"}</span>
            </div>
          </div>
          <div className="text-center border-r border-slate-50">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Jobs</span>
            <span className="text-sm font-black text-slate-700 block mt-0.5">{completedJobs.length}</span>
          </div>
          <div className="text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Rate</span>
            <span className="text-sm font-black text-[#F08080] block mt-0.5">${workerProfile.hourlyRate || "25"}/hr</span>
          </div>
        </div>
      </div>

      {/* EARNINGS DASHBOARD CARD */}
      <div className="px-4 py-2">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden border border-slate-700/30">
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
            <DollarSign className="w-40 h-40" />
          </div>
          
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Earnings Dashboard</span>
              <h3 className="text-2xl font-black">${totalEarnings.toLocaleString()}</h3>
              <p className="text-[9px] text-slate-400 font-semibold">Total Revenue Earned</p>
            </div>
            
            <div className="px-2.5 py-1 bg-white/10 text-white rounded-lg text-[10px] font-bold border border-white/5 backdrop-blur-sm">
              Level 1 Partner
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/10">
            <div>
              <span className="text-[9px] text-slate-400 font-semibold uppercase block">Today</span>
              <span className="text-xs font-black mt-0.5 block">${todayEarnings}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-semibold uppercase block">This Week</span>
              <span className="text-xs font-black mt-0.5 block">${weeklyEarnings}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-semibold uppercase block">This Month</span>
              <span className="text-xs font-black mt-0.5 block">${monthlyEarnings}</span>
            </div>
          </div>
        </div>
      </div>

      {/* JOB STATISTICS GRID */}
      <div className="px-4 pt-2 pb-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white border border-slate-100 rounded-2xl p-2.5 text-center shadow-sm">
            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wide">Jobs Done</span>
            <span className="text-sm font-black text-slate-750 block mt-0.5">{completedJobs.length}</span>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-2.5 text-center shadow-sm">
            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wide">Active</span>
            <span className="text-sm font-black text-orange-500 block mt-0.5">{activeJobs.length}</span>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-2.5 text-center shadow-sm">
            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wide">Accept Rate</span>
            <span className="text-sm font-black text-green-500 block mt-0.5">{acceptanceRate}%</span>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-2.5 text-center shadow-sm">
            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wide">Avg Rating</span>
            <span className="text-sm font-black text-amber-500 block mt-0.5">{workerProfile.rating?.toFixed(1) || "5.0"}</span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex gap-1.5 overflow-x-auto scrollbar-none sticky top-0 z-10">
        {[
          { id: "details", label: "Professional", icon: <Award size={14} /> },
          { id: "portfolio", label: `Portfolio (${portfolio.length})`, icon: <Camera size={14} /> },
          { id: "availability", label: "Availability", icon: <Clock size={14} /> },
          { id: "reviews", label: `Reviews (${workerProfile.reviews?.length || 0})`, icon: <Star size={14} /> },
          { id: "settings", label: "Settings", icon: <Settings size={14} /> },
          { id: "help", label: "Support FAQ", icon: <HelpCircle size={14} /> },
          { id: "about", label: "Rules", icon: <Info size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? "bg-[#F08080] text-white shadow-md shadow-[#F08080]/15" 
                : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Tab Body */}
      <div className="p-4 flex-1">
        {/* DETAILS TAB */}
        {activeTab === "details" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Professional Details</h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs font-bold text-[#F08080]"
                >
                  Edit details
                </button>
              </div>

              <div className="space-y-3.5">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100/50">
                    <Award size={16} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category & Experience</label>
                    <p className="text-xs font-bold text-slate-700 mt-0.5 capitalize">{primaryProfession}</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{workerProfile.experience || "0"} years of professional experience</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100/50">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Service Location & Areas</label>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{workerProfile.locationAddress || "Not set"}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 border border-purple-100/50">
                    <Settings size={16} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Skills Set</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {workerProfile.skills && workerProfile.skills.length > 0 ? (
                        workerProfile.skills.map((skill: string) => (
                          <span key={skill} className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-100 font-bold rounded-lg text-[10px]">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium italic">No skills defined yet.</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-500 flex items-center justify-center shrink-0 border border-teal-100/50">
                    <Languages size={16} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Languages Spoken</label>
                    <p className="text-xs font-bold text-slate-700 mt-0.5 capitalize">
                      {workerProfile.languages?.join(", ") || "English"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password Block */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4">Security</h3>
              <form onSubmit={handleChangePassword} className="space-y-3.5">
                {passwordError && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 font-semibold">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="p-3 bg-green-50 text-green-600 text-xs rounded-xl border border-green-100 font-semibold">
                    Password updated successfully!
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] text-xs font-medium transition-all"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] text-xs font-medium transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-75"
                >
                  <Lock size={12} />
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* PORTFOLIO TAB */}
        {activeTab === "portfolio" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Work Portfolio Gallery</h3>
              <button
                type="button"
                onClick={() => portfolioInputRef.current?.click()}
                disabled={uploadingPortfolio}
                className="px-3 py-1.5 bg-[#F08080]/10 hover:bg-[#F08080] text-[#F08080] hover:text-white font-bold rounded-lg text-[10px] transition-all flex items-center gap-1 shadow-sm disabled:opacity-75"
              >
                {uploadingPortfolio ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <Plus size={11} />
                )}
                Add Photo
              </button>
              <input 
                type="file" 
                ref={portfolioInputRef}
                onChange={handlePortfolioUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {portfolio.length > 0 ? (
              <div className="grid grid-cols-2 gap-3.5">
                {portfolio.map((imgUrl) => (
                  <div key={imgUrl} className="relative aspect-video rounded-2xl overflow-hidden group border border-slate-100 shadow-sm bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={imgUrl} 
                      alt="Work Portfolio" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeletePortfolio(imgUrl)}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-650 text-white rounded-lg flex items-center justify-center shadow-md transition-all active:scale-90"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-slate-100">
                  <Camera size={24} className="stroke-[1.5]" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">No portfolio images</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">Showcase your best completed jobs. Upload images of your previous works to attract more high-paying clients.</p>
              </div>
            )}
          </div>
        )}

        {/* AVAILABILITY SETTINGS TAB */}
        {activeTab === "availability" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Availability Configuration</h3>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-5">
              {/* Online / Offline switch */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-50 pb-4">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Job Board Visibility</h4>
                  <p className="text-[10px] text-slate-400 font-semibold leading-normal">Toggle Online to allow customers to locate you on the map and request direct bookings.</p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleOnline}
                  className={`w-11 h-6 rounded-full relative transition-all duration-300 ${
                    isOnline 
                      ? "bg-green-500" 
                      : "bg-slate-200"
                  }`}
                >
                  <div 
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm ${
                      isOnline 
                        ? "right-1" 
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Working Hours status info */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Defined Working Hours</label>
                <p className="text-xs font-bold text-slate-700">{workingHours}</p>
              </div>

              {/* Status picker */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Work Status Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "AVAILABLE", label: "Available", color: "bg-green-500 text-white border-transparent" },
                    { id: "BUSY", label: "Busy / Hired", color: "bg-orange-500 text-white border-transparent" },
                    { id: "ON_LEAVE", label: "On Leave", color: "bg-slate-500 text-white border-transparent" },
                  ].map((status) => {
                    const isSelected = availStatus === status.id;
                    return (
                      <button
                        key={status.id}
                        type="button"
                        onClick={() => handleUpdateAvailabilityStatus(status.id)}
                        className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                          isSelected 
                            ? status.color 
                            : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        {status.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMER REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Feedback & Reviews</h3>
            
            {workerProfile.reviews && workerProfile.reviews.length > 0 ? (
              <div className="space-y-3">
                {workerProfile.reviews.map((review: any) => (
                  <div key={review.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F08080]/10 flex items-center justify-center text-xs font-black text-[#F08080]">
                          {review.reviewer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{review.reviewer.name}</p>
                          <span className="text-[8px] px-1 bg-slate-100 text-slate-500 rounded border border-slate-200/50">Hired Client</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={11} 
                          className={i < review.rating ? "fill-amber-500 stroke-none" : "text-slate-200"} 
                        />
                      ))}
                    </div>

                    {review.comment && (
                      <p className="text-xs text-slate-650 leading-relaxed font-medium bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                        &quot;{review.comment}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-slate-100">
                  <Star size={24} className="stroke-[1.5]" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">No reviews yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">Once you complete jobs on WBSP and get rated by customers, your feedback record will be shown here.</p>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">App Settings</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Manage language preferences, availability, payment options, privacy controls, and more.
              </p>
              <Link
                href="/profile/settings"
                className="w-full py-3.5 bg-[#F08080] hover:bg-[#F08080]/90 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-[#F08080]/20 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Settings size={16} />
                Open Full Settings Center
              </Link>
            </div>

            {/* Quick settings preview */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
              {[
                { label: "Language & Region", desc: "Switch app language (13 languages supported)", emoji: "🌐" },
                { label: "Service Availability", desc: "Toggle job board visibility", emoji: "📍" },
                { label: "Notifications", desc: "Manage booking & message alerts", emoji: "🔔" },
                { label: "Privacy & Visibility", desc: "Control who sees your profile", emoji: "🔒" },
                { label: "Payment Preferences", desc: "UPI, Bank Transfer, or Cash", emoji: "💳" },
                { label: "Security", desc: "Password & device sessions", emoji: "🛡️" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href="/profile/settings"
                  className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.emoji}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.label}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* WORKER HELP/FAQ TAB */}
        {activeTab === "help" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Support & FAQs</h3>
            
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
              {[
                {
                  q: "How do I receive job requests?",
                  a: "Turn your Job Board Visibility ON. When customers nearby request services matching your category, you will receive push notifications. Go to the jobs panel to Accept."
                },
                {
                  q: "What is the OTP verification code?",
                  a: "When you arrive at the customer's location, ask for the start OTP from their screen. Enter it in your dashboard to begin the task. When completed, request the completion code."
                },
                {
                  q: "How do I get paid?",
                  a: "Once you complete the task and the customer verifies completion using their OTP code, the payment details are calculated and transferred directly to your balance."
                },
                {
                  q: "How do I edit my skills array?",
                  a: "Open the Professional Details tab and click Edit details. You can comma-separate your skills and list the languages you speak."
                }
              ].map((faq, index) => (
                <div key={index} className="p-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between text-left font-bold text-xs text-slate-750 hover:text-[#F08080] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight 
                      size={16} 
                      className={`text-slate-400 transition-transform ${
                        openFaq === index ? "rotate-90 text-[#F08080]" : ""
                      }`} 
                    />
                  </button>
                  {openFaq === index && (
                    <p className="mt-2.5 text-xs text-slate-500 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl text-white space-y-3.5 shadow-md">
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Partner Support Desk</h4>
                <p className="text-[11px] opacity-75 font-medium">Need help with a disputed payout or account issues? Contact our partner management office.</p>
              </div>
              <a 
                href="mailto:partners@wbsp-platform.com"
                className="block w-full py-2.5 text-center bg-[#F08080] hover:bg-[#F08080]/90 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Contact Partner Support
              </a>
            </div>
          </div>
        )}

        {/* WORKER RULES/GUIDELINES */}
        {activeTab === "about" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                📜 Professional Partner Guidelines
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">To maintain a high-quality marketplace environment and secure your payouts, all WBSP partner workers must abide by the following rules:</p>
              
              <ul className="space-y-2 pt-2">
                <li className="flex items-start gap-2 text-xs text-slate-650 font-medium">
                  <span className="text-[#F08080] shrink-0 font-bold">•</span>
                  <span><strong>OTP Verification:</strong> Always request the start code prior to beginning service. Never request the completion code before finishing the work.</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-slate-650 font-medium">
                  <span className="text-[#F08080] shrink-0 font-bold">•</span>
                  <span><strong>Pricing Honesty:</strong> Stick to quotes and platform-defined hourly rates. Overcharging will trigger review disputes and lead to suspension.</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-slate-650 font-medium">
                  <span className="text-[#F08080] shrink-0 font-bold">•</span>
                  <span><strong>Cancellation Limits:</strong> Limit cancelling accepted requests. Excess cancellation metrics affect your search matching rank.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* VERSION & SECURE LOG OUT */}
      <div className="flex justify-between items-center px-5 py-5 mt-auto border-t border-slate-100 bg-white">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">VERSION 0.1.0</span>
        <button 
          type="button"
          onClick={async () => {
            if (confirm("Are you sure you want to log out?")) {
              await handleLogoutAction();
            }
          }}
          className="text-[12px] text-[#F08080] hover:text-[#F08080]/80 font-black cursor-pointer uppercase tracking-wider flex items-center gap-1 transition-colors"
        >
          <LogOut size={13} />
          Log Out
        </button>
      </div>

      {/* EDIT PROFESSIONAL DETAILS SLIDE-UP MODAL */}
      {isEditModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#FCFDFD] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] flex flex-col border border-slate-200/50">
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="font-extrabold text-slate-800 text-[16px]">Edit Professional Profile</h3>
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-650 border border-slate-200/60 shadow-sm transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleUpdateInfo} className="p-5 overflow-y-auto space-y-4 flex-1">
                {editError && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 font-semibold">
                    {editError}
                  </div>
                )}
                {editSuccess && (
                  <div className="p-3 bg-green-50 text-green-600 text-xs rounded-xl border border-green-100 font-semibold">
                    Worker details updated successfully!
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] text-xs font-semibold text-slate-800 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] text-xs font-semibold text-slate-800 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Home Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. City Center, Metropolis"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] text-xs font-semibold text-slate-800 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Years Experience</label>
                    <input
                      type="number"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      min="0"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] text-xs font-semibold text-slate-800 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Hourly Rate ($)</label>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      min="0"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] text-xs font-semibold text-slate-800 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Service Location Address</label>
                  <input
                    type="text"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    placeholder="e.g. Downtown Metro"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] text-xs font-semibold text-slate-800 transition-all"
                  />
                </div>

                <div className="space-y-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <label className="text-xs font-bold text-slate-500 block mb-2">Category / Professions (Select all that apply)</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["Plumbing", "Electrical", "Cleaning", "AC Repair", "Painting", "Carpentry", "Pest Control", "Salon"].map((cat) => {
                      const isSelected = professions.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setProfessions(professions.filter(p => p !== cat));
                            } else {
                              setProfessions([...professions, cat]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            isSelected
                              ? "bg-[#F08080] text-white border-transparent shadow-sm"
                              : "bg-slate-50 border-slate-200/60 text-slate-650 hover:bg-slate-100"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Languages (Comma separated)</label>
                    <input
                      type="text"
                      value={languagesStr}
                      onChange={(e) => setLanguagesStr(e.target.value)}
                      placeholder="e.g. English, Spanish"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] text-xs font-semibold text-slate-800 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Working Hours</label>
                    <input
                      type="text"
                      value={workingHours}
                      onChange={(e) => setWorkingHours(e.target.value)}
                      placeholder="e.g. 9:00 AM - 5:00 PM"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] text-xs font-semibold text-slate-800 transition-all"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="pt-4 flex gap-3 border-t border-slate-100 bg-white">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 py-3 bg-[#F08080] hover:bg-[#F08080]/90 text-white font-bold rounded-xl text-xs transition-colors active:scale-[0.98] shadow-md shadow-[#F08080]/20 flex items-center justify-center gap-1.5 disabled:opacity-75"
                  >
                    {editLoading && <Loader2 size={14} className="animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

// Simple LogOut icon helper
function LogOut(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || "24"}
      height={props.size || "24"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}
