/**
 * Where the hotel is, as Google Maps understands it.
 *
 * Three places on the site link to the map — the contact page, the contact
 * section on the homepage, and now the address in the footer — and each had
 * built the URL itself. Two of them had drifted: the contact page searched for
 * the hotel by name and address, the homepage for the address alone, which
 * resolves to a point on the street rather than to the business.
 *
 * The name goes in the query. Searching for the address alone drops a pin on
 * Ceintuurbaan; searching for the hotel finds the listing, with its photographs,
 * hours and reviews, which is what someone tapping an address is usually after.
 */

/** The encoded search term: the hotel by name, then its address on one line. */
export function mapsQuery(settings: any): string {
  const address = String(settings?.address ?? '').trim();
  return encodeURIComponent(
    [settings?.siteName, address.replace(/\n/g, ', ')].filter(Boolean).join(', '),
  );
}

/**
 * A link to the place on Google Maps, or nothing when there is no address to
 * point at — so a caller can decide between a link and plain text rather than
 * rendering one that searches for nothing.
 *
 * `search/?api=1` is Google's documented URL form, which the older
 * `maps.google.com/?q=` one is not.
 */
export function mapsHref(settings: any): string | undefined {
  const address = String(settings?.address ?? '').trim();
  if (!address) return undefined;
  return `https://www.google.com/maps/search/?api=1&query=${mapsQuery(settings)}`;
}

/** The same place as an embeddable map, for the contact page's iframe. */
export function mapsEmbedSrc(settings: any): string {
  return `https://www.google.com/maps?q=${mapsQuery(settings)}&output=embed`;
}
