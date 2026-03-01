"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
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
  const [isZoomed, setIsZoomed] = useState(false);
  const mainUrl = urls[index] ?? "/placeholder-product.png";

  const goNext = () => setIndex((i) => (i + 1) % urls.length);
  const goPrev = () => setIndex((i) => (i - 1 + urls.length) % urls.length);

  if (urls.length === 0) {
    return (
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-50">
        <img
          src="/placeholder-product.png"
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {badge && (
          <div
            className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg ${badgeColor ?? "bg-[#DC2626]"} text-white text-sm font-bold shadow-lg`}
          >
            {badge}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-50 group cursor-zoom-in" onClick={() => setIsZoomed(true)}>
        <AnimatePresence mode="wait">
          <motion.img
            key={mainUrl}
            src={mainUrl}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </AnimatePresence>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        {badge && (
          <div
            className={`absolute top-5 left-5 px-4 py-2 rounded-xl ${badgeColor ?? "bg-[#DC2626]"} text-white text-sm font-bold shadow-lg`}
          >
            {badge}
          </div>
        )}

        {/* Zoom hint */}
        <div className="absolute bottom-5 right-5 w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
          <ZoomIn className="w-5 h-5 text-slate-600" />
        </div>

        {/* Nav arrows */}
        {urls.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:bg-white hover:text-[var(--primary)] transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:bg-white hover:text-[var(--primary)] transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image counter */}
        {urls.length > 1 && (
          <div className="absolute bottom-5 left-5 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
            {index + 1} / {urls.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {urls.length > 1 && (
        <div className="flex gap-3 flex-wrap">
          {urls.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-300 ${i === index
                  ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20 shadow-md"
                  : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                }`}
            >
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
              />
              {i === index && (
                <div className="absolute inset-0 bg-[var(--primary)]/5" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={mainUrl}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Close hint */}
            <div className="absolute top-6 right-6 text-white/60 text-sm font-medium">
              Cliquez pour fermer
            </div>

            {/* Lightbox nav */}
            {urls.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
