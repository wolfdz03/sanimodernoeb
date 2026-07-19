"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types/database";
import { useLanguage } from "@/context/LanguageContext";

export function Collection({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <section id="products" className="bg-[#fffdfc] py-20 sm:py-28">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-10 lg:px-14 xl:px-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.34 }}
          className="mb-10 max-w-2xl"
        >
          <h2 className="text-4xl font-semibold tracking-[-0.045em] text-[#15191d] sm:text-5xl">
            {t("collection_title_short")}
          </h2>
          <p className="mt-4 max-w-[48ch] text-base leading-7 text-[#626a73]">
            {t("collection_subtitle")}
          </p>
        </motion.div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.32, delay: (index % 4) * 0.04 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#d9dde1] bg-white px-6 py-16 text-center text-[#626a73]">
            {t("products_page_empty")}
          </div>
        )}

        <div className="mt-12 border-t border-[#d9dde1] pt-7">
          <Link
            href="/produits"
            className="group inline-flex items-center gap-3 text-sm font-semibold text-[#252a30] transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4"
          >
            {t("collection_btn")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
