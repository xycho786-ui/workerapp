"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Camera, Mic, Paperclip, Banknote, Square, Trash2, Play, CircleStop, Loader2, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";
import Portal from "@/components/Portal";

const QUICK_SELECTIONS: Record<string, string[]> = {
  Plumbing: ["Leaking Tap", "Blocked Toilet", "No Hot Water", "Burst Pipe", "Low Water Pressure", "Radiator Issue"],
  Electrical: ["Power Outage", "Faulty Wiring", "Tripping Breaker", "Light Installation", "Socket Repair"],
  Cleaning: ["Deep Cleaning", "Standard Cleaning", "Move In/Out", "Office Cleaning"],
  "AC Repair": ["Not Cooling", "Making Noise", "Water Leaking", "Gas Refill", "Routine Service"],
  default: ["Routine Maintenance", "Urgent Repair", "Inspection Request", "Installation"]
};

function RequestFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "Service";

  const selections = QUICK_SELECTIONS[category as keyof typeof QUICK_SELECTIONS] || QUICK_SELECTIONS.default;

  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

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

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // File Upload State
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showCameraOptions, setShowCameraOptions] = useState(false);

  const handleQuickSelect = (text: string) => {
    if (description) {
      setDescription(description + ", " + text);
    } else {
      setDescription(text);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
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
    if (!description.trim()) {
      setError("Please provide a description of the problem.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("description", description);
      if (budget) formData.append("budget", budget);
      
      // Mock customer ID
      formData.append("customerId", "mock-customer-id");

      const lat = coords?.latitude ?? 40.7128;
      const lng = coords?.longitude ?? -74.0060;
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
        router.push("/customer/jobs"); // Redirect to jobs/bookings page
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white min-h-screen">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Request Sent!</h2>
        <p className="text-slate-500 text-center max-w-[280px]">Your service request has been successfully submitted to professionals in your area.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-5 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
          <ArrowLeft size={22} className="text-slate-800" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Describe the Issue</h1>
      </header>

      {/* Main Form */}
      <main className="flex-1 px-5 pb-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-[24px] leading-tight font-bold text-slate-800 mb-2">
            Describe Your {category} Problem
          </h2>
          <p className="text-[14px] text-slate-500 leading-relaxed font-medium">
            Provide specific details to help our professional partners give you an accurate quote and prepare for the job.
          </p>
        </div>

        {/* Quick Selection */}
        <div className="mb-6">
          <h3 className="text-[13px] font-bold text-slate-700 mb-3">Quick Selection</h3>
          <div className="flex flex-wrap gap-2">
            {selections.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickSelect(item)}
                className="px-4 py-2 rounded-full border border-slate-200 bg-white text-[13px] font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Problem Description */}
        <div className="mb-6 bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.03)] overflow-hidden p-4">
          <h3 className="text-[13px] font-bold text-slate-700 mb-2">Problem Description</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please explain what happened, when it started, and where the issue is located..."
            className="w-full h-32 resize-none text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
        </div>

        {/* Visual & Audio Evidence */}
        <div className="mb-6 bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.03)] p-4">
          <div className="flex items-center gap-2 mb-4">
            <Paperclip size={16} className="text-slate-700" />
            <h3 className="text-[13px] font-bold text-slate-700">Visual & Audio Evidence</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Take Photo/Video */}
            <button 
              type="button"
              onClick={() => setShowCameraOptions(true)}
              className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <Camera size={24} className="text-slate-700 mb-2" />
              <span className="text-[11px] font-medium text-slate-600">Take Photo/Video</span>
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

            {/* Record Voice */}
            {!audioUrl ? (
              <button 
                type="button"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`flex flex-col items-center justify-center p-4 border border-dashed rounded-xl transition-colors ${
                  isRecording 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                {isRecording ? (
                  <CircleStop size={24} className="text-red-500 mb-2 animate-pulse" />
                ) : (
                  <Mic size={24} className="text-red-500 mb-2" />
                )}
                <span className={`text-[11px] font-medium ${isRecording ? 'text-red-600' : 'text-slate-600'}`}>
                  {isRecording ? 'Recording...' : 'Hold to Record'}
                </span>
              </button>
            ) : (
              <div className="flex flex-col items-center justify-center p-2 border border-solid border-slate-200 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2 w-full justify-center mb-1">
                  <button type="button" onClick={() => {
                    const audio = new Audio(audioUrl);
                    audio.play();
                  }} className="p-1.5 bg-slate-200 rounded-full text-slate-700">
                    <Play size={14} />
                  </button>
                  <div className="h-1 flex-1 bg-slate-200 rounded-full overflow-hidden max-w-[50px]">
                    <div className="h-full bg-primary w-[40%] rounded-full"></div>
                  </div>
                </div>
                <button type="button" onClick={deleteRecording} className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1">
                  <Trash2 size={10} /> Delete Note
                </button>
              </div>
            )}
          </div>

          {/* Uploaded Files Preview */}
          {files.length > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {files.map((file, idx) => (
                <div key={idx} className="relative flex-shrink-0 w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                  {file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500">VIDEO</span>
                  )}
                  <button 
                    type="button" 
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Estimated Budget */}
        <div className="mb-8 bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.03)] p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Banknote size={16} className="text-green-500" />
              <h3 className="text-[13px] font-bold text-slate-700">Estimated Budget</h3>
            </div>
            <button type="button" className="text-[11px] font-bold text-slate-500 hover:text-primary transition-colors">
              View Price Guide
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
              $
            </div>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 bg-white border border-slate-100 shadow-sm rounded-xl text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
            Professionals will see this as an indicative range for your request.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
            {error}
          </div>
        )}

      </main>

      {/* Footer / Submit Area */}
      <div className="sticky bottom-[56px] p-5 bg-white/90 backdrop-blur-md border-t border-slate-100 z-40 mt-auto">
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-[15px] hover:opacity-90 active:scale-[0.98] transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sending Request...
            </>
          ) : (
            'Send Request'
          )}
        </button>
      </div>

      {/* Camera Options Modal */}
      {showCameraOptions && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
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
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
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
