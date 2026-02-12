"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/lib/types/database";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { t } = useLanguage();
  const checkoutUrl = `/checkout?productId=${product.id}&qty=1`;

  return (
    <div className="flex flex-wrap gap-4">
      <Link
        href={checkoutUrl}
        className="px-8 py-4 rounded-xl bg-[#DC2626] text-white font-semibold hover:bg-[#B91C1C] transition-colors inline-block"
      >
        {t("product_order_now")}
      </Link>
    </div>
  );
}
