"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function GarantiePageContent() {
  const { t, lang } = useLanguage();
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8">
      <div className="mb-12 max-w-3xl">
        <p className="text-sm font-medium text-[var(--primary)] uppercase tracking-widest mb-2">
          {t("page_garantie_meta")}
        </p>
        <h1 className="mb-4 flex items-center gap-4 text-4xl font-bold tracking-[-0.04em] text-[var(--text)] sm:text-6xl">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)] text-white"><ShieldCheck className="h-7 w-7" /></span>
          {t("page_garantie_title")}
        </h1>
        <p className="text-lg text-[var(--text-muted)] leading-relaxed">
          {t("page_garantie_intro")}
        </p>
      </div>

      <div className="public-panel border-t-4 border-t-[var(--primary)] p-6 sm:p-10">
        <h2 className="text-xl font-bold text-[var(--text)] mb-4">
          {lang === "ar" ? "الشروط العامة" : "Conditions générales"}
        </h2>
        <p className="text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
          {t("page_garantie_terms")}
        </p>
        <p className="mt-8 border-t border-[#f2e3e5] pt-6 text-[var(--text-muted)]">
          {lang === "ar" ? "لأي سؤال حول الضمان، " : "Pour toute question sur la garantie, "}
          <Link href="/#footer" className="text-[var(--primary)] font-medium hover:underline">
            {t("nav_contact")}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
