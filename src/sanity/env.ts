// Sanity connection config, read from env. Falls back to safe placeholders so the
// build/Studio don't crash before a real project is connected (see .env.example).
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-06-01';

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder';

// True once a real project id is wired up — used to decide whether to read from
// Sanity or fall back to the local src/data.ts catalog.
export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);
