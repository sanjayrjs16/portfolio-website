// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://sanjayrajesh.in',
  integrations: [react()],
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  }
});