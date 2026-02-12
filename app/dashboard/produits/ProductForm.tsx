"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadProductImage } from "@/app/actions/upload";
import { getProductImageUrls } from "@/lib/product-images";
import { X, Plus, ChevronUp, ChevronDown } from "lucide-react";

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
  price_old_dzd?: number | null;
  image_url: string | null;
  image_urls?: string[] | null;
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
    price_old_dzd: number | null;
    image_urls: string[];
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
  const [imageUrls, setImageUrls] = useState<string[]>(() =>
    product ? getProductImageUrls(product) : []
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      price_old_dzd: (() => {
        const v = (form.elements.namedItem("price_old_dzd") as HTMLInputElement)?.value;
        return v !== "" && v != null ? Number(v) : null;
      })(),
      image_urls: imageUrls,
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
          defaultValue={product?.slug}
          placeholder="nom-du-produit"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#0ea5a5] outline-none transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Catégorie
        </label>
        <select
          name="category_id"
          defaultValue={product?.category_id ?? ""}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#0ea5a5] outline-none transition"
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
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#0ea5a5] outline-none transition resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Ancien prix (DA)
          </label>
          <input
            name="price_old_dzd"
            type="number"
            min={0}
            defaultValue={product?.price_old_dzd ?? ""}
            placeholder="—"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#0ea5a5] outline-none transition"
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
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#0ea5a5] outline-none transition"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Images produit (plusieurs)
        </label>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              className="block w-full text-sm text-slate-500 file:me-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#13ecec] file:text-[#102222] file:font-semibold file:cursor-pointer hover:file:bg-[#0ea5a5]"
              onChange={async (e) => {
                const files = e.target.files;
                if (!files?.length) return;
                const total = files.length;
                setUploading(true);
                setError(null);
                setUploadProgress({ current: 0, total });
                const newUrls: string[] = [];
                for (let i = 0; i < files.length; i++) {
                  const formData = new FormData();
                  formData.set("file", files[i]);
                  const result = await uploadProductImage(formData);
                  setUploadProgress({ current: i + 1, total });
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
            {uploading && uploadProgress && (
              <div className="flex-1 min-w-0 max-w-sm">
                <p className="text-sm text-slate-600 mb-1">
                  Upload {uploadProgress.current}/{uploadProgress.total}…
                </p>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0ea5a5] rounded-full transition-all duration-300"
                    style={{
                      width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Ou coller une URL (https://…)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const v = urlInput.trim();
                  if (v) {
                    setImageUrls((prev) => [...prev, v]);
                    setUrlInput("");
                  }
                }
              }}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#0ea5a5] outline-none transition"
            />
            <button
              type="button"
              onClick={() => {
                const v = urlInput.trim();
                if (v) {
                  setImageUrls((prev) => [...prev, v]);
                  setUrlInput("");
                }
              }}
              className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>
          {imageUrls.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-2">
                Ordre : première image = image principale. Utilisez les flèches pour réorganiser.
              </p>
              <ul className="flex flex-wrap gap-3">
                {imageUrls.map((url, index) => (
                  <li
                    key={`${url}-${index}`}
                    className="relative group flex items-center gap-2 bg-slate-50 rounded-xl p-2 border border-slate-200"
                  >
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() =>
                          setImageUrls((prev) => {
                            const next = [...prev];
                            [next[index - 1], next[index]] = [next[index], next[index - 1]];
                            return next;
                          })
                        }
                        className="p-0.5 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Monter"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={index === imageUrls.length - 1}
                        onClick={() =>
                          setImageUrls((prev) => {
                            const next = [...prev];
                            [next[index], next[index + 1]] = [next[index + 1], next[index]];
                            return next;
                          })
                        }
                        className="p-0.5 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Descendre"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <img
                      src={url}
                      alt=""
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                    <span className="text-xs text-slate-500">
                      {index === 0 ? "Principale" : index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setImageUrls((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      aria-label="Supprimer l'image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#0ea5a5] outline-none transition"
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
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[#1E293B] placeholder:text-slate-400 focus:border-[#0ea5a5] outline-none transition"
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
