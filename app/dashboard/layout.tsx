import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/service";
import { getSiteSettings } from "@/lib/site-settings";
import { DashboardChrome } from "./DashboardChrome";

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
    <DashboardChrome
      adminName={user.full_name}
      pendingCount={pendingCount ?? 0}
      siteTitle={siteTitle}
    >
      {children}
    </DashboardChrome>
  );
}
