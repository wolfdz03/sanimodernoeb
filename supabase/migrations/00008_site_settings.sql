-- Site settings: contact info and editable config (single row)
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  phone text,
  email text,
  address text,
  tagline text,
  copyright_text text,
  free_delivery_threshold_dzd bigint default 75000,
  whatsapp text,
  updated_at timestamptz not null default now()
);

-- Seed defaults
insert into public.site_settings (id, phone, email, address, tagline, copyright_text, free_delivery_threshold_dzd)
values (
  1,
  '+213 (0) 34 56 78 90',
  'contact@sanimodern.dz',
  'Oum El Bouaghi, Algérie',
  'Le leader de l''équipement sanitaire moderne en Algérie. Qualité, design et innovation pour votre salle de bain.',
  '© 2025 Sani Modern OEB. Tous droits réservés.',
  75000
)
on conflict (id) do nothing;
