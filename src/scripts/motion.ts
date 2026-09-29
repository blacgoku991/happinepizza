/**
 * Animations globales : défilement fluide (Lenis), apparitions au scroll (GSAP),
 * titres découpés mot à mot, parallaxe, cartes 3D "tilt", boutons magnétiques.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export { gsap, ScrollTrigger };
export let lenis: Lenis | null = null;

/* ---------- Défilement fluide ---------- */
if (!reduce) {
  lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 0.95 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.addEventListener('hp:lock', () => lenis?.stop());
  window.addEventListener('hp:unlock', () => lenis?.start());

  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash.length < 2) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    lenis!.scrollTo(target, { offset: -90, duration: 1.4 });
    history.replaceState(null, '', url.hash);
  });
}

/* ---------- Découpage des titres ---------- */
function splitWords(el: Element) {
  const walk = (node: Node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        for (const part of parts) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '));
            continue;
          }
          const w = document.createElement('span');
          w.className = 'w';
          const inner = document.createElement('span');
          inner.textContent = part;
          w.appendChild(inner);
          frag.appendChild(w);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR' && !(child as Element).classList.contains('w')) {
        walk(child);
      }
    }
  };
  walk(el);
}

function initMotion() {
  if (reduce) {
    root.classList.remove('js-motion');
    return;
  }

  /* Titres mot à mot */
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', el.textContent?.replace(/\s+/g, ' ').trim() ?? '');
    splitWords(el);
    el.querySelectorAll('.w').forEach((w) => w.setAttribute('aria-hidden', 'true'));
    const words = el.querySelectorAll('.w > span');
    const immediate = el.hasAttribute('data-split-now');
    gsap.to(words, {
      y: 0,
      rotateX: 0,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.055,
      delay: immediate ? Number(el.dataset.delay ?? 0.15) : 0,
      scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 88%', once: true },
    });
  });

  /* Apparitions */
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) =>
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        delay: (_i: number, el: HTMLElement) => Number(el.dataset.delay ?? 0),
        overwrite: true,
      }),
  });

  /* Parallaxe */
  document.querySelectorAll<HTMLElement>('[data-speed]').forEach((el) => {
    const speed = Number(el.dataset.speed);
    gsap.fromTo(
      el,
      { yPercent: speed * 30 },
      {
        yPercent: speed * -30,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  /* Rotation liée au scroll */
  document.querySelectorAll<HTMLElement>('[data-rotate]').forEach((el) => {
    gsap.to(el, {
      rotate: Number(el.dataset.rotate || 180),
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  /* Compteurs */
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end,
      duration: 2,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = Math.round(obj.v).toString()),
    });
  });

  /* Défilement horizontal épinglé (desktop) */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    document.querySelectorAll<HTMLElement>('[data-hscroll]').forEach((section) => {
      const track = section.querySelector<HTMLElement>('[data-hscroll-track]');
      if (!track) return;
      const dist = () => track.scrollWidth - window.innerWidth + 80;
      gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${dist()}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      track.querySelectorAll<HTMLElement>('[data-spin]').forEach((art) => {
        gsap.to(art, {
          rotate: 200,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${dist()}`, scrub: true },
        });
      });
    });
  });

  root.classList.add('motion-ready');
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------- Interactions pointeur ---------- */
function initPointer() {
  if (!finePointer || reduce) return;

  document.querySelectorAll<HTMLElement>('.tilt').forEach((card) => {
    const max = Number(card.dataset.tiltMax ?? 10);
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', `${(x - 0.5) * max * 2}deg`);
      card.style.setProperty('--rx', `${(0.5 - y) * max * 2}deg`);
      card.style.setProperty('--gx', `${x * 100}%`);
      card.style.setProperty('--gy', `${y * 100}%`);
      card.classList.add('is-tilting');
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = 0.3;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * strength,
        y: (e.clientY - r.top - r.height / 2) * strength,
        duration: 0.5,
        ease: 'power3.out',
      });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' }));
  });

  document.addEventListener('pointermove', (e) => {
    const btn = (e.target as HTMLElement).closest?.<HTMLElement>('.btn');
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--mx', `${e.clientX - r.left}px`);
    btn.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
}

initMotion();
initPointer();
