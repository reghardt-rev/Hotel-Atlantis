import { mkdirSync, writeFileSync } from 'node:fs';

/**
 * Keystatic's own Astro integration, minus the API route it injects.
 *
 * That route's handler reads `context.locals.runtime.env`, which Astro 7
 * removed and replaced with a getter that throws, so every request to
 * /api/keystatic/* answers 500 on Cloudflare. `src/pages/api/keystatic/
 * [...params].ts` serves that path instead, and two definitions of one dynamic
 * SSR route is a collision Astro warns about today and will refuse outright in
 * a later version. So the integration is reproduced here without it.
 *
 * Everything else is copied from @keystatic/astro 5.2.0: the virtual config
 * module, the dep-optimiser entries, the dev host, and the admin UI route.
 * Drop this file, and the route beside it, once upstream supports Astro 7.
 */
export default function keystaticWithoutApiRoute() {
  return {
    name: 'keystatic-without-api-route',
    hooks: {
      'astro:config:setup': ({ injectRoute, updateConfig, config }) => {
        updateConfig({
          server: config.server.host ? {} : { host: '127.0.0.1' },
          vite: {
            plugins: [
              {
                name: 'keystatic',
                resolveId(id) {
                  if (id === 'virtual:keystatic-config') {
                    return this.resolve('./keystatic.config', './a');
                  }
                  return null;
                },
              },
            ],
            optimizeDeps: {
              entries: ['keystatic.config.*', '.astro/keystatic-imports.js'],
            },
          },
        });

        const dotAstroDir = new URL('./.astro/', config.root);
        mkdirSync(dotAstroDir, { recursive: true });
        writeFileSync(
          new URL('keystatic-imports.js', dotAstroDir),
          'import "@keystatic/astro/ui";\nimport "@keystatic/astro/api";\nimport "@keystatic/core/ui";\n',
        );

        injectRoute({
          entrypoint: '@keystatic/astro/internal/keystatic-astro-page.astro',
          pattern: '/keystatic/[...params]',
          prerender: false,
        });

        // The /api/keystatic/[...params] route is deliberately not injected.
      },
    },
  };
}
