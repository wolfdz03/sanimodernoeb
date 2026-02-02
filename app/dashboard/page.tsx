import { createServiceClient } from "@/lib/supabase/service";
import { DashboardOverviewContent } from "./DashboardOverviewContent";

export default async function DashboardPage() {
  const supabase = createServiceClient();
  const today = new Date().toISOString().slice(0, 10);

  const [
    { count: ordersToday },
    { count: pendingOrders },
    { count: productsCount },
    { count: categoriesCount },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .gte("created_at", `${today}T00:00:00Z`),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
  ]);

  return (
    <DashboardOverviewContent
      ordersToday={ordersToday ?? 0}
      pendingOrders={pendingOrders ?? 0}
      productsCount={productsCount ?? 0}
      categoriesCount={categoriesCount ?? 0}
    />
  );
}
