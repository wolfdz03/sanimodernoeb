"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Truck, Package, Gift } from "lucide-react";

export function LivraisonRetoursContent() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="mb-12 max-w-3xl">
        <p className="text-sm font-medium text-[var(--primary)] uppercase tracking-widest mb-2">
          {t("page_livraison_title")}
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-[-0.04em] text-[var(--text)] sm:text-6xl">
          {t("page_livraison_title")}
        </h1>
        <p className="text-lg text-[var(--text-muted)] leading-relaxed">
          {t("page_livraison_intro")}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-[var(--primary)] p-7 text-white lg:row-span-2 lg:p-10">
          <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold">
            <Truck className="h-7 w-7" />
            {t("page_livraison_delivery")}
          </h2>
          <p className="max-w-md text-lg leading-8 text-white/85">
            {t("page_livraison_delivery_text")}
          </p>
        </section>

        <section className="public-panel public-interactive p-7">
          <h2 className="text-xl font-bold text-[var(--text)] mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-[var(--primary)]" />
            {t("page_livraison_free")}
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed">
            {t("page_livraison_free_text")}
          </p>
        </section>

        <section className="public-panel public-interactive p-7">
          <h2 className="text-xl font-bold text-[var(--text)] mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-[var(--primary)]" />
            {t("page_livraison_returns")}
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed">
            {t("page_livraison_returns_text")}
          </p>
        </section>
      </div>
    </div>
  );
}
