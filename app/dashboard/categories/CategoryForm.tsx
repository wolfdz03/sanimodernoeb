"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ICON_OPTIONS = [
  "ShowerHead",
  "Bath",
  "Droplets",
  "Toilet",
  "Wrench",
  "Sparkles",
];

interface Category {
  id: string;
  name: string;
  slug: string;
  icon_name: string | null;
  color: string | null;
  bg_color: string | null;
  text_color: string | null;
  sort_order: number;
}

interface CategoryFormProps {
  action: (formData: {
    name: string;
    slug: string;
    icon_name: string | null;
    color: string | null;
    bg_color: string | null;
    text_color: string | null;
    sort_order: number;
  }) => Promise<{ error?: string }>;
  category: Category | null;
  deleteAction?: () => Promise<{ error?: string }>;
}

export function CategoryForm({
  action,
  category,
  deleteAction,
}: CategoryFormProps) {
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
      icon_name:
        (form.elements.namedItem("icon_name") as HTMLSelectElement).value ||
        null,
      color: (form.elements.namedItem("color") as HTMLInputElement).value || null,
      bg_color:
        (form.elements.namedItem("bg_color") as HTMLInputElement).value || null,
      text_color:
        (form.elements.namedItem("text_color") as HTMLInputElement).value ||
        null,
      sort_order: Number(
        (form.elements.namedItem("sort_order") as HTMLInputElement).value
      ) || 0,
    };
    const result = await action(formData);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/dashboard/categories");
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteAction || !confirm("Supprimer cette catégorie ?")) return;
    setLoading(true);
    const result = await deleteAction();
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/dashboard/categories");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl space-y-4"
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
          defaultValue={category?.name}
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
          defaultValue={category?.slug}
          placeholder="nom-categorie"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] outline-none transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Icône (Lucide)
        </label>
        <select
          name="icon_name"
          defaultValue={category?.icon_name ?? ""}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] outline-none transition"
        >
          <option value="">—</option>
          {ICON_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Couleur (gradient)
          </label>
          <input
            name="color"
            type="text"
            defaultValue={category?.color ?? ""}
            placeholder="from-blue-500 to-blue-600"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Bg (Tailwind)
          </label>
          <input
            name="bg_color"
            type="text"
            defaultValue={category?.bg_color ?? ""}
            placeholder="bg-blue-50"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Texte (Tailwind)
          </label>
          <input
            name="text_color"
            type="text"
            defaultValue={category?.text_color ?? ""}
            placeholder="text-blue-600"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] outline-none transition"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Ordre d&apos;affichage
        </label>
        <input
          name="sort_order"
          type="number"
          min={0}
          defaultValue={category?.sort_order ?? 0}
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
