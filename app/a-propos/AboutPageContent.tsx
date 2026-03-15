"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export function AboutPageContent() {
  const { t, lang } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="mb-12">
        <p className="text-sm font-medium text-[var(--primary)] uppercase tracking-widest mb-2">
          {t("about_badge")}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
          {t("page_about_title")}
        </h1>
        <p className="text-lg text-[var(--text-muted)] leading-relaxed">
          {t("page_about_intro")}
        </p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-bold text-[var(--text)] mb-4">
            {t("about_title_full")}
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed mb-4">
            {t("about_para1")}
          </p>
          <p className="text-[var(--text-muted)] leading-relaxed">
            {t("about_para2")}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--text)] mb-4">
            {lang === "ar" ? "لماذا نحن" : "Pourquoi nous choisir"}
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-[var(--text-muted)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-0.5">•</span>
              {t("about_benefit1")}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-0.5">•</span>
              {t("about_benefit2")}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-0.5">•</span>
              {t("about_benefit3")}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-0.5">•</span>
              {t("about_benefit4")}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-0.5">•</span>
              {t("about_benefit5")}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-0.5">•</span>
              {t("about_benefit6")}
            </li>
          </ul>
        </section>

        <section className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <h2 className="text-xl font-bold text-[var(--text)] mb-4">
            {t("footer_contact_title")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 text-[var(--text-muted)]">
            <a
              href={`tel:${(t("footer_phone") as string).replace(/\s/g, "")}`}
              className="flex items-center gap-3 hover:text-[var(--primary)] transition-colors"
            >
              <Phone className="w-5 h-5 text-[var(--primary)]" />
              {t("footer_phone")}
            </a>
            <a
              href={`mailto:${t("footer_email")}`}
              className="flex items-center gap-3 hover:text-[var(--primary)] transition-colors"
            >
              <Mail className="w-5 h-5 text-[var(--primary)]" />
              {t("footer_email")}
            </a>
            <span className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
              {t("footer_address")}
            </span>
          </div>
          <div className="mt-6">
            <Link
              href="/#footer"
              className="inline-flex items-center gap-2 text-[var(--primary)] font-medium hover:underline"
            >
              {t("nav_contact")} →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
