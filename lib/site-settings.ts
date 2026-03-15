import { createServiceClient } from "./supabase/service";

export interface FooterLink {
  label_fr: string;
  label_ar?: string | null;
  url: string;
}

export interface FooterSection {
  title_fr: string;
  title_ar?: string | null;
  links: FooterLink[];
}

export interface SiteSettings {
  site_title: string | null;
  logo_url: string | null;
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
  footer_sections: FooterSection[];
  meta_pixel_id: string | null;
  ga4_measurement_id: string | null;
  gtm_container_id: string | null;
  tracking_enabled: boolean;
}

const defaults: SiteSettings = {
  site_title: "Sani Modern OEB",
  logo_url: null,
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
  footer_sections: [],
  meta_pixel_id: null,
  ga4_measurement_id: null,
  gtm_container_id: null,
  tracking_enabled: true,
};

export const defaultFooterSections: FooterSection[] = [
  {
    title_fr: "Navigation",
    title_ar: "تنقل",
    links: [
      { label_fr: "Produits", label_ar: "المنتجات", url: "/produits" },
      { label_fr: "Nos Showrooms", label_ar: "عارضاتنا", url: "/showrooms" },
      { label_fr: "À propos", label_ar: "من نحن", url: "/a-propos" },
      { label_fr: "Contact", label_ar: "اتصل", url: "#footer" },
    ],
  },
  {
    title_fr: "Support",
    title_ar: "الدعم",
    links: [
      { label_fr: "Livraison & Retours", label_ar: "التوصيل والمرتجعات", url: "/livraison-retours" },
      { label_fr: "FAQ", label_ar: "الأسئلة الشائعة", url: "/faq" },
      { label_fr: "Garantie", label_ar: "الضمان", url: "/garantie" },
    ],
  },
];

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
      site_title: data.site_title ?? defaults.site_title,
      logo_url: data.logo_url ?? defaults.logo_url,
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
      footer_sections:
        Array.isArray(data.footer_sections) && (data.footer_sections as FooterSection[]).length > 0
          ? (data.footer_sections as FooterSection[])
          : defaultFooterSections,
      meta_pixel_id: data.meta_pixel_id ?? defaults.meta_pixel_id,
      ga4_measurement_id: data.ga4_measurement_id ?? defaults.ga4_measurement_id,
      gtm_container_id: data.gtm_container_id ?? defaults.gtm_container_id,
      tracking_enabled: data.tracking_enabled ?? defaults.tracking_enabled,
    };
  } catch {
    return defaults;
  }
}
