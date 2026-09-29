/**
 * Génère les icônes (favicon, PWA, Apple) et les images de partage (Open Graph).
 *
 *   npm run assets
 *
 * - Icônes : via `sharp` (dépendance de dev).
 * - Images Open Graph 1200×630 : via Playwright/Chromium s'il est installé
 *   (`npx playwright install chromium`), sinon l'étape est ignorée.
 * Les fichiers produits sont écrits dans /public et versionnés : inutile de relancer
 * ce script à chaque build, seulement quand la carte ou le logo changent.
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = (...p) => path.join(root, 'public', ...p);

/* ---------- Icônes ---------- */
const MARK = `<path d="M9.5 19.5c14.8-5.6 30.2-5.6 45 0L35.2 56.6c-1.4 2.6-5 2.6-6.4 0L9.5 19.5Z" fill="#ffb42e"/><path d="M6.5 17.8c16.4-7.1 34.6-7.1 51 0" fill="none" stroke="#ff4d1f" stroke-width="7.5" stroke-linecap="round"/><circle cx="24.2" cy="27.6" r="3.9" fill="#ff4d1f"/><circle cx="39.8" cy="27.6" r="3.9" fill="#ff4d1f"/><circle cx="23" cy="26.4" r="1.1" fill="#fff3dc"/><circle cx="38.6" cy="26.4" r="1.1" fill="#fff3dc"/><path d="M24.5 36.2c4.6 4.6 10.4 4.6 15 0" fill="none" stroke="#120c0a" stroke-width="3.4" stroke-linecap="round"/>`;

const iconSvg = ({ radius = 16, scale = 0.875, pad = 4 } = {}) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="${radius}" fill="#120c0a"/><g transform="translate(${pad} ${pad + 1}) scale(${scale})">${MARK}</g></svg>`,
  );

async function png(svg, size, file) {
  await sharp(svg, { density: 1024 }).resize(size, size).png({ compressionLevel: 9 }).toFile(file);
}

/** Fichier .ico contenant une image PNG 32×32 (format accepté par tous les navigateurs modernes). */
async function ico(svg, file) {
  const data = await sharp(svg, { density: 512 }).resize(32, 32).png().toBuffer();
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(data.length, 8);
  entry.writeUInt32LE(22, 12);
  await writeFile(file, Buffer.concat([header, entry, data]));
}

await mkdir(pub('icons'), { recursive: true });
await png(iconSvg(), 192, pub('icons', 'icon-192.png'));
await png(iconSvg(), 512, pub('icons', 'icon-512.png'));
await png(iconSvg({ radius: 0, scale: 0.7, pad: 9.6 }), 512, pub('icons', 'icon-maskable-512.png'));
await png(iconSvg({ radius: 0 }), 180, pub('icons', 'apple-touch-icon.png'));
await ico(iconSvg(), pub('favicon.ico'));
console.log('✓ icônes générées');

/* ---------- Images Open Graph ---------- */
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.log('ℹ Playwright absent : images Open Graph non régénérées (npm i -D playwright pour les créer).');
  process.exit(0);
}

const { PIZZAS, BASES } = await import(pathToFileURL(path.join(root, 'src/data/menu.ts')).href);
const { SITE } = await import(pathToFileURL(path.join(root, 'src/data/site.ts')).href);
const { pizzaArt } = await import(pathToFileURL(path.join(root, 'src/lib/pizzaArt.ts')).href);

// polices intégrées en data-URI (les URL file:// sont bloquées dans une page about:blank)
const fontData = async (p) => `data:font/woff2;base64,${(await readFile(path.join(root, 'node_modules', p))).toString('base64')}`;
const font = (p) => fontCache.get(p);
const fontCache = new Map();
for (const f of [
  '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2',
  '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2',
  '@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2',
])
  fontCache.set(f, await fontData(f));
const fonts = `
@font-face{font-family:B;font-weight:200 800;src:url(${font('@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2')})}
@font-face{font-family:M;font-weight:200 800;src:url(${font('@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')})}
@font-face{font-family:S;font-style:italic;src:url(${font('@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2')})}`;

const eur = (n) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €';

function card({ eyebrow, title, accent, sub, art, badge }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#120c0a;color:#fff6ea;font-family:M;position:relative}
.glow{position:absolute;width:900px;height:900px;right:-300px;top:-200px;border-radius:50%;background:radial-gradient(circle,rgba(255,77,31,.55),transparent 62%)}
.glow2{position:absolute;width:600px;height:600px;left:-250px;bottom:-350px;border-radius:50%;background:radial-gradient(circle,rgba(255,180,46,.25),transparent 65%)}
.art{position:absolute;right:-70px;top:50%;width:600px;height:600px;margin-top:-300px;filter:drop-shadow(0 40px 50px rgba(0,0,0,.6))}
.art svg{width:100%;height:100%}
.txt{position:absolute;left:72px;top:64px;bottom:64px;width:620px;display:flex;flex-direction:column}
.logo{display:flex;align-items:center;gap:14px}
.logo svg{width:64px;height:64px}
.logo b{font-family:B;font-weight:800;font-size:40px;letter-spacing:-2px;display:block;line-height:1}
.logo i{font-style:normal;font-family:B;font-weight:700;font-size:14px;letter-spacing:8px;color:#ff4d1f;text-transform:uppercase}
.eyebrow{margin-top:auto;font-family:B;font-weight:700;font-size:20px;letter-spacing:5px;text-transform:uppercase;color:#ffb42e}
h1{font-family:B;font-weight:800;font-size:${title.length > 16 ? 76 : 96}px;line-height:.92;letter-spacing:-4px;margin-top:18px}
h1 em{font-family:S;font-weight:400;font-style:italic;color:#ffb42e;letter-spacing:-2px}
p{margin-top:22px;font-size:26px;color:#c7b3a3;line-height:1.35}
.badge{position:absolute;right:56px;bottom:48px;background:#ffb42e;color:#120c0a;font-family:B;font-weight:800;font-size:26px;padding:14px 26px;border-radius:999px;transform:rotate(-6deg);box-shadow:0 16px 30px -10px rgba(0,0,0,.5)}
</style></head><body><div class="glow"></div><div class="glow2"></div><div class="art">${art}</div>
<div class="txt"><div class="logo"><svg viewBox="0 0 64 64">${MARK}</svg><div><b>happiness</b><i>pizza</i></div></div>
<div class="eyebrow">${eyebrow}</div><h1>${title}${accent ? ` <em>${accent}</em>` : ''}</h1><p>${sub}</p></div>
${badge ? `<div class="badge">${badge}</div>` : ''}</body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const shoot = async (html, file) => {
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({ type: 'png' });
  await sharp(buf).jpeg({ quality: 84, mozjpeg: true }).toFile(file);
};

await shoot(
  card({
    eyebrow: `Pizzeria · ${SITE.address.city}`,
    title: 'La pizza qui rend',
    accent: 'heureux.',
    sub: `Pâte fraîche du jour · Livraison gratuite ${SITE.delivery.radiusKm} km<br>☎ ${SITE.phone}`,
    art: pizzaArt({ slug: 'og-home', base: 'tomate', ingredients: ['Olives', 'Champignons', 'Tomates cerises', 'Poivrons', 'Merguez'] }),
    badge: SITE.offer.short,
  }),
  pub('og', 'og-default.jpg'),
);

for (const p of PIZZAS) {
  const min = Math.min(...Object.values(p.prices));
  await shoot(
    card({
      eyebrow: BASES[p.base],
      title: 'Pizza',
      accent: p.name,
      sub: `${p.ingredients.join(', ')}<br><b style="color:#fff6ea">dès ${eur(min)}</b> · ${SITE.address.city}`,
      art: pizzaArt(p),
    }),
    pub('og', `pizza-${p.slug}.jpg`),
  );
}
await browser.close();
console.log(`✓ ${PIZZAS.length + 1} images Open Graph générées`);
