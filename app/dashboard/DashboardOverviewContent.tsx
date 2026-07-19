"use client";

import Link from "next/link";
import type { ElementType } from "react";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
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
  aov?: number;
  topWilayas?: { wilaya: string; count: number }[];
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

function getStatusBadge(status: string): { bg: string; dot: string } {
  switch (status) {
    case "pending":
      return { bg: "dash-badge dash-badge-amber", dot: "bg-amber-500" };
    case "paid":
    case "shipped":
    case "delivered":
      return { bg: "dash-badge dash-badge-emerald", dot: "bg-emerald-500" };
    default:
      return { bg: "dash-badge dash-badge-gray", dot: "bg-gray-400" };
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
  aov = 0,
  topWilayas = [],
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

  type StatCard = {
    label: string;
    value: string;
    icon: typeof DollarSign;
    iconBg: string;
    iconColor: string;
    cardAccent: string;
    href?: string;
    suffix?: string;
    change?: number;
    changeLabel?: string;
    changeText?: string;
    isWarning?: boolean;
    isDestructive?: boolean;
  };

  const statCards: StatCard[] = [
    {
      label: t("dashboard_todays_revenue"),
      value: todayRevenue.toLocaleString("fr-DZ"),
      suffix: "DZD",
      change: revenueChange,
      changeLabel: t("dashboard_vs_yesterday"),
      icon: DollarSign,
      iconBg: "bg-red-50",
      iconColor: "text-[var(--dash-primary)]",
      cardAccent: "emerald",
    },
    {
      label: t("dashboard_orders"),
      value: ordersToday.toString(),
      change: ordersChange,
      changeLabel: t("dashboard_vs_yesterday"),
      icon: ShoppingBag,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      cardAccent: "blue",
      href: "/dashboard/commandes",
    },
    {
      label: t("dashboard_pending"),
      value: pendingOrders.toString(),
      changeText: t("dashboard_action_needed"),
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      cardAccent: "amber",
      href: "/dashboard/commandes?status=pending",
      isWarning: true,
    },
    {
      label: t("dashboard_low_stock"),
      value: lowStockCount.toString(),
      changeText: t("dashboard_restock_soon"),
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      cardAccent: "red",
      isDestructive: true,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Greeting row */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--dash-text-main)]">
            {t(getGreeting() as Parameters<typeof t>[0])}, {displayName}
          </h2>
          <p className="text-sm text-[var(--dash-text-muted)] mt-0.5">
            {t("dashboard_page_subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="dash-btn dash-btn-secondary text-[13px] gap-2"
          >
            <CalendarDays className="h-4 w-4 text-[var(--dash-primary)]" />
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Wrapper: ElementType = card.href ? Link : "div";
          const wrapperProps = card.href ? { href: card.href } : {};
          return (
            <Wrapper
              key={card.label}
              {...wrapperProps}
              className={`dash-card dash-stat-card ${card.cardAccent} p-5 group cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-body text-[11px] font-semibold uppercase tracking-wider text-[var(--dash-text-muted)]">
                  {card.label}
                </h3>
                <div className={`rounded-lg ${card.iconBg} p-2 ${card.iconColor}`}>
                  <card.icon className="h-4 w-4" strokeWidth={2} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className="font-display text-3xl font-semibold text-[var(--dash-text-main)] tabular-nums"
                  style={{ fontFeatureSettings: '"tnum"' }}
                >
                  {card.value}
                </span>
                {"suffix" in card && card.suffix && (
                  <span className="text-sm font-medium text-[var(--dash-text-muted)]">
                    {card.suffix}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center text-xs font-medium">
                {"change" in card && card.change !== undefined ? (
                  <>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${card.change >= 0
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                      }`}>
                      {card.change >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {card.change >= 0 ? "+" : ""}{card.change}{"changeLabel" in card ? "%" : ""}
                    </span>
                    {"changeLabel" in card && (
                      <span className="ml-2 text-[var(--dash-text-muted)]">
                        {card.changeLabel}
                      </span>
                    )}
                  </>
                ) : "changeText" in card ? (
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${"isDestructive" in card
                      ? "bg-red-50 text-red-600"
                      : "bg-amber-50 text-amber-700"
                    }`}>
                    {card.changeText}
                  </span>
                ) : null}
              </div>
              {/* Hover arrow */}
              {card.href && (
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1">
                  <ArrowRight className="w-4 h-4 text-[var(--dash-text-muted)]" />
                </div>
              )}
            </Wrapper>
          );
        })}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Performance Chart */}
        <div className="col-span-1 lg:col-span-3 dash-card flex flex-col">
          <div className="flex items-center justify-between border-b border-[var(--dash-border)] px-6 py-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[var(--dash-text-muted)]" />
              <h3 className="font-display text-[15px] font-semibold text-[var(--dash-text-main)]">
                {t("dashboard_performance")}
              </h3>
            </div>
            <button
              type="button"
              className="dash-btn dash-btn-secondary text-xs py-1.5 px-3"
            >
              {t("dashboard_last_7_days")}
              <ChevronDown className="ml-1 h-3.5 w-3.5 text-gray-400" />
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
                    stopOpacity={0.12}
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
                  strokeDasharray="4 4"
                  x1={0}
                  y1={chartHeight - chartHeight * pct}
                  x2={chartWidth}
                  y2={chartHeight - chartHeight * pct}
                />
              ))}
              {dailyRevenue.map((d, i) => (
                <text
                  key={d.day}
                  className="text-[11px] fill-gray-400 font-body font-medium"
                  x={(i / (dailyRevenue.length - 1 || 1)) * chartWidth}
                  y={chartHeight + 28}
                  textAnchor="middle"
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
                    strokeWidth={2.5}
                    points={linePoints}
                  />
                  <polygon
                    fill="url(#chartGradient)"
                    stroke="none"
                    points={areaPoints}
                  />
                  {/* Data dots */}
                  {dailyRevenue.map((d, i) => {
                    const x = (i / (dailyRevenue.length - 1 || 1)) * chartWidth;
                    const y = chartHeight - (d.revenue / maxRevenue) * chartHeight;
                    return (
                      <g key={`dot-${i}`}>
                        <circle cx={x} cy={y} r={4} fill="var(--dash-primary)" stroke="white" strokeWidth={2} className="dash-chart-dot" />
                      </g>
                    );
                  })}
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="col-span-1 dash-card flex flex-col">
          <div className="flex items-center justify-between border-b border-[var(--dash-border)] px-5 py-4">
            <h3 className="font-display text-[15px] font-semibold text-[var(--dash-text-main)]">
              {t("dashboard_latest_activity")}
            </h3>
            <Link
              href="/dashboard/commandes"
              className="text-xs font-medium text-[var(--dash-primary)] hover:underline"
            >
              {t("dashboard_view_all")}
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <ul className="space-y-1">
              {activityFeed.length === 0 ? (
                <li className="py-10 text-center text-sm text-[var(--dash-text-muted)]">
                  {t("dashboard_no_orders")}
                </li>
              ) : (
                activityFeed.map((item) => {
                  const badge = getStatusBadge(item.status);
                  return (
                    <li key={item.id}>
                      <Link
                        href={`/dashboard/commandes/${item.id}`}
                        className="group flex items-start gap-3 rounded-lg p-2.5 hover:bg-gray-50"
                      >
                        <div className="mt-0.5 h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                          {getInitials(item.customerName)}
                        </div>
                        <div className="flex flex-1 flex-col min-w-0">
                          <p className="text-[13px] text-[var(--dash-text-main)] leading-tight">
                            <span className="font-semibold">
                              {item.customerName.split(/\s+/).slice(0, 2).join(" ")}
                            </span>{" "}
                            {t("dashboard_bought")}{" "}
                            <span className="text-[var(--dash-text-muted)]">
                              {item.productLabel}
                            </span>
                          </p>
                          <span className="text-[11px] text-[var(--dash-text-muted)] mt-1">
                            {formatTimeAgo(item.createdAt)}
                          </span>
                        </div>
                        <span className={`mt-1 ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} mr-1`} />
                          {statusKeys[item.status as OrderStatus] ? t(statusKeys[item.status as OrderStatus] as Parameters<typeof t>[0]) : item.status}
                        </span>
                      </Link>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Advanced Insights Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* AOV Card */}
        <div className="dash-card dash-stat-card emerald p-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--dash-text-muted)] mb-4">
            Valeur Moyenne des Commandes (AOV)
          </h3>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-display font-semibold text-[var(--dash-text-main)] tabular-nums">{aov.toLocaleString("fr-DZ")}</span>
            <span className="text-lg text-[var(--dash-text-muted)] mb-1 font-medium">DA</span>
          </div>
          <p className="text-xs text-[var(--dash-text-muted)]">Sur toutes les commandes</p>
        </div>

        {/* Top Wilayas */}
        <div className="col-span-1 lg:col-span-2 dash-card p-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--dash-text-muted)] mb-5">Top 5 Wilayas</h3>
          {topWilayas.length > 0 ? (
            <div className="space-y-4">
              {topWilayas.map((w, idx) => {
                const maxCount = Math.max(...topWilayas.map((t) => t.count));
                const width = `${Math.max((w.count / maxCount) * 100, 5)}%`;
                return (
                  <div key={w.wilaya} className="flex items-center gap-4 group">
                    <span className="w-6 text-xs font-bold text-[var(--dash-text-muted)] tabular-nums">#{idx + 1}</span>
                    <span className="w-28 text-[13px] font-medium text-[var(--dash-text-main)] truncate">{w.wilaya}</span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--dash-primary)] to-red-400"
                        style={{ width }}
                      />
                    </div>
                    <span className="w-16 text-right text-xs font-semibold text-[var(--dash-text-main)] tabular-nums">{w.count} cmdes</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[var(--dash-text-muted)]">Pas assez de données pour afficher les Wilayas.</p>
          )}
        </div>
      </div>
    </div>
  );
}
