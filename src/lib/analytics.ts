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
    // Every event carries the hero variant while a split test is running, so
    // the existing conversions can be compared between arms without each call
    // site having to know the experiment exists.
    const variant = document.documentElement.dataset.heroVariant;
    const payload = variant ? { hero_variant: variant, ...params } : params;

    if (typeof w.gtag === 'function') {
      w.gtag('event', name, payload);
    } else {
      // No gtag (id blank, or blocked): leave a trace for GTM if it is present.
      (w.dataLayer = w.dataLayer || []).push({ event: name, ...payload });
    }
  } catch {
    /* analytics must never break the page */
  }
}
