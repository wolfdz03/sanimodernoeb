"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  translations,
  type Lang,
  type TranslationKey,
} from "@/lib/translations";

const STORAGE_KEY = "sani-lang";

export type ContentOverrides = Record<string, { value_fr: string | null; value_ar: string | null }>;

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getStoredLang(): Lang {
  if (typeof window === "undefined") return "fr";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "ar" || stored === "fr") return stored;
  return "fr";
}

export function LanguageProvider({
  children,
  contentOverrides = {},
}: {
  children: React.ReactNode;
  contentOverrides?: ContentOverrides;
}) {
  const [lang, setLangState] = useState<Lang>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLangState(getStoredLang());
    setMounted(true);
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang === "ar" ? "ar" : "fr";
      document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = lang === "ar" ? "ar" : "fr";
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang, mounted]);

  const t = useCallback(
    (key: TranslationKey) => {
      const override = contentOverrides[key as string];
      const val = lang === "ar" ? override?.value_ar : override?.value_fr;
      if (val != null && val.trim() !== "") return val;
      return (translations[lang][key] ?? translations.fr[key]) as string;
    },
    [lang, contentOverrides]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
