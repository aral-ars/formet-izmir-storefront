import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from '../env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // With on-demand tag revalidation handling freshness at the Next cache layer,
  // the CDN is fine (and cheaper). Published edits propagate within seconds.
  useCdn: true,
  stega: {
    studioUrl: '/studio',
  },
});
