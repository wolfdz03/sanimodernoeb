-- Footer link sections: JSONB array of { title_fr, title_ar?, links: [{ label_fr, label_ar?, url }] }
alter table public.site_settings
  add column if not exists footer_sections jsonb not null default '[]';

comment on column public.site_settings.footer_sections is 'Footer columns: array of { title_fr, title_ar?, links: [{ label_fr, label_ar?, url }] }';

-- Seed default sections (Navigation + Support) for existing row
update public.site_settings
set footer_sections = '[
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
where id = 1 and (footer_sections = '[]'::jsonb or footer_sections is null);
