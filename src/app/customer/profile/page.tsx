import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Settings, Briefcase, HelpCircle, Info } from "lucide-react";

export default async function CustomerProfilePage() {
  const dbUser = {
    name: "Jane Customer",
    email: "jane.customer@example.com"
  };

  const handleLogout = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  if (!dbUser) {
    return (
      <div className="flex flex-col h-full bg-gray-50/50 pb-24 items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 shadow-sm">
          <User size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Not Signed In</h3>
        <p className="text-gray-500 text-sm max-w-xs mb-6">Create an account or log in to manage your profile.</p>
        <Link href="/login" className="w-full max-w-xs bg-primary hover:bg-primary-light text-white py-3.5 rounded-xl font-semibold transition-all shadow-sm">
          Log In or Sign Up
        </Link>
      </div>
    );
  }

  const name = dbUser.name || 'Customer';
  const email = dbUser.email;
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full bg-gray-50/50 pb-24 font-sans">
      {/* Profile Header */}
      <div className="bg-white px-4 pt-6 pb-5 border-b border-gray-100/80 shadow-sm/5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-[22px] font-extrabold text-white border-[3px] border-white shadow-md shadow-primary/20">
              {initials}
            </div>
          </div>
          <div>
            <h2 className="font-extrabold text-[19px] text-gray-900 leading-tight">{name}</h2>
            <p className="text-[13px] text-gray-500 mt-0.5">{email}</p>
          </div>
        </div>
      </div>

      {/* Options List */}
      <div className="mt-4 flex flex-col bg-white border-y border-gray-100/50 divide-y divide-gray-50">
        <Link href="/profile/account" className="flex items-center gap-3.5 px-4 py-4 cursor-pointer hover:bg-gray-50/50 active:bg-gray-50 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <User size={20} />
          </div>
          <span className="flex-1 font-semibold text-[15px] text-gray-800">Account Details</span>
          <span className="text-gray-400 text-lg">›</span>
        </Link>

        <Link href="/profile/settings" className="flex items-center gap-3.5 px-4 py-4 cursor-pointer hover:bg-gray-50/50 active:bg-gray-50 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Settings size={20} />
          </div>
          <span className="flex-1 font-semibold text-[15px] text-gray-800">Settings</span>
          <span className="text-gray-400 text-lg">›</span>
        </Link>

        <Link href="/customer/jobs" className="flex items-center gap-3.5 px-4 py-4 cursor-pointer hover:bg-gray-50/50 active:bg-gray-50 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Briefcase size={20} />
          </div>
          <span className="flex-1 font-semibold text-[15px] text-gray-800">My Bookings</span>
          <span className="text-gray-400 text-lg">›</span>
        </Link>
        
        <div className="flex items-center gap-3.5 px-4 py-4 cursor-pointer hover:bg-gray-50/50 active:bg-gray-50 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <HelpCircle size={20} />
          </div>
          <span className="flex-1 font-semibold text-[15px] text-gray-800">Help Desk</span>
          <span className="text-gray-400 text-lg">›</span>
        </div>
        
        <div className="flex items-center gap-3.5 px-4 py-4 cursor-pointer hover:bg-gray-50/50 active:bg-gray-50 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Info size={20} />
          </div>
          <span className="flex-1 font-semibold text-[15px] text-gray-800">About Us</span>
          <span className="text-gray-400 text-lg">›</span>
        </div>
      </div>

      {/* Version and Logout */}
      <div className="flex justify-between items-center px-5 py-5 mt-auto">
        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">VERSION 0.1.0</span>
        <form action={handleLogout}>
          <button type="submit" className="text-[13px] text-primary hover:text-primary-light font-bold cursor-pointer bg-transparent border-none uppercase tracking-wide transition-colors">
            → LOG OUT
          </button>
        </form>
      </div>
    </div>
  );
}
