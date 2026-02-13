"use client";

import { motion } from "motion/react";
import { Shield, Truck, Award, Headphones } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const features = [
  { icon: Shield, titleKey: "feature_quality_title" as const },
  { icon: Truck, titleKey: "feature_delivery_title" as const },
  { icon: Award, titleKey: "feature_certified_title" as const },
  { icon: Headphones, titleKey: "feature_support_title" as const },
];

export function Features() {
  const { t } = useLanguage();
  return (
    <section
      id="features"
      className="bg-white border-b border-[var(--border)] py-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex items-center justify-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--primary-muted)] flex items-center justify-center flex-shrink-0">
                <feature.icon
                  className="w-5 h-5 text-[var(--primary-hover)]"
                  strokeWidth={2}
                />
              </div>
              <span className="text-sm font-bold text-[var(--text)]">
                {t(feature.titleKey)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
