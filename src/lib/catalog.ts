import 'server-only';

import { isSanityConfigured } from '@/sanity/env';
import { sanityFetch } from '@/sanity/lib/fetch';
import { urlFor } from '@/sanity/lib/image';
import {
  PRODUCTS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  PRODUCT_SLUGS_QUERY,
  CATEGORIES_QUERY,
  COLLECTIONS_QUERY,
  REVIEWS_QUERY,
  FAQS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/lib/queries';
import {
  PRODUCTS as LOCAL_PRODUCTS,
  CATEGORIES as LOCAL_CATEGORIES,
  REVIEWS as LOCAL_REVIEWS,
  FAQS as LOCAL_FAQS,
  CONTACT,
  type Product,
  type Contact,
} from '@/data';

// Shapes the storefront components consume. Product/Review reuse existing shapes;
// Category adds `hasProducts` so the shop page can hide empty filter chips.
export type Category = {
  id: string;
  name: string;
  description?: string;
  image: string;
  hasProducts: boolean;
  comingSoon?: boolean;
};
export type Collection = {
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
  image?: string;
};
export type Faq = { question: string; answer: string };
// Contact / showroom details are shaped exactly like the local `Contact`.
export type SiteSettings = Contact;

// Revalidation tags (match Sanity document _type; busted by /api/revalidate).
const TAG = {
  product: 'product',
  category: 'category',
  collection: 'collection',
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

  // Prefer the multi-axis `options`; fall back to the legacy `colors` list so
  // older docs keep rendering. Swatch URLs are already resolved in the query.
  const options: Product['options'] = doc.options?.length
    ? doc.options.map((g: any) => ({
        title: g.title,
        values: (g.values ?? []).map((v: any) => ({
          label: v.label,
          hex: v.hex || undefined,
          swatch: v.swatch || undefined,
        })),
      }))
    : undefined;

  return {
    id: doc.id,
    slug: doc.slug,
    name: doc.name,
    price: doc.price ?? 0,
    priceOnRequest: Boolean(doc.priceOnRequest),
    availability: doc.availability ?? undefined,
    image: img(doc.image, 1400),
    imageAlt: doc.imageAlt ?? undefined,
    images: gallery.map((i: unknown) => img(i, 1600)),
    tag: doc.tag ?? '',
    category: doc.category ?? '',
    collection: doc.collection ?? undefined,
    collectionName: doc.collectionName ?? undefined,
    series: doc.series ?? undefined,
    description: doc.description ?? '',
    material: doc.material ?? undefined,
    care: doc.care ?? undefined,
    specs: (doc.specs ?? []).map((s: any) => ({ label: s.label, value: s.value })),
    options,
    colors: doc.colors?.length
      ? doc.colors.map((c: any) => ({ name: c.name, hex: c.hex }))
      : undefined,
    relatedSlugs: doc.relatedSlugs?.filter(Boolean) ?? undefined,
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
    comingSoon: Boolean(c.comingSoon),
  }));
}

export async function getCollections(): Promise<Collection[]> {
  // No local fixtures for collections — they only exist once Sanity is wired.
  if (!isSanityConfigured) return [];
  const docs = await sanityFetch<Record<string, any>[]>({
    query: COLLECTIONS_QUERY,
    tags: [TAG.collection, TAG.product],
  });
  return docs.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    image: c.image ? img(c.image, 1000) : '',
    hasProducts: Boolean(c.hasProducts),
  }));
}

// Reviews now store a real date (ISO `YYYY-MM-DD`) instead of a pre-formatted
// string — format it for display here, the same way price is formatted at render.
// A non-ISO value (e.g. a legacy/local display string) passes through unchanged.
function formatReviewDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
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
    date: r.date ? formatReviewDate(r.date) : '',
    text: r.text ?? '',
    image: r.image && typeof r.image === 'string' ? r.image : undefined,
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

export async function getSiteSettings(): Promise<Contact> {
  if (!isSanityConfigured) return CONTACT;
  const s = await sanityFetch<Record<string, any> | null>({
    query: SITE_SETTINGS_QUERY,
    tags: [TAG.siteSettings],
  });
  if (!s) return CONTACT;

  const addressLines =
    typeof s.address === 'string'
      ? s.address.split('\n').map((l: string) => l.trim()).filter(Boolean)
      : [];
  const hours = Array.isArray(s.hours) && s.hours.length
    ? s.hours.map((h: any) => ({ days: h.days ?? '', value: h.value ?? '' }))
    : CONTACT.hours;

  return {
    phone: s.phone || CONTACT.phone,
    whatsapp: s.whatsapp || CONTACT.whatsapp,
    email: s.email || CONTACT.email,
    addressLines: addressLines.length ? addressLines : CONTACT.addressLines,
    mapUrl: s.mapUrl || CONTACT.mapUrl,
    hours,
  };
}
