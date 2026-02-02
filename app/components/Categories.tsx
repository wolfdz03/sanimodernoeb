"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  ShowerHead,
  Bath,
  Droplets,
  Toilet,
  Wrench,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/types/database";
import { useLanguage } from "@/context/LanguageContext";

const iconMap: Record<string, LucideIcon> = {
  ShowerHead,
  Bath,
  Droplets,
  Toilet,
  Wrench,
  Sparkles,
};

interface CategoriesProps {
  categories: Category[];
}

export function Categories({ categories }: CategoriesProps) {
  const { t } = useLanguage();
  return (
    <section id="categories" className="relative py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-[#DC2626] text-sm font-semibold mb-4">
            {t("categories_badge")}
          </span>
          <h2 className="font-bold text-4xl sm:text-5xl text-[#1E293B] mb-4">
            {t("categories_title")}
          </h2>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            {t("categories_subtitle")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon =
              category.icon_name && iconMap[category.icon_name]
                ? iconMap[category.icon_name]
                : Sparkles;
            const color = category.color ?? "from-blue-500 to-blue-600";
            const bgColor = category.bg_color ?? "bg-blue-50";
            const textColor = category.text_color ?? "text-blue-600";
            return (
              <Link
                key={category.id}
                href={`/produits?categorie=${encodeURIComponent(category.slug)}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative p-8 rounded-2xl bg-white border-2 border-slate-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 text-left overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  <div
                    className={`relative w-16 h-16 rounded-2xl ${bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <Icon
                      className={`w-8 h-8 ${textColor}`}
                      strokeWidth={2}
                    />
                  </div>

                  <div className="relative">
                    <h3 className="font-bold text-2xl text-[#1E293B] mb-2 group-hover:text-[#DC2626] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-[#64748B] font-medium">
                      {t("categories_see_products")}
                    </p>
                  </div>

                  <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                    <span className="text-[#1E293B] font-bold">→</span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
