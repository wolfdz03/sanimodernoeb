"use client";

import { useState } from "react";
import { Nav } from "../components/Nav";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { createOrder } from "../actions/orders";
import { WILAYAS } from "@/lib/wilayas";

export default function CheckoutPage() {
  const { items, totalDzd, clearCart } = useCart();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

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
      shipping_wilaya: (form.elements.namedItem("shipping_wilaya") as HTMLSelectElement).value,
      shipping_city: (form.elements.namedItem("shipping_city") as HTMLInputElement).value,
      shipping_address: (form.elements.namedItem("shipping_address") as HTMLTextAreaElement).value,
      shipping_email: (form.elements.namedItem("shipping_email") as HTMLInputElement).value || undefined,
    };
    setLoading(true);
    const result = await createOrder(items, formData);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.orderId) {
      clearCart();
      setOrderId(result.orderId);
      window.history.replaceState(null, "", `/commande-confirmee?id=${result.orderId}`);
    }
  }

  if (items.length === 0 && !orderId) {
    return (
      <>
        <Nav />
        <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h1 className="font-bold text-2xl text-[#1E293B] mb-4">
              {t("checkout_cart_empty")}
            </h1>
            <p className="text-[#64748B] mb-6">
              {t("checkout_cart_empty_desc")}
            </p>
            <Link
              href="/produits"
              className="inline-block px-6 py-3 rounded-xl bg-[#DC2626] text-white font-semibold hover:bg-[#B91C1C] transition-colors"
            >
              {t("panier_see_products")}
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (orderId) {
    return (
      <>
        <Nav />
        <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h1 className="font-bold text-3xl text-[#1E293B] mb-4">
              {t("checkout_success_title")}
            </h1>
            <p className="text-[#64748B] mb-6">
              {t("checkout_success_message")}
            </p>
            <p className="text-sm text-[#64748B] mb-8">
              <strong className="text-[#1E293B]">{orderId}</strong>
            </p>
            <Link
              href="/produits"
              className="inline-block px-6 py-3 rounded-xl bg-[#DC2626] text-white font-semibold hover:bg-[#B91C1C] transition-colors"
            >
              {t("panier_continue")}
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-bold text-3xl text-[#1E293B] mb-8">
            Finaliser la commande
          </h1>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-bold text-lg text-[#1E293B] mb-4">
                Coordonnées de livraison
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="shipping_name"
                    className="block text-sm font-medium text-slate-600 mb-1"
                  >
                    Nom complet *
                  </label>
                  <input
                    id="shipping_name"
                    name="shipping_name"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="shipping_phone"
                    className="block text-sm font-medium text-slate-600 mb-1"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="shipping_wilaya"
                    className="block text-sm font-medium text-slate-600 mb-1"
                  >
                    {t("checkout_wilaya")} *
                  </label>
                  <select
                    id="shipping_wilaya"
                    name="shipping_wilaya"
                    required
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
                    className="block text-sm font-medium text-slate-600 mb-1"
                  >
                    {t("checkout_city")} *
                  </label>
                  <input
                    id="shipping_city"
                    name="shipping_city"
                    type="text"
                    required
                    placeholder="Ex: Alger Centre, Bab Ezzouar..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="shipping_email"
                    className="block text-sm font-medium text-slate-600 mb-1"
                  >
                    Email (optionnel)
                  </label>
                  <input
                    id="shipping_email"
                    name="shipping_email"
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="shipping_address"
                    className="block text-sm font-medium text-slate-600 mb-1"
                  >
                    Adresse complète (rue, numéro, lieu-dit) *
                  </label>
                  <textarea
                    id="shipping_address"
                    name="shipping_address"
                    required
                    rows={3}
                    placeholder="Rue, numéro, bâtiment, étage..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition resize-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                <h2 className="font-bold text-lg text-[#1E293B] mb-4">
                  Récapitulatif
                </h2>
                <ul className="space-y-3 mb-4">
                  {items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-[#1E293B]">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-[#1E293B]">
                        {(item.price * item.quantity).toLocaleString("fr-DZ")} DA
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-slate-200 pt-4 flex justify-between font-bold text-[#1E293B]">
                  <span>{t("panier_total")}</span>
                  <span className="text-[#DC2626]">
                    {totalDzd.toLocaleString("fr-DZ")} DA
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-4">
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
                href="/panier"
                className="block text-center text-[#2563EB] font-medium mt-3 hover:underline"
              >
                {t("checkout_back_cart")}
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
