-- Add optional "old price" for products (promo display: old price strikethrough, new price)
alter table public.products
  add column if not exists price_old_dzd bigint check (price_old_dzd is null or price_old_dzd >= 0);
