"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
    DollarSign,
    ShoppingBag,
    TrendingUp,
    Percent,
    Download,
    Calendar,
    BarChart3,
    MapPin,
    Package,
    Clock,
    AlertTriangle,
} from "lucide-react";

/* ─── Types ─── */
interface DailyData {
    date: string;
    revenue: number;
    orders: number;
    label: string;
}

interface AnalyticsContentProps {
    dailyData: DailyData[];
    statusCounts: Record<string, number>;
    topWilayas: { wilaya: string; count: number; revenue: number }[];
    topProducts: { name: string; qty: number; revenue: number }[];
    hourlyDistribution: number[];
    totalRevenue: number;
    totalOrders: number;
    aov: number;
    cancelRate: number;
    lowStockProducts: { id: string; name: string; stock: number; price: number; image: string | null }[];
}

type DateRange = "7" | "14" | "30";

/* ─── Helpers ─── */
function fmt(n: number): string {
    return n.toLocaleString("fr-DZ");
}

function exportCSV(dailyData: DailyData[], range: DateRange) {
    const rows = dailyData.slice(-Number(range));
    const csv = [
        "Date,Revenu (DZD),Commandes",
        ...rows.map((d) => `${d.date},${d.revenue},${d.orders}`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${range}j-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

/* ─── SVG Mini-Chart Components ─── */

function AreaChart({
    data,
    height = 220,
    width = 800,
    color = "var(--dash-primary)",
    showDots = true,
}: {
    data: { value: number; label: string }[];
    height?: number;
    width?: number;
    color?: string;
    showDots?: boolean;
}) {
    const max = Math.max(1, ...data.map((d) => d.value));
    const padding = { top: 10, bottom: 40, left: 0, right: 0 };
    const chartH = height - padding.top - padding.bottom;
    const chartW = width - padding.left - padding.right;

    const points = data.map((d, i) => {
        const x = padding.left + (i / (data.length - 1 || 1)) * chartW;
        const y = padding.top + chartH - (d.value / max) * chartH;
        return { x, y, value: d.value, label: d.label };
    });

    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? 0} ${padding.top + chartH} L ${padding.left} ${padding.top + chartH} Z`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
                <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((pct) => (
                <line
                    key={pct}
                    x1={padding.left}
                    y1={padding.top + chartH - chartH * pct}
                    x2={width - padding.right}
                    y2={padding.top + chartH - chartH * pct}
                    stroke="#F3F4F6"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                />
            ))}
            {/* Y-axis labels */}
            {[0, 0.5, 1].map((pct) => (
                <text
                    key={`y-${pct}`}
                    x={0}
                    y={padding.top + chartH - chartH * pct - 4}
                    className="text-[10px] fill-gray-400"
                    textAnchor="start"
                >
                    {fmt(Math.round(max * pct))}
                </text>
            ))}
            {/* Area + line */}
            <path d={areaPath} fill="url(#areaGrad)" />
            <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            {/* X-axis labels */}
            {points.filter((_, i) => i % Math.max(1, Math.floor(data.length / 8)) === 0 || i === data.length - 1).map((p) => (
                <text
                    key={p.label}
                    x={p.x}
                    y={height - 6}
                    className="text-[10px] fill-gray-400 font-medium"
                    textAnchor="middle"
                >
                    {p.label}
                </text>
            ))}
            {/* Dots */}
            {showDots && points.map((p, i) => (
                <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={3.5}
                    fill={color}
                    stroke="white"
                    strokeWidth={2}
                />
            ))}
        </svg>
    );
}

function BarChartH({
    data,
    maxValue,
}: {
    data: { label: string; value: number; suffix?: string }[];
    maxValue?: number;
}) {
    const max = maxValue ?? Math.max(1, ...data.map((d) => d.value));
    return (
        <div className="space-y-3">
            {data.map((d, i) => (
                <div key={d.label} className="flex items-center gap-4">
                    <span className="w-5 text-[11px] font-bold text-[var(--dash-text-muted)] tabular-nums text-right">
                        #{i + 1}
                    </span>
                    <span className="w-28 text-[13px] font-medium text-[var(--dash-text-main)] truncate">
                        {d.label}
                    </span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[var(--dash-primary)] to-emerald-400 rounded-full"
                            style={{ width: `${Math.max((d.value / max) * 100, 3)}%` }}
                        />
                    </div>
                    <span className="w-24 text-right text-xs font-semibold text-[var(--dash-text-main)] tabular-nums">
                        {fmt(d.value)} {d.suffix ?? ""}
                    </span>
                </div>
            ))}
        </div>
    );
}

function DonutChart({
    segments,
}: {
    segments: { label: string; value: number; color: string }[];
}) {
    const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
    const r = 42;
    const circumference = 2 * Math.PI * r;
    const offsets = segments.map((_, index) =>
        segments.slice(0, index).reduce(
            (sum, segment) => sum + (segment.value / total) * circumference,
            0
        )
    );

    return (
        <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {segments.map((seg, index) => {
                        const dashLen = (seg.value / total) * circumference;
                        const dashGap = circumference - dashLen;
                        const el = (
                            <circle
                                key={seg.label}
                                cx={50}
                                cy={50}
                                r={r}
                                fill="none"
                                stroke={seg.color}
                                strokeWidth={10}
                                strokeDasharray={`${dashLen} ${dashGap}`}
                                strokeDashoffset={-offsets[index]}
                                strokeLinecap="round"
                            />
                        );
                        return el;
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-lg font-semibold text-[var(--dash-text-main)]">{total}</span>
                    <span className="text-[10px] text-[var(--dash-text-muted)]">total</span>
                </div>
            </div>
            <div className="space-y-2">
                {segments.map((seg) => (
                    <div key={seg.label} className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
                        <span className="text-[13px] text-[var(--dash-text-main)] capitalize">{seg.label}</span>
                        <span className="text-[11px] text-[var(--dash-text-muted)] font-medium tabular-nums ml-auto">
                            {seg.value} ({Math.round((seg.value / total) * 100)}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function HourlyHeatmap({ data }: { data: number[] }) {
    const max = Math.max(1, ...data);
    return (
        <div className="flex items-end gap-1 h-24">
            {data.map((val, i) => {
                const pct = val / max;
                return (
                    <div
                        key={i}
                        className="flex-1 rounded-t-sm dash-tooltip"
                        data-tooltip={`${i}h: ${val} commandes`}
                        style={{
                            height: `${Math.max(pct * 100, 4)}%`,
                            background: pct > 0.7
                                ? "var(--dash-primary)"
                                : pct > 0.3
                                    ? "#6EE7B7"
                                    : "#D1FAE5",
                        }}
                    />
                );
            })}
        </div>
    );
}

/* ─── Main Component ─── */
export function AnalyticsContent({
    dailyData,
    statusCounts,
    topWilayas,
    topProducts,
    hourlyDistribution,
    cancelRate,
    lowStockProducts,
}: AnalyticsContentProps) {
    const [range, setRange] = useState<DateRange>("30");

    const filteredDaily = useMemo(
        () => dailyData.slice(-Number(range)),
        [dailyData, range]
    );

    const rangeRevenue = filteredDaily.reduce((s, d) => s + d.revenue, 0);
    const rangeOrders = filteredDaily.reduce((s, d) => s + d.orders, 0);
    const rangeAov = rangeOrders > 0 ? Math.round(rangeRevenue / rangeOrders) : 0;

    // Compare with previous period
    const prevSlice = dailyData.slice(-Number(range) * 2, -Number(range));
    const prevRevenue = prevSlice.reduce((s, d) => s + d.revenue, 0);
    const revChangePercent =
        prevRevenue > 0
            ? Math.round(((rangeRevenue - prevRevenue) / prevRevenue) * 100)
            : rangeRevenue > 0 ? 100 : 0;

    const prevOrders = prevSlice.reduce((s, d) => s + d.orders, 0);
    const ordersChangePercent =
        prevOrders > 0
            ? Math.round(((rangeOrders - prevOrders) / prevOrders) * 100)
            : rangeOrders > 0 ? 100 : 0;

    const statusSegments = [
        { label: "En attente", value: statusCounts["pending"] ?? 0, color: "#F59E0B" },
        { label: "Payé", value: statusCounts["paid"] ?? 0, color: "#3B82F6" },
        { label: "Expédié", value: statusCounts["shipped"] ?? 0, color: "#059669" },
        { label: "Livré", value: statusCounts["delivered"] ?? 0, color: "#10B981" },
        { label: "Annulé", value: statusCounts["cancelled"] ?? 0, color: "#9CA3AF" },
    ].filter((s) => s.value > 0);

    const rangeOptions: { value: DateRange; label: string }[] = [
        { value: "7", label: "7 jours" },
        { value: "14", label: "14 jours" },
        { value: "30", label: "30 jours" },
    ];

    const chartLabels = filteredDaily.map((d) => {
        const date = new Date(d.date);
        return range === "7" ? d.label : `${date.getDate()}/${date.getMonth() + 1}`;
    });

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--dash-text-main)]">
                        Analytics
                    </h1>
                    <p className="text-sm text-[var(--dash-text-muted)] mt-0.5">
                        Analyse détaillée de vos performances
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Date range toggle */}
                    <div className="flex items-center gap-1 bg-gray-100/80 rounded-lg p-1">
                        {rangeOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setRange(opt.value)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium whitespace-nowrap ${range === opt.value
                                        ? "bg-white text-[var(--dash-text-main)] shadow-sm"
                                        : "text-[var(--dash-text-muted)] hover:text-[var(--dash-text-main)]"
                                    }`}
                            >
                                {opt.value === range && <Calendar className="w-3.5 h-3.5" />}
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    {/* Export */}
                    <button
                        type="button"
                        onClick={() => exportCSV(dailyData, range)}
                        className="dash-btn dash-btn-secondary gap-1.5"
                    >
                        <Download className="w-4 h-4" />
                        Exporter CSV
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    label="Revenu total"
                    value={`${fmt(rangeRevenue)} DZD`}
                    change={revChangePercent}
                    icon={DollarSign}
                    iconBg="bg-red-50"
                    iconColor="text-[var(--dash-primary)]"
                    accent="emerald"
                />
                <KPICard
                    label="Commandes"
                    value={fmt(rangeOrders)}
                    change={ordersChangePercent}
                    icon={ShoppingBag}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                    accent="blue"
                />
                <KPICard
                    label="Panier moyen (AOV)"
                    value={`${fmt(rangeAov)} DZD`}
                    icon={TrendingUp}
                    iconBg="bg-violet-50"
                    iconColor="text-violet-600"
                    accent="emerald"
                />
                <KPICard
                    label="Taux d'annulation"
                    value={`${cancelRate}%`}
                    icon={Percent}
                    iconBg="bg-red-50"
                    iconColor="text-red-500"
                    accent="red"
                    invertTrend
                />
            </div>

            {/* Revenue Chart */}
            <div className="dash-card">
                <div className="flex items-center justify-between border-b border-[var(--dash-border)] px-6 py-4">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[var(--dash-text-muted)]" />
                        <h3 className="font-display text-[15px] font-semibold text-[var(--dash-text-main)]">
                            Évolution du revenu
                        </h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[var(--dash-text-muted)]">
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-[3px] rounded-full bg-[var(--dash-primary)]" />
                            Revenu
                        </span>
                    </div>
                </div>
                <div className="p-6 h-72">
                    <AreaChart
                        data={filteredDaily.map((d, i) => ({
                            value: d.revenue,
                            label: chartLabels[i],
                        }))}
                        showDots={Number(range) <= 14}
                    />
                </div>
            </div>

            {/* Orders Chart */}
            <div className="dash-card">
                <div className="flex items-center justify-between border-b border-[var(--dash-border)] px-6 py-4">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[var(--dash-text-muted)]" />
                        <h3 className="font-display text-[15px] font-semibold text-[var(--dash-text-main)]">
                            Volume des commandes
                        </h3>
                    </div>
                </div>
                <div className="p-6 h-64">
                    <AreaChart
                        data={filteredDaily.map((d, i) => ({
                            value: d.orders,
                            label: chartLabels[i],
                        }))}
                        color="#3B82F6"
                        showDots={Number(range) <= 14}
                    />
                </div>
            </div>

            {/* Middle row: Status donut + Hourly heatmap */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Order Status */}
                <div className="dash-card p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Package className="w-4 h-4 text-[var(--dash-text-muted)]" />
                        <h3 className="font-display text-[15px] font-semibold text-[var(--dash-text-main)]">
                            Répartition des statuts
                        </h3>
                    </div>
                    {statusSegments.length > 0 ? (
                        <DonutChart segments={statusSegments} />
                    ) : (
                        <p className="text-sm text-[var(--dash-text-muted)]">Aucune donnée</p>
                    )}
                </div>

                {/* Hourly Distribution */}
                <div className="dash-card p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Clock className="w-4 h-4 text-[var(--dash-text-muted)]" />
                        <h3 className="font-display text-[15px] font-semibold text-[var(--dash-text-main)]">
                            Commandes par heure
                        </h3>
                    </div>
                    <HourlyHeatmap data={hourlyDistribution} />
                    <div className="flex justify-between mt-2 text-[10px] text-[var(--dash-text-muted)]">
                        <span>0h</span>
                        <span>6h</span>
                        <span>12h</span>
                        <span>18h</span>
                        <span>23h</span>
                    </div>
                </div>
            </div>

            {/* Bottom row: Top Products + Top Wilayas */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Top Products */}
                <div className="dash-card p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <TrendingUp className="w-4 h-4 text-[var(--dash-text-muted)]" />
                        <h3 className="font-display text-[15px] font-semibold text-[var(--dash-text-main)]">
                            Produits les plus vendus
                        </h3>
                    </div>
                    {topProducts.length > 0 ? (
                        <BarChartH
                            data={topProducts.map((p) => ({
                                label: p.name.length > 20 ? p.name.slice(0, 20) + "…" : p.name,
                                value: p.revenue,
                                suffix: "DZD",
                            }))}
                        />
                    ) : (
                        <p className="text-sm text-[var(--dash-text-muted)]">Aucune donnée</p>
                    )}
                </div>

                {/* Top Wilayas */}
                <div className="dash-card p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <MapPin className="w-4 h-4 text-[var(--dash-text-muted)]" />
                        <h3 className="font-display text-[15px] font-semibold text-[var(--dash-text-main)]">
                            Top Wilayas par revenu
                        </h3>
                    </div>
                    {topWilayas.length > 0 ? (
                        <BarChartH
                            data={topWilayas.map((w) => ({
                                label: w.wilaya,
                                value: w.revenue,
                                suffix: "DZD",
                            }))}
                        />
                    ) : (
                        <p className="text-sm text-[var(--dash-text-muted)]">Aucune donnée</p>
                    )}
                </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
                <div className="dash-card p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <h3 className="font-display text-[15px] font-semibold text-[var(--dash-text-main)]">
                            Produits en stock faible
                        </h3>
                        <span className="dash-badge dash-badge-amber ml-2">{lowStockProducts.length} produits</span>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-[var(--dash-border)]">
                        <table className="dash-table min-w-[480px]">
                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Prix</th>
                                    <th>Stock</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockProducts.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                {p.image ? (
                                                    <span className="relative h-9 w-9 overflow-hidden rounded-lg bg-gray-50"><Image src={p.image} alt="" fill sizes="36px" className="object-cover" /></span>
                                                ) : (
                                                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                                                        <Package className="w-4 h-4 text-gray-300" />
                                                    </div>
                                                )}
                                                <span className="font-medium text-[var(--dash-text-main)] text-[13px] truncate max-w-[180px]">
                                                    {p.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="tabular-nums font-medium">{fmt(p.price)} DZD</td>
                                        <td className="tabular-nums font-semibold">{p.stock}</td>
                                        <td>
                                            {p.stock === 0 ? (
                                                <span className="dash-badge dash-badge-red">Rupture</span>
                                            ) : (
                                                <span className="dash-badge dash-badge-amber">Faible</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── KPI Card ─── */
function KPICard({
    label,
    value,
    change,
    icon: Icon,
    iconBg,
    iconColor,
    accent,
    invertTrend,
}: {
    label: string;
    value: string;
    change?: number;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    iconBg: string;
    iconColor: string;
    accent: string;
    invertTrend?: boolean;
}) {
    const isPositive = change !== undefined ? (invertTrend ? change <= 0 : change >= 0) : true;

    return (
        <div className={`dash-card dash-stat-card ${accent} p-5`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-body text-[11px] font-semibold uppercase tracking-wider text-[var(--dash-text-muted)]">
                    {label}
                </h3>
                <div className={`rounded-lg ${iconBg} p-2 ${iconColor}`}>
                    <Icon className="h-4 w-4" strokeWidth={2} />
                </div>
            </div>
            <p className="font-display text-2xl font-semibold text-[var(--dash-text-main)] tabular-nums leading-none">
                {value}
            </p>
            {change !== undefined && (
                <div className="mt-3 flex items-center text-xs font-medium">
                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${isPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                            }`}
                    >
                        {change >= 0 ? "+" : ""}
                        {change}%
                    </span>
                    <span className="ml-2 text-[var(--dash-text-muted)]">vs période préc.</span>
                </div>
            )}
        </div>
    );
}
