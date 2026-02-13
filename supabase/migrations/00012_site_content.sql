-- Editable content overrides (homepage, products page). Key -> value per language.
create table if not exists public.site_content (
  key text primary key,
  value_fr text,
  value_ar text,
  updated_at timestamptz not null default now()
);

-- Seed keys for main editable texts
insert into public.site_content (key, value_fr, value_ar) values
  ('hero_title_image', null, null),
  ('hero_subtitle_image', null, null),
  ('collection_title_short', null, null),
  ('collection_see_all', null, null),
  ('collection_btn', null, null),
  ('products_page_badge', null, null),
  ('products_page_title', null, null),
  ('products_page_subtitle', null, null),
  ('products_page_empty', null, null),
  ('categories_badge', null, null),
  ('categories_title', null, null),
  ('categories_subtitle', null, null),
  ('about_title_full', null, null),
  ('about_para1', null, null)
on conflict (key) do nothing;
