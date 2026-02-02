"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: {
  name: string;
  slug: string;
  icon_name: string | null;
  color: string | null;
  bg_color: string | null;
  text_color: string | null;
  sort_order: number;
}) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("categories").insert({
    name: formData.name.trim(),
    slug: formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, "-"),
    icon_name: formData.icon_name?.trim() || null,
    color: formData.color?.trim() || null,
    bg_color: formData.bg_color?.trim() || null,
    text_color: formData.text_color?.trim() || null,
    sort_order: Number(formData.sort_order) ?? 0,
  });
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/dashboard/categories");
  return {};
}

export async function updateCategory(
  id: string,
  formData: {
    name: string;
    slug: string;
    icon_name: string | null;
    color: string | null;
    bg_color: string | null;
    text_color: string | null;
    sort_order: number;
  }
) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("categories")
    .update({
      name: formData.name.trim(),
      slug: formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, "-"),
      icon_name: formData.icon_name?.trim() || null,
      color: formData.color?.trim() || null,
      bg_color: formData.bg_color?.trim() || null,
      text_color: formData.text_color?.trim() || null,
      sort_order: Number(formData.sort_order) ?? 0,
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/dashboard/categories");
  return {};
}

export async function deleteCategory(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/dashboard/categories");
  return {};
}
