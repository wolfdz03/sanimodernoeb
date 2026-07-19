"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";
import { revalidateProductStorefrontPaths } from "@/lib/revalidate-product-paths";
import { requireAdmin } from "@/lib/auth";

export type OptionTypeInput = {
  id?: string;
  name: string;
  sort_order: number;
  values: { id?: string; value: string; sort_order: number }[];
};

export type VariantOptionInput = { typeName: string; value: string };

export type VariantInput = {
  id?: string;
  sku: string | null;
  price_dzd: number | null;
  stock: number;
  /** Option value IDs (when available) or use options for typeName+value resolution */
  option_value_ids?: string[];
  options?: VariantOptionInput[];
};

export type AttributeInput = {
  id?: string;
  name: string;
  value: string;
  sort_order: number;
};

export async function saveProductOptionTypes(
  productId: string,
  optionTypes: OptionTypeInput[]
) {
  await requireAdmin();
  const supabase = createServiceClient();
  // Remove variants first (they reference option values)
  const { error: deleteVariantsError } = await supabase.from("product_variants").delete().eq("product_id", productId);
  if (deleteVariantsError) return { error: deleteVariantsError.message };
  const { data: existingTypes } = await supabase
    .from("product_option_types")
    .select("id")
    .eq("product_id", productId);
  for (const t of existingTypes ?? []) {
    const { error } = await supabase.from("product_option_values").delete().eq("option_type_id", t.id);
    if (error) return { error: error.message };
  }
  const { error: deleteTypesError } = await supabase.from("product_option_types").delete().eq("product_id", productId);
  if (deleteTypesError) return { error: deleteTypesError.message };
  for (let i = 0; i < optionTypes.length; i++) {
    const ot = optionTypes[i];
    const { data: typeRow, error: typeError } = await supabase
      .from("product_option_types")
      .insert({
        product_id: productId,
        name: ot.name.trim(),
        sort_order: ot.sort_order ?? i,
      })
      .select("id")
      .single();
    if (typeError || !typeRow) return { error: typeError?.message ?? "Impossible d'enregistrer l'option." };
    if (typeRow) {
      for (let j = 0; j < (ot.values ?? []).length; j++) {
        const v = ot.values[j];
        const { error } = await supabase.from("product_option_values").insert({
          option_type_id: typeRow.id,
          value: v.value.trim(),
          sort_order: v.sort_order ?? j,
        });
        if (error) return { error: error.message };
      }
    }
  }
  revalidatePath("/");
  revalidatePath("/produits");
  revalidatePath("/dashboard/produits");
  if (productId) await revalidateProductStorefrontPaths(productId);
  return {};
}

export async function saveProductVariants(
  productId: string,
  variants: VariantInput[]
) {
  await requireAdmin();
  const supabase = createServiceClient();
  const { error: deleteError } = await supabase.from("product_variants").delete().eq("product_id", productId);
  if (deleteError) return { error: deleteError.message };
  if (variants.length === 0) {
    revalidatePath("/");
    revalidatePath("/produits");
    revalidatePath("/dashboard/produits");
    await revalidateProductStorefrontPaths(productId);
    return {};
  }
  const { data: optionTypes } = await supabase
    .from("product_option_types")
    .select("id, name")
    .eq("product_id", productId);
  const { data: allValues } = await supabase
    .from("product_option_values")
    .select("id, option_type_id, value")
    .in(
      "option_type_id",
      (optionTypes ?? []).map((t) => t.id)
    );
  if ((optionTypes ?? []).length > 0 && !allValues) return { error: "Impossible de charger les valeurs des options." };
  const typeByName = new Map((optionTypes ?? []).map((t) => [t.name.trim().toLowerCase(), t]));
  const valuesByTypeAndVal = new Map<string, string>();
  for (const ov of allValues ?? []) {
    const key = `${ov.option_type_id}:${(ov.value ?? "").trim().toLowerCase()}`;
    valuesByTypeAndVal.set(key, ov.id);
  }
  for (const v of variants) {
    const payload = {
      product_id: productId,
      sku: v.sku?.trim() || null,
      price_dzd: v.price_dzd != null && v.price_dzd >= 0 ? v.price_dzd : null,
      stock: Number(v.stock) ?? 0,
    };
    const { data: inserted, error: insertError } = await supabase
      .from("product_variants")
      .insert(payload)
      .select("id")
      .single();
    if (insertError || !inserted) return { error: insertError?.message ?? "Impossible d'enregistrer une variante." };
    const optionValueIds: string[] = [];
    if (v.option_value_ids?.length) {
      optionValueIds.push(...v.option_value_ids);
    } else if (v.options?.length) {
      for (const opt of v.options) {
        const typeRow = typeByName.get(opt.typeName?.trim().toLowerCase());
        if (!typeRow) continue;
        const key = `${typeRow.id}:${(opt.value ?? "").trim().toLowerCase()}`;
        const ovId = valuesByTypeAndVal.get(key);
        if (ovId) optionValueIds.push(ovId);
      }
    }
    if (optionValueIds.length === 0) return { error: "Chaque variante doit correspondre à des valeurs d'option valides." };
    for (const optValId of optionValueIds) {
      const { error } = await supabase.from("product_variant_options").insert({
        variant_id: inserted.id,
        option_value_id: optValId,
      });
      if (error) return { error: error.message };
    }
  }
  revalidatePath("/");
  revalidatePath("/produits");
  revalidatePath("/dashboard/produits");
  if (productId) await revalidateProductStorefrontPaths(productId);
  return {};
}

export async function saveProductAttributes(
  productId: string,
  attributes: AttributeInput[]
) {
  await requireAdmin();
  const supabase = createServiceClient();
  await supabase.from("product_attributes").delete().eq("product_id", productId);
  for (let i = 0; i < attributes.length; i++) {
    const a = attributes[i];
    if (!a.name?.trim()) continue;
    await supabase.from("product_attributes").insert({
      product_id: productId,
      name: a.name.trim(),
      value: (a.value ?? "").trim(),
      sort_order: a.sort_order ?? i,
    });
  }
  revalidatePath("/");
  revalidatePath("/produits");
  revalidatePath("/dashboard/produits");
  return {};
}
