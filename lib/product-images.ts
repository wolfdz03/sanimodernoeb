import type { Product } from "@/lib/types/database";

/** Returns all image URLs for a product (multi or fallback to single image_url). */
export function getProductImageUrls(product: {
  image_url?: string | null;
  image_urls?: string[] | null;
}): string[] {
  const urls = product.image_urls;
  if (urls && Array.isArray(urls) && urls.length > 0) {
    return urls.filter((u): u is string => typeof u === "string" && u.length > 0);
  }
  const single = product.image_url?.trim();
  return single ? [single] : [];
}

/** Returns the first (primary) image URL for a product. */
export function getProductPrimaryImage(product: {
  image_url?: string | null;
  image_urls?: string[] | null;
}): string | null {
  const urls = getProductImageUrls(product);
  return urls[0] ?? null;
}
