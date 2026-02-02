"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  description: string | null;
  price_dzd: number;
  image_url: string | null;
  badge: string | null;
  badge_color: string | null;
  stock: number;
}

interface ProductFormProps {
  categories: Category[];
  action: (formData: {
    name: string;
    slug: string;
    category_id: string | null;
    description: string | null;
    price_dzd: number;
    image_url: string | null;
    badge: string | null;
    badge_color: string | null;
    stock: number;
  }) => Promise<{ error?: string }>;
  product: Product | null;
  deleteAction?: () => Promise<{ error?: string }>;
}

export function ProductForm({
  categories,
  action,
  product,
  deleteAction,
}: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      slug: (form.elements.namedItem("slug") as HTMLInputElement).value,
      category_id:
        (form.elements.namedItem("category_id") as HTMLSelectElement).value ||
        null,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement)
        .value || null,
      price_dzd: Number(
        (form.elements.namedItem("price_dzd") as HTMLInputElement).value
      ),
      image_url: (form.elements.namedItem("image_url") as HTMLInputElement)
        .value || null,
      badge: (form.elements.namedItem("badge") as HTMLInputElement).value || null,
      badge_color: (form.elements.namedItem("badge_color") as HTMLInputElement)
        .value || null,
      stock: Number(
        (form.elements.namedItem("stock") as HTMLInputElement).value
      ) || 0,
    };
    const result = await action(formData);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl space-y-4"
    >
      {error && (
        <p className="text-sm text-[#DC2626] bg-red-50 p-3 rounded-xl">
          {error}
        </p>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Nom *
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={product?.name}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] outline-none transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Slug (URL)
        </label>
        <input
          name="slug"
          type="text"
          defaultValue={product?.slug}
          placeholder="nom-du-produit"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] outline-none transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Catégorie
        </label>
        <select
          name="category_id"
          defaultValue={product?.category_id ?? ""}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] outline-none transition"
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
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={product?.description ?? ""}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] outline-none transition resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Prix (DA) *
        </label>
        <input
          name="price_dzd"
          type="number"
          required
          min={0}
          defaultValue={product?.price_dzd ?? 0}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] outline-none transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          URL image
        </label>
        <input
          name="image_url"
          type="url"
          defaultValue={product?.image_url ?? ""}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] outline-none transition"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Badge
          </label>
          <input
            name="badge"
            type="text"
            defaultValue={product?.badge ?? ""}
            placeholder="Bestseller, Nouveau…"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Couleur badge (Tailwind)
          </label>
          <input
            name="badge_color"
            type="text"
            defaultValue={product?.badge_color ?? ""}
            placeholder="bg-[#DC2626]"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] outline-none transition"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Stock
        </label>
        <input
          name="stock"
          type="number"
          min={0}
          defaultValue={product?.stock ?? 0}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] outline-none transition"
        />
      </div>
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-[#DC2626] text-white font-semibold hover:bg-[#B91C1C] transition-colors disabled:opacity-50"
        >
          {loading ? "Enregistrement…" : "Enregistrer"}
        </button>
        {deleteAction && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-3 rounded-xl border border-slate-200 text-[#64748B] font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Supprimer
          </button>
        )}
      </div>
    </form>
  );
}
