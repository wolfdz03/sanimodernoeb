"use client";

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
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useLanguage } from "@/context/LanguageContext";

interface DashboardSidebarProps {
  adminName: string | null;
  pendingCount: number;
  siteTitle?: string | null;
}

export function DashboardSidebar({ adminName, pendingCount, siteTitle = "Sani Modern" }: DashboardSidebarProps) {
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
    <aside className="hidden md:flex w-[260px] shrink-0 flex-col bg-[var(--dash-surface)] self-stretch min-h-0 border-r border-[var(--dash-border)]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-[var(--dash-border)]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[var(--dash-primary)] to-emerald-600 text-white shadow-sm">
            <Store className="w-[18px] h-[18px]" />
          </div>
          <span className="font-display text-[15px] font-semibold tracking-tight text-[var(--dash-text-main)]">
            {siteTitle}
          </span>
        </Link>
      </div>

      {/* Nav label */}
      <div className="px-5 pt-5 pb-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--dash-text-muted)]">
          Menu
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium ${isActive
                ? "bg-emerald-50 text-emerald-700 shadow-sm"
                : "text-[var(--dash-text-muted)] hover:bg-gray-50 hover:text-[var(--dash-text-main)]"
                }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg ${isActive
                  ? "bg-[var(--dash-primary)]/10"
                  : "bg-transparent group-hover:bg-gray-100"
                  }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] ${isActive ? "text-[var(--dash-primary)]" : ""}`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
              </div>
              <span className="flex-1">{label}</span>
              {badge != null && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--dash-primary)] px-1.5 text-[10px] font-bold text-white tabular-nums shadow-sm">
                  {badge}
                </span>
              )}
              {isActive && (
                <div className="w-1 h-5 rounded-full bg-[var(--dash-primary)] ml-auto" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[var(--dash-border)] p-3 space-y-0.5">
        <Link
          href="/dashboard/parametres"
          className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium ${pathname.startsWith("/dashboard/parametres")
            ? "bg-emerald-50 text-emerald-700"
            : "text-[var(--dash-text-muted)] hover:bg-gray-50 hover:text-[var(--dash-text-main)]"
            }`}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg">
            <Settings className="w-[18px] h-[18px]" strokeWidth={1.8} />
          </div>
          {t("dashboard_settings")}
        </Link>
        <Link
          href="/dashboard/aide"
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[var(--dash-text-muted)] hover:bg-gray-50 hover:text-[var(--dash-text-main)]"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg">
            <HelpCircle className="w-[18px] h-[18px]" strokeWidth={1.8} />
          </div>
          Aide
        </Link>

        {/* User card */}
        <div className="mt-3 pt-3 border-t border-[var(--dash-border)]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center border border-emerald-200/60 text-sm font-bold text-emerald-700 shrink-0">
              {adminName ? adminName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[var(--dash-text-main)] truncate">
                {adminName ?? t("dashboard_admin_role")}
              </p>
              <p className="text-[11px] text-[var(--dash-text-muted)] truncate">
                {t("dashboard_admin_role")}
              </p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="p-1.5 text-[var(--dash-text-muted)] hover:text-[var(--dash-destructive)] rounded-lg hover:bg-red-50"
                aria-label={t("dashboard_logout")}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 mt-2 px-3 py-1.5 text-[11px] text-[var(--dash-text-muted)] hover:text-[var(--dash-primary)] rounded-md hover:bg-emerald-50/50"
          >
            <ExternalLink className="w-3 h-3" />
            {t("dashboard_back_site")}
          </Link>
        </div>
      </div>
    </aside>
  );
}
