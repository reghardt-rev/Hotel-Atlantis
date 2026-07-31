// Warm "clay" photo treatment for Hotel Atlantis.
// Applies a warm channel grade + gentle saturation + a warm darkened-edge
// vignette, so photography sits cohesively with the site's clay accent.
//
// Usage:
//   node scripts/warm-photos.mjs <inputDir> <outputDir>
// Processes every .jpg/.jpeg/.png/.webp in inputDir and writes graded .jpg
// files (same basename) to outputDir. Prints a warmth score (mean R - mean B)
// for each source image so you can see which best fit the warm palette.

import sharp from 'sharp';
import { readdir, mkdir, cp } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

// ---- Look (tweak to taste) --------------------------------------------------
const SATURATION = 1.06; // >1 = richer colour
const R_MUL = 1.06; // lift reds  -> warmer
const G_MUL = 1.0;
const B_MUL = 0.92; // cut blues  -> warmer
const VIGNETTE_ALPHA = 0.55; // 0..1 edge darkness
const VIGNETTE_INNER = 45; // % of frame kept clean in the centre
const VIGNETTE_RGB = '30,18,10'; // warm near-black used at the edges
const JPEG_QUALITY = 84;

const IMG = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function vignetteSvg(w, h) {
  return Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
       <defs>
         <radialGradient id="v" cx="50%" cy="47%" r="72%">
           <stop offset="${VIGNETTE_INNER}%" stop-color="rgb(${VIGNETTE_RGB})" stop-opacity="0"/>
           <stop offset="100%" stop-color="rgb(${VIGNETTE_RGB})" stop-opacity="${VIGNETTE_ALPHA}"/>
         </radialGradient>
       </defs>
       <rect width="100%" height="100%" fill="url(#v)"/>
     </svg>`,
  );
}

async function processOne(inPath, outPath) {
  // Normalise orientation first, so vignette dimensions match the pixels.
  const base = await sharp(inPath).rotate().toBuffer();
  const meta = await sharp(base).metadata();
  const stats = await sharp(base).stats();
  const warmth = (stats.channels[0].mean - stats.channels[2].mean).toFixed(1);

  await sharp(base)
    .modulate({ saturation: SATURATION })
    .linear([R_MUL, G_MUL, B_MUL], [0, 0, 0])
    .composite([{ input: vignetteSvg(meta.width, meta.height), blend: 'over' }])
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(outPath);

  return { warmth: Number(warmth), w: meta.width, h: meta.height };
}

const [, , inDir, outDir] = process.argv;
if (!inDir || !outDir) {
  console.error('Usage: node scripts/warm-photos.mjs <inputDir> <outputDir>');
  process.exit(1);
}

await mkdir(outDir, { recursive: true });
const files = (await readdir(inDir)).filter((f) => IMG.has(extname(f).toLowerCase()));
if (files.length === 0) {
  console.log(`No images found in ${inDir}`);
  process.exit(0);
}

const results = [];
for (const f of files) {
  const outName = basename(f, extname(f)) + '.jpg';
  try {
    const r = await processOne(join(inDir, f), join(outDir, outName));
    results.push({ file: outName, ...r });
    console.log(`✓ ${outName.padEnd(28)} warmth ${String(r.warmth).padStart(6)}  (${r.w}×${r.h})`);
  } catch (e) {
    console.error(`✗ ${f}: ${e.message}`);
  }
}

results.sort((a, b) => b.warmth - a.warmth);
console.log(`\nWarmest → coolest (mean R−B):`);
for (const r of results) console.log(`  ${String(r.warmth).padStart(6)}  ${r.file}`);
console.log(`\nDone: ${results.length} image(s) → ${outDir}`);
