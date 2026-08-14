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
    allOffers: 'View all offers',
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
        '10% discount',
        'Free late check-out',
        'Free early check-in from 2pm',
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
    facilities: {
      title: 'Facilities',
      heading: 'What we offer',
      intro: 'Breakfast, the all-inclusive lobby and a desk that never closes.',
      back: '← All facilities',
      all: 'All facilities',
      empty: 'Nothing published yet.',
    },
    contact: {
      heading: 'Come and say hello',
      details: 'Details',
      gettingHere: 'Getting here',
      showMap: 'Show the map',
      mapNote: 'Opens Google Maps in the page, which sets its own cookies.',
      mapTitle: 'Map showing Hotel Atlantis, Ceintuurbaan 215-217, Amsterdam',
      directions: 'Open in Google Maps',
    },
    terms: 'Terms & conditions',
    partners: 'Part of the Highland Group',
    byGroup: 'by Highland Group',
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
    allOffers: 'Bekijk alle aanbiedingen',
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
        '10% korting',
        'Gratis laat uitchecken',
        'Gratis vroeg inchecken vanaf 14.00 uur',
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
    facilities: {
      title: 'Faciliteiten',
      heading: 'Wat wij bieden',
      intro: 'Ontbijt, de all-inclusive lobby en een receptie die nooit sluit.',
      back: '← Alle faciliteiten',
      all: 'Alle faciliteiten',
      empty: 'Nog niets gepubliceerd.',
    },
    contact: {
      heading: 'Kom gerust even hallo zeggen',
      details: 'Gegevens',
      gettingHere: 'Zo komt u er',
      showMap: 'Toon de kaart',
      mapNote: 'Opent Google Maps in de pagina, die zijn eigen cookies plaatst.',
      mapTitle: 'Kaart met Hotel Atlantis, Ceintuurbaan 215-217, Amsterdam',
      directions: 'Openen in Google Maps',
    },
    terms: 'Algemene voorwaarden',
    partners: 'Onderdeel van de Highland Group',
    byGroup: 'van Highland Group',
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
    allOffers: 'Alle Angebote ansehen',
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
        '10% Rabatt',
        'Kostenloser später Check-out',
        'Kostenloser früher Check-in ab 14 Uhr',
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
    facilities: {
      title: 'Ausstattung',
      heading: 'Was wir bieten',
      intro: 'Frühstück, die All-inclusive-Lobby und eine Rezeption, die nie schließt.',
      back: '← Alle Ausstattung',
      all: 'Alle Ausstattung',
      empty: 'Noch nichts veröffentlicht.',
    },
    contact: {
      heading: 'Sagen Sie gern Hallo',
      details: 'Kontaktdaten',
      gettingHere: 'Anreise',
      showMap: 'Karte anzeigen',
      mapNote: 'Öffnet Google Maps in der Seite, das eigene Cookies setzt.',
      mapTitle: 'Karte mit dem Hotel Atlantis, Ceintuurbaan 215-217, Amsterdam',
      directions: 'In Google Maps öffnen',
    },
    terms: 'Allgemeine Geschäftsbedingungen',
    partners: 'Teil der Highland Group',
    byGroup: 'von Highland Group',
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
