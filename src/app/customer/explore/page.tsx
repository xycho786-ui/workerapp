import { MapPin, Bell, UserIcon } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ExploreClient from "./ExploreClient";

export default async function ExplorePage(props: {
  searchParams: Promise<{ search?: string; filter?: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const filter = searchParams.filter || "newest";

  // Build the Prisma where clause based on search
  const whereClause = search
    ? {
        OR: [
          { skills: { hasSome: [search] } },
          { user: { name: { contains: search, mode: "insensitive" as const } } },
          { category: { name: { contains: search, mode: "insensitive" as const } } },
          { profession: { contains: search, mode: "insensitive" as const } },
          { customProfession: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  // Determine sort order
  let orderBy: any = { createdAt: 'desc' };
  if (filter === "top_rated") {
    orderBy = { rating: 'desc' };
  } else if (filter === "nearby") {
    orderBy = { createdAt: 'desc' };
  }

  // Fetch real workers from the database
  const workers = await prisma.workerProfile.findMany({
    where: whereClause,
    include: {
      user: true,
      category: true,
      location: true,
    },
    take: 10,
    orderBy,
  });

  return (
    <div className="flex flex-col h-full bg-[#F5F5F7] pb-20">
      
      {/* 1. Top Header */}
      <div className="bg-white px-5 pt-12 pb-4 z-10 relative">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Current Location</p>
              <h2 className="text-sm font-bold text-slate-800">Coimbatore, TN</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/customer/notifications" className="relative p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white"></span>
            </Link>
            <Link href="/customer/profile">
              <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <UserIcon className="w-full h-full p-1.5 text-slate-400" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Search & Explore Client */}
      <ExploreClient initialWorkers={workers} initialSearch={search} />
    </div>
  );
}
