"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { OrderStatus } from "@/lib/types/database";

const statusKeys: Record<
  OrderStatus,
  "dashboard_status_pending" | "dashboard_status_paid" | "dashboard_status_shipped" | "dashboard_status_delivered" | "dashboard_status_cancelled"
> = {
  pending: "dashboard_status_pending",
  paid: "dashboard_status_paid",
  shipped: "dashboard_status_shipped",
  delivered: "dashboard_status_delivered",
  cancelled: "dashboard_status_cancelled",
};

interface OrderRow {
  id: string;
  status: string;
  total_dzd: number;
  shipping_name: string;
  created_at: string;
}

interface CommandesContentProps {
  orders: OrderRow[] | null;
  currentStatus: string | undefined;
}

export function CommandesContent({
  orders,
  currentStatus,
}: CommandesContentProps) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-bold text-2xl text-[#1E293B] dark:text-white">
          {t("dashboard_commandes_title")}
        </h1>
        <a
          href="/api/dashboard/export-orders"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#0d1b1b] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          download
          title={t("hint_export")}
        >
          {t("dashboard_export_report")}
        </a>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link
          href="/dashboard/commandes"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            !currentStatus
              ? "bg-[#13ecec] text-[#102222]"
              : "bg-white dark:bg-[#0d1b1b] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          }`}
        >
          {t("dashboard_filter_all")}
        </Link>
        {(Object.keys(statusKeys) as OrderStatus[]).map((s) => (
          <Link
            key={s}
            href={`/dashboard/commandes?status=${s}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              currentStatus === s
                ? "bg-[#13ecec] text-[#102222]"
                : "bg-white dark:bg-[#0d1b1b] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            {t(statusKeys[s])}
          </Link>
        ))}
      </div>
      <div className="bg-white dark:bg-[#0d1b1b] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-start">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold text-[#1E293B] dark:text-white">
                {t("dashboard_date")}
              </th>
              <th className="px-6 py-4 font-semibold text-[#1E293B] dark:text-white">
                {t("dashboard_customer")}
              </th>
              <th className="px-6 py-4 font-semibold text-[#1E293B] dark:text-white">
                {t("dashboard_total")}
              </th>
              <th className="px-6 py-4 font-semibold text-[#1E293B] dark:text-white">
                {t("dashboard_status")}
              </th>
              <th className="px-6 py-4 font-semibold text-[#1E293B] dark:text-white" />
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order) => (
              <tr
                key={order.id}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
              >
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {new Date(order.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-6 py-4 font-medium text-[#1E293B] dark:text-white">
                  {order.shipping_name}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-100">
                  {order.total_dzd.toLocaleString("fr-DZ")} DA
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "pending"
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                        : order.status === "delivered"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : order.status === "cancelled"
                            ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    }`}
                  >
                    {statusKeys[order.status as OrderStatus]
                      ? t(statusKeys[order.status as OrderStatus])
                      : order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/commandes/${order.id}`}
                    className="text-teal-700 dark:text-[#13ecec] font-medium hover:underline text-sm"
                  >
                    {t("dashboard_detail")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!orders || orders.length === 0) && (
          <p className="px-6 py-12 text-center text-slate-600 dark:text-slate-400">
            {t("dashboard_no_orders_page")}
          </p>
        )}
      </div>
    </div>
  );
}
