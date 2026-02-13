"use client";

import { useLanguage } from "@/context/LanguageContext";

export function ProductsPageHeader() {
  const { t } = useLanguage();
  return (
    <div className="text-center mb-12">
      <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-4">
        {t("products_page_badge")}
      </span>
      <h1 className="font-bold text-4xl sm:text-5xl text-[#1E293B] mb-4">
        {t("products_page_title")}
      </h1>
      <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
        {t("products_page_subtitle")}
      </p>
    </div>
  );
}
