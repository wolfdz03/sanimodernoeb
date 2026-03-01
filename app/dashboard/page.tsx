import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/service";
import { DashboardOverviewContent } from "./DashboardOverviewContent";

function getDateRange(d: Date, daysBack: number) {
  const start = new Date(d);
  start.setDate(start.getDate() - daysBack);
  start.setHours(0, 0, 0, 0);
  return start.toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const user = await requireAdmin();
  const supabase = createServiceClient();
  const today = new Date();
  const todayStr = getDateRange(today, 0);
  const yesterdayStr = getDateRange(today, 1);

  const [
    { data: ordersTodayData },
    { data: ordersYesterdayData },
    { count: pendingOrders },
    { count: lowStockCount },
    { data: recentOrdersWithItems },
    { data: allOrdersLast7Days },
    { data: allCompletedOrders },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id, total_dzd")
      .gte("created_at", `${todayStr}T00:00:00Z`)
      .neq("status", "cancelled"),
    supabase
      .from("orders")
      .select("id, total_dzd")
      .gte("created_at", `${yesterdayStr}T00:00:00Z`)
      .lt("created_at", `${todayStr}T00:00:00Z`)
      .neq("status", "cancelled"),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .lte("stock", 5),
    supabase
      .from("orders")
      .select("id, status, total_dzd, shipping_name, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("orders")
      .select("id, total_dzd, created_at")
      .gte("created_at", `${getDateRange(today, 6)}T00:00:00Z`)
      .neq("status", "cancelled"),
    supabase
      .from("orders")
      .select("id, total_dzd, shipping_wilaya")
      .neq("status", "cancelled"),
  ]);

  const orderIds = (recentOrdersWithItems ?? []).map((o) => o.id);
  const { data: orderItems } =
    orderIds.length > 0
      ? await supabase
          .from("order_items")
          .select("order_id, product_name, variant_label")
          .in("order_id", orderIds)
      : { data: [] };

  const itemsByOrderId: Record<string, { product_name: string; variant_label: string | null }[]> = {};
  (orderItems ?? []).forEach((i: { order_id: string; product_name: string; variant_label: string | null }) => {
    if (!itemsByOrderId[i.order_id]) itemsByOrderId[i.order_id] = [];
    itemsByOrderId[i.order_id].push({
      product_name: i.product_name,
      variant_label: i.variant_label,
    });
  });

  const todayRevenue = (ordersTodayData ?? []).reduce((s, o) => s + (o.total_dzd ?? 0), 0);
  const yesterdayRevenue = (ordersYesterdayData ?? []).reduce((s, o) => s + (o.total_dzd ?? 0), 0);
  const ordersToday = ordersTodayData?.length ?? 0;
  const ordersYesterday = ordersYesterdayData?.length ?? 0;

  const revenueChange =
    yesterdayRevenue > 0
      ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
      : todayRevenue > 0 ? 100 : 0;
  const ordersChange =
    ordersYesterday > 0
      ? ordersToday - ordersYesterday
      : ordersToday > 0 ? ordersToday : 0;

  const dayLabels = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const dailyRevenue: { day: string; revenue: number; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayRev =
      (allOrdersLast7Days ?? []).filter((o) =>
        o.created_at.startsWith(dateStr)
      ).reduce((s, o) => s + (o.total_dzd ?? 0), 0) ?? 0;
    dailyRevenue.push({
      day: dateStr,
      revenue: dayRev,
      label: dayLabels[d.getDay()],
    });
  }

  const activityFeed = (recentOrdersWithItems ?? []).map((o) => {
    const items = itemsByOrderId[o.id] ?? [];
    const firstItem = items[0];
    const productLabel = firstItem
      ? firstItem.variant_label
        ? `${firstItem.product_name} (${firstItem.variant_label})`
        : firstItem.product_name
      : "—";
    return {
      id: o.id,
      customerName: o.shipping_name,
      productLabel,
      createdAt: o.created_at,
      status: o.status,
    };
  });

  // Calculate AOV
  const totalRevenueAllTime = (allCompletedOrders ?? []).reduce((sum, o) => sum + (o.total_dzd ?? 0), 0);
  const totalOrdersCount = allCompletedOrders?.length || 1; // avoid div by 0
  const aov = Math.round(totalRevenueAllTime / totalOrdersCount);

  // Top Wilayas
  const wilayaCounts: Record<string, number> = {};
  (allCompletedOrders ?? []).forEach(o => {
    if (o.shipping_wilaya) {
      if (!wilayaCounts[o.shipping_wilaya]) wilayaCounts[o.shipping_wilaya] = 0;
      wilayaCounts[o.shipping_wilaya]++;
    }
  });

  const topWilayas = Object.entries(wilayaCounts)
    .map(([wilaya, count]) => ({ wilaya, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <DashboardOverviewContent
      adminName={user.full_name}
      todayRevenue={todayRevenue}
      revenueChange={revenueChange}
      ordersToday={ordersToday}
      ordersChange={ordersChange}
      pendingOrders={pendingOrders ?? 0}
      lowStockCount={lowStockCount ?? 0}
      dailyRevenue={dailyRevenue}
      activityFeed={activityFeed}
      aov={aov}
      topWilayas={topWilayas}
    />
  );
}
