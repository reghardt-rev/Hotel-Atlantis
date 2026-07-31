import { config, fields, collection, singleton } from '@keystatic/core';

/**
 * Keystatic content configuration for Hotel Paradis.
 *
 * Storage:
 *   - Local dev  -> `local` (edit content on your machine, no GitHub App needed).
 *   - Production -> `github` (staff log in at /keystatic with GitHub; edits are
 *                   committed to reghardt-rev/Paradis-ZAN automatically).
 *   When you transfer the repo to an org later, update `repo` below and, if the
 *   domain changes, the callback URL on the GitHub App.
 *
 * i18n: each content type is a pair of collections, one per locale
 *   (e.g. rooms_en / rooms_nl), grouped in the admin sidebar by language.
 */

const LOCALES = ['en', 'nl', 'de'] as const;
type Locale = (typeof LOCALES)[number];
const LOCALE_LABEL: Record<Locale, string> = { en: 'English', nl: 'Nederlands', de: 'Deutsch' };

const DEFAULT_MEWS_CONFIG_ID = '4808678c-b67e-44bf-ad85-ae2800f64c7f';

const image = (label: string, subfolder: string) =>
  fields.image({
    label,
    directory: `public/images/${subfolder}`,
    publicPath: `/images/${subfolder}/`,
    validation: { isRequired: false },
  });

/**
 * Room photography is shared, not localised: a photo is uploaded once here and
 * every language of that room shows it. Each localised room entry points at one
 * of these sets through its `photos` field.
 */
const roomPhotosCollection = collection({
  label: 'Room photos (shared)',
  path: 'src/content/room-photos/*',
  slugField: 'name',
  columns: ['name'],
  schema: {
    name: fields.slug({
      name: {
        label: 'Room',
        description: 'Internal name — not shown on the site. Links these photos to a room in every language.',
      },
    }),
    heroImage: image('Main photo', 'rooms'),
    images: fields.array(
      fields.object({
        image: image('Photo', 'rooms'),
        alt: fields.text({ label: 'Alt text (describe the photo)', validation: { isRequired: false } }),
      }),
      {
        label: 'More photos',
        description: 'Shown as a gallery on the room page, after the main photo.',
        itemLabel: (props) => props.fields.alt.value || 'Photo',
      },
    ),
  },
});

function roomsCollection(locale: Locale) {
  return collection({
    label: `Rooms · ${LOCALE_LABEL[locale]}`,
    path: `src/content/rooms/${locale}/*`,
    slugField: 'title',
    format: { contentField: 'content' },
    columns: ['title', 'priceFrom'],
    entryLayout: 'content',
    schema: {
      title: fields.slug({ name: { label: 'Room name' } }),
      photos: fields.relationship({
        label: 'Photos',
        description: 'Shared photo set — upload once, and every language of this room uses it.',
        collection: 'roomPhotos',
        validation: { isRequired: false },
      }),
      shortDescription: fields.text({ label: 'Short description', multiline: true }),
      maxOccupancy: fields.integer({ label: 'Max occupancy', defaultValue: 2 }),
      sizeSqm: fields.integer({ label: 'Size (m²)', validation: { isRequired: false } }),
      bedType: fields.text({ label: 'Bed', validation: { isRequired: false } }),
      amenities: fields.array(fields.text({ label: 'Amenity' }), {
        label: 'Amenities',
        itemLabel: (props) => props.value,
      }),
      priceFrom: fields.integer({ label: 'Price from (€ / night)', validation: { isRequired: false } }),
      order: fields.integer({ label: 'Sort order', defaultValue: 0 }),
      content: fields.markdoc({ label: 'Full description' }),
    },
  });
}

function offersCollection(locale: Locale) {
  return collection({
    label: `Offers · ${LOCALE_LABEL[locale]}`,
    path: `src/content/offers/${locale}/*`,
    slugField: 'title',
    format: { contentField: 'content' },
    columns: ['title'],
    entryLayout: 'content',
    schema: {
      title: fields.slug({ name: { label: 'Offer title' } }),
      image: image('Image', 'offers'),
      summary: fields.text({ label: 'Summary', multiline: true }),
      validFrom: fields.date({ label: 'Valid from', validation: { isRequired: false } }),
      validTo: fields.date({ label: 'Valid to', validation: { isRequired: false } }),
      priceFrom: fields.integer({ label: 'From (€)', validation: { isRequired: false } }),
      order: fields.integer({ label: 'Sort order', defaultValue: 0 }),
      content: fields.markdoc({ label: 'Details' }),
    },
  });
}

/**
 * Activities are dated articles. The newest published one is featured on the
 * homepage; the rest live on /activities.
 */
function activitiesCollection(locale: Locale) {
  return collection({
    label: `Activities · ${LOCALE_LABEL[locale]}`,
    path: `src/content/activities/${locale}/*`,
    slugField: 'title',
    format: { contentField: 'content' },
    columns: ['title', 'publishedAt'],
    entryLayout: 'content',
    schema: {
      title: fields.slug({ name: { label: 'Activity title' } }),
      publishedAt: fields.date({
        label: 'Published',
        description: 'The most recent activity is the one featured on the homepage.',
      }),
      image: image('Image', 'activities'),
      summary: fields.text({ label: 'Summary', multiline: true }),
      draft: fields.checkbox({ label: 'Draft (hide from the site)', defaultValue: false }),
      content: fields.markdoc({ label: 'Article' }),
    },
  });
}

function newsCollection(locale: Locale) {
  return collection({
    label: `News · ${LOCALE_LABEL[locale]}`,
    path: `src/content/news/${locale}/*`,
    slugField: 'title',
    format: { contentField: 'content' },
    columns: ['title', 'publishedAt'],
    entryLayout: 'content',
    schema: {
      title: fields.slug({ name: { label: 'Headline' } }),
      publishedAt: fields.date({ label: 'Published' }),
      coverImage: image('Cover image', 'news'),
      excerpt: fields.text({ label: 'Excerpt', multiline: true }),
      draft: fields.checkbox({ label: 'Draft (hide from the site)', defaultValue: false }),
      content: fields.markdoc({ label: 'Article' }),
    },
  });
}

function pagesCollection(locale: Locale) {
  return collection({
    label: `Pages · ${LOCALE_LABEL[locale]}`,
    path: `src/content/pages/${locale}/*`,
    slugField: 'title',
    format: { contentField: 'content' },
    columns: ['title'],
    entryLayout: 'content',
    schema: {
      title: fields.slug({ name: { label: 'Page title' } }),
      seoDescription: fields.text({ label: 'SEO description', multiline: true }),
      content: fields.markdoc({ label: 'Body' }),
    },
  });
}

function galleryCollection(locale: Locale) {
  return collection({
    label: `Gallery · ${LOCALE_LABEL[locale]}`,
    path: `src/content/gallery/${locale}/*`,
    slugField: 'title',
    columns: ['title'],
    schema: {
      title: fields.slug({ name: { label: 'Album title' } }),
      images: fields.array(
        fields.object({
          image: image('Image', 'gallery'),
          alt: fields.text({ label: 'Alt text' }),
        }),
        { label: 'Images', itemLabel: (props) => props.fields.alt.value || 'Image' },
      ),
    },
  });
}

export default config({
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : { kind: 'github', repo: 'reghardt-rev/Paradis-ZAN' },

  ui: {
    brand: { name: 'Hotel Paradis' },
    navigation: {
      Settings: ['settings', 'homepage'],
      Shared: ['roomPhotos'],
      English: ['rooms_en', 'offers_en', 'activities_en', 'news_en', 'pages_en', 'gallery_en'],
      Nederlands: ['rooms_nl', 'offers_nl', 'activities_nl', 'news_nl', 'pages_nl', 'gallery_nl'],
      Deutsch: ['rooms_de', 'offers_de', 'activities_de', 'news_de', 'pages_de', 'gallery_de'],
    },
  },

  singletons: {
    settings: singleton({
      label: 'Site settings',
      path: 'src/content/settings/site',
      schema: {
        siteName: fields.text({ label: 'Site name', defaultValue: 'Hotel Paradis' }),
        tagline: fields.text({ label: 'Tagline', multiline: true }),
        mewsConfigId: fields.text({
          label: 'Mews Distributor configuration ID',
          description: 'Used by the Book Now button (Mews Booking Engine).',
          defaultValue: DEFAULT_MEWS_CONFIG_ID,
        }),
        gtmContainerId: fields.text({
          label: 'Google Tag Manager container ID',
          description: 'e.g. GTM-XXXXXXX. Leave blank to disable GTM.',
        }),
        ga4MeasurementId: fields.text({
          label: 'Google Analytics 4 measurement ID',
          description:
            'e.g. G-XXXXXXXXXX. Loads the Google tag directly. Leave blank if GA4 is configured inside GTM instead — using both for the same property double-counts.',
        }),
        email: fields.text({ label: 'Contact email' }),
        phone: fields.text({ label: 'Phone' }),
        address: fields.text({ label: 'Address', multiline: true }),
        social: fields.object(
          {
            instagram: fields.url({ label: 'Instagram URL', validation: { isRequired: false } }),
            facebook: fields.url({ label: 'Facebook URL', validation: { isRequired: false } }),
          },
          { label: 'Social links' },
        ),
      },
    }),

    homepage: singleton({
      label: 'Homepage',
      path: 'src/content/settings/homepage',
      schema: {
        carousel: fields.array(
          fields.object({
            image: fields.image({
              label: 'Slide image',
              directory: 'public/images/carousel',
              publicPath: '/images/carousel/',
              validation: { isRequired: true },
            }),
            alt: fields.text({ label: 'Alt text (describe the photo)' }),
          }),
          {
            label: 'Front-page carousel',
            itemLabel: (props) => props.fields.alt.value || 'Slide',
          },
        ),
      },
    }),
  },

  collections: {
    roomPhotos: roomPhotosCollection,
    rooms_en: roomsCollection('en'),
    rooms_nl: roomsCollection('nl'),
    rooms_de: roomsCollection('de'),
    offers_en: offersCollection('en'),
    offers_nl: offersCollection('nl'),
    offers_de: offersCollection('de'),
    activities_en: activitiesCollection('en'),
    activities_nl: activitiesCollection('nl'),
    activities_de: activitiesCollection('de'),
    news_en: newsCollection('en'),
    news_nl: newsCollection('nl'),
    news_de: newsCollection('de'),
    pages_en: pagesCollection('en'),
    pages_nl: pagesCollection('nl'),
    pages_de: pagesCollection('de'),
    gallery_en: galleryCollection('en'),
    gallery_nl: galleryCollection('nl'),
    gallery_de: galleryCollection('de'),
  },
});
