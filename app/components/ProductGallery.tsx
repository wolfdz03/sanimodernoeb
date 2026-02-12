"use client";

import { useState } from "react";
import { getProductImageUrls } from "@/lib/product-images";
import type { Product } from "@/lib/types/database";

interface ProductGalleryProps {
  product: Product;
  badge?: string | null;
  badgeColor?: string | null;
}

export function ProductGallery({
  product,
  badge,
  badgeColor,
}: ProductGalleryProps) {
  const urls = getProductImageUrls(product);
  const [index, setIndex] = useState(0);
  const mainUrl = urls[index] ?? "/placeholder-product.png";

  if (urls.length === 0) {
    return (
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
        <img
          src="/placeholder-product.png"
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {badge && (
          <div
            className={`absolute top-4 left-4 px-3 py-1.5 rounded-full ${badgeColor ?? "bg-[#DC2626]"} text-white text-sm font-semibold`}
          >
            {badge}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
        <img
          src={mainUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {badge && (
          <div
            className={`absolute top-4 left-4 px-3 py-1.5 rounded-full ${badgeColor ?? "bg-[#DC2626]"} text-white text-sm font-semibold`}
          >
            {badge}
          </div>
        )}
      </div>
      {urls.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {urls.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-colors ${
                i === index
                  ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/30"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
