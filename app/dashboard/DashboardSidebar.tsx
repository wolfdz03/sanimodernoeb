"use client";

import Link from "next/link";
import { LayoutDashboard, Package, FolderTree, ShoppingBag } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useLanguage } from "@/context/LanguageContext";
import { LangToggle } from "@/app/components/LangToggle";

export function DashboardSidebar() {
  const { t } = useLanguage();

  return (
    <>
      <Link
        href="/dashboard"
        className="font-bold text-xl text-[#1E293B] mb-8 flex items-center gap-2"
      >
        <LayoutDashboard className="w-6 h-6 text-[#DC2626]" />
        {t("dashboard_title")}
      </Link>
      <nav className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B] transition-colors"
        >
          <LayoutDashboard className="w-5 h-5" />
          {t("dashboard_overview")}
        </Link>
        <Link
          href="/dashboard/commandes"
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B] transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          {t("dashboard_orders")}
        </Link>
        <Link
          href="/dashboard/produits"
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B] transition-colors"
        >
          <Package className="w-5 h-5" />
          {t("dashboard_products")}
        </Link>
        <Link
          href="/dashboard/categories"
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B] transition-colors"
        >
          <FolderTree className="w-5 h-5" />
          {t("dashboard_categories")}
        </Link>
      </nav>
      <div className="mt-auto space-y-2">
        <div className="mb-3">
          <LangToggle />
        </div>
        <Link
          href="/"
          className="block text-sm text-[#64748B] hover:text-[#DC2626] transition-colors"
        >
          {t("dashboard_back_site")}
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-[#64748B] hover:text-[#DC2626] transition-colors"
          >
            {t("dashboard_logout")}
          </button>
        </form>
      </div>
    </>
  );
}
