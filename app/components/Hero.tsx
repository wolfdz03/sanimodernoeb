"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2072&auto=format&fit=crop";

export function Hero() {
  const { t } = useLanguage();
  const scrollToProducts = () => {
    const element = document.querySelector("#products");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToCategories = () => {
    const element = document.querySelector("#categories");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="relative min-h-[85vh] w-full overflow-hidden flex items-center justify-center">
      <img
        src={HERO_IMAGE}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-slate-900/50" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center items-center text-center pt-32 sm:pt-40 md:pt-48 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            {t("hero_title_image")}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-medium">
            {t("hero_subtitle_image")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={scrollToProducts}
              className="group px-8 py-4 rounded-xl bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary-hover)] transition-all shadow-lg shadow-red-500/30 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              {t("hero_btn_products")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={scrollToCategories}
              className="px-8 py-4 rounded-xl border-2 border-white text-white font-bold hover:bg-white hover:text-slate-900 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              {t("hero_btn_categories")}
            </button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-3 gap-8 md:gap-16 border-t border-white/20 pt-8"
          >
            {[
              { value: "500+", labelKey: "hero_stat_products" as const },
              { value: "50K+", labelKey: "hero_stat_clients" as const },
              { value: "4.9/5", labelKey: "hero_stat_rating" as const },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm uppercase tracking-widest font-semibold mt-1">
                  {t(stat.labelKey)}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}
