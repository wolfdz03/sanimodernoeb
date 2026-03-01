"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { UpdateOrderStatus } from "./UpdateOrderStatus";
import type { OrderStatus } from "@/lib/types/database";

interface OrderDetailContentProps {
  order: {
    id: string;
    status: string;
    total_dzd: number;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_wilaya?: string | null;
    shipping_city?: string | null;
  };
  items: Array<{
    id: string;
    product_name: string;
    quantity: number;
    unit_price_dzd: number;
    variant_label?: string | null;
  }>;
  customerStats?: {
    totalOrders: number;
    ltv: number;
    otherOrderIds: string[];
  };
}

export function OrderDetailContent({ order, items, customerStats }: OrderDetailContentProps) {
  const { t } = useLanguage();

  return (
    <div>
      <Link
        href="/dashboard/commandes"
        className="text-sm text-teal-700 dark:text-[#13ecec] hover:underline mb-4 inline-block"
      >
        ← {t("dashboard_order_back")}
      </Link>
      <h1 className="font-bold text-2xl text-[#1E293B] dark:text-white mb-6">
        {t("dashboard_order_title")} {order.id.slice(0, 8)}…
      </h1>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-[#0d1b1b] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="font-semibold text-[#1E293B] dark:text-white mb-4">
            {t("dashboard_shipping")}
          </h2>
          <p className="font-medium text-[#1E293B] dark:text-white">
            {order.shipping_name}
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            {order.shipping_phone}
          </p>
          {order.shipping_wilaya && (
            <p className="text-slate-600 dark:text-slate-400">
              {order.shipping_wilaya}
            </p>
          )}
          {order.shipping_city && (
            <p className="text-slate-600 dark:text-slate-400">
              {order.shipping_city}
            </p>
          )}
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {order.shipping_address}
          </p>
        </div>
        <div className="bg-white dark:bg-[#0d1b1b] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-semibold text-[#1E293B] dark:text-white mb-4">
              {t("dashboard_order_status")}
            </h2>
            <UpdateOrderStatus
              orderId={order.id}
              currentStatus={order.status as OrderStatus}
            />
          </div>

          {/* Customer CRM Block */}
          {customerStats && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-sm text-[var(--dash-text-muted)] uppercase tracking-wider mb-4">Profil Client (CRM)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700/50">
                  <span className="block text-xs text-slate-500 mb-1">Commandes</span>
                  <span className="font-display font-semibold text-xl text-[#1E293B] dark:text-white">{customerStats.totalOrders}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700/50">
                  <span className="block text-xs text-slate-500 mb-1">Valeur à vie (LTV)</span>
                  <span className="font-display font-semibold text-xl text-[var(--dash-primary)]">{customerStats.ltv.toLocaleString("fr-DZ")} DA</span>
                </div>
              </div>
              {customerStats.otherOrderIds.length > 0 && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Autres commandes :</span>
                  {customerStats.otherOrderIds.map(oid => (
                    <Link key={oid} href={`/dashboard/commandes/${oid}`} className="text-sm text-[var(--dash-primary)] hover:underline">
                      #{oid.slice(-4).toUpperCase()}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#0d1b1b] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="font-semibold text-[#1E293B] dark:text-white mb-4">
          {t("dashboard_order_items")}
        </h2>
        <table className="w-full text-start">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="pb-3 font-semibold text-[#1E293B] dark:text-white">
                {t("dashboard_product")}
              </th>
              <th className="pb-3 font-semibold text-[#1E293B] dark:text-white">
                {t("dashboard_qty")}
              </th>
              <th className="pb-3 font-semibold text-[#1E293B] dark:text-white">
                {t("dashboard_unit_price")}
              </th>
              <th className="pb-3 font-semibold text-[#1E293B] dark:text-white">
                {t("dashboard_subtotal")}
              </th>
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 dark:border-slate-800"
              >
                <td className="py-3 text-[#1E293B] dark:text-white">
                  {item.product_name}
                  {item.variant_label && (
                    <span className="block text-sm text-slate-500 dark:text-slate-400">
                      {item.variant_label}
                    </span>
                  )}
                </td>
                <td className="py-3 text-slate-600 dark:text-slate-400">
                  {item.quantity}
                </td>
                <td className="py-3 text-slate-600 dark:text-slate-400">
                  {item.unit_price_dzd.toLocaleString("fr-DZ")} DA
                </td>
                <td className="py-3 font-medium text-[#1E293B] dark:text-white">
                  {(item.unit_price_dzd * item.quantity).toLocaleString("fr-DZ")}{" "}
                  DA
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <span className="font-bold text-slate-800 dark:text-slate-100">
            {t("dashboard_total_label")} :{" "}
            {order.total_dzd.toLocaleString("fr-DZ")} DA
          </span>
        </div>
      </div>
    </div>
  );
}
