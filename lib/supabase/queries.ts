import type { Category, Product } from "@/lib/types/database";
import { createClient } from "./server";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getProducts(options?: {
  categorySlug?: string;
  limit?: number;
}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, categories(name, slug)")
    .order("created_at", { ascending: false });

  if (options?.categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.categorySlug)
      .single();
    if (cat?.id) {
      query = query.eq("category_id", cat.id);
    }
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}
