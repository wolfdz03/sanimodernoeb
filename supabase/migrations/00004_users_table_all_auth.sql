-- All auth from one table: public.users (email + password). No sign-up; login only.
-- Run after 00001, 00002, 00003.

create extension if not exists pgcrypto;

-- Single table for all users (login credentials + role)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create index if not exists users_email on public.users(lower(email));

alter table public.users enable row level security;
-- No policies: only service_role (from Next.js server) can read/write users.

-- Drop Supabase Auth–based trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Drop admins table and is_admin (we use users.role now)
drop function if exists public.is_admin();
drop table if exists public.admins;

-- Drop policies that depend on auth.uid() or admins
drop policy if exists "Admins can manage categories" on public.categories;
drop policy if exists "Admins can manage products" on public.products;
drop policy if exists "Admins can update orders" on public.orders;
drop policy if exists "Admins can view all orders" on public.orders;
drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

-- Orders: user_id will reference users(id). Drop old FK to auth.users, add FK to users.
alter table public.orders drop constraint if exists orders_user_id_fkey;
alter table public.orders add constraint orders_user_id_fkey
  foreign key (user_id) references public.users(id) on delete set null;

-- Profiles: replace table (was id -> auth.users). New: user_id -> users.
drop table if exists public.profiles;
create table public.profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  phone text,
  address text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
-- No policies: app uses service_role for profiles.

-- Categories and products: anon can only SELECT (already have those). Dashboard uses service_role for insert/update/delete.
