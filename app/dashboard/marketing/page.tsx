import { getSiteSettings } from "@/lib/site-settings";
import { MarketingForm } from "./MarketingForm";

export default async function DashboardMarketingPage() {
  const settings = await getSiteSettings();
  return (
    <div className="mx-auto max-w-7xl w-full">
      <h1 className="font-bold text-2xl text-[#1E293B] dark:text-white mb-6">
        Marketing et suivi
      </h1>
      <p className="text-[var(--dash-text-muted)] mb-8 max-w-2xl">
        Configurez les outils de suivi (Meta Pixel, Google Analytics 4, Google Tag Manager) sans modifier le code. Les scripts ne sont chargés que si le suivi est activé.
      </p>
      <MarketingForm
        settings={{
          meta_pixel_id: settings.meta_pixel_id,
          ga4_measurement_id: settings.ga4_measurement_id,
          gtm_container_id: settings.gtm_container_id,
          tracking_enabled: settings.tracking_enabled,
        }}
      />
    </div>
  );
}
