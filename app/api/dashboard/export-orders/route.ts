import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createServiceClient } from "@/lib/supabase/service";

function escapeCsvCell(value: string | number | null | undefined): string {
  if (value == null) return "";
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, status, total_dzd, shipping_name, shipping_phone, shipping_address, shipping_wilaya, shipping_city, created_at")
    .order("created_at", { ascending: false });

  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 });
  }

  const orderIds = (orders ?? []).map((o) => o.id);
  let items: { order_id: string; product_name: string; quantity: number; unit_price_dzd: number }[] = [];
  if (orderIds.length > 0) {
    const { data: itemsData } = await supabase
      .from("order_items")
      .select("order_id, product_name, quantity, unit_price_dzd")
      .in("order_id", orderIds);
    items = itemsData ?? [];
  }

  const itemsByOrder = new Map<string, typeof items>();
  for (const i of items) {
    const list = itemsByOrder.get(i.order_id) ?? [];
    list.push(i);
    itemsByOrder.set(i.order_id, list);
  }

  const header = [
    "ID",
    "Date",
    "Statut",
    "Total (DA)",
    "Nom",
    "Téléphone",
    "Wilaya",
    "Ville",
    "Adresse",
    "Articles",
  ];
  const rows = (orders ?? []).map((o) => {
    const orderItems = itemsByOrder.get(o.id) ?? [];
    const itemsSummary = orderItems
      .map((i) => `${i.product_name} x${i.quantity} (${i.unit_price_dzd} DA)`)
      .join(" ; ");
    return [
      o.id,
      new Date(o.created_at).toISOString().slice(0, 19),
      o.status,
      o.total_dzd,
      o.shipping_name,
      o.shipping_phone ?? "",
      o.shipping_wilaya ?? "",
      o.shipping_city ?? "",
      (o.shipping_address ?? "").replace(/\n/g, " "),
      itemsSummary,
    ];
  });

  const csvLines = [
    header.map(escapeCsvCell).join(","),
    ...rows.map((r) => r.map(escapeCsvCell).join(",")),
  ];
  const csv = "\uFEFF" + csvLines.join("\r\n"); // BOM for Excel UTF-8
  const filename = `commandes_${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
