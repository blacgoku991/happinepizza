/**
 * Accueil : pizza 3D (vraie photo détourée) qui s'incline et tourne au scroll,
 * braises animées, pile de pizzas de l'offre, parallaxe du four, soleil final,
 * statut « ouvert / fermé » à l'heure de Paris.
 */
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function hoursStatus() {
  const box = $('[data-hours]');
  if (!box) return;
  const schedule = JSON.parse(box.dataset.schedule || '[]') as Array<Array<[string, string]>>;
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const idx = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday'));
  const now = Number(get('hour')) * 60 + Number(get('minute'));
  const toM = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));
  const f = (s: string) => s.replace(':', 'h');
  $(`li[data-day="${idx}"]`, box)?.classList.add('today');
  const st = $('[data-status]', box);
  if (!st) return;
  const today = schedule[idx] ?? [];
  const open = today.find(([a, b]) => now >= toM(a) && now < toM(b));
  const next = today.find(([a]) => toM(a) > now);
  const label = st.lastElementChild!;
  if (open) label.textContent = `Ouvert · jusqu'à ${f(open[1])}`;
  else {
    st.classList.add('closed');
    label.textContent = next ? `Fermé · ouvre à ${f(next[0])}` : 'Fermé · à demain';
  }
}

export function initHome() {
  hoursStatus();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let vh = innerHeight;
  let vw = innerWidth;
  let lastW = vw;
  const setVH = () => {
    vh = innerHeight;
    vw = innerWidth;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setVH();

  const pz = $('[data-pz]');
  if (!pz) return;
  const tilt = $('[data-pz-tilt]')!;
  const spin = $('[data-pz-spin]')!;
  const glow = $('[data-pz-glow]')!;
  const shadow = $('[data-pz-shadow]')!;
  const rings = $('[data-pz-rings]')!;
  const tag = $('[data-pz-tag]')!;
  const content = $('[data-hero-content]')!;
  const trust = $('[data-trust]')!;
  const cue = $('[data-cue]');
  const cv = $<HTMLCanvasElement>('[data-sparks]')!;
  const ctx = cv.getContext('2d')!;
  const ov = $('[data-offer]');
  const stack = $('[data-stack]');
  const dws = stack ? $$('.dw', stack) : [];
  const cine = $('[data-cine]');
  const cineMedia = $('[data-cine-media]');
  const fin = $('[data-final]');
  const sun = $('[data-sun]');

  // légende ↔ points chauds
  $$('[data-legend] li').forEach((li) => {
    const h = $(`.hot[data-hot="${li.dataset.hot}"]`);
    li.addEventListener('mouseenter', () => h?.classList.add('hl'));
    li.addEventListener('mouseleave', () => h?.classList.remove('hl'));
  });

  // braises
  const dpr = Math.min(devicePixelRatio || 1, 1.75);
  const sizeCanvas = () => {
    cv.width = Math.round(innerWidth * dpr);
    cv.height = Math.round(vh * dpr);
  };
  sizeCanvas();
  addEventListener('resize', () => {
    if (Math.abs(innerWidth - lastW) > 40 || Math.abs(innerHeight - vh) > 160) {
      lastW = innerWidth;
      setVH();
      sizeCanvas();
    } else vw = innerWidth;
  });
  type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; s: number; ph: number };
  const parts: P[] = [];
  const spawn = (cx: number, cy: number, r: number, init: boolean): P => {
    const a = Math.random() * Math.PI * 2;
    const rr = r * (0.35 + Math.random() * 0.75);
    return {
      x: cx + Math.cos(a) * rr,
      y: cy + Math.abs(Math.sin(a)) * rr * 0.5 + (init ? -Math.random() * vh * 0.7 : 0),
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.25 + Math.random() * 0.9),
      life: 0,
      max: 160 + Math.random() * 260,
      s: 0.5 + Math.random() * 1.7,
      ph: Math.random() * 6.28,
    };
  };
  const N = vw < 760 ? 30 : 58;
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 64;
  {
    const g = sprite.getContext('2d')!;
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,236,200,1)');
    gr.addColorStop(0.12, 'rgba(255,180,90,.95)');
    gr.addColorStop(0.3, 'rgba(255,110,35,.45)');
    gr.addColorStop(1, 'rgba(255,70,10,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
  }

  const rz0 = [-30, 40, -8];
  const rzs = [70, -55, 140];
  let cur = scrollY;
  const t0 = performance.now();
  let last = t0;

  const frame = (now: number) => {
    const t = (now - t0) / 1000;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const target = scrollY;
    if (Math.abs(target - cur) > vh * 1.5) cur = target;
    else cur += (target - cur) * (1 - Math.exp(-dt * 10));
    if (Math.abs(target - cur) < 0.1) cur = target;
    const mobile = vw < 760;

    if (cur < vh * 2.2) {
      const p = clamp(cur / (vh * 0.82));
      const e = ease(p);
      const rx = lerp(mobile ? 60 : 56, mobile ? 14 : 9, e);
      const ry = Math.sin(p * Math.PI) * (mobile ? -6 : -11);
      const rz = -28 + e * 190 + (reduce ? 0 : t * 3.2);
      const tx = mobile ? lerp(0, -4, e) : lerp(0, -3.2, e);
      const ty = mobile ? lerp(0, -44, e) : lerp(0, -3.5, e);
      const sc = mobile ? lerp(1, 1.02, e) : lerp(1, 0.97, e);
      const bob = reduce ? 0 : Math.sin(t * 1.1) * 6 * (1 - e * 0.6);
      pz.style.transform = `translate3d(calc(-50% + ${tx}vw), calc(-50% + ${ty}vh + ${bob}px), 0) scale(${sc})`;
      tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      spin.style.transform = `rotateZ(${rz}deg)`;
      spin.style.setProperty('--rz', `${rz.toFixed(2)}deg`);
      spin.style.setProperty('--hot', smooth(0.52, 0.9, p).toFixed(3));
      rings.style.transform = `translateZ(-60px) rotateZ(${-rz * 0.25}deg) scale(${lerp(1, 0.92, e)})`;
      rings.style.opacity = String(lerp(1, 0.75, e));
      const cos = Math.cos((rx * Math.PI) / 180);
      const so = lerp(0.3, 0.07, e) + bob / 800;
      shadow.style.transform = `translate3d(${lerp(0, 3, e)}%, ${so * 100}%, 0) scale(${lerp(0.92, 1.02, e)}, ${Math.max(cos * 1.05, 0.45).toFixed(3)})`;
      shadow.style.opacity = String(lerp(0.95, 0.8, e));
      glow.style.opacity = (lerp(0.82, 1, e) + (reduce ? 0 : Math.sin(t * 2.3) * 0.04 + Math.sin(t * 5.1) * 0.025)).toFixed(3);
      glow.style.transform = `scale(${lerp(0.96, 1.08, e)}, ${lerp(0.78, 1.04, e)})`;
      tag.style.opacity = String(1 - smooth(0.05, 0.35, p));
      tag.style.transform = `translate3d(0, ${-p * 40}px, 0)`;
      const hp = clamp(cur / vh);
      content.style.transform = `translate3d(0, ${-hp * 90}px, 0)`;
      content.style.opacity = (1 - smooth(0.15, 0.6, hp)).toFixed(3);
      const to = (1 - smooth(0.3, 0.62, hp)).toFixed(3);
      trust.style.opacity = to;
      if (cue) cue.style.opacity = to;

      if (!reduce) {
        const r = pz.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const rad = r.width / 2;
        while (parts.length < N) parts.push(spawn(cx, cy, rad, true));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < parts.length; i++) {
          const q = parts[i];
          const f = dt * 60;
          q.life += f;
          q.x += (q.vx + Math.sin(t * 1.3 + q.ph) * 0.28) * f;
          q.y += q.vy * f;
          const k = q.life / q.max;
          const a = Math.sin(Math.PI * clamp(k)) * (0.55 + 0.45 * Math.sin(t * 9 + q.ph));
          if (k >= 1 || q.y < -20) {
            parts[i] = spawn(cx, cy, rad, false);
            continue;
          }
          const R = q.s * 6;
          ctx.globalAlpha = clamp(a);
          ctx.drawImage(sprite, q.x - R, q.y - R, R * 2, R * 2);
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
    }

    if (ov && stack) {
      const orr = ov.getBoundingClientRect();
      if (orr.bottom > -200 && orr.top < vh + 200) {
        const c = (orr.top + orr.height / 2 - vh / 2) / vh;
        const s = ease(clamp(0.55 - c * 1.05));
        const size = stack.offsetWidth;
        const gap = lerp(size * 0.17, size * 0.27, s);
        dws.forEach((w, i) => {
          const y = (1 - i) * gap - (i === 2 ? lerp(size * 0.02, size * 0.07, s) : 0) + (reduce ? 0 : Math.sin(t * 1.2 + i * 1.7) * 4);
          w.style.transform = `translate3d(0, ${y}px, ${i * 6}px)`;
          (w.firstElementChild as HTMLElement).style.transform = `rotateX(${lerp(66, 58, s)}deg) rotateY(${Math.sin(t * 0.7 + i) * 2}deg) rotateZ(${rz0[i] + s * rzs[i] + (reduce ? 0 : t * (i === 2 ? 6 : 2.5))}deg)`;
        });
      }
    }

    if (cine && cineMedia) {
      const cr = cine.getBoundingClientRect();
      if (cr.bottom > 0 && cr.top < vh) {
        const cc = (cr.top + cr.height / 2 - vh / 2) / vh;
        cineMedia.style.transform = `translate3d(0, ${cc * 9}%, 0) scale(${1.06 + Math.abs(cc) * 0.06})`;
      }
    }
    if (fin && sun) {
      const fr = fin.getBoundingClientRect();
      if (fr.top < vh * 1.3) {
        const fp = clamp(1 - fr.top / vh, 0, 1.4);
        sun.style.transform = `rotateZ(${fp * 70 + (reduce ? 0 : t * 2.5)}deg)`;
      }
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
