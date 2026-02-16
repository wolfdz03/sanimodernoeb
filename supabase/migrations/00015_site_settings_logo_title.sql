-- Site title (store name) and logo URL - editable from dashboard settings
alter table public.site_settings
  add column if not exists site_title text default 'Sani Modern OEB',
  add column if not exists logo_url text;

comment on column public.site_settings.site_title is 'Store/site name displayed in nav and dashboard';
comment on column public.site_settings.logo_url is 'Logo image URL (e.g. from storage or external)';
