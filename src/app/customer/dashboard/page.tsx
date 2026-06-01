"use client";

import Link from "next/link";
import { Search, MapPin, Briefcase } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CustomerDashboard() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="px-6 py-8 bg-primary text-white pb-16">
        <h1 className="text-2xl font-bold">{t("dashboard.welcome")}</h1>
        <p className="opacity-80 mt-1">{t("dashboard.readyToHire")}</p>
      </header>

      <main className="flex-1 px-4 -mt-8 space-y-6 pb-20">
        
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between">
          <Link href="/customer/explore" className="flex flex-col items-center gap-2 flex-1 border-r border-gray-100">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Search size={24} />
            </div>
            <span className="text-sm font-medium text-gray-700">{t("dashboard.findWorkers")}</span>
          </Link>
          <Link href="/customer/jobs" className="flex flex-col items-center gap-2 flex-1">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
              <Briefcase size={24} />
            </div>
            <span className="text-sm font-medium text-gray-700">{t("dashboard.myBookings")}</span>
          </Link>
        </div>

        {/* Recent Activity Placeholder */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t("dashboard.recentActivity")}</h2>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin size={24} className="text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-medium">{t("dashboard.noBookings")}</h3>
            <p className="text-gray-500 text-sm mt-1">{t("dashboard.startSearching")}</p>
            <Link href="/customer/explore" className="mt-4 inline-block bg-primary text-white font-medium px-6 py-2.5 rounded-xl text-sm">
              {t("dashboard.exploreWorkers")}
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
