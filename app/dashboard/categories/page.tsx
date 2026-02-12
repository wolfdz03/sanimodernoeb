import { createServiceClient } from "@/lib/supabase/service";
import { CategoriesContent } from "./CategoriesContent";

export default async function DashboardCategoriesPage() {
  const supabase = createServiceClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, sort_order")
    .order("sort_order");

  return <CategoriesContent categories={categories ?? null} />;
}
