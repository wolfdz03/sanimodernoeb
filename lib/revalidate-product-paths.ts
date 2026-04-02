import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";

/** Invalidate the storefront PDP (slug URL and legacy UUID path). */
export async function revalidateProductStorefrontPaths(productId: string) {
  const supabase = createServiceClient();
  const { data } = await supabase.from("products").select("slug").eq("id", productId).maybeSingle();
  const slug = (data as { slug?: string } | null)?.slug;
  if (slug) revalidatePath(`/produit/${slug}`);
  revalidatePath(`/produit/${productId}`);
}
