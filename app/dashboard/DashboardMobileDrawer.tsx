"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DashboardNavPanel } from "./DashboardNavPanel";

export interface DashboardMobileDrawerProps {
  open: boolean;
  onClose: () => void;
  adminName: string | null;
  pendingCount: number;
  siteTitle: string;
}

export function DashboardMobileDrawer({
  open,
  onClose,
  adminName,
  pendingCount,
  siteTitle,
}: DashboardMobileDrawerProps) {
  const { t } = useLanguage();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
  }, [open]);

  return (
    <div
      className={`md:hidden fixed inset-0 z-[60] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        aria-label={t("dashboard_close_menu")}
      />

      <aside
        ref={panelRef}
        id="dashboard-mobile-nav"
        className={`absolute left-0 top-0 flex h-full w-[min(100%,288px)] max-w-[100vw] flex-col border-r border-[#30272a] bg-[#211b1d] shadow-2xl transition-transform duration-200 ease-out pt-[env(safe-area-inset-top,0px)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        role="dialog"
        aria-modal="true"
        aria-label={t("dashboard_mobile_menu")}
      >
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <DashboardNavPanel
            adminName={adminName}
            pendingCount={pendingCount}
            siteTitle={siteTitle}
            onNavigate={onClose}
            headerTrailing={
              <button
                type="button"
                onClick={onClose}
                className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-white/50 hover:bg-white/[0.06] hover:text-white"
                aria-label={t("dashboard_close_menu")}
              >
                <X className="w-5 h-5" />
              </button>
            }
          />
        </div>
      </aside>
    </div>
  );
}
