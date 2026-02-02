"use client";

import { motion } from "motion/react";
import { ArrowRight, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Hero() {
  const { t } = useLanguage();
  const scrollToProducts = () => {
    const element = document.querySelector("#products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-red-50/20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#2563EB]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#DC2626]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-100 rounded-full opacity-30" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-200 shadow-lg mb-8"
          >
            <Star className="w-4 h-4 text-[#DC2626] fill-[#DC2626]" />
            <span className="text-sm font-semibold text-[#1E293B]">
              {t("hero_badge")}
            </span>
          </motion.div>

          <h1 className="font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#1E293B] leading-[1.1] mb-6">
            {t("hero_title")}
            <br />
            <span className="bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#2563EB] bg-clip-text text-transparent">
              {t("hero_title_highlight")}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-xl text-[#475569] max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            {t("hero_subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={scrollToProducts}
              className="group px-8 py-4 rounded-xl bg-[#DC2626] text-white font-semibold hover:bg-[#B91C1C] transition-all duration-300 shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 hover:-translate-y-1 flex items-center gap-2"
            >
              {t("hero_btn_products")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                const element = document.querySelector("#categories");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 rounded-xl bg-white text-[#1E293B] font-semibold hover:bg-[#F8FAFC] transition-all duration-300 border-2 border-[#E2E8F0]"
            >
              {t("hero_btn_categories")}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20 pt-12 border-t border-slate-200"
          >
            {[
              { value: "500+", labelKey: "hero_stat_products" as const },
              { value: "50K+", labelKey: "hero_stat_clients" as const },
              { value: "4.9★", labelKey: "hero_stat_rating" as const },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-[#1E293B] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[#64748B]">{t(stat.labelKey)}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        className="absolute left-8 bottom-32 hidden lg:block"
      >
        <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-[-12deg]">
          <img
            src="https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=400&auto=format&fit=crop"
            alt="Modern shower"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 1 }}
        className="absolute right-8 bottom-32 hidden lg:block"
      >
        <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-[12deg]">
          <img
            src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop"
            alt="Modern bathtub"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}
