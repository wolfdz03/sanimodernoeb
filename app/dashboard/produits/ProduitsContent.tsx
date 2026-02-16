"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Search, Edit } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getProductPrimaryImage } from "@/lib/product-images";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price_dzd: number;
  price_old_dzd?: number | null;
  image_url: string | null;
  image_urls?: string[] | null;
  stock: number;
  categories: { name?: string } | null;
}

type FilterType = "all" | "in_stock" | "low_stock" | "out_of_stock";
type SortType = "newest" | "price_desc" | "price_asc";

interface ProduitsContentProps {
  products: ProductRow[] | null;
}

function getStatus(product: ProductRow): "active" | "low_stock" | "out_of_stock" {
  if (product.stock === 0) return "out_of_stock";
  if (product.stock <= 5) return "low_stock";
  return "active";
}

export function ProduitsContent({ products }: ProduitsContentProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [search, setSearch] = useState("");

  const filtered = (products ?? [])
    .filter((p) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q)) return false;
      }
      const status = getStatus(p);
      if (filter === "all") return true;
      if (filter === "in_stock") return status === "active";
      if (filter === "low_stock") return status === "low_stock";
      if (filter === "out_of_stock") return status === "out_of_stock";
      return true;
    })
    .sort((a, b) => {
      if (sort === "newest") return 0;
      if (sort === "price_desc") return b.price_dzd - a.price_dzd;
      if (sort === "price_asc") return a.price_dzd - b.price_dzd;
      return 0;
    });

  const statusLabel = (status: "active" | "low_stock" | "out_of_stock") => {
    switch (status) {
      case "active":
        return t("dashboard_products_status_active");
      case "low_stock":
        return t("dashboard_products_filter_low_stock");
      case "out_of_stock":
        return t("dashboard_products_filter_out_of_stock");
    }
  };

  const statusStyles = {
    active: "bg-white/90 text-[var(--dash-primary)] border-black/5",
    low_stock: "bg-white/90 text-orange-600 border-black/5",
    out_of_stock: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const dotColors = {
    active: "bg-[var(--dash-primary)]",
    low_stock: "bg-orange-500",
    out_of_stock: "bg-gray-400",
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--dash-text-main)] font-display">
          {t("dashboard_produits_title")}
        </h2>
        <Link
          href="/dashboard/produits/nouveau"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--dash-primary)] hover:bg-[var(--dash-primary-hover)] text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--dash-primary)]"
        >
          <Plus className="w-5 h-5" />
          {t("dashboard_produits_add")}
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2 pb-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === "all"
              ? "bg-[var(--dash-text-main)] text-white"
              : "bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-muted)] hover:border-gray-300 hover:text-[var(--dash-text-main)]"
          }`}
        >
          {t("dashboard_products_filter_all")}
        </button>
        <button
          type="button"
          onClick={() => setFilter("in_stock")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === "in_stock"
              ? "bg-[var(--dash-text-main)] text-white"
              : "bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-muted)] hover:border-gray-300 hover:text-[var(--dash-text-main)]"
          }`}
        >
          {t("dashboard_products_filter_in_stock")}
        </button>
        <button
          type="button"
          onClick={() => setFilter("low_stock")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === "low_stock"
              ? "bg-[var(--dash-text-main)] text-white"
              : "bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-muted)] hover:border-gray-300 hover:text-[var(--dash-text-main)]"
          }`}
        >
          {t("dashboard_products_filter_low_stock")}
        </button>
        <button
          type="button"
          onClick={() => setFilter("out_of_stock")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === "out_of_stock"
              ? "bg-[var(--dash-text-main)] text-white"
              : "bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-muted)] hover:border-gray-300 hover:text-[var(--dash-text-main)]"
          }`}
        >
          {t("dashboard_products_filter_out_of_stock")}
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-[var(--dash-text-muted)]">
            {t("dashboard_products_sort_by")}:
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="text-xs border-none bg-transparent font-medium text-[var(--dash-text-main)] focus:ring-0 p-0 pr-6 cursor-pointer"
          >
            <option value="newest">{t("dashboard_products_sort_newest")}</option>
            <option value="price_desc">{t("dashboard_products_sort_price_desc")}</option>
            <option value="price_asc">{t("dashboard_products_sort_price_asc")}</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[var(--dash-text-muted)] mb-4">{t("dashboard_no_produits")}</p>
          <Link
            href="/dashboard/produits/nouveau"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--dash-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--dash-primary-hover)] transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t("dashboard_no_produits_add")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const status = getStatus(product);
            return (
              <Link
                key={product.id}
                href={`/dashboard/produits/${product.id}`}
                className={`group bg-[var(--dash-surface)] rounded-lg border border-[var(--dash-border)] overflow-hidden hover:border-gray-400 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer block ${
                  status === "out_of_stock" ? "opacity-75 hover:opacity-100" : ""
                }`}
              >
                <div className="relative aspect-square bg-gray-100">
                  {getProductPrimaryImage(product) ? (
                    <img
                      src={getProductPrimaryImage(product)!}
                      alt=""
                      className={`w-full h-full object-cover ${
                        status === "out_of_stock" ? "grayscale" : ""
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--dash-text-muted)] text-4xl">
                      —
                    </div>
                  )}
                  {status === "out_of_stock" && (
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
                  )}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm border shadow-sm ${
                        status === "out_of_stock"
                          ? "bg-gray-100 text-gray-600 border-gray-200"
                          : statusStyles[status]
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColors[status]}`}
                      />
                      {statusLabel(status)}
                    </span>
                  </div>
                  <span className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-md text-[var(--dash-text-main)] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-[var(--dash-primary)]">
                    <Edit className="w-4 h-4" />
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-1">
                  <h3 className="font-medium text-[var(--dash-text-main)] text-sm truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-display font-semibold text-[var(--dash-text-main)]">
                      {product.price_dzd.toLocaleString("fr-DZ")} DZD
                    </span>
                    {status === "out_of_stock" ? (
                      <span className="text-xs text-red-500 font-medium">
                        0 {t("dashboard_products_in_stock")}
                      </span>
                    ) : status === "low_stock" ? (
                      <span className="text-xs text-orange-600 font-medium">
                        {product.stock} {t("dashboard_products_left")}
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--dash-text-muted)]">
                        {product.stock} {t("dashboard_products_in_stock")}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
