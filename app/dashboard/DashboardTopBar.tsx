"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu } from "lucide-react";
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
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--dash-border)] bg-[var(--dash-surface)]/80 px-6 backdrop-blur-md z-10">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="md:hidden p-2 text-[var(--dash-text-muted)] hover:text-[var(--dash-text-main)] rounded-lg"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
        </Link>
        <nav
          className="hidden sm:flex items-center text-sm font-medium text-[var(--dash-text-muted)]"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((b, i) => (
            <span key={`${b.href}-${i}`} className="flex items-center">
              {i > 0 && <span className="mx-2 text-gray-300">/</span>}
              {b.isLast ? (
                <span className="text-[var(--dash-text-main)]">
                  {b.labelKey.startsWith("dashboard_") ? t(b.labelKey as Parameters<typeof t>[0]) : b.labelKey}
                </span>
              ) : (
                <Link
                  href={b.href}
                  className="hover:text-[var(--dash-text-main)] cursor-pointer transition-colors"
                >
                  {b.labelKey.startsWith("dashboard_") ? t(b.labelKey as Parameters<typeof t>[0]) : b.labelKey}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block w-64 lg:w-96">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)]">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder={t("dashboard_search_placeholder")}
            className="h-10 w-full rounded-lg border border-[var(--dash-border)] bg-[var(--dash-bg-light)] py-2 pl-10 pr-4 text-sm text-[var(--dash-text-main)] placeholder-[var(--dash-text-muted)] focus:border-[var(--dash-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--dash-primary)] transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <LangToggle />
          <DashboardNotifications />
        </div>
        <button
          type="button"
          className="h-8 w-8 overflow-hidden rounded-full border border-[var(--dash-border)] hover:ring-2 hover:ring-[var(--dash-primary)]/20 transition-all flex items-center justify-center bg-gray-100 text-[var(--dash-text-muted)] font-semibold text-sm"
          aria-label="Admin profile"
        >
          {initial}
        </button>
      </div>
    </header>
  );
}
