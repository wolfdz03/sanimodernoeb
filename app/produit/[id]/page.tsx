import { NavWithSettings } from "../../components/NavWithSettings";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";
import { ProductDetailClient } from "../../components/ProductDetailClient";
import { ProductGallery } from "../../components/ProductGallery";
import { ProductCard } from "../../components/ProductCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category_id, product.id, 8);

  const categoryName =
    product.categories && "name" in product.categories
      ? (product.categories as { name: string }).name
      : null;

  return (
    <>
      <NavWithSettings />
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
            <Link href="/" className="hover:text-[#DC2626]">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/produits" className="hover:text-[#DC2626]">
              Produits
            </Link>
            {categoryName && (
              <>
                <span>/</span>
                <Link
                  href={`/produits?categorie=${encodeURIComponent(
                    (product.categories as { slug?: string })?.slug ?? ""
                  )}`}
                  className="hover:text-[#DC2626]"
                >
                  {categoryName}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-[#1E293B] font-medium">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            <ProductGallery
              product={product}
              badge={product.badge}
              badgeColor={product.badge_color}
            />

            <div>
              {categoryName && (
                <p className="text-sm text-[#2563EB] font-semibold mb-2">
                  {categoryName}
                </p>
              )}
              <h1 className="font-bold text-3xl sm:text-4xl text-[#1E293B] mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  {product.price_old_dzd != null && product.price_old_dzd > 0 && (
                    <span className="text-lg text-slate-400 line-through">
                      {product.price_old_dzd.toLocaleString("fr-DZ")} DA
                    </span>
                  )}
                  <span className="font-bold text-2xl text-[#DC2626]">
                    {product.price_dzd.toLocaleString("fr-DZ")} DA
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[var(--text-muted)]">
                  <span className="text-yellow-500">★</span> 4.8
                </span>
              </div>
              {product.description && (
                <p className="text-[var(--text-muted)] mb-8 leading-relaxed">
                  {product.description}
                </p>
              )}
              <ProductDetailClient product={product}>
                {product.product_attributes && product.product_attributes.length > 0 && (
                  <div className="mb-8">
                    <h2 className="font-semibold text-lg text-[#1E293B] mb-3">
                      Spécifications
                    </h2>
                    <dl className="rounded-xl border border-slate-200 overflow-hidden">
                      {([...(product.product_attributes ?? [])] as { id: string; name: string; value: string; sort_order?: number }[])
                        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                        .map((attr) => (
                          <div
                            key={attr.id}
                            className="flex border-b border-slate-100 last:border-b-0 bg-slate-50/50"
                          >
                            <dt className="px-4 py-3 w-40 flex-shrink-0 font-medium text-[#1E293B]">
                              {attr.name}
                            </dt>
                            <dd className="px-4 py-3 text-[var(--text-muted)]">
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

          {related.length > 0 && (
            <section className="mt-16 pt-12 border-t border-slate-200">
              <h2 className="font-bold text-2xl text-[#1E293B] mb-6">
                Produits similaires
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
