-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon_name text,
  color text,
  bg_color text,
  text_color text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  price_dzd bigint not null check (price_dzd >= 0),
  image_url text,
  badge text,
  badge_color text default 'bg-[#DC2626]',
  stock int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists products_category_id on public.products(category_id);
create index if not exists products_slug on public.products(slug);

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Orders
create type order_status as enum ('pending', 'paid', 'shipped', 'delivered', 'cancelled');

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status order_status not null default 'pending',
  total_dzd bigint not null check (total_dzd >= 0),
  shipping_name text not null,
  shipping_phone text not null,
  shipping_address text not null,
  shipping_email text,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id on public.orders(user_id);
create index if not exists orders_created_at on public.orders(created_at desc);

-- Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity int not null check (quantity > 0),
  unit_price_dzd bigint not null check (unit_price_dzd >= 0)
);

create index if not exists order_items_order_id on public.order_items(order_id);

-- RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Categories: read all
create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

-- Products: read all
create policy "Products are viewable by everyone"
  on public.products for select
  using (true);

-- Profiles: users can read/update own
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Service role / dashboard will use service key for full CRUD on categories and products; anon can only select.
-- Allow insert on profiles for new signups (trigger or app)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Orders: users can read own; insert allowed for anyone (guest checkout)
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Anyone can create order"
  on public.orders for insert
  with check (true);

create policy "Order items readable with order"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
      and (o.user_id = auth.uid() or o.user_id is null)
    )
  );

create policy "Order items insert with order"
  on public.order_items for insert
  with check (true);

-- Admin: allow full access for categories and products when using service_role key.
-- For anon key we need a different approach: either use service_role in server-only actions for dashboard, or add RLS that checks profiles.role.
-- Here we only allow anon to SELECT categories/products. Dashboard will use service_role key for mutations (create separate server client with service key for admin).
-- So we need one more policy: allow update/delete/insert on products and categories for authenticated users that have role admin. That requires a check on profiles.
create policy "Admins can manage categories"
  on public.categories for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins can manage products"
  on public.products for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins can update orders"
  on public.orders for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
    or user_id = auth.uid()
  );

-- Trigger: create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage bucket for product images (run in Supabase dashboard or via API)
-- insert into storage.buckets (id, name, public) values ('products', 'products', true);
-- create policy "Product images are public" on storage.objects for select using (bucket_id = 'products');
