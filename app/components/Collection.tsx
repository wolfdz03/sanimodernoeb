"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
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
      className="relative py-28 bg-white overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-red-50/50 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-50/40 blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-14"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-muted)]/60 text-[var(--primary)] text-sm font-semibold mb-4"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Sélection Premium
            </motion.span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] mb-3 tracking-tight">
              {t("collection_title_short")}
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-1 w-16 bg-[var(--primary)] rounded-full" />
              <div className="h-1 w-6 bg-[var(--primary)]/30 rounded-full" />
              <div className="h-1 w-3 bg-[var(--primary)]/15 rounded-full" />
            </div>
          </div>
          <Link
            href="/produits"
            className="group inline-flex items-center gap-2 text-[var(--primary)] font-bold hover:gap-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded"
          >
            {t("collection_see_all")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Product grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <Link
            href="/produits"
            className="group inline-flex items-center gap-3 px-10 py-4.5 rounded-2xl bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary-hover)] transition-all shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
          >
            {t("collection_btn")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
