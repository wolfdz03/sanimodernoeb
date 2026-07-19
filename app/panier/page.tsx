"use client";

import { Nav } from "../components/Nav";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function PanierPage() {
  const { items, updateQuantity, removeItem, totalDzd } =
    useCart();
  const { t } = useLanguage();

  return (
    <>
      <Nav />
      <main className="public-page">
        <div className="public-enter mx-auto max-w-5xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">Sani Moderne</p>
          <h1 className="mb-10 text-4xl font-bold tracking-[-0.04em] text-[var(--text)] sm:text-5xl">
            {t("panier_title")}
          </h1>

          {items.length === 0 ? (
            <div className="public-panel p-12 text-center">
              <p className="text-[var(--text-muted)] mb-6">
                {t("panier_empty")}
              </p>
              <Link
                href="/produits"
                className="inline-block px-6 py-3 rounded-xl bg-[#DC2626] text-white font-semibold hover:bg-[#B91C1C] transition-colors"
              >
                {t("panier_see_products")}
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId ?? ""}`}
                    className="public-panel public-interactive flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center sm:p-6"
                  >
                    <div className="h-28 w-full flex-shrink-0 overflow-hidden rounded-xl bg-[#fff1f1] sm:h-24 sm:w-24">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-[#1E293B] truncate">
                        {item.name}
                      </h2>
                      {item.variantLabel && (
                        <p className="text-sm text-[var(--text-muted)]">
                          {item.variantLabel}
                        </p>
                      )}
                      <p className="font-bold text-[#DC2626]">
                        {item.price.toLocaleString("fr-DZ")} DA
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1, item.variantId)
                        }
                        className="public-interactive flex h-10 w-10 items-center justify-center rounded-xl border border-[#eadfe1] bg-[#fff7f7] text-[var(--text)] hover:border-[var(--primary)]"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-semibold text-[#1E293B]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1, item.variantId)
                        }
                        className="public-interactive flex h-10 w-10 items-center justify-center rounded-xl border border-[#eadfe1] bg-[#fff7f7] text-[var(--text)] hover:border-[var(--primary)]"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center text-[#DC2626] transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="sm:ml-auto font-bold text-[#1E293B]">
                      {(item.price * item.quantity).toLocaleString("fr-DZ")} DA
                    </div>
                  </div>
                ))}
              </div>

              <div className="public-panel border-t-4 border-t-[var(--primary)] p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[var(--text-muted)] font-medium">{t("panier_total")}</span>
                  <span className="font-bold text-2xl text-[#DC2626]">
                    {totalDzd.toLocaleString("fr-DZ")} DA
                  </span>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full py-4 rounded-xl bg-[#DC2626] text-white font-semibold text-center hover:bg-[#B91C1C] transition-colors"
                >
                  {t("panier_checkout")}
                </Link>
                <Link
                  href="/produits"
                  className="block w-full py-3 mt-3 text-center text-[#2563EB] font-medium hover:underline"
                >
                  {t("panier_continue")}
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
