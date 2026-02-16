import { createServiceClient } from "@/lib/supabase/service";
import { ProductForm } from "../ProductForm";
import { createProduct } from "@/app/actions/products";

export default async function DashboardProduitNouveauPage() {
  const supabase = createServiceClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order");

  return (
    <div className="max-w-[1600px] mx-auto w-full">
      <ProductForm
        categories={categories ?? []}
        action={createProduct}
        product={null}
      />
    </div>
  );
}
