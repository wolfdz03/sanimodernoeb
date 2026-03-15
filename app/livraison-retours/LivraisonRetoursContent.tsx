"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Truck, Package, Gift } from "lucide-react";

export function LivraisonRetoursContent() {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="mb-12">
        <p className="text-sm font-medium text-[var(--primary)] uppercase tracking-widest mb-2">
          {t("page_livraison_title")}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
          {t("page_livraison_title")}
        </h1>
        <p className="text-lg text-[var(--text-muted)] leading-relaxed">
          {t("page_livraison_intro")}
        </p>
      </div>

      <div className="space-y-10">
        <section className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[var(--text)] mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-[var(--primary)]" />
            {t("page_livraison_delivery")}
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed">
            {t("page_livraison_delivery_text")}
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[var(--text)] mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-[var(--primary)]" />
            {t("page_livraison_free")}
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed">
            {t("page_livraison_free_text")}
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8">
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
