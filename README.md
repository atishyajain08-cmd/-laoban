# LAOBAN

Premium Indian menswear storefront built with React, TypeScript, Vite, GSAP, Three.js, Zustand, and an optional Supabase commerce backend.

## Run locally

```bash
npm install
npm run dev
```

Without environment variables the store runs in demo mode. To enable accounts, persistent orders, inventory, subscribers, and admin data:

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local` and add the project URL and public anon key.
4. Create an Auth user and add its UUID to `public.admin_users`.

Checkout uses a server-validated Postgres function. Prices are read from the database, inventory is locked and decremented transactionally, and browser-submitted prices are ignored.

## Routes

Storefront: `/`, `/shop`, `/product/:slug`, `/cart`, `/wishlist`, `/checkout`, `/account`, `/lookbook`, `/about`  
Operations: `/admin`

## Validation

```bash
npm run lint
npm run build
```
