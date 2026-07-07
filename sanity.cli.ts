import { defineCliConfig } from 'sanity/cli';

import { dataset, projectId } from './src/sanity/env';

// Used by the `sanity` CLI (schema deploy, dataset commands, typegen, etc.).
export default defineCliConfig({
  api: { projectId, dataset },
  autoUpdates: true,
});
