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
      }))}
    />
  );
}
