"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Hero() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <header className="relative isolate min-h-[100dvh] overflow-hidden bg-[#191516]">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 1.035 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 -z-20"
      >
        <Image
          src="/home-hero-bathroom.webp"
          alt="Salle de bain contemporaine avec baignoire îlot et robinetterie chromée"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[63%_center]"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(18,14,15,0.88)_0%,rgba(18,14,15,0.72)_37%,rgba(18,14,15,0.20)_72%,rgba(18,14,15,0.08)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(18,14,15,0.46)_0%,transparent_42%,rgba(18,14,15,0.18)_100%)]" />

      <div className="mx-auto flex min-h-[100dvh] max-w-[1500px] items-end px-5 pb-16 pt-32 sm:px-10 sm:pb-20 lg:items-center lg:px-14 lg:pb-8 xl:px-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[760px]"
        >
          <div>
            <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-white/80">
              <span className="h-0.5 w-9 bg-[var(--primary)]" />
              {t("hero_badge")}
            </p>
            <h1 className="max-w-[11ch] text-[clamp(3.1rem,7.2vw,7.4rem)] font-semibold leading-[0.88] tracking-[-0.07em] text-white [text-wrap:balance]">
              {t("hero_title")}
            </h1>
            <p className="mt-8 max-w-[46ch] text-base leading-7 text-white/75 sm:text-lg">
              {t("hero_subtitle_image")}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/produits"
                className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-xl bg-[var(--primary)] px-7 py-3.5 text-sm font-bold text-white shadow-[0_16px_45px_-18px_rgba(220,38,38,0.9)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                {t("hero_btn_products")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
              <a
                href="#categories"
                className="inline-flex min-h-13 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/18 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                {t("hero_btn_categories")}
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="absolute bottom-7 right-6 hidden items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 lg:flex xl:right-20"
      >
        <span>Explorez</span><span className="h-px w-12 bg-white/40" />
      </motion.div>
    </header>
  );
}
