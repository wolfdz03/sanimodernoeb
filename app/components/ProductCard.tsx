"use client";

import { motion } from "motion/react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/lib/types/database";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const categoryName =
    product.categories && "name" in product.categories
      ? (product.categories as { name: string }).name
      : null;
  const imageUrl = product.image_url ?? "/placeholder-product.png";
  const badgeColor = product.badge_color ?? "bg-[#DC2626]";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price_dzd,
      image: imageUrl,
      quantity: 1,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-500"
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
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#1E293B] hover:bg-white hover:text-[#DC2626] transition-colors shadow-lg"
            >
              <Heart className="w-5 h-5" />
            </button>
            <Link
              href={`/produit/${product.id}`}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#1E293B] hover:bg-white hover:text-[#2563EB] transition-colors shadow-lg"
            >
              <Eye className="w-5 h-5" />
            </Link>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 rounded-xl bg-white text-[#1E293B] font-semibold hover:bg-[#DC2626] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {t("product_add_to_cart")}
            </button>
          </div>
        </div>
      </Link>

      <Link href={`/produit/${product.id}`}>
        <div className="p-5 cursor-pointer">
          {categoryName && (
            <div className="text-xs text-[#2563EB] font-semibold mb-2">
              {categoryName}
            </div>
          )}
          <h3 className="font-bold text-[#1E293B] mb-3 line-clamp-2 min-h-[3rem] group-hover:text-[#DC2626] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="font-bold text-xl text-[#DC2626]">
              {product.price_dzd.toLocaleString("fr-DZ")} DA
            </div>
            <div className="flex items-center gap-1 text-xs text-[#64748B]">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold">4.8</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
