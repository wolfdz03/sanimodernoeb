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
  ];

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-[var(--dash-border)] bg-[var(--dash-surface)] self-stretch min-h-0">
      <div className="flex h-16 items-center gap-3 px-6 border-b border-[var(--dash-border)]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--dash-primary)] text-white">
            <Store className="w-5 h-5" />
          </div>
          <span className="font-display text-base font-semibold tracking-tight text-[var(--dash-text-main)]">
            {siteTitle}
          </span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors border-l-[3px] ${
                isActive
                  ? "bg-[#ECFDF5] text-[#065F46] border-[var(--dash-primary)]"
                  : "text-[var(--dash-text-muted)] hover:bg-gray-50 hover:text-[var(--dash-text-main)] border-transparent"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-[var(--dash-primary)]" : ""}`}
              />
              {label}
              {badge != null && (
                <span className="ml-auto rounded-full bg-[var(--dash-primary)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--dash-primary)]">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[var(--dash-border)] p-4 space-y-1">
        <Link
          href="/dashboard/parametres"
          className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            pathname.startsWith("/dashboard/parametres")
              ? "bg-[#ECFDF5] text-[#065F46]"
              : "text-[var(--dash-text-muted)] hover:bg-gray-50 hover:text-[var(--dash-text-main)]"
          }`}
        >
          <Settings className="w-5 h-5" />
          {t("dashboard_settings")}
        </Link>
        <Link
          href="/dashboard/aide"
          className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--dash-text-muted)] hover:bg-gray-50 hover:text-[var(--dash-text-main)] transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          Aide
        </Link>
        <div className="pt-2 mt-2 border-t border-[var(--dash-border)]">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-[var(--dash-border)] text-sm font-bold text-[var(--dash-text-muted)]">
              {adminName ? adminName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--dash-text-main)] truncate">
                {adminName ?? t("dashboard_admin_role")}
              </p>
              <p className="text-xs text-[var(--dash-text-muted)] truncate">
                {t("dashboard_admin_role")}
              </p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="p-1.5 text-[var(--dash-text-muted)] hover:text-[var(--dash-primary)] rounded-lg hover:bg-emerald-50 transition-colors"
                aria-label={t("dashboard_logout")}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
          <Link
            href="/"
            className="block mt-2 px-2 py-1.5 text-xs text-[var(--dash-text-muted)] hover:text-[var(--dash-primary)] transition-colors"
          >
            {t("dashboard_back_site")}
          </Link>
        </div>
      </div>
    </aside>
  );
}
