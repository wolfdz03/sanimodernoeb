"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/lib/translations";

const STORAGE_KEY = "dashboard_notifications";
const MAX_NOTIFICATIONS = 50;

export type NotificationType = "new_order" | "order_status";

export interface DashboardNotification {
  id: string;
  type: NotificationType;
  orderId: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

function loadStored(): DashboardNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DashboardNotification[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_NOTIFICATIONS) : [];
  } catch {
    return [];
  }
}

function saveStored(list: DashboardNotification[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(list.slice(0, MAX_NOTIFICATIONS))
    );
  } catch {}
}

const statusLabelKey: Record<string, string> = {
  pending: "dashboard_status_pending",
  paid: "dashboard_status_paid",
  shipped: "dashboard_status_shipped",
  delivered: "dashboard_status_delivered",
  cancelled: "dashboard_status_cancelled",
};

export function DashboardNotifications() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<DashboardNotification[]>(
    loadStored
  );
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveStored(notifications);
  }, [notifications]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            total_dzd?: number;
            shipping_name?: string;
            created_at?: string;
          };
          const n: DashboardNotification = {
            id: `new-${row.id}-${Date.now()}`,
            type: "new_order",
            orderId: row.id,
            title: t("dashboard_new_order"),
            message: `${row.shipping_name ?? ""} · ${formatDzd(row.total_dzd ?? 0)}`,
            createdAt: row.created_at ?? new Date().toISOString(),
            read: false,
          };
          setNotifications((prev) => [n, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          const newRow = payload.new as {
            id: string;
            status?: string;
            created_at?: string;
          };
          if (!newRow?.id) return;
          const statusLabel =
            newRow.status ? statusLabelKey[newRow.status] ?? newRow.status : "";
          const n: DashboardNotification = {
            id: `upd-${newRow.id}-${Date.now()}`,
            type: "order_status",
            orderId: newRow.id,
            title: t("dashboard_order_status_updated"),
            message: `#${shortId(newRow.id)}${statusLabel ? ` → ${t(statusLabel as TranslationKey)}` : ""}`,
            createdAt: new Date().toISOString(),
            read: false,
          };
          setNotifications((prev) => [n, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [t]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg text-[var(--dash-text-muted)] hover:bg-emerald-50 hover:text-[var(--dash-primary)] transition-colors"
        aria-label={t("dashboard_notifications")}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--dash-destructive)] ring-2 ring-white" />
        )}
      </button>
      {open && (
        <div className="absolute top-full end-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--dash-border)]">
            <span className="font-semibold text-[var(--dash-text-main)]">
              {t("dashboard_notifications")}
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-sm text-[var(--dash-primary)] hover:underline"
              >
                {t("dashboard_mark_all_read")}
              </button>
            )}
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-[var(--dash-text-muted)] text-center">
                {t("dashboard_no_notifications")}
              </p>
            ) : (
              <ul className="divide-y divide-[var(--dash-border)]">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={`/dashboard/commandes/${n.orderId}`}
                      onClick={() => {
                        markRead(n.id);
                        setOpen(false);
                      }}
                      className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${!n.read ? "bg-emerald-50/50" : ""}`}
                    >
                      <span className="flex-shrink-0 mt-0.5">
                        {!n.read ? (
                          <span className="w-2 h-2 rounded-full bg-[var(--dash-primary)]" />
                        ) : (
                          <Check className="w-4 h-4 text-gray-300" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[var(--dash-text-main)] text-sm">
                          {n.title}
                        </p>
                        <p className="text-xs text-[var(--dash-text-muted)] truncate">
                          {n.message}
                        </p>
                        <p className="text-xs text-[var(--dash-text-muted)] mt-0.5">
                          {formatTime(n.createdAt)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function formatDzd(n: number): string {
  return new Intl.NumberFormat("fr-DZ", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(n) + " DZD";
}

function shortId(id: string): string {
  return id.slice(0, 8);
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60_000) return "À l'instant";
  if (diff < 3600_000) return `Il y a ${Math.floor(diff / 60_000)} min`;
  if (diff < 86400_000) return `Il y a ${Math.floor(diff / 3600_000)} h`;
  return d.toLocaleDateString("fr-DZ", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
