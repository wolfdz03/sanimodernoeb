"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect, useRef } from "react";
import { SlidersHorizontal, X, Search, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Category } from "@/lib/types/database";
import type { ProductSort } from "@/lib/supabase/queries";

const SEARCH_DEBOUNCE_MS = 400;

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
  const searchFromUrl = searchParams.get("search") ?? "";
  const sort = (searchParams.get("sort") as ProductSort) ?? "newest";
  const minPrice = searchParams.get("min_price") ?? "";
  const maxPrice = searchParams.get("max_price") ?? "";
  const inStock = searchParams.get("in_stock") === "1";

  const [searchInput, setSearchInput] = useState(searchFromUrl);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    setSearchInput(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const q = searchInput.trim();
      if (q !== searchFromUrl) {
        router.push(`/produits?${buildParams({ search: q || undefined })}`);
      }
      debounceRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput, searchFromUrl, buildParams, router]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as ProductSort;
    router.push(`/produits?${buildParams({ sort: val === "newest" ? undefined : val })}`);
  };

  const setCategory = (slug: string) => {
    router.push(`/produits?${buildParams({ categorie: slug || undefined })}`);
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

  const hasActiveFilters = categorie || searchFromUrl || minPrice || maxPrice || inStock;

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (q !== searchFromUrl) {
      router.push(`/produits?${buildParams({ search: q || undefined })}`);
    }
  };

  return (
    <div className="mb-8 flex flex-col gap-6">
      {/* Top Search & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors" />
          </div>
          <input
            name="search"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("products_search_placeholder")}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all text-sm font-medium shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
            aria-label="Rechercher"
          />
        </form>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={sort}
              onChange={handleSortChange}
              className="appearance-none pl-4 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition text-sm font-medium shadow-sm hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey as "products_sort_newest")}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm font-medium transition-all shadow-sm ${(minPrice || maxPrice || inStock)
                ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)] hover:bg-[var(--primary)]/10"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white hover:border-slate-300 dark:hover:border-slate-700"
                }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t("products_filter_apply")}
              {(minPrice || maxPrice || inStock) && (
                <span className="flex h-2 w-2 relative ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
                </span>
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
                  className="absolute top-full right-0 mt-3 z-50 w-[320px] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1b1b] shadow-2xl space-y-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-lg text-[#1E293B] dark:text-white">
                      Filtres avancés
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                        {t("products_filter_price_range")} (DA)
                      </label>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <input
                            name="min_price"
                            type="number"
                            min={0}
                            step={500}
                            placeholder="Min"
                            defaultValue={minPrice}
                            className="w-full pl-3 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#102222] text-[#1E293B] dark:text-white placeholder:text-slate-400 focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all text-sm"
                          />
                        </div>
                        <div className="flex items-center justify-center text-slate-400">-</div>
                        <div className="relative flex-1">
                          <input
                            name="max_price"
                            type="number"
                            min={0}
                            step={500}
                            placeholder="Max"
                            defaultValue={maxPrice}
                            className="w-full pl-3 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#102222] text-[#1E293B] dark:text-white placeholder:text-slate-400 focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="group flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-colors">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {t("products_filter_in_stock")}
                        </span>
                        <div className="relative flex items-center">
                          <input
                            name="in_stock"
                            type="checkbox"
                            defaultChecked={inStock}
                            className="peer sr-only"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-[var(--primary)]"></div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                    >
                      {t("products_filter_reset")}
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] px-4 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] hover:shadow-lg hover:shadow-[var(--primary)]/20 transition-all text-sm"
                    >
                      Voir les résultats
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
        <button
          onClick={() => setCategory("")}
          className={`shrink-0 h-10 px-5 rounded-full text-sm font-medium transition-all ${categorie === ""
            ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
            : "bg-white dark:bg-[#102222] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
        >
          {t("products_filter_all_categories")}
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.slug)}
            className={`shrink-0 flex items-center gap-2 h-10 px-5 rounded-full text-sm font-medium transition-all ${categorie === c.slug
              ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
              : "bg-white dark:bg-[#102222] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
          >
            {categorie === c.slug && <Check className="w-3.5 h-3.5" />}
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
