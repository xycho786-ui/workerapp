"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { 
  MessageSquare, 
  Search, 
  ArrowLeft, 
  Loader2, 
  Lock, 
  ChevronRight, 
  Clock, 
  Volume2, 
  MapPin, 
  Inbox
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import ActiveChatRoom from "@/components/ActiveChatRoom";

interface Participant {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ChatSession {
  bookingId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  jobDetails: string;
  updatedAt: string;
  lastMessageText: string;
  lastMessageTime: string;
  unreadCount: number;
  participant: Participant;
}

function WorkerChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Single Chat Room States
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  // Chat List (Inbox) States
  const [activeTab, setActiveTab] = useState("All Chats");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  // Load User Session
  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
        }
      } catch (e) {
        console.error("Failed to load user session:", e);
      } finally {
        setAuthLoading(false);
      }
    }
    loadUser();
  }, []);

  // Fetch single booking status (if bookingId provided)
  useEffect(() => {
    if (!bookingId) return;

    async function checkBookingStatus() {
      setIsLoadingStatus(true);
      try {
        const res = await fetch(`/api/chat/messages?bookingId=${bookingId}`);
        if (res.ok) {
          const data = await res.json();
          setBookingStatus(data.bookingStatus);
        }
      } catch (e) {
        console.error("Failed to fetch booking status:", e);
      } finally {
        setIsLoadingStatus(false);
      }
    }

    checkBookingStatus();
    const interval = setInterval(checkBookingStatus, 3000);
    return () => clearInterval(interval);
  }, [bookingId]);

  // Fetch all chat sessions (if no bookingId provided)
  useEffect(() => {
    if (bookingId) return;

    async function fetchSessions() {
      try {
        const res = await fetch("/api/chat/sessions");
        if (res.ok) {
          const data = await res.json();
          setSessions(data.sessions || []);
        }
      } catch (e) {
        console.error("Failed to fetch chat sessions:", e);
      } finally {
        setIsLoadingSessions(false);
      }
    }

    fetchSessions();
    const interval = setInterval(fetchSessions, 4000);
    return () => clearInterval(interval);
  }, [bookingId]);

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

  // Format time display
  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      const now = new Date();
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  // Filter sessions based on active tab and search query
  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = s.participant.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      s.jobDetails.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    
    if (activeTab === "Unread") {
      return matchesSearch && s.unreadCount > 0;
    }
    if (activeTab === "Archived") {
      // Treat cancelled/completed as archived for organization
      return matchesSearch && (s.status === "COMPLETED" || s.status === "CANCELLED" || s.status === "REJECTED");
    }
    // "All Chats" - show active chats first or all
    return matchesSearch;
  });

  // Case 1: bookingId is provided and we are loading status
  if (bookingId && (authLoading || (isLoadingStatus && !bookingStatus))) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col p-4 animate-pulse">
        <div className="flex items-center gap-3 mb-6 mt-4">
          <div className="w-10 h-10 bg-slate-200 rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
            <div className="h-3 bg-slate-200 rounded w-1/4" />
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-12 bg-slate-200 rounded-2xl w-3/4 max-w-sm self-end ml-auto" />
          <div className="h-16 bg-slate-200 rounded-2xl w-3/4 max-w-sm" />
          <div className="h-12 bg-slate-200 rounded-2xl w-2/4 max-w-sm self-end ml-auto" />
        </div>
        <div className="h-16 bg-white border border-slate-200 rounded-2xl mt-4" />
      </div>
    );
  }

  // Case 1: bookingId is provided but request is PENDING
  if (bookingId && bookingStatus === "PENDING") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FFF5F5] text-[#E8514A] flex items-center justify-center mb-5 border border-[#E8514A]/10 shadow-sm">
          <Lock size={24} className="stroke-[2.5]" />
        </div>
        <h3 className="text-base font-extrabold text-[#1A2340] mb-2">Chat Unavailable</h3>
        <p className="text-xs text-slate-500 font-medium max-w-[280px] leading-relaxed mb-6">
          Chat will become available once the worker accepts your booking request.
        </p>
        <button 
          onClick={() => router.push("/worker/dashboard")}
          className="px-6 py-3 bg-[#1A2340] hover:bg-[#2D3F6A] text-white font-bold rounded-xl text-xs transition-colors active:scale-95 shadow-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Case 2: bookingId is provided and accepted / active
  if (bookingId && currentUserId) {
    return (
      <ActiveChatRoom 
        bookingId={bookingId}
        currentUserId={currentUserId}
        onBack={() => router.push("/worker/chat")}
      />
    );
  }

  // Case 3: No bookingId - Render worker inbox list
  return (
    <div className="flex flex-col h-full bg-[#F8F9FC] font-sans pb-24 relative min-h-screen">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sticky top-0 z-40 border-b border-[#F0F0F0]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-black text-[#1A2340] tracking-tight">Messages</h1>
          </div>
          <span className="text-xs font-bold bg-[#FFF5F5] text-[#E8514A] px-2.5 py-1 rounded-full border border-[#E8514A]/10">
            Inbox Panel
          </span>
        </div>

        {/* Search Box */}
        <div className="relative w-full mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1A2340]/10 focus:border-[#1A2340] text-slate-800 placeholder:text-slate-400 transition-all"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-1">
          {["All Chats", "Unread", "Archived"].map((t) => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 rounded-full border-none cursor-pointer font-bold text-[11px] whitespace-nowrap transition-all ${
                activeTab === t 
                  ? "bg-[#1A2340] text-white shadow-sm" 
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Inbox List Area */}
      <div className="flex-1 p-4 space-y-3">
        {isLoadingSessions || authLoading ? (
          <div className="space-y-2.5 mt-2 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-3.5">
                <div className="w-11 h-11 bg-slate-200 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-2">
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-2 bg-slate-200 rounded w-1/6" />
                  </div>
                  <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-2 bg-slate-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.01)] text-center flex flex-col items-center justify-center pt-16 pb-16">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-[#888BA0] opacity-70">
              <Inbox size={28} />
            </div>
            <h4 className="font-extrabold text-[#1A2340] text-sm mb-2">No messages found</h4>
            <p className="text-xs text-[#888BA0] font-medium max-w-[240px] leading-relaxed">
              {searchQuery 
                ? "We couldn't find any chats matching your search term."
                : activeTab === "Unread" 
                  ? "You have no unread notifications or customer conversations."
                  : "Your active and past customer chats will be displayed here."}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredSessions.map((session) => {
              const avatarUrl = getCustomerAvatar(session.bookingId);
              const isActive = session.status === "ACCEPTED" || session.status === "IN_PROGRESS";

              return (
                <div
                  key={session.bookingId}
                  onClick={() => router.push(`/worker/chat?bookingId=${session.bookingId}`)}
                  className="bg-white rounded-2xl p-4 border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex items-center gap-3.5 cursor-pointer transition-all hover:translate-x-0.5 active:scale-[0.99] hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] relative overflow-hidden group"
                >
                  {/* Visual Left accent border on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1A2340] scale-y-0 group-hover:scale-y-100 transition-transform origin-center"></div>

                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <Image 
                      src={avatarUrl} 
                      alt={session.participant.name} 
                      width={44}
                      height={44}
                      className={`w-11 h-11 rounded-full object-cover border border-slate-100 shadow-sm ${!isActive ? 'grayscale opacity-75' : ''}`}
                    />
                    {isActive && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-extrabold text-[#1A2340] text-xs truncate pr-2">
                        {session.participant.name}
                      </h4>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight whitespace-nowrap">
                        {formatTime(session.lastMessageTime)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-[11px] font-semibold text-slate-500 truncate max-w-[200px] leading-tight">
                        {session.lastMessageText}
                      </p>
                      
                      {session.unreadCount > 0 ? (
                        <span className="w-5 h-5 bg-[#E8514A] text-white text-[9px] font-black rounded-full flex items-center justify-center flex-shrink-0 shadow-sm shadow-[#E8514A]/20">
                          {session.unreadCount}
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-slate-300">
                          <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      )}
                    </div>

                    {/* Meta tag */}
                    <div className="flex gap-2 items-center mt-2">
                      <span className="text-[9px] font-bold bg-slate-50 text-slate-400 border border-slate-200/50 rounded px-1.5 py-0.5 uppercase tracking-wide truncate max-w-[120px]">
                        {session.jobDetails.split(":")[0] || "Task"}
                      </span>
                      {!isActive && (
                        <span className="text-[8px] font-black bg-slate-100 text-slate-400 rounded px-1 uppercase tracking-wider">
                          Closed
                        </span>
                      )}
                      {session.status === "IN_PROGRESS" && (
                        <span className="text-[8px] font-black bg-emerald-50 text-emerald-600 rounded px-1 uppercase tracking-wider animate-pulse">
                          Active Work
                        </span>
                      )}
                      {session.status === "ACCEPTED" && (
                        <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 rounded px-1 uppercase tracking-wider">
                          En Route
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorkerChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="animate-spin text-[#E8514A] mb-3" size={24} />
        <p className="text-xs text-slate-400 font-bold">Initializing inbox...</p>
      </div>
    }>
      <WorkerChatContent />
    </Suspense>
  );
}
