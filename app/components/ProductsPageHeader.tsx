"use client";

import { useLanguage } from "@/context/LanguageContext";

export function ProductsPageHeader() {
  const { t } = useLanguage();
  return (
    <div className="mb-10 max-w-3xl">
      <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
        {t("products_page_badge")}
      </span>
      <h1 className="mb-4 text-4xl font-bold tracking-[-0.04em] text-[var(--text)] sm:text-6xl">
        {t("products_page_title")}
      </h1>
      <p className="max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:text-lg">
        {t("products_page_subtitle")}
      </p>
    </div>
  );
}
