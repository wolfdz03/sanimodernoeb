import { Nav } from "../components/Nav";
import { getProducts } from "@/lib/supabase/queries";
import { ProductCard } from "../components/ProductCard";

interface PageProps {
  searchParams: Promise<{ categorie?: string }>;
}

export default async function ProduitsPage({ searchParams }: PageProps) {
  const { categorie } = await searchParams;
  const products = await getProducts(
    categorie ? { categorySlug: categorie } : undefined
  );

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-[#2563EB] text-sm font-semibold mb-4">
              Catalogue
            </span>
            <h1 className="font-bold text-4xl sm:text-5xl text-[#1E293B] mb-4">
              Tous les Produits
            </h1>
            <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
              Parcourez notre gamme complète de produits de salle de bain
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <p className="text-center text-[#64748B] py-12">
              Aucun produit pour le moment.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
