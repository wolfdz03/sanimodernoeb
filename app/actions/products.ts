"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";
import { buildProductPublicSlug } from "@/lib/product-public-slug";
import { revalidateProductStorefrontPaths } from "@/lib/revalidate-product-paths";

async function fetchCategorySlug(
  supabase: ReturnType<typeof createServiceClient>,
  categoryId: string | null
): Promise<string | null> {
  if (!categoryId) return null;
  const { data } = await supabase.from("categories").select("slug").eq("id", categoryId).maybeSingle();
  return (data as { slug?: string } | null)?.slug ?? null;
}

async function getNextCategorySequence(
  supabase: ReturnType<typeof createServiceClient>,
  categoryId: string | null
): Promise<number> {
  let q = supabase.from("products").select("category_sequence").order("category_sequence", { ascending: false }).limit(1);
  if (categoryId) q = q.eq("category_id", categoryId);
  else q = q.is("category_id", null);
  const { data, error } = await q;
  if (error) throw error;
  const max = (data?.[0] as { category_sequence?: number } | undefined)?.category_sequence;
  return typeof max === "number" && max >= 1 ? max + 1 : 1;
}

async function pickUniqueProductSlug(
  supabase: ReturnType<typeof createServiceClient>,
  baseSlug: string,
  excludeProductId?: string
): Promise<string> {
  for (let n = 0; n < 120; n++) {
    const candidate = n === 0 ? baseSlug : `${baseSlug}-${n + 1}`;
    const { data } = await supabase.from("products").select("id").eq("slug", candidate).maybeSingle();
    const row = data as { id: string } | null;
    if (!row) return candidate;
    if (excludeProductId && row.id === excludeProductId) return candidate;
  }
  throw new Error("Impossible de générer un lien unique pour ce produit.");
}

export async function createProduct(formData: {
  name: string;
  category_id: string | null;
  description: string | null;
  price_dzd: number;
  price_old_dzd?: number | null;
  image_urls: string[];
  badge: string | null;
  badge_color: string | null;
  stock: number;
}) {
  const urls = Array.isArray(formData.image_urls)
    ? formData.image_urls.filter((u) => typeof u === "string" && u.trim())
    : [];
  const firstUrl = urls[0]?.trim() || null;
  const supabase = createServiceClient();
  const categoryId = formData.category_id || null;
  const name = formData.name.trim();
  const categorySlug = await fetchCategorySlug(supabase, categoryId);
  const seq = await getNextCategorySequence(supabase, categoryId);
  const baseSlug = buildProductPublicSlug(categorySlug, seq, name);
  const slug = await pickUniqueProductSlug(supabase, baseSlug);

  const { data: inserted, error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      category_id: categoryId,
      category_sequence: seq,
      description: formData.description?.trim() || null,
      price_dzd: Number(formData.price_dzd) || 0,
      price_old_dzd:
        formData.price_old_dzd != null && Number(formData.price_old_dzd) > 0
          ? Number(formData.price_old_dzd)
          : null,
      image_url: firstUrl,
      image_urls: urls.length ? urls : [],
      badge: formData.badge?.trim() || null,
      badge_color: formData.badge_color?.trim() || null,
      stock: Number(formData.stock) ?? 0,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/produits");
  revalidatePath("/dashboard/produits");
  if (inserted?.id) await revalidateProductStorefrontPaths(inserted.id);
  return { productId: inserted?.id ?? undefined };
}

export async function updateProduct(
  id: string,
  formData: {
    name: string;
    category_id: string | null;
    description: string | null;
    price_dzd: number;
    price_old_dzd?: number | null;
    image_urls: string[];
    badge: string | null;
    badge_color: string | null;
    stock: number;
  }
) {
  const urls = Array.isArray(formData.image_urls)
    ? formData.image_urls.filter((u) => typeof u === "string" && u.trim())
    : [];
  const firstUrl = urls[0]?.trim() || null;
  const supabase = createServiceClient();

  const { data: existing, error: fetchErr } = await supabase
    .from("products")
    .select("category_id, category_sequence")
    .eq("id", id)
    .single();
  if (fetchErr || !existing) return { error: fetchErr?.message ?? "Produit introuvable." };

  const prev = existing as { category_id: string | null; category_sequence: number | null };
  const oldCat = prev.category_id ?? null;
  const newCat = formData.category_id || null;
  const name = formData.name.trim();

  let sequence = prev.category_sequence;
  if (oldCat !== newCat || sequence == null || sequence < 1) {
    sequence = await getNextCategorySequence(supabase, newCat);
  }

  const categorySlug = await fetchCategorySlug(supabase, newCat);
  const baseSlug = buildProductPublicSlug(categorySlug, sequence, name);
  const slug = await pickUniqueProductSlug(supabase, baseSlug, id);

  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug,
      category_id: newCat,
      category_sequence: sequence,
      description: formData.description?.trim() || null,
      price_dzd: Number(formData.price_dzd) || 0,
      price_old_dzd:
        formData.price_old_dzd != null && Number(formData.price_old_dzd) > 0
          ? Number(formData.price_old_dzd)
          : null,
      image_url: firstUrl,
      image_urls: urls.length ? urls : [],
      badge: formData.badge?.trim() || null,
      badge_color: formData.badge_color?.trim() || null,
      stock: Number(formData.stock) ?? 0,
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/produits");
  revalidatePath("/dashboard/produits");
  await revalidateProductStorefrontPaths(id);
  return {};
}

export async function deleteProduct(id: string) {
  const supabase = createServiceClient();
  await revalidateProductStorefrontPaths(id);
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/produits");
  revalidatePath("/dashboard/produits");
  return {};
}
