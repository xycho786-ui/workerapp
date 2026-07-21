import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Star, UserIcon, ShieldCheck, Clock, Award } from "lucide-react";

export default async function WorkerDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const worker = await prisma.workerProfile.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      category: true,
    }
  });

  if (!worker) {
    notFound();
  }

  // Stable deterministic list of work gallery images based on worker ID
  const mockGalleries = [
    [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=300&h=200", // cleaning 1
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=300&h=200", // cleaning 2
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300&h=200", // cleaning 3
    ],
    [
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=300&h=200", // electrician 1
      "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=300&h=200", // electrician 2
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300&h=200", // electrician 3
    ],
    [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=300&h=200", // plumber 1
      "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?auto=format&fit=crop&q=80&w=300&h=200", // plumber 2
      "https://images.unsplash.com/photo-1542013936693-8848e5740476?auto=format&fit=crop&q=80&w=300&h=200", // plumber 3
    ]
  ];
  const galleryIndex = worker.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % mockGalleries.length;
  const galleryImages = mockGalleries[galleryIndex];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-28 font-sans">
      
      {/* 1. Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center gap-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
        <Link 
          href="/customer/services" 
          className="p-2 -ml-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-xl transition-all"
        >
          <ArrowLeft size={20} className="stroke-[2.5]" />
        </Link>
        <h1 className="text-base font-black text-slate-800">Worker Profile</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-6 space-y-6">
        
        {/* 2. Profile Details Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] relative overflow-hidden text-center flex flex-col items-center">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent"></div>
          
          <div className="relative z-10 mt-3 mb-4">
            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md relative flex items-center justify-center overflow-hidden font-extrabold text-3xl text-primary">
              {worker.user.image ? (
                <Image src={worker.user.image} alt={worker.user.name} fill className="object-cover" />
              ) : (
                <span>{worker.user.name.substring(0, 1)}</span>
              )}
            </div>
            {worker.isOnline && (
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white shadow-sm"></span>
            )}
          </div>

          <h2 className="relative z-10 text-xl font-black text-slate-800 flex items-center gap-1.5 justify-center">
            {worker.user.name}
            <ShieldCheck className="text-emerald-500 stroke-[2.5]" size={20} />
          </h2>
          
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-1">
            {worker.skills[0] || worker.category?.name || "Professional"}
          </p>

          <div className="flex items-center gap-4 mt-5 bg-slate-50 border border-slate-100 rounded-full px-5 py-2.5 text-xs text-slate-600 font-bold shadow-sm">
            <span className="flex items-center gap-1">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              {worker.rating.toFixed(1)}
              <span className="text-slate-400 font-medium">({worker.totalReviews})</span>
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="flex items-center gap-1">
              <MapPin size={14} className="text-slate-400" />
              {worker.locationAddress?.split(',')[0] || "Chennai"}
            </span>
          </div>
        </div>

        {/* 3. Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 text-center shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Award size={20} />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Experience</span>
              <span className="text-sm font-black text-slate-800">{worker.experience} Years</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 text-center shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Clock size={20} />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Working Hours</span>
              <span className="text-xs font-black text-slate-800 truncate block max-w-[120px]" title={worker.workingHours || "9 AM - 6 PM"}>
                {worker.workingHours || "9 AM - 6 PM"}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Specialized Skills */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-primary rounded-full inline-block"></span>
            Specialized Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {worker.skills.map((skill, i) => (
              <span 
                key={i} 
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100/50"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 5. About Me */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-primary rounded-full inline-block"></span>
            About Me
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            I am a professional {worker.profession[0] || "worker"} with over {worker.experience} years of experience. I specialize in providing top-quality service, keeping customer satisfaction as my primary goal. Available for bookings and requests around {worker.locationAddress || "Chennai"}.
          </p>
        </div>

        {/* 6. Work Gallery */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-primary rounded-full inline-block"></span>
            Work Gallery
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {galleryImages.map((src, i) => (
              <div key={i} className="aspect-square rounded-2xl relative bg-slate-100 overflow-hidden border border-slate-100 shadow-inner">
                <Image src={src} alt={`Work sample ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* 7. Sticky Booking Footer */}
      <footer className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] pb-6">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Rate</span>
          <p className="text-lg font-black text-slate-800 leading-tight">
            ₹{worker.hourlyRate} <span className="text-xs font-bold text-slate-400">/hr</span>
          </p>
        </div>
        
        <Link 
          href={`/customer/services/book/${worker.id}`}
          className="bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white text-xs font-black px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all"
        >
          Hire Now
        </Link>
      </footer>

    </div>
  );
}
