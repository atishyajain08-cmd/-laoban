create extension if not exists pgcrypto;
create extension if not exists citext;

create table public.admin_users(id uuid primary key references auth.users(id) on delete cascade,role text not null default 'admin',created_at timestamptz not null default now());
create table public.profiles(id uuid primary key references auth.users(id) on delete cascade,full_name text,phone text,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.products(id text primary key,name text not null,slug text unique not null,description text not null default '',category text not null,price integer not null check(price>=0),original_price integer,fabric text,fit text,care text,featured boolean not null default false,is_new boolean not null default false,is_active boolean not null default true,tags text[] not null default '{}',created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.product_images(id uuid primary key default gen_random_uuid(),product_id text not null references public.products(id) on delete cascade,url text not null,storage_path text,alt_text text default '',sort_order integer not null default 0);
create table public.product_variants(id uuid primary key default gen_random_uuid(),product_id text not null references public.products(id) on delete cascade,color text not null,size text not null,sku text unique not null,stock integer not null default 0 check(stock>=0),is_active boolean not null default true,unique(product_id,color,size));
create table public.orders(id uuid primary key default gen_random_uuid(),order_number text unique not null default('LB-'||to_char(now(),'YYMMDD')||'-'||upper(substr(encode(gen_random_bytes(4),'hex'),1,6))),user_id uuid references auth.users(id) on delete set null,email text not null,full_name text not null,phone text not null,address jsonb not null,subtotal integer not null,shipping integer not null default 0,total integer not null,payment_method text not null default 'cod',payment_status text not null default 'pending',status text not null default 'received',created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.order_items(id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id) on delete cascade,product_id text not null references public.products(id),variant_id uuid not null references public.product_variants(id),product_name text not null,sku text not null,size text not null,color text not null,unit_price integer not null,quantity integer not null check(quantity>0),line_total integer not null);
create table public.newsletter_subscribers(id uuid primary key default gen_random_uuid(),email citext unique not null,is_active boolean not null default true,created_at timestamptz not null default now());

create function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.admin_users where id=auth.uid())$$;
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$begin insert into public.profiles(id,full_name) values(new.id,new.raw_user_meta_data->>'full_name') on conflict do nothing;return new;end$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create function public.create_order(payload jsonb) returns jsonb language plpgsql security definer set search_path=public as $$
declare o public.orders;item jsonb;v public.product_variants;p public.products;sub integer:=0;ship integer:=0;
begin
 if coalesce(jsonb_array_length(payload->'items'),0)=0 then raise exception 'Your bag is empty';end if;
 for item in select * from jsonb_array_elements(payload->'items') loop
  select * into v from public.product_variants where product_id=item->>'product_id' and size=item->>'size' and color=item->>'color' and is_active for update;
  if not found then raise exception 'A selected variant is unavailable';end if;
  if v.stock<(item->>'quantity')::integer then raise exception 'Insufficient stock for %',v.sku;end if;
  select * into p from public.products where id=v.product_id and is_active;sub:=sub+p.price*(item->>'quantity')::integer;
 end loop;
 ship:=case when sub>=2500 then 0 else 99 end;
 insert into public.orders(user_id,email,full_name,phone,address,subtotal,shipping,total,payment_method) values(auth.uid(),lower(payload->'customer'->>'email'),payload->'customer'->>'full_name',payload->'customer'->>'phone',jsonb_build_object('line1',payload->'customer'->>'address_line_1','line2',payload->'customer'->>'address_line_2','city',payload->'customer'->>'city','state',payload->'customer'->>'state','postal_code',payload->'customer'->>'postal_code'),sub,ship,sub+ship,coalesce(payload->>'payment_method','cod')) returning * into o;
 for item in select * from jsonb_array_elements(payload->'items') loop
  select * into v from public.product_variants where product_id=item->>'product_id' and size=item->>'size' and color=item->>'color' for update;select * into p from public.products where id=v.product_id;
  update public.product_variants set stock=stock-(item->>'quantity')::integer where id=v.id;
  insert into public.order_items(order_id,product_id,variant_id,product_name,sku,size,color,unit_price,quantity,line_total) values(o.id,p.id,v.id,p.name,v.sku,v.size,v.color,p.price,(item->>'quantity')::integer,p.price*(item->>'quantity')::integer);
 end loop;return jsonb_build_object('id',o.id,'order_number',o.order_number,'total',o.total);
end$$;

alter table public.admin_users enable row level security;alter table public.profiles enable row level security;alter table public.products enable row level security;alter table public.product_images enable row level security;alter table public.product_variants enable row level security;alter table public.orders enable row level security;alter table public.order_items enable row level security;alter table public.newsletter_subscribers enable row level security;
create policy "active products" on public.products for select using(is_active or public.is_admin());create policy "admin products" on public.products for all using(public.is_admin()) with check(public.is_admin());
create policy "product media read" on public.product_images for select using(true);create policy "admin product media" on public.product_images for all using(public.is_admin()) with check(public.is_admin());
create policy "active variants" on public.product_variants for select using(is_active or public.is_admin());create policy "admin variants" on public.product_variants for all using(public.is_admin()) with check(public.is_admin());
create policy "own profile" on public.profiles for select using(id=auth.uid() or public.is_admin());create policy "update own profile" on public.profiles for update using(id=auth.uid()) with check(id=auth.uid());
create policy "own orders" on public.orders for select using(user_id=auth.uid() or public.is_admin());create policy "admin orders" on public.orders for update using(public.is_admin());
create policy "own order items" on public.order_items for select using(exists(select 1 from public.orders o where o.id=order_id and(o.user_id=auth.uid() or public.is_admin())));
create policy "public subscribe" on public.newsletter_subscribers for insert with check(true);create policy "admin subscribers" on public.newsletter_subscribers for select using(public.is_admin());
grant execute on function public.create_order(jsonb) to anon,authenticated;
insert into storage.buckets(id,name,public) values('product-images','product-images',true) on conflict(id) do update set public=true;
create policy "product images public" on storage.objects for select using(bucket_id='product-images');create policy "product images admin insert" on storage.objects for insert to authenticated with check(bucket_id='product-images' and public.is_admin());create policy "product images admin update" on storage.objects for update to authenticated using(bucket_id='product-images' and public.is_admin());create policy "product images admin delete" on storage.objects for delete to authenticated using(bucket_id='product-images' and public.is_admin());
