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
  created_at timestamptz not null default now()
);

-- Support both the original/simple Laoban orders table and the richer checkout schema.
alter table public.orders
  add column if not exists order_code text,
  add column if not exists customer_name text,
  add column if not exists customer_email text,
  add column if not exists customer_phone text,
  add column if not exists shipping_address jsonb not null default '{}'::jsonb,
  add column if not exists coupon_code text,
  add column if not exists items jsonb not null default '[]'::jsonb,
  add column if not exists full_name text,
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists address text,
  add column if not exists payment_method text not null default 'COD',
  add column if not exists status text not null default 'Processing',
  add column if not exists subtotal integer not null default 0,
  add column if not exists shipping integer not null default 0,
  add column if not exists total integer not null default 0;

update public.orders
set order_code = coalesce(order_code, 'LBN-LEGACY-' || left(id::text, 8)),
    customer_name = coalesce(customer_name, full_name, ''),
    customer_email = coalesce(customer_email, email, ''),
    customer_phone = coalesce(customer_phone, phone, '')
where order_code is null
   or customer_name is null
   or customer_email is null
   or customer_phone is null;

create unique index if not exists orders_order_code_idx
  on public.orders (order_code)
  where order_code is not null;

create index if not exists orders_created_at_idx
  on public.orders (created_at desc);

alter table public.orders enable row level security;

drop policy if exists "Customers can create Laoban orders" on public.orders;
create policy "Customers can create Laoban orders"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Laoban authenticated users can read orders" on public.orders;
create policy "Laoban authenticated users can read orders"
  on public.orders
  for select
  to authenticated
  using (true);

drop policy if exists "Laoban authenticated users can update orders" on public.orders;
create policy "Laoban authenticated users can update orders"
  on public.orders
  for update
  to authenticated
  using (true)
  with check (true);

notify pgrst, 'reload schema';
