"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShowerHead,
  Bath,
  Droplets,
  Toilet,
  Wrench,
  Sparkles,
  Droplet,
  Thermometer,
  Home,
  Building2,
  Package,
  Box,
  Truck,
  Shield,
  Award,
  Star,
  CheckCircle,
  Zap,
  Flame,
  Wind,
  Sun,
  Filter,
  Gauge,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: { name: string; Icon: LucideIcon }[] = [
  { name: "ShowerHead", Icon: ShowerHead },
  { name: "Bath", Icon: Bath },
  { name: "Droplets", Icon: Droplets },
  { name: "Droplet", Icon: Droplet },
  { name: "Toilet", Icon: Toilet },
  { name: "Wrench", Icon: Wrench },
  { name: "Sparkles", Icon: Sparkles },
  { name: "Thermometer", Icon: Thermometer },
  { name: "Home", Icon: Home },
  { name: "Building2", Icon: Building2 },
  { name: "Package", Icon: Package },
  { name: "Box", Icon: Box },
  { name: "Truck", Icon: Truck },
  { name: "Shield", Icon: Shield },
  { name: "Award", Icon: Award },
  { name: "Star", Icon: Star },
  { name: "CheckCircle", Icon: CheckCircle },
  { name: "Zap", Icon: Zap },
  { name: "Flame", Icon: Flame },
  { name: "Wind", Icon: Wind },
  { name: "Sun", Icon: Sun },
  { name: "Filter", Icon: Filter },
  { name: "Gauge", Icon: Gauge },
];

const DEFAULT_COLOR = "#0ea5a5";

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
  const [selectedIcon, setSelectedIcon] = useState<string | null>(
    category?.icon_name ?? null
  );
  const [color, setColor] = useState<string>(
    category?.color && /^#[0-9A-Fa-f]{6}$/.test(category.color)
      ? category.color
      : DEFAULT_COLOR
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      slug: (form.elements.namedItem("slug") as HTMLInputElement).value,
      icon_name: selectedIcon,
      color: color || null,
      bg_color: null as string | null,
      text_color: null as string | null,
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
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#0ea5a5] outline-none transition"
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
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#0ea5a5] outline-none transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Couleur
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 p-1 bg-white"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] font-mono text-sm focus:border-[#0ea5a5] outline-none transition"
            placeholder="#0ea5a5"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">
          Icône
        </label>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50/50">
          {CATEGORY_ICONS.map(({ name, Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => setSelectedIcon(selectedIcon === name ? null : name)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-colors ${
                selectedIcon === name
                  ? "border-[#0ea5a5] bg-[#0ea5a5]/10 text-[#0ea5a5]"
                  : "border-transparent bg-white hover:bg-slate-100 text-slate-600"
              }`}
              title={name}
            >
              <Icon className="w-6 h-6" strokeWidth={2} />
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Choisir une icône (optionnel)
        </p>
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
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#0ea5a5] outline-none transition"
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
