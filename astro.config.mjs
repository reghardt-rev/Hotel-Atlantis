// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// The `astro dev` server runs Keystatic's admin/API routes through the adapter.
// The Cloudflare (workerd) dev runner can't run Keystatic's server code, so we
// use the Node adapter for `dev` and the Cloudflare adapter for `build`.
const isDevServer = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  // Canonical URLs and sitemaps are built from this. Points at the live Workers
  // URL; change it the moment a hotel domain is attached, or search engines keep
  // attributing the site to workers.dev.
  site: 'https://paradis-zan.reghardt.workers.dev',

  // English is the default (no URL prefix); Dutch is served under /nl/*.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'nl', 'de'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: isDevServer
    ? node({ mode: 'standalone' })
    : // prerenderEnvironment: 'node' builds the static pages in Node (not workerd),
      // so the Keystatic filesystem reader can read content at build time. The
      // Keystatic admin routes still run as a Worker at runtime (GitHub storage).
      cloudflare({ prerenderEnvironment: 'node' }),

  // react() is required by @keystatic/astro (the admin UI is React).
  // keystatic() injects /keystatic (admin) and /api/keystatic/* (server routes).
  integrations: [react(), keystatic()],
});
