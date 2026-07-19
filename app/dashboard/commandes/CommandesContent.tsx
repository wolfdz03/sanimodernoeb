"use client";

import Link from "next/link";
import { useState } from "react";
import { FileDown, Plus, Inbox, Search, CheckSquare, Square, Trash2, Send, ChevronRight, MapPin, Phone, ReceiptText, Clock3, Truck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { OrderStatus } from "@/lib/types/database";
import { MarkShippedButton } from "./MarkShippedButton";
import { bulkUpdateOrderStatus } from "@/app/actions/orders";
import { useRouter } from "next/navigation";

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
  shipping_phone: string;
  shipping_wilaya?: string | null;
  shipping_city?: string | null;
  shipping_cost_dzd: number;
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

function getStatusBadge(status: string): string {
  switch (status) {
    case "pending": return "dash-badge dash-badge-amber";
    case "paid": return "dash-badge dash-badge-blue";
    case "shipped": return "dash-badge dash-badge-emerald";
    case "delivered": return "dash-badge dash-badge-emerald";
    case "cancelled": return "dash-badge dash-badge-gray";
    default: return "dash-badge dash-badge-gray";
  }
}

function getStatusDot(status: string): string {
  switch (status) {
    case "pending": return "bg-amber-500";
    case "paid": return "bg-blue-500";
    case "shipped": case "delivered": return "bg-emerald-500";
    default: return "bg-gray-400";
  }
}

export function CommandesContent({
  orders,
  currentStatus,
}: CommandesContentProps) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const isPending = (s: string) => s === "pending" || s === "paid";
  const isShipped = (s: string) => s === "shipped" || s === "delivered";

  const filtered = (orders ?? []).filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.shipping_name.toLowerCase().includes(q) ||
      o.shipping_phone.toLowerCase().includes(q) ||
      (o.shipping_wilaya ?? "").toLowerCase().includes(q) ||
      getItemsPreview(o.items).toLowerCase().includes(q)
    );
  });

  const pendingOrders = filtered.filter((o) => isPending(o.status));
  const shippedOrders = filtered.filter((o) => isShipped(o.status));
  const cancelledOrders = filtered.filter((o) => o.status === "cancelled");

  const pendingCount =
    (orders ?? []).filter((o) => isPending(o.status)).length;
  const visibleRevenue = filtered
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, order) => sum + order.total_dzd, 0);
  const shippedCount = (orders ?? []).filter((o) => isShipped(o.status)).length;

  const tabs = [
    { href: "/dashboard/commandes", label: t("dashboard_orders_filter_all"), active: !currentStatus },
    { href: "/dashboard/commandes?status=pending", label: t("dashboard_status_pending"), active: currentStatus === "pending", count: pendingCount > 0 ? pendingCount : undefined },
    { href: "/dashboard/commandes?status=shipped", label: t("dashboard_orders_filter_shipped"), active: currentStatus === "shipped" },
    { href: "/dashboard/commandes?status=cancelled", label: t("dashboard_status_cancelled"), active: currentStatus === "cancelled" },
  ];

  const toggleSelectAll = () => {
    if (selectedOrders.size === filtered.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filtered.map(o => o.id)));
    }
  };

  const toggleOrderSelection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedOrders(newSelected);
  };

  const handleBulkAction = async (status: "shipped" | "delivered" | "cancelled") => {
    if (selectedOrders.size === 0) return;
    setIsBulkLoading(true);
    const { error } = await bulkUpdateOrderStatus(Array.from(selectedOrders), status);
    if (!error) {
      setSelectedOrders(new Set());
      router.refresh();
    } else {
      alert("Erreur: " + error);
    }
    setIsBulkLoading(false);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
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
            className="dash-btn dash-btn-secondary"
          >
            <FileDown className="h-4 w-4" />
            {t("dashboard_export_report")}
          </a>
          <Link
            href="/produits"
            className="dash-btn dash-btn-primary"
          >
            <Plus className="h-4 w-4" />
            {t("dashboard_orders_create")}
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="dash-card flex items-center gap-3 p-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[var(--dash-primary)]"><ReceiptText className="h-5 w-5" /></span><span><span className="block text-xs text-[var(--dash-text-muted)]">Commandes affichées</span><strong className="font-display text-xl">{filtered.length}</strong></span></div>
        <div className="dash-card flex items-center gap-3 p-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Clock3 className="h-5 w-5" /></span><span><span className="block text-xs text-[var(--dash-text-muted)]">À traiter</span><strong className="font-display text-xl">{pendingCount}</strong></span></div>
        <div className="dash-card flex items-center gap-3 p-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Truck className="h-5 w-5" /></span><span><span className="block text-xs text-[var(--dash-text-muted)]">Traitées</span><strong className="font-display text-xl">{shippedCount}</strong><span className="ml-2 text-xs text-[var(--dash-text-muted)]">{visibleRevenue.toLocaleString("fr-DZ")} DA</span></span></div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 bg-gray-100/80 rounded-lg p-1">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium whitespace-nowrap ${tab.active
                  ? "bg-white text-[var(--dash-text-main)] shadow-sm"
                  : "text-[var(--dash-text-muted)] hover:text-[var(--dash-text-main)]"
                }`}
            >
              {tab.label}
              {tab.count != null && (
                <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--dash-primary)] px-1 text-[10px] font-bold text-white">
                  {tab.count}
                </span>
              )}
            </Link>
          ))}
        </div>
        <div className="relative w-full sm:w-60">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--dash-text-muted)]">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("dashboard_orders_filter_placeholder")}
            className="dash-input pl-9 text-[13px] h-9"
          />
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedOrders.size > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-[var(--dash-primary)]/30 bg-red-50/60 p-3">
          <span className="text-[13px] font-medium text-[var(--dash-primary)]">
            {selectedOrders.size} {selectedOrders.size === 1 ? 'commande sélectionnée' : 'commandes sélectionnées'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction("shipped")}
              disabled={isBulkLoading}
              className="dash-btn dash-btn-secondary border-[var(--dash-primary)]/20 px-3 py-1.5 text-[13px] text-[var(--dash-primary)] hover:bg-red-50 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              Expédier
            </button>
            <button
              onClick={() => handleBulkAction("cancelled")}
              disabled={isBulkLoading}
              className="dash-btn dash-btn-secondary text-[13px] py-1.5 px-3 text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Select All Row */}
      {filtered.length > 0 && (
        <div className="flex items-center gap-3 px-1 mb-1">
          <button onClick={toggleSelectAll} className="flex items-center gap-2 text-[13px] text-[var(--dash-text-muted)] hover:text-[var(--dash-text-main)]">
            {selectedOrders.size === filtered.length ? <CheckSquare className="h-4 w-4 text-[var(--dash-primary)]" /> : <Square className="h-4 w-4" />}
            Tout sélectionner
          </button>
        </div>
      )}

      {/* Order Cards */}
      <div className="flex flex-col gap-2.5">
        {/* Pending orders */}
        {pendingOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            isSelected={selectedOrders.has(order.id)}
            onToggle={(e) => toggleOrderSelection(order.id, e)}
            action={<MarkShippedButton orderId={order.id} variant="shipped" />}
            t={t as (key: string) => string}
            formatTimeAgo={(d) => formatTimeAgo(d, lang)}
          />
        ))}

        {/* Divider */}
        {pendingOrders.length > 0 && shippedOrders.length > 0 && (
          <div className="relative py-4">
            <div className="dash-divider" />
            <div className="relative flex justify-center -mt-2.5">
              <span className="bg-[var(--dash-bg-light)] px-4 text-[11px] font-semibold uppercase tracking-widest text-[var(--dash-text-muted)]">
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
            isSelected={selectedOrders.has(order.id)}
            onToggle={(e) => toggleOrderSelection(order.id, e)}
            action={<MarkShippedButton orderId={order.id} variant="detail" />}
            t={t as (key: string) => string}
            formatTimeAgo={(d) => formatTimeAgo(d, lang)}
            dimmed
          />
        ))}

        {/* Cancelled orders */}
        {cancelledOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            isSelected={selectedOrders.has(order.id)}
            onToggle={(e) => toggleOrderSelection(order.id, e)}
            action={<MarkShippedButton orderId={order.id} variant="detail" />}
            t={t as (key: string) => string}
            formatTimeAgo={(d) => formatTimeAgo(d, lang)}
            dimmed
          />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 border border-gray-100">
            <Inbox className="h-7 w-7 text-[var(--dash-text-muted)]" />
          </div>
          <h3 className="font-display text-lg font-semibold text-[var(--dash-text-main)]">
            {t("dashboard_orders_all_caught_up")}
          </h3>
          <p className="mt-1.5 max-w-sm text-sm text-[var(--dash-text-muted)]">
            {t("dashboard_no_orders_page")}
          </p>
        </div>
      )}
    </div>
  );
}

interface OrderCardProps {
  order: OrderRow;
  isSelected: boolean;
  onToggle: (e: React.MouseEvent) => void;
  action: React.ReactNode;
  t: (key: string) => string;
  formatTimeAgo: (d: string) => string;
  dimmed?: boolean;
}

function OrderCard({
  order,
  isSelected,
  onToggle,
  action,
  t,
  formatTimeAgo,
  dimmed,
}: OrderCardProps) {
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const itemsLabel = itemCount === 1 ? t("dashboard_orders_item") : t("dashboard_orders_items");
  const statusBadge = getStatusBadge(order.status);
  const statusDot = getStatusDot(order.status);

  return (
    <Link
      href={`/dashboard/commandes/${order.id}`}
      className={`group relative flex flex-col gap-4 overflow-hidden dash-card p-5 sm:flex-row sm:items-center sm:justify-between ${isSelected ? "!border-[var(--dash-primary)] ring-1 ring-[var(--dash-primary)]/20" : ""
        } ${dimmed ? "opacity-70 hover:opacity-100" : ""}`}
    >
      {/* Left strip */}
      <div
        className="absolute bottom-0 left-0 top-0 w-[3px] rounded-l-[var(--dash-radius)]"
        style={{ backgroundColor: order.status === "pending" || order.status === "paid" ? "var(--dash-warning)" : order.status === "cancelled" ? "#9CA3AF" : "var(--dash-primary)" }}
      />

      <div className="flex items-center gap-4 pl-3">
        <button onClick={onToggle} className="text-[var(--dash-text-muted)] hover:text-[var(--dash-text-main)]">
          {isSelected ? <CheckSquare className="h-4 w-4 text-[var(--dash-primary)]" /> : <Square className="h-4 w-4" />}
        </button>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-display text-[13px] font-semibold text-[var(--dash-text-muted)] tabular-nums">
              {getOrderDisplayId(order.id)}
            </span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span className="text-[11px] text-[var(--dash-text-muted)]">
              {formatTimeAgo(order.created_at)}
            </span>
            <span className={statusBadge}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot} mr-1`} />
              {t(statusKeys[order.status as OrderStatus] ?? order.status)}
            </span>
          </div>
          <h3 className="font-body text-[15px] font-semibold text-[var(--dash-text-main)]">
            {order.shipping_name}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--dash-text-muted)]">
            <span>{itemCount} {itemsLabel}</span>
            <span className="max-w-[220px] truncate">{getItemsPreview(order.items) || "-"}</span>
            <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{order.shipping_phone}</span>
            {(order.shipping_city || order.shipping_wilaya) && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{[order.shipping_city, order.shipping_wilaya].filter(Boolean).join(", ")}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-6 pl-3 sm:pl-0">
        <div className="flex flex-col items-start sm:items-end">
          <span className="font-display text-lg font-semibold text-[var(--dash-text-main)] tabular-nums">
            {order.total_dzd.toLocaleString("fr-DZ")} DA
          </span>
          <span className="text-[11px] text-[var(--dash-text-muted)]">Livraison: {order.shipping_cost_dzd.toLocaleString("fr-DZ")} DA</span>
        </div>
        <div className="flex items-center gap-2">
          <div onClick={(e) => e.stopPropagation()}>{action}</div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[var(--dash-text-muted)] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0" />
        </div>
      </div>
    </Link>
  );
}
