import { getSession } from "@/lib/session";
import { getSiteSettings } from "@/lib/site-settings";
import { SettingsForm } from "./SettingsForm";

export default async function DashboardSettingsPage() {
  const [session, settings] = await Promise.all([getSession(), getSiteSettings()]);
  const formSettings = {
    ...settings,
    resend_api_key: "",
    mistral_api_key: "",
    has_resend_key: !!(settings.resend_api_key?.trim() || process.env.RESEND_API_KEY),
    has_mistral_key: !!(settings.mistral_api_key?.trim() || process.env.MISTRAL_API_KEY),
  };
  return (
    <div>
      <h1 className="font-bold text-2xl text-[#1E293B] dark:text-white mb-6" title="Ces infos (téléphone, adresse, slogan) s'affichent en bas du site public.">
        Paramètres du site
      </h1>
      <SettingsForm settings={formSettings} adminEmail={session?.email ?? null} />
    </div>
  );
}
