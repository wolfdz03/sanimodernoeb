import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/service";
import { getSiteSettings } from "@/lib/site-settings";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopBar } from "./DashboardTopBar";
import { DashboardErrorBoundary } from "./DashboardErrorBoundary";
import { AssistantDrawer } from "./AssistantDrawer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  const supabase = createServiceClient();
  const [settings, { count: pendingCount }] = await Promise.all([
    getSiteSettings(),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);
  const siteTitle = settings.site_title?.trim() || "Sani Modern";

  return (
    <div className="dashboard-theme min-h-screen h-screen bg-[var(--dash-bg-light)] text-[var(--dash-text-main)] font-body flex overflow-hidden">
      <DashboardSidebar adminName={user.full_name} pendingCount={pendingCount ?? 0} siteTitle={siteTitle} />
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative min-w-0">
        <DashboardTopBar adminName={user.full_name} />
        <a
          href="#dashboard-main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--dash-primary)] focus:text-white focus:rounded-lg"
        >
          Aller au contenu principal
        </a>
        <div id="dashboard-main" className="flex-1 overflow-y-auto p-6 md:p-8">
          <DashboardErrorBoundary>{children}</DashboardErrorBoundary>
        </div>
      </main>
      <AssistantDrawer />
    </div>
  );
}
