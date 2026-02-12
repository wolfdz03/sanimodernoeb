"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-2xl text-[#1E293B] dark:text-white">
          {t("dashboard_categories_title")}
        </h1>
        <Link
          href="/dashboard/categories/nouveau"
          className="px-4 py-2 rounded-xl bg-[#13ecec] text-[#102222] font-semibold hover:bg-[#0ea5a5] hover:text-white transition-colors"
        >
          {t("dashboard_categories_add")}
        </Link>
      </div>
      <div className="bg-white dark:bg-[#0d1b1b] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-start">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold text-[#1E293B] dark:text-white">
                {t("dashboard_sort_order")}
              </th>
              <th className="px-6 py-4 font-semibold text-[#1E293B] dark:text-white">
                {t("dashboard_name")}
              </th>
              <th className="px-6 py-4 font-semibold text-[#1E293B] dark:text-white">
                {t("dashboard_slug")}
              </th>
              <th className="px-6 py-4 font-semibold text-[#1E293B] dark:text-white" />
            </tr>
          </thead>
          <tbody>
            {(categories ?? []).map((cat) => (
              <tr
                key={cat.id}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
              >
                <td className="px-6 py-4 text-[#64748B] dark:text-slate-400">
                  {cat.sort_order}
                </td>
                <td className="px-6 py-4 font-medium text-[#1E293B] dark:text-white">
                  {cat.name}
                </td>
                <td className="px-6 py-4 text-[#64748B] dark:text-slate-400">
                  {cat.slug}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/categories/${cat.id}`}
                    className="text-[#13ecec] font-medium hover:underline text-sm"
                  >
                    {t("dashboard_edit")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!categories || categories.length === 0) && (
          <p className="px-6 py-12 text-center text-[#64748B] dark:text-slate-400">
            {t("dashboard_no_categories_page")}{" "}
            <Link
              href="/dashboard/categories/nouveau"
              className="text-[#13ecec] hover:underline"
            >
              {t("dashboard_categories_add")}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
