import { createServiceClient } from "@/lib/supabase/service";
import { notFound } from "next/navigation";
import type { Product } from "@/lib/types/database";
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
    .select(
      "*, " +
        "product_option_types(*, product_option_values(*)), " +
        "product_variants(*, product_variant_options(*, product_option_values!option_value_id(*, product_option_types!option_type_id(name)))), " +
        "product_attributes(*)"
    )
    .eq("id", id)
    .single();
  if (error || !product) notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order");

  return (
    <div className="max-w-[1600px] mx-auto w-full">
      <ProductForm
        categories={categories ?? []}
        action={updateProduct.bind(null, id)}
        product={product as unknown as Product}
        deleteAction={deleteProduct.bind(null, id)}
      />
    </div>
  );
}
