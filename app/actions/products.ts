"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: {
  name: string;
  slug: string;
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
  const { data: inserted, error } = await supabase
    .from("products")
    .insert({
      name: formData.name.trim(),
      slug: formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, "-"),
      category_id: formData.category_id || null,
      description: formData.description?.trim() || null,
      price_dzd: Number(formData.price_dzd) || 0,
      price_old_dzd: formData.price_old_dzd != null && Number(formData.price_old_dzd) > 0 ? Number(formData.price_old_dzd) : null,
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
  return { productId: inserted?.id ?? undefined };
}

export async function updateProduct(
  id: string,
  formData: {
    name: string;
    slug: string;
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
  const { error } = await supabase
    .from("products")
    .update({
      name: formData.name.trim(),
      slug: formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, "-"),
      category_id: formData.category_id || null,
      description: formData.description?.trim() || null,
      price_dzd: Number(formData.price_dzd) || 0,
      price_old_dzd: formData.price_old_dzd != null && Number(formData.price_old_dzd) > 0 ? Number(formData.price_old_dzd) : null,
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
  revalidatePath(`/produit/${id}`);
  revalidatePath("/dashboard/produits");
  return {};
}

export async function deleteProduct(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/produits");
  revalidatePath("/dashboard/produits");
  return {};
}
