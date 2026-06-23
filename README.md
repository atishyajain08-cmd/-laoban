# Laoban — 老板

> Premium Indian menswear. Confidence, crafted. **Be the boss.**

A single-brand e-commerce storefront built with Vite + React + TypeScript, featuring a light 3D hero seal, smooth scrolling, and tasteful scroll animation. No backend — checkout ends at an order-summary screen.

**Live site:** https://atishyajain08-cmd.github.io/laoban/

---

## Tech stack

- **Vite + React 19 + TypeScript**
- **three / @react-three/fiber / @react-three/drei** — the floating 3D seal in the hero
- **GSAP + ScrollTrigger** — reveal-on-scroll animation
- **Lenis** — smooth scrolling
- **React Router** — pages
- **Zustand** — cart, wishlist, mock auth (persisted to `localStorage`)

## Pages

Home · Shop (filter + sort) · Product detail · Cart · Wishlist · Checkout (order summary only) · About · Login / Signup (mock auth)

---

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-check + production build into dist/
npm run preview  # preview the production build
```

## Adding your real assets

Placeholder images fall back to a labelled box until you add the real files.

- **Logo:** `public/assets/logo/logo.png` (the header references this exact path)
- **Product photos:** `public/assets/products/` — filenames match `src/data/products.ts`
  (e.g. `classic-crew-1.jpg`, `polo-1.jpg`, …)
- **Edit the catalog:** `src/data/products.ts` — name, price (₹), sizes, colours, images, description, category

Because the site is served from a `/laoban/` subpath on GitHub Pages, reference public
assets through the `asset()` helper (`src/utils/asset.ts`) rather than hardcoding `/assets/...`.

---

## Deployment (GitHub Pages)

Deployment is automated by `.github/workflows/deploy.yml`. Every push to `main`
builds the site and publishes `dist/` to GitHub Pages.

One-time setup in the GitHub repo:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions**

That's it. Subsequent pushes to `main` redeploy automatically. The live URL is
`https://<your-username>.github.io/laoban/`.

> If you fork or rename the repo, update the `base` in `vite.config.ts` to match
> the new repo name (e.g. `/my-repo/`).
