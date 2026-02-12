"use client";

import { motion } from "motion/react";
import { Tag, Wrench, ShieldCheck, Leaf } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const benefitCards = [
  {
    icon: Tag,
    titleKey: "about_benefit_price_title" as const,
    descKey: "about_benefit_price_desc" as const,
  },
  {
    icon: Wrench,
    titleKey: "about_benefit_install_title" as const,
    descKey: "about_benefit_install_desc" as const,
  },
  {
    icon: ShieldCheck,
    titleKey: "about_benefit_guarantee_title" as const,
    descKey: "about_benefit_guarantee_desc" as const,
  },
  {
    icon: Leaf,
    titleKey: "about_benefit_eco_title" as const,
    descKey: "about_benefit_eco_desc" as const,
  },
];

const ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop";

export function Experience() {
  const { t } = useLanguage();
  return (
    <section id="about" className="relative py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image with overlay badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={ABOUT_IMAGE}
              alt="Sani Modern OEB showroom"
              className="w-full h-[500px] lg:h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md px-8 py-6 rounded-xl border border-white/20 text-white">
              <div className="text-4xl font-extrabold mb-1">15+</div>
              <p className="text-sm font-semibold tracking-widest uppercase">
                {t("about_excellence_badge")}
              </p>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-extrabold text-[var(--text)] mb-6 leading-tight">
              {t("about_title_full")}
            </h2>
            <p className="text-lg text-[var(--text-muted)] mb-10 leading-relaxed">
              {t("about_para1")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {benefitCards.map((card, index) => (
                <motion.div
                  key={card.titleKey}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--primary-muted)] flex items-center justify-center flex-shrink-0">
                    <card.icon
                      className="w-6 h-6 text-[var(--primary)]"
                      strokeWidth={2}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text)] mb-1">
                      {t(card.titleKey)}
                    </h4>
                    <p className="text-sm text-[var(--text-muted)]">
                      {t(card.descKey)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-[var(--primary-subtle)]/50 rounded-xl border border-[var(--border)]">
              <div>
                <div className="text-3xl font-extrabold text-[var(--primary)]">
                  {t("about_satisfaction_label")}
                </div>
                <div className="text-xs font-bold text-[var(--text-muted)] uppercase">
                  {t("about_satisfaction_sublabel")}
                </div>
              </div>
              <div className="h-10 w-px bg-[var(--border)] hidden sm:block" />
              <p className="text-sm font-medium text-[var(--text-muted)]">
                {t("about_satisfaction_desc")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
