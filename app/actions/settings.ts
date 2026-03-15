"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";
import type { FooterSection } from "@/lib/site-settings";

export async function updateSiteSettings(formData: {
  site_title?: string;
  logo_url?: string;
  phone?: string;
  email?: string;
  address?: string;
  tagline?: string;
  copyright_text?: string;
  free_delivery_threshold_dzd?: number;
  whatsapp?: string;
  admin_notification_email?: string;
  email_from?: string;
  site_url?: string;
  resend_api_key?: string;
  mistral_api_key?: string;
  primary_color?: string;
  primary_hover_color?: string;
  footer_sections?: FooterSection[];
  meta_pixel_id?: string;
  ga4_measurement_id?: string;
  gtm_container_id?: string;
  tracking_enabled?: boolean;
}) {
  const supabase = createServiceClient();
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (formData.site_title !== undefined) payload.site_title = formData.site_title.trim() || null;
  if (formData.logo_url !== undefined) payload.logo_url = formData.logo_url.trim() || null;
  if (formData.phone !== undefined) payload.phone = formData.phone.trim() || null;
  if (formData.email !== undefined) payload.email = formData.email.trim() || null;
  if (formData.address !== undefined) payload.address = formData.address.trim() || null;
  if (formData.tagline !== undefined) payload.tagline = formData.tagline.trim() || null;
  if (formData.copyright_text !== undefined) payload.copyright_text = formData.copyright_text.trim() || null;
  if (formData.free_delivery_threshold_dzd !== undefined) {
    const v = Number(formData.free_delivery_threshold_dzd);
    payload.free_delivery_threshold_dzd = isNaN(v) ? 75000 : Math.max(0, v);
  }
  if (formData.whatsapp !== undefined) payload.whatsapp = formData.whatsapp.trim() || null;
  if (formData.admin_notification_email !== undefined) payload.admin_notification_email = formData.admin_notification_email.trim() || null;
  if (formData.email_from !== undefined) payload.email_from = formData.email_from.trim() || null;
  if (formData.site_url !== undefined) payload.site_url = formData.site_url.trim() || null;
  // API keys: only update when non-empty (empty = keep existing)
  if (formData.resend_api_key !== undefined && formData.resend_api_key.trim()) payload.resend_api_key = formData.resend_api_key.trim();
  if (formData.mistral_api_key !== undefined && formData.mistral_api_key.trim()) payload.mistral_api_key = formData.mistral_api_key.trim();
  if (formData.primary_color !== undefined) {
    const v = formData.primary_color.trim();
    payload.primary_color = v && /^#[0-9A-Fa-f]{6}$/.test(v) ? v : "#DC2626";
  }
  if (formData.primary_hover_color !== undefined) {
    const v = formData.primary_hover_color.trim();
    payload.primary_hover_color = v && /^#[0-9A-Fa-f]{6}$/.test(v) ? v : "#B91C1C";
  }
  if (formData.footer_sections !== undefined) {
    payload.footer_sections = formData.footer_sections;
  }
  if (formData.meta_pixel_id !== undefined) payload.meta_pixel_id = formData.meta_pixel_id.trim() || null;
  if (formData.ga4_measurement_id !== undefined) payload.ga4_measurement_id = formData.ga4_measurement_id.trim() || null;
  if (formData.gtm_container_id !== undefined) payload.gtm_container_id = formData.gtm_container_id.trim() || null;
  if (formData.tracking_enabled !== undefined) payload.tracking_enabled = Boolean(formData.tracking_enabled);

  const { error } = await supabase
    .from("site_settings")
    .update(payload)
    .eq("id", 1);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/parametres");
  revalidatePath("/dashboard/marketing");
  return {};
}
