/**
 * Schema.org JSON-LD, built per page type.
 *
 * This is the "AI Connector" idea, implemented at build time rather than as a
 * client-side snippet. The spec describes a script that detects the page type in
 * the browser and injects the right JSON-LD, which is the correct design for a
 * site Revenue Guru does not control and cannot edit the template of. Here we do
 * control it, and that changes the answer: most AI crawlers fetch raw HTML and do
 * not run JavaScript, so schema injected by a script is invisible to precisely
 * the readers this feature is for. Googlebot does render JS, but on a second pass
 * and with no guarantee of when. Emitting into the prerendered HTML is seen by
 * everything, first pass, and costs nothing at runtime rather than almost nothing.
 *
 * Every builder returns a plain object. `Layout` serialises whatever it is given.
 */
import type { Locale } from './i18n';
import { localeTags } from './i18n';
import { faqCategories } from './faq';
import { socialLinks } from './social';

type Json = Record<string, any>;

/** Drops empty values, so a missing field is absent rather than null. */
function clean<T extends Json>(obj: T): T {
  for (const [k, v] of Object.entries(obj)) {
    const empty =
      v === undefined ||
      v === null ||
      v === '' ||
      (Array.isArray(v) && v.length === 0) ||
      (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0);
    if (empty) delete (obj as Json)[k];
  }
  return obj;
}

export function absolute(site: URL | undefined, path: string): string {
  return site ? new URL(path, site).href : path;
}

/**
 * The address is one multiline text field in Keystatic, so it is split rather
 * than stored as parts. Anything that does not match the expected shape falls
 * through as a plain street address rather than being guessed at.
 */
function postalAddress(address?: string): Json | undefined {
  if (!address) return undefined;
  const lines = address
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return undefined;

  const [street, middle, country] = lines;
  const dutchPostcode = middle?.match(/^(\d{4}\s?[A-Z]{2})\s+(.+)$/);
  return clean({
    '@type': 'PostalAddress',
    streetAddress: street,
    postalCode: dutchPostcode?.[1],
    addressLocality: dutchPostcode?.[2] ?? (lines.length > 2 ? middle : undefined),
    addressCountry: country ?? (lines.length === 2 ? middle : undefined),
  });
}

/**
 * The hotel itself. Referenced by `@id` from the other page types.
 *
 * The guest score in Site settings is an aggregate of real reviews, so it is
 * emitted as `aggregateRating` rather than as `starRating`: the latter is the
 * hotel's own classification, which this site does not record. Both halves are
 * required by Google for the rating to be eligible at all, so a score with no
 * review count is left out rather than published on its own.
 */
export function hotelSchema(settings: any, locale: Locale, site?: URL): Json {
  const home = absolute(site, '/');
  const score = Number(settings?.reviewScore) || 0;
  const count = Number(settings?.reviewCount) || 0;

  return clean({
    '@type': 'Hotel',
    '@id': `${home}#hotel`,
    name: settings?.siteName || 'Hotel Atlantis',
    url: home,
    description: settings?.tagline || undefined,
    address: postalAddress(settings?.address),
    telephone: settings?.phone || undefined,
    email: settings?.email || undefined,
    inLanguage: localeTags[locale],
    sameAs: socialLinks(settings).map((l) => l.href),
    aggregateRating:
      score > 0 && count > 0
        ? clean({
            '@type': 'AggregateRating',
            ratingValue: score,
            bestRating: 10,
            worstRating: 1,
            reviewCount: count,
          })
        : undefined,
  });
}

/**
 * A room. `Accommodation` data as the spec asks: type, capacity, amenities and
 * rate. The rate is only emitted where one is actually recorded, because a
 * `priceRange` on a room with no price would be a fabricated number in a field
 * search engines display verbatim.
 */
export function roomSchema(room: any, settings: any, locale: Locale, path: string, site?: URL): Json {
  const e = room.entry ?? room;
  const url = absolute(site, path);
  const price = typeof e.priceFrom === 'number' && e.priceFrom > 0 ? e.priceFrom : null;

  return clean({
    '@type': 'HotelRoom',
    '@id': `${url}#room`,
    name: e.title,
    url,
    description: e.shortDescription || undefined,
    inLanguage: localeTags[locale],
    containedInPlace: { '@id': `${absolute(site, '/')}#hotel` },
    occupancy: e.maxOccupancy
      ? { '@type': 'QuantitativeValue', maxValue: e.maxOccupancy, unitText: 'guests' }
      : undefined,
    floorSize: e.sizeSqm
      ? { '@type': 'QuantitativeValue', value: e.sizeSqm, unitCode: 'MTK' }
      : undefined,
    bed: e.bedType ? { '@type': 'BedDetails', typeOfBed: e.bedType } : undefined,
    amenityFeature: (e.amenities ?? []).map((a: string) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
    photo: (room.photos ?? []).slice(0, 6).map((p: any) => absolute(site, p.src)),
    offers: price
      ? clean({
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price,
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price,
            priceCurrency: 'EUR',
            unitText: 'per night',
          },
          availability: 'https://schema.org/InStock',
          url,
        })
      : undefined,
  });
}

/**
 * FAQPage, read straight off the FAQ content rather than kept as a second copy,
 * so it cannot fall out of step with what the page shows.
 */
export function faqSchema(locale: Locale, path: string, site?: URL): Json {
  const items = faqCategories.flatMap((c) => c.items);
  return {
    '@type': 'FAQPage',
    '@id': `${absolute(site, path)}#faq`,
    inLanguage: localeTags[locale],
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q[locale],
      acceptedAnswer: { '@type': 'Answer', text: item.a[locale] },
    })),
  };
}

/** An activity article. */
export function articleSchema(activity: any, locale: Locale, path: string, site?: URL): Json {
  const url = absolute(site, path);
  return clean({
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: activity.title,
    description: activity.summary || undefined,
    datePublished: activity.publishedAt || undefined,
    inLanguage: localeTags[locale],
    url,
    image: activity.image ? absolute(site, activity.image) : undefined,
    publisher: { '@id': `${absolute(site, '/')}#hotel` },
  });
}

/** Anything with no richer type of its own. */
export function pageSchema(name: string, description: string, locale: Locale, path: string, site?: URL): Json {
  return clean({
    '@type': 'WebPage',
    name,
    description: description || undefined,
    url: absolute(site, path),
    inLanguage: localeTags[locale],
    isPartOf: { '@id': `${absolute(site, '/')}#hotel` },
  });
}

/** Wraps one or more nodes into the single graph a page emits. */
export function graph(nodes: (Json | undefined | false)[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  });
}
