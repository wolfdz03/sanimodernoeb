"use client";

import { motion } from "motion/react";
import { CheckCircle2, Users, Building2, TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const achievements = [
  { icon: Users, value: "50 000+", labelKey: "about_stat_clients" as const },
  { icon: Building2, value: "15+", labelKey: "about_stat_years" as const },
  { icon: TrendingUp, value: "98%", labelKey: "about_stat_satisfaction" as const },
];

const benefitKeys = [
  "about_benefit1",
  "about_benefit2",
  "about_benefit3",
  "about_benefit4",
  "about_benefit5",
  "about_benefit6",
] as const;

export function Experience() {
  const { t } = useLanguage();
  return (
    <section
      id="about"
      className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-500 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-red-500 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
              {t("about_badge")}
            </span>

            <h2 className="font-bold text-4xl sm:text-5xl text-white mb-6 leading-tight">
              {t("about_title")}
              <span className="block bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
                {t("about_title_highlight")}
              </span>
            </h2>

            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              {t("about_para1")}
            </p>

            <p className="text-slate-400 leading-relaxed mb-10">
              {t("about_para2")}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {benefitKeys.map((key, index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">{t(key)}</span>
                </motion.div>
              ))}
            </div>

            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white font-semibold hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-1">
              {t("about_btn")}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop"
                alt="Modern bathroom"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>

            <div className="absolute -bottom-8 -left-8 right-8 grid grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="p-4 rounded-2xl bg-white shadow-xl border border-slate-200"
                >
                  <achievement.icon className="w-6 h-6 text-[#2563EB] mb-2" />
                  <div className="font-bold text-xl text-[#1E293B]">
                    {achievement.value}
                  </div>
                  <div className="text-xs text-[#64748B] leading-tight">
                    {t(achievement.labelKey)}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="absolute -top-6 -right-6 w-32 h-32 border-4 border-blue-500/30 rounded-3xl -z-10" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-red-500/20 to-transparent rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
