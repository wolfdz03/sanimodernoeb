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
      <main className="min-h-screen bg-gradient-to-b from-white via-white to-slate-50/50 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-10 flex-wrap">
            <Link href="/" className="hover:text-[var(--primary)] transition-colors font-medium">
              Accueil
            </Link>
            <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="m9 18 6-6-6-6" /></svg>
            <Link href="/produits" className="hover:text-[var(--primary)] transition-colors font-medium">
              Produits
            </Link>
            {categoryName && (
              <>
                <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="m9 18 6-6-6-6" /></svg>
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
            <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="m9 18 6-6-6-6" /></svg>
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

              {/* Price & rating row */}
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
                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <span className="text-sm font-bold text-amber-700">4.8</span>
                  <span className="text-xs text-amber-600">(124)</span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-[var(--text-muted)] mb-8 leading-relaxed text-[15px]">
                  {product.description}
                </p>
              )}

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="trust-badge">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Garantie 2 ans
                </span>
                <span className="trust-badge">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7" /></svg>
                  En stock
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-[13px] font-semibold">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                  Livraison 58 wilayas
                </span>
              </div>

              {/* Variant selector + order form */}
              <ProductDetailClient product={product}>
                {product.product_attributes && product.product_attributes.length > 0 && (
                  <div className="mb-8 mt-8">
                    <h2 className="font-bold text-lg text-[var(--text)] mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      Spécifications
                    </h2>
                    <dl className="rounded-2xl border border-slate-200 overflow-hidden">
                      {([...(product.product_attributes ?? [])] as { id: string; name: string; value: string; sort_order?: number }[])
                        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                        .map((attr, idx) => (
                          <div
                            key={attr.id}
                            className={`flex border-b border-slate-100 last:border-b-0 ${idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}
                          >
                            <dt className="px-5 py-3.5 w-44 flex-shrink-0 font-semibold text-[var(--text)] text-sm">
                              {attr.name}
                            </dt>
                            <dd className="px-5 py-3.5 text-[var(--text-muted)] text-sm">
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

          {/* REVIEWS WIDGET */}
          <section className="mt-20 pt-14 border-t border-slate-200">
            <h2 className="font-extrabold text-2xl sm:text-3xl text-[var(--text)] mb-10 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <span className="text-amber-500 text-lg">★</span>
              </span>
              Avis Clients
            </h2>
            <div className="grid lg:grid-cols-[320px_1fr] gap-12 items-start">
              {/* Review Summary */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-7 border border-slate-100 shadow-sm">
                <div className="flex items-end gap-3 mb-3">
                  <span className="font-extrabold text-5xl text-[var(--text)] tracking-tight">4.8</span>
                  <span className="text-slate-400 mb-1.5 font-medium">/ 5</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xl mb-2">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-8">Basé sur 124 avis vérifiés</p>

                <div className="space-y-3">
                  {[
                    { stars: 5, pct: 82 },
                    { stars: 4, pct: 14 },
                    { stars: 3, pct: 3 },
                    { stars: 2, pct: 1 },
                    { stars: 1, pct: 0 },
                  ].map(row => (
                    <div key={row.stars} className="flex items-center gap-3 text-sm">
                      <span className="w-8 text-slate-500 font-semibold text-right">{row.stars}</span>
                      <span className="text-amber-400 text-xs">★</span>
                      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-1000"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-slate-400 font-medium">{row.pct}%</span>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-8 py-3.5 rounded-xl border-2 border-slate-200 text-[var(--text)] font-bold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300">
                  Écrire un avis
                </button>
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {[
                  { name: "Amine B.", date: "Il y a 2 jours", title: "Excellente qualité", body: "Très satisfait de mon achat. Les finitions sont parfaites et le design moderne s'intègre très bien dans ma salle de bain. La livraison a été rapide vers Oran." },
                  { name: "Yasmine M.", date: "Il y a 1 semaine", title: "Beau design, montage facile", body: "Le produit est exactement comme sur les photos. Le rapport qualité/prix est imbattable. Je recommande vivement." },
                  { name: "Karim D.", date: "Il y a 3 semaines", title: "Très bon produit", body: "Rien à signaler, le produit est de très bonne qualité et conforme à la description. Service client réactif." }
                ].map((review, idx) => (
                  <div key={idx} className="p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-amber-400 text-sm">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-lg">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-red-400 flex items-center justify-center text-white font-bold text-sm">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[var(--text)] flex items-center gap-1.5">
                          {review.name}
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-green-50 text-green-600 text-[10px] font-bold">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Vérifié
                          </span>
                        </p>
                      </div>
                    </div>
                    <h4 className="font-bold text-[var(--text)] mb-2">{review.title}</h4>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">{review.body}</p>
                  </div>
                ))}
                <button className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline font-bold text-sm">
                  Voir tous les avis
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          </section>

          {/* Related Products */}
          {related.length > 0 && (
            <section className="mt-20 pt-14 border-t border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-extrabold text-2xl sm:text-3xl text-[var(--text)] tracking-tight">
                  Produits similaires
                </h2>
                <div className="hidden sm:flex items-center gap-2">
                  <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-red-50/50 transition-all duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                  </button>
                  <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-red-50/50 transition-all duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </button>
                </div>
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
