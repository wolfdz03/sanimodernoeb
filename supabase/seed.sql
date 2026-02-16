-- Reset and seed database
-- Run via: supabase db reset
-- Or copy this entire file into Supabase SQL Editor and execute

-- 1. Delete all data (order respects foreign keys)
DELETE FROM public.order_items;
DELETE FROM public.orders;
DELETE FROM public.product_variant_options;
DELETE FROM public.product_variants;
DELETE FROM public.product_option_values;
DELETE FROM public.product_option_types;
DELETE FROM public.product_attributes;
DELETE FROM public.products;
DELETE FROM public.categories;
DELETE FROM public.site_content;
DELETE FROM public.site_settings;
DELETE FROM public.admins;

-- 2. Reset sequences if any (for id columns)
-- Categories and products use uuid, no sequence. site_settings uses id=1.

-- 3. Seed categories
INSERT INTO public.categories (name, slug, icon_name, color, bg_color, text_color, sort_order) VALUES
  ('Douches', 'douches', 'ShowerHead', 'from-blue-500 to-blue-600', 'bg-blue-50', 'text-blue-600', 1),
  ('Baignoires', 'baignoires', 'Bath', 'from-red-500 to-red-600', 'bg-red-50', 'text-red-600', 2),
  ('Lavabos', 'lavabos', 'Droplets', 'from-blue-600 to-indigo-600', 'bg-indigo-50', 'text-indigo-600', 3),
  ('Toilettes', 'toilettes', 'Toilet', 'from-slate-600 to-slate-700', 'bg-slate-50', 'text-slate-700', 4),
  ('Robinetterie', 'robinetterie', 'Wrench', 'from-red-600 to-rose-600', 'bg-rose-50', 'text-rose-600', 5),
  ('Accessoires', 'accessoires', 'Sparkles', 'from-blue-500 to-cyan-500', 'bg-cyan-50', 'text-cyan-600', 6);

-- 4. Seed products
INSERT INTO public.products (category_id, name, slug, description, price_dzd, price_old_dzd, image_url, image_urls, badge, badge_color, stock)
SELECT c.id, 'Douche Italienne Moderne', 'douche-italienne-moderne',
  'Douche à l''italienne design contemporain, facile d''entretien.',
  189000, 210000,
  'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop',
  '["https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop"]'::jsonb,
  'Bestseller', 'bg-[#DC2626]', 10
FROM public.categories c WHERE c.slug = 'douches'
UNION ALL
SELECT c.id, 'Baignoire Îlot', 'baignoire-ilot',
  'Baignoire îlot premium pour une expérience spa à la maison.',
  362000, NULL,
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
  '["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop"]'::jsonb,
  'Premium', 'bg-[#2563EB]', 5
FROM public.categories c WHERE c.slug = 'baignoires'
UNION ALL
SELECT c.id, 'Toilette Suspendue', 'toilette-suspendue',
  'Toilette suspendue design, gain de place et hygiène optimale.',
  87000, NULL,
  'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop',
  '["https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop"]'::jsonb,
  'Nouveau', 'bg-[#10B981]', 20
FROM public.categories c WHERE c.slug = 'toilettes'
UNION ALL
SELECT c.id, 'Meuble Vasque Double', 'meuble-vasque-double',
  'Meuble vasque double avec rangements, parfait pour les salles de bain familiales.',
  275000, 310000,
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop',
  '["https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop"]'::jsonb,
  'Populaire', 'bg-[#DC2626]', 8
FROM public.categories c WHERE c.slug = 'lavabos'
UNION ALL
SELECT c.id, 'Système de Douche Thermostatique', 'systeme-douche-thermostatique',
  'Mitigeur thermostatique pour une douche confortable et sécurisée.',
  116000, NULL,
  'https://images.unsplash.com/photo-1603825491103-bd638b1873b0?q=80&w=800&auto=format&fit=crop',
  '["https://images.unsplash.com/photo-1603825491103-bd638b1873b0?q=80&w=800&auto=format&fit=crop"]'::jsonb,
  'Intelligent', 'bg-[#2563EB]', 15
FROM public.categories c WHERE c.slug = 'robinetterie'
UNION ALL
SELECT c.id, 'Pommeau de Douche Pluie', 'pommeau-douche-pluie',
  'Pommeau de douche effet pluie, économie d''eau et confort maximal.',
  43000, 52000,
  'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop',
  '["https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop"]'::jsonb,
  'Promo', 'bg-[#DC2626]', 30
FROM public.categories c WHERE c.slug = 'accessoires'
UNION ALL
SELECT c.id, 'Cabine de Douche d''Angle', 'cabine-douche-angle',
  'Cabine de douche d''angle pour optimiser l''espace de votre salle de bain.',
  232000, NULL,
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop',
  '["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop"]'::jsonb,
  'Nouveau', 'bg-[#10B981]', 12
FROM public.categories c WHERE c.slug = 'douches'
UNION ALL
SELECT c.id, 'Baignoire Balnéo Luxe', 'baignoire-balneo-luxe',
  'Baignoire balnéo haut de gamme avec jets massants.',
  580000, NULL,
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
  '["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop"]'::jsonb,
  'Premium', 'bg-[#2563EB]', 3
FROM public.categories c WHERE c.slug = 'baignoires';

-- 5. Seed site_settings
INSERT INTO public.site_settings (
  id, site_title, logo_url, phone, email, address, tagline, copyright_text, free_delivery_threshold_dzd,
  whatsapp, admin_notification_email, email_from, site_url, resend_api_key, mistral_api_key,
  primary_color, primary_hover_color, footer_sections
) VALUES (
  1,
  'Sani Modern OEB',
  NULL,
  '+213 (0) 34 56 78 90',
  'contact@sanimodern.dz',
  'Oum El Bouaghi, Algérie',
  'Le leader de l''équipement sanitaire moderne en Algérie. Qualité, design et innovation pour votre salle de bain.',
  '© 2025 Sani Modern OEB. Tous droits réservés.',
  75000,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '#DC2626',
  '#B91C1C',
  '[
    {"title_fr":"Navigation","title_ar":"تنقل","links":[
      {"label_fr":"Produits","label_ar":"المنتجات","url":"/produits"},
      {"label_fr":"Nos Showrooms","label_ar":"عارضاتنا","url":"#"},
      {"label_fr":"À propos","label_ar":"من نحن","url":"#about"},
      {"label_fr":"Contact","label_ar":"اتصل","url":"#footer"}
    ]},
    {"title_fr":"Support","title_ar":"الدعم","links":[
      {"label_fr":"Livraison & Retours","label_ar":"التوصيل والمرتجعات","url":"#"},
      {"label_fr":"FAQ","label_ar":"الأسئلة الشائعة","url":"#"},
      {"label_fr":"Garantie","label_ar":"الضمان","url":"#"}
    ]}
  ]'::jsonb
);

-- 6. Seed site_content
INSERT INTO public.site_content (key, value_fr, value_ar) VALUES
  ('hero_title_image', NULL, NULL),
  ('hero_subtitle_image', NULL, NULL),
  ('collection_title_short', NULL, NULL),
  ('collection_see_all', NULL, NULL),
  ('collection_btn', NULL, NULL),
  ('products_page_badge', NULL, NULL),
  ('products_page_title', NULL, NULL),
  ('products_page_subtitle', NULL, NULL),
  ('products_page_empty', NULL, NULL),
  ('categories_badge', NULL, NULL),
  ('categories_title', NULL, NULL),
  ('categories_subtitle', NULL, NULL),
  ('about_title_full', NULL, NULL),
  ('about_para1', NULL, NULL)
ON CONFLICT (key) DO NOTHING;

-- 7. Seed default admin (replace email with yours; you must sign up with this email in Auth first)
-- If you already have an admin, you can skip this or update the email.
INSERT INTO public.admins (email, name) VALUES
  ('admin@example.com', 'Admin')
ON CONFLICT (email) DO NOTHING;
