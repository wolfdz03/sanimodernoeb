import type { Category, Product } from "@/lib/types/database";
import { isProductPathUuid } from "@/lib/product-public-slug";
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
  search?: string;
}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, categories(name, slug)");

  if (options?.search?.trim()) {
    const term = options.search.trim().replace(/,/g, " ");
    const pattern = `%${term}%`;
    query = query.or(`name.ilike.${pattern},description.ilike.${pattern}`);
  }
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
    .select(
      "*, categories(name, slug), " +
        "product_option_types(*, product_option_values(*)), " +
        "product_variants(*, product_variant_options(*, product_option_values!option_value_id(*, product_option_types(name)))), " +
        "product_attributes(*)"
    )
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as unknown as Product;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "*, categories(name, slug), " +
        "product_option_types(*, product_option_values(*)), " +
        "product_variants(*, product_variant_options(*, product_option_values!option_value_id(*, product_option_types(name)))), " +
        "product_attributes(*)"
    )
    .eq("slug", slug)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as unknown as Product;
}

/** Public PDP path: `/produit/{slug}` or legacy `/produit/{uuid}`. */
export async function getProductByPublicPath(param: string): Promise<Product | null> {
  const trimmed = param.trim();
  if (!trimmed) return null;
  if (isProductPathUuid(trimmed)) {
    return getProductById(trimmed);
  }
  return getProductBySlug(decodeURIComponent(trimmed));
}

/** Variant with resolved price (variant or product base) and option labels for display */
export async function getVariantForCart(variantId: string, productId: string) {
  const supabase = await createClient();
  const { data: variant, error: vErr } = await supabase
    .from("product_variants")
    .select(
      "id, product_id, price_dzd, stock, " +
        "product_variant_options(option_value_id, product_option_values(value, product_option_types(name)))"
    )
    .eq("id", variantId)
    .eq("product_id", productId)
    .single();
  if (vErr || !variant) return null;
  const { data: product } = await supabase
    .from("products")
    .select("id, name, price_dzd, image_url, image_urls")
    .eq("id", productId)
    .single();
  if (!product) return null;
  const v = variant as unknown as {
    id: string;
    product_id: string;
    price_dzd: number | null;
    stock: number;
    product_variant_options?: { product_option_values?: { value: string; product_option_types?: { name: string } } }[];
  };
  const p = product as unknown as { id: string; name: string; price_dzd: number; image_url: string | null; image_urls?: string[] };
  const price =
    v.price_dzd != null && v.price_dzd >= 0
      ? Number(v.price_dzd)
      : Number(p.price_dzd);
  const options = v.product_variant_options ?? [];
  const variantLabel = options
    .map((o) => o.product_option_values?.value ?? "")
    .filter(Boolean)
    .join(" • ");
  const imageUrl =
    Array.isArray(p.image_urls) && p.image_urls.length > 0
      ? p.image_urls[0]
      : p.image_url ?? null;
  return {
    variantId: v.id,
    productId: p.id,
    name: p.name,
    price,
    stock: v.stock,
    variantLabel: variantLabel || null,
    imageUrl,
  };
}

export async function getRelatedProducts(
  categoryId: string | null,
  excludeProductId: string,
  limit: number = 8
): Promise<Product[]> {
  if (!categoryId) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("category_id", categoryId)
    .neq("id", excludeProductId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []) as Product[];
}
