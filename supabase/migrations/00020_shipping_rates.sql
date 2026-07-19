-- Persist delivery prices in the database. Files written at runtime disappear on
-- serverless deployments, so they cannot be used as a source of truth.
alter table public.site_settings
  add column if not exists shipping_rates jsonb not null default '{}'::jsonb;

-- Keep the delivery amount recorded with each order for reporting and auditing.
alter table public.orders
  add column if not exists shipping_cost_dzd bigint not null default 0
  check (shipping_cost_dzd >= 0);
