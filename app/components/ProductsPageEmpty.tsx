"use client";

import { useLanguage } from "@/context/LanguageContext";

export function ProductsPageEmpty() {
  const { t } = useLanguage();
  return (
    <p className="text-center text-[var(--text-muted)] py-12">
      {t("products_page_empty")}
    </p>
  );
}
