import { NavWithSettings } from "../components/NavWithSettings";
import { getProducts, getCategories } from "@/lib/supabase/queries";
import { ProductCard } from "../components/ProductCard";
import { ProductsPageHeader } from "../components/ProductsPageHeader";
import { ProductsPageEmpty } from "../components/ProductsPageEmpty";
import { ProductsFilters } from "../components/ProductsFilters";

interface PageProps {
  searchParams: Promise<{
    categorie?: string;
    sort?: string;
    min_price?: string;
    max_price?: string;
    in_stock?: string;
    search?: string;
  }>;
}

export default async function ProduitsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { categorie, sort, min_price, max_price, in_stock, search } = params;

  const [products, categories] = await Promise.all([
    getProducts({
      categorySlug: categorie || undefined,
      sort:
        sort &&
        ["newest", "oldest", "price_asc", "price_desc", "name_asc", "name_desc"].includes(sort)
          ? (sort as "newest" | "oldest" | "price_asc" | "price_desc" | "name_asc" | "name_desc")
          : undefined,
      minPrice: min_price ? parseInt(min_price, 10) : undefined,
      maxPrice: max_price ? parseInt(max_price, 10) : undefined,
      inStockOnly: in_stock === "1",
      search: search || undefined,
    }),
    getCategories(),
  ]);

  return (
    <>
      <NavWithSettings />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <ProductsPageHeader />
          <ProductsFilters categories={categories} />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && <ProductsPageEmpty />}
        </div>
      </main>
    </>
  );
}
