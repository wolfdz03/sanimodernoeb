"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Search, Edit, Package } from "lucide-react";
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

  const statusBadgeClass = {
    active: "dash-badge dash-badge-emerald",
    low_stock: "dash-badge dash-badge-amber",
    out_of_stock: "dash-badge dash-badge-gray",
  };

  const dotColors = {
    active: "bg-emerald-500",
    low_stock: "bg-amber-500",
    out_of_stock: "bg-gray-400",
  };

  const filterTabs = [
    { key: "all" as FilterType, label: t("dashboard_products_filter_all") },
    { key: "in_stock" as FilterType, label: t("dashboard_products_filter_in_stock") },
    { key: "low_stock" as FilterType, label: t("dashboard_products_filter_low_stock") },
    { key: "out_of_stock" as FilterType, label: t("dashboard_products_filter_out_of_stock") },
  ];

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--dash-text-main)] font-display">
          {t("dashboard_produits_title")}
        </h2>
        <Link
          href="/dashboard/produits/nouveau"
          className="dash-btn dash-btn-primary"
        >
          <Plus className="w-4 h-4" />
          {t("dashboard_produits_add")}
        </Link>
      </div>

      {/* Filters + Search + Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-1 bg-gray-100/80 rounded-lg p-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium whitespace-nowrap ${filter === tab.key
                  ? "bg-white text-[var(--dash-text-main)] shadow-sm"
                  : "text-[var(--dash-text-muted)] hover:text-[var(--dash-text-main)]"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dash-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="dash-input pl-9 text-[13px] h-9"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="dash-input dash-select text-[13px] h-9 w-auto"
          >
            <option value="newest">{t("dashboard_products_sort_newest")}</option>
            <option value="price_desc">{t("dashboard_products_sort_price_desc")}</option>
            <option value="price_asc">{t("dashboard_products_sort_price_asc")}</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 border border-gray-100">
            <Package className="w-7 h-7 text-[var(--dash-text-muted)]" />
          </div>
          <p className="text-[var(--dash-text-muted)] mb-4 text-sm">{t("dashboard_no_produits")}</p>
          <Link
            href="/dashboard/produits/nouveau"
            className="dash-btn dash-btn-primary"
          >
            <Plus className="w-4 h-4" />
            {t("dashboard_no_produits_add")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((product) => {
            const status = getStatus(product);
            return (
              <Link
                key={product.id}
                href={`/dashboard/produits/${product.id}`}
                className={`group dash-card dash-card-interactive overflow-hidden block ${status === "out_of_stock" ? "opacity-70 hover:opacity-100" : ""
                  }`}
              >
                <div className="relative aspect-square bg-gray-50">
                  {getProductPrimaryImage(product) ? (
                    <img
                      src={getProductPrimaryImage(product)!}
                      alt=""
                      className={`w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-150 ${status === "out_of_stock" ? "grayscale" : ""
                        }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--dash-text-muted)]">
                      <Package className="w-10 h-10 text-gray-200" />
                    </div>
                  )}
                  {status === "out_of_stock" && (
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={statusBadgeClass[status]}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1 ${dotColors[status]}`} />
                      {statusLabel(status)}
                    </span>
                  </div>
                  <span className="absolute top-3 right-3 p-2 bg-white rounded-lg text-[var(--dash-text-muted)] opacity-0 group-hover:opacity-100 shadow-sm hover:text-[var(--dash-primary)]">
                    <Edit className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-1.5">
                  {product.categories?.name && (
                    <span className="text-[11px] font-medium text-[var(--dash-text-muted)] uppercase tracking-wide">{product.categories.name}</span>
                  )}
                  <h3 className="font-medium text-[var(--dash-text-main)] text-[13px] truncate leading-snug">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-display font-semibold text-[var(--dash-text-main)] tabular-nums">
                      {product.price_dzd.toLocaleString("fr-DZ")} DZD
                    </span>
                    {status === "out_of_stock" ? (
                      <span className="text-[11px] text-red-500 font-semibold">
                        0 {t("dashboard_products_in_stock")}
                      </span>
                    ) : status === "low_stock" ? (
                      <span className="text-[11px] text-amber-600 font-semibold">
                        {product.stock} {t("dashboard_products_left")}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[var(--dash-text-muted)] font-medium">
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
