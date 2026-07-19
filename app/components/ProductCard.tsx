"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types/database";
import { getProductPrimaryImage } from "@/lib/product-images";
import { useLanguage } from "@/context/LanguageContext";

export function ProductCard({ product }: { product: Product }) {
  const { t } = useLanguage();
  const categoryName = product.categories?.name ?? null;
  const imageUrl = getProductPrimaryImage(product) ?? "/placeholder-product.png";
  const productUrl = product.slug
    ? `/produit/${encodeURIComponent(product.slug)}`
    : `/produit/${product.id}`;
  const hasDiscount = product.price_old_dzd != null && product.price_old_dzd > product.price_dzd;

  return (
    <article className="group">
      <Link
        href={productUrl}
        className="relative block aspect-[4/5] overflow-hidden rounded-2xl border border-[#f0e2e4] bg-[#fff1f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4"
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15191d]/45 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <span className="absolute bottom-4 right-4 inline-flex h-11 w-11 translate-y-2 items-center justify-center rounded-xl bg-white text-[#15191d] opacity-0 shadow-[0_12px_30px_rgba(30,41,59,0.16)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 rtl:left-4 rtl:right-auto">
          <ArrowUpRight className="h-4 w-4 rtl:-rotate-90" />
          <span className="sr-only">{t("product_order_now")}</span>
        </span>
      </Link>

      <div className="pt-4">
        <div className="mb-2 flex min-h-5 flex-wrap items-center gap-2 text-xs font-medium text-[#717981]">
          {categoryName && <span>{categoryName}</span>}
          {product.badge && (
            <>
              {categoryName && <span aria-hidden="true">/</span>}
              <span className="text-[var(--primary)]">{product.badge}</span>
            </>
          )}
        </div>
        <Link href={productUrl} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]">
          <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 tracking-[-0.015em] text-[#252a30] transition-colors group-hover:text-[var(--primary)]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-semibold tracking-[-0.025em] text-[#15191d]">
            {product.price_dzd.toLocaleString("fr-DZ")} DA
          </span>
          {hasDiscount && (
            <span className="text-sm text-[#8b9299] line-through">
              {product.price_old_dzd!.toLocaleString("fr-DZ")} DA
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
