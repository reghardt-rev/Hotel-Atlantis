import type { Locale } from './i18n';

/**
 * The other hotels in the Highland Group, which Hotel Atlantis is part of.
 *
 * The group is a family business running six hotels in the centre of Amsterdam;
 * it began as Centre Hotels in 1998 and took the Highland name in 2018.
 *
 * Every URL here was checked in all three languages before it went in, and only
 * working ones are listed. Three are not simply `/${locale}/`:
 *
 *  - The Highlander and Tourist Inn serve English from their root; /en/ just
 *    redirects there, so the root is used directly.
 *  - The group's own German page currently 404s, so German visitors are sent to
 *    the root rather than to a dead link, until that is fixed.
 *
 * Atlantis itself is deliberately absent: this is the list of the *other*
 * houses, shown on Atlantis's own site.
 */
export type Partner = { name: string; href: string };

const COLLECTION: Record<Locale, string> = {
  en: 'https://www.highlandgroup.nl/',
  nl: 'https://www.highlandgroup.nl/nl/',
  de: 'https://www.highlandgroup.nl/',
};

/** Per-locale homepage for each house, in the order the group lists them. */
const HOTELS: { name: string; urls: Record<Locale, string> }[] = [
  {
    name: 'The Highlander Hotel',
    urls: {
      en: 'https://www.thehighlanderhotel.com/',
      nl: 'https://www.thehighlanderhotel.com/nl/',
      de: 'https://www.thehighlanderhotel.com/de/',
    },
  },
  {
    name: 'Mister Highland',
    urls: {
      en: 'https://www.misterhighlandhotel.com/en/',
      nl: 'https://www.misterhighlandhotel.com/nl/',
      de: 'https://www.misterhighlandhotel.com/de/',
    },
  },
  {
    name: 'The Highland House',
    urls: {
      en: 'https://www.thehighlandhouse.com/en/',
      nl: 'https://www.thehighlandhouse.com/nl/',
      de: 'https://www.thehighlandhouse.com/de/',
    },
  },
  {
    name: 'Hotel Sint Nicolaas',
    urls: {
      en: 'https://www.hotelnicolaas.nl/en/',
      nl: 'https://www.hotelnicolaas.nl/nl/',
      de: 'https://www.hotelnicolaas.nl/de/',
    },
  },
  {
    name: 'Tourist Inn',
    urls: {
      en: 'https://www.tourist-inn.com/',
      nl: 'https://www.tourist-inn.com/nl/',
      de: 'https://www.tourist-inn.com/de/',
    },
  },
];

export function partners(locale: Locale): Partner[] {
  return HOTELS.map((hotel) => ({ name: hotel.name, href: hotel.urls[locale] }));
}

export function collectionHref(locale: Locale): string {
  return COLLECTION[locale];
}
