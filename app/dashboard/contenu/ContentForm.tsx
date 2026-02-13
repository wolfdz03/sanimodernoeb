"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateSiteContent } from "@/app/actions/content";
import { useLanguage } from "@/context/LanguageContext";

interface ContentItem {
  key: string;
  label: string;
  section: string;
  value_fr: string | null;
  value_ar: string | null;
}

interface ContentFormProps {
  items: ContentItem[];
}

export function ContentForm({ items }: ContentFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [values, setValues] = useState<Record<string, { fr: string; ar: string }>>(() => {
    const init: Record<string, { fr: string; ar: string }> = {};
    for (const item of items) {
      init[item.key] = { fr: item.value_fr ?? "", ar: item.value_ar ?? "" };
    }
    return init;
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    const updates = Object.entries(values).map(([key, v]) => ({
      key,
      value_fr: v.fr.trim() || null,
      value_ar: v.ar.trim() || null,
    }));
    const result = await updateSiteContent(updates);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      toast.error(result.error);
      return;
    }
    setSuccess(true);
    toast.success("Contenu enregistré.");
    router.refresh();
    setTimeout(() => setSuccess(false), 3000);
  }

  const bySection = items.reduce<Record<string, ContentItem[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && (
        <p className="text-sm text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-300 p-3 rounded-xl">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
          Contenu enregistré.
        </p>
      )}

      {Object.entries(bySection).map(([section, sectionItems]) => (
        <div
          key={section}
          className="bg-white dark:bg-[#0d1b1b] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
            <h2 className="font-semibold text-[#1E293B] dark:text-white">{section}</h2>
          </div>
          <div className="p-6 space-y-4">
            {sectionItems.map((item) => (
              <div key={item.key}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {item.label} ({item.key})
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-600 dark:text-slate-400 mb-0.5 block">Français</span>
                    <input
                      type="text"
                      value={values[item.key]?.fr ?? ""}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [item.key]: { ...prev[item.key], fr: e.target.value, ar: prev[item.key]?.ar ?? "" },
                        }))
                      }
                      placeholder="Vide = valeur par défaut"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white placeholder:text-[var(--text-muted)] focus:border-[#13ecec] outline-none transition"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-slate-600 dark:text-slate-400 mb-0.5 block">العربية</span>
                    <input
                      type="text"
                      value={values[item.key]?.ar ?? ""}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [item.key]: { fr: prev[item.key]?.fr ?? "", ar: e.target.value },
                        }))
                      }
                      placeholder="فارغ = القيمة الافتراضية"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white placeholder:text-[var(--text-muted)] focus:border-[#13ecec] outline-none transition"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-xl bg-[#13ecec] text-[#102222] font-semibold hover:bg-[#0ea5a5] hover:text-white transition-colors disabled:opacity-50"
      >
        {loading ? "…" : "Enregistrer le contenu"}
      </button>
    </form>
  );
}
