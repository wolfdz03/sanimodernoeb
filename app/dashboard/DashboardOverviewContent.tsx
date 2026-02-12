"use client";

import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  FileDown,
  Plus,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { OrderStatus } from "@/lib/types/database";

const statusKeys: Record<OrderStatus, "dashboard_status_pending" | "dashboard_status_paid" | "dashboard_status_shipped" | "dashboard_status_delivered" | "dashboard_status_cancelled"> = {
  pending: "dashboard_status_pending",
  paid: "dashboard_status_paid",
  shipped: "dashboard_status_shipped",
  delivered: "dashboard_status_delivered",
  cancelled: "dashboard_status_cancelled",
};

const statusStyles: Record<OrderStatus, string> = {
  pending:
    "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400",
  paid: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
  shipped:
    "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
  delivered:
    "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400",
};

interface RecentOrder {
  id: string;
  shipping_name: string;
  created_at: string;
  status: string;
  total_dzd: number;
}

interface CategoryStat {
  name: string;
  count: number;
  percentage: number;
}

interface DashboardOverviewContentProps {
  ordersToday: number;
  pendingOrders: number;
  productsCount: number;
  lowStockCount: number;
  ordersThisWeek: number;
  totalRevenue: number;
  recentOrders: RecentOrder[];
  topCategories: CategoryStat[];
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((s) => s.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function DashboardOverviewContent({
  pendingOrders,
  lowStockCount,
  ordersThisWeek,
  totalRevenue,
  recentOrders,
  topCategories,
}: DashboardOverviewContentProps) {
  const { t } = useLanguage();
  const top3 = topCategories.slice(0, 3);
  const sum3 = top3.reduce((s, c) => s + c.percentage, 0) || 1;
  let cum = 0;
  const conicParts = top3
    .map((c, i) => {
      const pct = (c.percentage / sum3) * 100;
      const start = cum;
      cum += pct;
      const end = cum;
      const color = i === 0 ? "#13ecec" : i === 1 ? "#0ea5a5" : "#102222";
      return `${color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t("dashboard_page_title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {t("dashboard_page_subtitle")}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <FileDown className="w-5 h-5" />
            {t("dashboard_export_report")}
          </button>
          <Link
            href="/dashboard/produits/nouveau"
            className="flex items-center gap-2 px-4 py-2 bg-[#13ecec] text-[#102222] rounded-lg text-sm font-bold hover:bg-[#0ea5a5] hover:text-white transition-colors shadow-lg shadow-[#13ecec]/25"
          >
            <Plus className="w-5 h-5" />
            {t("dashboard_add_product")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#0d1b1b] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                {t("dashboard_total_revenue")}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {totalRevenue.toLocaleString("fr-DZ")} DA
              </h3>
            </div>
            <div className="p-2 bg-[#13ecec]/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-[#0ea5a5]" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-slate-400 text-xs">{t("dashboard_revenue_sub")}</span>
          </div>
        </div>

        <Link
          href="/dashboard/commandes?status=pending"
          className="bg-white dark:bg-[#0d1b1b] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow block"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                {t("dashboard_pending_orders")}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {pendingOrders}
              </h3>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-slate-400 text-xs">{t("dashboard_needs_attention")}</span>
          </div>
        </Link>

        <div className="bg-white dark:bg-[#0d1b1b] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                {t("dashboard_low_stock")}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {lowStockCount}
              </h3>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-red-500 text-xs font-medium">{t("dashboard_restock_needed")}</span>
          </div>
        </div>

        <Link
          href="/dashboard/commandes"
          className="bg-white dark:bg-[#0d1b1b] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow block"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                {t("dashboard_orders_this_week")}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {ordersThisWeek}
              </h3>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-slate-400 text-xs">{t("dashboard_this_week")}</span>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-[#0d1b1b] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-lg text-slate-800 dark:text-white">
              {t("dashboard_recent_orders")}
            </h2>
            <Link
              href="/dashboard/commandes"
              className="text-sm font-medium text-[#0ea5a5] hover:text-[#13ecec] transition-colors"
            >
              {t("dashboard_view_all")}
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-slate-500 uppercase border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <th className="px-6 py-4">{t("dashboard_order_id")}</th>
                  <th className="px-6 py-4">{t("dashboard_customer")}</th>
                  <th className="px-6 py-4">{t("dashboard_date")}</th>
                  <th className="px-6 py-4">{t("dashboard_status")}</th>
                  <th className="px-6 py-4 text-end">{t("dashboard_total")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-slate-500 dark:text-slate-400"
                    >
                      {t("dashboard_no_orders")}
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        <Link
                          href={`/dashboard/commandes/${order.id}`}
                          className="hover:text-[#13ecec] transition-colors"
                        >
                          #{order.id.slice(0, 8)}…
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                            {getInitials(order.shipping_name)}
                          </div>
                          {order.shipping_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {new Date(order.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            statusStyles[order.status as OrderStatus] ??
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {statusKeys[order.status as OrderStatus]
                            ? t(statusKeys[order.status as OrderStatus])
                            : order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-end font-medium text-slate-900 dark:text-white">
                        {order.total_dzd.toLocaleString("fr-DZ")} DA
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d1b1b] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col">
          <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-6">
            {t("dashboard_top_categories")}
          </h2>
          <div className="flex-1 flex items-center justify-center relative my-4">
            {topCategories.length === 0 ? (
              <span className="text-slate-400 text-sm">{t("dashboard_no_categories")}</span>
            ) : (
              <div
                className="relative w-48 h-48 rounded-full flex-shrink-0"
                style={{
                  background: `conic-gradient(${conicParts})`,
                }}
              >
                <div className="absolute inset-4 bg-[#f6f8f8] dark:bg-[#0d1b1b] rounded-full flex flex-col items-center justify-center shadow-inner">
                  <span className="text-3xl font-bold text-slate-800 dark:text-white">
                    {topCategories[0]?.percentage ?? 0}%
                  </span>
                  <span className="text-xs text-slate-500 uppercase tracking-wide">
                    {topCategories[0]?.name ?? "—"}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4 mt-6">
            {topCategories.slice(0, 5).map((cat, i) => {
              const colors = ["#13ecec", "#0ea5a5", "#102222", "#0d1b1b", "#64748b"];
              return (
                <div
                  key={cat.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border border-slate-600"
                      style={{
                        backgroundColor: colors[i % colors.length],
                      }}
                    />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    {cat.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

