import { type QueryParams } from 'next-sanity';
import { draftMode } from 'next/headers';

import { client } from './client';

// Thin wrapper around client.fetch that tags the request for the Next.js data
// cache. The /api/revalidate webhook busts these tags by document _type, so
// e.g. tag a product read with ['product'] to refresh it on publish.
export async function sanityFetch<const T>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<T> {
  let isDraftMode = false;
  try {
    isDraftMode = (await draftMode()).isEnabled;
  } catch (e) {
    // Expected to throw in build-time static generation (generateStaticParams)
  }
  
  if (isDraftMode && !process.env.SANITY_API_READ_TOKEN) {
    throw new Error('The `SANITY_API_READ_TOKEN` environment variable is required in Draft Mode.');
  }

  return client.fetch<T>(query, params, {
    ...(isDraftMode && {
      token: process.env.SANITY_API_READ_TOKEN,
      perspective: 'previewDrafts',
      // `stega.enabled` defaults to false — without it, no source-map data is
      // embedded in returned strings and Presentation's click-to-edit overlays
      // have nothing to attach to.
      stega: {
        enabled: true,
        studioUrl: '/studio',
      },
    }),
    // Cache indefinitely; the /api/revalidate webhook busts by tag on publish
    // (on-demand revalidation). Keeps pages static between edits.
    // In Draft Mode, we disable caching completely so we see live updates.
    next: { revalidate: isDraftMode ? 0 : false, tags },
  });
}
