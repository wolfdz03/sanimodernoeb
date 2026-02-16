"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { trackViewContent } from "@/lib/facebook-pixel";
import { getProductPrimaryImage } from "@/lib/product-images";
import { formatVariantLabel } from "@/lib/variant-label";
import { createOrder } from "@/app/actions/orders";
import { WILAYAS } from "@/lib/wilayas";
import type { Product, ProductVariant, ProductOptionType } from "@/lib/types/database";

interface ProductDetailClientProps {
  product: Product;
  children?: React.ReactNode;
}

function resolveVariant(
  product: Product,
  selected: Record<string, string>
): ProductVariant | null {
  const variants = product.product_variants ?? [];
  const types = product.product_option_types ?? [];
  if (variants.length === 0 || types.length === 0) return null;
  for (const v of variants) {
    const opts = (v.product_variant_options ?? []) as {
      option_value_id: string;
      product_option_values?: { value: string; option_type_id: string };
    }[];
    let match = true;
    for (const t of types) {
      const want = selected[t.name]?.trim();
      if (!want) {
        match = false;
        break;
      }
      const has = opts.some(
        (o) =>
          o.product_option_values?.option_type_id === t.id &&
          o.product_option_values?.value === want
      );
      if (!has) {
        match = false;
        break;
      }
    }
    if (match) return v;
  }
  return null;
}

function getFirstAvailableVariant(product: Product): Record<string, string> | null {
  const variants = product.product_variants ?? [];
  const types = product.product_option_types ?? [];
  if (variants.length === 0 || types.length === 0) return null;
  const withStock = variants.filter((v) => v.stock > 0);
  const target = withStock.length > 0 ? withStock[0] : variants[0];
  const opts = (target.product_variant_options ?? []) as {
    product_option_values?: { value: string; option_type_id: string };
  }[];
  const typeById = new Map(types.map((t) => [t.id, t.name]));
  const selected: Record<string, string> = {};
  for (const o of opts) {
    const typeName = typeById.get(o.product_option_values?.option_type_id ?? "");
    if (typeName && o.product_option_values?.value) {
      selected[typeName] = o.product_option_values.value;
    }
  }
  return Object.keys(selected).length === types.length ? selected : null;
}

const SWATCH_COLORS: Record<string, string> = {
  blanc: "#ffffff",
  white: "#ffffff",
  noir: "#1e293b",
  black: "#1e293b",
  gris: "#64748b",
  gray: "#64748b",
  grey: "#64748b",
  marron: "#78350f",
  brown: "#78350f",
  beige: "#d6d3a8",
  chrome: "#cbd5e1",
  argent: "#94a3b8",
  silver: "#94a3b8",
};

function isColorOption(optionTypeName: string): boolean {
  const n = optionTypeName.toLowerCase();
  return n.includes("couleur") || n.includes("color") || n.includes("teinte");
}

export function ProductDetailClient({ product, children }: ProductDetailClientProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const orderFormRef = useRef<HTMLDivElement>(null);
  const hasVariants = (product.product_variants?.length ?? 0) > 0;
  const optionTypes = (product.product_option_types ?? []).sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    getFirstAvailableVariant(product) ?? {}
  );
  const [quantity, setQuantity] = useState(1);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    trackViewContent({
      id: product.id,
      name: product.name,
      price_dzd: product.price_dzd,
    });
  }, [product.id, product.name, product.price_dzd]);

  const resolvedVariant = useMemo(
    () => (hasVariants ? resolveVariant(product, selected) : null),
    [product, selected, hasVariants]
  );

  const displayPrice =
    resolvedVariant?.price_dzd != null && resolvedVariant.price_dzd >= 0
      ? Number(resolvedVariant.price_dzd)
      : product.price_dzd;
  const displayStock = resolvedVariant != null ? resolvedVariant.stock : product.stock;
  const canOrder = displayStock > 0;
  const selectionComplete = !hasVariants || resolvedVariant != null;
  const imageUrl = getProductPrimaryImage(product) ?? "/placeholder-product.png";
  const variantLabelDisplay =
    resolvedVariant && optionTypes.length
      ? formatVariantLabel(resolvedVariant, optionTypes)
      : null;
  const totalDzd = displayPrice * Math.max(1, quantity);

  const scrollToOrderForm = () => {
    orderFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  async function handleOrderSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOrderError(null);
    const form = e.currentTarget;
    const formData = {
      shipping_name: (form.elements.namedItem("shipping_name") as HTMLInputElement).value,
      shipping_phone: (form.elements.namedItem("shipping_phone") as HTMLInputElement).value,
      shipping_wilaya: (form.elements.namedItem("shipping_wilaya") as HTMLSelectElement).value,
      shipping_city: (form.elements.namedItem("shipping_city") as HTMLInputElement).value,
      shipping_address: (form.elements.namedItem("shipping_address") as HTMLTextAreaElement).value,
    };
    const items = [
      {
        productId: product.id,
        name: product.name,
        price: displayPrice,
        image: imageUrl,
        quantity: Math.max(1, quantity),
        variantId: resolvedVariant?.id ?? undefined,
        variantLabel: variantLabelDisplay ?? undefined,
      },
    ];
    setOrderLoading(true);
    const result = await createOrder(items, formData);
    setOrderLoading(false);
    if (result.error) {
      setOrderError(result.error);
      return;
    }
    if (result.orderId) {
      router.push(`/checkout?success=${result.orderId}&total=${totalDzd}`);
    }
  }

  const ctaDisabled = !canOrder || !selectionComplete;

  return (
    <>
      <div className="space-y-6">
        {hasVariants && optionTypes.length > 0 && (
          <>
            {optionTypes.map((optType) => {
              const values = optType.product_option_values ?? [];
              const isColor = isColorOption(optType.name);
              return (
                <div key={optType.id}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {optType.name}
                  </label>
                  {isColor ? (
                    <div className="flex flex-wrap gap-3">
                      {values.map((ov) => {
                        const swatchColor =
                          SWATCH_COLORS[ov.value.toLowerCase().trim()] ?? "#e2e8f0";
                        const isSelected = selected[optType.name] === ov.value;
                        const outOfStock = (() => {
                          const sel = { ...selected, [optType.name]: ov.value };
                          const v = resolveVariant(product, sel);
                          return v ? v.stock <= 0 : true;
                        })();
                        return (
                          <button
                            key={ov.id}
                            type="button"
                            title={ov.value}
                            onClick={() =>
                              setSelected((prev) => ({ ...prev, [optType.name]: ov.value }))
                            }
                            disabled={outOfStock}
                            className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "border-[#DC2626] ring-2 ring-[#DC2626]/30"
                                : "border-slate-300 hover:border-slate-400"
                            } ${outOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                            style={{ backgroundColor: swatchColor }}
                          >
                            {swatchColor === "#ffffff" && (
                              <span className="sr-only">{ov.value}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {values.map((ov) => {
                        const isSelected = selected[optType.name] === ov.value;
                        const outOfStock = (() => {
                          const sel = { ...selected, [optType.name]: ov.value };
                          const v = resolveVariant(product, sel);
                          return v ? v.stock <= 0 : true;
                        })();
                        return (
                          <button
                            key={ov.id}
                            type="button"
                            onClick={() =>
                              setSelected((prev) => ({ ...prev, [optType.name]: ov.value }))
                            }
                            disabled={outOfStock}
                            className={`px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all ${
                              isSelected
                                ? "border-[#DC2626] bg-[#DC2626] text-white"
                                : "border-slate-200 bg-white text-[#1E293B] hover:border-slate-300"
                            } ${outOfStock ? "opacity-50 cursor-not-allowed line-through" : ""}`}
                          >
                            {ov.value}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            className="font-bold text-2xl text-[#DC2626] transition-opacity duration-200"
            key={displayPrice}
          >
            {displayPrice.toLocaleString("fr-DZ")} DA
          </span>
          {displayStock <= 0 && (
            <span className="text-sm font-medium text-amber-600">Rupture</span>
          )}
          {displayStock > 0 && (
            <span className="text-sm text-[var(--text-muted)]">{displayStock} en stock</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700">Quantité</label>
          <input
            type="number"
            min={1}
            max={displayStock}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.max(1, Math.min(displayStock, parseInt(e.target.value, 10) || 1))
              )
            }
            className="w-20 px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-[#DC2626] outline-none transition"
          />
        </div>

        <button
          type="button"
          onClick={scrollToOrderForm}
          disabled={ctaDisabled}
          className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#16a34a] text-white font-bold text-lg hover:bg-[#15803d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          Commander maintenant – {totalDzd.toLocaleString("fr-DZ")} DZD
        </button>
      </div>

      {children}

      <div id="order-form" ref={orderFormRef} className="mt-12 scroll-mt-24">
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-xl text-[#1E293B] mb-4">Votre commande</h2>
          <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200">
            <p className="font-semibold text-[#1E293B]">{product.name}</p>
            {variantLabelDisplay && (
              <p className="text-sm text-[var(--text-muted)] mt-0.5">{variantLabelDisplay}</p>
            )}
            <p className="text-sm mt-2">
              Qté : {quantity} × {displayPrice.toLocaleString("fr-DZ")} DA ={" "}
              <strong className="text-[#DC2626]">
                {totalDzd.toLocaleString("fr-DZ")} DZD
              </strong>
            </p>
          </div>

          {orderError && (
            <p className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm">{orderError}</p>
          )}
          <form onSubmit={handleOrderSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nom complet *
              </label>
              <input
                name="shipping_name"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Téléphone *
              </label>
              <input
                name="shipping_phone"
                type="tel"
                required
                placeholder="0XXX XX XX XX ou +213 XXX XX XX XX"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Wilaya *
              </label>
              <select
                name="shipping_wilaya"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none"
              >
                <option value="">Choisir une wilaya</option>
                {WILAYAS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Commune *
              </label>
              <input
                name="shipping_city"
                type="text"
                required
                placeholder="Ex: Alger Centre, Bab Ezzouar..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Adresse complète *
              </label>
              <textarea
                name="shipping_address"
                required
                rows={3}
                placeholder="Rue, numéro, bâtiment, étage..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={ctaDisabled || orderLoading}
              className="w-full py-4 rounded-xl bg-[#DC2626] text-white font-bold hover:bg-[#B91C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {orderLoading ? "Envoi en cours…" : "Confirmer ma commande"}
            </button>
          </form>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-pb">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <span className="font-bold text-lg text-[#1E293B]">
            {totalDzd.toLocaleString("fr-DZ")} DZD
          </span>
          <button
            type="button"
            onClick={scrollToOrderForm}
            disabled={ctaDisabled}
            className="flex-1 py-4 px-6 rounded-xl bg-[#16a34a] text-white font-bold hover:bg-[#15803d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Commander
          </button>
        </div>
      </div>

      {/* Spacer so content isn't hidden behind sticky bar on mobile */}
      <div className="md:hidden h-24" aria-hidden />
    </>
  );
}
