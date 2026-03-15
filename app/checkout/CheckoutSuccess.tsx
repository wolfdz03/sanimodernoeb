"use client";

import { useEffect } from "react";
import { Nav } from "../components/Nav";
import type { SiteSettings } from "@/lib/site-settings";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { trackPurchase } from "@/lib/marketing-events";

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
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="font-bold text-3xl text-[#1E293B] mb-4">
            {t("checkout_success_title")}
          </h1>
          <p className="text-[var(--text-muted)] mb-6">
            {t("checkout_success_message")}
          </p>
          <p className="text-sm text-[var(--text-muted)] mb-8">
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
