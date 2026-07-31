import type { Locale } from './i18n';

type L = Record<Locale, string>;
export interface FaqItem {
  q: L;
  a: L;
}
export interface FaqCategory {
  id: string;
  title: L;
  items: FaqItem[];
}

export const faqPageTitle: L = {
  en: 'Frequently asked questions',
  nl: 'Veelgestelde vragen',
  de: 'Häufig gestellte Fragen',
};
export const faqShortTitle: L = {
  en: 'Good to know',
  nl: 'Goed om te weten',
  de: 'Gut zu wissen',
};
export const allFaqsLabel: L = {
  en: 'All questions',
  nl: 'Alle vragen',
  de: 'Alle Fragen',
};

export const faqCategories: FaqCategory[] = [
  {
    id: 'arrival',
    title: { en: 'Arrival & departure', nl: 'Aankomst & vertrek', de: 'Anreise & Abreise' },
    items: [
      {
        q: { en: 'What time are check-in and check-out?', nl: 'Hoe laat is het in- en uitchecken?', de: 'Wann sind Check-in und Check-out?' },
        a: {
          en: 'Check-in is from 15:00 to 21:00; arriving later is no problem, we send you a digital guest key. Check-out is until 10:30, and a late check-out until 13:30 is available for €35.',
          nl: 'Inchecken kan van 15:00 tot 21:00 uur; later aankomen is geen probleem, we sturen u dan een digitale sleutel. Uitchecken kan tot 10:30 uur, en laat uitchecken tot 13:30 uur is mogelijk voor €35.',
          de: 'Check-in ist von 15:00 bis 21:00 Uhr; eine spätere Anreise ist kein Problem, wir senden Ihnen dann einen digitalen Zimmerschlüssel. Check-out ist bis 10:30 Uhr, ein später Check-out bis 13:30 Uhr ist für €35 möglich.',
        },
      },
      {
        q: { en: 'Can I arrive early or leave my luggage?', nl: 'Kan ik eerder aankomen of mijn bagage achterlaten?', de: 'Kann ich früher anreisen oder mein Gepäck abgeben?' },
        a: {
          en: "You're welcome to store luggage at reception before check-in and after check-out (until 20:00). We can't guarantee your room is ready before 15:00.",
          nl: 'U kunt uw bagage vóór het inchecken en na het uitchecken (tot 20:00 uur) bij de receptie achterlaten. We kunnen niet garanderen dat uw kamer vóór 15:00 uur klaar is.',
          de: 'Sie können Ihr Gepäck vor dem Check-in und nach dem Check-out (bis 20:00 Uhr) an der Rezeption aufbewahren. Wir können nicht garantieren, dass Ihr Zimmer vor 15:00 Uhr bereit ist.',
        },
      },
      {
        q: { en: 'Is there parking?', nl: 'Is er parkeergelegenheid?', de: 'Gibt es Parkplätze?' },
        a: {
          en: 'We have spaces in our private car park, 350 metres from the hotel, for €27.50 per day (€15 per day from 1 November to 1 March).',
          nl: 'We hebben plekken in onze eigen parkeergarage, op 350 meter van het hotel, voor €27,50 per dag (€15 per dag van 1 november tot 1 maart).',
          de: 'Wir haben Stellplätze in unserem eigenen Parkhaus, 350 Meter vom Hotel entfernt, für €27,50 pro Tag (€15 pro Tag vom 1. November bis 1. März).',
        },
      },
    ],
  },
  {
    id: 'stay',
    title: { en: 'Your stay', nl: 'Uw verblijf', de: 'Ihr Aufenthalt' },
    items: [
      {
        q: { en: 'Do you serve breakfast?', nl: 'Serveren jullie ontbijt?', de: 'Servieren Sie Frühstück?' },
        a: {
          en: "Yes — order our 'Paradis' breakfast a day ahead and it's ready for you from 08:30.",
          nl: "Ja — bestel ons 'Paradis'-ontbijt een dag van tevoren en het staat vanaf 08:30 uur voor u klaar.",
          de: "Ja — bestellen Sie unser 'Paradis'-Frühstück einen Tag im Voraus, und es steht ab 08:30 Uhr für Sie bereit.",
        },
      },
      {
        q: { en: 'Is there WiFi?', nl: 'Is er wifi?', de: 'Gibt es WLAN?' },
        a: { en: 'Yes, free WiFi throughout the hotel.', nl: 'Ja, gratis wifi in het hele hotel.', de: 'Ja, kostenloses WLAN im gesamten Hotel.' },
      },
      {
        q: { en: 'Can I bring my dog?', nl: 'Mag mijn hond mee?', de: 'Darf mein Hund mit?' },
        a: {
          en: "Dogs are welcome (max 2 per room) for €25 per dog per night, including a small gift; you can borrow a water bowl. Dogs aren't allowed in the Small Double and Standard rooms.",
          nl: 'Honden zijn welkom (max. 2 per kamer) voor €25 per hond per nacht, inclusief een klein cadeautje; een waterbak kunt u van ons lenen. Honden zijn niet toegestaan in de Kleine tweepersoonskamer en de Standaardkamers.',
          de: 'Hunde sind willkommen (max. 2 pro Zimmer) für €25 pro Hund und Nacht, inklusive eines kleinen Geschenks; einen Wassernapf können Sie bei uns ausleihen. In den Kleinen Doppelzimmern und den Standardzimmern sind Hunde nicht erlaubt.',
        },
      },
      {
        q: { en: 'Can I rent a bike?', nl: 'Kan ik een fiets huren?', de: 'Kann ich ein Fahrrad leihen?' },
        a: {
          en: "Rent our 'Paradis' bike for €15 a day and explore Zandvoort and the dunes. Reserve at reception.",
          nl: "Huur onze 'Paradis'-fiets voor €15 per dag en ontdek Zandvoort en de duinen. Reserveer bij de receptie.",
          de: "Leihen Sie unser 'Paradis'-Fahrrad für €15 pro Tag und entdecken Sie Zandvoort und die Dünen. Reservieren Sie an der Rezeption.",
        },
      },
      {
        q: { en: 'Is reception staffed around the clock?', nl: 'Is de receptie 24/7 bezet?', de: 'Ist die Rezeption rund um die Uhr besetzt?' },
        a: {
          en: 'Reception is open 08:00–22:00; after that our night hostess is always reachable by phone or on call.',
          nl: 'De receptie is open van 08:00 tot 22:00 uur; daarna is onze nachtgastvrouw altijd telefonisch of op afroep bereikbaar.',
          de: 'Die Rezeption ist von 08:00 bis 22:00 Uhr geöffnet; danach ist unsere Nacht-Gastgeberin immer telefonisch oder auf Abruf erreichbar.',
        },
      },
      {
        q: { en: 'Can I smoke in the hotel?', nl: 'Mag ik roken in het hotel?', de: 'Darf ich im Hotel rauchen?' },
        a: {
          en: 'The hotel is 100% non-smoking. You may smoke outside or on your private balcony; smoking inside incurs a €250 fine.',
          nl: 'Het hotel is 100% rookvrij. Buiten of op uw eigen balkon mag u roken; binnen roken leidt tot een boete van €250.',
          de: 'Das Hotel ist zu 100 % rauchfrei. Draußen oder auf Ihrem eigenen Balkon dürfen Sie rauchen; Rauchen im Inneren führt zu einer Strafe von €250.',
        },
      },
      {
        q: { en: 'Do you have accessible rooms?', nl: 'Zijn er toegankelijke kamers?', de: 'Gibt es barrierefreie Zimmer?' },
        a: {
          en: 'We have ground-floor rooms suited to guests with reduced mobility — contact reception and we will help.',
          nl: 'We hebben kamers op de begane grond die geschikt zijn voor gasten met beperkte mobiliteit — neem contact op met de receptie en we helpen u graag.',
          de: 'Wir haben Zimmer im Erdgeschoss, die für Gäste mit eingeschränkter Mobilität geeignet sind — wenden Sie sich an die Rezeption, wir helfen Ihnen gerne.',
        },
      },
    ],
  },
  {
    id: 'booking',
    title: { en: 'Booking & payment', nl: 'Boeken & betalen', de: 'Buchung & Zahlung' },
    items: [
      {
        q: { en: 'How do I change or cancel my booking?', nl: 'Hoe wijzig of annuleer ik mijn boeking?', de: 'Wie ändere oder storniere ich meine Buchung?' },
        a: {
          en: 'Call or email us any time, or manage it online if you booked via Booking.com. The conditions depend on your rate (below).',
          nl: 'Bel of mail ons gerust, of regel het online als u via Booking.com heeft geboekt. De voorwaarden hangen af van uw tarief (zie hieronder).',
          de: 'Rufen Sie uns an oder schreiben Sie uns jederzeit, oder verwalten Sie sie online, wenn Sie über Booking.com gebucht haben. Die Bedingungen hängen von Ihrem Tarif ab (siehe unten).',
        },
      },
      {
        q: { en: 'What is your children and extra-bed policy?', nl: 'Wat is het beleid voor kinderen en extra bedden?', de: 'Wie ist die Regelung für Kinder und Zustellbetten?' },
        a: {
          en: "Children of all ages are welcome; under-6s stay free using existing bedding. We don't offer extra beds, but our family rooms and apartment sleep up to 4.",
          nl: 'Kinderen van alle leeftijden zijn welkom; kinderen onder de 6 verblijven gratis in het bestaande bed. We bieden geen extra bedden, maar onze familiekamers en het appartement bieden plaats aan maximaal 4 personen.',
          de: 'Kinder jeden Alters sind willkommen; Kinder unter 6 Jahren übernachten kostenlos im vorhandenen Bett. Wir bieten keine Zustellbetten an, aber unsere Familienzimmer und das Apartment bieten Platz für bis zu 4 Personen.',
        },
      },
      {
        q: { en: 'Which payment methods do you accept?', nl: 'Welke betaalmethoden accepteren jullie?', de: 'Welche Zahlungsmethoden akzeptieren Sie?' },
        a: {
          en: 'Maestro, V Pay, VISA and Mastercard. A credit card is required to guarantee a booking, and we may pre-authorise it.',
          nl: 'Maestro, V Pay, VISA en Mastercard. Een creditcard is nodig om een boeking te garanderen, en we kunnen deze pre-autoriseren.',
          de: 'Maestro, V Pay, VISA und Mastercard. Eine Kreditkarte ist erforderlich, um eine Buchung zu garantieren, und wir können sie vorautorisieren.',
        },
      },
      {
        q: { en: 'Is there a tourist tax?', nl: 'Is er toeristenbelasting?', de: 'Gibt es eine Kurtaxe?' },
        a: {
          en: 'Zandvoort charges a tourist tax of €3.50 per person, per night, on top of the room rate.',
          nl: 'Zandvoort rekent een toeristenbelasting van €3,50 per persoon, per nacht, bovenop de kamerprijs.',
          de: 'Zandvoort erhebt eine Kurtaxe von €3,50 pro Person und Nacht, zusätzlich zum Zimmerpreis.',
        },
      },
      {
        q: { en: "What's the difference between the flexible and non-refundable rates?", nl: 'Wat is het verschil tussen het flexibele en het niet-restitueerbare tarief?', de: 'Was ist der Unterschied zwischen dem flexiblen und dem nicht erstattbaren Tarif?' },
        a: {
          en: 'The flexible rate can be cancelled free up to 48 hours before arrival (later cancellations and no-shows are charged in full). The non-refundable rate is charged in full at booking and is not refundable.',
          nl: 'Het flexibele tarief kan tot 48 uur voor aankomst kosteloos worden geannuleerd (latere annuleringen en no-shows worden volledig in rekening gebracht). Het niet-restitueerbare tarief wordt bij het boeken volledig in rekening gebracht en wordt niet terugbetaald.',
          de: 'Der flexible Tarif kann bis 48 Stunden vor Anreise kostenlos storniert werden (spätere Stornierungen und Nichterscheinen werden voll berechnet). Der nicht erstattbare Tarif wird bei der Buchung voll berechnet und ist nicht erstattungsfähig.',
        },
      },
    ],
  },
];

export function allFaqItems(): FaqItem[] {
  return faqCategories.flatMap((c) => c.items);
}
