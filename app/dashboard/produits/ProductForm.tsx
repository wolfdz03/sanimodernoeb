"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { uploadProductImage } from "@/app/actions/upload";
import { getProductImageUrls } from "@/lib/product-images";
import { X, Plus, ChevronUp, ChevronDown, Check, Upload } from "lucide-react";
import {
  saveProductOptionTypes,
  saveProductVariants,
  saveProductAttributes,
  type OptionTypeInput,
  type VariantInput,
  type AttributeInput,
} from "@/app/actions/variants";

function getVariantSignature(options: { typeName: string; value: string }[] | undefined): string {
  if (!options?.length) return "";
  return [...options]
    .sort((a, b) => a.typeName.localeCompare(b.typeName) || a.value.localeCompare(b.value))
    .map((o) => `${o.typeName}:${o.value}`)
    .join("|");
}

function generateAllCombinations(
  optionTypes: OptionTypeInput[]
): { typeName: string; value: string }[][] {
  const typesWithValues = optionTypes
    .filter((t) => t.name?.trim())
    .map((t) => ({
      name: t.name.trim(),
      values: (t.values ?? []).filter((v) => v.value?.trim()).map((v) => v.value),
    }))
    .filter((t) => t.values.length > 0);
  if (typesWithValues.length === 0) return [];
  let result: { typeName: string; value: string }[][] = [[]];
  for (const t of typesWithValues) {
    const next: { typeName: string; value: string }[][] = [];
    for (const combo of result) {
      for (const val of t.values) {
        next.push([...combo, { typeName: t.name, value: val }]);
      }
    }
    result = next;
  }
  return result;
}

function formatVariantLabel(options: { typeName: string; value: string }[] | undefined): string {
  if (!options?.length) return "—";
  return options
    .sort((a, b) => a.typeName.localeCompare(b.typeName))
    .map((o) => `${o.typeName} ${o.value}`)
    .join(", ");
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductOptionValue {
  id?: string;
  value: string;
  sort_order: number;
}

interface ProductOptionType {
  id?: string;
  name: string;
  sort_order: number;
  product_option_values?: { id: string; value: string; sort_order: number }[];
}

interface ProductVariant {
  id?: string;
  sku: string | null;
  price_dzd: number | null;
  stock: number;
  product_variant_options?: {
    product_option_values?: { value: string; product_option_types?: { name: string } };
  }[];
}

interface ProductAttribute {
  id?: string;
  name: string;
  value: string;
  sort_order: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  category_sequence?: number | null;
  category_id: string | null;
  description: string | null;
  price_dzd: number;
  price_old_dzd?: number | null;
  image_url: string | null;
  image_urls?: string[] | null;
  badge: string | null;
  badge_color: string | null;
  stock: number;
  product_option_types?: ProductOptionType[];
  product_variants?: ProductVariant[];
  product_attributes?: ProductAttribute[];
}

interface ProductFormProps {
  categories: Category[];
  action: (formData: {
    name: string;
    category_id: string | null;
    description: string | null;
    price_dzd: number;
    price_old_dzd: number | null;
    image_urls: string[];
    badge: string | null;
    badge_color: string | null;
    stock: number;
  }) => Promise<{ error?: string; productId?: string }>;
  product: Product | null;
  deleteAction?: () => Promise<{ error?: string }>;
}

const OPTION_NAMES = ["Size", "Taille", "Color", "Couleur", "Material", "Matériau"];

export function ProductForm({
  categories,
  action,
  product,
  deleteAction,
}: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "variants" | "specs">("variants");
  const [imageUrls, setImageUrls] = useState<string[]>(() =>
    product ? getProductImageUrls(product) : []
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseBadgeHex = (v: string | null | undefined): string => {
    if (!v?.trim()) return "#059669";
    const m = v.trim().match(/bg-\[#([0-9A-Fa-f]{6})\]/) ?? v.trim().match(/#([0-9A-Fa-f]{6})/);
    return m ? `#${m[1]}` : v.trim().startsWith("#") ? v.trim() : "#059669";
  };
  const [badgeHex, setBadgeHex] = useState<string>(() =>
    parseBadgeHex(product?.badge_color ?? null)
  );

  const [optionTypes, setOptionTypes] = useState<OptionTypeInput[]>(() => {
    const types = product?.product_option_types ?? [];
    return types.length
      ? types.map((t) => ({
          name: t.name,
          sort_order: t.sort_order ?? 0,
          values: (t.product_option_values ?? []).map((v) => ({
            id: v.id,
            value: v.value,
            sort_order: v.sort_order ?? 0,
          })),
        }))
      : [{ name: "Taille", sort_order: 0, values: [] }];
  });

  const [variants, setVariants] = useState<VariantInput[]>(() => {
    const vs = product?.product_variants ?? [];
    return vs.length
      ? vs.map((v) => ({
          id: v.id,
          sku: v.sku ?? null,
          price_dzd: v.price_dzd != null ? Number(v.price_dzd) : null,
          stock: v.stock ?? 0,
          options: (v.product_variant_options ?? []).map((o) => ({
            typeName: o.product_option_values?.product_option_types?.name ?? "",
            value: o.product_option_values?.value ?? "",
          })),
        }))
      : [];
  });

  const [attributes, setAttributes] = useState<AttributeInput[]>(() => {
    const attrs = product?.product_attributes ?? [];
    return (attrs.length ? attrs : [{ name: "", value: "", sort_order: 0 }]).map((a, i) => ({
      id: a.id,
      name: a.name,
      value: a.value,
      sort_order: a.sort_order ?? i,
    }));
  });

  const [newOptionValueByIndex, setNewOptionValueByIndex] = useState<Record<number, string>>({});

  const [priceDzd, setPriceDzd] = useState<number>(product?.price_dzd ?? 0);
  const [description, setDescription] = useState<string>(product?.description ?? "");
  const [status, setStatus] = useState<"active" | "draft">("active");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const signatures = variants.map((v) => getVariantSignature(v.options));
    const seen = new Set<string>();
    for (const sig of signatures) {
      if (!sig) continue;
      if (seen.has(sig)) {
        setError("Deux variantes ont la même combinaison.");
        return;
      }
      seen.add(sig);
    }
    setLoading(true);
    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      category_id:
        (form.elements.namedItem("category_id") as HTMLSelectElement).value || null,
      description: description || null,
      price_dzd: priceDzd,
      price_old_dzd: (() => {
        const v = (form.elements.namedItem("price_old_dzd") as HTMLInputElement)?.value;
        return v !== "" && v != null ? Number(v) : null;
      })(),
      image_urls: imageUrls,
      badge: (form.elements.namedItem("badge") as HTMLInputElement).value || null,
      badge_color: badgeHex ? `bg-[${badgeHex}]` : null,
      stock: Number((form.elements.namedItem("stock") as HTMLInputElement).value) || 0,
    };
    const result = await action(formData);
    if (result.error) {
      setLoading(false);
      setError(result.error);
      return;
    }
    const productId = result.productId ?? product?.id;
    if (productId) {
      const otFiltered = optionTypes.filter((t) => t.name?.trim());
      await saveProductOptionTypes(productId, otFiltered);
      await saveProductVariants(productId, variants);
      const attrsFiltered = attributes.filter((a) => a.name?.trim());
      await saveProductAttributes(productId, attrsFiltered);
    }
    setLoading(false);
    router.push("/dashboard/produits");
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteAction || !confirm("Supprimer ce produit ?")) return;
    setLoading(true);
    const result = await deleteAction();
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/dashboard/produits");
    router.refresh();
  }

  const inputBase =
    "rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface)] text-sm text-[var(--dash-text-main)] focus:border-[var(--dash-primary)] focus:ring-1 focus:ring-[var(--dash-primary)] py-2 px-2";
  const labelBase = "block text-xs font-semibold uppercase tracking-wider text-[var(--dash-text-muted)] mb-1.5";

  const typesWithValues = optionTypes.filter((t) => t.name?.trim()).map((t) => ({
    ...t,
    values: (t.values ?? []).filter((v) => v.value?.trim()),
  }));
  const canGenerate =
    typesWithValues.length > 0 && typesWithValues.every((t) => t.values.length > 0);
  const combos = canGenerate ? generateAllCombinations(optionTypes) : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl text-[var(--dash-text-main)]">
            Product Editor
          </h1>
          <p className="text-[var(--dash-text-muted)] text-sm mt-1">
            Gérer les détails, le prix et les variantes du produit.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/produits"
            className="px-4 py-2 bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-main)] text-sm font-medium rounded-md hover:bg-[var(--dash-bg-light)] transition-colors shadow-sm"
          >
            Annuler
          </Link>
          {deleteAction && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Supprimer
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[var(--dash-primary)] text-white text-sm font-bold rounded-md hover:bg-[var(--dash-primary-hover)] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            {loading ? "Enregistrement…" : "Publier"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-[var(--dash-destructive)] bg-red-50 p-3 rounded-md border border-red-100">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Main Product Info Card */}
          <div className="bg-[var(--dash-surface)] rounded-md border border-[var(--dash-border)] p-6 shadow-[var(--dash-shadow-subtle)]">
            <div className="mb-6">
              <label htmlFor="product-name" className="sr-only">
                Nom du produit
              </label>
              <input
                id="product-name"
                name="name"
                type="text"
                required
                defaultValue={product?.name}
                placeholder="Ex. T-shirt à manches courtes"
                className="w-full font-display font-semibold text-3xl placeholder-gray-300 border-0 border-b border-[var(--dash-border)] px-0 py-2 focus:ring-0 focus:border-[var(--dash-primary)] bg-transparent transition-colors"
              />
            </div>

            {/* Tabs */}
            <div className="border-b border-[var(--dash-border)] mb-6">
              <nav aria-label="Tabs" className="flex gap-6 -mb-px">
                <button
                  type="button"
                  onClick={() => setActiveTab("general")}
                  className={`border-b-2 py-2 text-sm font-medium transition-colors ${
                    activeTab === "general"
                      ? "border-[var(--dash-primary)] text-[var(--dash-primary)]"
                      : "border-transparent text-[var(--dash-text-muted)] hover:text-[var(--dash-text-main)] hover:border-gray-300"
                  }`}
                >
                  Général
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("variants")}
                  className={`border-b-2 py-2 text-sm font-medium transition-colors ${
                    activeTab === "variants"
                      ? "border-[var(--dash-primary)] text-[var(--dash-primary)]"
                      : "border-transparent text-[var(--dash-text-muted)] hover:text-[var(--dash-text-main)] hover:border-gray-300"
                  }`}
                >
                  Variantes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("specs")}
                  className={`border-b-2 py-2 text-sm font-medium transition-colors ${
                    activeTab === "specs"
                      ? "border-[var(--dash-primary)] text-[var(--dash-primary)]"
                      : "border-transparent text-[var(--dash-text-muted)] hover:text-[var(--dash-text-main)] hover:border-gray-300"
                  }`}
                >
                  Spécifications
                </button>
              </nav>
            </div>

            {/* Tab Content - all tabs in DOM, hide non-active to preserve form state */}
            <div className={activeTab === "general" ? "space-y-4" : "hidden"}>
                <div>
                  <label className={labelBase}>Lien public</label>
                  <div
                    className={`w-full ${inputBase} bg-[var(--dash-bg-light)] text-[var(--dash-text-muted)]`}
                  >
                    {product?.slug ? (
                      <span className="text-[var(--dash-text-main)] font-mono text-[13px] break-all">
                        /produit/{product.slug}
                      </span>
                    ) : (
                      <span>
                        Généré à l&apos;enregistrement :{" "}
                        <span className="text-[var(--dash-text-main)]">
                          {"{slug-catégorie}-0001-nom-du-produit"}
                        </span>
                      </span>
                    )}
                  </div>
                  {product?.category_sequence != null && (
                    <p className="text-[11px] text-[var(--dash-text-muted)] mt-1">
                      N° dans la catégorie : {String(product.category_sequence).padStart(4, "0")}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelBase}>Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description détaillée du produit..."
                    className={`w-full ${inputBase} resize-none`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelBase}>Prix de base (DZD)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--dash-text-muted)] text-sm">
                        DZD
                      </span>
                      <input
                        name="price_dzd"
                        type="number"
                        required
                        min={0}
                        value={priceDzd}
                        onChange={(e) => setPriceDzd(Number(e.target.value) || 0)}
                        className={`w-full pl-12 ${inputBase}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelBase}>Ancien prix (DZD)</label>
                    <input
                      name="price_old_dzd"
                      type="number"
                      min={0}
                      defaultValue={product?.price_old_dzd ?? ""}
                      placeholder="—"
                      className={`w-full ${inputBase}`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelBase}>Badge</label>
                    <input
                      name="badge"
                      type="text"
                      defaultValue={product?.badge ?? ""}
                      placeholder="Nouveau, Bestseller…"
                      className={`w-full ${inputBase}`}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Couleur du badge</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={badgeHex}
                        onChange={(e) => setBadgeHex(e.target.value)}
                        className="h-10 w-14 cursor-pointer rounded-md border border-[var(--dash-border)] p-0.5"
                      />
                      <input name="badge_color" type="hidden" value={badgeHex ? `bg-[${badgeHex}]` : ""} />
                      <span className="text-sm font-mono text-[var(--dash-text-muted)]">{badgeHex}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelBase}>Stock (produit sans variantes)</label>
                  <input
                    name="stock"
                    type="number"
                    min={0}
                    defaultValue={product?.stock ?? 0}
                    className={`w-full ${inputBase}`}
                  />
                </div>
            </div>

            <div className={activeTab === "variants" ? "space-y-6" : "hidden"}>
                {/* Options */}
                <div className="bg-[var(--dash-bg-light)]/50 rounded-md p-5 border border-[var(--dash-border)] border-dashed">
                  <h3 className="font-display font-medium text-lg mb-4">Options</h3>
                  {optionTypes.map((ot, ti) => (
                    <div key={ti} className="mb-4 last:mb-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                          <label className={labelBase}>Nom de l'option</label>
                          <div className="flex gap-2">
                            <select
                              value={ot.name}
                              onChange={(e) => {
                                const newName = e.target.value;
                                setVariants((prev) =>
                                  prev.map((v) => ({
                                    ...v,
                                    options:
                                      v.options?.map((o) =>
                                        o.typeName === ot.name ? { ...o, typeName: newName } : o
                                      ) ?? [],
                                  }))
                                );
                                setOptionTypes((prev) =>
                                  prev.map((t, i) => (i === ti ? { ...t, name: newName } : t))
                                );
                              }}
                              className={`flex-1 ${inputBase}`}
                            >
                              {OPTION_NAMES.map((n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                            </select>
                            {optionTypes.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (variants.length > 0 && !confirm("Supprimer cette option supprimera toutes les variantes. Continuer ?"))
                                    return;
                                  setOptionTypes((prev) => prev.filter((_, i) => i !== ti));
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                aria-label="Supprimer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className={labelBase}>Valeurs</label>
                          <div className="flex flex-wrap items-center gap-2 p-1.5 w-full rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface)] focus-within:ring-1 focus-within:ring-[var(--dash-primary)] focus-within:border-[var(--dash-primary)] transition-all min-h-[42px]">
                            {(ot.values ?? []).map((val, vi) => (
                              <span
                                key={vi}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-[var(--dash-primary)] border border-[var(--dash-primary)]/20"
                              >
                                {val.value}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOptionTypes((prev) =>
                                      prev.map((t, i) =>
                                        i === ti
                                          ? {
                                              ...t,
                                              values: (t.values ?? []).filter((_, j) => j !== vi),
                                            }
                                          : t
                                      )
                                    )
                                  }
                                  className="ml-1.5 inline-flex items-center justify-center text-[var(--dash-primary)]/60 hover:text-[var(--dash-primary)] focus:outline-none"
                                  aria-label={`Supprimer ${val.value}`}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </span>
                            ))}
                            <input
                              type="text"
                              placeholder="Ajouter une valeur..."
                              value={newOptionValueByIndex[ti] ?? ""}
                              onChange={(e) =>
                                setNewOptionValueByIndex((prev) => ({ ...prev, [ti]: e.target.value }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const v = (newOptionValueByIndex[ti] ?? "").trim();
                                  if (v) {
                                    setOptionTypes((prev) =>
                                      prev.map((t, i) =>
                                        i === ti
                                          ? {
                                              ...t,
                                              values: [
                                                ...(t.values ?? []),
                                                { value: v, sort_order: (t.values?.length ?? 0) },
                                              ],
                                            }
                                          : t
                                      )
                                    );
                                    setNewOptionValueByIndex((prev) => ({ ...prev, [ti]: "" }));
                                  }
                                }
                              }}
                              className="flex-1 border-none bg-transparent p-0 text-sm focus:ring-0 placeholder-gray-400 min-w-[80px]"
                            />
                          </div>
                          <p className="mt-1 text-xs text-[var(--dash-text-muted)]">
                            Appuyez sur Entrée pour ajouter une valeur.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setOptionTypes((prev) => [
                        ...prev,
                        { name: "Couleur", sort_order: prev.length, values: [] },
                      ])
                    }
                    className="mt-2 text-sm text-[var(--dash-primary)] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Ajouter une option
                  </button>
                  <div className="mt-3">
                    <button
                      type="button"
                      disabled={!canGenerate}
                      onClick={() => {
                        const combosList = generateAllCombinations(optionTypes);
                        if (
                          combosList.length > 50 &&
                          !confirm(`${combosList.length} combinaisons seront créées. Continuer ?`)
                        )
                          return;
                        setVariants(
                          combosList.map((options) => ({
                            sku: null,
                            price_dzd: priceDzd || null,
                            stock: 0,
                            options,
                          }))
                        );
                      }}
                      className="text-sm text-[var(--dash-primary)] hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Générer toutes les combinaisons
                      {canGenerate && combos.length > 0 && ` (${combos.length})`}
                    </button>
                  </div>
                </div>

                {/* Preview Table */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-medium text-lg">Aperçu</h3>
                    <span className="text-xs text-[var(--dash-text-muted)] bg-[var(--dash-bg-light)] px-2 py-1 rounded border border-[var(--dash-border)]">
                      {variants.length} variante{variants.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="overflow-x-auto border border-[var(--dash-border)] rounded-md">
                    <table className="min-w-[640px] w-full divide-y divide-[var(--dash-border)]">
                      <thead className="bg-[var(--dash-bg-light)]">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-[var(--dash-text-muted)] uppercase tracking-wider"
                          >
                            Variante
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-[var(--dash-text-muted)] uppercase tracking-wider w-32"
                          >
                            Prix (DZD)
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-[var(--dash-text-muted)] uppercase tracking-wider w-24"
                          >
                            Stock
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-[var(--dash-text-muted)] uppercase tracking-wider w-32"
                          >
                            SKU
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-[var(--dash-surface)] divide-y divide-[var(--dash-border)]">
                        {variants.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-6 py-8 text-center text-sm text-[var(--dash-text-muted)]"
                            >
                              Générez des variantes ou ajoutez-en une manuellement.
                            </td>
                          </tr>
                        ) : (
                          variants.map((v, vi) => (
                            <tr key={vi}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--dash-text-main)]">
                                {formatVariantLabel(v.options)}
                              </td>
                              <td className="px-6 py-2 whitespace-nowrap">
                                <input
                                  type="number"
                                  min={0}
                                  value={v.price_dzd ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value ? Number(e.target.value) : null;
                                    setVariants((prev) =>
                                      prev.map((vb, i) =>
                                        i === vi ? { ...vb, price_dzd: val } : vb
                                      )
                                    );
                                  }}
                                  className={`block w-full ${inputBase} py-1.5`}
                                />
                              </td>
                              <td className="px-6 py-2 whitespace-nowrap">
                                <input
                                  type="number"
                                  min={0}
                                  value={v.stock}
                                  onChange={(e) => {
                                    const val = Number(e.target.value) || 0;
                                    setVariants((prev) =>
                                      prev.map((vb, i) =>
                                        i === vi ? { ...vb, stock: val } : vb
                                      )
                                    );
                                  }}
                                  className={`block w-full ${inputBase} py-1.5`}
                                />
                              </td>
                              <td className="px-6 py-2 whitespace-nowrap">
                                <input
                                  type="text"
                                  placeholder="Auto"
                                  value={v.sku ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value || null;
                                    setVariants((prev) =>
                                      prev.map((vb, i) =>
                                        i === vi ? { ...vb, sku: val } : vb
                                      )
                                    );
                                  }}
                                  className={`block w-full ${inputBase} py-1.5 bg-[var(--dash-bg-light)] placeholder:text-[var(--dash-text-muted)]`}
                                />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {variants.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setVariants((prev) => [
                          ...prev,
                          {
                            sku: null,
                            price_dzd: priceDzd || null,
                            stock: 0,
                            options: optionTypes
                              .filter((t) => t.name?.trim())
                              .map((t) => ({
                                typeName: t.name.trim(),
                                value: (t.values ?? [])[0]?.value ?? "",
                              })),
                          },
                        ])
                      }
                      className="mt-2 text-sm text-[var(--dash-primary)] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Ajouter une variante
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className={activeTab === "specs" ? "space-y-4" : "hidden"}>
                <p className="text-sm text-[var(--dash-text-muted)]">
                  Ex. Dimensions, Matériau (affichées sur la fiche produit).
                </p>
                {attributes.map((a, ai) => (
                  <div key={ai} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nom"
                      value={a.name}
                      onChange={(e) =>
                        setAttributes((prev) =>
                          prev.map((x, i) => (i === ai ? { ...x, name: e.target.value } : x))
                        )
                      }
                      className={`flex-1 ${inputBase}`}
                    />
                    <input
                      type="text"
                      placeholder="Valeur"
                      value={a.value}
                      onChange={(e) =>
                        setAttributes((prev) =>
                          prev.map((x, i) => (i === ai ? { ...x, value: e.target.value } : x))
                        )
                      }
                      className={`flex-1 ${inputBase}`}
                    />
                    <button
                      type="button"
                      onClick={() => setAttributes((prev) => prev.filter((_, i) => i !== ai))}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      aria-label="Supprimer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setAttributes((prev) => [
                      ...prev,
                      { name: "", value: "", sort_order: prev.length },
                    ])
                  }
                  className="text-sm text-[var(--dash-primary)] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Ajouter une spécification
                </button>
              </div>
          </div>

          {/* Quick Edit Card (when Variants tab) */}
          {activeTab === "variants" && (
            <div className="bg-[var(--dash-surface)] rounded-md border border-[var(--dash-border)] p-6 shadow-[var(--dash-shadow-subtle)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-medium text-lg">Infos générales (aperçu)</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab("general")}
                  className="text-xs font-medium text-[var(--dash-primary)] hover:text-[var(--dash-primary-hover)]"
                >
                  Ouvrir le formulaire complet
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelBase}>Prix de base (DZD)</label>
                  <div className="relative rounded-md shadow-sm">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--dash-text-muted)] text-sm">
                      DZD
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={priceDzd}
                      onChange={(e) => setPriceDzd(Number(e.target.value) || 0)}
                      className={`block w-full rounded-md border border-[var(--dash-border)] pl-12 focus:border-[var(--dash-primary)] focus:ring-1 focus:ring-[var(--dash-primary)] py-2.5 text-sm ${inputBase}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelBase}>Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brève description..."
                    className={`block w-full rounded-md border border-[var(--dash-border)] shadow-sm focus:border-[var(--dash-primary)] focus:ring-1 focus:ring-[var(--dash-primary)] py-2.5 text-sm ${inputBase} resize-none`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Product Status */}
          <div className="bg-[var(--dash-surface)] rounded-md border border-[var(--dash-border)] p-5 shadow-[var(--dash-shadow-subtle)]">
            <h3 className="font-display font-medium text-base mb-4 text-[var(--dash-text-main)]">
              Statut du produit
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  checked={status === "active"}
                  onChange={() => setStatus("active")}
                  className="h-4 w-4 border-gray-300 text-[var(--dash-primary)] focus:ring-[var(--dash-primary)]"
                  id="status-active"
                  name="status"
                  type="radio"
                />
                <label className="ml-3 block text-sm font-medium text-[var(--dash-text-main)]" htmlFor="status-active">
                  Actif
                </label>
              </div>
              <div className="flex items-center">
                <input
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                  className="h-4 w-4 border-gray-300 text-[var(--dash-primary)] focus:ring-[var(--dash-primary)]"
                  id="status-draft"
                  name="status"
                  type="radio"
                />
                <label className="ml-3 block text-sm font-medium text-[var(--dash-text-main)]" htmlFor="status-draft">
                  Brouillon
                </label>
              </div>
            </div>
          </div>

          {/* Organization */}
          <div className="bg-[var(--dash-surface)] rounded-md border border-[var(--dash-border)] p-5 shadow-[var(--dash-shadow-subtle)]">
            <h3 className="font-display font-medium text-base mb-4 text-[var(--dash-text-main)]">
              Organisation
            </h3>
            <div className="space-y-4">
              <div>
                <label className={labelBase}>Catégorie</label>
                <select
                  name="category_id"
                  defaultValue={product?.category_id ?? ""}
                  className={`block w-full ${inputBase}`}
                >
                  <option value="">—</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelBase}>Vendeur</label>
                <input
                  type="text"
                  placeholder="ex. Nike"
                  className={`block w-full ${inputBase}`}
                  aria-describedby="vendor-hint"
                />
                <span id="vendor-hint" className="sr-only">Optionnel, pour usage futur</span>
              </div>
              <div>
                <label className={labelBase}>Tags</label>
                <input
                  type="text"
                  placeholder="coton, été, soldes"
                  className={`block w-full ${inputBase}`}
                  aria-describedby="tags-hint"
                />
                <span id="tags-hint" className="sr-only">Optionnel, pour usage futur</span>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-[var(--dash-surface)] rounded-md border border-[var(--dash-border)] p-5 shadow-[var(--dash-shadow-subtle)]">
            <h3 className="font-display font-medium text-base mb-4 text-[var(--dash-text-main)]">
              Médias
            </h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              className="hidden"
              onChange={async (e) => {
                const files = e.target.files;
                if (!files?.length) return;
                setUploading(true);
                setError(null);
                setUploadProgress({ current: 0, total: files.length });
                const newUrls: string[] = [];
                for (let i = 0; i < files.length; i++) {
                  const formData = new FormData();
                  formData.set("file", files[i]);
                  const result = await uploadProductImage(formData);
                  setUploadProgress({ current: i + 1, total: files.length });
                  if (result.error) {
                    setError(result.error);
                    break;
                  }
                  if (result.url) newUrls.push(result.url);
                }
                setUploading(false);
                setUploadProgress(null);
                if (newUrls.length) setImageUrls((prev) => [...prev, ...newUrls]);
                e.target.value = "";
              }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[var(--dash-border)] rounded-md p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[var(--dash-primary)] hover:bg-[var(--dash-bg-light)]/50 transition-colors mb-4 group"
            >
              <Upload className="w-8 h-8 text-[var(--dash-text-muted)] group-hover:text-[var(--dash-primary)] mb-2 transition-colors" />
              <p className="text-sm font-medium text-[var(--dash-text-main)]">
                Glissez des fichiers ou cliquez
              </p>
              <p className="text-xs text-[var(--dash-text-muted)] mt-1">
                {uploading && uploadProgress
                  ? `Envoi ${uploadProgress.current}/${uploadProgress.total}…`
                  : "JPEG, PNG, WebP"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {imageUrls.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="relative group aspect-square rounded-md overflow-hidden border border-[var(--dash-border)]"
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageUrls((prev) => {
                          const next = [...prev];
                          [next[index - 1], next[index]] = [next[index], next[index - 1]];
                          return next;
                        });
                      }}
                      className="p-1 text-white hover:text-emerald-300 disabled:opacity-30"
                      aria-label="Monter"
                    >
                      <ChevronUp className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageUrls((prev) => prev.filter((_, i) => i !== index));
                      }}
                      className="p-1 text-white hover:text-red-400"
                      aria-label="Supprimer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1 rounded">
                      Principale
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-[var(--dash-bg-light)] rounded-md p-4 border border-[var(--dash-border)]">
            <h4 className="font-display text-sm font-semibold mb-1">Besoin d'aide ?</h4>
            <p className="text-xs text-[var(--dash-text-muted)] mb-3">
              Consultez la documentation pour gérer les variantes.
            </p>
            <Link
              href="/dashboard/aide"
              className="text-xs font-medium text-[var(--dash-primary)] hover:underline"
            >
              Voir l&apos;aide →
            </Link>
          </div>
        </div>
    </form>
  );
}
