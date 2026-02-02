-- Run after 00001_initial_schema.sql in Supabase SQL Editor.
-- Seeds categories and products from the original hardcoded data.

insert into public.categories (name, slug, icon_name, color, bg_color, text_color, sort_order) values
  ('Douches', 'douches', 'ShowerHead', 'from-blue-500 to-blue-600', 'bg-blue-50', 'text-blue-600', 1),
  ('Baignoires', 'baignoires', 'Bath', 'from-red-500 to-red-600', 'bg-red-50', 'text-red-600', 2),
  ('Lavabos', 'lavabos', 'Droplets', 'from-blue-600 to-indigo-600', 'bg-indigo-50', 'text-indigo-600', 3),
  ('Toilettes', 'toilettes', 'Toilet', 'from-slate-600 to-slate-700', 'bg-slate-50', 'text-slate-700', 4),
  ('Robinetterie', 'robinetterie', 'Wrench', 'from-red-600 to-rose-600', 'bg-rose-50', 'text-rose-600', 5),
  ('Accessoires', 'accessoires', 'Sparkles', 'from-blue-500 to-cyan-500', 'bg-cyan-50', 'text-cyan-600', 6)
on conflict (slug) do nothing;

insert into public.products (category_id, name, slug, price_dzd, image_url, badge, badge_color, stock)
select c.id, 'Douche Italienne Moderne', 'douche-italienne-moderne', 189000,
  'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop',
  'Bestseller', 'bg-[#DC2626]', 10
from public.categories c where c.slug = 'douches'
union all
select c.id, 'Baignoire Îlot', 'baignoire-ilot', 362000,
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
  'Premium', 'bg-[#2563EB]', 5
from public.categories c where c.slug = 'baignoires'
union all
select c.id, 'Toilette Suspendue', 'toilette-suspendue', 87000,
  'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop',
  'Nouveau', 'bg-[#10B981]', 20
from public.categories c where c.slug = 'toilettes'
union all
select c.id, 'Meuble Vasque Double', 'meuble-vasque-double', 275000,
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop',
  'Populaire', 'bg-[#DC2626]', 8
from public.categories c where c.slug = 'lavabos'
union all
select c.id, 'Système de Douche Thermostatique', 'systeme-douche-thermostatique', 116000,
  'https://images.unsplash.com/photo-1603825491103-bd638b1873b0?q=80&w=800&auto=format&fit=crop',
  'Intelligent', 'bg-[#2563EB]', 15
from public.categories c where c.slug = 'robinetterie'
union all
select c.id, 'Pommeau de Douche Pluie', 'pommeau-douche-pluie', 43000,
  'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop',
  'Promo', 'bg-[#DC2626]', 30
from public.categories c where c.slug = 'accessoires'
union all
select c.id, 'Cabine de Douche d''Angle', 'cabine-douche-angle', 232000,
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop',
  'Nouveau', 'bg-[#10B981]', 12
from public.categories c where c.slug = 'douches'
union all
select c.id, 'Baignoire Balnéo Luxe', 'baignoire-balneo-luxe', 580000,
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
  'Premium', 'bg-[#2563EB]', 3
from public.categories c where c.slug = 'baignoires';
