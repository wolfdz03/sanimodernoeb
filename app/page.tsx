import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Categories } from "./components/Categories";
import { Collection } from "./components/Collection";
import { Experience } from "./components/Experience";
import { getCategories, getProducts } from "@/lib/supabase/queries";

export default async function Home() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ limit: 8 }),
  ]);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <Collection products={products} />
        <Categories categories={categories} />
        <Experience />
      </main>
    </>
  );
}
