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
  add column if not exists pdf_storage_path text;

create unique index if not exists catalog_items_product_code_idx
  on public.catalog_items (product_code)
  where product_code <> '';

notify pgrst, 'reload schema';
