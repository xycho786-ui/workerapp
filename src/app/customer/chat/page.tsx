"use client";

import { useEffect, useRef, useState, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebounce } from "@/hooks/useDebounce";
import Link from 'next/link';
import { 
  Send, 
  User, 
  Bot, 
  Loader2, 
  ArrowLeft, 
  Lock, 
  Search, 
  ChevronRight,
  Inbox
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import ActiveChatRoom from '@/components/ActiveChatRoom';
import { useLanguage } from "@/context/LanguageContext";
import CustomerSidebarDrawer from "@/components/CustomerSidebarDrawer";

type BotMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

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

function CustomerChatContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Chat Inbox List States
  const [activeTab, setActiveTab] = useState(t("chatPage.allChats"));
  const [searchQuery, setSearchQuery] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [showSupportBot, setShowSupportBot] = useState(false);

  // Fallback Bot States (Original Chatbot)
  const [botMessages, setBotMessages] = useState<BotMessage[]>([]);
  const [botInput, setBotInput] = useState('');
  const [isBotLoading, setIsBotLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load current user
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

  // Fetch booking status if bookingId is provided
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
    // Poll status lightly to auto-enable chat once accepted without hammering the API.
    const interval = setInterval(checkBookingStatus, 10000);
    return () => clearInterval(interval);
  }, [bookingId]);

  // Fetch all chat sessions (if no bookingId provided)
  useEffect(() => {
    if (bookingId || showSupportBot) return;

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
    const interval = setInterval(fetchSessions, 15000);
    return () => clearInterval(interval);
  }, [bookingId, showSupportBot]);

  // Scroll support bot messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [botMessages, isBotLoading]);

  // Handle Support Bot submit
  const handleBotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!botInput.trim() || isBotLoading) return;

    const userMsg: BotMessage = { id: Date.now().toString(), role: 'user', content: botInput };
    setBotMessages(prev => [...prev, userMsg]);
    setBotInput('');
    setIsBotLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...botMessages, userMsg] }),
      });

      if (!response.ok) throw new Error('Failed to fetch response');
      const data = await response.json();
      
      const assistantMsg: BotMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: data.message.content 
      };
      
      setBotMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      alert("Failed to send message to Support.");
    } finally {
      setIsBotLoading(false);
    }
  };

  // Helper for worker avatars (stable professional headshots)
  const getWorkerAvatar = (bookingId: string) => {
    const avatars = [
      "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=150&h=150", // male pro 1
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150", // female pro 1
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150", // male pro 2
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150", // female pro 2
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150", // male pro 3
    ];
    const num = bookingId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return avatars[num % avatars.length];
  };

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
    const matchesSearch = s.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.jobDetails.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === t("chatPage.unread")) {
      return matchesSearch && s.unreadCount > 0;
    }
    if (activeTab === t("chatPage.archived")) {
      return matchesSearch && (s.status === "COMPLETED" || s.status === "CANCELLED" || s.status === "REJECTED");
    }
    return matchesSearch;
  });

  // 1. If bookingId is provided and we are loading status
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

  // 1. If bookingId is provided but request is PENDING ACCEPTANCE (status 'PENDING')
  if (bookingId && bookingStatus === 'PENDING') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FFF5F5] text-[#E8514A] flex items-center justify-center mb-5 border border-[#E8514A]/10 shadow-sm">
          <Lock size={24} className="stroke-[2.5]" />
        </div>
        <h3 className="text-base font-extrabold text-[#1A2340] mb-2">{t("chatPage.chatUnavailable")}</h3>
        <p className="text-xs text-slate-500 font-medium max-w-[280px] leading-relaxed mb-6">
          Chat will become available once the worker accepts your booking request.
        </p>
        <button 
          onClick={() => router.push('/customer/jobs')}
          className="px-6 py-3 bg-[#1A2340] hover:bg-[#2D3F6A] text-white font-bold rounded-xl text-xs transition-colors active:scale-95 shadow-sm"
        >
          Back to My Jobs
        </button>
      </div>
    );
  }

  // 2. If bookingId is provided but job is COMPLETED, CANCELLED, or REJECTED
  if (bookingId && (bookingStatus === 'COMPLETED' || bookingStatus === 'CANCELLED' || bookingStatus === 'REJECTED')) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100 shadow-sm">
          <Lock size={24} className="stroke-[2.5]" />
        </div>
        <h3 className="text-base font-extrabold text-[#1A2340] mb-2">Work Completed — Chat Closed</h3>
        <p className="text-xs text-slate-500 font-medium max-w-[280px] leading-relaxed mb-6">
          This work has been completed. All chat facilities and message history for this job have been closed.
        </p>
        <button 
          onClick={() => router.push('/customer/jobs')}
          className="px-6 py-3 bg-[#1A2340] hover:bg-[#2D3F6A] text-white font-bold rounded-xl text-xs transition-colors active:scale-95 shadow-sm cursor-pointer"
        >
          Back to My Jobs
        </button>
      </div>
    );
  }

  // 2. If bookingId is provided and accepted / active
  if (bookingId && currentUserId) {
    return (
      <ActiveChatRoom 
        bookingId={bookingId}
        currentUserId={currentUserId}
        onBack={() => router.push('/customer/chat')}
      />
    );
  }

  // 3. If no bookingId, but showSupportBot is toggled
  if (showSupportBot) {
    return (
      <div className="flex flex-col h-full bg-[#F5F5F7] pb-20 min-h-screen">
        {/* Header */}
        <div className="bg-white px-5 py-4 border-b border-slate-100 shadow-sm z-10 sticky top-0 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSupportBot(false)}
              className="p-1 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-800 transition-colors border-none bg-transparent cursor-pointer flex items-center"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-sm font-extrabold text-[#1A2340] leading-none">{t("chatPage.supportAssistant")}</h2>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t("chatPage.online")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {botMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60 pt-20">
              <div className="w-16 h-16 bg-[#FFF5F5] rounded-full flex items-center justify-center mb-2">
                <Bot size={28} className="text-[#E8514A]" />
              </div>
              <h3 className="text-base font-extrabold text-[#1A2340]">{t("chatPage.bookingSupport")}</h3>
              <p className="text-xs text-slate-500 max-w-[250px] leading-relaxed font-semibold">
                I can help you manage your active bookings, answer questions, and coordinate help.
              </p>
            </div>
          ) : (
            botMessages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${m.role === 'user' ? 'bg-[#1A2340] text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {m.role === 'user' ? 'U' : 'AI'}
                </div>
                <div className={`p-3.5 rounded-2xl max-w-[80%] text-xs font-semibold leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-[#1A2340] text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))
          )}
          
          {isBotLoading && (
            <div className="flex gap-3 flex-row animate-in fade-in">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-slate-200 text-slate-600 text-xs font-bold">
                AI
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm rounded-tl-none flex gap-1 items-center">
                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Input Area */}
        <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-20">
          <form onSubmit={handleBotSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              value={botInput}
              onChange={(e) => setBotInput(e.target.value)}
              placeholder={t("chatPage.askBooking")}
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 placeholder:text-slate-400 transition-all"
            />
            <button 
              type="submit" 
              disabled={!botInput.trim() || isBotLoading}
              className="w-11 h-11 bg-[#1A2340] text-white rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-opacity-90 transition-all disabled:opacity-50 active:scale-95 shadow-sm shadow-[#1A2340]/20"
            >
              <Send size={15} className="-ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 4. Default: Render Customer Chat Inbox dashboard listing past/active chat rooms
  return (
    <div className="flex flex-col h-full bg-[#F8F9FC] font-sans pb-24 relative min-h-screen">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sticky top-0 z-40 border-b border-[#F0F0F0]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <CustomerSidebarDrawer />
            <h1 className="text-lg font-black text-[#1A2340] tracking-tight">{t("chatPage.messages")}</h1>
          </div>
          <span className="text-xs font-bold bg-[#FFF5F5] text-[#E8514A] px-2.5 py-1 rounded-full border border-[#E8514A]/10">
            Inbox
          </span>
        </div>

        {/* Search */}
        <div className="relative w-full mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder={t("chatPage.searchMessages")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all font-medium text-[#1A2340] placeholder-slate-400"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-1">
          {[t("chatPage.allChats"), t("chatPage.unread"), t("chatPage.archived")].map((t) => (
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

      {/* Conversations List */}
      <div className="flex-1 p-4 space-y-3">
        {/* Pinned Support Assistant helper card */}
        {activeTab === t("chatPage.allChats") && searchQuery === "" && (
          <div
            onClick={() => setShowSupportBot(true)}
            className="bg-white rounded-2xl p-4 border border-[#E8514A]/10 shadow-[0_2px_12px_rgba(232,81,74,0.02)] flex items-center gap-3.5 cursor-pointer transition-all hover:translate-x-0.5 active:scale-[0.99] hover:shadow-[0_4px_16px_rgba(232,81,74,0.06)] relative overflow-hidden group border-l-4 border-l-[#E8514A]"
          >
            <div className="w-11 h-11 bg-[#FFF5F5] rounded-full flex items-center justify-center text-[#E8514A] flex-shrink-0 border border-[#E8514A]/5">
              <Bot size={22} className="group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex justify-between items-baseline mb-0.5">
                <h4 className="font-black text-[#1A2340] text-xs">{t("chatPage.aiSupportAssistant")}</h4>
                <span className="text-[8px] font-black bg-[#FFF5F5] text-[#E8514A] rounded px-1.5 py-0.5 uppercase tracking-wider">
                  Helper
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 truncate leading-tight">
                Click to manage bookings, ask questions & coordinate help.
              </p>
            </div>
          </div>
        )}

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
            <h4 className="font-extrabold text-[#1A2340] text-sm mb-2">{t("chatPage.noMessagesFound")}</h4>
            <p className="text-xs text-[#888BA0] font-medium max-w-[240px] leading-relaxed">
              {searchQuery 
                ? t("chatPage.noMessagesSearch")
                : activeTab === t("chatPage.unread") 
                  ? t("chatPage.noMessagesUnread")
                  : t("chatPage.noMessagesAll")}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredSessions.map((session) => {
              const avatarUrl = getWorkerAvatar(session.bookingId);
              const isActive = session.status === "ACCEPTED" || session.status === "IN_PROGRESS";

              return (
                <div
                  key={session.bookingId}
                  onClick={() => router.push(`/customer/chat?bookingId=${session.bookingId}`)}
                  className="bg-white rounded-2xl p-4 border border-slate-100/85 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex items-center gap-3.5 cursor-pointer transition-all hover:translate-x-0.5 active:scale-[0.99] hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] relative overflow-hidden group"
                >
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

                  {/* Body details */}
                  <div className="flex-1 min-w-0 text-left">
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
                        <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      )}
                    </div>

                    {/* Metadata tags */}
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
                          Accepted
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

export default function CustomerChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="animate-spin text-[#E8514A] mb-3" size={24} />
        <p className="text-xs text-slate-400 font-bold">Initializing chat view...</p>
      </div>
    }>
      <CustomerChatContent />
    </Suspense>
  );
}
