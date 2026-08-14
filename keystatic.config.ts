import { config, fields, collection, singleton } from '@keystatic/core';

/**
 * Keystatic content configuration for Hotel Atlantis.
 *
 * Storage:
 *   - Local dev  -> `local` (edit content on your machine, no GitHub App needed).
 *   - Production -> `github` (staff log in at /keystatic with GitHub; edits are
 *                   committed to reghardt-rev/Hotel-Atlantis automatically).
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
 * Per-slide framing for the hero carousel. The hero fills the screen whatever
 * shape the screen is, so every photograph is cropped to fit and the crop is
 * what gets edited here, not the photograph.
 *
 * The keys are deliberately vague about pixels: the component turns them into
 * `object-position`, and a slide set from here should not need revisiting when
 * that changes. See the note on `FOCAL` in Carousel.astro.
 */
const focalField = () =>
  fields.select({
    label: 'Keep in frame',
    description:
      'The hero fills the whole screen, so a wide window trims the top and bottom of the photo and a phone trims the sides instead. Leave on the middle unless the crop is cutting off the thing the photo is about, then pick the edge that thing sits against.',
    options: [
      { label: 'Middle of the photo', value: 'center' },
      { label: 'Top — keep the sky, the roofline, the tops of the trees', value: 'top' },
      { label: 'Lower middle — favour the bottom without giving up the top', value: 'lower' },
      { label: 'Bottom — keep the floor, the furniture, the foreground', value: 'bottom' },
    ],
    defaultValue: 'center',
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

/**
 * Ties the three language versions of one entry together.
 *
 * Slugs come from the title, so they can diverge in translation: rename a room
 * in Dutch and it stops being reachable under the English slug. The language
 * switcher needs to know those are one room, and nothing else in the entry says
 * so. Give every translation of an entry the same key here.
 */
function translationKeyField(what: string) {
  return fields.text({
    label: 'Translation key',
    description: `Same value on every language of this ${what}, so the language switcher can find them. Lowercase, no spaces, e.g. "double-room".`,
    validation: { isRequired: false },
  });
}

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
      translationKey: translationKeyField('room'),
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
      imageAlt: fields.text({
        label: 'Photo description',
        description: 'What the photo shows, for screen readers. Falls back to the offer title.',
        validation: { isRequired: false },
      }),
      summary: fields.text({ label: 'Summary', multiline: true }),
      /* What the offer actually includes, one short line each. Shown as a list
         on the offer tile; where an offer has none, the summary is shown
         instead, so an offer written before the list exists still reads. */
      highlights: fields.array(fields.text({ label: 'Item' }), {
        label: "What's included",
        description: 'Short lines, e.g. "10% off the room rate".',
        itemLabel: (props) => props.value || 'Item',
      }),
      validFrom: fields.date({ label: 'Valid from', validation: { isRequired: false } }),
      validTo: fields.date({ label: 'Valid to', validation: { isRequired: false } }),
      priceFrom: fields.integer({ label: 'From (€)', validation: { isRequired: false } }),
      order: fields.integer({ label: 'Sort order', defaultValue: 0 }),
      content: fields.markdoc({ label: 'Details' }),
    },
  });
}

/**
 * The things the hotel offers rather than the things to go and do: breakfast,
 * reception, bikes. Built like activities, with two differences.
 *
 * There is no `publishedAt`, because a facility is not news and its position on
 * the page should be a decision rather than a side effect of when it was
 * written, so they sort on `order` like the rooms and offers do.
 *
 * The slug is deliberately left the same in all three languages while the title
 * is translated. Facility slugs are therefore identical across locales, which is
 * what lets the language switcher carry /facilities/breakfast straight over to
 * /nl/facilities/breakfast without a translationKey lookup. Renaming one in
 * Keystatic will break that link for that language, so rename all three.
 */
function facilitiesCollection(locale: Locale) {
  return collection({
    label: `Facilities \u00b7 ${LOCALE_LABEL[locale]}`,
    path: `src/content/facilities/${locale}/*`,
    slugField: 'title',
    format: { contentField: 'content' },
    columns: ['title'],
    entryLayout: 'content',
    schema: {
      title: fields.slug({ name: { label: 'Facility title' } }),
      image: image('Image', 'facilities'),
      imageAlt: fields.text({
        label: 'Photo description',
        description: 'What the photo actually shows, for screen readers.',
        validation: { isRequired: false },
      }),
      summary: fields.text({ label: 'Summary', multiline: true }),
      /* Two or three at most. They are set in the collage tile under the title,
         so a long list stops being scannable and starts being a paragraph. */
      highlights: fields.array(fields.text({ label: 'Highlight' }), {
        label: 'Key facts',
        description: 'Short lines shown on the collage tile, e.g. "Breakfast 07:00 - 10:30".',
        itemLabel: (props) => props.value || 'Fact',
      }),
      order: fields.integer({ label: 'Sort order', defaultValue: 0 }),
      draft: fields.checkbox({ label: 'Draft (hide from the site)', defaultValue: false }),
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
      translationKey: translationKeyField('activity'),
      publishedAt: fields.date({
        label: 'Published',
        description: 'The most recent activity is the one featured on the homepage.',
      }),
      image: image('Image', 'activities'),
      imageAlt: fields.text({
        label: 'Photo description',
        description:
          'What the photo actually shows, for screen readers. Falls back to the title, which is only right while the photo is of the thing the article is named after.',
        validation: { isRequired: false },
      }),
      imageCredit: fields.text({
        label: 'Photo credit',
        description:
          'Shown under the photo. Required for anything not shot by the hotel, e.g. "G. Lanting, CC BY 4.0".',
        validation: { isRequired: false },
      }),
      summary: fields.text({ label: 'Summary', multiline: true }),
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
      sideImages: fields.array(
        fields.object({
          image: image('Photo', 'sustainability'),
          alt: fields.text({ label: 'Alt text (describe the photo)' }),
        }),
        {
          label: 'Side photos',
          description:
            'Optional. Spread down the page beside the text, alternating left and right. Fewer photos than sections is fine: they space themselves out.',
          itemLabel: (props) => props.fields.alt.value || 'Photo',
        },
      ),
      content: fields.markdoc({ label: 'Body' }),
    },
  });
}

/**
 * Gallery albums: photographs for the gallery page that are not already
 * somewhere else on the site. Everything attached to a room, an activity, an
 * offer or the carousel is collected automatically, so this is only for pictures
 * that belong nowhere in particular.
 *
 * Shared, not localised, for the same reason as `roomPhotosCollection`: a
 * photograph is the same photograph in every language, and three copies of one
 * album is three chances to upload the same JPEG three times. The order the
 * pictures appear in is shared too, in the `galleryOrder` singleton.
 *
 * The cost is the caption, which is the one part of a photograph that is
 * language-specific: a Dutch visitor reads the alt text written here. Room
 * photography already makes that trade, and falls back to the localised title of
 * the thing it belongs to when the alt is blank, which this does as well.
 */
const galleryCollection = collection({
  label: 'Gallery albums (shared)',
  path: 'src/content/gallery/*',
  slugField: 'title',
  columns: ['title'],
  schema: {
    title: fields.slug({
      name: {
        label: 'Album title',
        description:
          'Not shown on the site. Used as the caption for any photo in the album left without alt text.',
      },
    }),
    images: fields.array(
      fields.object({
        image: image('Image', 'gallery'),
        alt: fields.text({ label: 'Alt text (describe the photo)' }),
      }),
      { label: 'Images', itemLabel: (props) => props.fields.alt.value || 'Image' },
    ),
  },
});

/**
 * What the guest gets by booking on this site instead of through an OTA.
 *
 * Shown in the badge under the hero rating. One of these per language rather
 * than one shared list, because the copy makes price claims and those have to be
 * right in each language, not machine-guessed.
 */
function directBookingSingleton(locale: Locale) {
  return singleton({
    label: `Book direct \u00b7 ${LOCALE_LABEL[locale]}`,
    path: `src/content/direct-booking/${locale}`,
    format: { data: 'yaml' },
    schema: {
      title: fields.text({ label: 'Heading' }),
      items: fields.array(fields.object({ text: fields.text({ label: 'Benefit' }) }), {
        label: 'Benefits',
        itemLabel: (props) => props.fields.text.value || 'Benefit',
      }),
    },
  });
}

/**
 * Dev edits the files on disk; everything else commits through GitHub.
 *
 * The one exception is creating the GitHub App. Keystatic's setup wizard writes
 * the generated credentials to a local `.env`, so it refuses to run outside
 * development ("App setup only allowed in development") and cannot be completed
 * on the deployed site at all. To run it: put PUBLIC_KEYSTATIC_GITHUB_SETUP=1 in
 * .env, restart the dev server, and open /keystatic. Give the wizard the
 * deployed URL so the App is registered against production as well as localhost.
 * Take the flag back out afterwards, or dev will be committing to the live repo.
 */
// PUBLIC_ prefixed because this file is imported by the admin UI in the browser,
// and Astro only inlines PUBLIC_ vars there. Without the prefix the server picks
// up the flag and the browser silently does not, so the UI stays in local mode.
const editFilesLocally = import.meta.env.DEV && !import.meta.env.PUBLIC_KEYSTATIC_GITHUB_SETUP;

export default config({
  storage: editFilesLocally
    ? { kind: 'local' }
    : { kind: 'github', repo: 'reghardt-rev/Hotel-Atlantis' },

  ui: {
    brand: { name: 'Hotel Atlantis' },
    navigation: {
      Settings: ['settings', 'homepage'],
      Shared: ['roomPhotos', 'gallery', 'galleryOrder'],
      English: ['rooms_en', 'offers_en', 'facilities_en', 'activities_en', 'pages_en', 'directBooking_en'],
      Nederlands: ['rooms_nl', 'offers_nl', 'facilities_nl', 'activities_nl', 'pages_nl', 'directBooking_nl'],
      Deutsch: ['rooms_de', 'offers_de', 'facilities_de', 'activities_de', 'pages_de', 'directBooking_de'],
    },
  },

  singletons: {
    /**
     * The order of the gallery page, top to bottom.
     *
     * The page gathers photographs from the whole site, so this list is filled in
     * for you: every photograph on the site turns up here on its own, at the end,
     * and the job here is only to drag them into the order you want. Deleting a
     * row does not remove the photograph from the gallery, it only gives up
     * saying where it goes, which puts it back at the bottom.
     *
     * Shared by all three languages, since it is the same photographs in the
     * same sequence whatever language the captions are in.
     */
    galleryOrder: singleton({
      label: 'Gallery order',
      path: 'src/content/settings/gallery-order',
      schema: {
        photos: fields.array(
          fields.object({
            src: fields.text({
              label: 'Image',
              description: 'Filled in automatically. Changing it by hand will unpin the photo.',
            }),
            label: fields.text({ label: 'What it shows' }),
          }),
          {
            label: 'Photos, first to last',
            description:
              'Drag to set the order photographs appear in on the gallery page. Every photo on the site is added here automatically the first time it is seen, at the bottom, so a new photograph goes to the end until you move it.',
            itemLabel: (props) => props.fields.label.value || props.fields.src.value || 'Photo',
          },
        ),
      },
    }),
    directBooking_en: directBookingSingleton('en'),
    directBooking_nl: directBookingSingleton('nl'),
    directBooking_de: directBookingSingleton('de'),
    settings: singleton({
      label: 'Site settings',
      path: 'src/content/settings/site',
      schema: {
        siteName: fields.text({ label: 'Site name', defaultValue: 'Hotel Atlantis' }),
        tagline: fields.text({
          label: 'Tagline',
          description:
            'Shown on the hero, above the booking bar, and used as the homepage description for search engines. Clear this and it is gone from everywhere.',
          multiline: true,
          validation: { isRequired: false },
        }),
        showTagline: fields.checkbox({
          label: 'Show the tagline on the hero',
          description:
            'Turn this off to leave the hero to the photograph and the hotel name. The text above is still used for the search-engine description and in the footer.',
          defaultValue: true,
        }),
        reviewScore: fields.number({
          label: 'Guest review score',
          description:
            'Out of 10, as shown on Booking.com (e.g. 7.4). Shown over the hero with a matching star rating. Leave blank to hide the box entirely.',
          validation: { isRequired: false },
        }),
        reviewCount: fields.integer({
          label: 'Number of reviews',
          description: 'The review count that goes with the score above.',
          validation: { isRequired: false },
        }),
        reviewSource: fields.text({
          label: 'Review source',
          description: 'Credited under the score, e.g. Booking.com.',
          validation: { isRequired: false },
        }),
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
            tiktok: fields.url({ label: 'TikTok URL', validation: { isRequired: false } }),
            youtube: fields.url({ label: 'YouTube URL', validation: { isRequired: false } }),
            linkedin: fields.url({ label: 'LinkedIn URL', validation: { isRequired: false } }),
            x: fields.url({ label: 'X (Twitter) URL', validation: { isRequired: false } }),
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
            focal: focalField(),
          }),
          {
            label: 'Front-page carousel',
            description: 'Variant A. What everyone sees while no B slides are set.',
            itemLabel: (props) => props.fields.alt.value || 'Slide',
          },
        ),
        carouselB: fields.array(
          fields.object({
            image: fields.image({
              label: 'Slide image',
              directory: 'public/images/carousel-b',
              publicPath: '/images/carousel-b/',
              validation: { isRequired: true },
            }),
            alt: fields.text({ label: 'Alt text (describe the photo)' }),
            focal: focalField(),
          }),
          {
            label: 'Front-page carousel \u2014 variant B (A/B test)',
            description:
              'Add slides here to start a split test of the hero: half of visitors see these instead. Each visitor keeps the same variant on later visits, and the choice is reported to GA4 as hero_variant. Empty this list to end the test and put everyone back on A.',
            itemLabel: (props) => props.fields.alt.value || 'Slide',
          },
        ),
        heroVariant: fields.select({
          label: 'Which hero to show',
          description:
            'Leave on the split test to let half of visitors see each. Choose A or B to force one on everybody, which ends the test: no variant is assigned, no cookie is set and nothing is reported to GA4 as hero_variant. Choosing B with no B slides falls back to A.',
          options: [
            { label: 'Split test \u2014 half see A, half see B', value: 'test' },
            { label: 'Always show variant A', value: 'a' },
            { label: 'Always show variant B', value: 'b' },
          ],
          defaultValue: 'test',
        }),
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
    facilities_en: facilitiesCollection('en'),
    facilities_nl: facilitiesCollection('nl'),
    facilities_de: facilitiesCollection('de'),
    pages_en: pagesCollection('en'),
    pages_nl: pagesCollection('nl'),
    pages_de: pagesCollection('de'),
    gallery: galleryCollection,
  },
});
