"use client";

import { useState } from "react";
import { 
  MessageSquare, 
  Info, 
  X, 
  Star, 
  Clock, 
  Briefcase, 
  Calendar, 
  ShieldCheck, 
  Eye, 
  Copy, 
  Check, 
  AlertCircle, 
  Navigation,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import Portal from "@/components/Portal";
import { cancelBooking, cancelServiceRequest, createReview } from "./actions";

interface WorkerUser {
  name: string;
  email: string;
}

interface WorkerProfile {
  id: string;
  rating: number;
  experience: number;
  profession: string[];
  user: WorkerUser;
}

interface Booking {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  jobDetails: string;
  price: number | null;
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  worker: WorkerProfile;
}

interface ServiceRequest {
  id: string;
  category: string;
  description: string;
  budget: number | null;
  status: "OPEN" | "MATCHED" | "CLOSED";
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerJobsClientProps {
  initialBookings: Booking[];
  initialRequests: ServiceRequest[];
  userName: string;
  userEmail: string;
}

export default function CustomerJobsClient({
  initialBookings = [],
  initialRequests = [],
  userName,
  userEmail,
}: CustomerJobsClientProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);
  
  // Modals state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [ratingWorkerId, setRatingWorkerId] = useState<string | null>(null);
  const [ratingVal, setRatingVal] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);
  
  // Filters or tabs
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");

  // Helper to generate a stable Unsplash avatar based on ID
  const getWorkerAvatar = (workerId: string) => {
    const avatars = [
      "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=150&h=150", // male 1
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150", // female 1
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150", // male 2
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150", // female 2
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150", // male 3
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150", // female 3
    ];
    const index = workerId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % avatars.length;
    return avatars[index];
  };

  // Helper to generate a stable deterministic 6-digit OTP code based on booking ID
  const getBookingOtp = (bookingId: string) => {
    const num = bookingId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.abs(Math.sin(num) * 1000000).toFixed(0).padEnd(6, "0").substring(0, 6);
  };

  // Copy to clipboard helper
  const handleCopyOtp = (otp: string, bookingId: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOtp(bookingId);
    setTimeout(() => setCopiedOtp(null), 2000);
  };

  // Filter requests and bookings
  const activeRequests = requests.filter(r => r.status === "OPEN");
  
  const activeBookings = bookings.filter(
    b => b.status === "PENDING" || b.status === "ACCEPTED" || b.status === "IN_PROGRESS"
  );
  
  const completedBookings = bookings.filter(
    b => b.status === "COMPLETED" || b.status === "CANCELLED" || b.status === "REJECTED"
  );

  const totalActiveCount = activeRequests.length + activeBookings.length;

  // Actions
  const handleCancelRequest = async (requestId: string) => {
    if (!confirm("Are you sure you want to cancel this request?")) return;
    const res = await cancelServiceRequest(requestId);
    if (res.success) {
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "CLOSED" } : r));
      setSelectedRequest(null);
    } else {
      alert("Failed to cancel request: " + res.error);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    const res = await cancelBooking(bookingId);
    if (res.success) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "CANCELLED" as const } : b));
      setSelectedBooking(null);
    } else {
      alert("Failed to cancel booking: " + res.error);
    }
  };

  const handleSubmitReview = async () => {
    if (!ratingWorkerId) return;
    setIsSubmittingReview(true);
    const res = await createReview({
      workerId: ratingWorkerId,
      rating: ratingVal,
      comment: reviewComment,
    });
    setIsSubmittingReview(false);
    if (res.success) {
      alert("Thank you for your feedback!");
      setRatingWorkerId(null);
      setReviewComment("");
      setRatingVal(5);
    } else {
      alert("Failed to submit review: " + res.error);
    }
  };

  const initials = userName.substring(0, 2).toUpperCase() || "JD";

  const showEmptyState = activeRequests.length === 0 && activeBookings.length === 0 && completedBookings.length === 0;

  return (
    <div className="flex flex-col h-full bg-[#F8F9FC] font-sans pb-28">
      
      {/* 1. Header Navigation Bar (Matches App Header) */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sticky top-0 z-40 border-b border-[#F0F0F0]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8514A]/10 to-[#E8514A]/20 flex items-center justify-center text-[#E8514A] font-extrabold text-[15px] border-[2px] border-white shadow-sm">
              {initials}
            </div>
            <div>
              <h1 className="text-base font-extrabold text-[#1A2340] tracking-tight">ServiceHub</h1>
              <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                Customer Panel
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/customer/notifications" className="w-9 h-9 rounded-full bg-[#F7F7F8] hover:bg-[#F0F0F2] flex items-center justify-center text-slate-600 transition-colors relative">
              <span className="text-base">🔔</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#E8514A] rounded-full border border-white"></span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Headline & Overview */}
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-[22px] font-black text-[#1A2340] tracking-tight">My Jobs</h2>
        <p className="text-[13px] text-[#888BA0] font-medium mt-1 leading-normal">
          Manage your service requests, track active workers, and rate past experiences.
        </p>
      </div>

      {/* 3. Empty State Design */}
      {showEmptyState && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 mt-6 animate-in fade-in duration-300">
          <div className="w-32 h-32 bg-[#FFF5F5] rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-[#FFF5F5] animate-ping opacity-25"></div>
            <span className="text-5xl relative z-10">💼</span>
            <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#E8514A]/10 border border-[#E8514A]/25 flex items-center justify-center text-[#E8514A]">
              <Sparkles size={16} />
            </div>
          </div>
          <h3 className="text-lg font-extrabold text-[#1A2340] mb-2">No Active Jobs Yet</h3>
          <p className="text-[13px] text-[#888BA0] max-w-[280px] leading-relaxed mb-6 font-medium">
            You haven't booked any services yet. Browse trusted professionals and get started.
          </p>
          <div className="flex gap-3 w-full max-w-xs">
            <Link 
              href="/customer/explore" 
              className="flex-1 py-3 bg-[#E8514A] hover:bg-[#E8514A]/90 text-white font-bold rounded-xl text-xs text-center transition-all shadow-md shadow-[#E8514A]/10 active:scale-[0.98]"
            >
              Browse Services
            </Link>
            <Link 
              href="/customer/explore" 
              className="flex-1 py-3 bg-white border border-[#E8514A]/20 text-[#E8514A] hover:bg-red-50/50 font-bold rounded-xl text-xs text-center transition-all active:scale-[0.98]"
            >
              Find Workers
            </Link>
          </div>
        </div>
      )}

      {/* 4. Content Sections (If not empty) */}
      {!showEmptyState && (
        <div className="space-y-6 px-4">
          
          {/* Active Bookings/Requests Section */}
          {totalActiveCount > 0 && (
            <div className="space-y-3.5">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-extrabold text-[#1A2340] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E8514A]"></span>
                  Active Bookings ({totalActiveCount})
                </h3>
              </div>
              
              {/* Render Service Requests (OPEN) */}
              {activeRequests.map((req) => (
                <div 
                  key={req.id} 
                  className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col transition-all hover:shadow-[0_6px_24px_rgba(0,0,0,0.04)]"
                >
                  {/* Decorative Border Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-sky-300"></div>

                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 border border-blue-100/50">
                        <span className="text-lg">⚡</span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#1A2340] text-[15px]">{req.category}</h4>
                        <p className="text-[11px] text-[#888BA0] font-semibold mt-0.5">Searching for nearby Pros...</p>
                      </div>
                    </div>
                    <span className="bg-blue-50 text-blue-600 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide border border-blue-100/50">
                      PENDING ACCEPTANCE
                    </span>
                  </div>

                  {/* Horizontal Progress Timeline */}
                  <div className="my-5 px-1 relative">
                    {/* Connecting Bar */}
                    <div className="absolute top-[9px] left-[5%] right-[5%] h-[3px] bg-slate-100 -z-0"></div>
                    <div className="absolute top-[9px] left-[5%] w-[0%] h-[3px] bg-blue-500 -z-0 transition-all duration-300"></div>
                    
                    <div className="flex justify-between relative z-10">
                      {/* Step 1: Sent */}
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-blue-500 border-[3px] border-white flex items-center justify-center shadow-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                        <span className="text-[10px] font-bold text-[#1A2340] mt-2">Sent</span>
                      </div>
                      
                      {/* Step 2: Accepted */}
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-slate-200 border-[3px] border-white flex items-center justify-center shadow-sm"></div>
                        <span className="text-[10px] font-semibold text-slate-400 mt-2">Accepted</span>
                      </div>

                      {/* Step 3: Verify */}
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-slate-200 border-[3px] border-white flex items-center justify-center shadow-sm"></div>
                        <span className="text-[10px] font-semibold text-slate-400 mt-2">Verify</span>
                      </div>

                      {/* Step 4: Active */}
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-slate-200 border-[3px] border-white flex items-center justify-center shadow-sm"></div>
                        <span className="text-[10px] font-semibold text-slate-400 mt-2">Active</span>
                      </div>

                      {/* Step 5: Done */}
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-slate-200 border-[3px] border-white flex items-center justify-center shadow-sm"></div>
                        <span className="text-[10px] font-semibold text-slate-400 mt-2">Done</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-1.5">
                    <button 
                      onClick={() => setSelectedRequest(req)}
                      className="flex-1 py-3 bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      <Eye size={14} />
                      View Request
                    </button>
                    <button 
                      onClick={() => handleCancelRequest(req.id)}
                      className="px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100/70 hover:text-red-700 font-bold rounded-xl text-xs transition-colors active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}

              {/* Render Active Bookings */}
              {activeBookings.map((booking) => {
                const otp = getBookingOtp(booking.id);
                const isAccepted = booking.status === "ACCEPTED" || booking.status === "PENDING";
                const isInProgress = booking.status === "IN_PROGRESS";
                const isCopied = copiedOtp === booking.id;
                const formattedDate = booking.scheduledAt 
                  ? new Date(booking.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : new Date(booking.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                
                // Deterministic start time from updated date
                const startTimeStr = new Date(booking.updatedAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <div 
                    key={booking.id} 
                    className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col transition-all hover:shadow-[0_6px_24px_rgba(0,0,0,0.04)]"
                  >
                    {/* Decorative Border Line */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                      isInProgress ? "from-emerald-400 to-green-300" : "from-[#1A2340] to-[#2D3F6A]"
                    }`}></div>

                    {/* Worker Info Row */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={getWorkerAvatar(booking.workerId)} 
                          alt={booking.worker.user.name} 
                          className="w-11 h-11 rounded-full object-cover border border-slate-200/50"
                        />
                        <div>
                          <h4 className="font-extrabold text-[#1A2340] text-[15px]">{booking.worker.user.name}</h4>
                          <p className="text-[9.5px] text-[#888BA0] font-bold uppercase tracking-wider mt-0.5">
                            {booking.worker.profession[0] || "Service Pro"}
                          </p>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <span className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide ${
                        isInProgress 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" 
                          : "bg-indigo-50 text-indigo-700 border border-indigo-100/50"
                      }`}>
                        {isInProgress ? "IN PROGRESS" : "WAITING FOR OTP"}
                      </span>
                    </div>

                    {/* Booking Details (Budget / Category Detail) */}
                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 mb-4 px-1">
                      <span className="flex items-center gap-1"><Calendar size={13} className="text-slate-400" /> {formattedDate}</span>
                      <span className="flex items-center gap-1"><Clock size={13} className="text-slate-400" /> {startTimeStr}</span>
                      {booking.price && <span className="text-[#E8514A]">₹{booking.price}</span>}
                    </div>

                    {/* OTP Banner (If ACCEPTED/Waiting for OTP) */}
                    {isAccepted && (
                      <div className="bg-[#F6F8FF] border border-blue-100/30 rounded-2xl p-4 mb-4 text-center relative flex flex-col items-center">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          Your Verification Code
                        </span>
                        <div className="flex items-center gap-2 mb-1 justify-center">
                          <span className="text-2xl font-black text-[#1A2340] tracking-[6px] select-all pl-1.5">{otp}</span>
                          <button 
                            onClick={() => handleCopyOtp(otp, booking.id)}
                            className="p-1 bg-white hover:bg-slate-50 border border-slate-200/50 rounded-lg text-[#888BA0] hover:text-[#1A2340] transition-colors active:scale-95 shadow-sm"
                            title="Copy Code"
                          >
                            {isCopied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-[280px]">
                          Share this OTP with the worker only when they arrive at your location.
                        </p>
                      </div>
                    )}

                    {/* Info Banner (If IN_PROGRESS) */}
                    {isInProgress && (
                      <div className="bg-[#E6FBF5] border border-emerald-100/30 text-[#00A87A] rounded-2xl p-3.5 mb-4 flex items-center gap-2.5">
                        <Clock size={16} className="flex-shrink-0 stroke-[2.5]" />
                        <span className="text-xs font-bold leading-normal">
                          Service started at {startTimeStr}
                        </span>
                      </div>
                    )}

                    {/* Progress Timeline */}
                    <div className="my-4 px-1 relative">
                      {/* Connecting Line */}
                      <div className="absolute top-[9px] left-[5%] right-[5%] h-[3px] bg-slate-100 -z-0"></div>
                      
                      {/* Dynamic color fill of connecting line */}
                      <div 
                        className={`absolute top-[9px] left-[5%] h-[3px] -z-0 transition-all duration-300 ${
                          isInProgress ? "bg-emerald-500 w-[70%]" : "bg-indigo-600 w-[45%]"
                        }`}
                      ></div>
                      
                      <div className="flex justify-between relative z-10">
                        {/* 1. Sent */}
                        <div className="flex flex-col items-center">
                          <div className={`w-5 h-5 rounded-full border-[3px] border-white flex items-center justify-center shadow-sm text-white ${
                            isInProgress ? "bg-emerald-500" : "bg-indigo-600"
                          }`}>
                            <Check size={9} className="stroke-[3]" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 mt-2">Sent</span>
                        </div>
                        
                        {/* 2. Accepted */}
                        <div className="flex flex-col items-center">
                          <div className={`w-5 h-5 rounded-full border-[3px] border-white flex items-center justify-center shadow-sm text-white ${
                            isInProgress ? "bg-emerald-500" : "bg-indigo-600"
                          }`}>
                            <Check size={9} className="stroke-[3]" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 mt-2">Accepted</span>
                        </div>

                        {/* 3. Verify */}
                        <div className="flex flex-col items-center">
                          {isAccepted ? (
                            <div className="w-5 h-5 rounded-full bg-indigo-600 border-[3px] border-white flex items-center justify-center shadow-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-white flex items-center justify-center shadow-sm text-white">
                              <Check size={9} className="stroke-[3]" />
                            </div>
                          )}
                          <span className="text-[10px] font-bold text-slate-700 mt-2">Verify</span>
                        </div>

                        {/* 4. Active */}
                        <div className="flex flex-col items-center">
                          {isInProgress ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-white flex items-center justify-center shadow-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-slate-200 border-[3px] border-white flex items-center justify-center shadow-sm"></div>
                          )}
                          <span className="text-[10px] font-bold text-slate-700 mt-2">Active</span>
                        </div>

                        {/* 5. Done */}
                        <div className="flex flex-col items-center">
                          <div className="w-5 h-5 rounded-full bg-slate-200 border-[3px] border-white flex items-center justify-center shadow-sm"></div>
                          <span className="text-[10px] font-semibold text-slate-400 mt-2">Done</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-2">
                      {isAccepted ? (
                        <>
                          <Link 
                            href="/customer/chat"
                            className="flex-1 py-3 bg-[#1A2340] hover:bg-[#2D3F6A] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-sm shadow-[#1A2340]/10"
                          >
                            <MessageSquare size={14} />
                            Chat With Worker
                          </Link>
                          <button 
                            onClick={() => setSelectedBooking(booking)}
                            className="px-5 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs transition-colors active:scale-[0.98]"
                          >
                            Details
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => setSelectedBooking(booking)}
                            className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
                          >
                            <Eye size={14} />
                            Track Progress
                          </button>
                          <Link 
                            href="/customer/chat"
                            className="px-6 py-3 bg-[#00A87A] hover:bg-[#008F68] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center active:scale-[0.98]"
                          >
                            Chat
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>
          )}

          {/* Recently Completed Section */}
          {completedBookings.length > 0 && (
            <div className="space-y-3.5 pt-2">
              <h3 className="text-sm font-extrabold text-[#1A2340] uppercase tracking-wider px-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#888BA0]"></span>
                Recently Completed ({completedBookings.length})
              </h3>
              
              {completedBookings.map((booking) => {
                const formattedDate = new Date(booking.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                
                const isCancelled = booking.status === "CANCELLED" || booking.status === "REJECTED";

                return (
                  <div 
                    key={booking.id}
                    className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.01)] relative overflow-hidden flex flex-col transition-all hover:shadow-[0_6px_20px_rgba(0,0,0,0.03)]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <img 
                          src={getWorkerAvatar(booking.workerId)} 
                          alt={booking.worker.user.name} 
                          className="w-11 h-11 rounded-full object-cover border border-slate-200/50 filter grayscale"
                        />
                        <div>
                          <h4 className="font-extrabold text-[#1A2340] text-[15px]">{booking.worker.user.name}</h4>
                          <p className="text-[11px] text-[#888BA0] font-semibold mt-0.5">
                            {booking.worker.profession[0] || "Service Pro"} • {formattedDate}
                          </p>
                        </div>
                      </div>

                      {/* Completion status icon */}
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

                    {/* Star Rating display if completed & reviewed */}
                    {!isCancelled && (
                      <div className="flex items-center gap-1 mt-4 px-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            size={16} 
                            className={`${s <= Math.round(booking.worker.rating || 5) ? "fill-[#FFB020] text-[#FFB020]" : "text-slate-200"}`} 
                          />
                        ))}
                        <span className="text-[11px] font-bold text-[#888BA0] ml-1.5">Rating</span>
                      </div>
                    )}

                    {/* Footer Buttons */}
                    <div className="flex gap-3 mt-4">
                      {!isCancelled && (
                        <button 
                          onClick={() => {
                            setRatingWorkerId(booking.workerId);
                            setRatingVal(5);
                            setReviewComment("");
                          }}
                          className="flex-1 py-3 bg-emerald-50 text-[#00A87A] hover:bg-emerald-100/70 hover:text-emerald-700 font-extrabold rounded-xl text-xs transition-colors active:scale-[0.98]"
                        >
                          Rate Experience
                        </button>
                      )}
                      
                      <Link 
                        href={`/customer/explore?search=${booking.worker.profession[0] || ""}`}
                        className={`py-3 bg-[#1A2340] hover:bg-[#2D3F6A] text-white font-extrabold rounded-xl text-xs text-center transition-colors active:scale-[0.98] shadow-sm shadow-[#1A2340]/10 ${
                          isCancelled ? "flex-1" : "flex-1"
                        }`}
                      >
                        Hire Again
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

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
                
                {/* Worker Card */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex gap-4">
                  <img 
                    src={getWorkerAvatar(selectedBooking.workerId)} 
                    alt={selectedBooking.worker.user.name} 
                    className="w-14 h-14 rounded-full object-cover border border-slate-200/50"
                  />
                  <div>
                    <h4 className="font-extrabold text-[#1A2340] text-[16px]">{selectedBooking.worker.user.name}</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                      {selectedBooking.worker.profession[0]} Specialist
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                      <Star size={13} className="fill-amber-500 text-amber-500" />
                      <span>{selectedBooking.worker.rating || "5.0"}</span>
                      <span className="text-slate-400 font-medium">({selectedBooking.worker.totalReviews || 0} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Job Info */}
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-100">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Job Requirements</label>
                    <p className="text-sm text-slate-800 leading-relaxed font-semibold mt-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      {selectedBooking.jobDetails}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1">
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
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Estimated Cost</span>
                      <span className="text-xs font-bold text-[#E8514A] mt-1 block">
                        {selectedBooking.price ? `₹${selectedBooking.price}` : "Hourly Rate / Custom"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Current Status</span>
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
                {(selectedBooking.status === "PENDING" || selectedBooking.status === "ACCEPTED") && (
                  <button
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm transition-colors active:scale-[0.98]"
                  >
                    Cancel Booking
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
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Max Budget</span>
                      <span className="text-xs font-bold text-emerald-600 mt-1 block">
                        {selectedRequest.budget ? `₹${selectedRequest.budget}` : "No preference"}
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
                  onClick={() => handleCancelRequest(selectedRequest.id)}
                  className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm transition-colors active:scale-[0.98]"
                >
                  Cancel Request
                </button>
              </div>

            </div>
          </div>
        </Portal>
      )}

      {/* 7. Rating & Review Modal (Drawer) */}
      {ratingWorkerId && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#F7F7F8] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="font-extrabold text-[#1A2340] text-[16px]">Rate Experience</h3>
                <button 
                  onClick={() => setRatingWorkerId(null)}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 border border-slate-200/60 shadow-sm transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-5 text-center">
                <div className="text-4xl">🌟</div>
                <div>
                  <h4 className="font-bold text-[#1A2340] text-base">How was your service?</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">Your rating helps other clients hire the best pros.</p>
                </div>

                {/* Rating selection (Stars) */}
                <div className="flex justify-center gap-2.5 my-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setRatingVal(s)}
                      className="border-none bg-transparent cursor-pointer p-1 transition-transform active:scale-90"
                    >
                      <Star 
                        size={32} 
                        className={`${s <= ratingVal ? "fill-[#FFB020] text-[#FFB020]" : "text-slate-200"}`} 
                      />
                    </button>
                  ))}
                </div>

                {/* Comment Text Area */}
                <div className="text-left space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Write a brief comment (optional)</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe your experience with the service provider..."
                    rows={4}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8514A]/20 focus:border-[#E8514A] transition-all text-xs font-semibold text-slate-800 resize-none leading-relaxed placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-white flex gap-3">
                <button
                  onClick={() => setRatingWorkerId(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                  className="flex-1 py-3 bg-[#E8514A] hover:bg-[#E8514A]/90 text-white font-bold rounded-xl text-sm transition-colors active:scale-[0.98] shadow-md shadow-[#E8514A]/20 flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>

            </div>
          </div>
        </Portal>
      )}

    </div>
  );
}
