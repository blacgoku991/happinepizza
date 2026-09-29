/**
 * Pizza 3D procédurale (Three.js) — aucune image externe.
 * 8 parts indépendantes qui s'écartent au scroll, garnitures qui s'envolent,
 * ingrédients flottants autour et parallaxe à la souris.
 */
import {
  ACESFilmicToneMapping,
  CanvasTexture,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  RepeatWrapping,
  Scene,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface PizzaScene {
  setProgress(p: number): void;
  setPointer(x: number, y: number): void;
  dispose(): void;
}

const SLICES = 8;
const R = 2;
const TAU = Math.PI * 2;

/* ---------- Aléatoire déterministe ---------- */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20240701);
const rr = (a: number, b: number) => a + (b - a) * rand();

/* ---------- Textures générées sur canvas ---------- */
function makeCanvas(size: number) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return [c, c.getContext('2d')!] as const;
}

function cheeseTexture() {
  const S = 1024;
  const [c, ctx] = makeCanvas(S);
  const cx = S / 2;
  // sauce tomate
  const sauce = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx);
  sauce.addColorStop(0, '#d9401c');
  sauce.addColorStop(0.85, '#c7321a');
  sauce.addColorStop(1, '#a52512');
  ctx.fillStyle = sauce;
  ctx.fillRect(0, 0, S, S);
  // grain de sauce
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = `rgba(${rand() > 0.5 ? '120,20,8' : '240,90,40'},${rr(0.05, 0.2)})`;
    ctx.beginPath();
    ctx.arc(rr(0, S), rr(0, S), rr(1, 5), 0, TAU);
    ctx.fill();
  }
  // fromage fondu
  ctx.save();
  ctx.filter = 'blur(5px)';
  for (let i = 0; i < 120; i++) {
    const a = rr(0, TAU);
    const d = Math.sqrt(rand()) * cx * 0.86;
    const x = cx + Math.cos(a) * d;
    const y = cx + Math.sin(a) * d;
    const r = rr(40, 110);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, '#ffeeb0');
    g.addColorStop(0.55, '#ffd46a');
    g.addColorStop(1, 'rgba(255,205,100,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * rr(0.6, 1), rr(0, TAU), 0, TAU);
    ctx.fill();
  }
  ctx.restore();
  // taches gratinées
  for (let i = 0; i < 160; i++) {
    const a = rr(0, TAU);
    const d = Math.sqrt(rand()) * cx * 0.85;
    const x = cx + Math.cos(a) * d;
    const y = cx + Math.sin(a) * d;
    const r = rr(4, 18);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(176,96,24,0.55)');
    g.addColorStop(1, 'rgba(176,96,24,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }
  // origan
  for (let i = 0; i < 500; i++) {
    const a = rr(0, TAU);
    const d = Math.sqrt(rand()) * cx * 0.85;
    ctx.fillStyle = rand() > 0.5 ? '#3f6b24' : '#5b8a32';
    ctx.save();
    ctx.translate(cx + Math.cos(a) * d, cx + Math.sin(a) * d);
    ctx.rotate(rr(0, TAU));
    ctx.fillRect(-2, -1, rr(3, 6), rr(1.5, 3));
    ctx.restore();
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function doughTexture() {
  const S = 512;
  const [c, ctx] = makeCanvas(S);
  const g = ctx.createLinearGradient(0, 0, 0, S);
  g.addColorStop(0, '#f0b76a');
  g.addColorStop(0.5, '#e19a4a');
  g.addColorStop(1, '#f2c07a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 260; i++) {
    const x = rr(0, S);
    const y = rr(0, S);
    const r = rr(4, 26);
    const gg = ctx.createRadialGradient(x, y, 0, x, y, r);
    gg.addColorStop(0, `rgba(${rand() > 0.7 ? '90,40,10' : '150,80,25'},${rr(0.25, 0.6)})`);
    gg.addColorStop(1, 'rgba(150,80,25,0)');
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(255,236,200,${rr(0.1, 0.35)})`;
    ctx.fillRect(rr(0, S), rr(0, S), 2, 2);
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(4, 1);
  return t;
}

function pepperoniTexture() {
  const S = 256;
  const [c, ctx] = makeCanvas(S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, '#c92a1a');
  g.addColorStop(0.8, '#a51d12');
  g.addColorStop(1, '#6e120a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(255,200,180,${rr(0.25, 0.55)})`;
    ctx.beginPath();
    ctx.ellipse(rr(20, S - 20), rr(20, S - 20), rr(3, 8), rr(2, 6), rr(0, TAU), 0, TAU);
    ctx.fill();
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function shadowTexture() {
  const S = 256;
  const [c, ctx] = makeCanvas(S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(0,0,0,0.55)');
  g.addColorStop(0.55, 'rgba(0,0,0,0.25)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return new CanvasTexture(c);
}

/* ---------- Géométries de garnitures ---------- */
function leafShape() {
  const s = new Shape();
  s.moveTo(0, -0.26);
  s.bezierCurveTo(0.2, -0.14, 0.2, 0.14, 0, 0.3);
  s.bezierCurveTo(-0.2, 0.14, -0.2, -0.14, 0, -0.26);
  return s;
}
function mushroomShape() {
  const s = new Shape();
  s.moveTo(-0.2, 0.02);
  s.bezierCurveTo(-0.22, 0.24, 0.22, 0.24, 0.2, 0.02);
  s.lineTo(0.07, 0.02);
  s.lineTo(0.08, -0.18);
  s.quadraticCurveTo(0, -0.22, -0.08, -0.18);
  s.lineTo(-0.07, 0.02);
  s.closePath();
  return s;
}

type Kind = 'pepperoni' | 'basil' | 'olive' | 'mushroom' | 'tomato' | 'onion';

interface Topping {
  obj: Object3D;
  base: { y: number; rx: number; ry: number; rz: number };
  lift: number;
  spin: Vector2;
}

interface Slice {
  group: Group;
  dir: Vector2;
  toppings: Topping[];
  seed: number;
}

export function createPizzaScene(canvas: HTMLCanvasElement): PizzaScene | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 5.9, 8.3);
  camera.lookAt(0, 0, 0);

  const pmrem = new PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.55;

  const key = new DirectionalLight(new Color('#ffd7a3'), 2.6);
  key.position.set(3.5, 7, 4);
  scene.add(key);
  const rim = new DirectionalLight(new Color('#ff5a2a'), 2.2);
  rim.position.set(-5, 2.5, -4);
  scene.add(rim);
  const fill = new DirectionalLight(new Color('#ffb42e'), 0.6);
  fill.position.set(-4, 3, 5);
  scene.add(fill);
  scene.add(new HemisphereLight(0xfff1dc, 0x2a130a, 0.7));

  /* matériaux */
  const disposables: Array<Material | BufferGeometry | CanvasTexture> = [];
  const keep = <T extends Material | BufferGeometry | CanvasTexture>(x: T) => (disposables.push(x), x);

  const tCheese = keep(cheeseTexture());
  const tDough = keep(doughTexture());
  const tPep = keep(pepperoniTexture());
  const tShadow = keep(shadowTexture());

  const mDough = keep(new MeshStandardMaterial({ map: tDough, roughness: 0.82, bumpMap: tDough, bumpScale: 2.2 }));
  const mDoughSide = keep(new MeshStandardMaterial({ color: '#e6ad66', roughness: 0.9 }));
  const mCheese = keep(
    new MeshPhysicalMaterial({ map: tCheese, bumpMap: tCheese, bumpScale: 3, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.5, sheen: 0.4, sheenColor: new Color('#ffe7a3') }),
  );
  const mPep = keep(new MeshPhysicalMaterial({ map: tPep, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.3 }));
  const mBasil = keep(new MeshPhysicalMaterial({ color: '#2f8f3a', roughness: 0.45, side: DoubleSide, clearcoat: 0.5 }));
  const mOlive = keep(new MeshPhysicalMaterial({ color: '#1a1512', roughness: 0.2, clearcoat: 1 }));
  const mMush = keep(new MeshStandardMaterial({ color: '#efe2c9', roughness: 0.7, side: DoubleSide }));
  const mTomato = keep(new MeshPhysicalMaterial({ color: '#e0301b', roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.1 }));
  const mTomatoIn = keep(new MeshStandardMaterial({ color: '#ff6a4a', roughness: 0.5, side: DoubleSide }));
  const mOnion = keep(new MeshPhysicalMaterial({ color: '#b04a8c', roughness: 0.3, transmission: 0.2, clearcoat: 0.6 }));

  /* géométries partagées */
  const gPep = keep(new CylinderGeometry(0.21, 0.21, 0.045, 28));
  const gLeaf = keep(new ShapeGeometry(leafShape(), 12));
  const gOlive = keep(new TorusGeometry(0.075, 0.045, 10, 20));
  const gMush = keep(new ShapeGeometry(mushroomShape(), 10));
  const gTomato = keep(new SphereGeometry(0.13, 20, 12, 0, TAU, 0, Math.PI / 2));
  const gTomatoCap = keep(new CircleGeometry(0.13, 20));
  const gOnion = keep(new TorusGeometry(0.16, 0.022, 8, 28));
  const gCap = keep(new SphereGeometry(0.17, 16, 12));
  const gCut = keep(new PlaneGeometry(R * 0.98, 0.22));
  const mCut = keep(new MeshStandardMaterial({ color: '#efc27f', roughness: 0.95, side: DoubleSide }));

  function makeTopping(kind: Kind): Object3D {
    switch (kind) {
      case 'pepperoni':
        return new Mesh(gPep, mPep);
      case 'basil': {
        const m = new Mesh(gLeaf, mBasil);
        m.rotation.x = -Math.PI / 2;
        const g = new Group();
        g.add(m);
        return g;
      }
      case 'olive': {
        const m = new Mesh(gOlive, mOlive);
        m.rotation.x = Math.PI / 2;
        const g = new Group();
        g.add(m);
        return g;
      }
      case 'mushroom': {
        const m = new Mesh(gMush, mMush);
        m.rotation.x = -Math.PI / 2;
        const g = new Group();
        g.add(m);
        return g;
      }
      case 'tomato': {
        const g = new Group();
        const dome = new Mesh(gTomato, mTomato);
        const cap = new Mesh(gTomatoCap, mTomatoIn);
        cap.rotation.x = -Math.PI / 2;
        g.add(dome, cap);
        g.rotation.x = Math.PI; // face coupée vers le haut
        const wrap = new Group();
        wrap.add(g);
        g.position.y = 0.02;
        return wrap;
      }
      case 'onion': {
        const m = new Mesh(gOnion, mOnion);
        m.rotation.x = Math.PI / 2;
        const g = new Group();
        g.add(m);
        return g;
      }
    }
  }

  /* ---------- Construction de la pizza ---------- */
  const root = new Group(); // tilt + parallaxe
  const pizza = new Group(); // rotation continue
  root.add(pizza);
  scene.add(root);

  const slices: Slice[] = [];
  const thetaLen = TAU / SLICES;
  const recipe: Kind[] = ['pepperoni', 'pepperoni', 'basil', 'olive', 'mushroom', 'tomato', 'onion', 'pepperoni'];

  for (let i = 0; i < SLICES; i++) {
    const thetaStart = i * thetaLen;
    const mid = thetaStart + thetaLen / 2;
    const group = new Group();

    const gDough = keep(new CylinderGeometry(R, R * 0.98, 0.14, 16, 1, false, thetaStart, thetaLen));
    const dough = new Mesh(gDough, [mDoughSide, mDough, mDoughSide]);
    dough.position.y = 0;
    group.add(dough);

    const gTop = keep(new CylinderGeometry(R * 0.9, R * 0.9, 0.05, 16, 1, false, thetaStart, thetaLen));
    const top = new Mesh(gTop, [mCheese, mCheese, mCheese]);
    top.position.y = 0.09;
    group.add(top);

    const gCrust = keep(new TorusGeometry(R * 0.93, 0.19, 14, 18, thetaLen));
    gCrust.rotateX(Math.PI / 2);
    gCrust.rotateY(thetaStart + thetaLen - Math.PI / 2);
    const crust = new Mesh(gCrust, mDough);
    crust.position.y = 0.08;
    group.add(crust);
    // faces de coupe (pâte + sauce) visibles quand les parts s'écartent
    for (const a of [thetaStart, thetaStart + thetaLen]) {
      const face = new Mesh(gCut, mCut);
      face.position.set((Math.sin(a) * R) / 2, 0.04, (Math.cos(a) * R) / 2);
      face.rotation.y = a - Math.PI / 2;
      group.add(face);
    }
    // bouts de croûte arrondis (visibles quand les parts s'écartent)
    for (const a of [thetaStart, thetaStart + thetaLen]) {
      const cap = new Mesh(gCap, mDough);
      cap.scale.set(1.05, 1, 1.05);
      cap.position.set(Math.sin(a) * R * 0.93, 0.08, Math.cos(a) * R * 0.93);
      group.add(cap);
    }

    // garnitures : placement par rejet dans le secteur
    const toppings: Topping[] = [];
    const count = 7;
    const placed: Vector2[] = [];
    let guard = 0;
    while (placed.length < count && guard++ < 400) {
      const d = Math.sqrt(rr(0.03, 1)) * R * 0.74;
      const a = thetaStart + rr(0.12, thetaLen - 0.12);
      const p = new Vector2(Math.sin(a) * d, Math.cos(a) * d);
      if (d < 0.25) continue;
      if (placed.some((q) => q.distanceTo(p) < 0.4)) continue;
      placed.push(p);
      const kind = recipe[(i * 3 + placed.length) % recipe.length];
      const obj = makeTopping(kind);
      const y = kind === 'pepperoni' ? 0.135 : 0.13;
      obj.position.set(p.x, y, p.y);
      const ry = rr(0, TAU);
      obj.rotation.set(rr(-0.06, 0.06), ry, rr(-0.06, 0.06));
      const s = kind === 'basil' ? rr(0.9, 1.25) : rr(0.85, 1.1);
      obj.scale.setScalar(s);
      group.add(obj);
      toppings.push({
        obj,
        base: { y, rx: obj.rotation.x, ry, rz: obj.rotation.z },
        lift: rr(0.6, 1.9),
        spin: new Vector2(rr(-2.4, 2.4), rr(-2.4, 2.4)),
      });
    }

    pizza.add(group);
    slices.push({ group, dir: new Vector2(Math.sin(mid), Math.cos(mid)), toppings, seed: rand() });
  }

  /* ombre portée douce */
  const mShadow = keep(new MeshBasicMaterial({ map: tShadow, transparent: true, depthWrite: false }));
  const gShadow = keep(new PlaneGeometry(1, 1));
  const shadow = new Mesh(gShadow, mShadow);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.55;
  shadow.scale.setScalar(R * 2.9);
  root.add(shadow);

  /* ingrédients flottants autour (positions choisies pour ne pas masquer le texte) */
  const floaters: Array<{ obj: Object3D; base: { x: number; y: number; z: number }; speed: number; phase: number; rot: Vector2 }> = [];
  const floatSpots: Array<[Kind, number, number, number, number]> = [
    ['basil', -2.3, 1.5, -2.2, 1.5],
    ['tomato', 3.2, 1.2, -1.4, 1.4],
    ['pepperoni', 3.6, -0.5, 0.6, 1.3],
    ['olive', -2.7, -0.7, -0.8, 1.6],
    ['mushroom', 1.1, 2.1, -2.8, 1.5],
    ['basil', 2.5, 2.2, -1, 1.3],
    ['onion', -1.5, 2.3, -2.6, 1.4],
    ['basil', 4.1, 0.9, -2.6, 1.6],
    ['tomato', 0.6, -1.3, 2.4, 1.1],
  ];
  for (const [kind, x, y, z, sc] of floatSpots) {
    const obj = makeTopping(kind);
    const base = { x, y, z };
    obj.position.set(x, y, z);
    obj.scale.setScalar(sc);
    obj.rotation.set(rr(0, TAU), rr(0, TAU), rr(0, TAU));
    scene.add(obj);
    floaters.push({ obj, base, speed: rr(0.4, 0.9), phase: rr(0, TAU), rot: new Vector2(rr(-0.4, 0.4), rr(-0.4, 0.4)) });
  }

  /* ---------- Taille / rendu ---------- */
  function resize() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // sur mobile (portrait) on recule la caméra pour garder la pizza entière
    const portrait = w / h < 0.9;
    camera.fov = portrait ? 44 : 32;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  let progress = 0;
  let smoothProgress = 0;
  const pointer = new Vector2();
  const smoothPointer = new Vector2();
  let visible = true;
  let raf = 0;
  let last = performance.now();
  let elapsed = 0;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) loop();
  });
  io.observe(canvas);

  function update(dt: number) {
    elapsed += dt;
    smoothProgress = MathUtils.damp(smoothProgress, progress, 6, dt);
    smoothPointer.x = MathUtils.damp(smoothPointer.x, pointer.x, 4, dt);
    smoothPointer.y = MathUtils.damp(smoothPointer.y, pointer.y, 4, dt);

    const p = smoothProgress;
    const ex = MathUtils.smoothstep(p, 0.05, 0.75); // écartement
    const lift = MathUtils.smoothstep(p, 0.1, 0.9);

    pizza.rotation.y += dt * (reduce ? 0 : 0.18 + p * 0.5);
    root.rotation.x = MathUtils.lerp(0.02, 0.55, lift) + smoothPointer.y * 0.12;
    root.rotation.z = smoothPointer.x * -0.1;
    root.position.y = Math.sin(elapsed * 1.2) * 0.06 + lift * 0.3;
    root.position.x = smoothPointer.x * 0.2;

    for (const s of slices) {
      const d = ex * (0.55 + s.seed * 0.35);
      s.group.position.set(s.dir.x * d, Math.sin(s.seed * 10) * ex * 0.25, s.dir.y * d);
      s.group.rotation.x = s.dir.y * ex * 0.14;
      s.group.rotation.z = -s.dir.x * ex * 0.14;
      for (const t of s.toppings) {
        t.obj.position.y = t.base.y + lift * t.lift;
        t.obj.rotation.x = t.base.rx + lift * t.spin.x;
        t.obj.rotation.z = t.base.rz + lift * t.spin.y;
      }
    }

    shadow.scale.setScalar(R * (2.9 + ex * 1.2));
    mShadow.opacity = 1 - lift * 0.45;

    for (const f of floaters) {
      const t = elapsed * f.speed + f.phase;
      f.obj.position.set(
        f.base.x + Math.sin(t * 0.7) * 0.15 + smoothPointer.x * 0.35,
        f.base.y + Math.sin(t) * 0.25 + p * 1.2,
        f.base.z + smoothPointer.y * 0.2,
      );
      f.obj.rotation.x += dt * f.rot.x;
      f.obj.rotation.y += dt * f.rot.y;
    }
  }

  function loop() {
    raf = 0;
    if (!visible || document.hidden) return;
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    update(dt);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }

  const onVis = () => {
    if (!document.hidden && !raf) {
      last = performance.now();
      loop();
    }
  };
  document.addEventListener('visibilitychange', onVis);

  // premier rendu immédiat
  update(0.016);
  renderer.render(scene, camera);
  loop();

  return {
    setProgress(p) {
      progress = MathUtils.clamp(p, 0, 1);
    },
    setPointer(x, y) {
      pointer.set(x, y);
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      disposables.forEach((d) => d.dispose());
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
