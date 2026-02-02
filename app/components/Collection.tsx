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
      className="relative py-24 bg-gradient-to-b from-white to-slate-50"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-[#2563EB] text-sm font-semibold mb-4">
            {t("collection_badge")}
          </span>
          <h2 className="font-bold text-4xl sm:text-5xl text-[#1E293B] mb-4">
            {t("collection_title")}
          </h2>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            {t("collection_subtitle")}
          </p>
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
            className="inline-block px-8 py-4 rounded-xl bg-[#1E293B] text-white font-semibold hover:bg-[#0F172A] transition-colors"
          >
            {t("collection_btn")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
