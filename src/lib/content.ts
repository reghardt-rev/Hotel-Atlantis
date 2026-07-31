import { createReader } from '@keystatic/core/reader';
import Markdoc from '@markdoc/markdoc';
import keystaticConfig from '../../keystatic.config';
import type { Locale } from './i18n';

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

/** A page from the shared `pages` collection, e.g. the privacy policy. */
export function getPage(locale: Locale, slug: string) {
  return collections[`pages_${locale}`].read(slug);
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
