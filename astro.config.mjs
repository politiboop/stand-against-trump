import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://standagainsttrump.com',
  integrations: [sitemap()],
});
