import { Search, MapPin, Star, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  // Fetch real categories and top workers in parallel
  const [categories, topWorkers] = await Promise.all([
    prisma.category.findMany({
      include: {
        _count: {
          select: { workers: true }
        }
      }
    }),
    prisma.workerProfile.findMany({
      where: { rating: { gt: 0 } },
      include: { user: true, category: true },
      orderBy: { rating: 'desc' },
      take: 10
    })
  ]);

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      <header className="px-4 py-4 bg-white sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Explore</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-8">
        
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] transition-all"
            placeholder="Search services or workers..."
          />
        </div>

        {/* Categories Grid */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Categories</h2>
            <button className="text-sm font-semibold text-primary">See All</button>
          </div>
          {categories.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {categories.map(category => (
                <div key={category.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30">
                  <div className="text-2xl">{category.icon || "🔧"}</div>
                  <span className="text-xs font-semibold text-gray-800 text-center">{category.name}</span>
                  <span className="text-[10px] text-gray-400">{category._count.workers} jobs</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
              <p className="text-sm text-gray-500">No categories found.</p>
            </div>
          )}
        </section>

        {/* Top Rated Workers */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Top Rated Professionals</h2>
          </div>
          {topWorkers.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
              {topWorkers.map(worker => (
                <Link href={`/jobs/${worker.id}`} key={worker.id} className="min-w-[160px] bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm relative overflow-hidden transition-transform active:scale-[0.98]">
                  <div className="absolute top-0 left-0 w-full h-12 bg-primary/10"></div>
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm relative z-10 mt-2 mb-3 bg-gray-100 flex items-center justify-center">
                    <UserIcon className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{worker.user.name}</h3>
                  <p className="text-[11px] text-gray-500 mb-2 truncate max-w-full">
                    {worker.category?.name || (worker.skills.length > 0 ? worker.skills[0] : 'Professional')}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-700 bg-gray-50 px-2 py-1 rounded-md">
                    <Star size={12} className="text-[#F8AD9D] fill-[#F8AD9D]" />
                    {worker.rating} <span className="text-gray-400 font-normal">({worker.totalReviews})</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
              <p className="text-sm text-gray-500">No top rated workers yet.</p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
