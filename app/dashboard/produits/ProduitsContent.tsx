"use client";

import Link from "next/link";
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
  categories: { name?: string } | null;
}

interface ProduitsContentProps {
  products: ProductRow[] | null;
}

export function ProduitsContent({ products }: ProduitsContentProps) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-2xl text-[#1E293B] dark:text-white">
          {t("dashboard_produits_title")}
        </h1>
        <Link
          href="/dashboard/produits/nouveau"
          className="px-4 py-2 rounded-xl bg-[#13ecec] text-[#102222] font-semibold hover:bg-[#0ea5a5] hover:text-white transition-colors"
        >
          {t("dashboard_produits_add")}
        </Link>
      </div>
      <div className="bg-white dark:bg-[#0d1b1b] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-start">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold text-[#1E293B] dark:text-white">
                {t("dashboard_image")}
              </th>
              <th className="px-6 py-4 font-semibold text-[#1E293B] dark:text-white">
                {t("dashboard_name")}
              </th>
              <th className="px-6 py-4 font-semibold text-[#1E293B] dark:text-white">
                {t("dashboard_category")}
              </th>
              <th className="px-6 py-4 font-semibold text-[#1E293B] dark:text-white">
                {t("dashboard_price")}
              </th>
              <th className="px-6 py-4 font-semibold text-[#1E293B] dark:text-white" />
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((product) => (
              <tr
                key={product.id}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
              >
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                    {getProductPrimaryImage(product) ? (
                      <img
                        src={getProductPrimaryImage(product)!}
                        alt=""
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <span className="text-[#64748B] dark:text-slate-400 text-xs flex items-center justify-center h-full">
                        —
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-[#1E293B] dark:text-white">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-[#64748B] dark:text-slate-400">
                  {product.categories?.name ?? "—"}
                </td>
                <td className="px-6 py-4 font-semibold text-[#13ecec]">
                  {product.price_old_dzd != null && product.price_old_dzd > 0 && (
                    <span className="block text-xs text-slate-400 line-through">
                      {product.price_old_dzd.toLocaleString("fr-DZ")} DA
                    </span>
                  )}
                  {product.price_dzd.toLocaleString("fr-DZ")} DA
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/produits/${product.id}`}
                    className="text-[#13ecec] font-medium hover:underline text-sm"
                  >
                    {t("dashboard_edit")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!products || products.length === 0) && (
          <p className="px-6 py-12 text-center text-[#64748B] dark:text-slate-400">
            {t("dashboard_no_produits")}{" "}
            <Link
              href="/dashboard/produits/nouveau"
              className="text-[#13ecec] hover:underline"
            >
              {t("dashboard_no_produits_add")}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
