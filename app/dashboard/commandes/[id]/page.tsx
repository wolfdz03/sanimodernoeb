import { createServiceClient } from "@/lib/supabase/service";
import { notFound } from "next/navigation";
import { OrderDetailContent } from "./OrderDetailContent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id)
    .order("id");

  let customerStats = {
    totalOrders: 1,
    ltv: order.total_dzd,
    otherOrderIds: [] as string[]
  };

  if (order.shipping_phone) {
    const { data: customerOrders } = await supabase
      .from("orders")
      .select("id, total_dzd, status")
      .eq("shipping_phone", order.shipping_phone)
      .neq("status", "cancelled");

    if (customerOrders && customerOrders.length > 0) {
      customerStats.totalOrders = customerOrders.length;
      customerStats.ltv = customerOrders.reduce((sum, o) => sum + (o.total_dzd ?? 0), 0);
      customerStats.otherOrderIds = customerOrders.filter((o) => o.id !== id).map(o => o.id);
    }
  }

  return (
    <OrderDetailContent
      order={{
        id: order.id,
        status: order.status,
        total_dzd: order.total_dzd,
        shipping_name: order.shipping_name,
        shipping_phone: order.shipping_phone,
        shipping_address: order.shipping_address,
        shipping_wilaya: order.shipping_wilaya ?? null,
        shipping_city: order.shipping_city ?? null,
      }}
      items={(items ?? []).map((i) => ({
        id: i.id,
        product_name: i.product_name,
        quantity: i.quantity,
        unit_price_dzd: i.unit_price_dzd,
        variant_label: i.variant_label ?? null,
      }))}
      customerStats={customerStats}
    />
  );
}
