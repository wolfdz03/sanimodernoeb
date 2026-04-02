"use client";

import { DashboardNavPanel } from "./DashboardNavPanel";

interface DashboardSidebarProps {
  adminName: string | null;
  pendingCount: number;
  siteTitle?: string | null;
}

export function DashboardSidebar({ adminName, pendingCount, siteTitle = "Sani Modern" }: DashboardSidebarProps) {
  return (
    <aside className="hidden md:flex w-[260px] shrink-0 flex-col bg-[var(--dash-surface)] self-stretch min-h-0 border-r border-[var(--dash-border)]">
      <DashboardNavPanel adminName={adminName} pendingCount={pendingCount} siteTitle={siteTitle} />
    </aside>
  );
}
