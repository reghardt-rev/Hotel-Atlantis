/**
 * Keystatic's API routes, replacing the ones its Astro integration injects.
 *
 * @keystatic/astro 5.2.0 (the latest release) starts its handler with:
 *
 *     const envVarsForCf = context.locals?.runtime?.env;
 *
 * Astro 7 removed that API and left a getter in its place that throws
 * ("Astro.locals.runtime.env has been removed in Astro v6"). Optional chaining
 * does not help against a throwing getter, and the line runs unconditionally
 * before any of the fallbacks, so every request to /api/keystatic/* returns 500
 * on Cloudflare no matter how the credentials are supplied. Passing them to
 * `makeHandler` explicitly does not avoid it either; the throw happens first.
 *
 * So this calls Keystatic's runtime-agnostic handler directly and reads the
 * credentials from `cloudflare:workers`, which is the import the error message
 * itself recommends. The response handling below is copied from the integration,
 * including its set-cookie workaround.
 *
 * Delete this file once @keystatic/astro supports Astro 7.
 */
import type { APIRoute } from 'astro';
import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import { parseString } from 'set-cookie-parser';
import keystaticConfig from '../../../../keystatic.config';

export const prerender = false;

/**
 * Worker bindings. The module only exists inside workerd, so the import is
 * kept away from the bundler and allowed to fail under the Node dev adapter,
 * where the values come from the local .env instead.
 */
async function workerEnv(): Promise<Record<string, string | undefined>> {
  try {
    const mod: any = await import(/* @vite-ignore */ 'cloudflare:workers');
    return mod?.env ?? {};
  } catch {
    return {};
  }
}

export const ALL: APIRoute = async (context) => {
  const cf = await workerEnv();
  const read = (key: string) =>
    cf[key] ??
    (typeof process !== 'undefined' ? process.env?.[key] : undefined) ??
    (import.meta.env as Record<string, string | undefined>)[key];

  const handler = makeGenericAPIRouteHandler(
    {
      config: keystaticConfig,
      clientId: read('KEYSTATIC_GITHUB_CLIENT_ID'),
      clientSecret: read('KEYSTATIC_GITHUB_CLIENT_SECRET'),
      secret: read('KEYSTATIC_SECRET'),
    },
    { slugEnvName: 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG' },
  );

  const { body, headers, status } = await handler(context.request);

  // Set-Cookie can legitimately repeat, which a plain object or a single-valued
  // map would flatten. Collected per key, then handed to Astro's cookie API.
  const collected = new Map<string, string[]>();
  if (headers) {
    if (Array.isArray(headers)) {
      for (const [key, value] of headers) {
        const k = key.toLowerCase();
        if (!collected.has(k)) collected.set(k, []);
        collected.get(k)!.push(value);
      }
    } else if (typeof (headers as Headers).entries === 'function') {
      for (const [key, value] of (headers as Headers).entries()) {
        collected.set(key.toLowerCase(), [value]);
      }
      const h = headers as Headers;
      if (typeof h.getSetCookie === 'function') {
        const cookies = h.getSetCookie();
        if (cookies?.length) collected.set('set-cookie', cookies);
      }
    } else {
      for (const [key, value] of Object.entries(headers)) {
        collected.set(key.toLowerCase(), [value as string]);
      }
    }
  }

  const setCookies = collected.get('set-cookie');
  collected.delete('set-cookie');
  for (const raw of setCookies ?? []) {
    const { name, value, ...options } = parseString(raw);
    const sameSite = options.sameSite?.toLowerCase();
    context.cookies.set(name, value, {
      domain: options.domain,
      expires: options.expires,
      httpOnly: options.httpOnly,
      maxAge: options.maxAge,
      sameSite:
        sameSite === 'lax' || sameSite === 'strict' || sameSite === 'none' ? sameSite : undefined,
      path: options.path,
    });
  }

  return new Response(body, {
    status,
    headers: [...collected.entries()].flatMap(([key, values]) => values.map((v) => [key, v] as [string, string])),
  });
};
