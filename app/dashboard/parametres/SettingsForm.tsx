"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, Lock, Palette, Mail, Link2, ChevronUp, ChevronDown, Trash2, Plus, Store, Save, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { updateSiteSettings } from "@/app/actions/settings";
import { uploadSiteLogo } from "@/app/actions/upload";
import { changeEmail, changePassword } from "@/app/actions/auth";
import { updateShippingRates } from "@/app/actions/shipping";
import { defaultFooterSections, type FooterLink, type FooterSection, type SiteSettings } from "@/lib/site-settings";
import { WILAYAS } from "@/lib/wilayas";

interface SettingsFormProps {
  settings: SiteSettings & { has_resend_key?: boolean; has_mistral_key?: boolean; resend_api_key?: string; mistral_api_key?: string };
  adminEmail: string | null;
  initialShippingRates: Record<string, number>;
}

export function SettingsForm({ settings, adminEmail, initialShippingRates }: SettingsFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const initialFooter = useMemo(
    () => (settings.footer_sections?.length ? [...settings.footer_sections] : defaultFooterSections),
    [settings.footer_sections]
  );
  const [footerSections, setFooterSections] = useState<FooterSection[]>(initialFooter);
  const [footerSaving, setFooterSaving] = useState(false);
  const [footerSaveSuccess, setFooterSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"contact" | "apparence" | "general" | "shipping" | "footer" | "security">("contact");
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(settings.logo_url ?? "");

  const [shippingRates, setShippingRates] = useState(initialShippingRates);
  const [shippingSaving, setShippingSaving] = useState(false);
  const [shippingSuccess, setShippingSuccess] = useState(false);

  const tabs = [
    { id: "contact" as const, label: t("settings_contact"), icon: Store },
    { id: "apparence" as const, label: "Apparence", icon: Palette },
    { id: "general" as const, label: t("settings_general"), icon: FileText },
    { id: "shipping" as const, label: "Livraison", icon: Store }, // reusing icon or you can import Truck
    { id: "footer" as const, label: t("settings_footer"), icon: Link2 },
    { id: "security" as const, label: t("settings_security"), icon: Lock },
  ];

  function updateSection(i: number, patch: Partial<FooterSection>) {
    setFooterSections((prev) => prev.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  }
  function updateLink(sectionIdx: number, linkIdx: number, patch: Partial<FooterLink>) {
    setFooterSections((prev) =>
      prev.map((s, i) =>
        i !== sectionIdx ? s : { ...s, links: s.links.map((l, j) => (j === linkIdx ? { ...l, ...patch } : l)) }
      )
    );
  }
  function addSection() {
    setFooterSections((prev) => [...prev, { title_fr: "Nouvelle colonne", title_ar: "", links: [] }]);
  }
  function removeSection(i: number) {
    setFooterSections((prev) => prev.filter((_, j) => j !== i));
  }
  function moveSection(i: number, up: boolean) {
    const j = up ? i - 1 : i + 1;
    if (j < 0 || j >= footerSections.length) return;
    setFooterSections((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  function addLink(sectionIdx: number) {
    setFooterSections((prev) =>
      prev.map((s, i) => (i !== sectionIdx ? s : { ...s, links: [...s.links, { label_fr: "Lien", label_ar: "", url: "#" }] }))
    );
  }
  function removeLink(sectionIdx: number, linkIdx: number) {
    setFooterSections((prev) =>
      prev.map((s, i) => (i !== sectionIdx ? s : { ...s, links: s.links.filter((_, j) => j !== linkIdx) }))
    );
  }
  function moveLink(sectionIdx: number, linkIdx: number, up: boolean) {
    const links = footerSections[sectionIdx]?.links ?? [];
    const j = up ? linkIdx - 1 : linkIdx + 1;
    if (j < 0 || j >= links.length) return;
    setFooterSections((prev) =>
      prev.map((s, i) => {
        if (i !== sectionIdx) return s;
        const next = [...s.links];
        [next[linkIdx], next[j]] = [next[j], next[linkIdx]];
        return { ...s, links: next };
      })
    );
  }
  async function handleFooterSave() {
    setFooterSaving(true);
    setFooterSaveSuccess(false);
    const result = await updateSiteSettings({ footer_sections: footerSections });
    setFooterSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(t("settings_footer_saved"));
    setFooterSaveSuccess(true);
    router.refresh();
    setTimeout(() => setFooterSaveSuccess(false), 3000);
  }

  async function handleShippingSave() {
    setShippingSaving(true);
    setShippingSuccess(false);
    const result = await updateShippingRates(shippingRates);
    setShippingSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Frais de livraison sauvegardés.");
    setShippingSuccess(true);
    setTimeout(() => setShippingSuccess(false), 3000);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    const form = e.currentTarget;
    const result = await updateSiteSettings({
      site_title: (form.elements.namedItem("site_title") as HTMLInputElement).value,
      logo_url: (form.elements.namedItem("logo_url") as HTMLInputElement).value || undefined,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      address: (form.elements.namedItem("address") as HTMLInputElement).value,
      whatsapp: (form.elements.namedItem("whatsapp") as HTMLInputElement).value || undefined,
      admin_notification_email: (form.elements.namedItem("admin_notification_email") as HTMLInputElement).value || undefined,
      tagline: (form.elements.namedItem("tagline") as HTMLTextAreaElement).value,
      copyright_text: (form.elements.namedItem("copyright_text") as HTMLInputElement).value,
      free_delivery_threshold_dzd: parseInt(
        (form.elements.namedItem("free_delivery_threshold_dzd") as HTMLInputElement).value,
        10
      ),
      primary_color: (() => {
        const v = (form.elements.namedItem("primary_color") as HTMLInputElement)?.value?.trim();
        if (!v) return undefined;
        return /^#[0-9A-Fa-f]{6}$/.test(v) ? v : /^[0-9A-Fa-f]{6}$/.test(v) ? "#" + v : undefined;
      })(),
      primary_hover_color: (() => {
        const v = (form.elements.namedItem("primary_hover_color") as HTMLInputElement)?.value?.trim();
        if (!v) return undefined;
        return /^#[0-9A-Fa-f]{6}$/.test(v) ? v : /^[0-9A-Fa-f]{6}$/.test(v) ? "#" + v : undefined;
      })(),
    });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      toast.error(result.error);
      return;
    }
    setSuccess(true);
    toast.success(t("settings_saved"));
    router.refresh();
    setTimeout(() => setSuccess(false), 3000);
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    setPasswordLoading(true);
    const form = e.currentTarget;
    const result = await changePassword({
      currentPassword: (form.elements.namedItem("currentPassword") as HTMLInputElement).value,
      newPassword: (form.elements.namedItem("newPassword") as HTMLInputElement).value,
      confirmPassword: (form.elements.namedItem("confirmPassword") as HTMLInputElement).value,
    });
    setPasswordLoading(false);
    if (result.error) {
      setPasswordError(result.error);
      toast.error(result.error);
      return;
    }
    setPasswordSuccess(true);
    toast.success(t("settings_password_updated"));
    (form as HTMLFormElement).reset();
    setTimeout(() => setPasswordSuccess(false), 3000);
  }

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(false);
    setEmailLoading(true);
    const form = e.currentTarget;
    const result = await changeEmail({
      currentPassword: (form.elements.namedItem("emailCurrentPassword") as HTMLInputElement).value,
      newEmail: (form.elements.namedItem("newEmail") as HTMLInputElement).value.trim(),
      confirmEmail: (form.elements.namedItem("confirmEmail") as HTMLInputElement).value.trim(),
    });
    setEmailLoading(false);
    if (result.error) {
      setEmailError(result.error);
      toast.error(result.error);
      return;
    }
    setEmailSuccess(true);
    toast.success(t("settings_email_updated"));
    (form as HTMLFormElement).reset();
    router.refresh();
    setTimeout(() => setEmailSuccess(false), 3000);
  }

  return (
    <div className="flex flex-col gap-8 p-4 lg:p-8">
      {/* Page Header - Structured Clarity style */}
      <header className="mb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--dash-text-main)]">
              {t("settings_title")}
            </h2>
            <p className="mt-1 text-sm text-[var(--dash-text-muted)]" title={t("hint_parametres")}>
              {t("settings_subtitle")}
            </p>
          </div>
          {(activeTab === "contact" || activeTab === "apparence" || activeTab === "general") && (
            <div className="hidden sm:flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-[var(--dash-text-muted)] bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                {t("settings_cancel")}
              </button>
              <button
                type="submit"
                form="settings-main-form"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--dash-primary)] rounded-lg hover:bg-[var(--dash-primary-hover)] shadow-lg shadow-[var(--dash-primary)]/25 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {t("settings_save")}
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Structured Clarity style */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 sticky top-8 h-[calc(100vh-6rem)]">
          <nav className="space-y-1" aria-label="Sections des paramètres">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-4 py-3 w-full text-left font-medium rounded-lg border-l-4 transition-all ${activeTab === id
                    ? "bg-[var(--dash-primary)]/10 text-[var(--dash-primary)] border-[var(--dash-primary)]"
                    : "text-[var(--dash-text-muted)] hover:text-[var(--dash-primary)] hover:bg-[var(--dash-surface)] border-transparent"
                  }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile tabs */}
        <div className="flex lg:hidden gap-1 overflow-x-auto pb-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === id
                  ? "bg-[var(--dash-primary)]/10 text-[var(--dash-primary)]"
                  : "text-[var(--dash-text-muted)] hover:bg-gray-100"
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <main className="flex-1 min-w-0">
          <div className="rounded-xl border border-[var(--dash-border)] overflow-hidden shadow-sm bg-[var(--dash-surface)]">
            <form
              id="settings-main-form"
              onSubmit={handleSubmit}
              className="p-6 lg:p-8 space-y-6"
            >
              {(activeTab === "contact" || activeTab === "apparence" || activeTab === "general") && (
                <>
                  {error && (
                    <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg mb-4">
                      {error}
                    </p>
                  )}
                  {success && (
                    <p className="text-sm text-green-800 bg-green-50 p-3 rounded-lg mb-4">
                      {t("settings_saved")}
                    </p>
                  )}
                </>
              )}

              {/* Contact - Store Profile card style */}
              <div className={activeTab !== "contact" ? "hidden" : ""}>
                <section className="rounded-xl border border-[var(--dash-border)]/50 p-6 lg:p-8 mb-6 bg-[var(--dash-surface)]">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--dash-border)]">
                    <div className="p-2 bg-[var(--dash-primary)]/10 rounded-lg text-[var(--dash-primary)]">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--dash-text-main)]">
                        {t("settings_contact")}
                      </h3>
                      <p className="text-xs text-[var(--dash-text-muted)] uppercase tracking-wider font-semibold">
                        Informations de base
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label htmlFor="site_title" className="block text-xs font-semibold uppercase tracking-wide text-[var(--dash-text-muted)] mb-2">
                        Nom du site / boutique
                      </label>
                      <input
                        id="site_title"
                        name="site_title"
                        type="text"
                        defaultValue={settings.site_title ?? "Sani Modern OEB"}
                        placeholder="Sani Modern OEB"
                        className="block w-full rounded-lg border-[var(--dash-border)] bg-gray-50 py-2.5 pl-4 pr-10 text-[var(--dash-text-main)] focus:border-[var(--dash-primary)] focus:ring-[var(--dash-primary)] text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="logo_url" className="block text-xs font-semibold uppercase tracking-wide text-[var(--dash-text-muted)] mb-2">
                        Logo (URL)
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="logo_url"
                          name="logo_url"
                          type="url"
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          placeholder="/logo.png ou https://..."
                          className="block flex-1 rounded-lg border-[var(--dash-border)] bg-gray-50 py-2.5 pl-4 text-[var(--dash-text-main)] focus:border-[var(--dash-primary)] focus:ring-[var(--dash-primary)] text-sm transition-colors"
                        />
                        <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--dash-border)] bg-gray-50 hover:bg-gray-100 cursor-pointer text-sm font-medium text-[var(--dash-text-main)]">
                          <ImageIcon className="w-4 h-4" />
                          {logoUploading ? "…" : "Importer"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            className="sr-only"
                            disabled={logoUploading}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setLogoUploading(true);
                              const fd = new FormData();
                              fd.set("file", file);
                              const res = await uploadSiteLogo(fd);
                              setLogoUploading(false);
                              if (res.url) {
                                setLogoUrl(res.url);
                                toast.success("Logo importé.");
                              } else if (res.error) toast.error(res.error);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                      <p className="mt-1 text-xs text-[var(--dash-text-muted)]">
                        Laissez vide pour utiliser /logo.png par défaut.
                      </p>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wide text-[var(--dash-text-muted)] mb-2">
                        {t("settings_phone")}
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        defaultValue={settings.phone ?? ""}
                        placeholder="+213 (0) 34 56 78 90"
                        className="block w-full rounded-lg border-[var(--dash-border)] bg-gray-50 py-2.5 pl-4 pr-10 text-[var(--dash-text-main)] focus:border-[var(--dash-primary)] focus:ring-[var(--dash-primary)] text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide text-[var(--dash-text-muted)] mb-2">
                        {t("settings_email")}
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={settings.email ?? ""}
                        placeholder="contact@sanimodern.dz"
                        className="block w-full rounded-lg border-[var(--dash-border)] bg-gray-50 py-2.5 pl-4 pr-10 text-[var(--dash-text-main)] focus:border-[var(--dash-primary)] focus:ring-[var(--dash-primary)] text-sm transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-xs font-semibold uppercase tracking-wide text-[var(--dash-text-muted)] mb-2">
                        {t("settings_address")}
                      </label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        defaultValue={settings.address ?? ""}
                        placeholder="Oum El Bouaghi, Algérie"
                        className="block w-full rounded-lg border-[var(--dash-border)] bg-gray-50 py-2.5 pl-4 pr-10 text-[var(--dash-text-main)] focus:border-[var(--dash-primary)] focus:ring-[var(--dash-primary)] text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="whatsapp" className="block text-xs font-semibold uppercase tracking-wide text-[var(--dash-text-muted)] mb-2">
                        {t("settings_whatsapp")}
                      </label>
                      <input
                        id="whatsapp"
                        name="whatsapp"
                        type="text"
                        defaultValue={settings.whatsapp ?? ""}
                        placeholder="+213555123456"
                        className="block w-full rounded-lg border-[var(--dash-border)] bg-gray-50 py-2.5 pl-4 pr-10 text-[var(--dash-text-main)] focus:border-[var(--dash-primary)] focus:ring-[var(--dash-primary)] text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="admin_notification_email" className="block text-xs font-semibold uppercase tracking-wide text-[var(--dash-text-muted)] mb-2">
                        {t("settings_admin_notification_email")}
                      </label>
                      <input
                        id="admin_notification_email"
                        name="admin_notification_email"
                        type="email"
                        defaultValue={settings.admin_notification_email ?? ""}
                        placeholder="admin@example.com"
                        className="block w-full rounded-lg border-[var(--dash-border)] bg-gray-50 py-2.5 pl-4 pr-10 text-[var(--dash-text-main)] focus:border-[var(--dash-primary)] focus:ring-[var(--dash-primary)] text-sm transition-colors"
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* Apparence - Branding card style */}
              <div className={activeTab !== "apparence" ? "hidden" : ""}>
                <section className="rounded-xl border border-[var(--dash-border)]/50 p-6 lg:p-8 mb-6 bg-[var(--dash-surface)]">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--dash-border)]">
                    <div className="p-2 bg-[var(--dash-primary)]/10 rounded-lg text-[var(--dash-primary)]">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--dash-text-main)]">
                        Apparence
                      </h3>
                      <p className="text-xs text-[var(--dash-text-muted)] uppercase tracking-wider font-semibold">
                        Couleurs du site
                      </p>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--dash-text-muted)] mb-2">
                        Couleur principale
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          id="primary_color_picker"
                          type="color"
                          defaultValue={(settings as { primary_color?: string }).primary_color ?? "#059669"}
                          className="h-12 w-12 rounded-lg border border-[var(--dash-border)] cursor-pointer p-1 bg-transparent"
                          onChange={(e) => {
                            const text = document.getElementById("primary_color") as HTMLInputElement;
                            if (text) text.value = e.target.value.replace(/^#/, "");
                          }}
                        />
                        <div className="flex-1 max-w-xs">
                          <div className="relative rounded-lg">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--dash-text-muted)] text-sm">#</span>
                            <input
                              id="primary_color"
                              name="primary_color"
                              type="text"
                              defaultValue={((settings as { primary_color?: string }).primary_color ?? "#059669").replace(/^#/, "")}
                              placeholder="059669"
                              className="block w-full rounded-lg border-[var(--dash-border)] bg-gray-50 pl-7 py-2.5 text-[var(--dash-text-main)] uppercase text-sm focus:border-[var(--dash-primary)] focus:ring-[var(--dash-primary)]"
                              onChange={(e) => {
                                const v = e.target.value.replace(/^#/, "");
                                const picker = document.getElementById("primary_color_picker") as HTMLInputElement;
                                if (picker && /^[0-9A-Fa-f]{6}$/.test(v)) picker.value = "#" + v;
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-[var(--dash-text-muted)]">
                        Utilisée pour les boutons, liens et accents du site.
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--dash-text-muted)] mb-2">
                        Couleur principale (au survol)
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          id="primary_hover_picker"
                          type="color"
                          defaultValue={(settings as { primary_hover_color?: string }).primary_hover_color ?? "#047857"}
                          className="h-12 w-12 rounded-lg border border-[var(--dash-border)] cursor-pointer p-1 bg-transparent"
                          onChange={(e) => {
                            const text = document.getElementById("primary_hover_color") as HTMLInputElement;
                            if (text) text.value = e.target.value.replace(/^#/, "");
                          }}
                        />
                        <div className="flex-1 max-w-xs">
                          <div className="relative rounded-lg">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--dash-text-muted)] text-sm">#</span>
                            <input
                              id="primary_hover_color"
                              name="primary_hover_color"
                              type="text"
                              defaultValue={((settings as { primary_hover_color?: string }).primary_hover_color ?? "#047857").replace(/^#/, "")}
                              placeholder="047857"
                              className="block w-full rounded-lg border-[var(--dash-border)] bg-gray-50 pl-7 py-2.5 text-[var(--dash-text-main)] uppercase text-sm focus:border-[var(--dash-primary)] focus:ring-[var(--dash-primary)]"
                              onChange={(e) => {
                                const v = e.target.value.replace(/^#/, "");
                                if (/^[0-9A-Fa-f]{6}$/.test(v)) {
                                  const picker = document.getElementById("primary_hover_picker") as HTMLInputElement;
                                  if (picker) picker.value = "#" + v;
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* General - card style */}
              <div className={activeTab !== "general" ? "hidden" : ""}>
                <section className="rounded-xl border border-[var(--dash-border)]/50 p-6 lg:p-8 mb-6 bg-[var(--dash-surface)]">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--dash-border)]">
                    <div className="p-2 bg-[var(--dash-primary)]/10 rounded-lg text-[var(--dash-primary)]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--dash-text-main)]">
                        {t("settings_general")}
                      </h3>
                      <p className="text-xs text-[var(--dash-text-muted)] uppercase tracking-wider font-semibold">
                        Texte et options
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="md:col-span-2">
                      <label htmlFor="tagline" className="block text-xs font-semibold uppercase tracking-wide text-[var(--dash-text-muted)] mb-2">
                        {t("settings_tagline")}
                      </label>
                      <textarea
                        id="tagline"
                        name="tagline"
                        rows={3}
                        defaultValue={settings.tagline ?? ""}
                        className="block w-full rounded-lg border-[var(--dash-border)] bg-gray-50 py-2.5 pl-4 text-[var(--dash-text-main)] text-sm focus:border-[var(--dash-primary)] focus:ring-[var(--dash-primary)] resize-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="copyright_text" className="block text-xs font-semibold uppercase tracking-wide text-[var(--dash-text-muted)] mb-2">
                        {t("settings_copyright")}
                      </label>
                      <input
                        id="copyright_text"
                        name="copyright_text"
                        type="text"
                        defaultValue={settings.copyright_text ?? ""}
                        placeholder="© 2025 Sani Modern OEB"
                        className="block w-full rounded-lg border-[var(--dash-border)] bg-gray-50 py-2.5 pl-4 text-[var(--dash-text-main)] text-sm focus:border-[var(--dash-primary)] focus:ring-[var(--dash-primary)]"
                      />
                    </div>
                    <div>
                      <label htmlFor="free_delivery_threshold_dzd" className="block text-xs font-semibold uppercase tracking-wide text-[var(--dash-text-muted)] mb-2">
                        {t("settings_free_delivery")}
                      </label>
                      <input
                        id="free_delivery_threshold_dzd"
                        name="free_delivery_threshold_dzd"
                        type="number"
                        min={0}
                        step={1000}
                        defaultValue={settings.free_delivery_threshold_dzd ?? 75000}
                        className="block w-full rounded-lg border-[var(--dash-border)] bg-gray-50 py-2.5 pl-4 text-[var(--dash-text-main)] text-sm focus:border-[var(--dash-primary)] focus:ring-[var(--dash-primary)]"
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* Livraison - Shipping Settings */}
              <div className={activeTab !== "shipping" ? "hidden" : ""}>
                <section className="rounded-xl border border-[var(--dash-border)]/50 p-6 lg:p-8 mb-6 bg-[var(--dash-surface)]">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--dash-border)]">
                    <div className="p-2 bg-[var(--dash-primary)]/10 rounded-lg text-[var(--dash-primary)]">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--dash-text-main)]">
                        Frais de Livraison
                      </h3>
                      <p className="text-xs text-[var(--dash-text-muted)] uppercase tracking-wider font-semibold">
                        Tarifs par Wilaya (DA)
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-[var(--dash-text-muted)]">
                      Fixez le prix de livraison pour chaque wilaya. Laissez 0 pour une livraison gratuite. Ces frais s&apos;ajouteront automatiquement dans le panier et lors de la commande.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1 pr-4 custom-scrollbar">
                    {WILAYAS.map((wilaya) => (
                      <div key={wilaya} className="flex flex-col">
                        <label className="text-xs font-semibold uppercase tracking-wide text-[var(--dash-text-muted)] mb-1">
                          {wilaya}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min={0}
                            step={100}
                            value={shippingRates[wilaya] ?? 0}
                            onChange={(e) => setShippingRates({ ...shippingRates, [wilaya]: parseInt(e.target.value) || 0 })}
                            className="block w-full rounded-lg border-[var(--dash-border)] bg-gray-50 py-2.5 pl-3 pr-10 text-[var(--dash-text-main)] text-sm focus:border-[var(--dash-primary)] focus:ring-[var(--dash-primary)]"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] text-sm">DA</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button type="button" onClick={handleShippingSave} disabled={shippingSaving} className="px-4 py-2 rounded-xl bg-[var(--dash-primary)] text-white font-semibold flex items-center gap-2 hover:bg-[var(--dash-primary-hover)] disabled:opacity-50 transition-colors shadow-lg shadow-[var(--dash-primary)]/20">
                      <Save className="w-4 h-4" />
                      {shippingSaving ? "…" : "Sauvegarder"}
                    </button>
                    {shippingSuccess && <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">Frais sauvegardés.</span>}
                  </div>
                </section>
              </div>

              {(activeTab === "contact" || activeTab === "apparence" || activeTab === "general") && (
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--dash-primary)] rounded-lg hover:bg-[var(--dash-primary-hover)] shadow-lg shadow-[var(--dash-primary)]/25 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "…" : t("settings_save")}
                  </button>
                </div>
              )}
            </form>

            {/* Mobile sticky bottom bar */}
            {(activeTab === "contact" || activeTab === "apparence" || activeTab === "general") && (
              <>
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--dash-surface)] border-t border-[var(--dash-border)] sm:hidden flex gap-3 z-10">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 px-4 py-3 text-sm font-medium text-[var(--dash-text-muted)] border border-[var(--dash-border)] rounded-lg shadow-sm"
                  >
                    {t("settings_cancel")}
                  </button>
                  <button
                    type="submit"
                    form="settings-main-form"
                    disabled={loading}
                    className="flex-1 px-4 py-3 text-sm font-medium text-white bg-[var(--dash-primary)] rounded-lg shadow-lg shadow-[var(--dash-primary)]/25"
                  >
                    {loading ? "…" : t("settings_save")}
                  </button>
                </div>
                <div className="h-20 sm:hidden" />
              </>
            )}

            {/* Footer - visible when tab footer */}
            {activeTab === "footer" && (
              <div className="p-6 lg:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--dash-border)]">
                  <div className="p-2 bg-[var(--dash-primary)]/10 rounded-lg text-[var(--dash-primary)]">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--dash-text-main)]">
                      {t("settings_footer")}
                    </h3>
                    <p className="text-xs text-[var(--dash-text-muted)] uppercase tracking-wider font-semibold">
                      Colonnes et liens
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Organisez les colonnes du pied de page du site. Chaque colonne a un titre (FR/AR) et une liste de liens (libellé + URL).
                  </p>
                  {footerSections.map((section, sectionIdx) => (
                    <div
                      key={sectionIdx}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4 bg-slate-50/30 dark:bg-slate-800/20"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Colonne {sectionIdx + 1}</span>
                        <div className="flex gap-1 ml-auto">
                          <button type="button" onClick={() => moveSection(sectionIdx, true)} disabled={sectionIdx === 0} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40" aria-label={t("settings_footer_move_up")}><ChevronUp className="w-4 h-4" /></button>
                          <button type="button" onClick={() => moveSection(sectionIdx, false)} disabled={sectionIdx === footerSections.length - 1} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40" aria-label={t("settings_footer_move_down")}><ChevronDown className="w-4 h-4" /></button>
                          <button type="button" onClick={() => removeSection(sectionIdx)} className="p-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" aria-label={t("settings_footer_remove")}><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t("settings_footer_section_title_fr")}</label>
                          <input
                            value={section.title_fr}
                            onChange={(e) => updateSection(sectionIdx, { title_fr: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t("settings_footer_section_title_ar")}</label>
                          <input
                            value={section.title_ar ?? ""}
                            onChange={(e) => updateSection(sectionIdx, { title_ar: e.target.value || undefined })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white text-sm"
                            dir="rtl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Liens</span>
                          <button type="button" onClick={() => addLink(sectionIdx)} className="text-xs font-medium text-[var(--dash-primary)] hover:underline flex items-center gap-1">
                            <Plus className="w-3.5 h-3.5" /> {t("settings_footer_add_link")}
                          </button>
                        </div>
                        {section.links.map((link, linkIdx) => (
                          <div key={linkIdx} className="flex flex-wrap items-start gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-[#0d1b1b]">
                            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input placeholder="Libellé FR" value={link.label_fr} onChange={(e) => updateLink(sectionIdx, linkIdx, { label_fr: e.target.value })} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white text-sm" />
                              <input placeholder="Libellé AR" value={link.label_ar ?? ""} onChange={(e) => updateLink(sectionIdx, linkIdx, { label_ar: e.target.value || undefined })} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white text-sm" dir="rtl" />
                              <input placeholder="/page ou https://..." value={link.url} onChange={(e) => updateLink(sectionIdx, linkIdx, { url: e.target.value })} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white text-sm" />
                            </div>
                            <div className="flex gap-1">
                              <button type="button" onClick={() => moveLink(sectionIdx, linkIdx, true)} disabled={linkIdx === 0} className="p-1.5 rounded border border-slate-200 dark:border-slate-600 text-slate-500 disabled:opacity-40" aria-label={t("settings_footer_move_up")}><ChevronUp className="w-4 h-4" /></button>
                              <button type="button" onClick={() => moveLink(sectionIdx, linkIdx, false)} disabled={linkIdx === section.links.length - 1} className="p-1.5 rounded border border-slate-200 dark:border-slate-600 text-slate-500 disabled:opacity-40" aria-label={t("settings_footer_move_down")}><ChevronDown className="w-4 h-4" /></button>
                              <button type="button" onClick={() => removeLink(sectionIdx, linkIdx)} className="p-1.5 rounded border border-red-200 dark:border-red-800 text-red-500" aria-label={t("settings_footer_remove")}><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-wrap items-center gap-3">
                    <button type="button" onClick={addSection} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                      <Plus className="w-4 h-4 inline-block mr-1.5 align-middle" /> {t("settings_footer_add_section")}
                    </button>
                    <button type="button" onClick={handleFooterSave} disabled={footerSaving} className="px-4 py-2 rounded-xl bg-[var(--dash-primary)] text-white font-semibold text-sm hover:bg-[var(--dash-primary-hover)] disabled:opacity-50">
                      {footerSaving ? "…" : t("settings_footer_save")}
                    </button>
                    {footerSaveSuccess && <span className="text-sm text-green-700 dark:text-green-300">{t("settings_footer_saved")}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Security - visible when tab security */}
            {activeTab === "security" && (
              <div className="p-6 lg:p-8 space-y-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--dash-border)]">
                  <div className="p-2 bg-[var(--dash-primary)]/10 rounded-lg text-[var(--dash-primary)]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--dash-text-main)]">
                      {t("settings_security")}
                    </h3>
                    <p className="text-xs text-[var(--dash-text-muted)] uppercase tracking-wider font-semibold">
                      Mot de passe et compte
                    </p>
                  </div>
                </div>
                <div className="space-y-8">
                  {/* Admin account - Change email */}
                  {adminEmail && (
                    <div>
                      <h3 className="font-medium text-[#1E293B] dark:text-white flex items-center gap-2 mb-4">
                        <Mail className="w-4 h-4 text-[var(--dash-primary)]" />
                        {t("settings_admin_account")}
                      </h3>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                        {t("settings_current_email")}: <strong className="text-[#1E293B] dark:text-white">{adminEmail}</strong>
                      </p>
                      <form onSubmit={handleEmailSubmit} className="space-y-4 max-w-md">
                        {emailError && (
                          <p className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                            {emailError}
                          </p>
                        )}
                        {emailSuccess && (
                          <p className="text-sm text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
                            {t("settings_email_updated")}
                          </p>
                        )}
                        <div>
                          <label htmlFor="newEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            {t("settings_new_email")}
                          </label>
                          <input
                            id="newEmail"
                            name="newEmail"
                            type="email"
                            required
                            autoComplete="email"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[var(--dash-primary)] outline-none transition"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirmEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            {t("settings_confirm_email")}
                          </label>
                          <input
                            id="confirmEmail"
                            name="confirmEmail"
                            type="email"
                            required
                            autoComplete="email"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[var(--dash-primary)] outline-none transition"
                          />
                        </div>
                        <div>
                          <label htmlFor="emailCurrentPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            {t("settings_current_password")}
                          </label>
                          <input
                            id="emailCurrentPassword"
                            name="emailCurrentPassword"
                            type="password"
                            required
                            minLength={8}
                            autoComplete="current-password"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[var(--dash-primary)] outline-none transition"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={emailLoading}
                          className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                        >
                          {emailLoading ? "…" : t("settings_change_email")}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Change password */}
                  <div>
                    <h3 className="font-medium text-[#1E293B] dark:text-white mb-4">{t("settings_change_password")}</h3>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                      {passwordError && (
                        <p className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                          {passwordError}
                        </p>
                      )}
                      {passwordSuccess && (
                        <p className="text-sm text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
                          {t("settings_password_updated")}
                        </p>
                      )}
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          {t("settings_current_password")}
                        </label>
                        <input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          required
                          minLength={8}
                          autoComplete="current-password"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[var(--dash-primary)] outline-none transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          {t("settings_new_password")} ({t("settings_password_min")})
                        </label>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          required
                          minLength={8}
                          autoComplete="new-password"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[var(--dash-primary)] outline-none transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          {t("settings_confirm_password")}
                        </label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          required
                          minLength={8}
                          autoComplete="new-password"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[var(--dash-primary)] outline-none transition"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                      >
                        {passwordLoading ? "…" : t("settings_change_password")}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
