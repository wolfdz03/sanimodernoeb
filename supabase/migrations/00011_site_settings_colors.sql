-- Editable theme colors for homepage
alter table public.site_settings
  add column if not exists primary_color text default '#DC2626',
  add column if not exists primary_hover_color text default '#B91C1C';
