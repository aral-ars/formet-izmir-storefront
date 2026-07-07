import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

import { dataset, projectId } from '../env';

const builder = createImageUrlBuilder({ projectId, dataset });

// Build a Sanity CDN URL from an image field. Chain transforms as needed,
// e.g. urlFor(product.image).width(1200).height(1500).fit('crop').url()
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
