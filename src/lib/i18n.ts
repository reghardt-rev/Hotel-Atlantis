export const locales = ['en', 'nl', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  nl: 'Nederlands',
  de: 'Deutsch',
};

/** BCP-47 tags, used for date formatting and the Mews booking engine. */
export const localeTags: Record<Locale, string> = {
  en: 'en-GB',
  nl: 'nl-NL',
  de: 'de-DE',
};

/** Long-form date, e.g. "20 July 2026" / "20 juli 2026" / "20. Juli 2026". */
export function formatDate(locale: Locale, value?: string | null): string {
  if (!value) return '';
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(localeTags[locale], { day: 'numeric', month: 'long', year: 'numeric' });
}

export const ui = {
  en: {
    nav: { rooms: 'Rooms', offers: 'Offers', activities: 'Activities', location: 'Amsterdam', contact: 'Contact' },
    book: 'Book now',
    bookDirect: 'Book direct for our best rate',
    from: 'From',
    perNight: 'per night',
    viewRoom: 'View room',
    ourRooms: 'Rooms & suites',
    ourOffers: 'Special offers',
    ourActivities: 'Things to do',
    allActivities: 'View all activities',
    readMore: 'Read more',
    backToActivities: '← All activities',
    noActivities: 'Nothing published yet.',
    allRooms: 'View all rooms',
    guests: 'guests',
    sizeLabel: 'Size',
    bedLabel: 'Bed',
    backToRooms: '← All rooms',
    reviewsLabel: 'reviews',
    reviewsOn: 'on',
    booking: {
      arrival: 'Arrival',
      departure: 'Departure',
      guests: 'Guests',
      guestOne: 'guest',
      guestMany: 'guests',
    },
    promo: {
      title: 'Book direct and save',
      body: 'Booking on this website always gets you our best available rate, plus the offers below.',
      allOffers: 'View all offers',
      close: 'Close',
    },
    cookies: {
      title: 'Cookies',
      body: 'We use analytics cookies to understand how this site is used. They are only set if you accept.',
      accept: 'Accept',
      reject: 'Reject',
      manage: 'Cookie settings',
    },
    privacy: 'Privacy',
  },
  nl: {
    nav: { rooms: 'Kamers', offers: 'Aanbiedingen', activities: 'Activiteiten', location: 'Amsterdam', contact: 'Contact' },
    book: 'Nu boeken',
    bookDirect: 'Boek direct voor de beste prijs',
    from: 'Vanaf',
    perNight: 'per nacht',
    viewRoom: 'Bekijk kamer',
    ourRooms: 'Kamers & suites',
    ourOffers: 'Speciale aanbiedingen',
    ourActivities: 'Te doen',
    allActivities: 'Bekijk alle activiteiten',
    readMore: 'Lees meer',
    backToActivities: '← Alle activiteiten',
    noActivities: 'Nog niets gepubliceerd.',
    allRooms: 'Bekijk alle kamers',
    guests: 'gasten',
    sizeLabel: 'Grootte',
    bedLabel: 'Bed',
    backToRooms: '← Alle kamers',
    reviewsLabel: 'beoordelingen',
    reviewsOn: 'op',
    booking: {
      arrival: 'Aankomst',
      departure: 'Vertrek',
      guests: 'Gasten',
      guestOne: 'gast',
      guestMany: 'gasten',
    },
    promo: {
      title: 'Boek direct en bespaar',
      body: 'Boeken via deze website levert u altijd onze beste beschikbare prijs op, plus de aanbiedingen hieronder.',
      allOffers: 'Bekijk alle aanbiedingen',
      close: 'Sluiten',
    },
    cookies: {
      title: 'Cookies',
      body: 'We gebruiken analytische cookies om te begrijpen hoe deze site wordt gebruikt. Ze worden alleen geplaatst als u accepteert.',
      accept: 'Accepteren',
      reject: 'Weigeren',
      manage: 'Cookievoorkeuren',
    },
    privacy: 'Privacy',
  },
  de: {
    nav: { rooms: 'Zimmer', offers: 'Angebote', activities: 'Aktivitäten', location: 'Amsterdam', contact: 'Kontakt' },
    book: 'Jetzt buchen',
    bookDirect: 'Direkt buchen zum besten Preis',
    from: 'Ab',
    perNight: 'pro Nacht',
    viewRoom: 'Zimmer ansehen',
    ourRooms: 'Zimmer & Suiten',
    ourOffers: 'Angebote',
    ourActivities: 'Unternehmungen',
    allActivities: 'Alle Aktivitäten ansehen',
    readMore: 'Mehr lesen',
    backToActivities: '← Alle Aktivitäten',
    noActivities: 'Noch nichts veröffentlicht.',
    allRooms: 'Alle Zimmer ansehen',
    guests: 'Gäste',
    sizeLabel: 'Größe',
    bedLabel: 'Bett',
    backToRooms: '← Alle Zimmer',
    reviewsLabel: 'Bewertungen',
    reviewsOn: 'auf',
    booking: {
      arrival: 'Anreise',
      departure: 'Abreise',
      guests: 'Gäste',
      guestOne: 'Gast',
      guestMany: 'Gäste',
    },
    promo: {
      title: 'Direkt buchen und sparen',
      body: 'Wer auf dieser Website bucht, erhält immer unseren besten verfügbaren Preis, dazu die Angebote unten.',
      allOffers: 'Alle Angebote ansehen',
      close: 'Schließen',
    },
    cookies: {
      title: 'Cookies',
      body: 'Wir verwenden Analyse-Cookies, um zu verstehen, wie diese Website genutzt wird. Sie werden nur gesetzt, wenn Sie zustimmen.',
      accept: 'Akzeptieren',
      reject: 'Ablehnen',
      manage: 'Cookie-Einstellungen',
    },
    privacy: 'Datenschutz',
  },
} as const;

export function t(locale: Locale) {
  return ui[locale];
}

/** Homepage section anchors used by the nav. */
export const sections = ['rooms', 'offers', 'activities', 'location', 'contact'] as const;
export type SectionId = (typeof sections)[number];

const prefixRe = new RegExp(`^/(${locales.filter((l) => l !== defaultLocale).join('|')})(?=/|$)`);

/**
 * Build a locale-aware path.
 *   en (default) -> /rooms         (no prefix)
 *   nl / de      -> /nl/rooms, /de/rooms
 */
export function localePath(locale: Locale, path = '/'): string {
  const clean = '/' + String(path).replace(/^\/+/, '');
  if (locale === defaultLocale) return clean;
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
}

/** Link to a homepage section anchor from any page (returns to home first). */
export function sectionHref(locale: Locale, id: SectionId): string {
  return `${localePath(locale, '/')}#${id}`;
}

/** Strip the locale prefix from a pathname (for the language switcher). */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(prefixRe, '');
  return stripped === '' ? '/' : stripped;
}
