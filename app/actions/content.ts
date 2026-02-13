"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

export async function updateSiteContent(updates: Array<{ key: string; value_fr?: string | null; value_ar?: string | null }>) {
  const supabase = createServiceClient();
  for (const { key, value_fr, value_ar } of updates) {
    const payload: Record<string, unknown> = { key, updated_at: new Date().toISOString() };
    if (value_fr !== undefined) payload.value_fr = value_fr?.trim() || null;
    if (value_ar !== undefined) payload.value_ar = value_ar?.trim() || null;
    const { error } = await supabase.from("site_content").upsert(payload, { onConflict: "key" });
    if (error) return { error: error.message };
  }
  revalidatePath("/");
  revalidatePath("/produits");
  revalidatePath("/dashboard/contenu");
  return {};
}
