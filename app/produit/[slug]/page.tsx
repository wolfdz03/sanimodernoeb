import { NavWithSettings } from "../../components/NavWithSettings";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getProductByPublicPath, getRelatedProducts } from "@/lib/supabase/queries";
import { isProductPathUuid } from "@/lib/product-public-slug";
import { getSiteSettings } from "@/lib/site-settings";
import { getShippingRates } from "@/app/actions/shipping";

export const dynamic = "force-dynamic";
import { ProductDetailClient } from "../../components/ProductDetailClient";
import { ProductGallery } from "../../components/ProductGallery";
import { ProductCard } from "../../components/ProductCard";
import { ChevronRight, ClipboardList, ShieldCheck, Truck } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug: raw } = await params;
  const decoded = decodeURIComponent(raw.trim());
  const product = await getProductByPublicPath(decoded);
  if (!product) notFound();

  if (isProductPathUuid(decoded) && product.slug && decoded !== product.slug) {
    redirect(`/produit/${product.slug}`);
  }

  const [related, settings, shippingRates] = await Promise.all([
    getRelatedProducts(product.category_id, product.id, 8),
    getSiteSettings(),
    getShippingRates(),
  ]);

  const categoryName =
    product.categories && "name" in product.categories
      ? (product.categories as { name: string }).name
      : null;

  return (
    <>
      <NavWithSettings />
      <main className="public-page">
        <div className="public-enter mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-10 flex-wrap">
            <Link href="/" className="hover:text-[var(--primary)] transition-colors font-medium">
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4 text-[#c9b8bb] rtl:rotate-180" />
            <Link href="/produits" className="hover:text-[var(--primary)] transition-colors font-medium">
              Produits
            </Link>
            {categoryName && (
              <>
                <ChevronRight className="h-4 w-4 text-[#c9b8bb] rtl:rotate-180" />
                <Link
                  href={`/produits?categorie=${encodeURIComponent(
                    (product.categories as { slug?: string })?.slug ?? ""
                  )}`}
                  className="hover:text-[var(--primary)] transition-colors font-medium"
                >
                  {categoryName}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4 text-[#c9b8bb] rtl:rotate-180" />
            <span className="text-[var(--text)] font-semibold">{product.name}</span>
          </nav>

          {/* Product Layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery - sticky */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <ProductGallery
                product={product}
                badge={product.badge}
                badgeColor={product.badge_color}
              />
            </div>

            {/* Product Info */}
            <div>
              {categoryName && (
                <span className="inline-flex items-center gap-1.5 text-xs text-[var(--primary)] font-bold uppercase tracking-[0.1em] mb-3 bg-[var(--primary-muted)]/60 px-3 py-1 rounded-lg">
                  {categoryName}
                </span>
              )}
              <h1 className="font-extrabold text-3xl sm:text-4xl text-[var(--text)] mb-5 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="flex flex-col gap-1">
                  {product.price_old_dzd != null && product.price_old_dzd > 0 && (
                    <span className="text-base text-slate-400 line-through font-medium">
                      {product.price_old_dzd.toLocaleString("fr-DZ")} DA
                    </span>
                  )}
                  <span className="font-extrabold text-3xl text-[var(--primary)] tracking-tight">
                    {product.price_dzd.toLocaleString("fr-DZ")} DA
                  </span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-[var(--text-muted)] mb-8 leading-relaxed text-[15px] whitespace-pre-line">
                  {product.description}
                </p>
              )}

              <div className="mb-8 grid gap-2 sm:grid-cols-2">
                <span className="flex items-center gap-2 rounded-xl border border-[#f0e2e4] bg-[#fff7f7] px-4 py-3 text-sm font-semibold text-[var(--text)]">
                  <ShieldCheck className="h-4 w-4 text-[var(--primary)]" /> Paiement à la livraison
                </span>
                <span className="flex items-center gap-2 rounded-xl border border-[#f0e2e4] bg-[#fff7f7] px-4 py-3 text-sm font-semibold text-[var(--text)]">
                  <Truck className="h-4 w-4 text-[var(--primary)]" /> Livraison nationale
                </span>
              </div>

              {/* Variant selector + order form */}
              <ProductDetailClient product={product} shippingRates={shippingRates} settings={settings}>
                {product.product_attributes && product.product_attributes.length > 0 && (
                  <div className="mb-8 mt-8">
                    <h2 className="font-bold text-lg text-[var(--text)] mb-4 flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-[var(--primary)]" />
                      Spécifications
                    </h2>
                    <dl className="grid gap-2 sm:grid-cols-2">
                      {([...(product.product_attributes ?? [])] as { id: string; name: string; value: string; sort_order?: number }[])
                        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                        .map((attr) => (
                          <div key={attr.id} className="rounded-xl border border-[#f0e2e4] bg-[#fffafa] p-4">
                            <dt className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                              {attr.name}
                            </dt>
                            <dd className="text-sm text-[var(--text-muted)]">
                              {attr.value}
                            </dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                )}
              </ProductDetailClient>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <section className="mt-20 border-t border-[#f0e2e4] pt-14">
              <div className="mb-8 flex items-end justify-between gap-4">
                <h2 className="font-extrabold text-2xl sm:text-3xl text-[var(--text)] tracking-tight">
                  Produits similaires
                </h2>
                <Link href="/produits" className="public-interactive text-sm font-bold text-[var(--primary)] hover:underline">Voir le catalogue</Link>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
                {related.map((p) => (
                  <div key={p.id} className="w-[80vw] sm:w-[320px] shrink-0 snap-start">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
