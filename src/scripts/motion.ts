/**
 * Animations globales : défilement fluide (Lenis), apparition des éléments .rv au scroll,
 * inclinaison 3D des cartes au survol.
 */
import Lenis from 'lenis';

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

export let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
  const raf = (t: number) => {
    lenis!.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  addEventListener('hp:lock', () => lenis?.stop());
  addEventListener('hp:unlock', () => lenis?.start());
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || url.hash.length < 2) return;
    const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    lenis!.scrollTo(el, { offset: -90, duration: 1.3 });
  });
}

/* Apparitions */
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }
  },
  { rootMargin: '0px 0px -6% 0px' },
);
document.querySelectorAll('.rv').forEach((el) => io.observe(el));
root.classList.add('motion-ready');

/* Inclinaison 3D des cartes */
if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((c) => {
    c.addEventListener('pointermove', (ev) => {
      const r = c.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      c.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
      c.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
    });
    c.addEventListener('pointerleave', () => {
      c.style.setProperty('--ry', '0deg');
      c.style.setProperty('--rx', '0deg');
    });
  });
}
