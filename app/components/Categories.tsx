"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  ShowerHead,
  Bath,
  Droplets,
  Toilet,
  Wrench,
  Sparkles,
  Droplet,
  Thermometer,
  Home,
  Building2,
  Package,
  Box,
  Truck,
  Shield,
  Award,
  Star,
  CheckCircle,
  Zap,
  Flame,
  Wind,
  Sun,
  Filter,
  Gauge,
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
  Truck,
  Shield,
  Award,
  Star,
  CheckCircle,
  Zap,
  Flame,
  Wind,
  Sun,
  Filter,
  Gauge,
};

interface CategoriesProps {
  categories: Category[];
}

export function Categories({ categories }: CategoriesProps) {
  const { t } = useLanguage();
  return (
    <section id="categories" className="relative py-28 overflow-hidden">
      {/* Premium background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-muted)]/60 text-[var(--primary)] text-sm font-semibold mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            {t("categories_badge")}
          </span>
          <h2 className="font-extrabold text-4xl sm:text-5xl text-[var(--text)] mb-5 tracking-tight">
            {t("categories_title")}
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            {t("categories_subtitle")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon =
              category.icon_name && iconMap[category.icon_name]
                ? iconMap[category.icon_name]
                : Sparkles;
            const isHex = category.color?.startsWith("#");
            const gradientClass = isHex ? "" : (category.color ?? "from-red-500 to-red-600");
            const bgColor = isHex ? "" : (category.bg_color ?? "bg-red-50");
            const textColor = isHex ? "" : (category.text_color ?? "text-red-600");

            return (
              <Link
                key={category.id}
                href={`/produits?categorie=${encodeURIComponent(category.slug)}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative p-8 rounded-2xl bg-white border border-[var(--border)] hover:border-transparent hover-lift text-left overflow-hidden"
                >
                  {/* Hover gradient fill */}
                  {isHex ? (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700 rounded-2xl"
                      style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)` }}
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700 rounded-2xl`}
                    />
                  )}

                  {/* Decorative corner accent */}
                  <div
                    className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-all duration-700 group-hover:scale-150"
                    style={{
                      background: isHex
                        ? (`radial-gradient(circle, ${category.color}, transparent)`)
                        : "radial-gradient(circle, #DC2626, transparent)"
                    }}
                  />

                  <div
                    className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${!isHex ? bgColor : ""}`}
                    style={isHex ? { backgroundColor: `${category.color}15` } : undefined}
                  >
                    <Icon
                      className={`w-7 h-7 ${!isHex ? textColor : ""}`}
                      style={isHex ? { color: category.color ?? undefined } : undefined}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="relative">
                    <h3 className="font-bold text-xl text-[var(--text)] mb-2 group-hover:text-[var(--primary)] transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] font-medium">
                      {t("categories_see_products")}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="absolute bottom-8 right-8 w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-[var(--primary)] flex items-center justify-center transition-all duration-500 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
                    <ArrowRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-white transition-colors" />
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
