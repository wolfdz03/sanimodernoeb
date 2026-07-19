import { createServiceClient } from "@/lib/supabase/service";
import { CommandesContent } from "./CommandesContent";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function DashboardCommandesPage({
  searchParams,
}: PageProps) {
  const { status } = await searchParams;
  const supabase = createServiceClient();
  const validStatuses = [
    "pending",
    "paid",
    "shipped",
    "delivered",
    "cancelled",
  ];
  let query = supabase
    .from("orders")
    .select(
      "id, status, total_dzd, shipping_name, shipping_phone, shipping_wilaya, shipping_city, shipping_cost_dzd, created_at, order_items(product_name, quantity, variant_label)"
    )
    .order("created_at", { ascending: false });
  if (status === "pending") {
    query = query.in("status", ["pending", "paid"]);
  } else if (status === "shipped") {
    query = query.in("status", ["shipped", "delivered"]);
  } else if (status && validStatuses.includes(status)) {
    query = query.eq("status", status);
  }
  const { data: orders, error } = await query;
  if (error) throw error;

  const ordersWithItems = (orders ?? []).map((o) => ({
    id: o.id,
    status: o.status,
    total_dzd: o.total_dzd,
    shipping_name: o.shipping_name,
    shipping_phone: o.shipping_phone,
    shipping_wilaya: o.shipping_wilaya ?? null,
    shipping_city: o.shipping_city ?? null,
    shipping_cost_dzd: o.shipping_cost_dzd ?? 0,
    created_at: o.created_at,
    items:
      (o.order_items as { product_name: string; quantity: number; variant_label?: string | null }[]) ??
      [],
  }));

  return (
    <CommandesContent
      orders={ordersWithItems}
      currentStatus={status}
    />
  );
}
