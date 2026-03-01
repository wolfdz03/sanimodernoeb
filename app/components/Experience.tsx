"use client";

import { motion } from "motion/react";
import { Tag, Wrench, ShieldCheck, Leaf, Star, Quote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const benefitCards = [
  {
    icon: Tag,
    titleKey: "about_benefit_price_title" as const,
    descKey: "about_benefit_price_desc" as const,
    color: "#DC2626",
  },
  {
    icon: Wrench,
    titleKey: "about_benefit_install_title" as const,
    descKey: "about_benefit_install_desc" as const,
    color: "#2563EB",
  },
  {
    icon: ShieldCheck,
    titleKey: "about_benefit_guarantee_title" as const,
    descKey: "about_benefit_guarantee_desc" as const,
    color: "#059669",
  },
  {
    icon: Leaf,
    titleKey: "about_benefit_eco_title" as const,
    descKey: "about_benefit_eco_desc" as const,
    color: "#16A34A",
  },
];

const ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop";

export function Experience() {
  const { t } = useLanguage();
  return (
    <section id="about" className="relative py-28 bg-white overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-red-50/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-50/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image with overlay badge */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={ABOUT_IMAGE}
                alt="Sani Modern OEB showroom"
                className="w-full h-[500px] lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

              {/* Badge */}
              <div className="absolute bottom-8 right-8 glass-dark px-8 py-6 rounded-2xl text-white">
                <div className="text-4xl font-extrabold mb-1">15+</div>
                <p className="text-sm font-semibold tracking-widest uppercase text-white/80">
                  {t("about_excellence_badge")}
                </p>
              </div>
            </div>

            {/* Floating testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 -left-6 sm:left-6 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 max-w-[280px] hidden md:block"
            >
              <Quote className="w-5 h-5 text-[var(--primary)] mb-2 opacity-40" />
              <p className="text-sm text-[var(--text-muted)] italic leading-relaxed mb-3">
                &ldquo;Qualité exceptionnelle et service impeccable&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-red-400 flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text)]">Ahmed B.</p>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary-muted)]/60 text-[var(--primary)] text-sm font-semibold mb-5">
              Pourquoi Nous Choisir
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] mb-6 leading-tight tracking-tight">
              {t("about_title_full")}
            </h2>
            <p className="text-lg text-[var(--text-muted)] mb-10 leading-relaxed">
              {t("about_para1")}
            </p>

            {/* Benefit cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
              {benefitCards.map((card, index) => (
                <motion.div
                  key={card.titleKey}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${card.color}10` }}
                  >
                    <card.icon
                      className="w-6 h-6"
                      style={{ color: card.color }}
                      strokeWidth={1.8}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text)] mb-1">
                      {t(card.titleKey)}
                    </h4>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                      {t(card.descKey)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Satisfaction card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-gradient-to-r from-[var(--primary-subtle)] to-white rounded-2xl border border-[var(--primary-muted)]/50"
            >
              <div>
                <div className="text-3xl font-extrabold text-gradient-red">
                  {t("about_satisfaction_label")}
                </div>
                <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mt-0.5">
                  {t("about_satisfaction_sublabel")}
                </div>
              </div>
              <div className="h-12 w-px bg-[var(--border)] hidden sm:block" />
              <p className="text-sm font-medium text-[var(--text-muted)] leading-relaxed">
                {t("about_satisfaction_desc")}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
