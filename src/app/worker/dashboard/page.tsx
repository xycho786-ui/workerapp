import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import OpportunitiesFeed from "@/components/OpportunitiesFeed";

export default async function WorkerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let dbUser = null;
  let openRequests: any[] = [];
  let activeBooking: any = null;

  if (user && user.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { workerProfile: true }
    });

    if (dbUser?.workerProfile) {
      // Find current active bookings for this worker
      activeBooking = await prisma.booking.findFirst({
        where: {
          workerId: dbUser.workerProfile.id,
          status: {
            in: ['ACCEPTED', 'IN_PROGRESS']
          }
        },
        include: {
          customer: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Find all open service requests matching worker professions or skills
      const professions = dbUser.workerProfile.profession || [];
      const skills = dbUser.workerProfile.skills || [];
      const searchTerms = Array.from(new Set([...professions, ...skills]));

      if (searchTerms.length > 0) {
        openRequests = await prisma.serviceRequest.findMany({
          where: {
            status: 'OPEN',
            category: {
              in: searchTerms
            }
          },
          include: {
            customer: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
      }
    }
  }

  const name = dbUser?.name?.split(' ')[0] || 'Worker';
  const isOnline = dbUser?.workerProfile?.isOnline ?? true;

  return (
    <div className="flex flex-col h-full bg-[#F7F7F8] font-sans pb-24">
      {/* Top Header */}
      <div className="bg-white px-4 pt-6 pb-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#E8514A22] to-[#E8514A44] flex items-center justify-center text-[#E8514A] font-bold text-sm">
            {name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-base text-[#1A2340]">Hi, {name} 👋</div>
            <div className="text-xs text-[#888BA0]">Verified Pro</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/worker/notifications" className="bg-[#F7F7F8] rounded-full px-3 py-1.5 flex items-center gap-1.5 cursor-pointer">
            <span className="text-base">🔔</span>
          </Link>
          <div className="flex items-center gap-1.5 bg-[#E6FBF5] rounded-full px-3 py-1.5 cursor-pointer">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#00C896]' : 'bg-gray-400'} inline-block`}></span>
            <span className="text-xs font-bold text-[#00A87A]">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>

      {/* Dark Earnings Card */}
      <div className="bg-[#1A2340] rounded-2xl p-5 mx-4 mt-4 text-white shadow-md">
        <div className="text-xs text-[#8A9BBF] mb-1 uppercase tracking-wider">Today's Earnings</div>
        <div className="text-3xl font-extrabold tracking-tight">
          ₹0<span className="text-lg font-medium">.00</span>
        </div>
        
        <div className="flex justify-between mt-5">
          <div className="text-center">
            <div className="text-[22px] font-extrabold">-</div>
            <div className="text-[11px] text-[#8A9BBF] mt-0.5">⭐ Rating</div>
          </div>
          <div className="w-px bg-[#2D3F6A]"></div>
          <div className="text-center">
            <div className="text-[22px] font-extrabold">-</div>
            <div className="text-[11px] text-[#8A9BBF] mt-0.5">✅ Completion</div>
          </div>
          <div className="w-px bg-[#2D3F6A]"></div>
          <div className="text-center">
            <div className="text-[22px] font-extrabold">0</div>
            <div className="text-[11px] text-[#8A9BBF] mt-0.5">Jobs Today</div>
          </div>
        </div>
      </div>

      {/* Current Task */}
      <div className="px-4 mt-5">
        <div className="font-bold text-[15px] text-[#1A2340] mb-2.5">Current Task</div>
        {activeBooking ? (
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E6FBF5] flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[22px]">📋</span>
                <div>
                  <div className="text-[14px] font-bold text-[#1A2340]">Active Booking</div>
                  <div className="text-[11px] text-[#888BA0] font-semibold">Client: {activeBooking.customer.name}</div>
                </div>
              </div>
              <span className="bg-[#E6FBF5] text-[#00A87A] rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                {activeBooking.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
              {activeBooking.jobDetails}
            </p>
            <div className="flex justify-between items-center mt-1">
              {activeBooking.price !== null && (
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">Price</span>
                  <span className="text-sm font-extrabold text-[#E8514A]">₹{activeBooking.price}</span>
                </div>
              )}
              <Link href="/worker/chat" className="bg-[#1A2340] hover:bg-[#2D3F6A] text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm active:scale-[0.98]">
                Message Client
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center text-center">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-[14px] font-bold text-[#1A2340]">No active tasks</div>
            <div className="text-[13px] text-[#888BA0] mt-1">You don't have any ongoing jobs right now.</div>
          </div>
        )}
      </div>

      {/* New Opportunities */}
      <div className="px-4 mt-5 flex items-center justify-between mb-2">
        <div className="font-bold text-[15px] text-[#1A2340]">New Opportunities</div>
      </div>

      <div className="px-4 space-y-3">
        <OpportunitiesFeed initialOpportunities={openRequests} />
      </div>
    </div>
  );
}
