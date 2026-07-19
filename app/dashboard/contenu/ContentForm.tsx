"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Type,
  Save,
  RotateCcw,
  ChevronRight,
  Globe,
  Languages,
  Sparkles,
  ShoppingBag,
  Image,
  FolderTree,
  Info,
} from "lucide-react";
import { updateSiteContent } from "@/app/actions/content";

interface ContentItem {
  key: string;
  label: string;
  section: string;
  longText: boolean;
  value_fr: string | null;
  value_ar: string | null;
}

interface SectionMeta {
  id: string;
  label: string;
  description: string;
}

interface ContentFormProps {
  items: ContentItem[];
  sections: SectionMeta[];
}

const sectionIcons: Record<string, typeof Type> = {
  hero: Sparkles,
  collection: Image,
  categories: FolderTree,
  about: Info,
  products: ShoppingBag,
};

export function ContentForm({ items, sections }: ContentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "hero");
  const [values, setValues] = useState<Record<string, { fr: string; ar: string }>>(() => {
    const init: Record<string, { fr: string; ar: string }> = {};
    for (const item of items) {
      init[item.key] = { fr: item.value_fr ?? "", ar: item.value_ar ?? "" };
    }
    return init;
  });

  const initialValues = useMemo(() => {
    const init: Record<string, { fr: string; ar: string }> = {};
    for (const item of items) {
      init[item.key] = { fr: item.value_fr ?? "", ar: item.value_ar ?? "" };
    }
    return init;
  }, [items]);

  const hasChanges = useMemo(() => {
    return Object.keys(values).some(
      (k) => values[k].fr !== initialValues[k]?.fr || values[k].ar !== initialValues[k]?.ar
    );
  }, [values, initialValues]);

  const changedCount = useMemo(() => {
    return Object.keys(values).filter(
      (k) => values[k].fr !== initialValues[k]?.fr || values[k].ar !== initialValues[k]?.ar
    ).length;
  }, [values, initialValues]);

  const bySection = useMemo(() => {
    return items.reduce<Record<string, ContentItem[]>>((acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    }, {});
  }, [items]);

  function handleReset() {
    setValues({ ...initialValues });
    toast.info("Modifications annulées.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const updates = Object.entries(values).map(([key, v]) => ({
      key,
      value_fr: v.fr.trim() || null,
      value_ar: v.ar.trim() || null,
    }));
    const result = await updateSiteContent(updates);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Contenu enregistré avec succès.");
    router.refresh();
  }

  const activeMeta = sections.find((s) => s.id === activeSection);
  const ActiveIcon = sectionIcons[activeSection] ?? Type;

  return (
    <div className="flex flex-col gap-8 p-4 lg:p-8">
      {/* Page header */}
      <header className="mb-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--dash-text-main)]">
              Contenu du site
            </h2>
            <p className="mt-1 text-sm text-[var(--dash-text-muted)]">
              Modifiez les textes affichés sur votre site. Laissez un champ vide pour utiliser la valeur par défaut.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-[var(--dash-text-muted)] bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Annuler
              </button>
            )}
            <button
              type="submit"
              form="content-form"
              disabled={loading || !hasChanges}
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--dash-primary)] rounded-lg hover:bg-[var(--dash-primary-hover)] shadow-lg shadow-[var(--dash-primary)]/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? "Enregistrement…" : hasChanges ? `Enregistrer (${changedCount})` : "Enregistrer"}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Section navigation — desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 sticky top-8 h-[calc(100vh-6rem)]">
          <nav className="space-y-1" aria-label="Sections du contenu">
            {sections.map((sec) => {
              const Icon = sectionIcons[sec.id] ?? Type;
              const sectionHasChanges = (bySection[sec.id] ?? []).some(
                (item) =>
                  values[item.key]?.fr !== initialValues[item.key]?.fr ||
                  values[item.key]?.ar !== initialValues[item.key]?.ar
              );
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-3 px-4 py-3 w-full text-left font-medium rounded-lg border-l-4 transition-all ${
                    activeSection === sec.id
                      ? "bg-[var(--dash-primary)]/10 text-[var(--dash-primary)] border-[var(--dash-primary)]"
                      : "text-[var(--dash-text-muted)] hover:text-[var(--dash-primary)] hover:bg-[var(--dash-surface)] border-transparent"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1">{sec.label}</span>
                  {sectionHasChanges && (
                    <span className="w-2 h-2 rounded-full bg-[var(--dash-primary)] flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Language legend */}
          <div className="mt-8 p-4 rounded-lg bg-gray-50 border border-[var(--dash-border)]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--dash-text-muted)] mb-3">
              Langues
            </p>
            <div className="space-y-2 text-xs text-[var(--dash-text-muted)]">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" />
                <span>FR — Français</span>
              </div>
              <div className="flex items-center gap-2">
                <Languages className="w-3.5 h-3.5" />
                <span>AR — العربية</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile section tabs */}
        <div className="flex lg:hidden gap-1 overflow-x-auto pb-2">
          {sections.map((sec) => {
            const Icon = sectionIcons[sec.id] ?? Type;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSection === sec.id
                    ? "bg-[var(--dash-primary)]/10 text-[var(--dash-primary)]"
                    : "text-[var(--dash-text-muted)] hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Content area */}
        <main className="flex-1 min-w-0">
          <form id="content-form" onSubmit={handleSubmit}>
            <div className="rounded-xl border border-[var(--dash-border)] overflow-hidden shadow-sm bg-[var(--dash-surface)]">
              {/* Section header */}
              <div className="flex items-center gap-3 px-6 lg:px-8 py-5 border-b border-[var(--dash-border)] bg-gray-50/50">
                <div className="p-2 bg-[var(--dash-primary)]/10 rounded-lg text-[var(--dash-primary)]">
                  <ActiveIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[var(--dash-text-main)]">
                    {activeMeta?.label ?? "Section"}
                  </h3>
                  <p className="text-xs text-[var(--dash-text-muted)]">
                    {activeMeta?.description}
                  </p>
                </div>
                <span className="text-xs text-[var(--dash-text-muted)] tabular-nums">
                  {(bySection[activeSection] ?? []).length} champ{(bySection[activeSection] ?? []).length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Fields */}
              <div className="divide-y divide-[var(--dash-border)]">
                {(bySection[activeSection] ?? []).map((item) => {
                  const isModified =
                    values[item.key]?.fr !== initialValues[item.key]?.fr ||
                    values[item.key]?.ar !== initialValues[item.key]?.ar;
                  return (
                    <div key={item.key} className="px-6 lg:px-8 py-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-[var(--dash-text-main)]">
                              {item.label}
                            </label>
                            {isModified && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                Modifié
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[var(--dash-text-muted)] mt-0.5 font-mono">
                            {item.key}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* French */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Globe className="w-3.5 h-3.5 text-[var(--dash-text-muted)]" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--dash-text-muted)]">
                              Français
                            </span>
                          </div>
                          {item.longText ? (
                            <textarea
                              rows={3}
                              value={values[item.key]?.fr ?? ""}
                              onChange={(e) =>
                                setValues((prev) => ({
                                  ...prev,
                                  [item.key]: { ...prev[item.key], fr: e.target.value },
                                }))
                              }
                              placeholder="Vide = valeur par défaut"
                              className="w-full px-3 py-2.5 rounded-lg border border-[var(--dash-border)] bg-gray-50 text-[var(--dash-text-main)] text-sm placeholder:text-gray-400 focus:border-[var(--dash-primary)] focus:ring-1 focus:ring-[var(--dash-primary)] outline-none resize-none transition-colors"
                            />
                          ) : (
                            <input
                              type="text"
                              value={values[item.key]?.fr ?? ""}
                              onChange={(e) =>
                                setValues((prev) => ({
                                  ...prev,
                                  [item.key]: { ...prev[item.key], fr: e.target.value },
                                }))
                              }
                              placeholder="Vide = valeur par défaut"
                              className="w-full px-3 py-2.5 rounded-lg border border-[var(--dash-border)] bg-gray-50 text-[var(--dash-text-main)] text-sm placeholder:text-gray-400 focus:border-[var(--dash-primary)] focus:ring-1 focus:ring-[var(--dash-primary)] outline-none transition-colors"
                            />
                          )}
                        </div>

                        {/* Arabic */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Languages className="w-3.5 h-3.5 text-[var(--dash-text-muted)]" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--dash-text-muted)]">
                              العربية
                            </span>
                          </div>
                          {item.longText ? (
                            <textarea
                              rows={3}
                              dir="rtl"
                              value={values[item.key]?.ar ?? ""}
                              onChange={(e) =>
                                setValues((prev) => ({
                                  ...prev,
                                  [item.key]: { ...prev[item.key], ar: e.target.value },
                                }))
                              }
                              placeholder="فارغ = القيمة الافتراضية"
                              className="w-full px-3 py-2.5 rounded-lg border border-[var(--dash-border)] bg-gray-50 text-[var(--dash-text-main)] text-sm placeholder:text-gray-400 focus:border-[var(--dash-primary)] focus:ring-1 focus:ring-[var(--dash-primary)] outline-none resize-none transition-colors"
                            />
                          ) : (
                            <input
                              type="text"
                              dir="rtl"
                              value={values[item.key]?.ar ?? ""}
                              onChange={(e) =>
                                setValues((prev) => ({
                                  ...prev,
                                  [item.key]: { ...prev[item.key], ar: e.target.value },
                                }))
                              }
                              placeholder="فارغ = القيمة الافتراضية"
                              className="w-full px-3 py-2.5 rounded-lg border border-[var(--dash-border)] bg-gray-50 text-[var(--dash-text-main)] text-sm placeholder:text-gray-400 focus:border-[var(--dash-primary)] focus:ring-1 focus:ring-[var(--dash-primary)] outline-none transition-colors"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Section footer with navigation */}
              <div className="flex items-center justify-between px-6 lg:px-8 py-4 border-t border-[var(--dash-border)] bg-gray-50/50">
                <p className="text-xs text-[var(--dash-text-muted)]">
                  {hasChanges
                    ? `${changedCount} modification${changedCount > 1 ? "s" : ""} en attente`
                    : "Aucune modification"}
                </p>
                {(() => {
                  const currentIdx = sections.findIndex((s) => s.id === activeSection);
                  const next = sections[currentIdx + 1];
                  if (!next) return null;
                  return (
                    <button
                      type="button"
                      onClick={() => setActiveSection(next.id)}
                      className="flex items-center gap-1.5 text-sm font-medium text-[var(--dash-primary)] hover:underline"
                    >
                      {next.label}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  );
                })()}
              </div>
            </div>
          </form>
        </main>
      </div>

      {/* Mobile sticky save bar */}
      {hasChanges && (
        <>
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--dash-surface)] border-t border-[var(--dash-border)] sm:hidden flex gap-3 z-10">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 px-4 py-3 text-sm font-medium text-[var(--dash-text-muted)] border border-[var(--dash-border)] rounded-lg shadow-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              form="content-form"
              disabled={loading}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-[var(--dash-primary)] rounded-lg shadow-lg shadow-[var(--dash-primary)]/25"
            >
              {loading ? "…" : `Enregistrer (${changedCount})`}
            </button>
          </div>
          <div className="h-20 sm:hidden" />
        </>
      )}
    </div>
  );
}
