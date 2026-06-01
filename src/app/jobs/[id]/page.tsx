import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, UserIcon, ShieldCheck } from "lucide-react";
import BookingForm from "./BookingForm";

export default async function WorkerProfilePage(props: { params: Promise<{ id: string }> }) {
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

  return (
    <div className="flex flex-col h-full bg-gray-50/50 pb-24">
      <header className="flex items-center px-4 py-4 bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <Link href="/customer/dashboard" className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold text-gray-900 tracking-tight ml-2">Worker Profile</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-6 pb-6 max-w-lg mx-auto w-full">
        {/* Header Profile Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center mt-2">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-white shadow-md border-4 border-white flex items-center justify-center overflow-hidden">
                <UserIcon size={48} className="text-gray-300" />
              </div>
              {worker.isOnline && (
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              {worker.user.name}
              <ShieldCheck className="text-primary" size={20} />
            </h2>
            <p className="text-primary font-bold text-sm tracking-wide uppercase mt-1">
              {worker.skills.length > 0 ? worker.skills[0] : (worker.category?.name || "Professional")}
            </p>
            
            <div className="flex items-center gap-4 mt-4 text-sm font-semibold text-gray-600 bg-gray-50 rounded-full px-5 py-2 border border-gray-100">
              <span className="flex items-center gap-1.5">
                <Star size={16} className="text-orange-400 fill-orange-400" /> {worker.rating}
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="text-gray-400" /> {worker.locationAddress?.split(',')[0] || "Local"}
              </span>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Experience</p>
            <p className="text-xl font-bold text-gray-900">{worker.experience} Yrs</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Rate</p>
            <p className="text-xl font-bold text-gray-900">${worker.hourlyRate || 0}<span className="text-sm font-medium text-gray-500">/hr</span></p>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-[17px] font-bold text-gray-900 mb-3">Specialized Skills</h3>
          <div className="flex flex-wrap gap-2">
            {worker.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1.5 bg-primary/5 text-primary text-sm font-semibold rounded-lg border border-primary/10">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-[17px] font-bold text-gray-900 mb-2">About Me</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            I am a highly motivated {worker.skills.length > 0 ? worker.skills[0] : "professional"} with {worker.experience} years of hands-on experience in the industry. I pride myself on providing excellent service and ensuring my clients are completely satisfied with my work.
          </p>
        </div>

        {/* Booking Form Component */}
        <BookingForm workerId={worker.id} hourlyRate={worker.hourlyRate} />
      </main>
    </div>
  );
}
