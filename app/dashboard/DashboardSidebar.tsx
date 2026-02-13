"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Settings,
  Type,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useLanguage } from "@/context/LanguageContext";

interface DashboardSidebarProps {
  adminName: string | null;
}

export function DashboardSidebar({ adminName }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("dashboard_overview") },
    { href: "/dashboard/commandes", icon: ShoppingBag, label: t("dashboard_orders") },
    { href: "/dashboard/produits", icon: Package, label: t("dashboard_products") },
    { href: "/dashboard/categories", icon: FolderTree, label: t("dashboard_categories") },
    { href: "/dashboard/parametres", icon: Settings, label: t("dashboard_settings") },
    { href: "/dashboard/contenu", icon: Type, label: t("dashboard_content") },
    { href: "/dashboard/aide", icon: HelpCircle, label: "Aide" },
  ];

  return (
    <aside className="w-64 bg-[#102222] text-white flex-shrink-0 hidden md:flex flex-col h-screen fixed start-0 top-0 border-e border-slate-800 z-50">
      <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#13ecec] flex items-center justify-center text-[#102222] font-bold text-xl">
            S
          </div>
          <span className="font-bold text-lg tracking-wide text-white">
            Sani Modern
          </span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-[#13ecec] text-[#102222] shadow-lg shadow-[#13ecec]/20"
                  : "text-slate-300 hover:text-[#13ecec] hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800/50">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-slate-600 text-sm font-bold text-slate-300">
            {adminName ? adminName.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {adminName ?? t("dashboard_admin_role")}
            </p>
            <p className="text-xs text-slate-300 truncate">{t("dashboard_admin_role")}</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label={t("dashboard_logout")}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
        <Link
          href="/"
          className="block mt-2 px-2 py-1.5 text-xs text-slate-300 hover:text-[#13ecec] transition-colors"
        >
          {t("dashboard_back_site")}
        </Link>
      </div>
    </aside>
  );
}
