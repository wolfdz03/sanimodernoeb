import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";
import { ProductForm } from "../ProductForm";
import { createProduct } from "@/app/actions/products";

export default async function DashboardProduitNouveauPage() {
  const supabase = createServiceClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order");

  return (
    <div>
      <Link
        href="/dashboard/produits"
        className="text-sm text-[#2563EB] hover:underline mb-4 inline-block"
      >
        ← Retour aux produits
      </Link>
      <h1 className="font-bold text-2xl text-[#1E293B] mb-6">
        Nouveau produit
      </h1>
      <ProductForm
        categories={categories ?? []}
        action={createProduct}
        product={null}
      />
    </div>
  );
}
