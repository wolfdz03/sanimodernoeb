"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Category } from "@/lib/types/database";
import type { ProductSort } from "@/lib/supabase/queries";

interface ProductsFiltersProps {
  categories: Category[];
}

const SORT_OPTIONS: { value: ProductSort; labelKey: string }[] = [
  { value: "newest", labelKey: "products_sort_newest" },
  { value: "oldest", labelKey: "products_sort_oldest" },
  { value: "price_asc", labelKey: "products_sort_price_asc" },
  { value: "price_desc", labelKey: "products_sort_price_desc" },
  { value: "name_asc", labelKey: "products_sort_name_asc" },
  { value: "name_desc", labelKey: "products_sort_name_desc" },
];

export function ProductsFilters({ categories }: ProductsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);

  const categorie = searchParams.get("categorie") ?? "";
  const sort = (searchParams.get("sort") as ProductSort) ?? "newest";
  const minPrice = searchParams.get("min_price") ?? "";
  const maxPrice = searchParams.get("max_price") ?? "";
  const inStock = searchParams.get("in_stock") === "1";

  const buildParams = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, val] of Object.entries(overrides)) {
        if (val === undefined || val === "") {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      }
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as ProductSort;
    router.push(`/produits?${buildParams({ sort: val === "newest" ? undefined : val })}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    router.push(`/produits?${buildParams({ categorie: val || undefined })}`);
  };

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const min = (form.elements.namedItem("min_price") as HTMLInputElement).value.trim();
    const max = (form.elements.namedItem("max_price") as HTMLInputElement).value.trim();
    const stock = (form.elements.namedItem("in_stock") as HTMLInputElement).checked;
    const params: Record<string, string | undefined> = {};
    if (min) params.min_price = min;
    if (max) params.max_price = max;
    params.in_stock = stock ? "1" : undefined;
    router.push(`/produits?${buildParams(params)}`);
    setShowFilters(false);
  };

  const handleReset = () => {
    router.push("/produits");
    setShowFilters(false);
  };

  const hasActiveFilters = categorie || minPrice || maxPrice || inStock;

  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={sort}
          onChange={handleSortChange}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[var(--primary)] outline-none transition text-sm font-medium"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey as "products_sort_newest")}
            </option>
          ))}
        </select>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
              hasActiveFilters
                ? "border-[var(--primary)] bg-[var(--primary-subtle)] text-[var(--primary)]"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white hover:border-slate-300"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t("products_filter_apply")}
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            )}
          </button>

          {showFilters && (
            <>
              <div
                className="fixed inset-0 z-40"
                aria-hidden
                onClick={() => setShowFilters(false)}
              />
              <form
                onSubmit={handleFilterSubmit}
                className="absolute top-full left-0 mt-2 z-50 w-72 sm:w-80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0d1b1b] shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1E293B] dark:text-white">
                    {t("products_filter_apply")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="p-1 text-slate-500 hover:text-slate-700 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    {t("products_filter_category")}
                  </label>
                  <select
                    value={categorie}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[var(--primary)] outline-none"
                  >
                    <option value="">{t("products_filter_all_categories")}</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    {t("products_filter_price_range")}
                  </label>
                  <div className="flex gap-2">
                    <input
                      name="min_price"
                      type="number"
                      min={0}
                      step={1000}
                      placeholder="Min"
                      defaultValue={minPrice}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] outline-none"
                    />
                    <input
                      name="max_price"
                      type="number"
                      min={0}
                      step={1000}
                      placeholder="Max"
                      defaultValue={maxPrice}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] outline-none"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    name="in_stock"
                    type="checkbox"
                    defaultChecked={inStock}
                    className="w-4 h-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {t("products_filter_in_stock")}
                  </span>
                </label>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-hover)] transition"
                  >
                    {t("products_filter_apply")}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    {t("products_filter_reset")}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
