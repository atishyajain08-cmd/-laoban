create extension if not exists pgcrypto;

alter table public.catalog_items
  add column if not exists product_code text not null default '';

create unique index if not exists catalog_items_product_code_idx
  on public.catalog_items (product_code)
  where product_code <> '';

delete from public.catalog_items;

insert into public.catalog_items
  (product_code, title, description, price, section, label, image_url, storage_path, is_active, sort_order)
values
  (
    'LBN-WT-001',
    'Laoban Classic White Crew Tee',
    'Plain basic white men’s crew-neck T-shirt in soft breathable cotton. Clean fit, everyday comfort, and a premium minimal look for Indian weather. [laoban_stock:S=10,M=15,L=15,XL=10]',
    999,
    'new-arrivals',
    'Casual',
    'assets/products/basic-white-tee.svg',
    null,
    true,
    1
  ),
  (
    'LBN-WT-002',
    'Laoban Regular Fit White Tee',
    'A simple regular-fit white T-shirt with a smooth hand-feel and reinforced neckline. Made as a dependable daily essential. [laoban_stock:S=8,M=14,L=14,XL=8]',
    1099,
    'new-arrivals',
    'Casual',
    'assets/products/basic-white-tee.svg',
    null,
    true,
    2
  ),
  (
    'LBN-WT-003',
    'Laoban Oversized White Tee',
    'Plain white oversized T-shirt with dropped shoulders and a relaxed streetwear silhouette. Minimal, clean, and easy to style. [laoban_stock:S=6,M=12,L=12,XL=6]',
    1199,
    'product',
    'Product',
    'assets/products/basic-white-tee.svg',
    null,
    true,
    3
  ),
  (
    'LBN-WT-004',
    'Laoban Premium Heavyweight White Tee',
    'Structured heavyweight white T-shirt with a clean fall and elevated neckline. Built for a premium minimal menswear wardrobe. [laoban_stock:S=5,M=10,L=10,XL=5]',
    1399,
    'collections',
    'Collection',
    'assets/products/basic-white-tee.svg',
    null,
    true,
    4
  ),
  (
    'LBN-WT-005',
    'Laoban Slim Fit White Tee',
    'Plain white slim-fit T-shirt with a sharper chest and shoulder line. Designed for a polished, clean everyday outfit. [laoban_stock:S=7,M=12,L=12,XL=7]',
    999,
    'lookbook',
    'Lookbook',
    'assets/products/basic-white-tee.svg',
    null,
    true,
    5
  ),
  (
    'LBN-WT-006',
    'Laoban Longline White Tee',
    'Minimal longline white T-shirt with a slightly extended hem. Clean enough for basics, refined enough for layered outfits. [laoban_stock:S=6,M=10,L=10,XL=6]',
    1199,
    'product',
    'Product',
    'assets/products/basic-white-tee.svg',
    null,
    true,
    6
  );
