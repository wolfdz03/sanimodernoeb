"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Megaphone, Save } from "lucide-react";
import { updateSiteSettings } from "@/app/actions/settings";
import type { SiteSettings } from "@/lib/site-settings";

interface MarketingFormProps {
  settings: Pick<
    SiteSettings,
    "meta_pixel_id" | "ga4_measurement_id" | "gtm_container_id" | "tracking_enabled"
  >;
}

export function MarketingForm({ settings }: MarketingFormProps) {
  const router = useRouter();
  const [metaPixelId, setMetaPixelId] = useState(settings.meta_pixel_id ?? "");
  const [ga4Id, setGa4Id] = useState(settings.ga4_measurement_id ?? "");
  const [gtmId, setGtmId] = useState(settings.gtm_container_id ?? "");
  const [trackingEnabled, setTrackingEnabled] = useState(settings.tracking_enabled ?? true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const result = await updateSiteSettings({
      meta_pixel_id: metaPixelId,
      ga4_measurement_id: ga4Id,
      gtm_container_id: gtmId,
      tracking_enabled: trackingEnabled,
    });
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Paramètres marketing enregistrés.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-6 space-y-6">
        <div className="flex items-center gap-2 text-[var(--dash-text-main)]">
          <Megaphone className="w-5 h-5 text-[var(--dash-primary)]" />
          <h2 className="font-semibold text-lg">Suivi et publicité</h2>
        </div>

        <div>
          <label htmlFor="tracking_enabled" className="block text-sm font-medium text-[var(--dash-text-main)] mb-2">
            Activer le suivi
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={trackingEnabled}
            onClick={() => setTrackingEnabled((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
              trackingEnabled ? "bg-[var(--dash-primary)]" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                trackingEnabled ? "translate-x-5" : "translate-x-0.5"
              } mt-0.5`}
            />
          </button>
          <p className="mt-1 text-xs text-[var(--dash-text-muted)]">
            Désactiver pour ne charger aucun script (Meta, GA4, GTM) sur le site.
          </p>
        </div>

        <div>
          <label htmlFor="meta_pixel_id" className="block text-sm font-medium text-[var(--dash-text-main)] mb-1">
            Meta Pixel ID
          </label>
          <input
            id="meta_pixel_id"
            type="text"
            value={metaPixelId}
            onChange={(e) => setMetaPixelId(e.target.value)}
            placeholder="ex: 1234567890123456"
            className="w-full rounded-lg border border-[var(--dash-border)] bg-white px-3 py-2 text-sm text-[var(--dash-text-main)] placeholder:text-gray-400 focus:border-[var(--dash-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--dash-primary)]"
          />
          <p className="mt-1 text-xs text-[var(--dash-text-muted)]">
            ID du pixel Facebook/Meta (Events Manager).
          </p>
        </div>

        <div>
          <label htmlFor="ga4_measurement_id" className="block text-sm font-medium text-[var(--dash-text-main)] mb-1">
            Google Analytics 4 – Measurement ID
          </label>
          <input
            id="ga4_measurement_id"
            type="text"
            value={ga4Id}
            onChange={(e) => setGa4Id(e.target.value)}
            placeholder="ex: G-XXXXXXXXXX"
            className="w-full rounded-lg border border-[var(--dash-border)] bg-white px-3 py-2 text-sm text-[var(--dash-text-main)] placeholder:text-gray-400 focus:border-[var(--dash-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--dash-primary)]"
          />
          <p className="mt-1 text-xs text-[var(--dash-text-muted)]">
            Identifiant de mesure GA4 (Admin → Flux de données).
          </p>
        </div>

        <div>
          <label htmlFor="gtm_container_id" className="block text-sm font-medium text-[var(--dash-text-main)] mb-1">
            Google Tag Manager – Container ID
          </label>
          <input
            id="gtm_container_id"
            type="text"
            value={gtmId}
            onChange={(e) => setGtmId(e.target.value)}
            placeholder="ex: GTM-XXXXXXX"
            className="w-full rounded-lg border border-[var(--dash-border)] bg-white px-3 py-2 text-sm text-[var(--dash-text-main)] placeholder:text-gray-400 focus:border-[var(--dash-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--dash-primary)]"
          />
          <p className="mt-1 text-xs text-[var(--dash-text-muted)]">
            ID du conteneur GTM (format GTM-XXXXXXX).
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--dash-primary)] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {loading ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
