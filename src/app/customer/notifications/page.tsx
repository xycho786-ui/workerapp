"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  Calendar, 
  MessageSquare, 
  Lock, 
  DollarSign, 
  Star, 
  Info, 
  Check, 
  CheckCheck,
  RefreshCw,
  Loader2,
  ChevronRight,
  X
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  category: string;
  relatedId: string | null;
  isRead: boolean;
  createdAt: string;
}

export default function CustomerNotificationsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const categories = ["All", "Bookings", "Messages", "OTP", "Payments", "Reviews", "System"];

  async function fetchNotifications(silent = false) {
    if (!silent) setIsLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error("Failed to fetch notifications:", e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
    // Poll every 5 seconds to keep notifications updated in real-time
    const interval = setInterval(() => fetchNotifications(true), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true })
      });
    } catch (e) {
      console.error("Failed to mark all as read:", e);
    }
  };

  const handleNotificationTap = async (notif: Notification) => {
    // Mark as read in state
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    
    // Mark as read in DB
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: notif.id })
      });
    } catch (e) {
      console.error("Failed to mark notification as read:", e);
    }

    // Set selected notification to display details modal
    setSelectedNotification(notif);
  };

  // Helper for notification icons and styling based on category
  const getNotificationIconDetails = (category: string) => {
    switch ((category || "SYSTEM").toUpperCase()) {
      case "BOOKINGS":
        return {
          icon: <Calendar size={16} />,
          bgColor: "bg-blue-50 text-blue-600 border border-blue-100/50"
        };
      case "MESSAGES":
        return {
          icon: <MessageSquare size={16} />,
          bgColor: "bg-indigo-50 text-indigo-600 border border-indigo-100/50"
        };
      case "OTP":
        return {
          icon: <Lock size={16} />,
          bgColor: "bg-emerald-50 text-emerald-600 border border-emerald-100/50"
        };
      case "PAYMENTS":
        return {
          icon: <DollarSign size={16} />,
          bgColor: "bg-teal-50 text-teal-600 border border-teal-100/50"
        };
      case "REVIEWS":
        return {
          icon: <Star size={16} />,
          bgColor: "bg-amber-50 text-amber-500 border border-amber-100/50"
        };
      default:
        return {
          icon: <Info size={16} />,
          bgColor: "bg-slate-50 text-slate-600 border border-slate-100"
        };
    }
  };

  // Human-readable timestamps (e.g., "3m ago", "1h ago")
  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      
      let interval = Math.floor(seconds / 31536000);
      if (interval >= 1) return `${interval}y ago`;
      
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) return `${interval}mo ago`;
      
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) return `${interval}d ago`;
      
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) return `${interval}h ago`;
      
      interval = Math.floor(seconds / 60);
      if (interval >= 1) return `${interval}m ago`;
      
      return "Just now";
    } catch {
      return "";
    }
  };

  // Filter notifications in-memory
  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === "All") return true;
    return (notif.category || "SYSTEM").toUpperCase() === activeTab.toUpperCase();
  });

  const unreadCount = filteredNotifications.filter(n => !n.isRead).length;

  return (
    <div className="flex flex-col h-full bg-[#F8F9FC] font-sans pb-28 min-h-screen">
      
      {/* 1. Header Area */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sticky top-0 z-40 border-b border-[#F0F0F0] flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-black text-[#1A2340] tracking-tight">{t("notificationsPage.notifications")}</h1>
            <p className="text-xs text-[#888BA0] font-semibold mt-1">
              Stay updated on your bookings and activity.
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsRefreshing(true);
                fetchNotifications();
              }}
              disabled={isRefreshing}
              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl transition-all border border-slate-200/50 cursor-pointer flex items-center justify-center"
              title="Refresh"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            </button>
            
            {notifications.some(n => !n.isRead) && (
              <button
                onClick={handleMarkAllRead}
                className="px-3 py-2 bg-[#1A2340] hover:bg-[#2D3F6A] text-white font-extrabold rounded-xl text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
              >
                <CheckCheck size={13} />
                Mark Read
              </button>
            )}
          </div>
        </div>

        {/* Categories Tab Scrollbar */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-1">
          {categories.map((t) => {
            const isActive = activeTab === t;
            // Get count of unread within this category
            const countInCategory = notifications.filter(
              n => !n.isRead && (t === "All" || (n.category || "SYSTEM").toUpperCase() === t.toUpperCase())
            ).length;

            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-1.5 rounded-full border-none cursor-pointer font-bold text-[11px] whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive 
                    ? "bg-[#1A2340] text-white shadow-sm" 
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                <span>{t}</span>
                {countInCategory > 0 && (
                  <span className={`text-[8px] font-black rounded-full px-1.5 py-0.5 flex items-center justify-center ${
                    isActive ? "bg-[#E8514A] text-white" : "bg-red-100 text-red-600"
                  }`}>
                    {countInCategory}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Notifications List */}
      <div className="flex-1 p-4 space-y-3.5">
        {isLoading ? (
          // Skeleton loader state
          <div className="space-y-3.5">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex gap-3.5 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0"></div>
                <div className="flex-1 space-y-2 mt-1">
                  <div className="h-3.5 bg-slate-150 rounded w-[60%]"></div>
                  <div className="h-3 bg-slate-100 rounded w-[90%]"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.01)] text-center flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-5 text-[#888BA0] opacity-80 shadow-inner">
              <Bell size={34} className="stroke-[1.5]" />
            </div>
            <h3 className="font-extrabold text-[#1A2340] text-[15px] mb-1.5">{t("notificationsPage.noNotificationsYet")}</h3>
            <p className="text-xs text-[#888BA0] font-medium max-w-[240px] leading-relaxed">
              We'll notify you when new activity occurs. Keep working on bookings!
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredNotifications.map((notif) => {
              const { icon, bgColor } = getNotificationIconDetails(notif.category);
              
              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationTap(notif)}
                  className={`bg-white rounded-2xl p-4 border flex items-start gap-3.5 cursor-pointer relative overflow-hidden transition-all hover:translate-x-0.5 active:scale-[0.99] group ${
                    notif.isRead 
                      ? "border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)]" 
                      : "border-slate-100 shadow-[0_4px_16px_rgba(232,81,74,0.04)] bg-gradient-to-r from-white to-[#E8514A]/1"
                  }`}
                >
                  {/* Visual Unread Bar Indicator */}
                  {!notif.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E8514A]"></div>
                  )}

                  {/* Circular Styled Category Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${bgColor}`}>
                    {icon}
                  </div>

                  {/* Body Text Content */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className={`text-xs truncate pr-3 ${notif.isRead ? "font-bold text-slate-700" : "font-black text-[#1A2340]"}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">
                        {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${notif.isRead ? "text-slate-500 font-medium" : "text-slate-700 font-bold"}`}>
                      {notif.message}
                    </p>

                    {/* Quick navigation label badge */}
                    {notif.relatedId && (
                      <div className="flex items-center gap-0.5 text-[9px] font-black text-[#1A2340] uppercase tracking-wide mt-2">
                        View Details <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    )}
                  </div>

                  {/* Small unread circle indicator */}
                  {!notif.isRead && (
                    <span className="w-2 h-2 bg-[#E8514A] rounded-full mt-1.5 flex-shrink-0 animate-ping"></span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notification Details Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Category Gradient Header */}
            <div className={`p-6 text-white flex flex-col items-center justify-center relative bg-gradient-to-br ${
              selectedNotification.category.toUpperCase() === "BOOKINGS" ? "from-blue-500 to-indigo-600" :
              selectedNotification.category.toUpperCase() === "MESSAGES" ? "from-indigo-500 to-purple-600" :
              selectedNotification.category.toUpperCase() === "OTP" ? "from-emerald-400 to-teal-600" :
              selectedNotification.category.toUpperCase() === "PAYMENTS" ? "from-teal-400 to-emerald-600" :
              selectedNotification.category.toUpperCase() === "REVIEWS" ? "from-amber-400 to-orange-500" :
              "from-slate-600 to-slate-700"
            }`}>
              <button 
                onClick={() => setSelectedNotification(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white border-none cursor-pointer transition-colors"
              >
                <X size={14} />
              </button>
              
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#1A2340] mb-3 shadow-md">
                {selectedNotification.category.toUpperCase() === "BOOKINGS" && <Calendar size={24} className="text-blue-600" />}
                {selectedNotification.category.toUpperCase() === "MESSAGES" && <MessageSquare size={24} className="text-indigo-600" />}
                {selectedNotification.category.toUpperCase() === "OTP" && <Lock size={24} className="text-emerald-600" />}
                {selectedNotification.category.toUpperCase() === "PAYMENTS" && <DollarSign size={24} className="text-teal-600" />}
                {selectedNotification.category.toUpperCase() === "REVIEWS" && <Star size={24} className="text-amber-500 fill-amber-500" />}
                {selectedNotification.category.toUpperCase() !== "BOOKINGS" && 
                 selectedNotification.category.toUpperCase() !== "MESSAGES" && 
                 selectedNotification.category.toUpperCase() !== "OTP" && 
                 selectedNotification.category.toUpperCase() !== "PAYMENTS" && 
                 selectedNotification.category.toUpperCase() !== "REVIEWS" && <Info size={24} className="text-slate-600" />}
              </div>
              
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
                {selectedNotification.category}
              </span>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-base font-black text-[#1A2340] leading-tight">
                  {selectedNotification.title}
                </h3>
                <span className="text-[10px] font-bold text-slate-400 block mt-1">
                  Received {formatTimeAgo(selectedNotification.createdAt)} ({new Date(selectedNotification.createdAt).toLocaleString()})
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-semibold text-left">
                {selectedNotification.message}
              </p>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button
                onClick={() => setSelectedNotification(null)}
                className="flex-1 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer active:scale-95 shadow-sm"
              >
                {t("common.close", "Close")}
              </button>
              
              {selectedNotification.relatedId && (
                <button
                  onClick={() => {
                    const relatedId = selectedNotification.relatedId;
                    const category = selectedNotification.category.toUpperCase();
                    setSelectedNotification(null);
                    
                    if (category === "MESSAGES") {
                      router.push(`/customer/chat?bookingId=${relatedId}`);
                    } else if (category === "BOOKINGS" || category === "OTP" || category === "REVIEWS" || category === "PAYMENTS") {
                      router.push(`/customer/jobs?bookingId=${relatedId}`);
                    } else {
                      router.push("/customer/dashboard");
                    }
                  }}
                  className="flex-1 py-3 bg-[#1A2340] hover:bg-[#2D3F6A] text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-sm shadow-[#1A2340]/10"
                >
                  {selectedNotification.category.toUpperCase() === "MESSAGES" ? (
                    <>
                      <MessageSquare size={13} />
                      Open Chat
                    </>
                  ) : (
                    <>
                      <Calendar size={13} />
                      View Job Details
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
