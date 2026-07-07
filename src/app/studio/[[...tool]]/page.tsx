'use client';

import { NextStudio } from 'next-sanity/studio';

import config from '../../../../sanity.config';

// Client component: the whole Studio (and the `sanity` package) stays in the
// browser bundle. Route metadata/config lives in the sibling layout.tsx.
export default function StudioPage() {
  return <NextStudio config={config} />;
}
