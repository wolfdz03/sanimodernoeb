"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Phone, FileText, Lock, Palette, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { updateSiteSettings } from "@/app/actions/settings";
import { changePassword, changeEmail } from "@/app/actions/auth";
import type { SiteSettings } from "@/lib/site-settings";

interface SettingsFormProps {
  settings: SiteSettings & { has_resend_key?: boolean; has_mistral_key?: boolean; resend_api_key?: string; mistral_api_key?: string };
  adminEmail: string | null;
}

export function SettingsForm({ settings, adminEmail }: SettingsFormProps) {
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    const form = e.currentTarget;
    const result = await updateSiteSettings({
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
      primary_color: (form.elements.namedItem("primary_color") as HTMLInputElement)?.value || undefined,
      primary_hover_color: (form.elements.namedItem("primary_hover_color") as HTMLInputElement)?.value || undefined,
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
    <div className="space-y-8 max-w-2xl">
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {error && (
        <p className="text-sm text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-300 p-3 rounded-xl">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
          {t("settings_saved")}
        </p>
      )}

      {/* Contact */}
      <div className="bg-white dark:bg-[#0d1b1b] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
          <h2 className="font-semibold text-[#1E293B] dark:text-white flex items-center gap-2" title={t("hint_parametres")}>
            <Phone className="w-5 h-5 text-[#13ecec]" />
            {t("settings_contact")}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("settings_phone")}
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              defaultValue={settings.phone ?? ""}
              placeholder="+213 (0) 34 56 78 90"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white placeholder:text-[var(--text-muted)] focus:border-[#13ecec] outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("settings_email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={settings.email ?? ""}
              placeholder="contact@sanimodern.dz"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white placeholder:text-[var(--text-muted)] focus:border-[#13ecec] outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("settings_address")}
            </label>
            <input
              id="address"
              name="address"
              type="text"
              defaultValue={settings.address ?? ""}
              placeholder="Oum El Bouaghi, Algérie"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white placeholder:text-[var(--text-muted)] focus:border-[#13ecec] outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("settings_whatsapp")}
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="text"
              defaultValue={settings.whatsapp ?? ""}
              placeholder="+213555123456"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white placeholder:text-[var(--text-muted)] focus:border-[#13ecec] outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="admin_notification_email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("settings_admin_notification_email")}
            </label>
            <input
              id="admin_notification_email"
              name="admin_notification_email"
              type="email"
              defaultValue={settings.admin_notification_email ?? ""}
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white placeholder:text-[var(--text-muted)] focus:border-[#13ecec] outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Apparence - Couleurs */}
      <div className="bg-white dark:bg-[#0d1b1b] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
          <h2 className="font-semibold text-[#1E293B] dark:text-white flex items-center gap-2" title="Couleurs de la page d'accueil et des boutons principaux.">
            <Palette className="w-5 h-5 text-[#13ecec]" />
            Apparence
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="primary_color" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Couleur principale
            </label>
            <div className="flex items-center gap-3">
              <input
                id="primary_color_picker"
                type="color"
                defaultValue={(settings as { primary_color?: string }).primary_color ?? "#DC2626"}
                className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0"
                onChange={(e) => {
                  const text = document.getElementById("primary_color") as HTMLInputElement;
                  if (text) text.value = e.target.value;
                }}
              />
              <input
                id="primary_color"
                name="primary_color"
                type="text"
                defaultValue={(settings as { primary_color?: string }).primary_color ?? "#DC2626"}
                placeholder="#DC2626"
                className="w-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[#13ecec] outline-none transition"
                onChange={(e) => {
                  const picker = document.getElementById("primary_color_picker") as HTMLInputElement;
                  if (picker && /^#[0-9A-Fa-f]{6}$/.test(e.target.value)) picker.value = e.target.value;
                }}
              />
            </div>
          </div>
          <div>
            <label htmlFor="primary_hover_color" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Couleur principale (au survol)
            </label>
            <div className="flex items-center gap-3">
              <input
                id="primary_hover_picker"
                type="color"
                defaultValue={(settings as { primary_hover_color?: string }).primary_hover_color ?? "#B91C1C"}
                className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0"
                onChange={(e) => {
                  const text = document.getElementById("primary_hover_color") as HTMLInputElement;
                  if (text) text.value = e.target.value;
                }}
              />
              <input
                id="primary_hover_color"
                name="primary_hover_color"
                type="text"
                defaultValue={(settings as { primary_hover_color?: string }).primary_hover_color ?? "#B91C1C"}
                placeholder="#B91C1C"
                className="w-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[#13ecec] outline-none transition"
                onChange={(e) => {
                  const picker = document.getElementById("primary_hover_picker") as HTMLInputElement;
                  if (picker && /^#[0-9A-Fa-f]{6}$/.test(e.target.value)) picker.value = e.target.value;
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* General */}
      <div className="bg-white dark:bg-[#0d1b1b] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
          <h2 className="font-semibold text-[#1E293B] dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#13ecec]" />
            {t("settings_general")}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="tagline" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("settings_tagline")}
            </label>
            <textarea
              id="tagline"
              name="tagline"
              rows={3}
              defaultValue={settings.tagline ?? ""}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white placeholder:text-[var(--text-muted)] focus:border-[#13ecec] outline-none transition resize-none"
            />
          </div>
          <div>
            <label htmlFor="copyright_text" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("settings_copyright")}
            </label>
            <input
              id="copyright_text"
              name="copyright_text"
              type="text"
              defaultValue={settings.copyright_text ?? ""}
              placeholder="© 2025 Sani Modern OEB"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white placeholder:text-[var(--text-muted)] focus:border-[#13ecec] outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="free_delivery_threshold_dzd" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("settings_free_delivery")}
            </label>
            <input
              id="free_delivery_threshold_dzd"
              name="free_delivery_threshold_dzd"
              type="number"
              min={0}
              step={1000}
              defaultValue={settings.free_delivery_threshold_dzd ?? 75000}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white placeholder:text-[var(--text-muted)] focus:border-[#13ecec] outline-none transition"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-xl bg-[#13ecec] text-[#102222] font-semibold hover:bg-[#0ea5a5] hover:text-white transition-colors disabled:opacity-50"
      >
        {loading ? "…" : t("settings_save")}
      </button>
    </form>

      {/* Security - Admin email + Change password (separate forms so they are not nested) */}
      <div className="bg-white dark:bg-[#0d1b1b] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
          <h2 className="font-semibold text-[#1E293B] dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#13ecec]" />
            {t("settings_security")}
          </h2>
        </div>
        <div className="p-6 space-y-8">
          {/* Admin account - Change email */}
          {adminEmail && (
            <div>
              <h3 className="font-medium text-[#1E293B] dark:text-white flex items-center gap-2 mb-4">
                <Mail className="w-4 h-4 text-[#13ecec]" />
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[#13ecec] outline-none transition"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[#13ecec] outline-none transition"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[#13ecec] outline-none transition"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[#13ecec] outline-none transition"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[#13ecec] outline-none transition"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102222] text-[#1E293B] dark:text-white focus:border-[#13ecec] outline-none transition"
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
    </div>
  );
}
