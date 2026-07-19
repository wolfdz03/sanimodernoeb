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
      <main className="public-page">
        <div className="public-enter mx-auto max-w-[92rem] px-5 sm:px-8">
          <ProductsPageHeader />
          <ProductsFilters categories={categories} />

          <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
