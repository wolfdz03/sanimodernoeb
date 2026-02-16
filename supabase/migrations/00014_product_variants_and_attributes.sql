-- Product option dimensions (e.g. Taille, Couleur)
create table if not exists public.product_option_types (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  sort_order int not null default 0
);

create index if not exists product_option_types_product_id on public.product_option_types(product_id);

-- Option values per dimension (e.g. 120x80, Blanc)
create table if not exists public.product_option_values (
  id uuid primary key default gen_random_uuid(),
  option_type_id uuid not null references public.product_option_types(id) on delete cascade,
  value text not null,
  sort_order int not null default 0
);

create index if not exists product_option_values_option_type_id on public.product_option_values(option_type_id);

-- Variants: one row per combination (one value per type)
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text unique,
  price_dzd bigint check (price_dzd is null or price_dzd >= 0),
  stock int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_variants_product_id on public.product_variants(product_id);
create unique index if not exists product_variants_sku_not_null on public.product_variants(sku) where sku is not null;

-- Link variant to one value per option type
create table if not exists public.product_variant_options (
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  option_value_id uuid not null references public.product_option_values(id) on delete cascade,
  primary key (variant_id, option_value_id)
);

create index if not exists product_variant_options_variant_id on public.product_variant_options(variant_id);
create index if not exists product_variant_options_option_value_id on public.product_variant_options(option_value_id);

-- Product attributes (specs): name/value pairs
create table if not exists public.product_attributes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  value text not null,
  sort_order int not null default 0
);

create index if not exists product_attributes_product_id on public.product_attributes(product_id);

-- Order items: add variant reference for display
alter table public.order_items
  add column if not exists variant_id uuid references public.product_variants(id) on delete set null,
  add column if not exists variant_label text;

-- RLS: allow read for everyone; mutations via service_role (dashboard)
alter table public.product_option_types enable row level security;
alter table public.product_option_values enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_variant_options enable row level security;
alter table public.product_attributes enable row level security;

create policy "Product option types are viewable by everyone"
  on public.product_option_types for select using (true);

create policy "Product option values are viewable by everyone"
  on public.product_option_values for select using (true);

create policy "Product variants are viewable by everyone"
  on public.product_variants for select using (true);

create policy "Product variant options are viewable by everyone"
  on public.product_variant_options for select using (true);

create policy "Product attributes are viewable by everyone"
  on public.product_attributes for select using (true);
