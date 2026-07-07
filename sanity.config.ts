import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schema } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

// Config for the embedded Studio mounted at /studio (see src/app/studio).
export default defineConfig({
  name: 'default',
  title: 'Formet',
  projectId,
  dataset,
  basePath: '/studio',
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
