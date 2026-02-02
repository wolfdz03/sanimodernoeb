-- Run in Supabase SQL Editor after migrations 00001 through 00004.
-- All auth is in public.users (email + password). No sign-up; login only.

-- Create first user (admin). Replace email and password.
-- Option A: Generate bcrypt hash in project folder: npx bcrypt-cli "YourPassword" 10
--   Then paste the hash below (replace PASTE_HASH_HERE).
-- Option B: Use this SQL (pgcrypto). If login fails, use Option A.
insert into public.users (email, password_hash, full_name, role)
values (
  'admin@example.com',
  crypt('ChangeMe123', gen_salt('bf')),
  'Admin',
  'admin'
)
on conflict (email) do nothing;

-- Add more users (e.g. customer):
-- insert into public.users (email, password_hash, full_name, role)
-- values ('user@example.com', crypt('TheirPassword', gen_salt('bf')), 'User', 'customer')
-- on conflict (email) do nothing;

-- List users (emails only; no password hashes in output):
-- select id, email, full_name, role, created_at from public.users;

-- Remove a user:
-- delete from public.users where email = 'admin@example.com';
