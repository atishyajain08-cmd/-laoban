create extension if not exists pgcrypto;

create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  product_code text not null default '',
  title text not null,
  description text not null default '',
  price integer not null default 0 check (price >= 0),
  product_type text not null default 'T-Shirt',
  fit text not null default 'Regular',
  material text not null default 'Cotton',
  colors jsonb not null default '[{"name":"Pure White","hex":"#FFFFFF"}]'::jsonb,
  badge text,
  section text not null default 'product',
  label text not null default 'Product',
  thumbnail_url text,
  thumbnail_storage_path text,
  image_url text not null,
  storage_path text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists catalog_items_live_sort_idx
  on public.catalog_items (is_active, sort_order, created_at desc);

alter table public.catalog_items
  add column if not exists product_code text not null default '',
  add column if not exists product_type text not null default 'T-Shirt',
  add column if not exists fit text not null default 'Regular',
  add column if not exists material text not null default 'Cotton',
  add column if not exists colors jsonb not null default '[{"name":"Pure White","hex":"#FFFFFF"}]'::jsonb,
  add column if not exists badge text,
  add column if not exists thumbnail_url text,
  add column if not exists thumbnail_storage_path text;

create unique index if not exists catalog_items_product_code_idx
  on public.catalog_items (product_code)
  where product_code <> '';

create or replace function public.is_laoban_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
$$;

alter table public.catalog_items enable row level security;

drop policy if exists "Public can read active Laoban catalog" on public.catalog_items;
create policy "Public can read active Laoban catalog"
  on public.catalog_items
  for select
  using (is_active = true or public.is_laoban_admin());

drop policy if exists "Laoban admins can insert catalog" on public.catalog_items;
create policy "Laoban admins can insert catalog"
  on public.catalog_items
  for insert
  to authenticated
  with check (public.is_laoban_admin());

drop policy if exists "Laoban admins can update catalog" on public.catalog_items;
create policy "Laoban admins can update catalog"
  on public.catalog_items
  for update
  to authenticated
  using (public.is_laoban_admin())
  with check (public.is_laoban_admin());

drop policy if exists "Laoban admins can delete catalog" on public.catalog_items;
create policy "Laoban admins can delete catalog"
  on public.catalog_items
  for delete
  to authenticated
  using (public.is_laoban_admin());

insert into storage.buckets (id, name, public)
values ('catalog', 'catalog', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read Laoban catalog images" on storage.objects;
create policy "Public can read Laoban catalog images"
  on storage.objects
  for select
  using (bucket_id = 'catalog');

drop policy if exists "Laoban admins can upload catalog images" on storage.objects;
create policy "Laoban admins can upload catalog images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'catalog' and public.is_laoban_admin());

drop policy if exists "Laoban admins can update catalog images" on storage.objects;
create policy "Laoban admins can update catalog images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'catalog' and public.is_laoban_admin())
  with check (bucket_id = 'catalog' and public.is_laoban_admin());

drop policy if exists "Laoban admins can delete catalog images" on storage.objects;
create policy "Laoban admins can delete catalog images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'catalog' and public.is_laoban_admin());
