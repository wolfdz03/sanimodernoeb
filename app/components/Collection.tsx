"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types/database";
import { useLanguage } from "@/context/LanguageContext";

interface CollectionProps {
  products: Product[];
}

export function Collection({ products }: CollectionProps) {
  const { t } = useLanguage();
  return (
    <section
      id="products"
      className="relative py-24 bg-gradient-to-b from-white to-[var(--primary-subtle)]/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10"
        >
          <div>
            <h2 className="text-3xl font-extrabold text-[var(--text)] mb-2">
              {t("collection_title_short")}
            </h2>
            <div className="h-1 w-20 bg-[var(--primary)] rounded-full" />
          </div>
          <Link
            href="/produits"
            className="text-[var(--primary)] font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded"
          >
            {t("collection_see_all")}
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/produits"
            className="inline-block px-8 py-4 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
          >
            {t("collection_btn")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
