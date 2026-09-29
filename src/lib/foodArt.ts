/**
 * Illustrations SVG vectorielles pour les produits hors pizza.
 * viewBox 0 0 200 200, style "flat" avec ombres douces.
 */
import type { ArtKind } from '../data/menu';

let uid = 0;

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  const r = c((n >> 16) & 255);
  const g = c((n >> 8) & 255);
  const b = c(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

const shadow = `<ellipse cx="100" cy="178" rx="70" ry="10" fill="#000" opacity=".22"/>`;

function bowl(inner: string, id: string, bowlColor = '#fff6ea') {
  return `${shadow}
<defs><linearGradient id="${id}b" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${bowlColor}"/><stop offset="1" stop-color="${shade(bowlColor, -0.18)}"/></linearGradient></defs>
<path d="M22 96h156c0 44-34 76-78 76S22 140 22 96z" fill="url(#${id}b)"/>
<ellipse cx="100" cy="96" rx="78" ry="22" fill="${shade(bowlColor, -0.1)}"/>
<ellipse cx="100" cy="94" rx="70" ry="17" fill="#3a2418" opacity=".25"/>
${inner}
<path d="M34 118c10 24 34 40 66 40" stroke="#fff" stroke-opacity=".45" stroke-width="5" fill="none" stroke-linecap="round"/>`;
}

export function foodArt(kind: ArtKind, tint = '#ff4d1f', name = ''): string {
  const id = `fa${uid++}`;
  let body = '';
  switch (kind) {
    case 'pasta-red':
    case 'pasta-white':
    case 'pasta-salmon': {
      const noodle = kind === 'pasta-white' ? '#f6d98f' : '#f4c96b';
      let strands = '';
      for (let i = 0; i < 9; i++) {
        const y = 70 + (i % 3) * 7;
        const x = 44 + i * 12;
        strands += kind === 'pasta-white'
          ? `<rect x="${x}" y="${y - 6}" width="11" height="22" rx="4" transform="rotate(${i * 37 % 70 - 35} ${x + 5} ${y + 4})" fill="${noodle}" stroke="#d9ae52" stroke-width="1.5"/>`
          : `<path d="M${x - 10} ${y + 12}c6-20 18-20 22-4s14 10 18-6" fill="none" stroke="${noodle}" stroke-width="5" stroke-linecap="round"/>`;
      }
      const sauce =
        kind === 'pasta-red'
          ? `<path d="M64 74c8-14 44-16 58-4 10 9-4 22-28 22s-38-6-30-18z" fill="#c9321a"/><g fill="#7a3a22"><circle cx="82" cy="78" r="5"/><circle cx="98" cy="73" r="4"/><circle cx="108" cy="82" r="4.5"/></g><path d="M120 66c6-8 18-6 18 2-8 6-14 4-18-2z" fill="#2f9a45"/>`
          : kind === 'pasta-salmon'
            ? `<g fill="#ff8f6b"><path d="M66 70c10-6 22-4 26 2-8 6-20 6-26-2z"/><path d="M104 64c10-6 22-2 24 4-8 6-20 4-24-4z"/><path d="M88 84c10-6 22-4 26 2-8 6-20 6-26-2z"/></g><g stroke="#3f8f3a" stroke-width="2" stroke-linecap="round"><path d="M78 62l6-8M82 60l8-2M122 80l6-6M126 78l6 1"/></g>`
            : `<path d="M58 80c14-12 70-12 84 0-10 10-74 10-84 0z" fill="#fff4dc" opacity=".9"/><g fill="#e9c38e" stroke="#b98a52"><path d="M76 72c4-4 12-3 12 1s-8 5-12-1z"/><path d="M108 70c4-4 12-3 12 1s-8 5-12-1z"/></g><g fill="#efe1c6"><path d="M92 80c0-6 8-6 8 0z"/><path d="M122 80c0-6 8-6 8 0z"/></g>`;
      const parm = Array.from({ length: 18 }, (_, i) => `<rect x="${60 + ((i * 37) % 80)}" y="${64 + ((i * 17) % 24)}" width="3" height="2" fill="#fffbe8"/>`).join('');
      body = bowl(`<g>${strands}</g>${sauce}${parm}`, id, '#fff6ea');
      break;
    }
    case 'salad': {
      let leaves = '';
      const greens = ['#3fae4f', '#6cc24a', '#2e8f3e', '#98d05a'];
      for (let i = 0; i < 12; i++) {
        const x = 46 + ((i * 29) % 108);
        const y = 66 + ((i * 13) % 26);
        leaves += `<path d="M${x} ${y}c8-14 26-12 26 2s-18 18-26-2z" fill="${greens[i % 4]}" transform="rotate(${(i * 47) % 360} ${x + 12} ${y})"/>`;
      }
      const toppings = `<g fill="${tint}"><rect x="72" y="70" width="14" height="10" rx="3"/><rect x="112" y="76" width="14" height="10" rx="3"/><rect x="94" y="64" width="12" height="9" rx="3"/></g>
<g><circle cx="62" cy="80" r="7" fill="#e0301b"/><circle cx="62" cy="80" r="4" fill="#ff7a5c"/><circle cx="138" cy="72" r="7" fill="#e0301b"/><circle cx="138" cy="72" r="4" fill="#ff7a5c"/><circle cx="100" cy="86" r="6" fill="#e0301b"/></g>
<g fill="#e6b060" stroke="#b9843a" stroke-width="1"><rect x="84" y="80" width="9" height="9" rx="1.5"/><rect x="122" y="86" width="9" height="9" rx="1.5"/></g>`;
      body = bowl(`${leaves}${toppings}`, id, '#fdf4e6');
      break;
    }
    case 'panini':
    case 'panini-sweet': {
      const drip = kind === 'panini-sweet' ? '#5a2e1a' : '#ffd262';
      body = `${shadow}
<defs><linearGradient id="${id}p" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f0b865"/><stop offset="1" stop-color="#c98537"/></linearGradient></defs>
<g transform="rotate(-8 100 110)">
<rect x="26" y="112" width="148" height="34" rx="16" fill="#c98537"/>
<path d="M40 112c10 12 14 16 18 26 4-10 8-14 12-18 6 8 8 12 10 20 4-8 8-14 14-20 6 8 8 14 10 22 4-10 8-14 14-20 4 6 8 12 10 18 4-8 8-12 14-16" fill="${drip}"/>
<rect x="26" y="80" width="148" height="38" rx="18" fill="url(#${id}p)"/>
<g stroke="#7a4516" stroke-width="5" stroke-linecap="round" opacity=".55"><path d="M48 88l14 22M76 86l14 24M104 86l14 24M132 86l14 22"/></g>
<path d="M40 88c20-6 90-8 118-2" stroke="#fff" stroke-opacity=".35" stroke-width="4" fill="none" stroke-linecap="round"/>
</g>`;
      break;
    }
    case 'donut':
      body = `${shadow}<circle cx="100" cy="104" r="66" fill="#e3a257"/><path d="M40 98c0-34 28-60 60-60s60 26 60 60c-4 14-12 10-16 20-4-10-12-6-16 4-6-8-14-4-18 6-6-10-14-8-20 2-4-10-12-10-18-2-4-10-12-14-12-30z" fill="#ff7bac"/><circle cx="100" cy="100" r="20" fill="#2a1a12"/><circle cx="100" cy="100" r="20" fill="none" stroke="#d98f4a" stroke-width="6"/>${[
        '#ffd23f', '#3fd0c9', '#fff', '#7b5cff', '#ffd23f', '#3fd0c9', '#fff', '#7b5cff', '#ffd23f', '#fff',
      ]
        .map((c, i) => {
          const a = (i / 10) * Math.PI * 2;
          const d = 40 + (i % 3) * 5;
          return `<rect x="${100 + Math.cos(a) * d}" y="${98 + Math.sin(a) * d}" width="9" height="3.4" rx="1.7" fill="${c}" transform="rotate(${i * 53} ${100 + Math.cos(a) * d} ${98 + Math.sin(a) * d})"/>`;
        })
        .join('')}<path d="M58 70c10-16 28-24 44-24" stroke="#fff" stroke-opacity=".55" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      break;
    case 'cookie':
      body = `${shadow}<circle cx="100" cy="104" r="68" fill="#d9a25c"/><circle cx="100" cy="104" r="68" fill="none" stroke="#b98040" stroke-width="4"/>${[
        [70, 80], [110, 70], [132, 104], [86, 118], [116, 136], [66, 128], [100, 96],
      ]
        .map(([x, y], i) => `<path d="M${x} ${y}l6-3 5 4-2 7-7 1z" fill="#4a2616" transform="rotate(${i * 40} ${x} ${y})"/>`)
        .join('')}<path d="M52 82c8-18 26-30 48-32" stroke="#fff" stroke-opacity=".4" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      break;
    case 'brownie':
      body = `${shadow}<path d="M40 86l60-26 60 26v58l-60 26-60-26z" fill="#3b1f14"/><path d="M40 86l60-26 60 26-60 26z" fill="#5a2f1c"/><path d="M100 112v58l60-26V86z" fill="#2b160e"/><path d="M60 84l20 8 14-6 18 10M92 72l18 6" stroke="#2a150d" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M104 74c6-6 16-4 16 2s-10 8-16-2z" fill="#c98a4a"/>`;
      break;
    case 'lava':
      body = `${shadow}<ellipse cx="100" cy="150" rx="66" ry="14" fill="#f6e8d6"/><path d="M52 84h96l-8 60c-2 8-78 8-80 0z" fill="#3a1d12"/><ellipse cx="100" cy="84" rx="48" ry="14" fill="#52291a"/><path d="M84 84c4 16 0 30-6 50 12 4 30 4 42 0-6-20-10-34-6-50z" fill="#6b2c12"/><path d="M92 86c2 18-2 34-10 56 8 2 30 2 36 0-8-22-12-38-10-56" fill="#8c3a14" opacity=".6"/><g fill="#fff"><circle cx="72" cy="80" r="2"/><circle cx="120" cy="78" r="2"/><circle cx="104" cy="74" r="1.6"/></g>`;
      break;
    case 'tiramisu':
      body = `${shadow}<path d="M44 70h112v84c0 8-6 14-14 14H58c-8 0-14-6-14-14z" fill="#fff" opacity=".35"/><rect x="50" y="76" width="100" height="18" fill="#6b3e22"/><rect x="50" y="94" width="100" height="22" fill="#fff3d6"/><rect x="50" y="116" width="100" height="16" fill="#8a5330"/><rect x="50" y="132" width="100" height="26" rx="6" fill="#fff3d6"/><rect x="50" y="72" width="100" height="10" rx="4" fill="#4a2616"/><path d="M50 76c10-4 20 4 30 0s20 4 30 0 20 4 30 0 10 2 10 2" fill="none" stroke="#2f170c" stroke-width="3"/><path d="M58 80v70" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/>`;
      break;
    case 'muffin':
      body = `${shadow}<path d="M58 110h84l-10 56c-1 6-6 8-12 8H80c-6 0-11-2-12-8z" fill="#ff4d1f"/><g stroke="#e5370c" stroke-width="3"><path d="M72 112l6 58M90 112l2 60M110 112l-2 60M128 112l-6 58"/></g><path d="M46 112c-6-36 22-62 54-62s60 26 54 62c-18 8-90 8-108 0z" fill="#5a2f1c"/><path d="M70 72c10-10 26-14 40-10" stroke="#8c5332" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M92 50c4-8 16-8 18 0-4 6-14 6-18 0z" fill="#3a1d12"/>`;
      break;
    case 'beignet':
      body = `${shadow}${[
        [66, 118, 36], [134, 118, 36], [100, 84, 38],
      ]
        .map(([x, y, rr]) => `<ellipse cx="${x}" cy="${y}" rx="${rr}" ry="${rr * 0.82}" fill="#e3a257"/><ellipse cx="${x - 6}" cy="${y - 8}" rx="${rr * 0.6}" ry="${rr * 0.36}" fill="#fff" opacity=".55"/>`)
        .join('')}${Array.from({ length: 30 }, (_, i) => `<circle cx="${40 + ((i * 41) % 124)}" cy="${60 + ((i * 23) % 80)}" r="1.4" fill="#fff"/>`).join('')}`;
      break;
    case 'icecream':
      body = `${shadow}<path d="M58 96h84l-12 72c-1 5-5 8-10 8H80c-5 0-9-3-10-8z" fill="#fff6ea"/><rect x="58" y="96" width="84" height="18" fill="${tint}" opacity=".35"/><circle cx="78" cy="84" r="24" fill="#ffd1dc"/><circle cx="122" cy="84" r="24" fill="#7a4a2a"/><circle cx="100" cy="64" r="26" fill="#fff4d2"/><path d="M84 56c6-8 16-10 24-6" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="100" cy="38" r="7" fill="#e0301b"/>`;
      break;
    case 'can': {
      const dark = shade(tint, -0.2);
      body = `${shadow}
<defs><linearGradient id="${id}c" x1="0" x2="1"><stop offset="0" stop-color="${dark}"/><stop offset=".35" stop-color="${tint}"/><stop offset=".55" stop-color="${shade(tint, 0.18)}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
<linearGradient id="${id}m" x1="0" x2="1"><stop offset="0" stop-color="#9aa3ab"/><stop offset=".5" stop-color="#eef2f5"/><stop offset="1" stop-color="#8d969e"/></linearGradient></defs>
<rect x="62" y="36" width="76" height="140" rx="14" fill="url(#${id}c)"/>
<path d="M66 40h68l-6-10H72z" fill="url(#${id}m)"/>
<rect x="62" y="160" width="76" height="14" rx="6" fill="url(#${id}m)"/>
<path d="M62 92c26 14 50-14 76 0v30c-26-14-50 14-76 0z" fill="#fff" opacity=".9"/>
<rect x="74" y="44" width="8" height="120" rx="4" fill="#fff" opacity=".28"/>`;
      break;
    }
    case 'bottle':
    case 'water': {
      const liquid = kind === 'water' ? '#cfeaf8' : shade(tint, -0.25);
      body = `${shadow}
<defs><linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="${liquid}"/><stop offset=".4" stop-color="${shade(liquid, 0.15)}"/><stop offset="1" stop-color="${shade(liquid, -0.1)}"/></linearGradient></defs>
<rect x="88" y="18" width="24" height="14" rx="3" fill="${kind === 'water' ? '#3f8fd2' : tint}"/>
<path d="M90 32h20v14c14 8 20 20 20 34v84c0 8-6 12-14 12H84c-8 0-14-4-14-12V80c0-14 6-26 20-34z" fill="url(#${id}g)" opacity="${kind === 'water' ? 0.85 : 1}"/>
<rect x="70" y="100" width="60" height="38" fill="${kind === 'water' ? '#3f8fd2' : tint}"/>
<path d="M76 116c16 6 34-6 48 0" stroke="#fff" stroke-width="4" fill="none" opacity=".9"/>
<rect x="78" y="56" width="7" height="104" rx="3.5" fill="#fff" opacity=".35"/>`;
      break;
    }
    case 'pouch':
      body = `${shadow}
<defs><linearGradient id="${id}s" x1="0" x2="1"><stop offset="0" stop-color="#9aa3ab"/><stop offset=".5" stop-color="#f1f4f7"/><stop offset="1" stop-color="#8d969e"/></linearGradient></defs>
<path d="M60 44h80l6 124c0 6-4 10-10 10H64c-6 0-10-4-10-10z" fill="url(#${id}s)"/>
<path d="M60 44h80v10H60z" fill="#b8c0c7"/>
<circle cx="100" cy="116" r="28" fill="#ff8a1a"/><circle cx="100" cy="116" r="16" fill="#ffd23f"/>
<rect x="116" y="18" width="7" height="40" rx="3" fill="#ffd23f" transform="rotate(12 119 38)"/>`;
      break;
    case 'menu':
      body = `${shadow}
<path d="M28 96l72-30 72 30v58l-72 30-72-30z" fill="#e9d2ae"/>
<path d="M28 96l72 30 72-30-72-30z" fill="#f6e5c8"/>
<path d="M100 126v58l72-30V96z" fill="#d7b98f"/>
<ellipse cx="100" cy="96" rx="44" ry="17" fill="#f3bd6d"/><ellipse cx="100" cy="95" rx="37" ry="13" fill="#e0461f"/>
<g fill="#ffe6a0" opacity=".9"><ellipse cx="88" cy="93" rx="12" ry="5"/><ellipse cx="110" cy="97" rx="12" ry="5"/></g>
<g fill="#a51d12"><ellipse cx="84" cy="97" rx="5" ry="2.4"/><ellipse cx="104" cy="90" rx="5" ry="2.4"/><ellipse cx="118" cy="96" rx="5" ry="2.4"/></g>
<g transform="translate(132 40) rotate(10)"><rect width="30" height="54" rx="6" fill="${tint}"/><rect y="20" width="30" height="12" fill="#fff" opacity=".9"/><rect x="4" y="4" width="4" height="46" rx="2" fill="#fff" opacity=".3"/></g>
<circle cx="52" cy="58" r="20" fill="${tint}"/><path d="M44 58l6 6 10-12" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      break;
  }
  const title = name ? `<title>${name}</title>` : '';
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" class="food-art">${title}${body}</svg>`;
}
