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

export type ProductSort =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc";

export async function getProducts(options?: {
  categorySlug?: string;
  limit?: number;
  sort?: ProductSort;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, categories(name, slug)");

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
  if (options?.minPrice != null && options.minPrice > 0) {
    query = query.gte("price_dzd", options.minPrice);
  }
  if (options?.maxPrice != null && options.maxPrice > 0) {
    query = query.lte("price_dzd", options.maxPrice);
  }
  if (options?.inStockOnly) {
    query = query.gt("stock", 0);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const sort = options?.sort ?? "newest";
  switch (sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "price_asc":
      query = query.order("price_dzd", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price_dzd", { ascending: false });
      break;
    case "name_asc":
      query = query.order("name", { ascending: true });
      break;
    case "name_desc":
      query = query.order("name", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
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
