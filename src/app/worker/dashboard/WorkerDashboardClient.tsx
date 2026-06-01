"use client";

import { useState } from "react";
import { 
  MessageSquare, 
  Check, 
  X, 
  Star, 
  Clock, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  TrendingUp, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  User,
  Info,
  Play,
  CheckCircle2,
  Lock
} from "lucide-react";
import Link from "next/link";
import Portal from "@/components/Portal";
import { acceptJobRequest, verifyOtpCode, completeBooking } from "./actions";

interface CustomerUser {
  name: string;
  email: string;
}

interface Booking {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  jobDetails: string;
  price: number | null;
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  customer: CustomerUser;
}

interface ServiceRequest {
  id: string;
  category: string;
  description: string;
  budget: number | null;
  status: "OPEN" | "MATCHED" | "CLOSED";
  createdAt: Date;
  customer: CustomerUser;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  reviewer: CustomerUser;
}

interface WorkerProfile {
  id: string;
  rating: number;
  experience: number;
  profession: string[];
  skills: string[];
  isOnline: boolean;
}

interface WorkerDashboardClientProps {
  workerProfile: WorkerProfile;
  userName: string;
  userEmail: string;
  openRequests: ServiceRequest[];
  bookings: Booking[];
  reviews: Review[];
}

export default function WorkerDashboardClient({
  workerProfile,
  userName,
  userEmail,
  openRequests = [],
  bookings = [],
  reviews = [],
}: WorkerDashboardClientProps) {
  const [incomingRequests, setIncomingRequests] = useState<ServiceRequest[]>(openRequests);
  const [allBookings, setAllBookings] = useState<Booking[]>(bookings);
  const [onlineStatus, setOnlineStatus] = useState(workerProfile.isOnline);
  
  // Interactive action states
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [otpError, setOtpError] = useState<Record<string, string>>({});
  const [loadingAction, setLoadingAction] = useState<Record<string, boolean>>({});
  
  // Detail Modals state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  // Helper for customer avatars (stable headshots)
  const getCustomerAvatar = (customerId: string) => {
    const avatars = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150", // female 1
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150", // male 1
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150", // female 2
      "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=150&h=150", // male 2
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150", // female 3
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150", // male 3
    ];
    const num = customerId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return avatars[num % avatars.length];
  };

  // Reject Request locally
  const handleRejectRequest = (requestId: string) => {
    setIncomingRequests(prev => prev.filter(r => r.id !== requestId));
  };

  // Accept Request
  const handleAcceptRequest = async (requestId: string) => {
    setLoadingAction(prev => ({ ...prev, [requestId]: true }));
    const res = await acceptJobRequest(requestId);
    setLoadingAction(prev => ({ ...prev, [requestId]: false }));
    
    if (res.success && res.booking) {
      alert("Job request accepted successfully! Staged under Accepted Jobs.");
      setIncomingRequests(prev => prev.filter(r => r.id !== requestId));
      setAllBookings(prev => [res.booking as any, ...prev]);
    } else {
      alert("Failed to accept request: " + res.error);
    }
  };

  // OTP Verification
  const handleVerifyOtp = async (bookingId: string) => {
    const entered = otpInputs[bookingId] || "";
    if (entered.length !== 6) {
      setOtpError(prev => ({ ...prev, [bookingId]: "Please enter a valid 6-digit OTP code." }));
      return;
    }

    setLoadingAction(prev => ({ ...prev, [bookingId]: true }));
    const res = await verifyOtpCode(bookingId, entered);
    setLoadingAction(prev => ({ ...prev, [bookingId]: false }));

    if (res.success) {
      alert("OTP Verified successfully! Service is now active.");
      setOtpError(prev => ({ ...prev, [bookingId]: "" }));
      setAllBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "IN_PROGRESS" as const } : b));
    } else {
      setOtpError(prev => ({ ...prev, [bookingId]: res.error || "Invalid OTP code." }));
    }
  };

  // Complete job
  const handleCompleteJob = async (bookingId: string) => {
    if (!confirm("Are you sure the service has been completed?")) return;
    setLoadingAction(prev => ({ ...prev, [bookingId]: true }));
    const res = await completeBooking(bookingId);
    setLoadingAction(prev => ({ ...prev, [bookingId]: false }));

    if (res.success) {
      alert("Job marked as Completed! Great work.");
      setAllBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "COMPLETED" as const } : b));
      setSelectedBooking(null);
    } else {
      alert("Failed to complete booking: " + res.error);
    }
  };

  // Filter Bookings by status
  const acceptedJobs = allBookings.filter(b => b.status === "PENDING" || b.status === "ACCEPTED");
  const activeJobs = allBookings.filter(b => b.status === "IN_PROGRESS");
  const completedJobs = allBookings.filter(b => b.status === "COMPLETED" || b.status === "CANCELLED" || b.status === "REJECTED");

  // Calculations for Earnings
  const completedList = allBookings.filter(b => b.status === "COMPLETED");
  const calculateEarnings = (period: "day" | "week" | "month" | "total") => {
    const now = new Date();
    let limit = new Date(0);
    
    if (period === "day") {
      limit = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === "week") {
      limit = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
    } else if (period === "month") {
      limit = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return completedList
      .filter(b => period === "total" || new Date(b.updatedAt) >= limit)
      .reduce((sum, b) => sum + (b.price || 0), 0);
  };

  const todayEarnings = calculateEarnings("day");
  const weekEarnings = calculateEarnings("week");
  const monthEarnings = calculateEarnings("month");
  const totalEarnings = calculateEarnings("total");

  // Overview Counts
  const newRequestsCount = incomingRequests.length;
  const activeJobsCount = acceptedJobs.length + activeJobs.length;
  const completedJobsCount = completedList.length;

  const initials = userName.substring(0, 2).toUpperCase() || "WP";

  return (
    <div className="flex flex-col h-full bg-[#F8F9FC] font-sans pb-28">
      
      {/* 1. Header Bar */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sticky top-0 z-40 border-b border-[#F0F0F0]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A2340]/10 to-[#1A2340]/20 flex items-center justify-center text-[#1A2340] font-extrabold text-[15px] border-[2px] border-white shadow-sm">
              {initials}
            </div>
            <div>
              <h1 className="text-base font-extrabold text-[#1A2340] tracking-tight">Hi, {userName.split(" ")[0]} 👋</h1>
              <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                Verified Pro Profile
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setOnlineStatus(!onlineStatus)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 border-none cursor-pointer transition-colors ${
                onlineStatus ? "bg-[#E6FBF5] text-[#00A87A]" : "bg-slate-100 text-slate-400"
              }`}
            >
              <span className={`w-2 h-2 rounded-full inline-block ${onlineStatus ? "bg-[#00C896]" : "bg-gray-400"}`}></span>
              <span className="text-[11px] font-bold uppercase tracking-wider">{onlineStatus ? "Online" : "Offline"}</span>
            </button>
            <Link href="/worker/notifications" className="w-9 h-9 rounded-full bg-[#F7F7F8] hover:bg-[#F0F0F2] flex items-center justify-center text-slate-600 transition-colors">
              <span className="text-base">🔔</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Today's Overview Statistics */}
      <div className="px-4 pt-5">
        <h3 className="text-xs font-black text-[#1A2340] uppercase tracking-wider mb-3 px-1">Today's Overview</h3>
        <div className="grid grid-cols-4 gap-2.5">
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] text-center flex flex-col justify-center min-h-[76px]">
            <span className="text-lg font-black text-[#1A2340]">{newRequestsCount}</span>
            <span className="text-[9px] font-bold text-[#888BA0] mt-1 leading-tight">New Requests</span>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] text-center flex flex-col justify-center min-h-[76px]">
            <span className="text-lg font-black text-indigo-600">{activeJobsCount}</span>
            <span className="text-[9px] font-bold text-[#888BA0] mt-1 leading-tight">Active Jobs</span>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] text-center flex flex-col justify-center min-h-[76px]">
            <span className="text-lg font-black text-emerald-600">{completedJobsCount}</span>
            <span className="text-[9px] font-bold text-[#888BA0] mt-1 leading-tight">Completed</span>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] text-center flex flex-col justify-center min-h-[76px]">
            <span className="text-lg font-black text-amber-500 flex items-center justify-center gap-0.5">
              {workerProfile.rating || "5.0"}<span className="text-[10px] text-amber-400">★</span>
            </span>
            <span className="text-[9px] font-bold text-[#888BA0] mt-1 leading-tight">Avg Rating</span>
          </div>
        </div>
      </div>

      {/* 3. Earnings Section */}
      <div className="px-4 pt-5">
        <div className="bg-[#1A2340] rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
          {/* Decorative radial gradient */}
          <div className="absolute right-0 top-0 w-36 h-36 bg-gradient-to-br from-[#E8514A]/20 to-transparent rounded-full filter blur-xl"></div>

          <div className="text-[10px] text-[#8A9BBF] font-bold uppercase tracking-wider mb-1">Today's Earnings</div>
          <div className="text-3xl font-black tracking-tight">
            ₹{todayEarnings}<span className="text-lg font-medium opacity-60">.00</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-700/50">
            <div>
              <span className="text-[9px] text-[#8A9BBF] font-semibold block uppercase">This Week</span>
              <span className="text-sm font-extrabold mt-0.5 block">₹{weekEarnings}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#8A9BBF] font-semibold block uppercase">This Month</span>
              <span className="text-sm font-extrabold mt-0.5 block">₹{monthEarnings}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#8A9BBF] font-semibold block uppercase text-emerald-400">Total Earnings</span>
              <span className="text-sm font-extrabold mt-0.5 block text-emerald-400">₹{totalEarnings}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Unified Dashboard Flow */}
      <div className="space-y-6 px-4 pt-6">

        {/* Section 1: New Job Requests */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-[#1A2340] uppercase tracking-wider px-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E8514A]"></span>
            Incoming Job Requests ({newRequestsCount})
          </h3>

          {newRequestsCount === 0 ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.01)] text-center">
              <span className="text-3xl">📋</span>
              <h4 className="font-extrabold text-[#1A2340] text-sm mt-2">No incoming requests</h4>
              <p className="text-xs text-[#888BA0] mt-1 font-medium leading-relaxed">
                You don't have any incoming customer requests right now. New tasks will show up here.
              </p>
            </div>
          ) : (
            incomingRequests.map((req) => (
              <div 
                key={req.id}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col transition-all hover:shadow-[0_6px_24px_rgba(0,0,0,0.04)]"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#E8514A]"></div>
                
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8514A]/10 to-[#E8514A]/20 flex items-center justify-center text-[#E8514A] font-bold text-sm">
                      {req.customer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#1A2340] text-[15px]">{req.customer.name}</h4>
                      <p className="text-[10px] text-[#888BA0] font-bold uppercase tracking-wider mt-0.5">
                        {req.category}
                      </p>
                    </div>
                  </div>
                  <span className="bg-red-50 text-[#E8514A] rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase border border-red-100/50">
                    Waiting response
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  {req.description}
                </p>

                <div className="flex justify-between items-center mb-4 px-1 text-[11px] font-bold text-slate-500">
                  <span className="flex items-center gap-1"><Calendar size={13} /> Today</span>
                  {req.budget && <span className="text-emerald-600">Budget: ₹{req.budget}</span>}
                </div>

                {/* Job progress tracker received stage */}
                <div className="my-2.5 px-1 relative">
                  <div className="absolute top-[9px] left-[5%] right-[5%] h-[3px] bg-slate-100 -z-0"></div>
                  <div className="flex justify-between relative z-10">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-[#E8514A] border-[3px] border-white flex items-center justify-center shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 mt-1">Received</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-slate-200 border-[3px] border-white flex items-center justify-center shadow-sm"></div>
                      <span className="text-[9px] font-semibold text-slate-400 mt-1">Accepted</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-slate-200 border-[3px] border-white flex items-center justify-center shadow-sm"></div>
                      <span className="text-[9px] font-semibold text-slate-400 mt-1">Verify</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-slate-200 border-[3px] border-white flex items-center justify-center shadow-sm"></div>
                      <span className="text-[9px] font-semibold text-slate-400 mt-1">Active</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-slate-200 border-[3px] border-white flex items-center justify-center shadow-sm"></div>
                      <span className="text-[9px] font-semibold text-slate-400 mt-1">Done</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={() => handleAcceptRequest(req.id)}
                    disabled={loadingAction[req.id]}
                    className="flex-1 py-3 bg-[#E8514A] hover:bg-[#E8514A]/90 text-white font-extrabold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-sm shadow-[#E8514A]/10"
                  >
                    Accept Request
                  </button>
                  <button 
                    onClick={() => handleRejectRequest(req.id)}
                    className="px-5 py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition-colors active:scale-[0.98]"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Section 2: Accepted Jobs (Waiting for OTP Verification) */}
        {acceptedJobs.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-extrabold text-[#1A2340] uppercase tracking-wider px-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Accepted Jobs ({acceptedJobs.length})
            </h3>

            {acceptedJobs.map((booking) => {
              const bookingId = booking.id;
              const formattedDate = new Date(booking.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
              const currentInput = otpInputs[bookingId] || "";
              const err = otpError[bookingId] || "";

              return (
                <div 
                  key={bookingId}
                  className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col transition-all hover:shadow-[0_6px_24px_rgba(0,0,0,0.04)]"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>

                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={getCustomerAvatar(bookingId)} 
                        alt={booking.customer.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200/50"
                      />
                      <div>
                        <h4 className="font-extrabold text-[#1A2340] text-[15px]">{booking.customer.name}</h4>
                        <p className="text-[10px] text-[#888BA0] font-semibold mt-0.5">
                          Booking ID: {bookingId.substring(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase border border-indigo-100/50">
                      ACCEPTED
                    </span>
                  </div>

                  {/* OTP Verification Box */}
                  <div className="bg-[#F8F9FD] border border-indigo-100/30 rounded-2xl p-4 mb-4 mt-2 flex flex-col items-center">
                    <span className="text-[10.5px] font-black text-[#1A2340] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-indigo-600" />
                      Enter Customer OTP
                    </span>
                    
                    <div className="flex gap-2 w-full max-w-[240px] mb-2 justify-center">
                      <input 
                        type="text"
                        maxLength={6}
                        value={currentInput}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setOtpInputs(prev => ({ ...prev, [bookingId]: val }));
                        }}
                        placeholder="0 0 0 0 0 0"
                        className="w-full px-4 py-2.5 text-center text-lg font-black tracking-[4px] border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-500 text-slate-800 transition-all placeholder:tracking-normal placeholder:font-bold placeholder:text-slate-300"
                      />
                    </div>
                    
                    {err && (
                      <span className="text-[10px] text-red-600 font-bold mb-2 block text-center leading-tight">
                        {err}
                      </span>
                    )}

                    <button 
                      onClick={() => handleVerifyOtp(bookingId)}
                      disabled={loadingAction[bookingId]}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs transition-colors active:scale-[0.98] shadow-sm shadow-indigo-600/10"
                    >
                      {loadingAction[bookingId] ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>

                  {/* Progress tracker Accepted/Verify stage */}
                  <div className="my-3 px-1 relative">
                    <div className="absolute top-[9px] left-[5%] right-[5%] h-[3px] bg-slate-100 -z-0"></div>
                    <div className="absolute top-[9px] left-[5%] w-[45%] h-[3px] bg-indigo-600 -z-0"></div>
                    <div className="flex justify-between relative z-10">
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-indigo-600 border-[3px] border-white flex items-center justify-center shadow-sm text-white">
                          <Check size={9} className="stroke-[3]" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-700 mt-1">Received</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-indigo-600 border-[3px] border-white flex items-center justify-center shadow-sm text-white">
                          <Check size={9} className="stroke-[3]" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-700 mt-1">Accepted</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-indigo-600 border-[3px] border-white flex items-center justify-center shadow-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-700 mt-1">Verify</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-slate-200 border-[3px] border-white flex items-center justify-center shadow-sm"></div>
                        <span className="text-[9px] font-semibold text-slate-400 mt-1">Active</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-slate-200 border-[3px] border-white flex items-center justify-center shadow-sm"></div>
                        <span className="text-[9px] font-semibold text-slate-400 mt-1">Done</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <Link 
                      href="/worker/chat"
                      className="flex-1 py-3 bg-[#1A2340] hover:bg-[#2D3F6A] text-white font-extrabold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-sm shadow-[#1A2340]/10"
                    >
                      <MessageSquare size={14} />
                      Open Chat
                    </Link>
                    <button 
                      onClick={() => setSelectedBooking(booking)}
                      className="px-5 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs transition-colors active:scale-[0.98]"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Section 3: Work In Progress */}
        {activeJobs.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-extrabold text-[#1A2340] uppercase tracking-wider px-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Work In Progress ({activeJobs.length})
            </h3>

            {activeJobs.map((booking) => {
              const bookingId = booking.id;
              const formattedTime = new Date(booking.updatedAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div 
                  key={bookingId}
                  className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col transition-all hover:shadow-[0_6px_24px_rgba(0,0,0,0.04)]"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>

                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={getCustomerAvatar(bookingId)} 
                        alt={booking.customer.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200/50"
                      />
                      <div>
                        <h4 className="font-extrabold text-[#1A2340] text-[15px]">{booking.customer.name}</h4>
                        <p className="text-[10px] text-[#888BA0] font-semibold mt-0.5">
                          Job Details: {booking.jobDetails.split(":")[0] || "Service Task"}
                        </p>
                      </div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase border border-emerald-100/50">
                      ACTIVE WORK
                    </span>
                  </div>

                  {/* Informational started banner */}
                  <div className="bg-[#E6FBF5] border border-emerald-100/30 text-[#00A87A] rounded-2xl p-3.5 mb-4 mt-2 flex items-center gap-2.5">
                    <Clock size={15} className="stroke-[2.5]" />
                    <span className="text-[11.5px] font-bold leading-normal">
                      Service started at {formattedTime}
                    </span>
                  </div>

                  {/* Progress tracker Active stage */}
                  <div className="my-3 px-1 relative">
                    <div className="absolute top-[9px] left-[5%] right-[5%] h-[3px] bg-slate-100 -z-0"></div>
                    <div className="absolute top-[9px] left-[5%] w-[70%] h-[3px] bg-emerald-500 -z-0"></div>
                    <div className="flex justify-between relative z-10">
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-white flex items-center justify-center shadow-sm text-white">
                          <Check size={9} className="stroke-[3]" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-700 mt-1">Received</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-white flex items-center justify-center shadow-sm text-white">
                          <Check size={9} className="stroke-[3]" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-700 mt-1">Accepted</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-white flex items-center justify-center shadow-sm text-white">
                          <Check size={9} className="stroke-[3]" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-700 mt-1">Verify</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-white flex items-center justify-center shadow-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-700 mt-1">Active</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-slate-200 border-[3px] border-white flex items-center justify-center shadow-sm"></div>
                        <span className="text-[9px] font-semibold text-slate-400 mt-1">Done</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={() => handleCompleteJob(bookingId)}
                      disabled={loadingAction[bookingId]}
                      className="flex-1 py-3 bg-[#00A87A] hover:bg-[#008F68] text-white font-extrabold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-sm shadow-[#00A87A]/10"
                    >
                      <CheckCircle2 size={14} />
                      Complete Job
                    </button>
                    <Link 
                      href="/worker/chat"
                      className="px-5 py-3 bg-[#1A2340] hover:bg-[#2D3F6A] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center active:scale-[0.98]"
                    >
                      Chat
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Section 4: Completed Jobs History */}
        {completedJobs.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-extrabold text-[#1A2340] uppercase tracking-wider px-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              Completed Jobs History ({completedJobs.length})
            </h3>

            {completedJobs.map((booking) => {
              const bookingId = booking.id;
              const formattedDate = new Date(booking.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
              const isCancelled = booking.status === "CANCELLED" || booking.status === "REJECTED";

              return (
                <div 
                  key={bookingId}
                  className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.01)] relative overflow-hidden flex flex-col transition-all hover:shadow-[0_6px_20px_rgba(0,0,0,0.03)]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <img 
                        src={getCustomerAvatar(bookingId)} 
                        alt={booking.customer.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200/50 filter grayscale"
                      />
                      <div>
                        <h4 className="font-extrabold text-[#1A2340] text-[15px]">{booking.customer.name}</h4>
                        <p className="text-[11px] text-[#888BA0] font-semibold mt-0.5">
                          {booking.jobDetails.split(":")[0] || "Service Task"} • {formattedDate}
                        </p>
                      </div>
                    </div>

                    {isCancelled ? (
                      <span className="bg-red-50 text-red-500 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase border border-red-100/50">
                        {booking.status}
                      </span>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100/50 shadow-sm flex-shrink-0">
                        <Check size={13} className="stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Chat Closed Warning (Chat Requirement) */}
                  <div className="bg-slate-50 rounded-xl p-3 mt-4 text-[#888BA0] border border-slate-100 flex items-center gap-2">
                    <Lock size={13} className="text-slate-400 flex-shrink-0" />
                    <span className="text-[10px] font-bold leading-normal text-left">
                      This conversation has been closed because the job has been completed.
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={() => setSelectedBooking(booking)}
                      className="flex-1 py-3 bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100 font-bold rounded-xl text-xs transition-colors active:scale-[0.98]"
                    >
                      View Job Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Section 5: Ratings & Reviews Logs */}
        {reviews.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-extrabold text-[#1A2340] uppercase tracking-wider px-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Recent Customer Reviews ({reviews.length})
            </h3>
            
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div 
                  key={rev.id}
                  className="bg-white rounded-3xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] space-y-2.5"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                        {rev.reviewer.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#1A2340] text-xs">{rev.reviewer.name}</h4>
                        <span className="text-[9px] text-slate-400 font-medium">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          size={11} 
                          className={`${s <= rev.rating ? "fill-[#FFB020] text-[#FFB020]" : "text-slate-100"}`} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  {rev.comment && (
                    <p className="text-[11px] text-slate-600 font-semibold leading-relaxed pl-1">
                      "{rev.comment}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 5. Booking Details Modal (Drawer) */}
      {selectedBooking && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#F7F7F8] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="font-extrabold text-[#1A2340] text-[16px]">Booking Details</h3>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 border border-slate-200/60 shadow-sm transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-5">
                
                {/* Client Card */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex gap-4">
                  <img 
                    src={getCustomerAvatar(selectedBooking.id)} 
                    alt={selectedBooking.customer.name} 
                    className="w-12 h-12 rounded-full object-cover border border-slate-200/50"
                  />
                  <div>
                    <h4 className="font-extrabold text-[#1A2340] text-[15px]">{selectedBooking.customer.name}</h4>
                    <p className="text-xs text-slate-500 font-semibold">
                      Client Email: {selectedBooking.customer.email}
                    </p>
                  </div>
                </div>

                {/* Job Info */}
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-100">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Service Requirements</label>
                    <p className="text-xs text-slate-800 leading-relaxed font-semibold mt-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      {selectedBooking.jobDetails}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Scheduled For</span>
                      <span className="text-xs font-bold text-slate-800 mt-1 block">
                        {selectedBooking.scheduledAt 
                          ? new Date(selectedBooking.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : new Date(selectedBooking.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        }
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Agreed Budget</span>
                      <span className="text-xs font-bold text-emerald-600 mt-1 block">
                        {selectedBooking.price ? `₹${selectedBooking.price}` : "Hourly Rate / Custom"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Status</span>
                    <span className="inline-block mt-1.5 bg-[#FFF5F5] text-[#E8514A] rounded-full px-3 py-1 text-xs font-extrabold uppercase border border-[#E8514A10]">
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
                
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-white flex gap-3">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors active:scale-[0.98]"
                >
                  Close
                </button>
                {selectedBooking.status === "IN_PROGRESS" && (
                  <button
                    onClick={() => handleCompleteJob(selectedBooking.id)}
                    className="flex-1 py-3 bg-[#00A87A] hover:bg-[#008F68] text-white font-bold rounded-xl text-sm transition-colors active:scale-[0.98] flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={15} />
                    Complete Job
                  </button>
                )}
              </div>

            </div>
          </div>
        </Portal>
      )}

      {/* 6. Service Request Details Modal (Drawer) */}
      {selectedRequest && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#F7F7F8] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="font-extrabold text-[#1A2340] text-[16px]">Service Request Details</h3>
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 border border-slate-200/60 shadow-sm transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-4">
                
                {/* Client info */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8514A]/10 to-[#E8514A]/20 flex items-center justify-center text-[#E8514A] font-extrabold text-sm">
                    {selectedRequest.customer.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A2340] text-sm">{selectedRequest.customer.name}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold">Client Name</span>
                  </div>
                </div>

                {/* Details Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Service Category</label>
                    <span className="text-sm font-extrabold text-[#1A2340] mt-1 block">
                      {selectedRequest.category}
                    </span>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Task Description</label>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold mt-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      {selectedRequest.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Posted On</span>
                      <span className="text-xs font-bold text-slate-800 mt-1 block">
                        {new Date(selectedRequest.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Customer Budget</span>
                      <span className="text-xs font-bold text-emerald-600 mt-1 block">
                        {selectedRequest.budget ? `₹${selectedRequest.budget}` : "No budget specified"}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-white flex gap-3">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors active:scale-[0.98]"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleAcceptRequest(selectedRequest.id);
                    setSelectedRequest(null);
                  }}
                  className="flex-1 py-3 bg-[#E8514A] hover:bg-[#E8514A]/90 text-white font-bold rounded-xl text-sm transition-colors active:scale-[0.98] shadow-md shadow-[#E8514A]/20"
                >
                  Accept Request
                </button>
              </div>

            </div>
          </div>
        </Portal>
      )}

    </div>
  );
}
