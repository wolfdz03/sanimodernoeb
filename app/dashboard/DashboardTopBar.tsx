"use client";

import { useState, useEffect, useRef } from "react";
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
  "/dashboard/produits/nouveau": "dashboard_produits_add",
  "/dashboard/categories": "dashboard_categories",
  "/dashboard/categories/nouveau": "dashboard_categories_add",
  "/dashboard/parametres": "dashboard_settings",
  "/dashboard/contenu": "dashboard_content",
  "/dashboard/aide": "dashboard_aide",
  "/dashboard/analytics": "Analytics",
  "/dashboard/marketing": "Marketing",
  "/dashboard/aide/marketing": "Marketing",
};

function getBreadcrumbs(pathname: string): { href: string; labelKey: string; isLast: boolean }[] {
  if (pathname === "/dashboard") {
    return [
      { href: "/dashboard", labelKey: "Dashboard", isLast: false },
      { href: "/dashboard", labelKey: "dashboard_overview", isLast: true },
    ];
  }
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "dashboard") {
    return [{ href: "/dashboard", labelKey: "Dashboard", isLast: true }];
  }

  const result: { href: string; labelKey: string; isLast: boolean }[] = [
    { href: "/dashboard", labelKey: "Dashboard", isLast: false },
  ];
  let acc = "/dashboard";
  for (let i = 1; i < segments.length; i++) {
    acc += `/${segments[i]}`;
    let labelKey = breadcrumbLabels[acc];
    if (!labelKey) {
      const seg = segments[i];
      const prev = segments[i - 1];
      if (prev === "commandes" && /^[0-9a-f-]{36}$/i.test(seg)) {
        labelKey = "dashboard_detail";
      } else if ((prev === "produits" || prev === "categories") && seg !== "nouveau") {
        labelKey = "dashboard_edit";
      } else {
        labelKey = seg;
      }
    }
    result.push({ href: acc, labelKey, isLast: i === segments.length - 1 });
  }
  if (result.length > 1) result[result.length - 1].isLast = true;
  return result;
}

interface DashboardTopBarProps {
  adminName?: string | null;
  onOpenMobileNav: () => void;
  mobileNavOpen?: boolean;
}

export function DashboardTopBar({ adminName, onOpenMobileNav, mobileNavOpen = false }: DashboardTopBarProps) {
  const { t } = useLanguage();
  const initial = adminName ? adminName.charAt(0).toUpperCase() : "A";
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const mobileTitleCrumb = breadcrumbs[breadcrumbs.length - 1];
  const mobileTitle =
    mobileTitleCrumb.labelKey.startsWith("dashboard_")
      ? t(mobileTitleCrumb.labelKey as Parameters<typeof t>[0])
      : mobileTitleCrumb.labelKey;

  const [searchOpen, setSearchOpen] = useState(false);
  const searchPopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    const close = (e: MouseEvent) => {
      if (searchPopoverRef.current && !searchPopoverRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [searchOpen]);

  return (
    <header className="z-10 flex h-[68px] shrink-0 items-center justify-between border-b border-[var(--dash-border)] bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8 pt-[env(safe-area-inset-top,0px)]">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden min-h-11 min-w-11 shrink-0 flex items-center justify-center text-[var(--dash-text-muted)] hover:text-[var(--dash-text-main)] rounded-lg hover:bg-gray-50 -ms-1"
          aria-label={t("dashboard_mobile_menu")}
          aria-expanded={mobileNavOpen}
          aria-controls="dashboard-mobile-nav"
        >
          <Menu className="w-5 h-5" />
        </button>

        <p className="sm:hidden text-[15px] font-semibold text-[var(--dash-text-main)] truncate min-w-0 pr-2">
          {mobileTitle}
        </p>

        <nav
          className="hidden sm:flex items-center text-[13px] font-medium text-[var(--dash-text-muted)] min-w-0"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((b, i) => (
            <span key={`${b.href}-${i}`} className="flex items-center min-w-0">
              {i > 0 && <ChevronRight className="mx-1.5 w-3.5 h-3.5 text-gray-300 shrink-0" />}
              {b.isLast ? (
                <span className="text-[var(--dash-text-main)] font-semibold truncate">
                  {b.labelKey.startsWith("dashboard_") ? t(b.labelKey as Parameters<typeof t>[0]) : b.labelKey}
                </span>
              ) : (
                <Link href={b.href} className="hover:text-[var(--dash-text-main)] cursor-pointer shrink-0">
                  {b.labelKey.startsWith("dashboard_") ? t(b.labelKey as Parameters<typeof t>[0]) : b.labelKey}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <div className="relative hidden sm:block w-56 lg:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder={t("dashboard_search_placeholder")}
            className="dash-input h-10 w-full rounded-xl bg-[#faf8f9] pl-9 pr-4 text-[13px]"
          />
        </div>

        <div className="relative sm:hidden" ref={searchPopoverRef}>
          <button
            type="button"
            onClick={() => setSearchOpen((o) => !o)}
            className="min-h-11 min-w-11 flex items-center justify-center rounded-lg text-[var(--dash-text-muted)] hover:bg-gray-50 hover:text-[var(--dash-text-main)]"
            aria-expanded={searchOpen}
            aria-label={t("dashboard_search_placeholder")}
          >
            <Search className="w-5 h-5" />
          </button>
          {searchOpen && (
            <div className="absolute end-0 top-full mt-1 w-[min(calc(100vw-2rem),20rem)] p-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] shadow-lg z-50">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)]">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="search"
                  autoFocus
                  placeholder={t("dashboard_search_placeholder")}
                  className="dash-input pl-9 pr-3 h-10 text-[13px] rounded-lg bg-[var(--dash-bg-light)] w-full"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1.5">
          <LangToggle />
          <DashboardNotifications />
        </div>
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white text-xs font-bold text-[var(--dash-primary)] hover:border-[var(--dash-primary)] hover:ring-2 hover:ring-[var(--dash-primary)]/10"
          aria-label="Admin profile"
        >
          {initial}
        </button>
      </div>
    </header>
  );
}
