/**
 * One-off migration: import the local src/data.ts catalog into Sanity.
 *
 * Prereqs: a Sanity project + a write token. Fill .env.local with
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN
 * then run:  bun run seed
 *
 * Idempotent: uses deterministic _ids + createOrReplace, so re-running updates
 * the same documents rather than duplicating them. Identical images are
 * de-duplicated by Sanity on content hash.
 */
import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

import { PRODUCTS, CATEGORIES, REVIEWS, FAQS } from '../src/data';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    '\n✗ Missing config. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local first.\n' +
      '  Create a project at https://www.sanity.io/manage and a write token under API → Tokens.\n',
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-06-01',
  useCdn: false,
});

const assetCache = new Map<string, string>();

/** Upload a local (/assets/..) or remote (http) image once; return its asset _id. */
async function uploadImage(source: string): Promise<string> {
  const cached = assetCache.get(source);
  if (cached) return cached;

  let buffer: Buffer;
  let filename: string;

  if (source.startsWith('http')) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`Fetch failed for ${source}: ${res.status}`);
    buffer = Buffer.from(await res.arrayBuffer());
    filename = source.split('/').pop()?.split('?')[0] || 'image';
  } else {
    const filePath = join(process.cwd(), 'public', source.replace(/^\//, ''));
    buffer = await readFile(filePath);
    filename = source.split('/').pop() || 'image';
  }

  const asset = await client.assets.upload('image', buffer, { filename });
  assetCache.set(source, asset._id);
  console.log(`  ↑ uploaded ${filename}`);
  return asset._id;
}

async function imageField(source: string) {
  const assetId = await uploadImage(source);
  return { _type: 'image', asset: { _type: 'reference', _ref: assetId } };
}

async function seed() {
  console.log(`\nSeeding project ${projectId} / ${dataset}\n`);

  // 1. Categories (products reference these).
  console.log('Categories…');
  for (const [i, cat] of CATEGORIES.entries()) {
    await client.createOrReplace({
      _id: `category-${cat.id}`,
      _type: 'category',
      name: cat.name,
      slug: { _type: 'slug', current: cat.id },
      description: cat.description,
      image: await imageField(cat.image),
      order: i,
    });
    console.log(`  ✓ ${cat.name}`);
  }

  // 2. Products.
  console.log('\nProducts…');
  for (const [i, p] of PRODUCTS.entries()) {
    await client.createOrReplace({
      _id: `product-${p.slug}`,
      _type: 'product',
      name: p.name,
      slug: { _type: 'slug', current: p.slug },
      price: p.price,
      tag: p.tag,
      category: { _type: 'reference', _ref: `category-${p.category}` },
      image: await imageField(p.image),
      images: await Promise.all(
        p.images.map(async (src) => ({ _key: randomUUID(), ...(await imageField(src)) })),
      ),
      description: p.description,
      specs: p.specs.map((s) => ({ _key: randomUUID(), _type: 'spec', label: s.label, value: s.value })),
      colors: (p.colors ?? []).map((c) => ({ _key: randomUUID(), _type: 'colorOption', name: c.name, hex: c.hex })),
      order: i,
      hidden: false,
    });
    console.log(`  ✓ ${p.name}`);
  }

  // 3. Reviews.
  console.log('\nReviews…');
  for (const [i, r] of REVIEWS.entries()) {
    await client.createOrReplace({
      _id: `review-${i}`,
      _type: 'review',
      authorName: r.authorName,
      rating: r.rating,
      date: r.date,
      text: r.text,
      order: i,
    });
  }
  console.log(`  ✓ ${REVIEWS.length} reviews`);

  // 4. FAQs.
  console.log('\nFAQs…');
  for (const [i, f] of FAQS.entries()) {
    await client.createOrReplace({
      _id: `faq-${i}`,
      _type: 'faq',
      question: f.question,
      answer: f.answer,
      order: i,
    });
  }
  console.log(`  ✓ ${FAQS.length} FAQs`);

  // 5. Site settings (presentation images) — singleton.
  console.log('\nSite settings…');
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    title: 'Formet',
    heroImage: await imageField('/assets/formet-hero.png'),
    wordmarkDark: await imageField('/assets/formet-wordmark-black.png'),
    wordmarkLight: await imageField('/assets/formet-wordmark-white.png'),
  });
  console.log('  ✓ siteSettings');

  console.log('\n✔ Seed complete.\n');
}

seed().catch((err) => {
  console.error('\n✗ Seed failed:', err);
  process.exit(1);
});
