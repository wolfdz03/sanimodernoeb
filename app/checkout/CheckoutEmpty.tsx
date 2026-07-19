"use client";

import { Nav } from "../components/Nav";
import type { SiteSettings } from "@/lib/site-settings";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface CheckoutEmptyProps {
  settings?: SiteSettings | null;
}

export function CheckoutEmpty({ settings }: CheckoutEmptyProps) {
  const { t } = useLanguage();

  return (
    <>
      <Nav settings={settings} />
      <main className="public-page px-5 sm:px-8">
        <div className="public-panel public-enter mx-auto max-w-2xl p-8 text-center sm:p-12">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-[var(--text)]">
            {t("checkout_cart_empty")}
          </h1>
          <p className="text-[var(--text-muted)] mb-6">
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
