"use client";

import { motion } from "motion/react";
import { ShoppingBag, Heart, Eye, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types/database";
import { getProductPrimaryImage } from "@/lib/product-images";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const categoryName =
    product.categories && "name" in product.categories
      ? (product.categories as { name: string }).name
      : null;
  const imageUrl = getProductPrimaryImage(product) ?? "/placeholder-product.png";
  const badgeColor = product.badge_color ?? "bg-[var(--primary)]";
  const productUrl = `/produit/${product.id}`;

  const hasDiscount = product.price_old_dzd != null && product.price_old_dzd > 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.price_old_dzd! - product.price_dzd) / product.price_old_dzd!) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--primary)]/20 transition-all duration-500 hover-lift"
    >
      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 cursor-pointer">
        <Link
          href={`/produit/${product.id}`}
          className="block w-full h-full"
        >
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover product-image-zoom"
          />
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.badge && (
            <div
              className={`px-3 py-1.5 rounded-lg ${badgeColor} text-white text-xs font-bold tracking-wide shadow-lg`}
            >
              {product.badge}
            </div>
          )}
          {hasDiscount && discountPercent > 0 && (
            <div className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold shadow-lg">
              -{discountPercent}%
            </div>
          )}
        </div>

        {/* Quick action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <motion.button
            type="button"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-500 hover:bg-[var(--primary)] hover:text-white transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            style={{ transitionDelay: "0ms" }}
          >
            <Heart className="w-4.5 h-4.5" />
          </motion.button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/produit/${product.id}`);
            }}
            className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-500 hover:bg-[var(--primary)] hover:text-white transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            style={{ transitionDelay: "75ms" }}
          >
            <Eye className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Bottom CTA overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <Link
            href={productUrl}
            onClick={(e) => e.stopPropagation()}
            className="block w-full py-3 rounded-xl bg-white/95 backdrop-blur-sm text-[var(--text)] font-semibold hover:bg-[var(--primary)] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
          >
            <ShoppingBag className="w-4 h-4" />
            {t("product_order_now")}
          </Link>
        </div>
      </div>

      {/* Card info */}
      <Link href={`/produit/${product.id}`}>
        <div className="p-5 cursor-pointer">
          {categoryName && (
            <div className="inline-block text-[11px] text-[var(--primary)] font-bold uppercase tracking-[0.1em] mb-2 bg-[var(--primary-muted)]/60 px-2.5 py-0.5 rounded-md">
              {categoryName}
            </div>
          )}
          <h3 className="font-bold text-[var(--text)] mb-3 line-clamp-2 min-h-[3rem] group-hover:text-[var(--primary)] transition-colors duration-300 leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              {hasDiscount && (
                <span className="text-sm text-slate-400 line-through font-medium">
                  {product.price_old_dzd!.toLocaleString("fr-DZ")} DA
                </span>
              )}
              <span className="font-extrabold text-xl text-[var(--primary)] tracking-tight">
                {product.price_dzd.toLocaleString("fr-DZ")} DA
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs bg-amber-50 px-2.5 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-amber-700">4.8</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
