"use client";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/lib/types/database";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const imageUrl = product.image_url ?? "/placeholder-product.png";

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price_dzd,
      image: imageUrl,
      quantity: 1,
    });
  };

  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={handleAddToCart}
        className="px-8 py-4 rounded-xl bg-[#DC2626] text-white font-semibold hover:bg-[#B91C1C] transition-colors"
      >
        {t("product_add_to_cart")}
      </button>
      <a
        href="/panier"
        className="px-8 py-4 rounded-xl border-2 border-[#E2E8F0] text-[#1E293B] font-semibold hover:border-[#DC2626] hover:text-[#DC2626] transition-colors inline-block"
      >
        {t("product_view_cart")}
      </a>
    </div>
  );
}
