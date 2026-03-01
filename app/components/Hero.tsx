"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
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
    <header className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <img
        src={HERO_IMAGE}
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-105"
        style={{ animation: "float-slow 20s ease-in-out infinite alternate", animationName: "none" }}
      />

      {/* Premium gradient overlay */}
      <div className="absolute inset-0 hero-gradient-overlay" />

      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-[10%] w-72 h-72 rounded-full bg-red-500/8 blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-[15%] w-96 h-96 rounded-full bg-amber-500/6 blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-white/5 blur-2xl animate-float" style={{ animationDelay: "2s" }} />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center items-center text-center pt-32 sm:pt-40 md:pt-48 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-dark text-white/90 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Qualité Premium • Livraison Nationale</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight">
            {t("hero_title_image")}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            {t("hero_subtitle_image")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <button
              onClick={scrollToProducts}
              className="group relative px-10 py-4.5 rounded-2xl bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary-hover)] transition-all shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 animate-pulse-glow"
            >
              <span className="relative z-10">{t("hero_btn_products")}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300 relative z-10" />
              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 animate-shimmer" />
              </div>
            </button>
            <button
              onClick={scrollToCategories}
              className="px-10 py-4.5 rounded-2xl border-2 border-white/30 text-white font-bold hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              {t("hero_btn_categories")}
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-3 gap-6 md:gap-12"
          >
            {[
              { value: "500+", labelKey: "hero_stat_products" as const },
              { value: "50K+", labelKey: "hero_stat_clients" as const },
              { value: "4.9/5", labelKey: "hero_stat_rating" as const },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.15 }}
                className="relative group"
              >
                {/* Glassmorphism stat card */}
                <div className="glass-dark rounded-2xl py-5 px-4 md:px-8 transition-all duration-500 group-hover:bg-white/10">
                  <div className="text-3xl md:text-4xl font-extrabold text-white mb-1 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-xs uppercase tracking-[0.2em] font-semibold">
                    {t(stat.labelKey)}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-3 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </header>
  );
}
