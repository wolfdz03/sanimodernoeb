import { requireAdmin } from "@/lib/auth";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopBar } from "./DashboardTopBar";

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
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
