/**
 * Client-side analytics helper.
 *
 * gtag() is loaded directly in Layout.astro from the GA4 measurement id in Site
 * settings. When that id is blank the function does not exist, so this has to
 * no-op rather than throw — and it must also survive an ad blocker removing
 * gtag entirely, which is common enough to matter.
 *
 * Deliberately does NOT also push a GTM custom event: if a GTM tag were later
 * built on the same name, GA4 would receive the event twice.
 */
export function track(name: string, params: Record<string, unknown> = {}): void {
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };

  try {
    if (typeof w.gtag === 'function') {
      w.gtag('event', name, params);
    } else {
      // No gtag (id blank, or blocked): leave a trace for GTM if it is present.
      (w.dataLayer = w.dataLayer || []).push({ event: name, ...params });
    }
  } catch {
    /* analytics must never break the page */
  }
}
