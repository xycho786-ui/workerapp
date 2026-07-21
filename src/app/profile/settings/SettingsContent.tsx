"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Globe, Bell, Shield, Lock, Eye, Key, Moon, HelpCircle, Info, 
  Smartphone, Award, DollarSign, Heart, Sparkles, Check, ChevronRight, X, Loader2 
} from "lucide-react";
import Link from "next/link";
import Portal from "@/components/Portal";
import { useLanguage } from "@/context/LanguageContext";
import { Language, LANGUAGES } from "@/locales";
import { createClient } from "@/utils/supabase/client";

interface SettingsContentProps {
  dbUser: any;
  handleLogoutAction: () => Promise<void>;
}

export default function SettingsContent({ dbUser, handleLogoutAction }: SettingsContentProps) {
  const router = useRouter();
  const supabase = createClient();
  const { t, language, setLanguage } = useLanguage();

  const workerProfile = dbUser.workerProfile;
  const isWorker = false;

  // Language Drawer State
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  // Notification Preferences States
  const [bookingNotifs, setBookingNotifs] = useState(dbUser.bookingNotifications ?? true);
  const [chatNotifs, setChatNotifs] = useState(dbUser.messageNotifications ?? true);
  const [otpNotifs, setOtpNotifs] = useState(dbUser.otpNotifications ?? true);
  const [reviewNotifs, setReviewNotifs] = useState(dbUser.reviewNotifications ?? true);
  const [promoNotifs, setPromoNotifs] = useState(dbUser.promotionalNotifications ?? true);
  const [systemNotifs, setSystemNotifs] = useState(dbUser.systemNotifications ?? true);

  // Appearance & Accessibility States
  const [themeMode, setThemeMode] = useState(dbUser.theme || "light");
  const [fontSize, setFontSize] = useState(dbUser.fontSize || "medium");
  const [reducedAnims, setReducedAnims] = useState(dbUser.reducedAnimations ?? false);
  const [highContrast, setHighContrast] = useState(dbUser.highContrast ?? false);

  // Privacy States
  const [profileVisible, setProfileVisible] = useState(dbUser.profileVisible ?? true);
  const [locationSharing, setLocationSharing] = useState(dbUser.locationSharing ?? true);
  const [showOnline, setShowOnline] = useState(dbUser.showOnlineStatus ?? true);

  // Password States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Customer specific states
  const [preferredCats, setPreferredCats] = useState<string[]>(dbUser.preferredCategories || []);
  const [favServices, setFavServices] = useState<string[]>(dbUser.favoriteServices || []);

  // Worker specific states
  const [serviceAvail, setServiceAvail] = useState(workerProfile?.serviceAvailability ?? true);
  const [serviceAreas, setServiceAreas] = useState<string[]>(workerProfile?.serviceAreas || []);
  const [paymentPref, setPaymentPref] = useState(workerProfile?.paymentPreference || "BANK_TRANSFER");
  const [newArea, setNewArea] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Select Language Action
  const handleSelectLanguage = async (code: Language) => {
    await setLanguage(code);
    setIsLanguageOpen(false);
    router.refresh();
  };

  // Generic Update API trigger
  const handleTogglePreference = async (key: string, value: any) => {
    try {
      await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
      router.refresh();
    } catch (err) {
      console.error(`Failed to update ${key}:`, err);
    }
  };

  // Save Settings Form
  const handleSaveAllSettings = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const payload: any = {
        theme: themeMode,
        fontSize,
        reducedAnimations: reducedAnims,
        highContrast,
        profileVisible,
        locationSharing,
        showOnlineStatus: showOnline,
        preferredCategories: preferredCats,
        favoriteServices: favServices,
        bookingNotifications: bookingNotifs,
        messageNotifications: chatNotifs,
        otpNotifications: otpNotifs,
        reviewNotifications: reviewNotifs,
        promotionalNotifications: promoNotifs,
        systemNotifications: systemNotifs,
      };

      if (isWorker) {
        payload.serviceAvailability = serviceAvail;
        payload.serviceAreas = serviceAreas;
        payload.paymentPreference = paymentPref;
      }

      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save preferences");
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      router.refresh();
    } catch (e) {
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  // Change Password Action
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

  // Add Service Area
  const handleAddArea = () => {
    if (newArea.trim() && !serviceAreas.includes(newArea.trim())) {
      const updated = [...serviceAreas, newArea.trim()];
      setServiceAreas(updated);
      handleTogglePreference("serviceAreas", updated);
      setNewArea("");
    }
  };

  // Remove Service Area
  const handleRemoveArea = (area: string) => {
    const updated = serviceAreas.filter(a => a !== area);
    setServiceAreas(updated);
    handleTogglePreference("serviceAreas", updated);
  };

  // Toggle Preferred Categories (Customer)
  const handleTogglePrefCat = (cat: string) => {
    const updated = preferredCats.includes(cat)
      ? preferredCats.filter(c => c !== cat)
      : [...preferredCats, cat];
    setPreferredCats(updated);
    handleTogglePreference("preferredCategories", updated);
  };

  const activeLangLabel = LANGUAGES.find((l: { code: Language; label: string }) => l.code === language)?.label || "English";

  return (
    <div className={`flex flex-col h-full bg-[#FCFDFD] font-sans pb-24 text-slate-800 ${fontSize === 'large' ? 'text-lg' : fontSize === 'small' ? 'text-xs' : 'text-sm'}`}>
      {/* Header */}
      <header className="flex items-center px-4 py-4 bg-white sticky top-0 z-10 border-b border-gray-100/80 shadow-sm/5">
        <button 
          onClick={() => router.back()} 
          className="p-2 -ml-2 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-[17px] font-black text-slate-800 ml-2 uppercase tracking-wide">
          {t("settings.title", "Settings")}
        </h1>
      </header>

      {/* Main Settings Menu */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {saveSuccess && (
          <div className="p-3 bg-green-50 text-green-600 text-xs border border-green-100 rounded-xl font-bold text-center">
            ✔ {t("common.success", "Settings saved successfully!")}
          </div>
        )}

        {/* 1. LANGUAGE SETTINGS */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-1">
            {t("settings.language", "Language Settings")}
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => setIsLanguageOpen(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F08080] flex items-center justify-center border border-orange-100/50">
                  <Globe size={18} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-850">{t("settings.selectLanguage", "App Language")}</p>
                  <p className="text-[11px] text-[#F08080] font-black mt-0.5">{activeLangLabel}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        </section>

        {/* BILLING & INVOICES */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-1">
            Billing & Invoices
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <Link 
              href={dbUser.role === "ADMIN" ? "/admin/invoices" : isWorker ? "/worker/invoices" : "/customer/invoices"}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-650 flex items-center justify-center border border-emerald-100/50">
                  <DollarSign size={18} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-850">My Invoices</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">View and download payment receipts</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </Link>
          </div>
        </section>

        {/* 2. NOTIFICATIONS */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-1">
            {t("settings.notifications", "Notifications")}
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
            {[
              { 
                state: bookingNotifs, 
                set: setBookingNotifs, 
                key: "bookingNotifications", 
                title: t("settingsNotifications.bookingUpdates", "Booking Updates"), 
                desc: t("settingsNotifications.bookingUpdatesDesc", "Alerts for request matches, accepts, and verification OTPs.") 
              },
              { 
                state: chatNotifs, 
                set: setChatNotifs, 
                key: "messageNotifications", 
                title: t("settingsNotifications.directMessages", "Direct Messages"), 
                desc: t("settingsNotifications.directMessagesDesc", "Get notified when a client/worker sends a chat message.") 
              },
              { 
                state: otpNotifs, 
                set: setOtpNotifs, 
                key: "otpNotifications", 
                title: t("settingsNotifications.securityOtps", "Security OTPs"), 
                desc: t("settingsNotifications.securityOtpsDesc", "One-Time Password prompts during check-in/out.") 
              },
              { 
                state: reviewNotifs, 
                set: setReviewNotifs, 
                key: "reviewNotifications", 
                title: t("settingsNotifications.reviewReminders", "Review Reminders"), 
                desc: t("settingsNotifications.reviewRemindersDesc", "Prompt notifications to rate completed work.") 
              },
              { 
                state: promoNotifs, 
                set: setPromoNotifs, 
                key: "promotionalNotifications", 
                title: t("settingsNotifications.promosDiscounts", "Promos & Discounts"), 
                desc: t("settingsNotifications.promosDiscountsDesc", "Marketing notifications, voucher codes, and special campaigns.") 
              },
              { 
                state: systemNotifs, 
                set: setSystemNotifs, 
                key: "systemNotifications", 
                title: t("settingsNotifications.systemBulletins", "System Bulletins"), 
                desc: t("settingsNotifications.systemBulletinsDesc", "Important platform downtime or guidelines notices.") 
              },
            ].map((item) => (
              <div key={item.key} className="flex items-start justify-between gap-4 p-4">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold leading-normal max-w-xs">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !item.state;
                    item.set(next);
                    handleTogglePreference(item.key, next);
                  }}
                  className={`w-11 h-6 rounded-full relative shrink-0 transition-all duration-300 ${
                    item.state ? "bg-[#F08080]" : "bg-slate-200"
                  }`}
                >
                  <div 
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm ${
                      item.state ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 3. APPEARANCE SETTINGS */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-1">
            {t("settings.appearance", "Appearance")}
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100/50">
                  <Moon size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{t("settings.themeMode", "Theme Mode")}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{themeMode}</p>
                </div>
              </div>
              
              <div className="flex gap-1.5">
                {["light", "dark", "system"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setThemeMode(mode);
                      handleTogglePreference("theme", mode);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${
                      themeMode === mode 
                        ? "bg-slate-800 text-white border-slate-900 shadow-sm" 
                        : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                    }`}
                  >
                    {t(`settingsTheme.${mode}`, mode)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. CUSTOMER-SPECIFIC PREFERENCES */}
        {!isWorker && (
          <section className="space-y-2">
            <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-1">
              {t("settings.customerSettings", "Booking Preferences")}
            </h2>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider block">
                  Preferred Services
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["Plumbing", "Electrical", "Cleaning", "AC Repair", "Painting", "Carpentry", "Pest Control", "Salon"].map((cat) => {
                    const isSelected = preferredCats.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleTogglePrefCat(cat)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                          isSelected 
                            ? "bg-[#F08080]/15 text-[#F08080] border-[#F08080]/30" 
                            : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 5. WORKER-SPECIFIC PREFERENCES */}
        {isWorker && (
          <section className="space-y-2">
            <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-1">
              {t("settings.workerSettings", "Worker Preferences")}
            </h2>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
              {/* Availability */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">{t("settings.serviceAvail", "Service Availability")}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Toggle active scheduling options on the map.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !serviceAvail;
                    setServiceAvail(next);
                    handleTogglePreference("serviceAvailability", next);
                  }}
                  className={`w-11 h-6 rounded-full relative shrink-0 transition-all duration-300 ${
                    serviceAvail ? "bg-green-500" : "bg-slate-200"
                  }`}
                >
                  <div 
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm ${
                      serviceAvail ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Service Areas */}
              <div className="space-y-2 border-b border-slate-50 pb-4">
                <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider block">
                  {t("settings.areas", "Service Locations / Covered Areas")}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    placeholder="Enter city area..."
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#F08080]"
                  />
                  <button
                    type="button"
                    onClick={handleAddArea}
                    className="px-3 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors active:scale-95"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {serviceAreas.length > 0 ? (
                    serviceAreas.map((area) => (
                      <span 
                        key={area} 
                        className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-100 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        {area}
                        <button 
                          onClick={() => handleRemoveArea(area)}
                          className="w-3.5 h-3.5 hover:bg-slate-200 text-slate-400 hover:text-red-500 rounded flex items-center justify-center font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium italic">No covered service areas specified.</span>
                  )}
                </div>
              </div>

              {/* Payment Preferences */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider block">
                  {t("settings.payment", "Payment Preferences")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "BANK_TRANSFER", label: "Bank Transfer" },
                    { id: "UPI", label: "UPI" },
                    { id: "CASH", label: "Cash Only" },
                  ].map((p) => {
                    const isSel = paymentPref === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setPaymentPref(p.id);
                          handleTogglePreference("paymentPreference", p.id);
                        }}
                        className={`py-2 rounded-xl text-[10px] font-black border transition-all ${
                          isSel 
                            ? "bg-[#F08080] text-white border-transparent shadow-sm" 
                            : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 6. PRIVACY */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-1">
            {t("settings.privacy", "Privacy Settings")}
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
            {[
              { 
                state: profileVisible, 
                set: setProfileVisible, 
                key: "profileVisible", 
                title: "Public Profile visibility", 
                desc: "Let nearby customers/workers find your name in listings." 
              },
              { 
                state: locationSharing, 
                set: setLocationSharing, 
                key: "locationSharing", 
                title: "Live GPS Location Sharing", 
                desc: "Permit the app to match job requests using precise latitude." 
              },
              { 
                state: showOnline, 
                set: setShowOnline, 
                key: "showOnlineStatus", 
                title: "Online status indicator", 
                desc: "Show online green dots on chat boxes and map points." 
              },
            ].map((item) => (
              <div key={item.key} className="flex items-start justify-between gap-4 p-4">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold leading-normal max-w-xs">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !item.state;
                    item.set(next);
                    handleTogglePreference(item.key, next);
                  }}
                  className={`w-11 h-6 rounded-full relative shrink-0 transition-all duration-300 ${
                    item.state ? "bg-[#F08080]" : "bg-slate-200"
                  }`}
                >
                  <div 
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm ${
                      item.state ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 7. ACCESSIBILITY */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-1">
            {t("settings.accessibility", "Accessibility")}
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
            {/* Font size */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800">{t("settings.textSize", "Text Size")}</h4>
                <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{fontSize}</p>
              </div>
              <div className="flex gap-1">
                {["small", "medium", "large"].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setFontSize(sz);
                      handleTogglePreference("fontSize", sz);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${
                      fontSize === sz 
                        ? "bg-slate-800 text-white border-slate-900 shadow-sm" 
                        : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Reduced animations switch */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800">{t("settings.reducedAnim", "Reduced Motion")}</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Simplify dashboard slide actions.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !reducedAnims;
                  setReducedAnims(next);
                  handleTogglePreference("reducedAnimations", next);
                }}
                className={`w-11 h-6 rounded-full relative shrink-0 transition-all duration-300 ${
                  reducedAnims ? "bg-[#F08080]" : "bg-slate-200"
                }`}
              >
                <div 
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm ${
                    reducedAnims ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800">{t("settings.highContrast", "High Contrast Mode")}</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Make text outlines more pronounced.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !highContrast;
                  setHighContrast(next);
                  handleTogglePreference("highContrast", next);
                }}
                className={`w-11 h-6 rounded-full relative shrink-0 transition-all duration-300 ${
                  highContrast ? "bg-[#F08080]" : "bg-slate-200"
                }`}
              >
                <div 
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm ${
                    highContrast ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* 8. SECURITY CENTER */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-1">
            {t("settings.security", "Security Center")}
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
            <form onSubmit={handleChangePassword} className="space-y-3.5 border-b border-slate-50 pb-4">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Change Password</h3>
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
                <label className="text-[10px] font-bold text-slate-450">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F08080] text-xs font-semibold"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-450">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F08080] text-xs font-semibold"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-75"
              >
                <Lock size={12} />
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </form>

            <div className="space-y-3 pt-1">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Device & Session Management</h3>
              
              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                <Smartphone className="w-5 h-5 text-slate-450 shrink-0 mt-0.5" />
                <div className="space-y-0.5 flex-1">
                  <p className="text-xs font-bold text-slate-800">Chrome on Windows (Current Session)</p>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">Active Session • Delhi, India</p>
                </div>
                <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-100 rounded-md text-[8px] font-extrabold uppercase">
                  This Device
                </span>
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (confirm("Are you sure you want to log out from all devices?")) {
                    await handleLogoutAction();
                  }
                }}
                className="w-full py-2.5 text-center text-xs font-bold text-red-500 bg-red-50/30 hover:bg-red-50 border border-red-100/50 rounded-xl transition-all active:scale-[0.98]"
              >
                Logout from All Devices
              </button>
            </div>
          </div>
        </section>

        {/* 9. HELP & SUPPORT */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-1">
            {t("settings.help", "Help & Support")}
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
            {[
              {
                q: "How to update location details?",
                a: "Go to Profile settings, edit details and modify Home Address. Check Location Sharing in Privacy settings to allow automated location matching."
              },
              {
                q: "How do I edit my service rate?",
                a: "If you are registered as a service worker, open Professional Details in Settings (or Profile), edit details, and modify Hourly Rate field."
              }
            ].map((faq, idx) => (
              <div key={idx} className="border-b border-slate-50 last:border-b-0 pb-3 last:pb-0">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:text-[#F08080]"
                >
                  <span>{faq.q}</span>
                  <ChevronRight size={14} className={`text-slate-400 transition-transform ${openFaq === idx ? 'rotate-90 text-[#F08080]' : ''}`} />
                </button>
                {openFaq === idx && (
                  <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 10. ABOUT */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-1">
            {t("settings.about", "About")}
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#F08080] flex items-center justify-center mx-auto border border-orange-100/50 font-black text-xl">
              🛠️
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">WBSP Platform</h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Version 0.1.0 (Build 2026.06.01)</p>
            </div>
          </div>
        </section>

        {/* Global Save Button */}
        <button
          type="button"
          onClick={handleSaveAllSettings}
          disabled={saving}
          className="w-full mt-4 py-3.5 bg-[#F08080] hover:bg-[#F08080]/90 text-white font-bold rounded-2xl text-xs transition-colors shadow-md shadow-[#F08080]/20 flex items-center justify-center gap-1.5 disabled:opacity-75 active:scale-[0.98]"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {t("settings.saveChanges", "Save Preferences")}
        </button>

      </main>

      {/* LANGUAGE SELECTOR DRAWER */}
      {isLanguageOpen && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#FCFDFD] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-h-[80vh] flex flex-col border border-slate-200/50">
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="font-extrabold text-slate-800 text-[15px]">{t("settings.selectLanguage", "Select Language")}</h3>
                <button 
                  type="button" 
                  onClick={() => setIsLanguageOpen(false)}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-650 border border-slate-200/60 shadow-sm transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Languages Grid */}
              <div className="p-4 overflow-y-auto space-y-2 flex-1">
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang: { code: Language; label: string }) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all hover:scale-[1.01] active:scale-[0.98] ${
                          isSelected
                            ? "bg-gradient-to-br from-[#F08080] to-[#F4978E] border-transparent text-white shadow-md shadow-[#F08080]/15"
                            : "bg-white border-slate-100 text-slate-700 hover:border-[#F08080]/20 hover:shadow-sm"
                        }`}
                      >
                        <span className="text-xs font-bold">{lang.label}</span>
                        {isSelected && (
                          <div className="w-4 h-4 bg-white text-[#F08080] rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-200 shrink-0 ml-1.5">
                            <Check size={9} className="stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
