"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Leaf, ShieldCheck, Tag, Wrench } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const benefits = [
  { icon: Tag, titleKey: "about_benefit_price_title" as const, descKey: "about_benefit_price_desc" as const },
  { icon: Wrench, titleKey: "about_benefit_install_title" as const, descKey: "about_benefit_install_desc" as const },
  { icon: ShieldCheck, titleKey: "about_benefit_guarantee_title" as const, descKey: "about_benefit_guarantee_desc" as const },
  { icon: Leaf, titleKey: "about_benefit_eco_title" as const, descKey: "about_benefit_eco_desc" as const },
];

export function Experience() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-12 px-5 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20 lg:px-14 xl:px-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.38 }}
          className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[5/4] lg:aspect-[4/5]"
        >
          <Image
            src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=85&w=1400&auto=format&fit=crop"
            alt="Intérieur de salle de bain contemporaine sélectionné par Sani Modern OEB"
            fill
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.38 }}
        >
          <h2 className="max-w-[13ch] text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-[#15191d] sm:text-5xl">
            {t("about_title_full")}
          </h2>
          <p className="mt-6 max-w-[54ch] text-base leading-7 text-[#626a73]">
            {t("about_para1")}
          </p>

          <div className="mt-9 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit.titleKey} className="border-t border-[#d9dde1] py-5">
                <benefit.icon className="mb-4 h-5 w-5 text-[var(--primary)]" strokeWidth={1.7} />
                <h3 className="text-sm font-semibold text-[#252a30]">{t(benefit.titleKey)}</h3>
                <p className="mt-2 text-sm leading-6 text-[#717981]">{t(benefit.descKey)}</p>
              </div>
            ))}
          </div>

          <Link
            href="/a-propos"
            className="group mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#20252a] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[var(--primary)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
          >
            {t("about_btn")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
