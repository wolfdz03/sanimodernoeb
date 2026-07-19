"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  FolderTree,
  Type,
  Settings,
  HelpCircle,
  LogOut,
  ExternalLink,
  BarChart3,
  Megaphone,
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useLanguage } from "@/context/LanguageContext";

export interface DashboardNavPanelProps {
  adminName: string | null;
  pendingCount: number;
  siteTitle?: string | null;
  /** Close mobile drawer after navigation */
  onNavigate?: () => void;
  /** e.g. mobile drawer close button */
  headerTrailing?: ReactNode;
}

export function DashboardNavPanel({
  adminName,
  pendingCount,
  siteTitle = "Sani Modern",
  onNavigate,
  headerTrailing,
}: DashboardNavPanelProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("dashboard_overview") },
    { href: "/dashboard/produits", icon: Package, label: t("dashboard_products") },
    {
      href: "/dashboard/commandes",
      icon: ShoppingBag,
      label: t("dashboard_orders"),
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    { href: "/dashboard/categories", icon: FolderTree, label: t("dashboard_categories") },
    { href: "/dashboard/contenu", icon: Type, label: t("dashboard_content") },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col bg-transparent text-white">
      <div className="flex h-[68px] min-w-0 shrink-0 items-center gap-2 border-b border-white/10 px-4 sm:px-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 group min-w-0 flex-1"
          onClick={onNavigate}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--dash-primary)] text-white shadow-[0_10px_24px_-12px_rgba(220,38,38,0.9)]">
            <Store className="w-[18px] h-[18px]" />
          </div>
          <span className="truncate font-display text-[15px] font-semibold tracking-tight text-white">
            {siteTitle}
          </span>
        </Link>
        {headerTrailing}
      </div>

      <div className="px-5 pt-5 pb-2 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
          Menu
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5 min-h-0">
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const isActive =
            href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium min-h-11 ${
                isActive
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/58 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
                  isActive ? "bg-[var(--dash-primary)] text-white" : "bg-transparent group-hover:bg-white/[0.06]"
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] ${isActive ? "text-white" : ""}`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
              </div>
              <span className="flex-1">{label}</span>
              {badge != null && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--dash-primary)] px-1.5 text-[10px] font-bold text-white tabular-nums shadow-sm">
                  {badge}
                </span>
              )}
              {isActive && <div className="ml-auto h-5 w-1 shrink-0 rounded-full bg-[var(--dash-primary)]" />}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 space-y-0.5 border-t border-white/10 p-3">
        <Link
          href="/dashboard/marketing"
          onClick={onNavigate}
          className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium min-h-11 ${
            pathname.startsWith("/dashboard/marketing")
              ? "bg-white/10 text-white"
              : "text-white/58 hover:bg-white/[0.06] hover:text-white"
          }`}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0">
            <Megaphone className="w-[18px] h-[18px]" strokeWidth={1.8} />
          </div>
          Marketing
        </Link>
        <Link
          href="/dashboard/parametres"
          onClick={onNavigate}
          className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium min-h-11 ${
            pathname.startsWith("/dashboard/parametres")
              ? "bg-white/10 text-white"
              : "text-white/58 hover:bg-white/[0.06] hover:text-white"
          }`}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0">
            <Settings className="w-[18px] h-[18px]" strokeWidth={1.8} />
          </div>
          {t("dashboard_settings")}
        </Link>
        <Link
          href="/dashboard/aide"
          onClick={onNavigate}
          className="group flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/58 hover:bg-white/[0.06] hover:text-white"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0">
            <HelpCircle className="w-[18px] h-[18px]" strokeWidth={1.8} />
          </div>
          Aide
        </Link>

        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.05]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-sm font-bold text-white">
              {adminName ? adminName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[13px] font-semibold text-white">
                {adminName ?? t("dashboard_admin_role")}
              </p>
              <p className="truncate text-[11px] text-white/38">{t("dashboard_admin_role")}</p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2.5 text-white/40 hover:bg-white/[0.06] hover:text-red-300"
                aria-label={t("dashboard_logout")}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
          <Link
            href="/"
            onClick={onNavigate}
            className="mt-2 flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-[11px] text-white/45 hover:bg-white/[0.06] hover:text-white"
          >
            <ExternalLink className="w-3 h-3 shrink-0" />
            {t("dashboard_back_site")}
          </Link>
        </div>
      </div>
    </div>
  );
}
