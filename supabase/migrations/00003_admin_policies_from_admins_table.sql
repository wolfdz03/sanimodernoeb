-- Use public.admins table for admin checks (not profiles.role).
-- Run after 00002_admins_table.sql.

drop policy if exists "Admins can manage categories" on public.categories;
drop policy if exists "Admins can manage products" on public.products;
drop policy if exists "Admins can update orders" on public.orders;
drop policy if exists "Admins can view all orders" on public.orders;

create policy "Admins can manage categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can update orders"
  on public.orders for update
  using (public.is_admin());

create policy "Admins can view all orders"
  on public.orders for select
  using (public.is_admin() or user_id = auth.uid());

-- Helper: true if current user's email is in public.admins
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(auth.jwt() ->> 'email')
  );
$$ language sql security definer stable;
