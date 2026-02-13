import { requireAdmin } from "@/lib/auth";
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

  return (
    <div className="min-h-screen bg-[#f6f8f8] dark:bg-[#102222] text-slate-800 dark:text-slate-100 flex overflow-hidden">
      <DashboardSidebar adminName={user.full_name} />
      <main className="flex-1 md:ms-64 flex flex-col h-screen overflow-hidden relative">
        <DashboardTopBar />
        <a
          href="#dashboard-main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#13ecec] focus:text-[#102222] focus:rounded-xl"
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
