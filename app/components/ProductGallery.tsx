"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
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
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#f0e2e4] bg-[#fff1f1]">
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
      <div className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-[#f0e2e4] bg-[#fff1f1]" onClick={() => setIsZoomed(true)}>
        <AnimatePresence mode="wait">
          <motion.img
            key={mainUrl}
            src={mainUrl}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
              className="max-h-[85vh] max-w-[90vw] w-auto h-auto object-contain rounded-lg"
            />

            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lightbox nav */}
            {urls.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            {/* Image counter */}
            {urls.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-sm text-white text-xs font-medium">
                {index + 1} / {urls.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
