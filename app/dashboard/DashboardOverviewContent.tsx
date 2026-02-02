"use client";

import Link from "next/link";
import { ShoppingBag, Package, FolderTree } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface DashboardOverviewContentProps {
  ordersToday: number;
  pendingOrders: number;
  productsCount: number;
  categoriesCount: number;
}

export function DashboardOverviewContent({
  ordersToday,
  pendingOrders,
  productsCount,
  categoriesCount,
}: DashboardOverviewContentProps) {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="font-bold text-2xl text-[#1E293B] mb-8">
        {t("dashboard_overview")}
      </h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/dashboard/commandes"
          className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#2563EB] hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-[#2563EB]" />
            </div>
            <span className="font-bold text-2xl text-[#1E293B]">
              {ordersToday ?? 0}
            </span>
          </div>
          <p className="text-sm text-[#64748B]">{t("dashboard_orders_today")}</p>
        </Link>
        <Link
          href="/dashboard/commandes?status=pending"
          className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#2563EB] hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-amber-600" />
            </div>
            <span className="font-bold text-2xl text-[#1E293B]">
              {pendingOrders ?? 0}
            </span>
          </div>
          <p className="text-sm text-[#64748B]">{t("dashboard_pending")}</p>
        </Link>
        <Link
          href="/dashboard/produits"
          className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#2563EB] hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <span className="font-bold text-2xl text-[#1E293B]">
              {productsCount ?? 0}
            </span>
          </div>
          <p className="text-sm text-[#64748B]">{t("dashboard_products")}</p>
        </Link>
        <Link
          href="/dashboard/categories"
          className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#2563EB] hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <FolderTree className="w-6 h-6 text-[#64748B]" />
            </div>
            <span className="font-bold text-2xl text-[#1E293B]">
              {categoriesCount ?? 0}
            </span>
          </div>
          <p className="text-sm text-[#64748B]">{t("dashboard_categories")}</p>
        </Link>
      </div>
    </div>
  );
}
