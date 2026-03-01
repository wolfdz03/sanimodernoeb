"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LangToggle } from "@/app/components/LangToggle";
import { DashboardNotifications } from "./DashboardNotifications";

const breadcrumbLabels: Record<string, string> = {
  "/dashboard": "dashboard_overview",
  "/dashboard/commandes": "dashboard_orders",
  "/dashboard/produits": "dashboard_products",
  "/dashboard/categories": "dashboard_categories",
  "/dashboard/parametres": "dashboard_settings",
  "/dashboard/contenu": "dashboard_content",
  "/dashboard/aide": "dashboard_aide",
  "/dashboard/analytics": "Analytics",
};

function getBreadcrumbs(pathname: string): { href: string; labelKey: string; isLast: boolean }[] {
  if (pathname === "/dashboard") {
    return [
      { href: "/dashboard", labelKey: "Dashboard", isLast: false },
      { href: "/dashboard", labelKey: "dashboard_overview", isLast: true },
    ];
  }
  const segments = pathname.split("/").filter(Boolean);
  const result: { href: string; labelKey: string; isLast: boolean }[] = [
    { href: "/dashboard", labelKey: "Dashboard", isLast: false },
  ];
  let acc = "";
  for (let i = 1; i < segments.length; i++) {
    acc += `/${segments[i]}`;
    const key = breadcrumbLabels[acc] ?? segments[i];
    result.push({ href: acc, labelKey: key, isLast: i === segments.length - 1 });
  }
  if (result.length > 1) result[result.length - 1].isLast = true;
  return result;
}

interface DashboardTopBarProps {
  adminName?: string | null;
}

export function DashboardTopBar({ adminName }: DashboardTopBarProps) {
  const { t } = useLanguage();
  const initial = adminName ? adminName.charAt(0).toUpperCase() : "A";
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-[var(--dash-border)] bg-[var(--dash-surface)] px-6 z-10">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="md:hidden p-2 text-[var(--dash-text-muted)] hover:text-[var(--dash-text-main)] rounded-lg hover:bg-gray-50"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </Link>
        <nav
          className="hidden sm:flex items-center text-[13px] font-medium text-[var(--dash-text-muted)]"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((b, i) => (
            <span key={`${b.href}-${i}`} className="flex items-center">
              {i > 0 && <ChevronRight className="mx-1.5 w-3.5 h-3.5 text-gray-300" />}
              {b.isLast ? (
                <span className="text-[var(--dash-text-main)] font-semibold">
                  {b.labelKey.startsWith("dashboard_") ? t(b.labelKey as Parameters<typeof t>[0]) : b.labelKey}
                </span>
              ) : (
                <Link
                  href={b.href}
                  className="hover:text-[var(--dash-text-main)] cursor-pointer"
                >
                  {b.labelKey.startsWith("dashboard_") ? t(b.labelKey as Parameters<typeof t>[0]) : b.labelKey}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block w-56 lg:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)]">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder={t("dashboard_search_placeholder")}
            className="dash-input pl-9 pr-4 h-9 text-[13px] rounded-lg bg-[var(--dash-bg-light)]"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <LangToggle />
          <DashboardNotifications />
        </div>
        <button
          type="button"
          className="h-8 w-8 overflow-hidden rounded-[8px] border border-[var(--dash-border)] hover:border-[var(--dash-primary)] hover:ring-2 hover:ring-[var(--dash-primary)]/10 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white text-emerald-700 font-semibold text-xs"
          aria-label="Admin profile"
        >
          {initial}
        </button>
      </div>
    </header>
  );
}
