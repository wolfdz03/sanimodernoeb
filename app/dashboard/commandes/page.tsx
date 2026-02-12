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
    .select("id, status, total_dzd, shipping_name, shipping_phone, created_at")
    .order("created_at", { ascending: false });
  if (status && validStatuses.includes(status)) {
    query = query.eq("status", status);
  }
  const { data: orders, error } = await query;
  if (error) throw error;

  return (
    <CommandesContent
      orders={orders ?? null}
      currentStatus={status}
    />
  );
}
