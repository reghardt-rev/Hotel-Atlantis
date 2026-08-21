import { createReader } from '@keystatic/core/reader';
import Markdoc from '@markdoc/markdoc';
import keystaticConfig from '../../keystatic.config';
import { t, type Locale } from './i18n';

/**
 * Filesystem reader used at build time to turn Keystatic content into pages.
 * (Storage mode in keystatic.config only affects the live /keystatic admin;
 * the reader always reads the committed files, which is exactly what we want
 * when Cloudflare Pages builds the static site from the repo.)
 */
export const reader = createReader(process.cwd(), keystaticConfig);

// The collection keys are `${type}_${locale}`; index dynamically.
const collections = reader.collections as Record<string, any>;

function byOrder(a: any, b: any) {
  return (a.entry.order ?? 0) - (b.entry.order ?? 0);
}

export type Photo = { src: string; alt: string };

/**
 * Room photography lives in the shared, non-localised `roomPhotos` collection,
 * so it is uploaded once and reused by every language of a room. The main photo
 * leads, then the gallery. Alt text is shared too, so it falls back to the
 * room's own (translated) title when a photo has none.
 */
async function readPhotos(key: string | null | undefined, fallbackAlt: string): Promise<Photo[]> {
  if (!key) return [];
  const set = await collections.roomPhotos.read(key);
  if (!set) return [];
  const extras = (set.images ?? [])
    .filter((p: any) => p?.image)
    .map((p: any) => ({ src: p.image, alt: p.alt || fallbackAlt }));
  return set.heroImage ? [{ src: set.heroImage, alt: fallbackAlt }, ...extras] : extras;
}

export async function listRooms(locale: Locale) {
  const items = await collections[`rooms_${locale}`].all();
  return Promise.all(
    items.sort(byOrder).map(async (item: any) => ({
      ...item,
      photos: await readPhotos(item.entry.photos, item.entry.title),
    })),
  );
}

export function getRoom(locale: Locale, slug: string) {
  return collections[`rooms_${locale}`].read(slug);
}

/** Resolve the shared photo set for a single room entry. */
export function getRoomPhotos(room: any): Promise<Photo[]> {
  return readPhotos(room?.photos, room?.title ?? '');
}

export async function listOffers(locale: Locale) {
  const items = await collections[`offers_${locale}`].all();
  return items.sort(byOrder);
}

/**
 * Published activities, newest first. `publishedAt` is an ISO date (YYYY-MM-DD),
 * so a plain string compare orders them correctly. The first item is the one
 * featured on the homepage.
 */
export async function listActivities(locale: Locale) {
  const items = await collections[`activities_${locale}`].all();
  return items
    .filter((i: any) => !i.entry.draft)
    .sort((a: any, b: any) =>
      String(b.entry.publishedAt ?? '').localeCompare(String(a.entry.publishedAt ?? '')),
    );
}

export function getActivity(locale: Locale, slug: string) {
  return collections[`activities_${locale}`].read(slug);
}

/**
 * Facilities, in the order the hotel wants them read rather than by date.
 *
 * Their slugs are the same in every language, so unlike rooms and activities
 * they need no translationKey lookup to switch language; see the note on
 * `facilitiesCollection` in keystatic.config.
 */
export async function listFacilities(locale: Locale) {
  const items = await collections[`facilities_${locale}`].all();
  return items.filter((i: any) => !i.entry.draft).sort(byOrder);
}

export function getFacility(locale: Locale, slug: string) {
  return collections[`facilities_${locale}`].read(slug);
}

/** A page from the shared `pages` collection, e.g. the privacy policy. */
export function getPage(locale: Locale, slug: string) {
  return collections[`pages_${locale}`].read(slug);
}

/** The sections whose entry slugs are translated, and so need looking up. */
const TRANSLATED_SECTIONS = ['rooms', 'activities'] as const;

/**
 * The same page in another language, as a path without the locale prefix.
 *
 * Section paths are identical in all three languages, so `/faq` and `/gallery`
 * pass straight through. Room and activity slugs need not be: they are generated
 * from the translated title, so a room renamed in Dutch stops being reachable
 * under the English slug. Those are matched on the `translationKey` that every
 * language of an entry shares.
 *
 * Falls back to the section index when there is no counterpart to switch to,
 * which is better than sending someone to a page that does not exist. An
 * activity still marked draft in the other language counts as missing, because
 * drafts get no page built.
 */
export async function translatePath(path: string, from: Locale, to: Locale): Promise<string> {
  if (from === to) return path;

  const match = /^\/([^/]+)\/([^/]+)\/?$/.exec(path);
  const section = match?.[1] as (typeof TRANSLATED_SECTIONS)[number] | undefined;
  if (!match || !section || !TRANSLATED_SECTIONS.includes(section)) return path;

  // Read through the same helpers the routes use, so this can only ever offer
  // a slug that actually had a page built for it.
  const entriesFor = (locale: Locale) =>
    section === 'rooms' ? collections[`rooms_${locale}`].all() : listActivities(locale);

  const key = (await entriesFor(from)).find((e: any) => e.slug === match[2])?.entry.translationKey;
  if (!key) return `/${section}`;

  const twin = (await entriesFor(to)).find((e: any) => e.entry.translationKey === key);
  return twin ? `/${section}/${twin.slug}` : `/${section}`;
}

/** A photo on the gallery page, wherever in the site it came from. */
export type GalleryPhoto = {
  src: string;
  alt: string;
  /** Which part of the site it belongs to; the label is translated in the view. */
  group: 'hotel' | 'rooms' | 'activities' | 'offers';
  /** Attribution, where the photo is not the hotel's own. */
  credit?: string;
  /**
   * For room photography, the room it belongs to, already translated. The
   * gallery filters by it, so it is the room's own title rather than its slug:
   * a filter chip has to be readable, and the slug is English everywhere.
   */
  room?: string;
};

/**
 * Every photo on the site, in one list, for the gallery page.
 *
 * Deduplicated by `src`: a room's main photo is also the first of its gallery
 * set, and a carousel slide can be reused elsewhere, so without this the page
 * would show the same picture several times.
 *
 * Credits travel with the photo. Some of the activity photography is used under
 * CC BY, which requires the attribution to appear wherever the image does, so
 * the gallery has to carry it as much as the article does.
 */
export async function listAllPhotos(locale: Locale): Promise<GalleryPhoto[]> {
  const photos: GalleryPhoto[] = [];
  const seen = new Set<string>();
  const add = (
    src: unknown,
    alt: string,
    group: GalleryPhoto['group'],
    credit?: string,
    room?: string,
  ) => {
    if (typeof src !== 'string' || !src) return;
    if (seen.has(src)) return;
    seen.add(src);
    photos.push({ src, alt, group, ...(credit ? { credit } : {}), ...(room ? { room } : {}) });
  };

  const siteName = (await getSettings())?.siteName || 'Hotel Atlantis';

  // The homepage carousel leads: it is the hotel at its best.
  const homepage = await getHomepage();
  for (const slide of homepage?.carousel ?? []) {
    const img = typeof slide.image === 'string' ? slide.image : '';
    const src = img.startsWith('/') || img.startsWith('http') ? img : `/images/carousel/${img}`;
    add(src, slide.alt || siteName, 'hotel');
  }

  // Standalone albums curated in Keystatic. Shared across languages, like the
  // room photography: one upload, one caption, every language.
  for (const album of await collections.gallery.all()) {
    for (const item of album.entry.images ?? []) {
      add(item.image, item.alt || album.entry.title || siteName, 'hotel');
    }
  }

  // Room photography is shared across languages; the caption is the local title.
  // Deduplication is by `src`, so a photograph shared by two rooms is filed
  // under whichever comes first in the room order rather than appearing twice.
  for (const room of await listRooms(locale)) {
    for (const photo of room.photos) add(photo.src, photo.alt, 'rooms', undefined, room.entry.title);
  }

  for (const item of await listActivities(locale)) {
    add(
      item.entry.image,
      item.entry.imageAlt || item.entry.title,
      'activities',
      item.entry.imageCredit || undefined,
    );
  }

  for (const item of await listOffers(locale)) {
    add(item.entry.image, item.entry.title, 'offers');
  }

  const collected = await dedupeByContent(photos);
  const order = await readGalleryOrder();
  // English only. The list is shared, so topping it up from every language would
  // label its rows in whichever language happened to be built first. A photograph
  // that somehow exists only in another language is not added, and simply stays
  // at the bottom of the gallery.
  //
  // Does not affect this build either way: anything appended here is unranked,
  // and unranked photos already sort to the bottom in collection order.
  if (locale === 'en') await topUpGalleryOrder(collected, order);
  return applyGalleryOrder(collected, order);
}

/* ---- Gallery order -----------------------------------------------------------
 * The gallery page collects photographs from all over the site, so there is
 * nowhere on a photograph itself to hang a position: a room's hero belongs to the
 * room, not to the gallery, and moving it in the gallery must not reorder the
 * room. The sequence therefore lives in its own list, keyed by image path.
 *
 * One list for all three languages. It is the same photographs in the same
 * sequence whatever the captions say, and asking someone to drag the same set
 * into the same order three times is how the three fall out of step.
 *
 * Anything missing from the list sorts to the bottom. That is the whole of the
 * "new photographs go to the end" behaviour: a photo added anywhere on the site
 * appears in the gallery immediately, at the end, with nobody editing a list.
 */
type GalleryOrderEntry = { src: string; label: string };

const GALLERY_ORDER_FILE = 'src/content/settings/gallery-order.yaml';

async function readGalleryOrder(): Promise<GalleryOrderEntry[]> {
  const doc = await (reader.singletons as any).galleryOrder?.read();
  return ((doc?.photos ?? []) as any[])
    .filter((p) => typeof p?.src === 'string' && p.src)
    .map((p) => ({ src: p.src as string, label: String(p.label ?? '') }));
}

function applyGalleryOrder(photos: GalleryPhoto[], order: GalleryOrderEntry[]): GalleryPhoto[] {
  if (!order.length) return photos;

  const rank = new Map<string, number>();
  order.forEach((entry, i) => {
    if (!rank.has(entry.src)) rank.set(entry.src, i);
  });

  // `MAX_SAFE_INTEGER` and not `Infinity`: two unlisted photos would subtract to
  // NaN, and a comparator that returns NaN leaves the order undefined.
  const at = (p: GalleryPhoto) => rank.get(p.src) ?? Number.MAX_SAFE_INTEGER;

  // The index tiebreak keeps unlisted photos in the order they were collected
  // rather than trusting the engine's sort to be stable.
  return photos
    .map((photo, i) => ({ photo, i }))
    .sort((a, b) => at(a.photo) - at(b.photo) || a.i - b.i)
    .map((x) => x.photo);
}

/**
 * Add photographs the list has never seen to the end of it, so they can be
 * dragged in Keystatic rather than only ever sitting at the bottom.
 *
 * Append-only: it never reorders and never removes, so it cannot undo a hand-set
 * sequence, and an entry left behind by a deleted photo is inert (it matches
 * nothing). Skipped on CI, where the checkout is disposable and a build has no
 * business writing to tracked content.
 *
 * Runs once per language per build. Writing the merged list rather than the new
 * tail makes that idempotent even if a later call read the file before an earlier
 * one had written it.
 */
async function topUpGalleryOrder(photos: GalleryPhoto[], order: GalleryOrderEntry[]) {
  if (process.env.CI || process.env.CF_PAGES) return;

  const known = new Set(order.map((e) => e.src));
  const fresh = photos.filter((p) => !known.has(p.src));
  if (!fresh.length) return;

  const merged: GalleryOrderEntry[] = [];
  const seen = new Set<string>();
  for (const entry of [...order, ...fresh.map((p) => ({ src: p.src, label: p.alt }))]) {
    if (seen.has(entry.src)) continue;
    seen.add(entry.src);
    merged.push(entry);
  }

  // JSON.stringify emits a valid YAML double-quoted scalar, which saves taking a
  // YAML dependency for two fields. Keystatic reads this back as its own.
  const body = merged
    .map((e) => `  - src: ${JSON.stringify(e.src)}\n    label: ${JSON.stringify(e.label)}\n`)
    .join('');

  try {
    const fs = await import('node:fs/promises');
    await fs.writeFile(
      `${process.cwd()}/${GALLERY_ORDER_FILE}`,
      merged.length ? `photos:\n${body}` : 'photos: []\n',
      'utf8',
    );
  } catch {
    // Read-only filesystem, or no filesystem at all. The gallery still renders;
    // the new photographs simply stay at the bottom until this can run.
  }
}

/**
 * Collapse photos that are the same picture committed under different paths.
 *
 * Deduplicating on `src` misses these entirely: one JPEG is committed as a room
 * hero, again as an activity cover and again inside a Keystatic album, so the
 * gallery shows the same picture three times over. Compare the bytes instead.
 *
 * Runs during prerender, where the files are on disk. Anything that cannot be
 * read (a remote URL, or a file generated later) keeps its path as the key, so
 * a photo is never dropped just because it could not be hashed.
 */
async function dedupeByContent(photos: GalleryPhoto[]): Promise<GalleryPhoto[]> {
  let fs: typeof import('node:fs/promises');
  let crypto: typeof import('node:crypto');
  try {
    [fs, crypto] = await Promise.all([import('node:fs/promises'), import('node:crypto')]);
  } catch {
    return photos; // No filesystem: leave the list as it is.
  }

  const out: GalleryPhoto[] = [];
  const seen = new Set<string>();
  for (const photo of photos) {
    let key = photo.src;
    if (photo.src.startsWith('/')) {
      try {
        const bytes = await fs.readFile(`${process.cwd()}/public${photo.src}`);
        key = crypto.createHash('md5').update(bytes).digest('hex');
      } catch {
        // Falls back to the path, above.
      }
    }
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(photo);
  }
  return out;
}

/** One line of the direct-booking argument shown on the hero. */
export type DirectBookingBenefit = { text: string };

/**
 * The "book direct" copy for one language.
 *
 * Falls back to the translations in i18n when the singleton is missing or has
 * been emptied, so a bad edit in Keystatic degrades to the shipped copy rather
 * than to an empty box on the hero.
 *
 * One of these per language rather than one shared list, because the copy makes
 * price claims and those have to be right in each language.
 */
export async function getDirectBooking(
  locale: Locale,
): Promise<{ title: string; items: DirectBookingBenefit[] }> {
  const fallback = t(locale).directBook;
  const entry = await (reader.singletons as any)[`directBooking_${locale}`]?.read();

  const items = (entry?.items ?? [])
    .map((i: any) => ({ text: String(i?.text ?? '').trim() }))
    .filter((i: DirectBookingBenefit) => i.text);

  return {
    title: entry?.title?.trim() || fallback.title,
    items: items.length ? items : fallback.items.map((text) => ({ text })),
  };
}

/** One guest review in the rotating panel on the hero. */
export type Review = { text: string; score: number; author: string };

/** How many of the list the hero panel will actually show. */
export const MAX_HERO_REVIEWS = 10;

/**
 * The guest reviews shown on the hero, in the order they are listed.
 *
 * One list for all three languages, with a translation per review rather than a
 * list per language, so the score and the running order cannot drift apart
 * between them. Each review carries `nl` and `de` alongside the English `text`;
 * a language left blank falls back to the English, so a review added today is
 * live in all three immediately and improves when its translations land.
 *
 * Rows are judged on the English, not on the translation: a row with no English
 * text or no score is half-finished and is dropped rather than rendered as a
 * blank slide. Dropping it before the cap rather than after keeps the same ten
 * reviews on every language.
 */
export async function getReviews(locale: Locale): Promise<Review[]> {
  const entry = await (reader.singletons as any).reviews?.read();

  return (entry?.reviews ?? [])
    .map((r: any) => ({
      // There is no `en` field: English is the `text` above, which is also what
      // every untranslated language falls back to.
      translated: locale === 'en' ? '' : String(r?.[locale] ?? '').trim(),
      original: String(r?.text ?? '').trim(),
      score: Number(r?.score),
      author: String(r?.author ?? '').trim(),
    }))
    .filter((r: any) => r.original && Number.isFinite(r.score))
    .slice(0, MAX_HERO_REVIEWS)
    .map(
      (r: any): Review => ({
        text: r.translated || r.original,
        score: r.score,
        author: r.author,
      }),
    );
}

export async function getSettings() {
  return reader.singletons.settings.read();
}

export async function getHomepage() {
  return reader.singletons.homepage.read();
}

/**
 * Render a Keystatic Markdoc content field to an HTML string.
 * `content` is the async function the reader returns for a markdoc field.
 */
export async function renderMarkdoc(
  content: () => Promise<{ node: Markdoc.Node }>,
): Promise<string> {
  const { node } = await content();
  const renderable = Markdoc.transform(node);
  return Markdoc.renderers.html(renderable);
}
