import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditProfessions from "@/components/EditProfessions";

export default async function Profile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let dbUser = null;
  let workerProfile = null;

  if (user && user.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { workerProfile: true }
    });
    workerProfile = dbUser?.workerProfile;
  }

  const handleLogout = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  if (!user || !dbUser) {
    return (
      <div className="flex flex-col h-full bg-[#F7F7F8] pb-24 items-center justify-center p-6 text-center">
        <div className="text-4xl mb-3">👤</div>
        <h3 className="text-xl font-bold text-[#1A2340] mb-2">Not Signed In</h3>
        <p className="text-[#888BA0] mb-6">Create an account or log in to manage your profile.</p>
        <Link href="/login" className="w-full bg-[#E8514A] text-white py-3.5 rounded-xl font-bold block">
          Log In or Sign Up
        </Link>
      </div>
    );
  }

  const name = dbUser.name || 'User';
  const email = dbUser.email;
  const isOnline = workerProfile?.isOnline ?? true;

  return (
    <div className="flex flex-col h-full bg-[#F7F7F8] pb-24 font-sans">
      <div className="bg-white px-4 pt-5 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E8514A44] to-[#E8514A88] flex items-center justify-center text-[26px] font-extrabold text-[#E8514A] border-[3px] border-white shadow-[0_4px_12px_rgba(232,81,74,0.3)]">
              {name.substring(0, 2).toUpperCase()}
            </div>
            {isOnline && (
              <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#00C896] border-2 border-white"></div>
            )}
          </div>
          <div>
            <div className="font-extrabold text-[18px] text-[#1A2340]">{name}</div>
            <div className="text-[13px] text-[#888BA0]">{email}</div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-col bg-white">
        <Link href="/worker/profile/account" className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F5F5F5] bg-white cursor-pointer hover:bg-gray-50">
          <span className="text-[22px] w-8">👤</span>
          <span className="flex-1 font-medium text-[15px] text-[#1A2340]">Account</span>
          <span className="text-[#CBCDD6] text-base">›</span>
        </Link>
        
        {workerProfile ? (
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F5F5F5] bg-[#FFF5F5] cursor-pointer">
            <span className="text-[22px] w-8">🛡️</span>
            <span className="flex-1 font-bold text-[15px] text-[#E8514A]">Verified</span>
            <span className="bg-[#E8514A] text-white rounded-full px-2.5 py-0.5 text-[11px] font-bold">ACTIVE</span>
            <span className="text-[#CBCDD6] text-base ml-2">›</span>
          </div>
        ) : null}
        
        <Link href="/worker/profile/settings" className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F5F5F5] bg-white cursor-pointer hover:bg-gray-50">
          <span className="text-[22px] w-8">⚙️</span>
          <span className="flex-1 font-medium text-[15px] text-[#1A2340]">Settings</span>
          <span className="text-[#CBCDD6] text-base">›</span>
        </Link>
        
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F5F5F5] bg-white cursor-pointer hover:bg-gray-50">
          <span className="text-[22px] w-8">❓</span>
          <span className="flex-1 font-medium text-[15px] text-[#1A2340]">Help Desk</span>
          <span className="text-[#CBCDD6] text-base">›</span>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F5F5F5] bg-white cursor-pointer hover:bg-gray-50">
          <span className="text-[22px] w-8">ℹ️</span>
          <span className="flex-1 font-medium text-[15px] text-[#1A2340]">About Us</span>
          <span className="text-[#CBCDD6] text-base">›</span>
        </div>
      </div>

      {workerProfile && (
        <EditProfessions 
          initialProfessions={workerProfile.profession || []} 
          initialCustomProfession={workerProfile.customProfession || ""} 
        />
      )}

      {!workerProfile && (
        <div className="mx-4 mt-4 bg-[#F7F7F8] rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="font-extrabold text-[15px] text-[#1A2340] mb-1">Upgrade Profile</div>
          <div className="text-[13px] text-[#888BA0] mb-3.5">Get verified to receive more job requests.</div>
          <Link href="/worker/profile/upgrade" className="block text-center bg-[#E8514A] text-white font-bold text-[15px] py-3 rounded-xl w-full">
            Verify Now
          </Link>
        </div>
      )}

      <div className="flex justify-between items-center px-4 py-5 mt-auto">
        <span className="text-xs text-[#CBCDD6] font-semibold">VERSION 0.1.0</span>
        <form action={handleLogout}>
          <button type="submit" className="text-[13px] text-[#E8514A] font-bold cursor-pointer bg-transparent border-none">
            → LOG OUT
          </button>
        </form>
      </div>
    </div>
  );
}
