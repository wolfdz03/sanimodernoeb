"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  { q: "faq_1_q" as const, a: "faq_1_a" as const },
  { q: "faq_2_q" as const, a: "faq_2_a" as const },
  { q: "faq_3_q" as const, a: "faq_3_a" as const },
  { q: "faq_4_q" as const, a: "faq_4_a" as const },
];

export function FAQPageContent() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8">
      <div className="mb-12 max-w-3xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
          {t("page_faq_meta")}
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-[-0.04em] text-[var(--text)] sm:text-6xl">
          {t("page_faq_title")}
        </h1>
        <p className="text-lg leading-8 text-[var(--text-muted)]">
          {t("page_faq_intro")}
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, idx) => (
          <details
            key={idx}
            className="public-panel group overflow-hidden border-l-4 border-l-transparent open:border-l-[var(--primary)]"
          >
            <summary className="public-interactive flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-[var(--text)] hover:bg-[#fff5f5] sm:p-6">
              <span>{t(item.q)}</span>
              <ChevronDown className="h-5 w-5 flex-shrink-0 text-[var(--primary)] transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="border-t border-[#f2e3e5] px-5 pb-5 pt-4 leading-relaxed text-[var(--text-muted)] sm:px-6 sm:pb-6">
              {t(item.a)}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
