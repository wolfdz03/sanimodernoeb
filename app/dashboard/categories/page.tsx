import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";

export default async function DashboardCategoriesPage() {
  const supabase = createServiceClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, sort_order")
    .order("sort_order");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-2xl text-[#1E293B]">Catégories</h1>
        <Link
          href="/dashboard/categories/nouveau"
          className="px-4 py-2 rounded-xl bg-[#DC2626] text-white font-semibold hover:bg-[#B91C1C] transition-colors"
        >
          Ajouter une catégorie
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-[#1E293B]">Ordre</th>
              <th className="px-6 py-4 font-semibold text-[#1E293B]">Nom</th>
              <th className="px-6 py-4 font-semibold text-[#1E293B]">Slug</th>
              <th className="px-6 py-4 font-semibold text-[#1E293B]"></th>
            </tr>
          </thead>
          <tbody>
            {(categories ?? []).map((cat) => (
              <tr
                key={cat.id}
                className="border-b border-slate-100 hover:bg-slate-50/50"
              >
                <td className="px-6 py-4 text-[#64748B]">{cat.sort_order}</td>
                <td className="px-6 py-4 font-medium text-[#1E293B]">
                  {cat.name}
                </td>
                <td className="px-6 py-4 text-[#64748B]">{cat.slug}</td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/categories/${cat.id}`}
                    className="text-[#2563EB] font-medium hover:underline text-sm"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!categories || categories.length === 0) && (
          <p className="px-6 py-12 text-center text-[#64748B]">
            Aucune catégorie.{" "}
            <Link
              href="/dashboard/categories/nouveau"
              className="text-[#2563EB] hover:underline"
            >
              Ajouter une catégorie
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
