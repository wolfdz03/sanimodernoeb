"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Plus, FolderTree, Edit2, GripVertical } from "lucide-react";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

interface CategoriesContentProps {
  categories: CategoryRow[] | null;
}

export function CategoriesContent({ categories }: CategoriesContentProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--dash-text-main)]">
            {t("dashboard_categories_title")}
          </h1>
          <p className="text-sm text-[var(--dash-text-muted)] mt-1">
            Organisez vos produits par catégories
          </p>
        </div>
        <Link
          href="/dashboard/categories/nouveau"
          className="dash-btn dash-btn-primary"
        >
          <Plus className="w-4 h-4" />
          {t("dashboard_categories_add")}
        </Link>
      </div>

      <div className="dash-card overflow-hidden">
        <table className="dash-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>{t("dashboard_sort_order")}</th>
              <th>{t("dashboard_name")}</th>
              <th>{t("dashboard_slug")}</th>
              <th style={{ width: 80 }} />
            </tr>
          </thead>
          <tbody>
            {(categories ?? []).map((cat) => (
              <tr key={cat.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-300" />
                    <span className="text-[var(--dash-text-muted)] font-medium tabular-nums">{cat.sort_order}</span>
                  </div>
                </td>
                <td>
                  <span className="font-semibold text-[var(--dash-text-main)]">{cat.name}</span>
                </td>
                <td>
                  <code className="text-[13px] text-[var(--dash-text-muted)] bg-gray-50 px-2 py-0.5 rounded">{cat.slug}</code>
                </td>
                <td>
                  <Link
                    href={`/dashboard/categories/${cat.id}`}
                    className="dash-btn dash-btn-secondary text-xs py-1.5 px-3 text-[var(--dash-primary)] hover:text-[var(--dash-primary-hover)]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    {t("dashboard_edit")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!categories || categories.length === 0) && (
          <div className="px-6 py-16 text-center">
            <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 border border-gray-100">
              <FolderTree className="w-7 h-7 text-[var(--dash-text-muted)]" />
            </div>
            <p className="text-sm text-[var(--dash-text-muted)]">
              {t("dashboard_no_categories_page")}{" "}
              <Link
                href="/dashboard/categories/nouveau"
                className="text-[var(--dash-primary)] hover:underline font-medium"
              >
                {t("dashboard_categories_add")}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
