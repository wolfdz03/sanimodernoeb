-- Ensure primary_color columns exist (fixes "Could not find primary_color" schema cache error)
alter table public.site_settings
  add column if not exists primary_color text default '#DC2626',
  add column if not exists primary_hover_color text default '#B91C1C';
