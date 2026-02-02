import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UpdateOrderStatus } from "./UpdateOrderStatus";
import type { OrderStatus } from "@/lib/types/database";

const statusLabels: Record<OrderStatus, string> = {
  pending: "En attente",
  paid: "Payée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

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
    <div>
      <Link
        href="/dashboard/commandes"
        className="text-sm text-[#2563EB] hover:underline mb-4 inline-block"
      >
        ← Retour aux commandes
      </Link>
      <h1 className="font-bold text-2xl text-[#1E293B] mb-6">
        Commande {order.id.slice(0, 8)}…
      </h1>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-[#1E293B] mb-4">
            Livraison
          </h2>
          <p className="font-medium text-[#1E293B]">{order.shipping_name}</p>
          <p className="text-[#64748B]">{order.shipping_phone}</p>
          {(order as { shipping_wilaya?: string }).shipping_wilaya && (
            <p className="text-[#64748B]">{(order as { shipping_wilaya: string }).shipping_wilaya}</p>
          )}
          {(order as { shipping_city?: string }).shipping_city && (
            <p className="text-[#64748B]">{(order as { shipping_city: string }).shipping_city}</p>
          )}
          <p className="text-[#64748B] mt-2">{order.shipping_address}</p>
          {order.shipping_email && (
            <p className="text-[#64748B]">{order.shipping_email}</p>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-[#1E293B] mb-4">Statut</h2>
          <UpdateOrderStatus
            orderId={order.id}
            currentStatus={order.status as OrderStatus}
            statusLabels={statusLabels}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-[#1E293B] mb-4">Articles</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="pb-3 font-semibold text-[#1E293B]">Produit</th>
              <th className="pb-3 font-semibold text-[#1E293B]">Qté</th>
              <th className="pb-3 font-semibold text-[#1E293B]">Prix unit.</th>
              <th className="pb-3 font-semibold text-[#1E293B]">Sous-total</th>
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((item) => (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="py-3 text-[#1E293B]">{item.product_name}</td>
                <td className="py-3 text-[#64748B]">{item.quantity}</td>
                <td className="py-3 text-[#64748B]">
                  {item.unit_price_dzd.toLocaleString("fr-DZ")} DA
                </td>
                <td className="py-3 font-medium text-[#1E293B]">
                  {(item.unit_price_dzd * item.quantity).toLocaleString(
                    "fr-DZ"
                  )}{" "}
                  DA
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
          <span className="font-bold text-[#DC2626]">
            Total : {order.total_dzd.toLocaleString("fr-DZ")} DA
          </span>
        </div>
      </div>
    </div>
  );
}
