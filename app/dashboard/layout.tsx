import { requireAdmin } from "@/lib/auth";
import { DashboardSidebar } from "./DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-slate-200 p-6 flex flex-col">
        <DashboardSidebar />
      </aside>
      <main className="pl-[15.5rem] pt-8 pb-16 pr-8">
        {children}
      </main>
    </div>
  );
}
