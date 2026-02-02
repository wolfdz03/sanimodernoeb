-- Admins: access is determined only by this table (no link to auth.users).
-- A logged-in user is admin if their email is in this table.
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  created_at timestamptz not null default now()
);

create index if not exists admins_email on public.admins(lower(email));

alter table public.admins enable row level security;

-- Logged-in user can only see if they are in the list (for dashboard access check)
create policy "User can check own admin status"
  on public.admins for select
  using (lower(email) = lower(auth.jwt() ->> 'email'));

-- Only existing admins can insert or delete (manage other admins)
create policy "Admins can insert admins"
  on public.admins for insert
  with check (
    exists (
      select 1 from public.admins a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  );

create policy "Admins can delete admins"
  on public.admins for delete
  using (
    exists (
      select 1 from public.admins a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  );

-- First admin must be added via SQL (run in Supabase SQL Editor as project owner).
-- Example:
--   insert into public.admins (email, name) values ('admin@example.com', 'Admin');
-- Then sign up or log in with that email to access /dashboard.
