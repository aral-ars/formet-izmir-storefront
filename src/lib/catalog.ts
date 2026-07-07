import 'server-only';

import { isSanityConfigured } from '@/sanity/env';
import { sanityFetch } from '@/sanity/lib/fetch';
import { urlFor } from '@/sanity/lib/image';
import {
  PRODUCTS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  PRODUCT_SLUGS_QUERY,
  CATEGORIES_QUERY,
  REVIEWS_QUERY,
  FAQS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/lib/queries';
import {
  PRODUCTS as LOCAL_PRODUCTS,
  CATEGORIES as LOCAL_CATEGORIES,
  REVIEWS as LOCAL_REVIEWS,
  FAQS as LOCAL_FAQS,
  ASSETS,
  type Product,
} from '@/data';

// Shapes the storefront components consume. Product/Review reuse existing shapes;
// Category adds `hasProducts` so the shop page can hide empty filter chips.
export type Category = {
  id: string;
  name: string;
  description?: string;
  image: string;
  hasProducts: boolean;
};
export type Review = {
  authorName: string;
  authorInitial: string;
  rating: number;
  date: string;
  text: string;
};
export type Faq = { question: string; answer: string };
export type SiteSettings = {
  heroImage?: string;
  wordmarkDark: string;
  wordmarkLight: string;
  showroomImages: string[];
};

// Revalidation tags (match Sanity document _type; busted by /api/revalidate).
const TAG = {
  product: 'product',
  category: 'category',
  review: 'review',
  faq: 'faq',
  siteSettings: 'siteSettings',
} as const;

// Resolve a Sanity image object to a CDN URL string, so components keep taking
// plain string srcs whether data comes from Sanity or the local fallback.
function img(source: unknown, width: number): string {
  return urlFor(source as never)
    .width(width)
    .auto('format')
    .url();
}

function mapProduct(doc: Record<string, any>): Product {
  const gallery = doc.images?.length ? doc.images : [doc.image];
  return {
    id: doc.id,
    slug: doc.slug,
    name: doc.name,
    price: doc.price,
    image: img(doc.image, 1400),
    images: gallery.map((i: unknown) => img(i, 1600)),
    tag: doc.tag ?? '',
    category: doc.category ?? '',
    description: doc.description ?? '',
    specs: (doc.specs ?? []).map((s: any) => ({ label: s.label, value: s.value })),
    colors: doc.colors?.length
      ? doc.colors.map((c: any) => ({ name: c.name, hex: c.hex }))
      : undefined,
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!isSanityConfigured) return LOCAL_PRODUCTS;
  const docs = await sanityFetch<Record<string, any>[]>({
    query: PRODUCTS_QUERY,
    tags: [TAG.product],
  });
  return docs.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSanityConfigured) {
    return LOCAL_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  const doc = await sanityFetch<Record<string, any> | null>({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
    tags: [TAG.product],
  });
  return doc ? mapProduct(doc) : null;
}

export async function getProductSlugs(): Promise<string[]> {
  if (!isSanityConfigured) return LOCAL_PRODUCTS.map((p) => p.slug);
  const rows = await sanityFetch<{ slug: string }[]>({
    query: PRODUCT_SLUGS_QUERY,
    tags: [TAG.product],
  });
  return rows.map((r) => r.slug).filter(Boolean);
}

export async function getCategories(): Promise<Category[]> {
  if (!isSanityConfigured) {
    return LOCAL_CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      image: c.image,
      hasProducts: LOCAL_PRODUCTS.some((p) => p.category === c.id),
    }));
  }
  const docs = await sanityFetch<Record<string, any>[]>({
    query: CATEGORIES_QUERY,
    tags: [TAG.category, TAG.product],
  });
  return docs.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    image: c.image ? img(c.image, 1000) : '',
    hasProducts: Boolean(c.hasProducts),
  }));
}

export async function getReviews(): Promise<Review[]> {
  if (!isSanityConfigured) return LOCAL_REVIEWS;
  const docs = await sanityFetch<Record<string, any>[]>({
    query: REVIEWS_QUERY,
    tags: [TAG.review],
  });
  return docs.map((r) => ({
    authorName: r.authorName,
    authorInitial: (r.authorName?.[0] ?? '').toUpperCase(),
    rating: r.rating,
    date: r.date ?? '',
    text: r.text ?? '',
  }));
}

export async function getFaqs(): Promise<Faq[]> {
  if (!isSanityConfigured) return LOCAL_FAQS;
  const docs = await sanityFetch<Record<string, any>[]>({
    query: FAQS_QUERY,
    tags: [TAG.faq],
  });
  return docs.map((f) => ({ question: f.question, answer: f.answer }));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const fallback: SiteSettings = {
    wordmarkDark: ASSETS.formetWordmarkBlack,
    wordmarkLight: ASSETS.formetWordmarkWhite,
    showroomImages: [],
  };
  if (!isSanityConfigured) return fallback;
  const s = await sanityFetch<Record<string, any> | null>({
    query: SITE_SETTINGS_QUERY,
    tags: [TAG.siteSettings],
  });
  if (!s) return fallback;
  return {
    heroImage: s.heroImage ? img(s.heroImage, 2000) : undefined,
    wordmarkDark: s.wordmarkDark ? img(s.wordmarkDark, 400) : fallback.wordmarkDark,
    wordmarkLight: s.wordmarkLight ? img(s.wordmarkLight, 400) : fallback.wordmarkLight,
    showroomImages: (s.showroomImages ?? []).map((i: unknown) => img(i, 1600)),
  };
}
