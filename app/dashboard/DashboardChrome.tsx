"use client";

import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopBar } from "./DashboardTopBar";
import { DashboardErrorBoundary } from "./DashboardErrorBoundary";
import { AssistantDrawer } from "./AssistantDrawer";
import { DashboardMobileDrawer } from "./DashboardMobileDrawer";

interface DashboardChromeProps {
  adminName: string | null;
  pendingCount: number;
  siteTitle: string;
  children: React.ReactNode;
}

export function DashboardChrome({ adminName, pendingCount, siteTitle, children }: DashboardChromeProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="dashboard-theme min-h-screen h-screen bg-[var(--dash-bg-light)] text-[var(--dash-text-main)] font-body flex overflow-hidden">
      <DashboardSidebar adminName={adminName} pendingCount={pendingCount} siteTitle={siteTitle} />
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative min-w-0">
        <DashboardTopBar
          adminName={adminName}
          mobileNavOpen={mobileNavOpen}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <a
          href="#dashboard-main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--dash-primary)] focus:text-white focus:rounded-lg"
        >
          Aller au contenu principal
        </a>
        <div id="dashboard-main" className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <DashboardErrorBoundary>{children}</DashboardErrorBoundary>
        </div>
      </main>
      <DashboardMobileDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        adminName={adminName}
        pendingCount={pendingCount}
        siteTitle={siteTitle}
      />
      <AssistantDrawer />
    </div>
  );
}
