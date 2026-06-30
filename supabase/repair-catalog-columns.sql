-- Laoban catalog schema repair
-- Run this in Supabase SQL Editor if backend upload says:
-- "Could not find the '<column>' column of 'catalog_items' in the schema cache"

alter table public.catalog_items
  add column if not exists product_code text not null default '',
  add column if not exists product_type text not null default 'T-Shirt',
  add column if not exists fit text not null default 'Regular',
  add column if not exists material text not null default 'Cotton',
  add column if not exists colors jsonb not null default '[{"name":"Pure White","hex":"#FFFFFF"}]'::jsonb,
  add column if not exists badge text,
  add column if not exists thumbnail_url text,
  add column if not exists thumbnail_storage_path text,
  add column if not exists pdf_url text,
  add column if not exists pdf_storage_path text,
  add column if not exists gallery_urls jsonb not null default '[]'::jsonb;

create unique index if not exists catalog_items_product_code_idx
  on public.catalog_items (product_code)
  where product_code <> '';

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null default '{}'::jsonb,
  payment_method text not null default 'COD',
  status text not null default 'Processing',
  subtotal integer not null default 0,
  shipping integer not null default 0,
  total integer not null default 0,
  coupon_code text,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Customers can create Laoban orders" on public.orders;
create policy "Customers can create Laoban orders"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

notify pgrst, 'reload schema';
