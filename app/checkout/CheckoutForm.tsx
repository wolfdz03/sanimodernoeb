"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "../components/Nav";
import type { SiteSettings } from "@/lib/site-settings";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { createOrder } from "../actions/orders";
import { WILAYAS } from "@/lib/wilayas";
import { trackInitiateCheckout } from "@/lib/facebook-pixel";
import type { CartItem } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";

interface CheckoutFormProps {
  items: CartItem[];
  settings?: SiteSettings | null;
  shippingRates?: Record<string, number>;
}

export function CheckoutForm({ items, settings, shippingRates }: CheckoutFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Calculate free delivery logic
  const freeThreshold = settings?.free_delivery_threshold_dzd;
  const isFreeDelivery = freeThreshold !== undefined && freeThreshold !== null && freeThreshold > 0 && subtotal >= freeThreshold;

  const shippingCost = isFreeDelivery ? 0 : (shippingRates?.[selectedWilaya] ?? 0);
  const totalDzd = subtotal + shippingCost;

  useEffect(() => {
    trackInitiateCheckout({ value: totalDzd, num_items: items.length });
  }, [totalDzd, items.length]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (items.length === 0) {
      setError(t("panier_empty"));
      return;
    }
    const form = e.currentTarget;
    const formData = {
      shipping_name: (form.elements.namedItem("shipping_name") as HTMLInputElement).value,
      shipping_phone: (form.elements.namedItem("shipping_phone") as HTMLInputElement).value,
      shipping_wilaya: selectedWilaya,
      shipping_city: (form.elements.namedItem("shipping_city") as HTMLInputElement).value,
      shipping_address: (form.elements.namedItem("shipping_address") as HTMLTextAreaElement).value,
    };
    setLoading(true);
    const result = await createOrder(items, formData);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.orderId) {
      router.push(`/checkout?success=${result.orderId}&total=${totalDzd}`);
      return;
    }
  }

  return (
    <>
      <Nav settings={settings} />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-bold text-3xl text-[#1E293B] mb-8">
            {t("checkout_title")}
          </h1>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-bold text-lg text-[#1E293B] mb-4">
                {t("checkout_shipping")}
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="shipping_name"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Nom complet *
                  </label>
                  <input
                    id="shipping_name"
                    name="shipping_name"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-[var(--text-muted)] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="shipping_phone"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    {t("checkout_phone")} *
                  </label>
                  <input
                    id="shipping_phone"
                    name="shipping_phone"
                    type="tel"
                    required
                    placeholder="0XXX XX XX XX ou +213 XXX XX XX XX"
                    title="Ex: 0550123456, 0550 12 34 56 ou +213 550 123 456"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-[var(--text-muted)] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="shipping_wilaya"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    {t("checkout_wilaya")} *
                  </label>
                  <select
                    id="shipping_wilaya"
                    name="shipping_wilaya"
                    required
                    value={selectedWilaya}
                    onChange={(e) => setSelectedWilaya(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition"
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
                  <label
                    htmlFor="shipping_city"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    {t("checkout_city")} *
                  </label>
                  <input
                    id="shipping_city"
                    name="shipping_city"
                    type="text"
                    required
                    placeholder="Ex: Alger Centre, Bab Ezzouar..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-[var(--text-muted)] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="shipping_address"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Adresse complète (rue, numéro, lieu-dit) *
                  </label>
                  <textarea
                    id="shipping_address"
                    name="shipping_address"
                    required
                    rows={3}
                    placeholder="Rue, numéro, bâtiment, étage..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-[var(--text-muted)] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition resize-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                <h2 className="font-bold text-lg text-[#1E293B] mb-4">
                  {t("checkout_order_summary")}
                </h2>
                <ul className="space-y-3 mb-4">
                  {items.map((item) => (
                    <li
                      key={`${item.productId}-${item.variantId ?? ""}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-[#1E293B]">
                        {item.name}
                        {item.variantLabel ? ` (${item.variantLabel})` : ""} × {item.quantity}
                      </span>
                      <span className="font-medium text-[#1E293B]">
                        {(item.price * item.quantity).toLocaleString("fr-DZ")} DA
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-slate-200 pt-3 pb-3 space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString("fr-DZ")} DA</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Livraison {selectedWilaya ? `(${selectedWilaya})` : ""}</span>
                    <span>
                      {selectedWilaya
                        ? isFreeDelivery
                          ? <span className="text-emerald-600 font-medium tracking-wide text-xs bg-emerald-50 px-2 py-0.5 rounded uppercase">Gratuite</span>
                          : `${shippingCost.toLocaleString("fr-DZ")} DA`
                        : "—"}
                    </span>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between font-bold text-[#1E293B] text-lg">
                  <span>{t("panier_total")}</span>
                  <span className="text-[#DC2626]">
                    {totalDzd.toLocaleString("fr-DZ")} DA
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-4">
                  Paiement à la livraison.
                </p>
              </div>
              {error && (
                <p className="text-[#DC2626] text-sm mb-4">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#DC2626] text-white font-semibold hover:bg-[#B91C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("checkout_confirm_loading") : t("checkout_place_order")}
              </button>
              <Link
                href="/produits"
                className="block text-center text-[#2563EB] font-medium mt-3 hover:underline"
              >
                {t("panier_continue")}
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
