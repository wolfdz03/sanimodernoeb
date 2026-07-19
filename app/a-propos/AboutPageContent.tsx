"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export function AboutPageContent() {
  const { t, lang } = useLanguage();
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="mb-12 max-w-3xl">
        <p className="text-sm font-medium text-[var(--primary)] uppercase tracking-widest mb-2">
          {t("about_badge")}
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-[-0.04em] text-[var(--text)] sm:text-6xl">
          {t("page_about_title")}
        </h1>
        <p className="text-lg text-[var(--text-muted)] leading-relaxed">
          {t("page_about_intro")}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
        <section className="public-panel p-7 sm:p-9">
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

        <section className="public-panel p-7 sm:p-9">
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

        <section className="rounded-2xl bg-[var(--primary)] p-7 text-white sm:p-9 lg:col-span-2">
          <h2 className="mb-4 text-xl font-bold text-white">
            {t("footer_contact_title")}
          </h2>
          <div className="flex flex-col gap-6 text-white/85 sm:flex-row">
            <a
              href={`tel:${(t("footer_phone") as string).replace(/\s/g, "")}`}
              className="flex items-center gap-3 transition-colors hover:text-white"
            >
              <Phone className="h-5 w-5 text-white" />
              {t("footer_phone")}
            </a>
            <a
              href={`mailto:${t("footer_email")}`}
              className="flex items-center gap-3 transition-colors hover:text-white"
            >
              <Mail className="h-5 w-5 text-white" />
              {t("footer_email")}
            </a>
            <span className="flex items-center gap-3">
              <MapPin className="h-5 w-5 flex-shrink-0 text-white" />
              {t("footer_address")}
            </span>
          </div>
          <div className="mt-6">
            <Link
              href="/#footer"
              className="inline-flex items-center gap-2 font-semibold text-white hover:underline"
            >
              {t("nav_contact")} →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
