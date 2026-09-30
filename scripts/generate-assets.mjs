/**
 * Génère les icônes (favicon, PWA, Apple) et les images de partage Open Graph (1200×630)
 * à partir du logo et des vraies photos.
 *
 *   npm run assets
 *
 * Les images Open Graph utilisent Playwright/Chromium (npx playwright install chromium).
 * Les fichiers produits sont écrits dans /public et versionnés.
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = (...p) => path.join(root, 'public', ...p);

/* ---------- Logo (arche de four + flamme) ---------- */
const MARK = `<defs><radialGradient id="e" cx="50%" cy="88%" r="70%"><stop offset="0" stop-color="#FFE2B0"/><stop offset=".3" stop-color="#FF9A45"/><stop offset=".62" stop-color="#FF4F14" stop-opacity=".75"/><stop offset="1" stop-color="#FF4F14" stop-opacity="0"/></radialGradient><linearGradient id="f" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FF5A1F"/><stop offset=".55" stop-color="#FFA24F"/><stop offset="1" stop-color="#FFE7BF"/></linearGradient></defs><ellipse cx="20" cy="27.6" rx="8.4" ry="5.4" fill="url(#e)"/><path d="M20 19.6c2.3 2 3.3 3.8 3.3 5.3a3.3 3.3 0 0 1-6.6 0c0-.9.4-1.8 1.1-2.7.2.9.7 1.4 1.3 1.6-.3-1.4.1-2.8.9-4.2z" fill="url(#f)"/><path d="M10.2 29.5V20.3a9.8 9.8 0 0 1 19.6 0v9.2" fill="none" stroke="#F6EFE7" stroke-width="1.9" stroke-linecap="round"/><path d="M6.8 29.5h26.4" stroke="#F6EFE7" stroke-width="1.9" stroke-linecap="round"/>`;

const iconSvg = ({ radius = 9, scale = 1, pad = 0 } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="${radius}" fill="#0a0807"/><g transform="translate(${pad} ${pad - 1}) scale(${scale})">${MARK}</g></svg>`;

async function png(svg, size, file) {
  await sharp(Buffer.from(svg), { density: 1024 }).resize(size, size).png({ compressionLevel: 9 }).toFile(file);
}
async function ico(svg, file) {
  const data = await sharp(Buffer.from(svg), { density: 512 }).resize(32, 32).png().toBuffer();
  const header = Buffer.from([0, 0, 1, 0, 1, 0]);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(data.length, 8);
  entry.writeUInt32LE(22, 12);
  await writeFile(file, Buffer.concat([header, entry, data]));
}

await mkdir(pub('icons'), { recursive: true });
await writeFile(pub('favicon.svg'), iconSvg());
await png(iconSvg(), 192, pub('icons', 'icon-192.png'));
await png(iconSvg(), 512, pub('icons', 'icon-512.png'));
await png(iconSvg({ radius: 0, scale: 0.72, pad: 5.6 }), 512, pub('icons', 'icon-maskable-512.png'));
await png(iconSvg({ radius: 0 }), 180, pub('icons', 'apple-touch-icon.png'));
await ico(iconSvg(), pub('favicon.ico'));
console.log('✓ icônes générées');

/* ---------- Images Open Graph ---------- */
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.log('ℹ Playwright absent : images Open Graph non régénérées.');
  process.exit(0);
}

const { PIZZAS, BASES } = await import(pathToFileURL(path.join(root, 'src/data/menu.ts')).href);
const { SITE } = await import(pathToFileURL(path.join(root, 'src/data/site.ts')).href);

const b64 = async (p, mime) => `data:${mime};base64,${(await readFile(p)).toString('base64')}`;
const nm = (p) => path.join(root, 'node_modules', p);
const F = {
  syne: await b64(nm('@fontsource-variable/syne/files/syne-latin-wght-normal.woff2'), 'font/woff2'),
  manrope: await b64(nm('@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'), 'font/woff2'),
  serif: await b64(nm('@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2'), 'font/woff2'),
};
const img = async (p) => {
  const buf = await sharp(p).resize(900, 900, { fit: 'cover' }).webp({ quality: 82 }).toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
};
const eur = (n) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €';

function card({ eyebrow, title, accent, sub, art, badge, cut = false }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:D;font-weight:400 800;src:url(${F.syne})}
@font-face{font-family:M;font-weight:200 800;src:url(${F.manrope})}
@font-face{font-family:S;font-style:italic;src:url(${F.serif})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#0a0807;color:#f6efe7;font-family:M;position:relative}
.glow{position:absolute;width:1000px;height:1000px;right:-360px;top:-190px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,150,70,.55),rgba(255,92,28,.25) 40%,transparent 75%)}
.art{position:absolute;right:-40px;top:50%;width:560px;height:560px;margin-top:-280px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 1px rgba(255,220,190,.18),0 0 0 16px rgba(255,240,228,.03),0 50px 90px -20px rgba(0,0,0,.9)}
.art.cut{transform:perspective(1200px) rotateX(38deg) rotateZ(-14deg);box-shadow:0 60px 80px -30px rgba(0,0,0,.9)}
.art img{width:100%;height:100%;object-fit:cover}
.txt{position:absolute;left:72px;top:64px;bottom:64px;width:620px;display:flex;flex-direction:column}
.logo{display:flex;align-items:center;gap:14px}
.logo svg{width:58px;height:58px}
.logo b{font-family:D;font-weight:700;font-size:30px;letter-spacing:-1px}
.logo b i{font-family:S;font-weight:400;font-size:1.25em;color:#ff8a3d;margin-left:4px}
.eb{margin-top:auto;font-weight:700;font-size:17px;letter-spacing:5px;text-transform:uppercase;color:#ff8a3d}
h1{font-family:D;font-weight:700;font-size:${title.length + (accent || '').length > 22 ? 72 : 88}px;line-height:.92;letter-spacing:-4px;margin-top:18px}
h1 em{display:block;font-family:S;font-weight:400;letter-spacing:-1px;font-size:1.18em;background:linear-gradient(115deg,#ffd49a,#ff9c4e 35%,#ff5a1f 70%);-webkit-background-clip:text;color:transparent}
p{margin-top:22px;font-size:23px;color:#a99a8c;line-height:1.4}
p b{color:#f6efe7}
.badge{position:absolute;right:48px;bottom:44px;padding:14px 26px;border-radius:999px;background:linear-gradient(135deg,#ffb067,#ff5a1f);color:#170903;font-family:D;font-weight:700;font-size:24px;box-shadow:0 16px 40px -10px rgba(255,90,31,.8)}
</style></head><body><div class="glow"></div><div class="art${cut ? ' cut' : ''}"><img src="${art}"></div>
<div class="txt"><div class="logo"><svg viewBox="0 0 40 40">${MARK}</svg><b>Happiness<i>Pizza</i></b></div>
<div class="eb">${eyebrow}</div><h1>${title}${accent ? `<em>${accent}</em>` : ''}</h1><p>${sub}</p></div>
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

await mkdir(pub('og'), { recursive: true });
await shoot(
  card({
    eyebrow: `Pizzeria · ${SITE.address.city}`,
    title: 'Le bonheur',
    accent: 'sort du four.',
    sub: `Pâte fraîche du jour · Livraison offerte ${SITE.delivery.radiusKm} km<br><b>☎ ${SITE.phone}</b>`,
    art: await img(path.join(root, 'src/assets/cutouts/supreme.png')),
    badge: SITE.offer.short,
    cut: true,
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
      sub: `${p.ingredients.join(', ')}<br><b>dès ${eur(min)}</b> · ${SITE.address.city}`,
      art: await img(path.join(root, 'src/assets/photos', `${p.photo ?? `pizza-${p.slug}`}.jpg`)),
    }),
    pub('og', `pizza-${p.slug}.jpg`),
  );
}
await browser.close();
console.log(`✓ ${PIZZAS.length + 1} images Open Graph générées`);
