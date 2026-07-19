"use client";

import { useEffect } from "react";
import { Nav } from "../components/Nav";
import type { SiteSettings } from "@/lib/site-settings";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { trackPurchase } from "@/lib/marketing-events";
import { Check } from "lucide-react";

interface CheckoutSuccessProps {
  orderId: string;
  totalDzd?: number;
  settings?: SiteSettings | null;
}

export function CheckoutSuccess({ orderId, totalDzd, settings }: CheckoutSuccessProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (totalDzd != null && totalDzd > 0) {
      trackPurchase({ order_id: orderId, order_value: totalDzd });
    }
  }, [orderId, totalDzd]);

  return (
    <>
      <Nav settings={settings} />
      <main className="public-page px-5 sm:px-8">
        <div className="public-panel public-enter mx-auto max-w-2xl border-t-4 border-t-[var(--primary)] p-8 text-center sm:p-12">
          <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)] text-white"><Check className="h-7 w-7" /></span>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
            {t("checkout_success_title")}
          </h1>
          <p className="text-[var(--text-muted)] mb-6">
            {t("checkout_success_message")}
          </p>
          <p className="mb-8 rounded-xl bg-[#fff4f3] p-3 text-sm text-[var(--text-muted)]">
            <strong className="break-all text-[var(--text)]">{orderId}</strong>
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
