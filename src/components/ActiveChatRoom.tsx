"use client";

import { useEffect, useRef, useState } from "react";
import { 
  Send, 
  Mic, 
  MapPin, 
  X, 
  Play, 
  Pause, 
  Lock, 
  ExternalLink,
  ChevronLeft,
  ArrowLeft,
  Square,
  Volume2,
  Trash2,
  Check
} from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
  type: "text" | "voice" | "location";
  text: string;
  voiceUrl: string | null;
  duration: number;
  lat: number;
  lng: number;
  address: string;
}

interface Participant {
  name: string;
  email: string;
  id: string;
  role: string;
}

interface ActiveChatRoomProps {
  bookingId: string;
  currentUserId: string;
  onBack: () => void;
}

export default function ActiveChatRoom({
  bookingId,
  currentUserId,
  onBack,
}: ActiveChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string>("ACCEPTED");
  
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const recordDurationRef = useRef<number>(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Pending elements before confirmation
  const [pendingVoice, setPendingVoice] = useState<{ voiceUrl: string; duration: number } | null>(null);
  const [isPlayingPendingVoice, setIsPlayingPendingVoice] = useState(false);
  const pendingAudioRef = useRef<HTMLAudioElement | null>(null);
  const [pendingLocation, setPendingLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  // Audio Playback States
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioPlayersRef = useRef<Record<string, HTMLAudioElement>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for new messages every 1.5 seconds
  useEffect(() => {
    let active = true;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?bookingId=${bookingId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        if (active) {
          setMessages(data.messages);
          setParticipant(data.participant);
          setBookingStatus(data.bookingStatus);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Messages fetch error:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 1500);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [bookingId]);

  // Scroll to bottom when messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send text message
  const handleSendText = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const textToSend = inputText;
    setInputText("");
    setIsSending(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
      isRead: false,
      type: "text",
      text: textToSend,
      voiceUrl: null,
      duration: 0,
      lat: 0,
      lng: 0,
      address: "",
    };

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          type: "text",
          text: textToSend,
        }),
      });

      if (!res.ok) throw new Error("Failed to send");
      const data = await res.json();
      
      setMessages(prev => prev.map(m => m.id === tempId ? data.message : m));
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.filter(m => m.id !== tempId));
      alert("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  // Start audio recording
  const startRecording = async () => {
    try {
      // Discard any existing previews
      discardPendingVoice();
      discardPendingLocation();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Url = reader.result as string;
          
          // Store voice note in pending state for preview and confirmation
          setPendingVoice({
            voiceUrl: base64Url,
            duration: recordDurationRef.current,
          });
        };

        // Stop all audio tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordDuration(0);
      recordDurationRef.current = 0;

      recordingTimerRef.current = setInterval(() => {
        setRecordDuration(prev => {
          const next = prev + 1;
          recordDurationRef.current = next;
          return next;
        });
      }, 1000);

    } catch (err) {
      console.error("Audio recording error:", err);
      alert("Could not access microphone.");
    }
  };

  // Stop audio recording
  const stopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Pending voice action: play/pause toggle
  const togglePlayPendingVoice = () => {
    if (!pendingVoice) return;
    
    if (isPlayingPendingVoice) {
      pendingAudioRef.current?.pause();
      setIsPlayingPendingVoice(false);
    } else {
      if (!pendingAudioRef.current) {
        pendingAudioRef.current = new Audio(pendingVoice.voiceUrl);
        pendingAudioRef.current.onended = () => setIsPlayingPendingVoice(false);
        pendingAudioRef.current.onerror = () => {
          console.warn("Failed to load pending voice note");
          setIsPlayingPendingVoice(false);
        };
      }
      pendingAudioRef.current.play().catch(e => {
        console.warn("Failed to play pending voice:", e);
        setIsPlayingPendingVoice(false);
      });
      setIsPlayingPendingVoice(true);
    }
  };

  // Pending voice action: discard/delete
  const discardPendingVoice = () => {
    if (pendingAudioRef.current) {
      pendingAudioRef.current.pause();
      pendingAudioRef.current = null;
    }
    setIsPlayingPendingVoice(false);
    setPendingVoice(null);
  };

  // Pending voice action: confirm and send
  const sendPendingVoice = async () => {
    if (!pendingVoice || isSending) return;
    
    const voiceToSend = pendingVoice;
    discardPendingVoice(); // clear state
    setIsSending(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
      isRead: false,
      type: "voice",
      text: "",
      voiceUrl: voiceToSend.voiceUrl,
      duration: voiceToSend.duration,
      lat: 0,
      lng: 0,
      address: "",
    };

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          type: "voice",
          voiceUrl: voiceToSend.voiceUrl,
          duration: voiceToSend.duration,
        }),
      });
      
      if (!res.ok) throw new Error("Failed to send voice");
      const data = await res.json();
      setMessages(prev => prev.map(m => m.id === tempId ? data.message : m));
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.filter(m => m.id !== tempId));
      alert("Failed to send voice note.");
    } finally {
      setIsSending(false);
    }
  };

  // Share Location trigger - captures and stages for confirmation
  const shareLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    // Discard any existing previews
    discardPendingVoice();
    discardPendingLocation();

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const address = `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        
        setPendingLocation({ lat, lng, address });
      },
      (err) => {
        console.error("Location access denied:", err);
        alert("Please enable location permissions in your browser.");
      }
    );
  };

  // Pending location action: discard/delete
  const discardPendingLocation = () => {
    setPendingLocation(null);
  };

  // Pending location action: confirm and send
  const sendPendingLocation = async () => {
    if (!pendingLocation || isSending) return;

    const locToSend = pendingLocation;
    discardPendingLocation(); // clear state
    setIsSending(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
      isRead: false,
      type: "location",
      text: "",
      voiceUrl: null,
      duration: 0,
      lat: locToSend.lat,
      lng: locToSend.lng,
      address: locToSend.address,
    };

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          type: "location",
          lat: locToSend.lat,
          lng: locToSend.lng,
          address: locToSend.address,
        }),
      });

      if (!res.ok) throw new Error("Failed to send location");
      const data = await res.json();
      setMessages(prev => prev.map(m => m.id === tempId ? data.message : m));
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.filter(m => m.id !== tempId));
      alert("Failed to share location.");
    } finally {
      setIsSending(false);
    }
  };

  // Audio Playback toggle
  const togglePlayAudio = (msgId: string, voiceUrl: string) => {
    if (playingAudioId === msgId) {
      audioPlayersRef.current[msgId]?.pause();
      setPlayingAudioId(null);
    } else {
      // Pause any currently playing audio
      if (playingAudioId && audioPlayersRef.current[playingAudioId]) {
        audioPlayersRef.current[playingAudioId].pause();
      }

      let player = audioPlayersRef.current[msgId];
      if (!player) {
        player = new Audio(voiceUrl);
        player.onended = () => setPlayingAudioId(null);
        player.onerror = () => {
          console.warn("Failed to load chat message audio:", voiceUrl);
          setPlayingAudioId(null);
        };
        audioPlayersRef.current[msgId] = player;
      }
      
      player.play().catch(e => {
        console.warn("Failed to play chat message audio:", e);
        setPlayingAudioId(null);
      });
      setPlayingAudioId(msgId);
    }
  };

  const isCompleted = bookingStatus === "COMPLETED" || bookingStatus === "CANCELLED" || bookingStatus === "REJECTED";

  // Format record duration (seconds -> MM:SS)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#E8514A] rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-bold mt-3">Loading chat room...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F5F5F7] overflow-hidden">
      
      {/* Header bar */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3 shadow-sm z-10">
        <button 
          onClick={onBack}
          className="p-1 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-800 transition-colors border-none bg-transparent cursor-pointer flex items-center"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E8514A]/10 to-[#E8514A]/20 flex items-center justify-center text-[#E8514A] font-extrabold text-xs flex-shrink-0">
            {participant?.name.substring(0, 2).toUpperCase() || "JD"}
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-[#1A2340] text-sm leading-normal truncate">{participant?.name}</h3>
            <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
              Active Now
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 flex flex-col">
        {bookingStatus === "PENDING" ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-3 max-w-[280px] mx-auto">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <Lock size={28} />
            </div>
            <h4 className="text-sm font-extrabold text-[#1A2340]">Chat is Locked</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Messaging will become available after the booking has been accepted by both the customer and the worker.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId === currentUserId;
          const timeStr = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const isPlaying = playingAudioId === m.id;

          return (
            <div 
              key={m.id}
              className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
            >
              {/* Message Bubble */}
              <div 
                className={`p-3.5 rounded-2xl shadow-sm text-xs leading-relaxed ${
                  isMe 
                    ? 'bg-[#1A2340] text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}
              >
                {/* 1. Text Message */}
                {m.type === 'text' && (
                  <p className="font-semibold whitespace-pre-wrap">{m.text}</p>
                )}

                {/* 2. Voice Note Message */}
                {m.type === 'voice' && m.voiceUrl && (
                  <div className="flex items-center gap-3 py-1 pr-1.5 min-w-[160px]">
                    <button
                      onClick={() => togglePlayAudio(m.id, m.voiceUrl!)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer shadow-sm transition-transform active:scale-95 ${
                        isMe ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-[#FFF5F5] text-[#E8514A]'
                      }`}
                    >
                      {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                    </button>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-1 text-[9px] font-bold opacity-60">
                        <Volume2 size={11} /> Voice Note
                      </div>
                      <span className="text-[11px] font-black tracking-wide mt-0.5">
                        {isPlaying ? "Playing..." : formatTime(m.duration)}
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. Location Share Message */}
                {m.type === 'location' && (
                  <div className="space-y-2 min-w-[200px]">
                    {/* Visual map pin block */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center relative overflow-hidden h-24">
                      {/* Grid background pattern */}
                      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                      <MapPin size={24} className="text-[#E8514A] animate-bounce z-10 stroke-[2.5]" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-1.5 z-10">Map Location</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 break-all leading-normal px-1">
                      {m.address}
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${m.lat},${m.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-[#E8514A] hover:bg-[#E8514A]/90 text-white font-extrabold rounded-lg text-[10px] text-center transition-colors flex items-center justify-center gap-1 decoration-none"
                    >
                      Open in Maps <ExternalLink size={10} />
                    </a>
                  </div>
                )}
              </div>

              {/* Timestamp & Read Receipt */}
              <div className="flex items-center gap-1.5 mt-1 px-1">
                <span className="text-[9px] font-bold text-slate-400">{timeStr}</span>
                {isMe && (
                  <span className={`text-[10px] font-black ${m.isRead ? 'text-blue-500' : 'text-slate-300'}`}>
                    ✓✓
                  </span>
                )}
              </div>
            </div>
          );
        }))}
        {bookingStatus !== "PENDING" && <div ref={messagesEndRef} />}
      </div>

      {/* Input area */}
      <div className="p-3.5 bg-white border-t border-slate-100 z-20">
        {bookingStatus === "PENDING" ? (
          <div className="bg-slate-50 border border-slate-100 text-[#888BA0] rounded-2xl p-4 text-center flex items-center justify-center gap-2 shadow-inner">
            <Lock size={15} className="text-slate-400 flex-shrink-0" />
            <span className="text-[11px] font-bold leading-normal">
              Messaging will become available after the booking has been accepted by both the customer and the worker.
            </span>
          </div>
        ) : isCompleted ? (
          <div className="bg-slate-50 border border-slate-100 text-[#888BA0] rounded-2xl p-4 text-center flex items-center justify-center gap-2 shadow-inner">
            <Lock size={15} className="text-slate-400 flex-shrink-0" />
            <span className="text-[11px] font-bold leading-normal">
              This conversation has been closed because the booking has ended.
            </span>
          </div>
        ) : pendingVoice ? (
          /* Voice Preview & Confirmation bar */
          <div className="flex items-center justify-between w-full max-w-md mx-auto bg-slate-50 border border-slate-200/60 rounded-xl p-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              type="button"
              onClick={discardPendingVoice}
              className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-500 border-none rounded-xl flex items-center justify-center transition-colors active:scale-95 shadow-sm animate-in fade-in"
              title="Discard Voice Note"
            >
              <Trash2 size={18} />
            </button>
            <div className="flex-1 flex items-center justify-center gap-3 px-4 min-w-0">
              <button
                type="button"
                onClick={togglePlayPendingVoice}
                className="w-9 h-9 rounded-full bg-[#1A2340] hover:bg-[#2D3F6A] text-white flex items-center justify-center border-none cursor-pointer shadow-sm transition-transform active:scale-95 flex-shrink-0"
              >
                {isPlayingPendingVoice ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
              </button>
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Voice Note Preview</span>
                <span className="text-xs font-bold text-slate-700">{formatTime(pendingVoice.duration)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={sendPendingVoice}
              disabled={isSending}
              className="w-10 h-10 bg-[#00A87A] hover:bg-[#00966D] text-white border-none rounded-xl flex items-center justify-center transition-colors active:scale-95 shadow-sm shadow-[#00A87A]/20"
              title="Send Voice Note"
            >
              <Check size={18} className="stroke-[2.5]" />
            </button>
          </div>
        ) : pendingLocation ? (
          /* Location Preview & Confirmation bar */
          <div className="flex items-center justify-between w-full max-w-md mx-auto bg-slate-50 border border-slate-200/60 rounded-xl p-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              type="button"
              onClick={discardPendingLocation}
              className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-500 border-none rounded-xl flex items-center justify-center transition-colors active:scale-95 shadow-sm animate-in fade-in"
              title="Cancel Location Sharing"
            >
              <Trash2 size={18} />
            </button>
            <div className="flex-1 flex items-center gap-3 px-4 min-w-0 text-left">
              <MapPin size={18} className="text-[#E8514A] flex-shrink-0 animate-bounce" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Share Current Location?</span>
                <span className="text-xs font-bold text-slate-700 truncate">{pendingLocation.address}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={sendPendingLocation}
              disabled={isSending}
              className="w-10 h-10 bg-[#00A87A] hover:bg-[#00966D] text-white border-none rounded-xl flex items-center justify-center transition-colors active:scale-95 shadow-sm shadow-[#00A87A]/20"
              title="Send Location"
            >
              <Check size={18} className="stroke-[2.5]" />
            </button>
          </div>
        ) : (
          /* Normal Composer bar */
          <form 
            onSubmit={handleSendText}
            className="flex items-center gap-2 max-w-md mx-auto"
          >
            {/* Share location button */}
            <button
              type="button"
              onClick={shareLocation}
              className="w-11 h-11 bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200/50 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors active:scale-95 shadow-sm"
              title="Share Location"
            >
              <MapPin size={18} />
            </button>

            {/* Voice record / Stop record button */}
            {isRecording ? (
              <button
                type="button"
                onClick={stopRecording}
                className="w-11 h-11 bg-red-500 hover:bg-red-600 text-white border-none rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95 animate-pulse shadow-md shadow-red-500/20"
                title="Stop Recording"
              >
                <Square size={16} fill="white" className="stroke-none" />
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                className="w-11 h-11 bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200/50 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors active:scale-95 shadow-sm"
                title="Record Voice Note"
              >
                <Mic size={18} />
              </button>
            )}

            {/* Text input / Recording timer */}
            <div className="flex-1 relative min-w-0">
              {isRecording ? (
                <div className="w-full bg-red-50 border border-red-100 text-red-500 rounded-xl px-4 py-3 text-[11px] font-extrabold flex items-center gap-2 animate-pulse">
                  <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                  Recording: {formatTime(recordDuration)}
                </div>
              ) : (
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type message..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1A2340]/10 focus:border-[#1A2340] text-slate-800 placeholder:text-slate-400 transition-all"
                />
              )}
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={isRecording || !inputText.trim() || isSending}
              className="w-11 h-11 bg-[#1A2340] hover:bg-[#2D3F6A] text-white border-none rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 disabled:scale-100 active:scale-95 shadow-sm shadow-[#1A2340]/20"
            >
              <Send size={15} className="-ml-0.5" />
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
