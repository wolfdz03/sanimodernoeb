"use client";

import Link from "next/link";
import { Search, Bell, Menu } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LangToggle } from "@/app/components/LangToggle";

export function DashboardTopBar() {
  const { t } = useLanguage();

  return (
    <header className="h-20 bg-white dark:bg-[#0d1b1b] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 md:px-8 z-40 flex-shrink-0">
      <Link
        href="/dashboard"
        className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg"
        aria-label="Menu"
      >
        <Menu className="w-6 h-6" />
      </Link>
      <div className="hidden md:flex flex-1 max-w-lg relative">
        <span className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder={t("dashboard_search_placeholder")}
          className="block w-full ps-10 pe-3 py-2.5 border-none bg-slate-100 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-[#13ecec] focus:bg-white dark:focus:bg-slate-800 transition-all text-sm outline-none"
        />
      </div>
      <div className="flex items-center gap-4">
        <LangToggle />
        <button
          type="button"
          className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-[#13ecec] hover:bg-[#13ecec]/10 rounded-full transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 end-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0d1b1b]" />
        </button>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
          {t("dashboard_admin_label")}
        </span>
      </div>
    </header>
  );
}
