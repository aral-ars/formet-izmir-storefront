import { type QueryParams } from 'next-sanity';

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
  return client.fetch<T>(query, params, {
    next: { tags },
  });
}
