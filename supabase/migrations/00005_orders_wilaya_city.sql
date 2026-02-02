-- Add Algerian wilaya and city to orders.
alter table public.orders
  add column if not exists shipping_wilaya text,
  add column if not exists shipping_city text;
