"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function GarantiePageContent() {
  const { t, lang } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="mb-12">
        <p className="text-sm font-medium text-[var(--primary)] uppercase tracking-widest mb-2">
          {t("page_garantie_meta")}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4 flex items-center gap-3">
          <ShieldCheck className="w-9 h-9 text-[var(--primary)]" />
          {t("page_garantie_title")}
        </h1>
        <p className="text-lg text-[var(--text-muted)] leading-relaxed">
          {t("page_garantie_intro")}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-[var(--text)] mb-4">
          {lang === "ar" ? "الشروط العامة" : "Conditions générales"}
        </h2>
        <p className="text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
          {t("page_garantie_terms")}
        </p>
        <p className="mt-8 pt-6 border-t border-slate-100 text-[var(--text-muted)]">
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
