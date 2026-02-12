import { createServiceClient } from "@/lib/supabase/service";
import { ProduitsContent } from "./ProduitsContent";

export default async function DashboardProduitsPage() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price_dzd, price_old_dzd, image_url, image_urls, badge, categories(name)")
    .order("created_at", { ascending: false });

  const products = (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price_dzd: p.price_dzd,
    price_old_dzd: p.price_old_dzd ?? null,
    image_url: p.image_url,
    image_urls: p.image_urls ?? null,
    categories: Array.isArray(p.categories)
      ? (p.categories[0] as { name?: string } | undefined) ?? null
      : (p.categories as { name?: string } | null),
  }));

  return <ProduitsContent products={products.length ? products : null} />;
}
