import { createServiceClient } from "./supabase/service";

export type SiteContentMap = Record<string, { value_fr: string | null; value_ar: string | null }>;

export async function getSiteContent(): Promise<SiteContentMap> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from("site_content").select("key, value_fr, value_ar");
    if (error || !data) return {};
    const map: SiteContentMap = {};
    for (const row of data) {
      map[row.key] = { value_fr: row.value_fr, value_ar: row.value_ar };
    }
    return map;
  } catch {
    return {};
  }
}
