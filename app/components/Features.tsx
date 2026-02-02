"use client";

import { motion } from "motion/react";
import { Shield, Truck, Award, Headphones } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const features = [
  {
    icon: Shield,
    titleKey: "feature_quality_title" as const,
    descKey: "feature_quality_desc" as const,
  },
  {
    icon: Truck,
    titleKey: "feature_delivery_title" as const,
    descKey: "feature_delivery_desc" as const,
  },
  {
    icon: Award,
    titleKey: "feature_certified_title" as const,
    descKey: "feature_certified_desc" as const,
  },
  {
    icon: Headphones,
    titleKey: "feature_support_title" as const,
    descKey: "feature_support_desc" as const,
  },
];

export function Features() {
  const { t } = useLanguage();
  return (
    <section id="features" className="relative py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-lg text-[#1E293B] mb-2">
                {t(feature.titleKey)}
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                {t(feature.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
