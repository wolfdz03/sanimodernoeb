import { createServiceClient } from "@/lib/supabase/service";
import { DashboardOverviewContent } from "./DashboardOverviewContent";

function startOfWeek(d: Date) {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

export default async function DashboardPage() {
  const supabase = createServiceClient();
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const weekStart = startOfWeek(today);

  const [
    { count: ordersToday },
    { count: pendingOrders },
    { count: productsCount },
    { data: ordersForRevenue },
    { count: lowStockCount },
    { count: ordersThisWeek },
    { data: recentOrders },
    { data: categoriesWithCount },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .gte("created_at", `${todayStr}T00:00:00Z`),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("total_dzd")
      .neq("status", "cancelled"),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .lte("stock", 5),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .gte("created_at", weekStart),
    supabase
      .from("orders")
      .select("id, status, total_dzd, shipping_name, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("categories")
      .select("id, name")
      .order("sort_order"),
  ]);

  const { data: productCountByCategory } = await supabase
    .from("products")
    .select("category_id");
  const categoryIds = categoriesWithCount ?? [];
  const countByCategoryId: Record<string, number> = {};
  (productCountByCategory ?? []).forEach((p: { category_id: string | null }) => {
    const id = p.category_id ?? "_none";
    countByCategoryId[id] = (countByCategoryId[id] ?? 0) + 1;
  });
  const totalProducts = productsCount ?? 0;
  const topCategories = categoryIds.map((c: { id: string; name: string }) => ({
    name: c.name,
    count: countByCategoryId[c.id] ?? 0,
    percentage:
      totalProducts > 0
        ? Math.round(((countByCategoryId[c.id] ?? 0) / totalProducts) * 100)
        : 0,
  }));

  const totalRevenue =
    (ordersForRevenue ?? []).reduce((s, o) => s + (o.total_dzd ?? 0), 0) ?? 0;

  return (
    <DashboardOverviewContent
      ordersToday={ordersToday ?? 0}
      pendingOrders={pendingOrders ?? 0}
      productsCount={productsCount ?? 0}
      lowStockCount={lowStockCount ?? 0}
      ordersThisWeek={ordersThisWeek ?? 0}
      totalRevenue={totalRevenue}
      recentOrders={(recentOrders ?? []).map((o) => ({
        id: o.id,
        shipping_name: o.shipping_name,
        created_at: o.created_at,
        status: o.status,
        total_dzd: o.total_dzd,
      }))}
      topCategories={topCategories}
    />
  );
}
