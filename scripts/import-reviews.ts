import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-06-01',
  useCdn: false,
});

async function run() {
  const reviewsData = JSON.parse(readFileSync(join(process.cwd(), 'reviews.json'), 'utf8'));
  
  console.log('Deleting all existing reviews in Sanity...');
  await client.delete({ query: '*[_type == "review"]' });
  console.log('Existing reviews deleted.');

  console.log(`Importing ${reviewsData.length} reviews...`);

  for (let i = 0; i < reviewsData.length; i++) {
    const r = reviewsData[i];

    await client.createOrReplace({
      _id: `google-review-${i}`,
      _type: 'review',
      authorName: r.authorName,
      rating: r.rating,
      text: r.text,
      date: r.date,
      order: i,
      ...(r.image ? { image: r.image } : {})
    });
    console.log(`✓ Imported review by ${r.authorName}`);
  }
  
  console.log('Done!');
}

run().catch(console.error);
