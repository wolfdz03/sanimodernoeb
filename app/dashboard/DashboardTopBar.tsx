"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, ChevronRight, ArrowUpRight } from "lucide-react";
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

const dashboardSearchItems = [
  { label: "Vue d'ensemble", detail: "Résumé de la boutique", href: "/dashboard", keywords: "accueil dashboard performance" },
  { label: "Commandes", detail: "Suivi et livraison", href: "/dashboard/commandes", keywords: "clients ventes livraison" },
  { label: "Produits", detail: "Catalogue et stock", href: "/dashboard/produits", keywords: "catalogue stock articles" },
  { label: "Catégories", detail: "Organisation du catalogue", href: "/dashboard/categories", keywords: "collections classement" },
  { label: "Contenu", detail: "Textes de la boutique", href: "/dashboard/contenu", keywords: "hero collection textes" },
  { label: "Analytics", detail: "Revenus et performances", href: "/dashboard/analytics", keywords: "statistiques revenus commandes" },
  { label: "Marketing", detail: "Pixels et suivi", href: "/dashboard/marketing", keywords: "meta google pixel" },
  { label: "Paramètres", detail: "Configuration générale", href: "/dashboard/parametres", keywords: "réglages boutique livraison" },
  { label: "Aide", detail: "Guides du tableau de bord", href: "/dashboard/aide", keywords: "support documentation" },
];

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
  const router = useRouter();
  const breadcrumbs = getBreadcrumbs(pathname);
  const mobileTitleCrumb = breadcrumbs[breadcrumbs.length - 1];
  const mobileTitle =
    mobileTitleCrumb.labelKey.startsWith("dashboard_")
      ? t(mobileTitleCrumb.labelKey as Parameters<typeof t>[0])
      : mobileTitleCrumb.labelKey;

  const [searchOpen, setSearchOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchPopoverRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("fr");
  const searchResults = dashboardSearchItems.filter((item) =>
    `${item.label} ${item.detail} ${item.keywords}`.toLocaleLowerCase("fr").includes(normalizedQuery)
  ).slice(0, 6);

  const navigateToResult = (href: string) => {
    setSearchOpen(false);
    setDesktopSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  useEffect(() => {
    if (!searchOpen && !desktopSearchOpen) return;
    const close = (e: MouseEvent) => {
      if (searchPopoverRef.current && !searchPopoverRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setDesktopSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [searchOpen, desktopSearchOpen]);

  const searchPanel = (
    <div className="dash-dropdown mt-2 overflow-hidden p-1.5">
      <p className="px-2.5 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--dash-text-muted)]">
        Accès rapide
      </p>
      {searchResults.length > 0 ? searchResults.map((item) => (
        <button
          key={item.href}
          type="button"
          onClick={() => navigateToResult(item.href)}
          className="group flex min-h-12 w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f7f3f4] text-[var(--dash-primary)] group-hover:bg-white">
            <Search className="h-3.5 w-3.5" />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block truncate text-[13px] font-semibold text-[var(--dash-text-main)]">{item.label}</strong>
            <span className="block truncate text-[11px] text-[var(--dash-text-muted)]">{item.detail}</span>
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-[var(--dash-primary)]" />
        </button>
      )) : (
        <p className="px-3 py-5 text-center text-sm text-[var(--dash-text-muted)]">Aucun résultat</p>
      )}
    </div>
  );

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
        <div className="relative hidden w-56 sm:block lg:w-72" ref={desktopSearchRef}>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setDesktopSearchOpen(true);
            }}
            onFocus={() => setDesktopSearchOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && searchResults[0]) {
                event.preventDefault();
                navigateToResult(searchResults[0].href);
              }
              if (event.key === "Escape") setDesktopSearchOpen(false);
            }}
            placeholder={t("dashboard_search_placeholder")}
            className="dash-input h-10 w-full rounded-xl bg-[#faf8f9] pl-9 pr-4 text-[13px]"
          />
          {desktopSearchOpen && <div className="absolute left-0 right-0 top-full z-50">{searchPanel}</div>}
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
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && searchResults[0]) {
                      event.preventDefault();
                      navigateToResult(searchResults[0].href);
                    }
                    if (event.key === "Escape") setSearchOpen(false);
                  }}
                  placeholder={t("dashboard_search_placeholder")}
                  className="dash-input h-11 w-full rounded-lg bg-[var(--dash-bg-light)] pl-9 pr-3 text-base"
                />
              </div>
              {searchPanel}
            </div>
          )}
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1.5">
          <LangToggle />
          <DashboardNotifications />
        </div>
        <button
          type="button"
          className="hidden h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white text-xs font-bold text-[var(--dash-primary)] hover:border-[var(--dash-primary)] hover:ring-2 hover:ring-[var(--dash-primary)]/10 sm:flex"
          aria-label="Admin profile"
        >
          {initial}
        </button>
      </div>
    </header>
  );
}
