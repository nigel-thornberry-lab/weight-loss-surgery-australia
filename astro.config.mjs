// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://weightlosssurgery.com.au',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/api') && !page.includes('/index-old') && !page.includes('/procedures/gastric-band-melbourne') && !page.includes('/procedures/gastric-balloon-melbourne') && !page.includes('/procedures/duodenal-switch-melbourne'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      customPages: [],
    })
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    remotePatterns: [{ protocol: "https" }],
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['astro']
          }
        }
      }
    }
  }
});