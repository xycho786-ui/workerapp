"use client";

import { useState, useRef } from "react";
import { ArrowLeft, CheckCircle, Clock, Calendar, MapPin, Briefcase, Zap, AlertCircle, Mic, Square, Play, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface BookingFormClientProps {
  workerId: string;
  workerName: string;
  profession: string;
  hourlyRate: number;
}

const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Painting",
  "Carpentry",
  "AC Repair",
  "Pest Control",
  "Salon",
  "Appliance Repair",
  "Home Maintenance"
];

export default function BookingFormClient({ workerId, workerName, profession, hourlyRate }: BookingFormClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryCategory = searchParams.get("category");
  
  // Set default service category based on query parameters or fallback
  const getInitialService = () => {
    if (queryCategory) return queryCategory;
    // Map backend profession names to exact dropdown values if needed
    if (profession.toLowerCase() === "electrician") return "Electrical";
    if (profession.toLowerCase() === "plumber") return "Plumbing";
    if (profession.toLowerCase() === "house cleaning") return "Cleaning";
    if (profession.toLowerCase() === "painter") return "Painting";
    return profession;
  };

  // Form states
  const [service, setService] = useState(getInitialService());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Anna Nagar, Chennai");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [budget, setBudget] = useState(String(hourlyRate * 3 || 1500));
  const [priority, setPriority] = useState("NORMAL"); // NORMAL, URGENT, IMMEDIATE
  
  // Voice Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Voice recording handlers
  const getSupportedAudioMimeType = () => {
    if (typeof MediaRecorder === 'undefined') return '';
    const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/aac'];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];

      const mimeType = getSupportedAudioMimeType();
      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const finalType = mimeType || mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: finalType });
        if (blob.size > 0) {
          setAudioBlob(blob);
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setError(null);
    } catch (err: any) {
      setError("Microphone permission denied or unavailable on your device.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    chunksRef.current = [];
  };

  const uploadVoiceRecording = async (): Promise<string | null> => {
    if (!audioBlob) return null;
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "voice-description.webm");
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
      return null;
    } catch (e) {
      console.error("Voice recording upload failed:", e);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date || !budget) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Upload voice recording first if present
      let voiceUrl = null;
      if (audioBlob) {
        voiceUrl = await uploadVoiceRecording();
      }

      // Combine form data into structured jobDetails for backward compatibility display
      const structuredJobDetails = `Job Title: ${title}\nService: ${service}\nDescription: ${description}\nScheduled: ${date} at ${time}\nLocation: ${location}\nPriority: ${priority}`;
      const scheduledAt = new Date(`${date}T${time}:00`);

      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId,
          jobDetails: structuredJobDetails,
          price: Number(budget),
          scheduledAt: scheduledAt.toISOString(),
          category: service,
          priority: priority,
          voiceUrl: voiceUrl
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create request");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/customer/jobs");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-white min-h-screen text-center font-sans">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 relative">
          <CheckCircle className="text-emerald-500 stroke-[2.5]" size={48} />
          <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-20"></div>
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Request Sent!</h2>
        <p className="text-slate-500 text-xs font-semibold max-w-[280px] leading-relaxed">
          Your service request has been sent to {workerName}. Redirecting to jobs list...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50 pb-8 font-sans">
      
      {/* 1. Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center gap-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
        <Link 
          href={`/customer/services`} 
          className="p-2 -ml-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-xl transition-all"
        >
          <ArrowLeft size={20} className="stroke-[2.5]" />
        </Link>
        <h1 className="text-base font-black text-slate-800">Create Job</h1>
      </header>

      {/* 2. Form Body */}
      <main className="flex-1 p-5 max-w-lg mx-auto w-full">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-5">
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Select Service */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Select Service</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs font-semibold text-slate-700 cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Job Title */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Job Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Electrical Wiring Work"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs font-semibold text-slate-800"
            />
          </div>

          {/* Job Description & Optional Voice Recorder */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Job Description</label>
            <textarea
              required
              rows={4}
              placeholder="Describe the issue or details of the task you need help with..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs font-semibold text-slate-800 resize-none shadow-inner"
            />

            {/* Voice Recorder Block */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Mic size={12} /> Add Audio Description (Optional)
                </span>
                {isRecording && (
                  <span className="flex items-center gap-1.5 text-[9px] text-rose-500 font-extrabold uppercase animate-pulse">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full inline-block"></span>
                    Recording...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!audioUrl ? (
                  !isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <Mic size={14} /> Start Recording
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <Square size={14} /> Stop Recording
                    </button>
                  )
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    <audio src={audioUrl} controls className="w-full h-8 scale-95 origin-left" />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={deleteRecording}
                        className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                      >
                        <Trash2 size={12} /> Delete Description
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <option value="Anna Nagar, Chennai">Anna Nagar, Chennai</option>
              <option value="RS Puram, Coimbatore">RS Puram, Coimbatore</option>
              <option value="Peelamedu, Coimbatore">Peelamedu, Coimbatore</option>
              <option value="Gandhipuram, Coimbatore">Gandhipuram, Coimbatore</option>
            </select>
          </div>

          {/* Preferred Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Preferred Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs font-semibold text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Preferred Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs font-semibold text-slate-800"
              />
            </div>
          </div>

          {/* Job Priority (Urgency Option) */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Job Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {["NORMAL", "URGENT", "IMMEDIATE"].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-3 rounded-2xl text-[10px] font-extrabold border text-center transition-all cursor-pointer ${
                    priority === p
                      ? p === "NORMAL"
                        ? "bg-slate-900 border-slate-900 text-white shadow-md"
                        : p === "URGENT"
                        ? "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/20"
                        : "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/20 animate-pulse"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 leading-snug">
              {priority === "NORMAL" && "Standard scheduling for worker's queue."}
              {priority === "URGENT" && "Alerts worker with high priority notifications."}
              {priority === "IMMEDIATE" && "Instantly broadcasts to nearby workers with live dashboard badges."}
            </p>
          </div>

          {/* Budget */}
          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Budget (₹)</label>
              <span className="text-[10px] text-slate-400 font-bold">Rate: ₹{hourlyRate}/hr</span>
            </div>
            <input
              type="number"
              required
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs font-semibold text-slate-800"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white text-xs font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Sending Request...
              </>
            ) : (
              "Send Request"
            )}
          </button>

        </form>
      </main>

    </div>
  );
}
