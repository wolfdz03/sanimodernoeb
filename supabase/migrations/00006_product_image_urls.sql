-- Multiple images per product: store as JSONB array, keep image_url as first for backward compat
alter table public.products
  add column if not exists image_urls jsonb default '[]';

-- Backfill: copy single image_url into image_urls array where we have image_url
update public.products
set image_urls = jsonb_build_array(image_url)
where image_url is not null and image_url != ''
  and (image_urls is null or image_urls = '[]');
