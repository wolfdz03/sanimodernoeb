/** Legacy `/produit/{uuid}` URLs (any version nibble). */
export const PRODUCT_PATH_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isProductPathUuid(param: string): boolean {
  return PRODUCT_PATH_UUID_RE.test(param.trim());
}

/** URL-safe segment from product title (accents stripped). */
export function slugifyNameForUrl(name: string): string {
  const s = name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return s || "produit";
}

/** Use DB category slug as-is when safe; otherwise sanitize. */
export function categorySlugForPath(categorySlug: string | null | undefined): string {
  if (!categorySlug?.trim()) return "catalogue";
  const s = categorySlug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");
  return s || "catalogue";
}

export function buildProductPublicSlug(
  categorySlug: string | null | undefined,
  categorySequence: number,
  productName: string
): string {
  const cat = categorySlugForPath(categorySlug);
  const num = String(Math.max(1, categorySequence)).padStart(4, "0");
  const name = slugifyNameForUrl(productName);
  return `${cat}-${num}-${name}`;
}
