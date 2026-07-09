import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { presentationTool } from 'sanity/presentation';

import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schema } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';
import { resolve } from './src/sanity/presentation';

// Document types that must exist exactly once — no create/duplicate/delete, so a
// stray second doc can't silently change which one `[0]` queries resolve to.
const SINGLETONS = new Set(['siteSettings']);

// Config for the embedded Studio mounted at /studio (see src/app/studio).
export default defineConfig({
  name: 'default',
  title: 'Formet',
  projectId,
  dataset,
  basePath: '/studio',
  schema,
  document: {
    actions: (prev, { schemaType }) =>
      SINGLETONS.has(schemaType)
        ? prev.filter(
            ({ action }) =>
              action && !['duplicate', 'delete', 'unpublish'].includes(action),
          )
        : prev,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    presentationTool({
      previewUrl: {
        draftMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve,
    }),
  ],
});
