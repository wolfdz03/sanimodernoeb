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
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="mb-12">
        <p className="text-sm font-medium text-[var(--primary)] uppercase tracking-widest mb-2">
          {t("page_faq_meta")}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
          {t("page_faq_title")}
        </h1>
        <p className="text-lg text-[var(--text-muted)] leading-relaxed">
          {t("page_faq_intro")}
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => (
          <details
            key={idx}
            className="group bg-white rounded-2xl border border-slate-100 overflow-hidden"
          >
            <summary className="flex items-center justify-between gap-4 list-none cursor-pointer p-5 sm:p-6 font-semibold text-[var(--text)] hover:bg-slate-50 transition-colors">
              <span>{t(item.q)}</span>
              <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" />
            </summary>
            <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-[var(--text-muted)] leading-relaxed border-t border-slate-100">
              {t(item.a)}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
