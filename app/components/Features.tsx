"use client";

import { motion } from "motion/react";
import { Shield, Truck, Award, Headphones, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const features = [
  { icon: Shield, titleKey: "feature_quality_title" as const, color: "#DC2626" },
  { icon: Truck, titleKey: "feature_delivery_title" as const, color: "#2563EB" },
  { icon: Award, titleKey: "feature_certified_title" as const, color: "#F59E0B" },
  { icon: Headphones, titleKey: "feature_support_title" as const, color: "#059669" },
];

export function Features() {
  const { t } = useLanguage();
  return (
    <section
      id="features"
      className="relative bg-white border-b border-[var(--border)] py-5 overflow-hidden"
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group flex items-center justify-center gap-3 py-3 px-4 rounded-xl hover:bg-slate-50 transition-all duration-300 cursor-default"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${feature.color}10` }}
              >
                <feature.icon
                  className="w-5 h-5"
                  style={{ color: feature.color }}
                  strokeWidth={2}
                />
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-sm font-bold text-[var(--text)]">
                  {t(feature.titleKey)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
