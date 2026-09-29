/**
 * Illustration SVG "vue de dessus" générée à partir des ingrédients réels
 * de chaque pizza. Déterministe (même pizza = même dessin) et très légère.
 */
import type { Base, Pizza } from '../data/menu';

let uid = 0;

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/œ/g, 'oe');

const SAUCE: Record<Base, [string, string]> = {
  tomate: ['#e0461f', '#b92d13'],
  creme: ['#fbf0d9', '#ecd6ad'],
  barbecue: ['#7a3316', '#5a2410'],
  ketchup: ['#d9321c', '#a81f10'],
  thai: ['#ee7a2f', '#c95516'],
  choix: ['#e0461f', '#f3dfb8'],
};

type T =
  | 'mushroom'
  | 'olive'
  | 'chicken'
  | 'beef'
  | 'merguez'
  | 'ham'
  | 'bacon'
  | 'pepper'
  | 'onion'
  | 'onionFondu'
  | 'cherry'
  | 'goat'
  | 'blue'
  | 'raclette'
  | 'cheddar'
  | 'boursin'
  | 'potato'
  | 'salmon'
  | 'jalapeno'
  | 'pickle'
  | 'tuna';

function toppingsFor(ingredients: string[]): { list: T[]; egg: boolean; honey: boolean } {
  const list: T[] = [];
  let egg = false;
  let honey = false;
  for (const raw of ingredients) {
    const s = norm(raw);
    if (s.includes('champignon')) list.push('mushroom');
    else if (s.includes('olive')) list.push('olive');
    else if (s.includes('poulet')) list.push('chicken');
    else if (s.includes('merguez')) list.push('merguez');
    else if (s.includes('boeuf') || s.includes('viande')) list.push('beef');
    else if (s.includes('jambon')) list.push('ham');
    else if (s.includes('bacon')) list.push('bacon');
    else if (s.includes('jalapeno') || s.includes('piment')) list.push('jalapeno');
    else if (s.includes('poivron')) list.push('pepper');
    else if (s.includes('fondu')) list.push('onionFondu');
    else if (s.includes('oignon')) list.push('onion');
    else if (s.includes('tomates cerises') || s.includes('tomate fraiche')) list.push('cherry');
    else if (s.includes('chevre')) list.push('goat');
    else if (s.includes('gorgonzola')) list.push('blue');
    else if (s.includes('raclette') || s.includes('reblochon') || s.includes('emmental')) list.push('raclette');
    else if (s.includes('cheddar')) list.push('cheddar');
    else if (s.includes('boursin')) list.push('boursin');
    else if (s.includes('pommes de terre') || s.includes('potato')) list.push('potato');
    else if (s.includes('saumon')) list.push('salmon');
    else if (s.includes('cornichon')) list.push('pickle');
    else if (s.includes('thon')) list.push('tuna');
    else if (s.includes('oeuf')) egg = true;
    else if (s.includes('miel')) honey = true;
    else if (s.includes('viandes au choix')) list.push('chicken', 'beef');
    else if (s.includes('legumes au choix')) list.push('mushroom', 'pepper');
  }
  return { list, egg, honey };
}

/** Dessine une garniture centrée en (0,0). */
function draw(t: T, r: () => number): string {
  const rot = Math.round(r() * 360);
  switch (t) {
    case 'mushroom':
      return `<g transform="rotate(${rot})"><path d="M-7 1c0-6 3.5-8.5 7-8.5S7-5 7 1z" fill="#efe1c6" stroke="#b89c74" stroke-width=".8"/><path d="M-2.5 1h5l.6 6.5h-6.2z" fill="#e6d4b2" stroke="#b89c74" stroke-width=".8"/></g>`;
    case 'olive':
      return `<circle r="4.2" fill="none" stroke="#1d1714" stroke-width="3.2"/><circle cx="-1" cy="-1.6" r=".9" fill="#6b5b52"/>`;
    case 'chicken':
      return `<path transform="rotate(${rot})" d="M-6-3c3-3 9-2 9.5 1.5S2 5.5-2 5-9 0-6-3z" fill="#e9c38e" stroke="#b98a52" stroke-width=".9"/>`;
    case 'beef':
      return `<g fill="#6a3a22"><circle cx="-2" cy="-1" r="2.6"/><circle cx="2" cy="1.5" r="2.2"/><circle cx="1.6" cy="-2.2" r="1.7"/></g>`;
    case 'merguez':
      return `<g transform="rotate(${rot})"><circle r="5.6" fill="#9c2d18"/><circle r="4" fill="#b8421f"/><circle cx="-1.2" cy="1" r=".8" fill="#e8a07c"/><circle cx="1.5" cy="-1.2" r=".7" fill="#e8a07c"/></g>`;
    case 'ham':
      return `<rect transform="rotate(${rot})" x="-6" y="-5" width="12" height="10" rx="3" fill="#f2a3a0" stroke="#d97d7a" stroke-width=".9"/>`;
    case 'bacon':
      return `<g transform="rotate(${rot})"><path d="M-9-2.5c3-1.5 6 1.5 9 0s6 1.5 9 0v4.5c-3 1.5-6-1.5-9 0s-6-1.5-9 0z" fill="#c9533f"/><path d="M-9 -.3c3-1.5 6 1.5 9 0s6 1.5 9 0" stroke="#f4c4b0" stroke-width="1.2" fill="none"/></g>`;
    case 'pepper': {
      const c = r() > 0.5 ? '#2f9c47' : '#e2371f';
      return `<path transform="rotate(${rot})" d="M-8 2c3-5 13-5 16 0" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
    }
    case 'onion':
      return `<circle r="5.5" fill="none" stroke="#a24a8b" stroke-width="1.8" opacity=".95"/><circle r="3" fill="none" stroke="#c77db3" stroke-width="1.2"/>`;
    case 'onionFondu':
      return `<path transform="rotate(${rot})" d="M-7 0c2-3 4 3 7 0s5 3 7 0" fill="none" stroke="#c98a3a" stroke-width="2.2" stroke-linecap="round"/>`;
    case 'cherry':
      return `<circle r="5.4" fill="#e0301b"/><circle r="3.6" fill="#ff7a5c"/><g fill="#ffe0a3"><circle cx="-1.4" cy=".6" r=".7"/><circle cx="1.4" cy=".6" r=".7"/><circle cy="-1.5" r=".7"/></g>`;
    case 'goat':
      return `<circle r="6" fill="#fffaf0" stroke="#e6dcc6" stroke-width="1.2"/><circle r="3.8" fill="none" stroke="#efe6d2" stroke-width=".8"/>`;
    case 'blue':
      return `<g transform="rotate(${rot})"><path d="M-6-3c3-4 11-3 11 2s-7 7-10 4-4-3-1-6z" fill="#f5efd9"/><path d="M-3-1l3 1M1 2l2-2" stroke="#6f8a9a" stroke-width="1.2" stroke-linecap="round"/></g>`;
    case 'raclette':
      return `<rect transform="rotate(${rot})" x="-6" y="-4" width="12" height="8" rx="3" fill="#ffd261" opacity=".95"/>`;
    case 'cheddar':
      return `<rect transform="rotate(${rot})" x="-5" y="-5" width="10" height="10" rx="1.6" fill="#ff9f1c" opacity=".92"/>`;
    case 'boursin':
      return `<g fill="#fffdf6"><circle r="4.6"/><circle cx="3.5" cy="2" r="3"/></g><g fill="#6a9a3c"><circle cx="-1" cy="-1" r=".6"/><circle cx="2" cy="1.5" r=".6"/></g>`;
    case 'potato':
      return `<rect transform="rotate(${rot})" x="-4" y="-4" width="8" height="8" rx="2" fill="#f1cf7a" stroke="#c9a14e" stroke-width=".8"/><circle cx="1" cy="-1" r=".7" fill="#4c8a2e"/>`;
    case 'salmon':
      return `<g transform="rotate(${rot})"><path d="M-9-3c4-2 14-1 17 1-3 3-13 4-17 2z" fill="#ff8f6b"/><path d="M-6-1.5l12 .8M-5 1l10 .2" stroke="#ffd0bf" stroke-width=".9"/></g>`;
    case 'jalapeno':
      return `<circle r="4.6" fill="#5fae3b"/><circle r="2.6" fill="#c7e59a"/><g fill="#f7f3d7"><circle cx="-.9" r=".6"/><circle cx=".9" r=".6"/></g>`;
    case 'pickle':
      return `<ellipse transform="rotate(${rot})" rx="6" ry="4.4" fill="#7ea33a"/><ellipse transform="rotate(${rot})" rx="4.2" ry="2.8" fill="#b9cf6a"/>`;
    case 'tuna':
      return `<path transform="rotate(${rot})" d="M-6-2c2-3 8-3 10 0s-2 5-5 4-7-1-5-4z" fill="#e8c9b0" stroke="#c69c7c" stroke-width=".8"/>`;
  }
}

export function pizzaArt(p: Pick<Pizza, 'slug' | 'base' | 'ingredients'>, opts: { title?: string } = {}) {
  const id = `pz${uid++}`;
  const r = rng(hash(p.slug));
  const [s1, s2] = SAUCE[p.base];
  const isCream = p.base === 'creme';
  const { list, egg, honey } = toppingsFor(p.ingredients);

  // fromage fondu
  let cheese = '';
  for (let i = 0; i < 16; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 62;
    cheese += `<ellipse cx="${(Math.cos(a) * d).toFixed(1)}" cy="${(Math.sin(a) * d).toFixed(1)}" rx="${(12 + r() * 12).toFixed(1)}" ry="${(9 + r() * 10).toFixed(1)}" transform="rotate(${Math.round(r() * 180)} ${(Math.cos(a) * d).toFixed(1)} ${(Math.sin(a) * d).toFixed(1)})"/>`;
  }
  // gratiné
  let spots = '';
  for (let i = 0; i < 22; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 72;
    spots += `<circle cx="${(Math.cos(a) * d).toFixed(1)}" cy="${(Math.sin(a) * d).toFixed(1)}" r="${(1.5 + r() * 3.5).toFixed(1)}"/>`;
  }

  // garnitures : placement par rejet
  const placed: Array<[number, number]> = [];
  let tops = '';
  const want = list.length ? Math.min(34, 12 + list.length * 5) : 0;
  let guard = 0;
  while (placed.length < want && guard++ < 900) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 66;
    const x = Math.cos(a) * d;
    const y = Math.sin(a) * d;
    if (egg && Math.hypot(x, y) < 20) continue;
    if (placed.some(([px, py]) => Math.hypot(px - x, py - y) < 14)) continue;
    placed.push([x, y]);
    const t = list[placed.length % list.length];
    tops += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">${draw(t, r)}</g>`;
  }

  // origan
  let herbs = '';
  for (let i = 0; i < 46; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 76;
    herbs += `<rect x="${(Math.cos(a) * d).toFixed(1)}" y="${(Math.sin(a) * d).toFixed(1)}" width="${(1.2 + r() * 1.8).toFixed(1)}" height="1.1" transform="rotate(${Math.round(r() * 180)} ${(Math.cos(a) * d).toFixed(1)} ${(Math.sin(a) * d).toFixed(1)})"/>`;
  }

  const eggSvg = egg
    ? `<g><path d="M-19-2c-1-12 13-18 22-12s12 20 0 26-21-2-22-14z" fill="#fffbf1"/><circle cx="1" cy="-1" r="8" fill="#ffb21f"/><circle cx="-1.5" cy="-3.5" r="2.4" fill="#ffd77a"/></g>`
    : '';
  const honeySvg = honey
    ? `<path d="M-58-10c14-18 26 16 40 0s26 16 40 0 22 12 34 4M-46 26c12-12 22 10 34 0s24 10 36 0" fill="none" stroke="#f3a712" stroke-width="3" stroke-linecap="round" opacity=".9"/>`
    : '';
  const title = opts.title ? `<title>${opts.title}</title>` : '';

  return `<svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" role="img" class="pizza-art">${title}
<defs>
<radialGradient id="${id}c" r=".5"><stop offset=".8" stop-color="#f3bd6d"/><stop offset=".92" stop-color="#d98d3e"/><stop offset="1" stop-color="#a95f22"/></radialGradient>
<radialGradient id="${id}s" r=".5"><stop offset="0" stop-color="${s1}"/><stop offset="1" stop-color="${s2}"/></radialGradient>
<radialGradient id="${id}l" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient>
</defs>
<circle r="97" fill="url(#${id}c)"/>
<g fill="#8a4a18" opacity=".35">${Array.from({ length: 26 }, () => {
    const a = r() * Math.PI * 2;
    const d = 86 + r() * 8;
    return `<circle cx="${(Math.cos(a) * d).toFixed(1)}" cy="${(Math.sin(a) * d).toFixed(1)}" r="${(1.5 + r() * 3).toFixed(1)}"/>`;
  }).join('')}</g>
<circle r="82" fill="url(#${id}s)"/>
<g fill="${isCream ? '#fff6dd' : '#ffe6a0'}" opacity="${isCream ? 0.95 : 0.9}">${cheese}</g>
<g fill="#c77f2a" opacity=".32">${spots}</g>
${eggSvg}${tops}${honeySvg}
<g fill="#4c7a2a" opacity=".85">${herbs}</g>
<g stroke="#6b3a14" stroke-opacity=".14" stroke-width="1.2"><path d="M0-82V82M-82 0H82M-58-58 58 58M58-58-58 58"/></g>
<circle r="97" fill="url(#${id}l)"/>
</svg>`;
}
