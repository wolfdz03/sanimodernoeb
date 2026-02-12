"use client";

import { Nav } from "../components/Nav";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function CheckoutEmpty() {
  const { t } = useLanguage();

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="font-bold text-2xl text-[#1E293B] mb-4">
            {t("checkout_cart_empty")}
          </h1>
          <p className="text-[#64748B] mb-6">
            {t("checkout_direct_desc")}
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
