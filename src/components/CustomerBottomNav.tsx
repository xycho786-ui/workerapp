"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Home, Briefcase, MessageSquare, Bell, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const navRoutes = [
  { key: "home", href: "/customer/dashboard", icon: <Home className="w-6 h-6" /> },
  { key: "jobs", href: "/customer/jobs", icon: <Briefcase className="w-6 h-6" /> },
  { key: "chat", href: "/customer/chat", icon: <MessageSquare className="w-6 h-6" /> },
  { key: "alerts", href: "/customer/notifications", icon: <Bell className="w-6 h-6" /> },
  { key: "profile", href: "/customer/profile", icon: <User className="w-6 h-6" /> },
];

export default function CustomerBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [unreadCounts, setUnreadCounts] = useState({ unreadNotificationsCount: 0, unreadMessagesCount: 0 });

  useEffect(() => {
    async function fetchUnreadCounts() {
      try {
        const res = await fetch("/api/notifications/unread-counts");
        if (res.ok) {
          const data = await res.json();
          setUnreadCounts({
            unreadNotificationsCount: data.unreadNotificationsCount || 0,
            unreadMessagesCount: data.unreadMessagesCount || 0
          });
        }
      } catch (e) {
        console.error("Failed to fetch unread counts:", e);
      }
    }
    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-[#F0F0F0] px-4 py-2 flex justify-between items-center z-50">
      {navRoutes.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        
        let badgeCount = 0;
        if (item.key === "chat") {
          badgeCount = unreadCounts.unreadMessagesCount;
        } else if (item.key === "alerts") {
          badgeCount = unreadCounts.unreadNotificationsCount;
        }

        return (
          <Link
            key={item.key}
            href={item.href}
            className={clsx(
              "flex flex-col items-center justify-center min-w-[56px] py-1 cursor-pointer",
              isActive ? "text-[#E8514A]" : "text-[#888BA0]"
            )}
          >
            <div className={clsx(
              "text-xl mb-0.5 transition-transform duration-200 relative",
              isActive ? "scale-110" : "opacity-80"
            )}>
              {item.icon}
              {badgeCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#E8514A] text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white shadow-sm scale-95 origin-center animate-pulse">
                  {badgeCount}
                </span>
              )}
            </div>
            <span className={clsx(
              "text-[10px]",
              isActive ? "font-bold" : "font-medium"
            )}>
              {t(`nav.${item.key}`)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
