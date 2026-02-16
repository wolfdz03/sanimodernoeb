import type { ProductVariant, ProductOptionType } from "@/lib/types/database";

/** Display variant as "120x80 • White" (values only, bullet separator) */
export function formatVariantLabel(
  variant: ProductVariant,
  optionTypes: ProductOptionType[]
): string {
  const opts = (variant.product_variant_options ?? []) as {
    product_option_values?: { value: string; option_type_id: string };
  }[];
  const typeOrder = optionTypes.map((t) => t.id);
  const values = opts
    .map((o) => ({
      value: o.product_option_values?.value ?? "",
      order: typeOrder.indexOf(o.product_option_values?.option_type_id ?? ""),
    }))
    .filter((x) => x.value)
    .sort((a, b) => a.order - b.order)
    .map((x) => x.value);
  return values.join(" • ");
}
