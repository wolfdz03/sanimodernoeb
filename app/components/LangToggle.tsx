"use client";

import { useLanguage } from "@/context/LanguageContext";

export function LangToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
      role="group"
      aria-label="Changer la langue"
    >
      <button
        type="button"
        onClick={() => setLang("fr")}
        className={`px-3 py-2 text-sm font-medium transition-colors ${
          lang === "fr"
            ? "bg-[#2563EB] text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`}
        aria-pressed={lang === "fr"}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLang("ar")}
        className={`px-3 py-2 text-sm font-medium transition-colors ${
          lang === "ar"
            ? "bg-[#2563EB] text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`}
        aria-pressed={lang === "ar"}
      >
        عربي
      </button>
    </div>
  );
}
