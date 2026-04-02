-- Per-category product order + unique public slugs (category-0001-name)

alter table public.products
  add column if not exists category_sequence int;

-- Assign 1..n per category (and one bucket for uncategorized), oldest first
with ranked as (
  select
    id,
    row_number() over (
      partition by coalesce(category_id::text, '')
      order by created_at asc
    ) as rn
  from public.products
)
update public.products p
set category_sequence = r.rn
from ranked r
where p.id = r.id;

-- Rebuild slug: {category_slug}-{NNNN}-{name-slug} (uncategorized → catalogue-)
update public.products p
set slug =
  lower(regexp_replace(c.slug, '[^a-z0-9-]+', '-', 'g')) || '-' ||
  lpad(p.category_sequence::text, 4, '0') || '-' ||
  coalesce(
    nullif(
      trim(
        both '-'
        from regexp_replace(
          translate(
            lower(p.name),
            'àáâãäåèéêëìíîïòóôõöùúûüýÿçñ',
            'aaaaaaeeeeiiiiooooouuuuyycn'
          ),
          '[^a-z0-9]+',
          '-',
          'g'
        )
      ),
      ''
    ),
    'produit'
  )
from public.categories c
where p.category_id = c.id;

update public.products p
set slug =
  'catalogue-' || lpad(p.category_sequence::text, 4, '0') || '-' ||
  coalesce(
    nullif(
      trim(
        both '-'
        from regexp_replace(
          translate(
            lower(p.name),
            'àáâãäåèéêëìíîïòóôõöùúûüýÿçñ',
            'aaaaaaeeeeiiiiooooouuuuyycn'
          ),
          '[^a-z0-9]+',
          '-',
          'g'
        )
      ),
      ''
    ),
    'produit'
  )
where p.category_id is null;

-- Resolve duplicate slugs (keep oldest row per slug unchanged)
update public.products p
set slug = p.slug || '-' || substr(replace(p.id::text, '-', ''), 1, 8)
where p.id in (
  select id
  from (
    select
      id,
      row_number() over (partition by slug order by created_at asc) as n
    from public.products
  ) x
  where n > 1
);

create unique index if not exists products_slug_unique on public.products (slug);

alter table public.products
  alter column category_sequence set not null;
