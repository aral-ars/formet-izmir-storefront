# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `bun dev` — start dev server (localhost:3000). `bun run build` / `bun run start` for production. `bun run lint` for ESLint.
- Package manager is Bun (`bun.lock`); no test suite is configured in this repo.

## Architecture

This is a static marketing + catalog storefront for Formet (Turkish outdoor furniture brand) — Next.js App Router, no backend, no API, no database, no CMS.

- **Data layer**: [lib/products.ts](lib/products.ts) is the single source of truth for all content — the `Product` type, the `products` array (mock catalog), plus `reviews`, `stores`, and `faqs` fixtures, and helpers `getProductBySlug` / `formatPrice` (Turkish Lira via `tr-TR` locale). There is no external data fetching anywhere; adding or editing catalog content means editing this file directly.
- **Routes**: `app/page.tsx` (home), `app/magaza/page.tsx` (shop listing — client component with in-memory sort/filter), `app/magazalar/page.tsx` (store locator — client component computing open/closed state from a hardcoded weekly schedule), `app/urun/[slug]/page.tsx` (product detail — server component; uses `generateStaticParams` to pre-render every product slug and `generateMetadata` for per-product SEO, then delegates all rendering to the client component `app/urun/[slug]/product-view.tsx`).
- **Shared components** ([components/](components/)): `SiteHeader` is the most stateful piece — a single component driven by a `variant` prop (`home` | `page` | `product`) that changes nav links, dark/light color scheme on scroll, and sets a `--nav-h` CSS custom property (read by the home hero) via `ResizeObserver`. `Reveal` is a generic scroll-in animation wrapper driven by `IntersectionObserver` + the `[data-reveal]`/`[data-shown]` CSS in `app/globals.css` (with a timeout fallback). `PromoBar`, `SiteFooter`, `FaqAccordion` are simpler presentational pieces reused across routes.
- **Styling**: Tailwind CSS v4, config-free (no `tailwind.config.js`) — theme tokens are declared via `@theme inline` in [app/globals.css](app/globals.css): colors (`ink`, `paper`, `card`, `chip`, `muted`, `muted-2`, `accent`, `sage`), a custom `nav` breakpoint (840px) used for nav-specific responsive classes, and `font-display`/`font-sans` mapped to the `next/font` variables set up in `app/layout.tsx` (Archivo + Hanken Grotesk). Prefer existing tokens (e.g. `bg-card`, `text-muted`, `text-accent`) over hardcoded colors/hex values.
- **Content language**: all copy, routes with Turkish names (`/magaza`, `/magazalar`, `/urun`), and locale formatting are Turkish (`html lang="tr"`) — keep new user-facing copy in Turkish and consistent with the existing tone.
- Cart/wishlist icons in `SiteHeader` are decorative placeholders — there is no cart/auth state anywhere in the app.
