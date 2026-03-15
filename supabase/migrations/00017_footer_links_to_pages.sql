-- Point every footer link to its dedicated page (no more # or #about)
update public.site_settings
set footer_sections = '[
  {"title_fr":"Navigation","title_ar":"تنقل","links":[
    {"label_fr":"Produits","label_ar":"المنتجات","url":"/produits"},
    {"label_fr":"Nos Showrooms","label_ar":"عارضاتنا","url":"/showrooms"},
    {"label_fr":"À propos","label_ar":"من نحن","url":"/a-propos"},
    {"label_fr":"Contact","label_ar":"اتصل","url":"#footer"}
  ]},
  {"title_fr":"Support","title_ar":"الدعم","links":[
    {"label_fr":"Livraison & Retours","label_ar":"التوصيل والمرتجعات","url":"/livraison-retours"},
    {"label_fr":"FAQ","label_ar":"الأسئلة الشائعة","url":"/faq"},
    {"label_fr":"Garantie","label_ar":"الضمان","url":"/garantie"}
  ]}
]'::jsonb
where id = 1;
