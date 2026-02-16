import { NavWithSettings } from "./components/NavWithSettings";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Categories } from "./components/Categories";
import { Collection } from "./components/Collection";
import { Experience } from "./components/Experience";
import { Footer } from "./components/Footer";
import { getCategories, getProducts } from "@/lib/supabase/queries";
import { getSiteSettings } from "@/lib/site-settings";

export default async function Home() {
  const [categories, products, settings] = await Promise.all([
    getCategories(),
    getProducts({ limit: 8 }),
    getSiteSettings(),
  ]);

  return (
    <>
      <NavWithSettings />
      <main>
        <Hero />
        <Features />
        <Collection products={products} />
        <Categories categories={categories} />
        <Experience />
        <Footer settings={settings} />
      </main>
    </>
  );
}
