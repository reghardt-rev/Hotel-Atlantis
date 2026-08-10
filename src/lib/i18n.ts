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
    menu: { open: 'Menu', close: 'Close menu', follow: 'Follow us' },
    about: 'About us',
    socials: 'Socials',
    sustainability: 'Sustainability',
    socialsIntro: 'Follow the hotel for rooms, offers and what is happening in Amsterdam.',
    socialsEmpty: 'No channels have been added yet.',
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
    scrollPrev: 'Previous rooms',
    scrollNext: 'More rooms',
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
    rating: {
      stars: '{count}-star hotel',
      reviews: '{count} reviews',
    },
    // What the guest gets by booking on this site instead of through an OTA.
    // Kept to claims the hotel already makes elsewhere on the site, plus the two
    // that are simply true of booking direct.
    directBook: {
      title: 'Book direct',
      items: [
        'Our best rate, guaranteed',
        'No booking fees',
        'Special requests straight to the hotel',
        'A reception desk that never closes',
      ],
    },
    gallery: {
      title: 'Gallery',
      intro: 'Every photograph on this site, in one place.',
      all: 'Everything',
      hotel: 'The hotel',
      rooms: 'Rooms',
      activities: 'Around Amsterdam',
      offers: 'Offers',
      news: 'News',
      close: 'Close',
      prev: 'Previous photo',
      next: 'Next photo',
      empty: 'No photographs yet.',
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
    designedBy: 'Designed by',
  },
  nl: {
    nav: { rooms: 'Kamers', offers: 'Aanbiedingen', activities: 'Activiteiten', location: 'Amsterdam', contact: 'Contact' },
    book: 'Nu boeken',
    bookDirect: 'Boek direct voor de beste prijs',
    menu: { open: 'Menu', close: 'Menu sluiten', follow: 'Volg ons' },
    about: 'Over ons',
    socials: 'Social media',
    sustainability: 'Duurzaamheid',
    socialsIntro: 'Volg het hotel voor kamers, aanbiedingen en wat er in Amsterdam gebeurt.',
    socialsEmpty: 'Er zijn nog geen kanalen toegevoegd.',
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
    scrollPrev: 'Vorige kamers',
    scrollNext: 'Meer kamers',
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
    rating: {
      stars: '{count}-sterrenhotel',
      reviews: '{count} beoordelingen',
    },
    directBook: {
      title: 'Direct boeken',
      items: [
        'Onze beste prijs, gegarandeerd',
        'Geen boekingskosten',
        'Speciale wensen rechtstreeks naar het hotel',
        'Een receptie die nooit sluit',
      ],
    },
    gallery: {
      title: 'Fotogalerij',
      intro: 'Alle foto\'s van deze website, bij elkaar.',
      all: 'Alles',
      hotel: 'Het hotel',
      rooms: 'Kamers',
      activities: 'Rondom Amsterdam',
      offers: 'Aanbiedingen',
      news: 'Nieuws',
      close: 'Sluiten',
      prev: 'Vorige foto',
      next: 'Volgende foto',
      empty: 'Nog geen foto\'s.',
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
    designedBy: 'Ontworpen door',
  },
  de: {
    nav: { rooms: 'Zimmer', offers: 'Angebote', activities: 'Aktivitäten', location: 'Amsterdam', contact: 'Kontakt' },
    book: 'Jetzt buchen',
    bookDirect: 'Direkt buchen zum besten Preis',
    menu: { open: 'Menü', close: 'Menü schließen', follow: 'Folgen Sie uns' },
    about: 'Über uns',
    socials: 'Social Media',
    sustainability: 'Nachhaltigkeit',
    socialsIntro: 'Folgen Sie dem Hotel für Zimmer, Angebote und Neues aus Amsterdam.',
    socialsEmpty: 'Es wurden noch keine Kanäle hinzugefügt.',
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
    scrollPrev: 'Vorherige Zimmer',
    scrollNext: 'Weitere Zimmer',
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
    rating: {
      stars: '{count}-Sterne-Hotel',
      reviews: '{count} Bewertungen',
    },
    directBook: {
      title: 'Direkt buchen',
      items: [
        'Unser bester Preis, garantiert',
        'Keine Buchungsgebühren',
        'Sonderwünsche direkt ans Hotel',
        'Eine Rezeption, die nie schließt',
      ],
    },
    gallery: {
      title: 'Galerie',
      intro: 'Alle Fotos dieser Website an einem Ort.',
      all: 'Alles',
      hotel: 'Das Hotel',
      rooms: 'Zimmer',
      activities: 'Rund um Amsterdam',
      offers: 'Angebote',
      news: 'Neuigkeiten',
      close: 'Schließen',
      prev: 'Vorheriges Foto',
      next: 'Nächstes Foto',
      empty: 'Noch keine Fotos.',
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
    designedBy: 'Gestaltet von',
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
