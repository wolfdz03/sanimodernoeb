import { Nav } from "../../components/Nav";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/supabase/queries";
import { ProductDetailClient } from "../../components/ProductDetailClient";
import { ProductGallery } from "../../components/ProductGallery";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const categoryName =
    product.categories && "name" in product.categories
      ? (product.categories as { name: string }).name
      : null;

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-[#64748B] mb-8">
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
                <span className="flex items-center gap-1 text-[#64748B]">
                  <span className="text-yellow-500">★</span> 4.8
                </span>
              </div>
              {product.description && (
                <p className="text-[#64748B] mb-8 leading-relaxed">
                  {product.description}
                </p>
              )}
              <ProductDetailClient product={product} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
