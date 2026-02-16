"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

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
  const supabase = createServiceClient();
  // Remove variants first (they reference option values)
  await supabase.from("product_variants").delete().eq("product_id", productId);
  const { data: existingTypes } = await supabase
    .from("product_option_types")
    .select("id")
    .eq("product_id", productId);
  for (const t of existingTypes ?? []) {
    await supabase.from("product_option_values").delete().eq("option_type_id", t.id);
  }
  await supabase.from("product_option_types").delete().eq("product_id", productId);
  for (let i = 0; i < optionTypes.length; i++) {
    const ot = optionTypes[i];
    const { data: typeRow } = await supabase
      .from("product_option_types")
      .insert({
        product_id: productId,
        name: ot.name.trim(),
        sort_order: ot.sort_order ?? i,
      })
      .select("id")
      .single();
    if (typeRow) {
      for (let j = 0; j < (ot.values ?? []).length; j++) {
        const v = ot.values[j];
        await supabase.from("product_option_values").insert({
          option_type_id: typeRow.id,
          value: v.value.trim(),
          sort_order: v.sort_order ?? j,
        });
      }
    }
  }
  revalidatePath("/");
  revalidatePath("/produits");
  revalidatePath("/dashboard/produits");
  if (productId) revalidatePath(`/produit/${productId}`);
  return {};
}

export async function saveProductVariants(
  productId: string,
  variants: VariantInput[]
) {
  const supabase = createServiceClient();
  await supabase.from("product_variants").delete().eq("product_id", productId);
  if (variants.length === 0) {
    revalidatePath("/");
    revalidatePath("/produits");
    revalidatePath("/dashboard/produits");
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
  const typeByName = new Map((optionTypes ?? []).map((t) => [t.name.trim().toLowerCase(), t]));
  const valuesByTypeAndVal = new Map<string, string>();
  for (const ov of allValues ?? []) {
    const t = optionTypes?.find((x) => x.id === ov.option_type_id);
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
    const { data: inserted } = await supabase
      .from("product_variants")
      .insert(payload)
      .select("id")
      .single();
    if (!inserted) continue;
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
    for (const optValId of optionValueIds) {
      await supabase.from("product_variant_options").insert({
        variant_id: inserted.id,
        option_value_id: optValId,
      });
    }
  }
  revalidatePath("/");
  revalidatePath("/produits");
  revalidatePath("/dashboard/produits");
  if (productId) revalidatePath(`/produit/${productId}`);
  return {};
}

export async function saveProductAttributes(
  productId: string,
  attributes: AttributeInput[]
) {
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
