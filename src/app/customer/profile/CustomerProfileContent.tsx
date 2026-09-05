"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Settings, Briefcase, Heart, Star, Bell, HelpCircle, Info,
  Camera, Check, Lock, ChevronRight, Phone, MapPin, Calendar, X, Loader2, RefreshCw, ArrowLeft
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Portal from "@/components/Portal";
import { createClient } from "@/utils/supabase/client";
import CustomerSidebarDrawer from "@/components/CustomerSidebarDrawer";

interface CustomerProfileContentProps {
  dbUser: any;
  handleLogoutAction: () => Promise<void>;
}

export default function CustomerProfileContent({
  dbUser,
  handleLogoutAction
}: CustomerProfileContentProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [activeTab, setActiveTab] = useState<"account" | "bookings" | "saved" | "reviews" | "notifications" | "help" | "about" | "settings">("account");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(dbUser.image || "");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Form states
  const [name, setName] = useState(dbUser.name || "");
  const [phone, setPhone] = useState(dbUser.phone || "");
  const [address, setAddress] = useState(dbUser.address || "");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  // Password States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Notifications preferences states
  const [notifPrefs, setNotifPrefs] = useState({
    bookingNotifications: dbUser.bookingNotifications ?? true,
    messageNotifications: dbUser.messageNotifications ?? true,
    otpNotifications: dbUser.otpNotifications ?? true,
    marketingNotifications: dbUser.marketingNotifications ?? true,
  });

  // Collapsible FAQs state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  // Update Profile Info
  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(false);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address }),
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

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError(t("profilePage.passwordsNoMatch"));
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(t("profilePage.passwordShort"));
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

  // Toggle Notification preferences
  const handleTogglePref = async (key: keyof typeof notifPrefs) => {
    const updatedVal = !notifPrefs[key];
    setNotifPrefs(prev => ({ ...prev, [key]: updatedVal }));

    try {
      await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: updatedVal }),
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to update preference:", err);
    }
  };

  // Remove Saved Worker
  const handleRemoveSaved = async (workerId: string) => {
    try {
      const res = await fetch(`/api/profile/saved-workers?workerId=${workerId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to remove saved worker", err);
    }
  };

  // Calculation details
  const bookings = dbUser.bookings || [];
  const activeBookings = bookings.filter((b: any) => ["PENDING", "ACCEPTED", "IN_PROGRESS"].includes(b.status));
  const completedBookings = bookings.filter((b: any) => b.status === "COMPLETED");
  const cancelledBookings = bookings.filter((b: any) => b.status === "CANCELLED");

  // Unique list of previous workers hired (hired in completed bookings)
  const previousWorkers = Array.from(new Set(
    completedBookings.map((b: any) => b.workerId)
  )).map(id => {
    const b = completedBookings.find((bk: any) => bk.workerId === id);
    return b?.worker;
  }).filter(Boolean);

  const initials = (dbUser.name || "Customer").substring(0, 2).toUpperCase();
  const memberSince = dbUser.createdAt 
    ? new Date(dbUser.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : "2026";

  const savedWorkers = dbUser.savedWorkers || [];

  return (
    <div className="flex flex-col h-full bg-[#FCFDFD] font-sans pb-24">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-[#F08080]/15 to-transparent px-5 pt-8 pb-6 border-b border-gray-100/50">
        <div className="flex items-center gap-2 mb-4">
          <button 
            onClick={() => router.back()} 
            className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border-none bg-transparent"
            title="Go Back"
          >
            <ArrowLeft size={20} className="stroke-[2.5]" />
          </button>
          <CustomerSidebarDrawer />
          <span className="text-sm font-black text-slate-800 ml-1">My Profile</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-light to-primary flex items-center justify-center border-4 border-white shadow-xl shadow-primary/10 relative">
              {profileImage ? (
                <Image 
                  src={profileImage} 
                  alt="Profile" 
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[26px] font-black text-white">{initials}</span>
              )}
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-white hover:bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shadow-md text-gray-500 hover:text-primary transition-all active:scale-95"
            >
              <Camera size={14} />
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
              <h2 className="font-black text-[20px] text-slate-800 leading-tight">{dbUser.name}</h2>
              <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-md text-[10px] font-bold border border-green-100 uppercase tracking-wider flex items-center gap-0.5">
                <Check size={10} className="stroke-[3]" /> Verified
              </span>
            </div>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">{dbUser.email}</p>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-400 font-semibold">
              <Calendar size={12} className="text-slate-350" />
              <span>Member since {memberSince}</span>
            </div>
          </div>
        </div>

        {/* Edit profile buttons */}
        <div className="flex gap-2.5 mt-6">
          <button 
            type="button"
            onClick={() => {
              setName(dbUser.name || "");
              setPhone(dbUser.phone || "");
              setAddress(dbUser.address || "");
              setIsEditModalOpen(true);
            }}
            className="flex-1 py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-xl font-bold text-[13px] text-slate-700 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5"
          >
            <User size={14} className="text-slate-400" />
            Edit Account Details
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex gap-1.5 overflow-x-auto scrollbar-none sticky top-0 z-10">
        {[
          { id: "account", label: "Details", icon: <User size={14} /> },
          { id: "bookings", label: `Bookings (${bookings.length})`, icon: <Briefcase size={14} /> },
          { id: "saved", label: `Saved (${savedWorkers.length})`, icon: <Heart size={14} /> },
          { id: "reviews", label: `Reviews (${dbUser.reviewsGiven?.length || 0})`, icon: <Star size={14} /> },
          { id: "notifications", label: "Alerts", icon: <Bell size={14} /> },
          { id: "settings", label: "Settings", icon: <Settings size={14} /> },
          { id: "help", label: "Help", icon: <HelpCircle size={14} /> },
          { id: "about", label: "About", icon: <Info size={14} /> },
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
        {activeTab === "account" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.01)] space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">{t("profilePage.accountOverview")}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t("profilePage.fullName")}</label>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{dbUser.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t("profilePage.accountType")}</label>
                  <p className="text-sm font-bold text-[#F08080] mt-0.5 capitalize">{t("profilePage.customer")}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t("profilePage.registeredEmail")}</label>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{dbUser.email}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t("profilePage.phoneNumber")}</label>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{dbUser.phone || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t("profilePage.primaryLocation")}</label>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{dbUser.address || "Not provided"}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.01)]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4">{t("profilePage.security")}</h3>
              
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
                  <label className="text-[11px] font-semibold text-slate-500">{t("profilePage.newPassword")}</label>
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
                  <label className="text-[11px] font-semibold text-slate-500">{t("profilePage.confirmNewPassword")}</label>
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

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {/* Booking Counts Header */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-orange-50/40 border border-orange-100/50 p-3 rounded-2xl text-center">
                <span className="text-xl font-black text-orange-500 block">{activeBookings.length}</span>
                <span className="text-[10px] font-extrabold text-orange-600/80 uppercase tracking-wide">Active</span>
              </div>
              <div className="bg-green-50/40 border border-green-100/50 p-3 rounded-2xl text-center">
                <span className="text-xl font-black text-green-500 block">{completedBookings.length}</span>
                <span className="text-[10px] font-extrabold text-green-600/80 uppercase tracking-wide">Completed</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-center">
                <span className="text-xl font-black text-slate-500 block">{cancelledBookings.length}</span>
                <span className="text-[10px] font-extrabold text-slate-500/80 uppercase tracking-wide">Cancelled</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Link 
                href="/customer/jobs" 
                className="flex-1 py-3 text-center bg-[#F08080] hover:bg-[#F08080]/90 text-white font-bold rounded-xl text-xs shadow-md shadow-[#F08080]/10 transition-colors"
              >
                Track & View Bookings
              </Link>
            </div>

            {/* Rehire Workers list */}
            {previousWorkers.length > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                  🔄 Rehire Previous Workers
                </h3>
                <div className="divide-y divide-slate-50">
                  {previousWorkers.map((worker: any) => (
                    <div key={worker.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center text-slate-400 font-bold border border-slate-100">
                          {worker.user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <Image src={worker.user.image} alt={worker.user.name} width={40} height={40} className="w-full h-full object-cover" />
                          ) : (
                            worker.user.name.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{worker.user.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold capitalize">{worker.profession?.join(", ") || "General Worker"}</p>
                        </div>
                      </div>
                      <Link
                        href={`/customer/dashboard?workerId=${worker.id}`}
                        className="px-3 py-1.5 bg-[#F08080]/10 hover:bg-[#F08080] text-[#F08080] hover:text-white font-bold rounded-lg text-[10px] transition-all"
                      >
                        Hire Again
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SAVED WORKERS TAB */}
        {activeTab === "saved" && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Saved Favorites ({savedWorkers.length})</h3>
            
            {savedWorkers.length > 0 ? (
              <div className="space-y-3">
                {savedWorkers.map((save: any) => {
                  const worker = save.worker;
                  const nameInitials = worker.user.name.substring(0, 2).toUpperCase();
                  return (
                    <div 
                      key={save.id}
                      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-3 hover:border-slate-200 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center font-black text-slate-400 border border-slate-200/50">
                          {worker.user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <Image src={worker.user.image} alt={worker.user.name} width={48} height={48} className="w-full h-full object-cover" />
                          ) : (
                            nameInitials
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{worker.user.name}</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5 capitalize">{worker.profession?.join(", ") || "Worker"}</p>
                          <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[10px] mt-1.5 bg-amber-50 px-1.5 py-0.5 rounded-md w-max border border-amber-100/50">
                            <Star size={10} className="fill-amber-500 stroke-none" />
                            <span>{worker.rating?.toFixed(1) || "5.0"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 items-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveSaved(worker.id)}
                          className="text-[10px] text-slate-400 hover:text-red-500 font-bold flex items-center gap-0.5"
                        >
                          <X size={12} /> Remove
                        </button>
                        <Link
                          href={`/customer/dashboard?workerId=${worker.id}`}
                          className="px-3.5 py-2 bg-[#F08080] hover:bg-[#F08080]/90 text-white font-bold rounded-xl text-[10px] transition-colors shadow-sm shadow-[#F08080]/15"
                        >
                          Hire Again
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 bg-[#F08080]/5 text-[#F08080] rounded-full flex items-center justify-center mx-auto mb-3.5 border border-[#F08080]/10">
                  <Heart size={24} className="stroke-[1.5]" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{t("profilePage.noSavedWorkers")}</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">{t("profilePage.noSavedWorkersDesc")}</p>
                <Link href="/customer/dashboard" className="mt-4 inline-block bg-[#F08080]/10 hover:bg-[#F08080] text-[#F08080] hover:text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all">
                  Find Workers
                </Link>
              </div>
            )}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t("profilePage.myReviewsAndRatings")}</h3>
            
            {dbUser.reviewsGiven && dbUser.reviewsGiven.length > 0 ? (
              <div className="space-y-3">
                {dbUser.reviewsGiven.map((review: any) => (
                  <div key={review.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F08080]/10 flex items-center justify-center text-xs font-black text-[#F08080]">
                          {review.worker.user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{review.worker.user.name}</p>
                          <p className="text-[9px] text-slate-400 font-medium capitalize">{review.worker.profession?.join(", ")}</p>
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
                          size={12} 
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
                <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-amber-100">
                  <Star size={24} className="stroke-[1.5]" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{t("profilePage.noReviewsSubmitted")}</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">{t("profilePage.noReviewsDesc")}</p>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">{t("profilePage.appSettings")}</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Manage language preferences, appearance, privacy controls, notifications, and more.
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
                { label: "Language & Region", desc: "Switch app language", emoji: "🌐" },
                { label: "Notifications", desc: "Manage alert preferences", emoji: "🔔" },
                { label: "Privacy & Visibility", desc: "Control who sees your profile", emoji: "🔒" },
                { label: "Appearance", desc: "Theme, text size, contrast", emoji: "🎨" },
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

        {/* NOTIFICATIONS SETTINGS */}
        {activeTab === "notifications" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t("profilePage.notificationPreferences")}</h3>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              {[
                { 
                  key: "bookingNotifications", 
                  title: "Booking Updates", 
                  desc: "Notifications for request acceptance, schedules, and completion." 
                },
                { 
                  key: "messageNotifications", 
                  title: "Message Alerts", 
                  desc: "Get notified when a worker sends you a direct message." 
                },
                { 
                  key: "otpNotifications", 
                  title: "OTP Notifications", 
                  desc: "One-Time Password alerts for secure job verification." 
                },
                { 
                  key: "marketingNotifications", 
                  title: "Review Reminders & Promos", 
                  desc: "Reminders to rate completed jobs and discount notifications." 
                },
              ].map((pref) => (
                <div key={pref.key} className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800">{pref.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold leading-normal max-w-xs">{pref.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePref(pref.key as any)}
                    className={`w-11 h-6 rounded-full relative transition-all duration-300 ${
                      notifPrefs[pref.key as keyof typeof notifPrefs] 
                        ? "bg-[#F08080]" 
                        : "bg-slate-200"
                    }`}
                  >
                    <div 
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm ${
                        notifPrefs[pref.key as keyof typeof notifPrefs] 
                          ? "right-1" 
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HELP CENTER TAB */}
        {activeTab === "help" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t("profilePage.helpDeskFaq")}</h3>
            
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
              {[
                {
                  q: "How do I request a worker?",
                  a: "Navigate to the home screen or click Explore. Select your category, detail your needs, specify a budget, and submit the request. Available workers will review it."
                },
                {
                  q: "How is payment handled?",
                  a: "Payments are processed securely through the platform. Payment is completed after the worker completes the task and you verify with the OTP."
                },
                {
                  q: "What if the worker does not show up?",
                  a: "If a worker fails to show up for an accepted booking, you can cancel the job directly from the Bookings page and hire another provider."
                },
                {
                  q: "How do I verify the service starting?",
                  a: "Your worker will request a starting OTP code which is displayed under the booking details screen. Share this only when they arrive at the site."
                }
              ].map((faq, index) => (
                <div key={index} className="p-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between text-left font-bold text-xs text-slate-700 hover:text-[#F08080] transition-colors"
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

            <div className="bg-slate-55 bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl text-white space-y-3.5 shadow-md">
              <div className="space-y-1">
                <h4 className="font-bold text-sm">{t("profilePage.needSupport")}</h4>
                <p className="text-[11px] opacity-75 font-medium">{t("profilePage.needSupportDesc")}</p>
              </div>
              <div className="flex gap-2">
                <a 
                  href="mailto:support@wbsp-platform.com"
                  className="flex-1 py-2 text-center bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold rounded-xl text-xs transition-colors"
                >
                  Email Support
                </a>
                <button 
                  type="button"
                  onClick={() => alert("Live Chat Support is under scheduled construction. Coming in version 0.2.0!")}
                  className="flex-1 py-2 text-center bg-[#F08080] hover:bg-[#F08080]/90 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Start Live Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === "about" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 text-center">
              <div className="w-16 h-16 bg-[#F08080]/10 rounded-2xl flex items-center justify-center text-[#F08080] mx-auto border border-[#F08080]/15">
                <span className="text-2xl font-black">🛠️</span>
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-base">{t("profilePage.wbspPlatform")}</h4>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">{t("profilePage.findHire")}</p>
              </div>
              
              <div className="pt-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Version 0.1.0 (Stable)
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
              <button 
                type="button"
                onClick={() => alert("Privacy Policy details will be available soon.")}
                className="w-full py-3.5 flex justify-between items-center text-left text-xs font-bold text-slate-700 hover:text-[#F08080]"
              >
                <span>{t("profilePage.privacyPolicy")}</span>
                <ChevronRight size={14} className="text-slate-400" />
              </button>
              <button 
                type="button"
                onClick={() => alert("Terms of Service details will be available soon.")}
                className="w-full py-3.5 flex justify-between items-center text-left text-xs font-bold text-slate-700 hover:text-[#F08080]"
              >
                <span>{t("profilePage.termsConditions")}</span>
                <ChevronRight size={14} className="text-slate-400" />
              </button>
              <button 
                type="button"
                onClick={() => alert("This application matches customer booking requests with certified professionals near you.")}
                className="w-full py-3.5 flex justify-between items-center text-left text-xs font-bold text-slate-700 hover:text-[#F08080]"
              >
                <span>{t("profilePage.aboutPlatform2")}</span>
                <ChevronRight size={14} className="text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VERSION & SECURE LOG OUT */}
      <div className="flex justify-between items-center px-5 py-5 mt-auto border-t border-slate-100 bg-white">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">VERSION 0.1.0</span>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-[12px] text-primary hover:text-primary-light font-black cursor-pointer uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={13} />
            Switch Role
          </Link>
          <span className="text-slate-200 text-xs">|</span>
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
      </div>

      {/* EDIT PROFILE SLIDE-UP MODAL */}
      {isEditModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#FCFDFD] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] flex flex-col border border-slate-200/50">
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="font-extrabold text-slate-800 text-[16px]">{t("profilePage.editAccountDetails")}</h3>
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
                    Profile details updated successfully!
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Registered Email (Cannot be changed)</label>
                  <input
                    type="email"
                    value={dbUser.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">{t("profilePage.fullName")}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] text-xs font-semibold text-slate-800 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">{t("profilePage.phoneNumber")}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 890"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] text-xs font-semibold text-slate-800 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Address (Preferred Location)</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. City Center, Metropolis"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F08080]/20 focus:border-[#F08080] text-xs font-semibold text-slate-800 transition-all"
                  />
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
