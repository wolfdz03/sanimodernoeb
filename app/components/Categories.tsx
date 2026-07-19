"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Bath,
  Box,
  Building2,
  Droplet,
  Droplets,
  Flame,
  Gauge,
  Home,
  Package,
  ShowerHead,
  Sparkles,
  Thermometer,
  Toilet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/types/database";
import { useLanguage } from "@/context/LanguageContext";

const iconMap: Record<string, LucideIcon> = {
  ShowerHead,
  Bath,
  Droplets,
  Droplet,
  Toilet,
  Wrench,
  Sparkles,
  Thermometer,
  Home,
  Building2,
  Package,
  Box,
  Flame,
  Gauge,
};

export function Categories({ categories }: { categories: Category[] }) {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <section id="categories" className="border-y border-[#f2dfe1] bg-[#fff4f3] py-20 sm:py-28">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-10 lg:px-14 xl:px-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.34 }}
          className="mb-12 max-w-2xl"
        >
          <h2 className="text-4xl font-semibold tracking-[-0.045em] text-[#15191d] sm:text-5xl">
            {t("categories_title")}
          </h2>
          <p className="mt-4 max-w-[52ch] text-base leading-7 text-[#626a73]">
            {t("categories_subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-x-12 border-t border-[#cfd4d9] md:grid-cols-2">
          {categories.map((category, index) => {
            const Icon = category.icon_name ? iconMap[category.icon_name] ?? Sparkles : Sparkles;
            return (
              <motion.div
                key={category.id}
                initial={reduceMotion ? false : { opacity: 0, x: index % 2 === 0 ? -16 : 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.3, delay: (index % 4) * 0.035 }}
              >
                <Link
                  href={`/produits?categorie=${encodeURIComponent(category.slug)}`}
                  className="group grid grid-cols-[48px_1fr_auto] items-center gap-4 border-b border-[#cfd4d9] py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--primary)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[var(--primary)] shadow-[inset_0_0_0_1px_rgba(21,25,29,0.06)] transition-transform duration-300 group-hover:-translate-y-0.5">
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <span>
                    <span className="block text-lg font-semibold tracking-[-0.02em] text-[#252a30] transition-colors group-hover:text-[var(--primary)]">
                      {category.name}
                    </span>
                    <span className="mt-1 block text-sm text-[#717981]">
                      {t("categories_see_products")}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#7d858d] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--primary)] rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
