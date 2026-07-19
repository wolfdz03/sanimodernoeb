"use client";

import { motion, useReducedMotion } from "motion/react";
import { Award, Headphones, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const features = [
  { icon: Shield, titleKey: "feature_quality_title" as const },
  { icon: Award, titleKey: "feature_certified_title" as const },
  { icon: Headphones, titleKey: "feature_support_title" as const },
];

export function Features() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <section id="features" className="border-b border-[#f0dfe1] bg-white">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 px-5 sm:grid-cols-3 sm:px-10 lg:px-14 xl:px-20">
        {features.map((feature, index) => (
          <motion.div
            key={feature.titleKey}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            className="flex items-center gap-4 border-b border-[#d9dde1] py-6 last:border-b-0 sm:border-b-0 sm:border-r sm:px-7 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0 rtl:sm:border-l rtl:sm:border-r-0"
          >
            <feature.icon className="h-5 w-5 shrink-0 text-[var(--primary)]" strokeWidth={1.7} />
            <span className="text-sm font-semibold tracking-[-0.01em] text-[#252a30]">
              {t(feature.titleKey)}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
