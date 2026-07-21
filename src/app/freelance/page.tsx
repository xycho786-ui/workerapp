"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Star, Laptop, Code, Video, PenTool, BarChart, ExternalLink, ShieldCheck } from "lucide-react";

// Mock Freelancer Database
const MOCK_FREELANCERS = [
  {
    id: "f1",
    name: "Aria Chen",
    role: "Graphic & UI/UX Designer",
    avatar: "🎨",
    rating: 4.9,
    reviewsCount: 124,
    hourlyRate: 45,
    skills: ["Figma", "Branding", "Illustrator", "UI Design"],
    bio: "Passionate about creating modern, human-centered digital experiences and unique brand identities.",
    verified: true,
  },
  {
    id: "f2",
    name: "Marcus Vance",
    role: "Full Stack Web Developer",
    avatar: "💻",
    rating: 4.8,
    reviewsCount: 98,
    hourlyRate: 60,
    skills: ["React", "Next.js", "TypeScript", "Node.js", "Prisma"],
    bio: "Building performant, responsive web applications with clean architecture and modern stacks.",
    verified: true,
  },
  {
    id: "f3",
    name: "Elena Rostova",
    role: "Content Writer & SEO Specialist",
    avatar: "✍️",
    rating: 5.0,
    reviewsCount: 67,
    hourlyRate: 35,
    skills: ["SEO", "Copywriting", "Blog Writing", "Content Strategy"],
    bio: "Helping businesses tell their story and rank higher on search engines with high-quality content.",
    verified: false,
  },
];

// Mock Service Packages
const MOCK_PACKAGES = [
  {
    id: "p1",
    title: "Complete Brand Identity Design",
    freelancer: "Aria Chen",
    price: 350,
    deliveryTime: "5 Days",
    rating: 4.9,
    icon: <PenTool className="text-primary w-5 h-5" />,
    description: "Includes custom logo design, color palette, typography guidelines, and social media templates.",
  },
  {
    id: "p2",
    title: "High-Converting Next.js Landing Page",
    freelancer: "Marcus Vance",
    price: 500,
    deliveryTime: "7 Days",
    rating: 4.8,
    icon: <Code className="text-[#D45E5E] w-5 h-5" />,
    description: "Fully responsive, optimized for SEO and core web vitals, integrated with contact forms.",
  },
];

export default function FreelanceModule() {
  const [activeTab, setActiveTab] = useState<"browse" | "packages" | "profile">("browse");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFreelancers = MOCK_FREELANCERS.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 px-5 py-4 flex items-center gap-3">
        <Link
          href="/"
          className="p-2 -ml-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 active:scale-95"
          title="Back to Hub"
        >
          <ArrowLeft size={18} className="stroke-[2.5]" />
        </Link>
        <div className="flex-1">
          <h1 className="font-extrabold text-base text-slate-800">Freelance Services</h1>
          <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Ecosystem Phase 2</p>
        </div>
        <div className="text-[10px] font-extrabold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wide">
          Placeholder
        </div>
      </header>

      {/* Hero & Navigation Tabs */}
      <div className="bg-white px-5 pt-4 pb-1 border-b border-slate-100">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab("browse")}
            className={`flex-1 text-center py-2.5 text-xs font-bold transition-all relative border-b-2 ${
              activeTab === "browse"
                ? "text-primary border-primary"
                : "text-slate-400 border-transparent hover:text-slate-600"
            }`}
          >
            Freelancers
          </button>
          <button
            onClick={() => setActiveTab("packages")}
            className={`flex-1 text-center py-2.5 text-xs font-bold transition-all relative border-b-2 ${
              activeTab === "packages"
                ? "text-primary border-primary"
                : "text-slate-400 border-transparent hover:text-slate-600"
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 text-center py-2.5 text-xs font-bold transition-all relative border-b-2 ${
              activeTab === "profile"
                ? "text-primary border-primary"
                : "text-slate-400 border-transparent hover:text-slate-600"
            }`}
          >
            My Profile
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 p-5">
        
        {/* TAB 1: BROWSE FREELANCERS */}
        {activeTab === "browse" && (
          <div className="space-y-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by skill, name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-semibold placeholder:text-slate-400"
              />
            </div>

            {/* Freelancer list */}
            <div className="space-y-3">
              {filteredFreelancers.length > 0 ? (
                filteredFreelancers.map((freelancer) => (
                  <div
                    key={freelancer.id}
                    className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:border-primary/20 transition-all duration-200 flex flex-col gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl border border-slate-100">
                        {freelancer.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-slate-800 text-sm truncate">{freelancer.name}</h4>
                          {freelancer.verified && (
                            <span title="Identity Verified" className="shrink-0 flex items-center">
                              <ShieldCheck size={14} className="text-teal-500 fill-teal-500/10" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-semibold">{freelancer.role}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-slate-800">${freelancer.hourlyRate}</span>
                        <span className="text-[9px] text-slate-400 font-bold block">/ hr</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-normal font-medium bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
                      {freelancer.bio}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1">
                      {freelancer.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[9px] font-bold bg-slate-100/80 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-slate-50 pt-2.5 mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] font-extrabold text-amber-500">
                        <Star size={12} className="fill-amber-500" />
                        <span>{freelancer.rating}</span>
                        <span className="text-slate-400 font-bold">({freelancer.reviewsCount} reviews)</span>
                      </div>
                      <button className="text-[10px] font-bold text-primary hover:text-dark transition-colors flex items-center gap-1">
                        <span>View Portfolio</span>
                        <ExternalLink size={10} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-white border border-slate-100 rounded-2xl">
                  <p className="text-xs text-slate-400 font-bold">No freelancers found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PACKAGED SERVICES */}
        {activeTab === "packages" && (
          <div className="space-y-4">
            <div className="space-y-3">
              {MOCK_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:border-primary/20 transition-all duration-200 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                        {pkg.icon}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm leading-snug">{pkg.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold">By {pkg.freelancer}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-primary">${pkg.price}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-normal font-medium bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
                    {pkg.description}
                  </p>

                  <div className="border-t border-slate-50 pt-2.5 mt-1 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">Delivery: <span className="text-slate-600 font-extrabold">{pkg.deliveryTime}</span></span>
                    <button className="bg-primary hover:bg-primary-light text-white text-[10px] font-bold px-3.5 py-1.5 rounded-xl shadow-sm shadow-primary/20 transition-colors">
                      Purchase Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FREELANCE PROFILE SETUP */}
        {activeTab === "profile" && (
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center text-3xl mx-auto">
                💼
              </div>
              <h3 className="font-extrabold text-slate-800 text-base">Setup Freelancer Account</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Create your profile to sell services, apply to contracts, and get discovered by clients.
              </p>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Bio & Introduction</label>
                <textarea
                  placeholder="Describe your expertise, background, and what you offer..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Expertise Tags</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, Figma, SEO Copywriting (comma separated)"
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Hourly Rate ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 45"
                    className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Availability</label>
                  <select className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all">
                    <option>Available Now</option>
                    <option>Part-Time</option>
                    <option>Busy / Full</option>
                  </select>
                </div>
              </div>

              <button className="w-full mt-2 bg-primary hover:bg-primary-light text-white text-xs font-bold py-3 rounded-xl shadow-sm shadow-primary/20 transition-colors">
                Save & Publish Profile
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
