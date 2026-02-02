import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";
import type { OrderStatus } from "@/lib/types/database";

const statusLabels: Record<OrderStatus, string> = {
  pending: "En attente",
  paid: "Payée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function DashboardCommandesPage({
  searchParams,
}: PageProps) {
  const { status } = await searchParams;
  const supabase = createServiceClient();
  let query = supabase
    .from("orders")
    .select("id, status, total_dzd, shipping_name, shipping_phone, created_at")
    .order("created_at", { ascending: false });
  if (status && status in statusLabels) {
    query = query.eq("status", status);
  }
  const { data: orders, error } = await query;
  if (error) throw error;

  return (
    <div>
      <h1 className="font-bold text-2xl text-[#1E293B] mb-6">Commandes</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link
          href="/dashboard/commandes"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            !status
              ? "bg-[#DC2626] text-white"
              : "bg-white border border-slate-200 text-[#64748B] hover:bg-slate-50"
          }`}
        >
          Toutes
        </Link>
        {(Object.keys(statusLabels) as OrderStatus[]).map((s) => (
          <Link
            key={s}
            href={`/dashboard/commandes?status=${s}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              status === s
                ? "bg-[#DC2626] text-white"
                : "bg-white border border-slate-200 text-[#64748B] hover:bg-slate-50"
            }`}
          >
            {statusLabels[s]}
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-[#1E293B]">
                Date
              </th>
              <th className="px-6 py-4 font-semibold text-[#1E293B]">
                Client
              </th>
              <th className="px-6 py-4 font-semibold text-[#1E293B]">
                Total
              </th>
              <th className="px-6 py-4 font-semibold text-[#1E293B]">
                Statut
              </th>
              <th className="px-6 py-4 font-semibold text-[#1E293B]"></th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order) => (
              <tr
                key={order.id}
                className="border-b border-slate-100 hover:bg-slate-50/50"
              >
                <td className="px-6 py-4 text-sm text-[#64748B]">
                  {new Date(order.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-6 py-4 font-medium text-[#1E293B]">
                  {order.shipping_name}
                </td>
                <td className="px-6 py-4 font-semibold text-[#DC2626]">
                  {order.total_dzd.toLocaleString("fr-DZ")} DA
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "cancelled"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {statusLabels[order.status as OrderStatus]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/commandes/${order.id}`}
                    className="text-[#2563EB] font-medium hover:underline text-sm"
                  >
                    Détail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!orders || orders.length === 0) && (
          <p className="px-6 py-12 text-center text-[#64748B]">
            Aucune commande.
          </p>
        )}
      </div>
    </div>
  );
}
