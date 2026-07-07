# Formet — İzmir Storefront

Marketing + catalog storefront for **Formet**, an İzmir/Güzelbahçe outdoor-furniture brand. Built with the Next.js App Router as a static site — no backend, no database, no auth. Ordering happens through WhatsApp deep links.

## Getting started

```bash
bun install
bun dev          # http://localhost:3000
```

Other scripts:

```bash
bun run build    # production build
bun run start    # serve the production build
bun run lint     # ESLint
```

The package manager is [Bun](https://bun.sh) (`bun.lock`). There is no test suite.

## Project layout

Everything lives under `src/` (`@/*` → `./src/*`):

- `src/data.ts` — the single source of truth for all catalog content: `PRODUCTS`, `CATEGORIES`, `REVIEWS`, `FAQS`, the `ASSETS` image map, and the `formatPrice` (TRY) / `getProductBySlug` helpers.
- `src/app/` — routes: `/` (home), `/products` (shop listing), `/products/[slug]` (product detail, statically pre-rendered), `/locate-us` (WIP map page).
- `src/components/` — shared UI (Navbar, home sections, product views, animation helpers).
- `public/assets/` — product and brand images, served as plain `<img>`.

Styling is Tailwind CSS v4 (config-free) with tokens declared in `src/app/globals.css`. All user-facing copy is Turkish (`html lang="tr"`).

See [CLAUDE.md](CLAUDE.md) for a fuller architecture overview.

## Roadmap

Catalog content currently lives in `src/data.ts` and is slated to move to **Sanity CMS** for product/image management.
