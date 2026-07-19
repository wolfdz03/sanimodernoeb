"use client";

import { DashboardNavPanel } from "./DashboardNavPanel";

interface DashboardSidebarProps {
  adminName: string | null;
  pendingCount: number;
  siteTitle?: string | null;
}

export function DashboardSidebar({ adminName, pendingCount, siteTitle = "Sani Modern" }: DashboardSidebarProps) {
  return (
    <aside className="hidden min-h-0 w-[276px] shrink-0 flex-col self-stretch border-r border-[#30272a] bg-[#211b1d] md:flex">
      <DashboardNavPanel adminName={adminName} pendingCount={pendingCount} siteTitle={siteTitle} />
    </aside>
  );
}
