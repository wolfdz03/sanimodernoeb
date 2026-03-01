"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Minus, Plus, Package, CheckCircle } from "lucide-react";
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
  const { addItem } = useCart();

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

  const handleAddToCart = () => {
    if (!canOrder || !selectionComplete) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: displayPrice,
      image: imageUrl,
      quantity: Math.max(1, quantity),
      variantId: resolvedVariant?.id ?? null,
      variantLabel: variantLabelDisplay ?? null,
    });
    window.dispatchEvent(new Event("open-cart"));
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
        {/* Variant selectors */}
        {hasVariants && optionTypes.length > 0 && (
          <div className="space-y-5">
            {optionTypes.map((optType) => {
              const values = optType.product_option_values ?? [];
              const isColor = isColorOption(optType.name);
              return (
                <div key={optType.id}>
                  <label className="block text-sm font-bold text-[var(--text)] mb-3 uppercase tracking-wide">
                    {optType.name}
                    {selected[optType.name] && (
                      <span className="ml-2 text-[var(--text-muted)] font-medium normal-case tracking-normal">
                        — {selected[optType.name]}
                      </span>
                    )}
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
                            className={`w-11 h-11 rounded-xl border-2 transition-all flex items-center justify-center shrink-0 ${isSelected
                              ? "border-[#DC2626] ring-2 ring-[#DC2626]/30 scale-110"
                              : "border-slate-200 hover:border-slate-400"
                              } ${outOfStock ? "opacity-40 cursor-not-allowed" : ""}`}
                            style={{ backgroundColor: swatchColor }}
                          >
                            {isSelected && swatchColor !== "#ffffff" && (
                              <CheckCircle className="w-4 h-4 text-white drop-shadow" />
                            )}
                            {swatchColor === "#ffffff" && isSelected && (
                              <CheckCircle className="w-4 h-4 text-[#DC2626]" />
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
                            className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${isSelected
                              ? "border-[#DC2626] bg-[#DC2626] text-white shadow-md shadow-red-500/20"
                              : "border-slate-200 bg-white text-[var(--text)] hover:border-slate-300"
                              } ${outOfStock ? "opacity-40 cursor-not-allowed line-through" : ""}`}
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
          </div>
        )}

        {/* Price & stock display */}
        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            className="font-extrabold text-3xl text-[#DC2626] transition-opacity duration-200 tracking-tight"
            key={displayPrice}
          >
            {displayPrice.toLocaleString("fr-DZ")} DA
          </span>
          {displayStock <= 0 && (
            <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">Rupture de stock</span>
          )}
          {displayStock > 0 && (
            <span className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg font-semibold">{displayStock} en stock</span>
          )}
        </div>

        {/* Quantity selector */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-[var(--text)]">Quantité</label>
          <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-[var(--primary)] transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
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
              className="w-14 text-center py-2.5 border-x-2 border-slate-200 font-bold text-[var(--text)] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => setQuantity(Math.min(displayStock, quantity + 1))}
              className="px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-[var(--primary)] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={ctaDisabled}
            className="flex-1 flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl border-2 border-slate-200 text-[var(--text)] font-bold text-base hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-red-50/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-5 h-5" />
            Ajouter au panier
          </button>

          <button
            type="button"
            onClick={scrollToOrderForm}
            disabled={ctaDisabled}
            className="flex-[1.5] px-8 py-4 rounded-2xl bg-[#16a34a] text-white font-bold text-base hover:bg-[#15803d] hover:shadow-lg hover:shadow-green-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            Commander : {totalDzd.toLocaleString("fr-DZ")} DZD
          </button>
        </div>
      </div>

      {children}

      {/* Order form */}
      <div id="order-form" ref={orderFormRef} className="mt-14 scroll-mt-24">
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-muted)] flex items-center justify-center">
              <Package className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <h2 className="font-extrabold text-xl text-[var(--text)]">Votre commande</h2>
          </div>

          {/* Order summary */}
          <div className="mb-8 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="font-bold text-[var(--text)]">{product.name}</p>
            {variantLabelDisplay && (
              <p className="text-sm text-[var(--text-muted)] mt-0.5">{variantLabelDisplay}</p>
            )}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <span className="text-sm text-[var(--text-muted)]">
                {quantity} × {displayPrice.toLocaleString("fr-DZ")} DA
              </span>
              <span className="font-extrabold text-lg text-[var(--primary)]">
                {totalDzd.toLocaleString("fr-DZ")} DZD
              </span>
            </div>
          </div>

          {orderError && (
            <p className="mb-6 p-4 rounded-2xl bg-red-50 text-red-700 text-sm font-medium border border-red-100">{orderError}</p>
          )}

          <form onSubmit={handleOrderSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[var(--text)] mb-2">
                Nom complet <span className="text-[var(--primary)]">*</span>
              </label>
              <input
                name="shipping_name"
                type="text"
                required
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all text-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--text)] mb-2">
                Téléphone <span className="text-[var(--primary)]">*</span>
              </label>
              <input
                name="shipping_phone"
                type="tel"
                required
                placeholder="0XXX XX XX XX ou +213 XXX XX XX XX"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all text-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--text)] mb-2">
                Wilaya <span className="text-[var(--primary)]">*</span>
              </label>
              <select
                name="shipping_wilaya"
                required
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all text-[var(--text)]"
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
              <label className="block text-sm font-bold text-[var(--text)] mb-2">
                Commune <span className="text-[var(--primary)]">*</span>
              </label>
              <input
                name="shipping_city"
                type="text"
                required
                placeholder="Ex: Alger Centre, Bab Ezzouar..."
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all text-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--text)] mb-2">
                Adresse complète <span className="text-[var(--primary)]">*</span>
              </label>
              <textarea
                name="shipping_address"
                required
                rows={3}
                placeholder="Rue, numéro, bâtiment, étage..."
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none resize-none transition-all text-[var(--text)]"
              />
            </div>
            <button
              type="submit"
              disabled={ctaDisabled || orderLoading}
              className="w-full py-4.5 rounded-2xl bg-[var(--primary)] text-white font-extrabold text-lg hover:bg-[var(--primary-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30"
            >
              {orderLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Envoi en cours…
                </span>
              ) : "Confirmer ma commande"}
            </button>
          </form>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_30px_rgba(0,0,0,0.08)] safe-area-pb">
        <div className="max-w-7xl mx-auto flex gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={ctaDisabled}
            className="px-4 py-4 rounded-xl border-2 border-slate-200 bg-white text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Ajouter au panier"
          >
            <ShoppingBag className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={scrollToOrderForm}
            disabled={ctaDisabled}
            className="flex-1 py-4 px-6 rounded-xl bg-[#16a34a] text-white font-bold hover:bg-[#15803d] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
          >
            Commander {totalDzd.toLocaleString("fr-DZ")} DZD
          </button>
        </div>
      </div>

      {/* Spacer so content isn't hidden behind sticky bar on mobile */}
      <div className="md:hidden h-24" aria-hidden />
    </>
  );
}
