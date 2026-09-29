/**
 * Prépare les photos du site à partir d'un dossier de photos sources :
 *  - recadrage (carré centré sur le sujet, paysage…),
 *  - étalonnage « dark & warm » cohérent (contraste, chaleur, vignettage),
 *  - détourage circulaire des pizzas vues de dessus (PNG transparent).
 *
 *   node scripts/prepare-photos.mjs <dossier-source>
 *
 * Les fichiers produits vont dans src/assets/photos et src/assets/cutouts ;
 * Astro génère ensuite automatiquement les versions AVIF/WebP responsive.
 * Pour utiliser VOS photos : remplacez simplement les fichiers de src/assets/photos
 * (mêmes noms) ou modifiez la table ci-dessous.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.argv[2];
if (!SRC) {
  console.error('Usage : node scripts/prepare-photos.mjs <dossier-source>');
  process.exit(1);
}
const OUT_PHOTOS = path.join(root, 'src/assets/photos');
const OUT_CUTOUTS = path.join(root, 'src/assets/cutouts');

/** [clé, fichier source, format, taille max] — format : square | wide | tall | native */
const PHOTOS = [
  // Ambiance
  ['ambiance-four', 'pizza/pizza95.jpg', 'native', 1600],
  ['ambiance-ardoise', 'pizza/pizza62.jpg', 'wide', 2400],
  ['ambiance-fromage', 'pizza/pizza27.jpg', 'wide', 2400],
  ['ambiance-margherita', 'pizza/pizza92.jpg', 'wide', 2400],
  ['ambiance-planche', 'pizza/pizza9.jpg', 'native', 1600],
  ['ambiance-pepperoni', 'pizza/pizza66.jpg', 'native', 1600],
  ['ambiance-mains', 'pizza/pizza71.jpg', 'wide', 2400],
  ['ambiance-parts', 'pizza/pizza2.jpg', 'wide', 2400],
  ['ambiance-rustique', 'pizza/pizza5.jpg', 'native', 1600],
  ['ambiance-tomates', 'pizza/pizza64.jpg', 'native', 1920],
  ['ambiance-filant', 'pizza/pizza37.jpg', 'native', 1600],
  // Pizzas (carré)
  ['pizza-reine', 'pizza/pizza20.jpg', 'square', 1200],
  ['pizza-calzone', 'pizza/pizza70.jpg', 'square', 1100],
  ['pizza-campione', 'pizza/pizza54.jpg', 'square', 1000],
  ['pizza-bresilienne', 'pizza/pizza4.jpg', 'square', 1200],
  ['pizza-chicken', 'pizza/pizza18.jpg', 'square', 1000],
  ['pizza-fermiere', 'pizza/pizza91.jpg', 'square', 1080],
  ['pizza-barbecue', 'pizza/pizza22.jpg', 'square', 1000],
  ['pizza-boursin', 'pizza/pizza94.jpg', 'square', 1000],
  ['pizza-burger', 'pizza/pizza79.jpg', 'square', 1200],
  ['pizza-chilly', 'pizza/pizza74.jpg', 'square', 1000],
  ['pizza-british', 'pizza/pizza15.jpg', 'square', 1000],
  ['pizza-4-fromages', 'pizza/pizza56.jpg', 'square', 1000],
  ['pizza-chevre-miel', 'pizza/pizza26.jpg', 'square', 1200],
  ['pizza-salmone', 'pizza/pizza3.jpg', 'square', 1000],
  ['pizza-au-choix', 'pizza/pizza77.jpg', 'square', 1000],
  // Pâtes
  ['pates-bolognaise', 'pasta/pasta28.jpg', 'square', 1000],
  ['pates-saumon', 'pasta/pasta33.jpg', 'square', 1000],
  ['pates-fromagere', 'pasta/pasta31.jpg', 'square', 1000],
  // Desserts
  ['dessert-tiramisu-maison', 'dessert/dessert31.jpg', 'square', 1000],
  ['dessert-tiramisu', 'dessert/dessert18.jpg', 'square', 1000],
  ['dessert-lava-cake', 'dessert/dessert5.jpg', 'square', 1000],
  ['dessert-brownie', 'dessert/dessert8.jpg', 'square', 1000],
  ['dessert-cookie', 'dessert/dessert15.jpg', 'square', 1000],
  ['dessert-donuts', 'dessert/dessert19.jpg', 'square', 1000],
  ['dessert-beignet-trio', 'dessert/dessert4.jpg', 'square', 1000],
  ['dessert-muffin-nutella', 'dessert/dessert30.jpg', 'square', 1000],
  ['dessert-panini-nutella', 'dessert/dessert33.jpg', 'square', 1000],
  ['dessert-glace', 'dessert/dessert24.jpg', 'square', 1000],
  // Menus
  ['menu-familiale', 'pizza/pizza44.jpg', 'square', 1000],
  ['menu-ambiance', 'pizza/pizza33.jpg', 'square', 1000],
  ['menu-duo', 'pizza/pizza23.jpg', 'square', 1000],
  ['menu-enfant-pizza', 'pizza/pizza85.jpg', 'square', 1000],
];

/** Détourages circulaires : [clé, source, cx, cy, r] (cx, cy : fractions ; r : fraction de la largeur) */
const CUTOUTS = [
  ['supreme', 'pizza/pizza8.jpg', 0.504, 0.497, 0.451, 'white'],
  ['pepperoni', 'pizza/pizza25.jpg', 0.465, 0.48, 0.441, 'white'],
  ['pepperoni-planche', 'pizza/pizza14.jpg', 0.5, 0.49, 0.402],
  ['ardoise', 'pizza/pizza62.jpg', 0.5, 0.5, 0.3],
  ['legumes', 'pizza/pizza77.jpg', 0.5, 0.5, 0.47],
  ['classique', 'pizza/pizza85.jpg', 0.49, 0.5, 0.317],
];

/** Étalonnage commun : un peu plus de contraste, chaleur, noirs profonds. */
function grade(img) {
  return img
    .recomb([
      [1.05, 0.02, 0],
      [0, 1.0, 0],
      [0, 0, 0.92],
    ])
    .modulate({ saturation: 1.06, brightness: 0.98 })
    .linear(1.07, -9);
}

function vignette(w, h, strength = 0.42) {
  return Buffer.from(
    `<svg width="${w}" height="${h}"><defs><radialGradient id="v" cx="50%" cy="50%" r="72%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${strength}"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#v)"/></svg>`,
  );
}

await mkdir(OUT_PHOTOS, { recursive: true });
await mkdir(OUT_CUTOUTS, { recursive: true });

for (const [key, file, format, max] of PHOTOS) {
  const src = path.join(SRC, file);
  const meta = await sharp(src).metadata();
  let img = sharp(src).rotate();
  let w = meta.width;
  let h = meta.height;
  if (format === 'square') {
    const s = Math.min(w, h, max);
    img = img.resize(s, s, { fit: 'cover', position: sharp.strategy.attention });
    w = h = s;
  } else if (format === 'wide') {
    const tw = Math.min(max, w);
    const th = Math.round(tw * 0.5625);
    img = img.resize(tw, th, { fit: 'cover', position: sharp.strategy.attention });
    w = tw;
    h = th;
  } else {
    const scale = Math.min(1, max / Math.max(w, h));
    w = Math.round(w * scale);
    h = Math.round(h * scale);
    img = img.resize(w, h);
  }
  const base = await grade(img).toBuffer();
  await sharp(base)
    .composite([{ input: vignette(w, h, format === 'square' ? 0.3 : 0.45) }])
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(path.join(OUT_PHOTOS, `${key}.jpg`));
  console.log('✓ photo', key, `${w}×${h}`);
}

for (const [key, file, cx, cy, r, keyBg] of CUTOUTS) {
  const src = path.join(SRC, file);
  const meta = await sharp(src).metadata();
  const R = Math.round(r * meta.width);
  const left = Math.max(0, Math.round(cx * meta.width - R));
  const top = Math.max(0, Math.round(cy * meta.height - R));
  const size = Math.min(2 * R, meta.width - left, meta.height - top);
  const out = Math.min(1400, size);
  const cropped = await grade(sharp(src).extract({ left, top, width: size, height: size }).resize(out, out)).toBuffer();
  // masque circulaire au bord légèrement adouci
  const feather = Math.max(2, Math.round(out * 0.004));
  const mask = await sharp(
    Buffer.from(`<svg width="${out}" height="${out}"><circle cx="${out / 2}" cy="${out / 2}" r="${out / 2 - feather * 1.5}" fill="#fff"/></svg>`),
  )
    .blur(feather)
    .extractChannel(0)
    .toBuffer();
  let alpha = mask;
  if (keyBg === 'white') {
    // fond blanc : les pixels presque blancs deviennent transparents (supprime le liseré)
    const { data, info } = await sharp(cropped).raw().toBuffer({ resolveWithObject: true });
    const { data: m, info: mi } = await sharp(mask).extractChannel(0).raw().toBuffer({ resolveWithObject: true });
    const a = Buffer.alloc(info.width * info.height);
    for (let i = 0; i < a.length; i++) {
      const o = i * info.channels;
      const lo = Math.min(data[o], data[o + 1], data[o + 2]);
      const k = lo > 238 ? 0 : lo > 212 ? (238 - lo) / 26 : 1;
      a[i] = Math.round(m[i * mi.channels] * k);
    }
    alpha = await sharp(a, { raw: { width: info.width, height: info.height, channels: 1 } }).blur(0.6).png().toBuffer();
  }
  await sharp(cropped).joinChannel(alpha).png({ compressionLevel: 9 }).toFile(path.join(OUT_CUTOUTS, `${key}.png`));
  console.log('✓ détourage', key, `${out}px`);
}
