/**
 * Turn a supplied wordmark into the four files the site actually uses.
 *
 *   node scripts/build-logo.mjs <source.png>
 *
 * Brand exports arrive as flat artwork on an opaque white card: no alpha, often
 * a border ring, and always a wide margin. The site needs the opposite of all
 * three, in two colours and two lockups, so rather than hand-editing each time
 * this measures the file and derives them.
 *
 * Alpha comes from luminance rather than from the file, because there is none to
 * read. Luminance is mapped from the card's white down to the ink's own darkest
 * value, so the background falls to fully transparent, the ink stays fully
 * opaque, and the antialiasing in between is preserved as partial alpha. That
 * only holds for flat single-colour artwork on a light ground, which is what
 * these exports are; a mark with a light accent colour would come out part
 * transparent and would need its alpha supplied properly instead.
 *
 * The compact lockup drops the last band of the stack. See Logo.astro for why.
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SRC = process.argv[2];
if (!SRC) {
  console.error('usage: node scripts/build-logo.mjs <source.png>');
  process.exit(1);
}

const OUT_DIR = path.join(
  path.dirname(path.dirname(fileURLToPath(import.meta.url))),
  'public/images/brand',
);
/** Tallest the mark is ever drawn is 96px; twice that covers a 2x display. */
const FULL_HEIGHT = 240;
/** Anything at or above this is the card, not the mark. */
const BG_CUTOFF = 240;

const luminance = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/** Tight bounds of everything that is not the white card. */
function inkBounds(data, width, height, channels) {
  let x0 = width, y0 = height, x1 = -1, y1 = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      if (luminance(data[i], data[i + 1], data[i + 2]) < BG_CUTOFF) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) throw new Error('no artwork found: the whole image reads as background');
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

/** Horizontal bands of ink, separated by clear rows — the lines of the lockup. */
function bands(alpha, width, height) {
  const out = [];
  let start = null;
  for (let y = 0; y <= height; y++) {
    let inked = false;
    if (y < height) {
      for (let x = 0; x < width; x++) {
        if (alpha[y * width + x] > 8) { inked = true; break; }
      }
    }
    if (inked && start === null) start = y;
    else if (!inked && start !== null) { out.push([start, y - 1]); start = null; }
  }
  return out;
}

/**
 * Ink colour to reproduce: the most common colour in the solid body of the mark.
 *
 * Not the darkest pixel. Resampling rings slightly at hard edges, so a handful
 * of pixels overshoot past the true ink — on this artwork the darkest single
 * pixel is pure black, which would have the site draw a navy wordmark in black.
 * The mode is what the artwork is actually filled with.
 */
function inkColour(data, width, height, channels) {
  const hist = new Map();
  for (let p = 0; p < width * height; p++) {
    const i = p * channels;
    if (luminance(data[i], data[i + 1], data[i + 2]) >= 128) continue; // antialiasing, not fill
    const key = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
    hist.set(key, (hist.get(key) || 0) + 1);
  }
  if (hist.size === 0) throw new Error('no solid ink found in the artwork');
  const [key] = [...hist.entries()].sort((a, b) => b[1] - a[1])[0];
  const rgb = { r: (key >> 16) & 255, g: (key >> 8) & 255, b: key & 255 };
  return { rgb, luminance: luminance(rgb.r, rgb.g, rgb.b) };
}

/** Alpha from luminance, mapped white -> 0 and ink -> 255. */
function alphaFromLuminance(data, width, height, channels, bgLum, inkLum) {
  const span = Math.max(1, bgLum - inkLum);
  const alpha = Buffer.alloc(width * height);
  for (let p = 0; p < width * height; p++) {
    const i = p * channels;
    const l = luminance(data[i], data[i + 1], data[i + 2]);
    alpha[p] = Math.round(Math.min(1, Math.max(0, (bgLum - l) / span)) * 255);
  }
  return alpha;
}

const write = (alpha, width, height, background, file) =>
  sharp({ create: { width, height, channels: 3, background } })
    .joinChannel(alpha, { raw: { width, height, channels: 1 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, file));

const meta = await sharp(SRC).metadata();
const flat = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
console.log(`source ${meta.width}x${meta.height}`);

// Trim the card away, then scale so the mark itself is FULL_HEIGHT tall.
const box = inkBounds(flat.data, flat.info.width, flat.info.height, flat.info.channels);
console.log(`artwork ${box.width}x${box.height} at ${box.left},${box.top}`);

const fullWidth = Math.round((FULL_HEIGHT * box.width) / box.height);
const scaled = await sharp(SRC)
  .extract(box)
  .resize(fullWidth, FULL_HEIGHT, { fit: 'fill', kernel: 'lanczos3' })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: W, height: H, channels: C } = scaled.info;
const ink = inkColour(scaled.data, W, H, C);
// The card, sampled at a corner the trim just proved is empty.
const bgLum = luminance(flat.data[0], flat.data[1], flat.data[2]);
console.log(
  `ink rgb(${ink.rgb.r},${ink.rgb.g},${ink.rgb.b})  card luminance ${bgLum.toFixed(1)}`,
);

const alpha = alphaFromLuminance(scaled.data, W, H, C, bgLum, ink.luminance);

await write(alpha, W, H, ink.rgb, 'logo.png');
await write(alpha, W, H, { r: 255, g: 255, b: 255 }, 'logo-light.png');
console.log(`full    ${W}x${H}  ratio ${(W / H).toFixed(3)}`);

// Compact: every band but the last, re-trimmed sideways, since the full lockup
// is only as wide as the strapline this drops.
const rows = bands(alpha, W, H);
if (rows.length < 2) throw new Error(`expected a stacked lockup, found ${rows.length} band(s)`);
rows.forEach(([a, b], i) =>
  console.log(`  band ${i + 1}: rows ${a}-${b}  ${(((b - a + 1) / H) * 100).toFixed(1)}% of the mark`),
);

const keep = rows[rows.length - 2][1];
let cx0 = W, cx1 = -1;
for (let y = 0; y <= keep; y++) {
  for (let x = 0; x < W; x++) {
    if (alpha[y * W + x] > 8) { if (x < cx0) cx0 = x; if (x > cx1) cx1 = x; }
  }
}
const cw = cx1 - cx0 + 1;
const ch = keep + 1;
const cAlpha = Buffer.alloc(cw * ch);
for (let y = 0; y < ch; y++) alpha.copy(cAlpha, y * cw, y * W + cx0, y * W + cx0 + cw);

await write(cAlpha, cw, ch, ink.rgb, 'logo-compact.png');
await write(cAlpha, cw, ch, { r: 255, g: 255, b: 255 }, 'logo-compact-light.png');
console.log(`compact ${cw}x${ch}  ratio ${(cw / ch).toFixed(3)}  (dropped band ${rows.length})`);
