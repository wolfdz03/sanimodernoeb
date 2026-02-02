import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";

export default async function DashboardProduitsPage() {
  const supabase = createServiceClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price_dzd, image_url, badge, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-2xl text-[#1E293B]">Produits</h1>
        <Link
          href="/dashboard/produits/nouveau"
          className="px-4 py-2 rounded-xl bg-[#DC2626] text-white font-semibold hover:bg-[#B91C1C] transition-colors"
        >
          Ajouter un produit
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-[#1E293B]">Image</th>
              <th className="px-6 py-4 font-semibold text-[#1E293B]">Nom</th>
              <th className="px-6 py-4 font-semibold text-[#1E293B]">Catégorie</th>
              <th className="px-6 py-4 font-semibold text-[#1E293B]">Prix</th>
              <th className="px-6 py-4 font-semibold text-[#1E293B]"></th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((product) => (
              <tr
                key={product.id}
                className="border-b border-slate-100 hover:bg-slate-50/50"
              >
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 relative">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <span className="text-[#64748B] text-xs flex items-center justify-center h-full">
                        —
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-[#1E293B]">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-[#64748B]">
                  {(product.categories as { name?: string } | null)?.name ?? "—"}
                </td>
                <td className="px-6 py-4 font-semibold text-[#DC2626]">
                  {product.price_dzd.toLocaleString("fr-DZ")} DA
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/produits/${product.id}`}
                    className="text-[#2563EB] font-medium hover:underline text-sm"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!products || products.length === 0) && (
          <p className="px-6 py-12 text-center text-[#64748B]">
            Aucun produit.{" "}
            <Link
              href="/dashboard/produits/nouveau"
              className="text-[#2563EB] hover:underline"
            >
              Ajouter un produit
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
