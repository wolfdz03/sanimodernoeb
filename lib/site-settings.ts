import { createServiceClient } from "./supabase/service";

export interface SiteSettings {
  phone: string | null;
  email: string | null;
  address: string | null;
  tagline: string | null;
  copyright_text: string | null;
  free_delivery_threshold_dzd: number | null;
  whatsapp: string | null;
  admin_notification_email: string | null;
  email_from: string | null;
  site_url: string | null;
  resend_api_key: string | null;
  mistral_api_key: string | null;
  primary_color: string | null;
  primary_hover_color: string | null;
}

const defaults: SiteSettings = {
  phone: "+213 (0) 34 56 78 90",
  email: "contact@sanimodern.dz",
  address: "Oum El Bouaghi, Algérie",
  tagline: "Le leader de l'équipement sanitaire moderne en Algérie. Qualité, design et innovation pour votre salle de bain.",
  copyright_text: "© 2025 Sani Modern OEB. Tous droits réservés.",
  free_delivery_threshold_dzd: 75000,
  whatsapp: null,
  admin_notification_email: null,
  email_from: null,
  site_url: null,
  resend_api_key: null,
  mistral_api_key: null,
  primary_color: "#DC2626",
  primary_hover_color: "#B91C1C",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();
    if (error || !data) return defaults;
    return {
      phone: data.phone ?? defaults.phone,
      email: data.email ?? defaults.email,
      address: data.address ?? defaults.address,
      tagline: data.tagline ?? defaults.tagline,
      copyright_text: data.copyright_text ?? defaults.copyright_text,
      free_delivery_threshold_dzd: data.free_delivery_threshold_dzd ?? defaults.free_delivery_threshold_dzd,
      whatsapp: data.whatsapp ?? defaults.whatsapp,
      admin_notification_email: data.admin_notification_email ?? defaults.admin_notification_email,
      email_from: data.email_from ?? defaults.email_from,
      site_url: data.site_url ?? defaults.site_url,
      resend_api_key: data.resend_api_key ?? defaults.resend_api_key,
      mistral_api_key: data.mistral_api_key ?? defaults.mistral_api_key,
      primary_color: data.primary_color ?? defaults.primary_color,
      primary_hover_color: data.primary_hover_color ?? defaults.primary_hover_color,
    };
  } catch {
    return defaults;
  }
}
