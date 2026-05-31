"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Home, Briefcase, MessageSquare, Bell, User } from "lucide-react";

const navItems = [
  { name: "Home", href: "/customer/dashboard", icon: <Home className="w-6 h-6" /> },
  { name: "Jobs", href: "/customer/jobs", icon: <Briefcase className="w-6 h-6" /> },
  { name: "Chat", href: "/customer/chat", icon: <MessageSquare className="w-6 h-6" /> },
  { name: "Alerts", href: "/customer/notifications", icon: <Bell className="w-6 h-6" /> },
  { name: "Profile", href: "/customer/profile", icon: <User className="w-6 h-6" /> },
];

export default function CustomerBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-[#F0F0F0] px-4 py-2 flex justify-between items-center z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

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
