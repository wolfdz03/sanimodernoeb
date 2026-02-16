"use client";

import Link from "next/link";
import { useState } from "react";
import { FileDown, Plus, Inbox, Filter } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { OrderStatus } from "@/lib/types/database";
import { MarkShippedButton } from "./MarkShippedButton";

const statusKeys: Record<
  OrderStatus,
  string
> = {
  pending: "dashboard_status_pending",
  paid: "dashboard_status_paid",
  shipped: "dashboard_status_shipped",
  delivered: "dashboard_status_delivered",
  cancelled: "dashboard_status_cancelled",
};

interface OrderItem {
  product_name: string;
  quantity: number;
  variant_label?: string | null;
}

interface OrderRow {
  id: string;
  status: string;
  total_dzd: number;
  shipping_name: string;
  created_at: string;
  items: OrderItem[];
}

interface CommandesContentProps {
  orders: OrderRow[] | null;
  currentStatus: string | undefined;
}

function formatTimeAgo(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (locale === "ar") {
    if (diffMins < 1) return "الآن";
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays === 1) return "أمس";
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    return date.toLocaleDateString("ar-DZ");
  }
  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString("fr-FR");
}

function getOrderDisplayId(id: string): string {
  return `#${id.slice(-4).toUpperCase()}`;
}

function getItemsPreview(items: OrderItem[], maxLen = 35): string {
  if (items.length === 0) return "";
  const parts = items.flatMap((i) =>
    Array(i.quantity).fill(i.product_name + (i.variant_label ? ` (${i.variant_label})` : ""))
  );
  let str = parts.slice(0, 3).join(", ");
  if (parts.length > 3) str += "...";
  return str.length > maxLen ? str.slice(0, maxLen) + "..." : str;
}

export function CommandesContent({
  orders,
  currentStatus,
}: CommandesContentProps) {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");

  const isPending = (s: string) => s === "pending" || s === "paid";
  const isShipped = (s: string) => s === "shipped" || s === "delivered";

  const filtered = (orders ?? []).filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.shipping_name.toLowerCase().includes(q) ||
      getItemsPreview(o.items).toLowerCase().includes(q)
    );
  });

  const pendingOrders = filtered.filter((o) => isPending(o.status));
  const shippedOrders = filtered.filter((o) => isShipped(o.status));
  const cancelledOrders = filtered.filter((o) => o.status === "cancelled");

  const pendingCount =
    (orders ?? []).filter((o) => isPending(o.status)).length;

  const tabClass = (active: boolean) =>
    active
      ? "rounded-full bg-[var(--dash-primary)]/10 border border-transparent px-4 py-1.5 text-sm font-medium text-[var(--dash-primary)] whitespace-nowrap"
      : "rounded-full bg-transparent border border-transparent px-4 py-1.5 text-sm font-medium text-[var(--dash-text-muted)] hover:text-[var(--dash-text-main)] whitespace-nowrap transition-colors";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--dash-text-main)]">
            {t("dashboard_orders_incoming")}
          </h1>
          <p className="mt-1 text-sm text-[var(--dash-text-muted)]">
            {t("dashboard_orders_subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/api/dashboard/export-orders"
            download
            title={t("hint_export")}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--dash-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--dash-text-main)] shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--dash-primary)] focus:ring-offset-2"
          >
            <FileDown className="h-5 w-5" />
            {t("dashboard_export_report")}
          </a>
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--dash-primary)] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[var(--dash-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--dash-primary)] focus:ring-offset-2"
          >
            <Plus className="h-5 w-5" />
            {t("dashboard_orders_create")}
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
          <Link href="/dashboard/commandes" className={tabClass(!currentStatus)}>
            {t("dashboard_orders_filter_all")}
          </Link>
          <Link
            href="/dashboard/commandes?status=pending"
            className={tabClass(currentStatus === "pending")}
          >
            {t("dashboard_status_pending")}{" "}
            {pendingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-[var(--dash-primary)] px-1.5 py-0.5 text-[10px] text-white">
                {pendingCount}
              </span>
            )}
          </Link>
          <Link
            href="/dashboard/commandes?status=shipped"
            className={tabClass(currentStatus === "shipped")}
          >
            {t("dashboard_orders_filter_shipped")}
          </Link>
          <Link
            href="/dashboard/commandes?status=cancelled"
            className={tabClass(currentStatus === "cancelled")}
          >
            {t("dashboard_status_cancelled")}
          </Link>
        </div>
        <div className="relative w-full sm:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--dash-text-muted)]">
            <Filter className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("dashboard_orders_filter_placeholder")}
            className="block w-full rounded-lg border border-[var(--dash-border)] bg-white py-2 pl-9 pr-3 text-sm shadow-sm transition-all placeholder:text-[var(--dash-text-muted)] focus:border-[var(--dash-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--dash-primary)]"
          />
        </div>
      </div>

      {/* Order Cards */}
      <div className="flex flex-col gap-3">
        {/* Pending orders */}
        {pendingOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            statusStripColor="var(--dash-warning)"
            statusKey={order.status === "pending" ? "dashboard_status_pending" : "dashboard_status_paid"}
            paymentLabel={
              order.status === "pending"
                ? t("dashboard_orders_unpaid")
                : t("dashboard_orders_paid")
            }
            paymentClass={
              order.status === "pending"
                ? "text-[var(--dash-text-muted)]"
                : "text-[var(--dash-primary)] font-medium"
            }
            action={<MarkShippedButton orderId={order.id} variant="shipped" />}
            t={t as (key: string) => string}
            formatTimeAgo={(d) => formatTimeAgo(d, lang)}
            getOrderDisplayId={getOrderDisplayId}
            getItemsPreview={getItemsPreview}
          />
        ))}

        {/* Divider */}
        {pendingOrders.length > 0 && shippedOrders.length > 0 && (
          <div className="relative py-4">
            <div aria-hidden className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--dash-border)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[var(--dash-bg-light)] px-3 text-xs font-medium uppercase tracking-widest text-[var(--dash-text-muted)]">
                {t("dashboard_orders_processed_today")}
              </span>
            </div>
          </div>
        )}

        {/* Shipped orders */}
        {shippedOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            statusStripColor="var(--dash-primary)"
            statusKey="dashboard_status_shipped"
            paymentLabel={t("dashboard_orders_paid")}
            paymentClass="text-[var(--dash-primary)] font-medium"
            action={<MarkShippedButton orderId={order.id} variant="detail" />}
            t={t as (key: string) => string}
            formatTimeAgo={(d) => formatTimeAgo(d, lang)}
            getOrderDisplayId={getOrderDisplayId}
            getItemsPreview={getItemsPreview}
            opacity
          />
        ))}

        {/* Cancelled orders */}
        {cancelledOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            statusStripColor="#9CA3AF"
            statusKey="dashboard_status_cancelled"
            paymentLabel="—"
            paymentClass="text-[var(--dash-text-muted)]"
            action={<MarkShippedButton orderId={order.id} variant="detail" />}
            t={t as (key: string) => string}
            formatTimeAgo={(d) => formatTimeAgo(d, lang)}
            getOrderDisplayId={getOrderDisplayId}
            getItemsPreview={getItemsPreview}
            opacity
          />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <Inbox className="h-8 w-8 text-[var(--dash-text-muted)]" />
          </div>
          <h3 className="font-display text-lg font-medium text-[var(--dash-text-main)]">
            {t("dashboard_orders_all_caught_up")}
          </h3>
          <p className="mt-1 max-w-sm text-[var(--dash-text-muted)]">
            {t("dashboard_no_orders_page")}
          </p>
        </div>
      )}
    </div>
  );
}

interface OrderCardProps {
  order: OrderRow;
  statusStripColor: string;
  statusKey: string;
  paymentLabel: string;
  paymentClass: string;
  action: React.ReactNode;
  t: (key: string) => string;
  formatTimeAgo: (d: string) => string;
  getOrderDisplayId: (id: string) => string;
  getItemsPreview: (items: OrderItem[]) => string;
  opacity?: boolean;
}

function OrderCard({
  order,
  statusStripColor,
  statusKey,
  paymentLabel,
  paymentClass,
  action,
  t,
  formatTimeAgo,
  getOrderDisplayId,
  getItemsPreview,
  opacity,
}: OrderCardProps) {
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const itemsLabel = itemCount === 1 ? t("dashboard_orders_item") : t("dashboard_orders_items");

  return (
    <Link
      href={`/dashboard/commandes/${order.id}`}
      className={`group relative flex flex-col gap-4 overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5 shadow-sm transition-all hover:-translate-y-[2px] hover:border-gray-300 hover:shadow-[var(--dash-shadow-subtle)] sm:flex-row sm:items-center sm:justify-between ${opacity ? "opacity-75 hover:opacity-100" : ""}`}
    >
      <div
        className="absolute bottom-0 left-0 top-0 w-1"
        style={{ backgroundColor: statusStripColor }}
      />
      <div className="flex flex-col gap-1 pl-3">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-medium text-[var(--dash-text-muted)]">
            {getOrderDisplayId(order.id)}
          </span>
          <span className="h-1 w-1 rounded-full bg-gray-300" />
          <span className="text-xs text-[var(--dash-text-muted)]">
            {formatTimeAgo(order.created_at)}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium sm:hidden ${
              statusStripColor === "var(--dash-warning)"
                ? "bg-[var(--dash-warning)]/10 text-[var(--dash-warning)]"
                : statusStripColor === "var(--dash-primary)"
                  ? "bg-[var(--dash-primary)]/10 text-[var(--dash-primary)]"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {t(statusKey)}
          </span>
        </div>
        <h3 className="font-body text-base font-semibold text-[var(--dash-text-main)]">
          {order.shipping_name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-[var(--dash-text-muted)]">
          <span>
            {itemCount} {itemsLabel}
          </span>
          <span className="text-gray-300">•</span>
          <span className="truncate">{getItemsPreview(order.items) || "—"}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-6 pl-3 sm:pl-0">
        <div className="flex flex-col items-start sm:items-end">
          <span className="font-display text-lg font-semibold text-[var(--dash-text-main)]">
            {order.total_dzd.toLocaleString("fr-DZ")} DA
          </span>
          <span className={`text-xs ${paymentClass}`}>{paymentLabel}</span>
        </div>
        <div onClick={(e) => e.stopPropagation()}>{action}</div>
      </div>
    </Link>
  );
}
