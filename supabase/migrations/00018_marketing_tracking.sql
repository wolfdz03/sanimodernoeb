-- Marketing tracking: Meta Pixel, GA4, GTM (editable from dashboard)
alter table public.site_settings
  add column if not exists meta_pixel_id text,
  add column if not exists ga4_measurement_id text,
  add column if not exists gtm_container_id text,
  add column if not exists tracking_enabled boolean default true;
