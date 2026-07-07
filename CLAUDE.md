# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `bun dev` — start dev server (localhost:3000). `bun run build` / `bun run start` for production. `bun run lint` for ESLint.
- Package manager is Bun (`bun.lock`); no test suite is configured in this repo.

## Architecture

This is a static marketing + catalog storefront for Formet (an İzmir/Güzelbahçe outdoor-furniture brand) — Next.js App Router, no backend, no API, no database. All source lives under `src/` (`@/*` → `./src/*`). Catalog content currently lives in a single TS file and is slated to move to Sanity CMS.

- **Data layer**: [src/data.ts](src/data.ts) is the single source of truth for all content — the `Product` and `ColorOption` types, the `PRODUCTS` array (mock catalog), the `CATEGORIES`, `REVIEWS`, and `FAQS` fixtures, an `ASSETS` map of local image paths (under `public/assets/`), and helpers `formatPrice` (Turkish Lira via `Intl.NumberFormat('tr-TR')`) and `getProductBySlug`. Products carry both a numeric `id` (React keys / like-tracking) and a URL `slug` (routing). `price` is a single number formatted at render — never store formatted price strings. There is no external data fetching; editing catalog content means editing this file directly.
- **Routes** (`src/app/`): `page.tsx` (home — client component composing the section components below), `products/page.tsx` (shop listing — client component with in-memory sort/filter; filter chips are derived from categories that actually have products), `products/[slug]/page.tsx` (product detail — server component; `generateStaticParams` pre-renders every product slug and `generateMetadata` sets per-product SEO, then it delegates to `ProductExperience` on mobile (`md:hidden`) and `ProductDetailClient` on desktop (`hidden md:block`)), and `locate-us/page.tsx` (WIP store/map page — the only consumer of `ui/map.tsx`).
- **Shared components** (`src/components/`): `Navbar` (transparent over the hero, solid on scroll; accepts `forceDarkText` for light-background pages) with `MobileMenu`. Navigation uses `TransitionLink` + `PageTransition` (a custom view-transition provider), and `SmoothScroll` wraps the app in Lenis. `TextReveal`/`LineReveal` are scroll-in text animations (Motion). Home sections: `Hero`, `Categories` (a fanned "deck" of the first five `CATEGORIES`), `Featured` (product grid with a `ProductModal` quick-view), `Reviews`, `Location` (showroom section), `FAQ`, `Footer`. Presentational helpers: `SpotlightCard`, `PillButton`, `LikeButton`.
- **`src/components/ui/`**: only `map.tsx` (a MapLibre GL wrapper used by `locate-us`) and `tooltip.tsx` (Base UI, mounted via `TooltipProvider` in the layout) remain. These are the last shadcn-style primitives; the rest were removed.
- **Styling**: Tailwind CSS v4, config-free (no `tailwind.config.js`) — tokens are declared via `@theme` in [src/app/globals.css](src/app/globals.css). Brand colors: `sand`, `sand-light`, `earth`, `earth-dark`, `sage`, `sage-light`. Fonts (loaded via `<link>` in `layout.tsx`): `font-display` → Outfit, `font-serif` → Instrument Serif, `font-sans` → Satoshi. There is also a shadcn-style oklch token set (`background`, `foreground`, `card`, `primary`, …) and `.glass*` frosted utilities. Prefer existing tokens (e.g. `bg-sand-light`, `text-earth`, `text-earth/70`) over hardcoded hex.
- **Images**: served as plain `<img>` from local `public/assets/` paths — there is no `next/image` usage anywhere (so `next.config.mjs` needs no `remotePatterns`). The three not-yet-stocked categories (`bbq`, `swings`, `shoe-cabinets`) still point at remote Unsplash placeholders.
- **Content language**: all copy, the Turkish-named data, and locale formatting are Turkish (`html lang="tr"`) — keep new user-facing copy in Turkish and consistent with the existing tone.
- There is no cart or auth anywhere — the wishlist/like buttons are local UI state, and ordering is handled by `wa.me` (WhatsApp) deep links that embed the product name and formatted price.
