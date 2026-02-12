import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "../ProductForm";
import { updateProduct, deleteProduct } from "@/app/actions/products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardProduitEditPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !product) notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order");

  return (
    <div>
      <Link
        href="/dashboard/produits"
        className="text-sm text-[#0ea5a5] hover:underline mb-4 inline-block"
      >
        ← Retour aux produits
      </Link>
      <h1 className="font-bold text-2xl text-[#1E293B] mb-6">
        Modifier le produit
      </h1>
      <ProductForm
        categories={categories ?? []}
        action={updateProduct.bind(null, id)}
        product={product}
        deleteAction={deleteProduct.bind(null, id)}
      />
    </div>
  );
}
