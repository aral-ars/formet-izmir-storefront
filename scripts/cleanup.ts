import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Missing config');
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
  console.log('Fetching documents to delete...');
  // Get all documents that have a dot in their _id
  const docs = await client.fetch('*[_id match "*.*" && _type in ["product", "category", "review", "faq"]]{_id}');
  console.log(`Found ${docs.length} documents.`);
  
  if (docs.length === 0) {
      console.log('Nothing to delete.');
      return;
  }

  const transaction = client.transaction();
  for (const doc of docs) {
    console.log(`Deleting ${doc._id}`);
    transaction.delete(doc._id);
  }
  
  console.log('Committing transaction...');
  await transaction.commit();
  console.log('Done.');
}

run().catch(console.error);
