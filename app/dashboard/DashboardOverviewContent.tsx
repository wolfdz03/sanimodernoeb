"use client";

import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { OrderStatus } from "@/lib/types/database";

const statusKeys: Record<OrderStatus, string> = {
  pending: "dashboard_status_pending",
  paid: "dashboard_status_paid",
  shipped: "dashboard_status_shipped",
  delivered: "dashboard_status_delivered",
  cancelled: "dashboard_status_cancelled",
};

interface ActivityItem {
  id: string;
  customerName: string;
  productLabel: string;
  createdAt: string;
  status: string;
}

interface DailyRevenue {
  day: string;
  revenue: number;
  label: string;
}

interface DashboardOverviewContentProps {
  adminName: string | null;
  todayRevenue: number;
  revenueChange: number;
  ordersToday: number;
  ordersChange: number;
  pendingOrders: number;
  lowStockCount: number;
  dailyRevenue: DailyRevenue[];
  activityFeed: ActivityItem[];
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "dashboard_greeting_morning";
  if (h < 18) return "dashboard_greeting_afternoon";
  return "dashboard_greeting_evening";
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((s) => s.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTimeAgo(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60_000) return "À l'instant";
  if (diff < 3600_000) return `Il y a ${Math.floor(diff / 60_000)} min`;
  if (diff < 86400_000) return `Il y a ${Math.floor(diff / 3600_000)} h`;
  if (diff < 86400_000 * 2) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-[var(--dash-warning)]";
    case "paid":
    case "shipped":
    case "delivered":
      return "bg-[var(--dash-primary)]";
    default:
      return "bg-gray-300";
  }
}

export function DashboardOverviewContent({
  adminName,
  todayRevenue,
  revenueChange,
  ordersToday,
  ordersChange,
  pendingOrders,
  lowStockCount,
  dailyRevenue,
  activityFeed,
}: DashboardOverviewContentProps) {
  const { t } = useLanguage();
  const displayName = adminName?.split(/\s+/)[0] ?? "Admin";

  const maxRevenue = Math.max(1, ...dailyRevenue.map((d) => d.revenue));
  const chartHeight = 200;
  const chartWidth = 700;

  const linePoints = dailyRevenue
    .map((d, i) => {
      const x = (i / (dailyRevenue.length - 1 || 1)) * chartWidth;
      const y = chartHeight - (d.revenue / maxRevenue) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = linePoints
    ? `0,${chartHeight} ${linePoints} ${chartWidth},${chartHeight} 0,${chartHeight}`
    : "";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--dash-text-main)]">
            {t(getGreeting() as Parameters<typeof t>[0])}, {displayName}
          </h2>
          <p className="text-sm text-[var(--dash-text-muted)]">
            {t("dashboard_page_subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2 text-sm font-medium text-[var(--dash-text-main)] shadow-[var(--dash-shadow-subtle)] hover:bg-gray-50"
          >
            <span className="text-lg">📅</span>
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5 shadow-[var(--dash-shadow-subtle)] hover:border-[var(--dash-primary)]/50 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="font-body text-xs font-medium uppercase tracking-wider text-[var(--dash-text-muted)]">
              {t("dashboard_todays_revenue")}
            </h3>
            <div className="rounded-full bg-emerald-50 p-1.5 text-[var(--dash-primary)]">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span
              className="font-display text-3xl font-medium text-[var(--dash-text-main)] tabular-nums"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {todayRevenue.toLocaleString("fr-DZ")}
            </span>
            <span className="text-sm font-medium text-[var(--dash-text-muted)]">
              DZD
            </span>
          </div>
          <div className="mt-2 flex items-center text-xs font-medium text-[var(--dash-primary)]">
            <span className="flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5">
              <TrendingUp className="mr-0.5 h-3.5 w-3.5" />
              {revenueChange}%
            </span>
            <span className="ml-2 text-[var(--dash-text-muted)]">
              {t("dashboard_vs_yesterday")}
            </span>
          </div>
        </div>

        <Link
          href="/dashboard/commandes"
          className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5 shadow-[var(--dash-shadow-subtle)] hover:border-[var(--dash-primary)]/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-body text-xs font-medium uppercase tracking-wider text-[var(--dash-text-muted)]">
              {t("dashboard_orders")}
            </h3>
            <div className="rounded-full bg-blue-50 p-1.5 text-blue-600">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span
              className="font-display text-3xl font-medium text-[var(--dash-text-main)] tabular-nums"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {ordersToday}
            </span>
          </div>
          <div className="mt-2 flex items-center text-xs font-medium text-[var(--dash-primary)]">
            <span className="flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5">
              <TrendingUp className="mr-0.5 h-3.5 w-3.5" />
              {ordersChange >= 0 ? "+" : ""}
              {ordersChange}
            </span>
            <span className="ml-2 text-[var(--dash-text-muted)]">
              {t("dashboard_vs_yesterday")}
            </span>
          </div>
        </Link>

        <Link
          href="/dashboard/commandes?status=pending"
          className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5 shadow-[var(--dash-shadow-subtle)] hover:border-[var(--dash-warning)]/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-body text-xs font-medium uppercase tracking-wider text-[var(--dash-text-muted)]">
              {t("dashboard_pending")}
            </h3>
            <div className="rounded-full bg-amber-50 p-1.5 text-[var(--dash-warning)]">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span
              className="font-display text-3xl font-medium text-[var(--dash-text-main)] tabular-nums"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {pendingOrders}
            </span>
          </div>
          <div className="mt-2 flex items-center text-xs font-medium text-[var(--dash-warning)]">
            <span className="flex items-center rounded-full bg-amber-50 px-1.5 py-0.5">
              {t("dashboard_action_needed")}
            </span>
          </div>
        </Link>

        <div className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5 shadow-[var(--dash-shadow-subtle)] hover:border-[var(--dash-destructive)]/50 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="font-body text-xs font-medium uppercase tracking-wider text-[var(--dash-text-muted)]">
              {t("dashboard_low_stock")}
            </h3>
            <div className="rounded-full bg-red-50 p-1.5 text-[var(--dash-destructive)]">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span
              className="font-display text-3xl font-medium text-[var(--dash-text-main)] tabular-nums"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {lowStockCount}
            </span>
          </div>
          <div className="mt-2 flex items-center text-xs font-medium text-[var(--dash-destructive)]">
            <span className="flex items-center rounded-full bg-red-50 px-1.5 py-0.5">
              {t("dashboard_restock_soon")}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 flex flex-col rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] shadow-[var(--dash-shadow-subtle)] lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[var(--dash-border)] px-6 py-4">
            <h3 className="font-display text-lg font-medium text-[var(--dash-text-main)]">
              {t("dashboard_performance")}
            </h3>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border border-[var(--dash-border)] bg-[var(--dash-bg-light)] px-3 py-1.5 text-xs font-medium text-[var(--dash-text-main)] hover:bg-gray-100"
            >
              {t("dashboard_last_7_days")}
              <span className="text-sm">▼</span>
            </button>
          </div>
          <div className="relative h-80 w-full p-6">
            <svg
              className="h-full w-full overflow-visible"
              viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="chartGradient"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--dash-primary)"
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--dash-primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75, 1].map((pct) => (
                <line
                  key={pct}
                  stroke="#F3F4F6"
                  strokeWidth={1}
                  x1={0}
                  y1={chartHeight - chartHeight * pct}
                  x2={chartWidth}
                  y2={chartHeight - chartHeight * pct}
                />
              ))}
              {dailyRevenue.map((d, i) => (
                <text
                  key={d.day}
                  className="text-xs fill-gray-400 font-body"
                  x={(i / (dailyRevenue.length - 1 || 1)) * chartWidth}
                  y={chartHeight + 24}
                >
                  {d.label}
                </text>
              ))}
              {linePoints && (
                <>
                  <polyline
                    fill="none"
                    stroke="var(--dash-primary)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    points={linePoints}
                  />
                  <polygon
                    fill="url(#chartGradient)"
                    stroke="none"
                    points={areaPoints}
                  />
                </>
              )}
            </svg>
          </div>
        </div>

        <div className="col-span-1 flex flex-col rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] shadow-[var(--dash-shadow-subtle)]">
          <div className="flex items-center justify-between border-b border-[var(--dash-border)] px-6 py-4">
            <h3 className="font-display text-lg font-medium text-[var(--dash-text-main)]">
              {t("dashboard_latest_activity")}
            </h3>
            <Link
              href="/dashboard/commandes"
              className="text-xs font-medium text-[var(--dash-primary)] hover:underline"
            >
              {t("dashboard_view_all")}
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-4">
              {activityFeed.length === 0 ? (
                <li className="py-8 text-center text-sm text-[var(--dash-text-muted)]">
                  {t("dashboard_no_orders")}
                </li>
              ) : (
                activityFeed.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/dashboard/commandes/${item.id}`}
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="mt-1 h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                        {getInitials(item.customerName)}
                      </div>
                      <div className="flex flex-1 flex-col min-w-0">
                        <p className="text-sm text-[var(--dash-text-main)]">
                          <span className="font-semibold">
                            {item.customerName.split(/\s+/).slice(0, 2).join(" ")}
                          </span>{" "}
                          {t("dashboard_bought")}{" "}
                          <span className="text-[var(--dash-text-muted)]">
                            {item.productLabel}
                          </span>
                        </p>
                        <span className="text-xs text-[var(--dash-text-muted)]">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </div>
                      <div
                        className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${getStatusColor(item.status)}`}
                        title={statusKeys[item.status as OrderStatus] ? t(statusKeys[item.status as OrderStatus] as Parameters<typeof t>[0]) : item.status}
                      />
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
