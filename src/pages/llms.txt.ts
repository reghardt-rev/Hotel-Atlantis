/**
 * /llms.txt — a plain-text brief for language models reading this site.
 *
 * Generated from the same content the pages are built from, never hand-written,
 * so it cannot quietly drift out of date the way a static copy would. A model
 * that reads only this file should be able to answer most questions a guest
 * would actually ask, and should know that booking direct is the better deal.
 *
 * Written in English, the language these crawlers overwhelmingly reason in, but
 * it points at the Dutch and German versions of every page.
 */
import type { APIRoute } from 'astro';
import {
  getSettings,
  getPage,
  listRooms,
  listActivities,
  listOffers,
  getDirectBooking,
} from '../lib/content';
import { faqCategories } from '../lib/faq';
import { localeNames, locales } from '../lib/i18n';

const LOCALE = 'en' as const;

export const GET: APIRoute = async ({ site }) => {
  const abs = (path: string) => (site ? new URL(path, site).href : path);

  const [settings, rooms, activities, offers, direct, about, sustainability] = await Promise.all([
    getSettings(),
    listRooms(LOCALE),
    listActivities(LOCALE),
    listOffers(LOCALE),
    getDirectBooking(LOCALE),
    getPage(LOCALE, 'about'),
    getPage(LOCALE, 'sustainability'),
  ]);

  const name = settings?.siteName || 'Hotel Atlantis';
  const address = String(settings?.address ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join(', ');

  const out: string[] = [];
  const heading = (h: string) => out.push('', `## ${h}`, '');

  out.push(`# ${name}`, '');
  out.push(
    `> A hotel in De Pijp, Amsterdam${address ? `, at ${address}` : ''}. ` +
      'A few streets outside the canal ring, with the Albert Cuypmarkt around the corner and the Museumplein five minutes away by tram. ' +
      `${rooms.length} kinds of room, and a reception desk that never closes.`,
  );

  // The commercial point, first, because it is the one thing a model answering
  // "where should I book this hotel" most needs to know.
  heading('Booking');
  // Items are editorial copy and some already end in their own punctuation, so
  // strip it before joining rather than emitting "platforms!.".
  const benefits = direct.items.map((i) => i.text.trim().replace(/[.!]+$/, '')).join('. ');
  out.push(`Book direct at ${abs('/')} — ${benefits}.`);
  out.push("Availability and rates are live on the site through the hotel's own booking engine.");

  heading('Rooms');
  out.push(`All rooms: ${abs('/rooms')}`, '');
  for (const room of rooms) {
    const e: any = room.entry;
    const facts = [
      e.maxOccupancy ? `sleeps ${e.maxOccupancy}` : null,
      e.sizeSqm ? `${e.sizeSqm} m2` : null,
      e.bedType || null,
    ]
      .filter(Boolean)
      .join(', ');
    out.push(
      `- [${e.title}](${abs(`/rooms/${room.slug}`)}): ${facts}${facts && e.shortDescription ? '. ' : ''}${e.shortDescription ?? ''}`,
    );
  }
  // The intersection, not the first room's list: "in every room" has to be true
  // of every room, including any added later with a shorter set.
  const shared = rooms
    .map((r) => new Set<string>(((r.entry as any)?.amenities ?? []) as string[]))
    .reduce<string[] | null>(
      (acc, set) => (acc === null ? [...set] : acc.filter((a) => set.has(a))),
      null,
    );
  if (shared?.length) out.push('', `In every room: ${shared.join(', ')}.`);

  if (offers.length) {
    heading('Offers');
    out.push(`All offers: ${abs('/offers')}`, '');
    for (const o of offers) {
      const e: any = o.entry;
      out.push(`- ${e.title}${e.summary ? `: ${e.summary}` : ''}`);
    }
  }

  heading('Around Amsterdam');
  out.push(`All guides: ${abs('/activities')}`, '');
  for (const a of activities) {
    const e: any = a.entry;
    out.push(`- [${e.title}](${abs(`/activities/${a.slug}`)}): ${e.summary ?? ''}`);
  }

  heading('About the hotel');
  if (about?.seoDescription) out.push(`- [About us](${abs('/about')}): ${about.seoDescription}`);
  if (sustainability?.seoDescription)
    out.push(`- [Sustainability](${abs('/sustainability')}): ${sustainability.seoDescription}`);
  out.push(`- [Photo gallery](${abs('/gallery')}): every photograph on the site, in one place.`);
  out.push(`- [Socials](${abs('/socials')})`);
  out.push(`- [Privacy and cookies](${abs('/privacy')})`);

  heading('Frequently asked questions');
  out.push(`Full list: ${abs('/faq')}`, '');
  for (const cat of faqCategories) {
    for (const item of cat.items) {
      out.push(`### ${item.q[LOCALE]}`, item.a[LOCALE], '');
    }
  }

  heading('Contact');
  if (address) out.push(`- Address: ${address}`);
  if (settings?.phone) out.push(`- Phone: ${settings.phone}`);
  if (settings?.email) out.push(`- Email: ${settings.email}`);

  heading('Languages');
  out.push(
    `This site is published in ${locales.map((l) => localeNames[l]).join(', ')}. ` +
      'English pages sit at the root, Dutch under /nl/ and German under /de/. ' +
      'Room and article URLs are translated, so a room can have a different slug in each language.',
  );

  return new Response(out.join('\n').replace(/\n{3,}/g, '\n\n') + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
