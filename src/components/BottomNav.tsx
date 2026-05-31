"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Home, Briefcase, MessageSquare, Bell, User } from "lucide-react";

const navItems = [
  { name: "Home", href: "/worker/dashboard", icon: <Home className="w-6 h-6" />, baseHref: "/worker/dashboard" },
  { name: "Jobs", href: "/jobs", icon: <Briefcase className="w-6 h-6" />, baseHref: "/jobs" },
  { name: "Chat", href: "/chat", icon: <MessageSquare className="w-6 h-6" />, baseHref: "/chat" },
  { name: "Alerts", href: "/notifications", icon: <Bell className="w-6 h-6" />, baseHref: "/notifications" },
  { name: "Profile", href: "/profile", icon: <User className="w-6 h-6" />, baseHref: "/profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Hide BottomNav on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage) {
    return null;
  }

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-[#F0F0F0] px-4 py-2 flex justify-between items-center z-50">
      {navItems.map((item) => {
        // Handle root path mapping to dashboard logic if necessary
        const isActive = pathname === item.href || (item.name === "Home" && pathname === "/customer/dashboard");

        return (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              "flex flex-col items-center justify-center min-w-[56px] py-1 cursor-pointer",
              isActive ? "text-[#E8514A]" : "text-[#888BA0]"
            )}
          >
            <div className={clsx(
              "text-xl mb-0.5 transition-transform duration-200",
              isActive ? "scale-110" : "opacity-80"
            )}>
              {item.icon}
            </div>
            <span className={clsx(
              "text-[10px]",
              isActive ? "font-bold" : "font-medium"
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
