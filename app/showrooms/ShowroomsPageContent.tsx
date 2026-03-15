"use client";

import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

export function ShowroomsPageContent() {
  const { t, lang } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="mb-12">
        <p className="text-sm font-medium text-[var(--primary)] uppercase tracking-widest mb-2">
          {t("footer_showrooms")}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
          {t("page_showrooms_title")}
        </h1>
        <p className="text-lg text-[var(--text-muted)] leading-relaxed">
          {t("page_showrooms_intro")}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[var(--text)] mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[var(--primary)]" />
            {t("page_showrooms_oeb")}
          </h2>
          <div className="space-y-6 text-[var(--text-muted)]">
            <div className="flex items-start gap-4">
              <span className="font-medium text-[var(--text)] min-w-[100px]">
                {t("page_showrooms_address")}
              </span>
              <span>{t("footer_address")}</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-medium text-[var(--text)] min-w-[100px]">
                {t("page_showrooms_hours")}
              </span>
              <span>
                {lang === "ar"
                  ? "السبت – الخميس: 9:00 – 18:00"
                  : "Samedi – Jeudi : 9h – 18h"}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href={`tel:${(t("footer_phone") as string).replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 text-[var(--primary)] font-medium hover:underline"
              >
                <Phone className="w-4 h-4" />
                {t("footer_phone")}
              </a>
              <a
                href={`mailto:${t("footer_email")}`}
                className="inline-flex items-center gap-2 text-[var(--primary)] font-medium hover:underline"
              >
                <Mail className="w-4 h-4" />
                {t("footer_email")}
              </a>
            </div>
          </div>
          <p className="mt-8 pt-6 border-t border-slate-100 text-sm text-[var(--text-muted)]">
            {t("page_showrooms_contact")}
          </p>
        </div>
      </div>
    </div>
  );
}
