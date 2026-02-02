"use client";

import { Nav } from "../components/Nav";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function PanierPage() {
  const { items, updateQuantity, removeItem, totalDzd, totalItems } =
    useCart();
  const { t } = useLanguage();

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-bold text-3xl text-[#1E293B] mb-8">
            {t("panier_title")}
          </h1>

          {items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <p className="text-[#64748B] mb-6">
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
                    key={item.productId}
                    className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                  >
                    <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
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
                      <p className="font-bold text-[#DC2626]">
                        {item.price.toLocaleString("fr-DZ")} DA
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#1E293B] transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-semibold text-[#1E293B]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#1E293B] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
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

              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[#64748B] font-medium">{t("panier_total")}</span>
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
