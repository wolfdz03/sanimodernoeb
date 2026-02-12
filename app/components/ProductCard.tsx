"use client";

import { motion } from "motion/react";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/lib/types/database";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage();
  const categoryName =
    product.categories && "name" in product.categories
      ? (product.categories as { name: string }).name
      : null;
  const imageUrl = product.image_url ?? "/placeholder-product.png";
  const badgeColor = product.badge_color ?? "bg-[var(--primary)]";
  const checkoutUrl = `/checkout?productId=${product.id}&qty=1`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-2xl transition-all duration-500"
    >
      <Link href={`/produit/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {product.badge && (
            <div
              className={`absolute top-3 left-3 px-3 py-1 rounded-full ${badgeColor} text-white text-xs font-semibold`}
            >
              {product.badge}
            </div>
          )}

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => e.preventDefault()}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[var(--text)] hover:bg-white hover:text-[var(--primary)] transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <Heart className="w-5 h-5" />
            </button>
            <Link
              href={`/produit/${product.id}`}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[var(--text)] hover:bg-white hover:text-[var(--primary)] transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <Eye className="w-5 h-5" />
            </Link>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              href={checkoutUrl}
              className="block w-full py-2.5 rounded-xl bg-white text-[var(--text)] font-semibold hover:bg-[var(--primary)] hover:text-white transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <ShoppingBag className="w-4 h-4" />
              {t("product_order_now")}
            </Link>
          </div>
        </div>
      </Link>

      <Link href={`/produit/${product.id}`}>
        <div className="p-5 cursor-pointer">
          {categoryName && (
            <div className="text-xs text-[var(--primary)] font-semibold mb-2">
              {categoryName}
            </div>
          )}
          <h3 className="font-bold text-[var(--text)] mb-3 line-clamp-2 min-h-[3rem] group-hover:text-[var(--primary)] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="font-bold text-xl text-[var(--primary)]">
              {product.price_dzd.toLocaleString("fr-DZ")} DA
            </div>
            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold">4.8</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
