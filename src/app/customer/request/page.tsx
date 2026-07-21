"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Camera, Mic, Paperclip, Banknote, Square, Trash2, Play, CircleStop, Loader2, Image as ImageIcon, X, MapPin } from "lucide-react";
import Link from "next/link";
import Portal from "@/components/Portal";

const QUICK_SELECTIONS: Record<string, string[]> = {
  Plumbing: ["Leaking Tap", "Blocked Toilet", "No Hot Water", "Burst Pipe", "Low Water Pressure", "Radiator Issue"],
  Electrical: ["Power Outage", "Faulty Wiring", "Tripping Breaker", "Light Installation", "Socket Repair"],
  Cleaning: ["Deep Cleaning", "Standard Cleaning", "Move In/Out", "Office Cleaning"],
  "AC Repair": ["Not Cooling", "Making Noise", "Water Leaking", "Gas Refill", "Routine Service"],
  default: ["Routine Maintenance", "Urgent Repair", "Inspection Request", "Installation"]
};

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

const LOCATIONS = [
  "Anna Nagar, Chennai",
  "Adyar, Chennai",
  "T. Nagar, Chennai",
  "Velachery, Chennai",
  "Nungambakkam, Chennai",
  "Mylapore, Chennai"
];

function RequestFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryCategory = searchParams.get("category");

  const getInitialService = () => {
    if (queryCategory) {
      const match = CATEGORIES.find(c => c.toLowerCase() === queryCategory.toLowerCase());
      if (match) return match;
    }
    return "Plumbing";
  };

  const [category, setCategory] = useState(getInitialService());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Anna Nagar, Chennai");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [budget, setBudget] = useState("1500");
  const [priority, setPriority] = useState("NORMAL"); // NORMAL, URGENT, IMMEDIATE
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // File Upload State
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showCameraOptions, setShowCameraOptions] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.warn("Geolocation access denied or unavailable", err);
        }
      );
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Microphone access is required to record voice notes.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date) {
      setError("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("category", category);
      
      const combinedDescription = `Job Title: ${title}\nDescription: ${description}\nLocation: ${location}\nDate: ${date}\nTime: ${time}\nPriority: ${priority}`;
      formData.append("description", combinedDescription);
      
      if (budget) formData.append("budget", budget);

      const lat = coords?.latitude ?? 13.0827;
      const lng = coords?.longitude ?? 80.2707;
      formData.append("latitude", lat.toString());
      formData.append("longitude", lng.toString());

      if (audioBlob) {
        formData.append("media", audioBlob, "voice-note.webm");
      }

      files.forEach((file) => {
        formData.append("media", file);
      });

      const res = await fetch("/api/requests", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to submit request");
      }

      setSuccess(true);
      setTimeout(() => {
        // Redirect directly to workers listing page for that category
        router.push(`/customer/services?category=${encodeURIComponent(category)}`);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white min-h-screen font-sans text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Request Sent!</h2>
        <p className="text-slate-500 text-xs font-semibold max-w-[280px]">
          Job created successfully! Showing nearby matching workers for you...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FC] font-sans pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white px-5 py-4 border-b border-slate-100 flex items-center gap-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl hover:bg-slate-50 transition-colors">
          <ArrowLeft size={20} className="text-slate-800 stroke-[2.5]" />
        </button>
        <h1 className="text-base font-black text-slate-850">Create Job</h1>
      </header>

      {/* Main Form */}
      <main className="flex-1 px-5 pt-6 space-y-6 overflow-y-auto max-w-md mx-auto w-full">
        
        {/* SELECT SERVICE */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Select Service</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white border border-emerald-400 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all appearance-none cursor-pointer"
            style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%23334155\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>")', backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '18px' }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* JOB TITLE */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Job Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Electrical Wiring Work"
            className="w-full bg-slate-50 border border-slate-100 focus:border-primary/20 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all shadow-inner"
          />
        </div>

        {/* JOB DESCRIPTION */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Job Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue or details of the task you need help with..."
            className="w-full h-32 bg-slate-50 border border-slate-100 focus:border-primary/20 rounded-xl p-4 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all shadow-inner resize-none"
          />
        </div>

        {/* ADD AUDIO DESCRIPTION */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Add Audio Description (Optional)</label>
          
          {!audioUrl ? (
            <button 
              type="button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed transition-all ${
                isRecording 
                  ? 'border-red-400 bg-red-50 text-red-600 font-extrabold' 
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-emerald-600 font-extrabold shadow-sm'
              } text-[11px]`}
            >
              <Mic size={14} className={isRecording ? 'animate-pulse' : ''} />
              <span>{isRecording ? 'Recording...' : 'Start Recording'}</span>
            </button>
          ) : (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => {
                  const audio = new Audio(audioUrl);
                  audio.play().catch(e => console.warn(e));
                }} className="p-2 bg-emerald-500 text-white rounded-full">
                  <Play size={12} className="fill-white" />
                </button>
                <span className="text-[10px] font-extrabold text-slate-500">Audio Note</span>
              </div>
              <button type="button" onClick={deleteRecording} className="text-red-500 p-1.5 hover:bg-red-50 rounded-lg">
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* LOCATION */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Location</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter address or location"
                className="w-full bg-slate-50 border border-slate-100 focus:border-primary/20 rounded-xl pl-4 pr-10 py-3 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all shadow-inner"
              />
              <MapPin size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <button
              type="button"
              onClick={async () => {
                if (navigator.geolocation) {
                  setLocation("Detecting location...");
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setCoords({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                      });
                      setLocation("Current GPS Location");
                    },
                    (err) => {
                      console.warn(err);
                      setLocation("Anna Nagar, Chennai");
                      alert("Unable to access current location. Please type manually.");
                    }
                  );
                } else {
                  alert("Geolocation is not supported by your browser.");
                }
              }}
              className="px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100/50 rounded-xl text-[11px] font-black transition-all flex items-center gap-1 active:scale-95 cursor-pointer flex-shrink-0"
              title="Detect Location"
            >
              GPS
            </button>
          </div>
        </div>

        {/* PREFERRED DATE & TIME */}
        <div className="grid grid-cols-2 gap-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Preferred Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 focus:border-primary/20 rounded-xl px-3 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all shadow-inner"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Preferred Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 focus:border-primary/20 rounded-xl px-3 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* JOB PRIORITY */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Job Priority</label>
          <div className="grid grid-cols-3 gap-2">
            {["NORMAL", "URGENT", "IMMEDIATE"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`py-2.5 rounded-xl border text-[11px] font-black transition-all ${
                  priority === p 
                    ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ESTIMATED BUDGET */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Estimated Budget (₹)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 focus:border-primary/20 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all shadow-inner"
          />
        </div>

        {/* EVIDENCE UPLOAD */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Job Photos/Videos (Optional)</label>
          <button 
            type="button"
            onClick={() => setShowCameraOptions(true)}
            className="w-full flex items-center justify-center gap-2 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <Camera size={18} className="text-slate-600" />
            <span className="text-[11px] font-extrabold text-slate-600">Add Photos/Videos</span>
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
          <input 
            type="file" 
            ref={cameraInputRef} 
            className="hidden" 
            accept="image/*,video/*"
            capture="environment"
            onChange={handleFileChange}
          />

          {/* Uploaded Files Preview */}
          {files.length > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {files.map((file, idx) => (
                <div key={idx} className="relative flex-shrink-0 w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                  {file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[9px] font-black text-slate-500">VIDEO</span>
                  )}
                  <button 
                    type="button" 
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md"
                  >
                    <X size={10} className="stroke-[2.5]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 bg-slate-900 text-white font-extrabold rounded-xl text-xs hover:bg-slate-800 transition-colors disabled:opacity-75 disabled:hover:bg-slate-900 cursor-pointer shadow-md shadow-slate-900/10"
        >
          {isSubmitting ? "Creating Job..." : "Create Job"}
        </button>

      </main>

      {/* Camera Options Modal */}
      {showCameraOptions && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-[15px]">Upload Evidence</h3>
                <button 
                  type="button" 
                  onClick={() => setShowCameraOptions(false)}
                  className="p-1.5 bg-white rounded-full text-slate-500 hover:text-slate-800 border border-slate-200 shadow-sm transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCameraOptions(false);
                    cameraInputRef.current?.click();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors active:scale-[0.98]"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <Camera size={22} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-800 text-[15px]">Take a Photo</h4>
                    <p className="text-[12px] text-slate-500 mt-0.5">Use your camera to capture the issue</p>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowCameraOptions(false);
                    fileInputRef.current?.click();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors active:scale-[0.98] mt-1"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                    <ImageIcon size={22} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-800 text-[15px]">Choose a Photo</h4>
                    <p className="text-[12px] text-slate-500 mt-0.5">Select from your device gallery</p>
                  </div>
                </button>
              </div>
              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => setShowCameraOptions(false)}
                  className="w-full py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
export default function RequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}>
      <RequestFormContent />
    </Suspense>
  );
}
