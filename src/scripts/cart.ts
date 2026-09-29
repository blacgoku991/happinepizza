/**
 * Panier côté navigateur (localStorage).
 * - Boutons [data-add] : data-id, data-name, data-price, data-size-label?, data-offer="1" si éligible à l'offre.
 * - Offre « 2 achetées = 3e offerte » : sur les articles éligibles, la moins chère de chaque groupe de 3 est offerte.
 */

interface Line {
  id: string;
  name: string;
  sizeLabel?: string;
  price: number;
  qty: number;
  offer: boolean;
}

const KEY = 'hp-cart-v1';
const MODE_KEY = 'hp-cart-mode';
const MIN_ORDER = 15;

const fmt = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

function load(): Line[] {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? (JSON.parse(raw) as Line[]) : [];
    return Array.isArray(data) ? data.filter((l) => l && typeof l.price === 'number' && l.qty > 0) : [];
  } catch {
    return [];
  }
}
function save(lines: Line[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* navigation privée : on garde en mémoire */
  }
}

/** Calcule la remise et, pour chaque ligne, le nombre d'unités offertes. */
export function computeOffer(lines: Line[]) {
  const units: Array<{ id: string; price: number }> = [];
  for (const l of lines) if (l.offer) for (let i = 0; i < l.qty; i++) units.push({ id: l.id, price: l.price });
  units.sort((a, b) => b.price - a.price);
  const free = new Map<string, number>();
  let discount = 0;
  for (let i = 2; i < units.length; i += 3) {
    discount += units[i].price;
    free.set(units[i].id, (free.get(units[i].id) ?? 0) + 1);
  }
  return { discount, free };
}

let lines: Line[] = [];
let lastFocus: HTMLElement | null = null;

export function initCart() {
  const root = document.querySelector<HTMLElement>('[data-cart]');
  if (!root) return;
  const panel = root.querySelector<HTMLElement>('.cart__panel')!;
  const list = root.querySelector<HTMLUListElement>('[data-cart-list]')!;
  const empty = root.querySelector<HTMLElement>('[data-cart-empty]')!;
  const foot = root.querySelector<HTMLElement>('[data-cart-foot]')!;
  const subtotalEl = root.querySelector<HTMLElement>('[data-cart-subtotal]')!;
  const discountEl = root.querySelector<HTMLElement>('[data-cart-discount]')!;
  const discountRow = root.querySelector<HTMLElement>('[data-cart-discount-row]')!;
  const totalEl = root.querySelector<HTMLElement>('[data-cart-total]')!;
  const minEl = root.querySelector<HTMLElement>('[data-cart-min]')!;
  const copyBtn = root.querySelector<HTMLButtonElement>('[data-cart-copy]')!;
  const toast = document.querySelector<HTMLElement>('[data-toast]');
  const modeInputs = root.querySelectorAll<HTMLInputElement>('input[name="cart-mode"]');

  try {
    const m = localStorage.getItem(MODE_KEY);
    if (m) modeInputs.forEach((i) => (i.checked = i.value === m));
  } catch {
    /* ignore */
  }
  const mode = () => [...modeInputs].find((i) => i.checked)?.value ?? 'livraison';
  modeInputs.forEach((i) =>
    i.addEventListener('change', () => {
      try {
        localStorage.setItem(MODE_KEY, mode());
      } catch {
        /* ignore */
      }
      render();
    }),
  );

  lines = load();

  function totals() {
    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const { discount, free } = computeOffer(lines);
    return { subtotal, discount, total: subtotal - discount, free };
  }

  function summaryText() {
    const { subtotal, discount, total } = totals();
    const rows = lines.map((l) => `• ${l.qty} × ${l.name}${l.sizeLabel ? ` (${l.sizeLabel})` : ''} — ${fmt(l.price * l.qty)}`);
    return [
      `Commande Happiness Pizza (${mode() === 'livraison' ? 'livraison' : 'à emporter'})`,
      ...rows,
      `Sous-total : ${fmt(subtotal)}`,
      discount > 0 ? `Offre 3e pizza offerte : −${fmt(discount)}` : '',
      `Total : ${fmt(total)}`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  function render() {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((el) => {
      el.textContent = String(count);
      el.classList.toggle('has-items', count > 0);
    });
    empty.hidden = lines.length > 0;
    foot.hidden = lines.length === 0;
    const { subtotal, discount, total, free } = totals();
    list.innerHTML = '';
    for (const l of lines) {
      const li = document.createElement('li');
      const freeN = free.get(l.id) ?? 0;
      li.innerHTML = `
        <div class="ci-name"></div>
        <div class="ci-price">${fmt(l.price * l.qty)}${freeN ? `<span class="ci-free">${freeN} offerte${freeN > 1 ? 's' : ''}</span>` : ''}</div>
        <div class="ci-qty">
          <button type="button" data-dec aria-label="Retirer un">−</button>
          <span>${l.qty}</span>
          <button type="button" data-inc aria-label="Ajouter un">+</button>
        </div>
        <button type="button" class="ci-remove" data-remove>Supprimer</button>`;
      const nameEl = li.querySelector('.ci-name')!;
      nameEl.textContent = l.name;
      if (l.sizeLabel) {
        const s = document.createElement('span');
        s.className = 'ci-size';
        s.textContent = `Taille ${l.sizeLabel} · ${fmt(l.price)}`;
        nameEl.appendChild(s);
      }
      li.querySelector('[data-dec]')!.addEventListener('click', () => update(l.id, -1));
      li.querySelector('[data-inc]')!.addEventListener('click', () => update(l.id, +1));
      li.querySelector('[data-remove]')!.addEventListener('click', () => update(l.id, -l.qty));
      list.appendChild(li);
    }
    const fab = document.querySelector<HTMLElement>('[data-cart-fab]');
    if (fab) {
      fab.classList.toggle('is-visible', count > 0 && !root!.classList.contains('is-open'));
      const ft = fab.querySelector('[data-cart-fab-total]');
      if (ft) ft.textContent = fmt(total);
    }
    subtotalEl.textContent = fmt(subtotal);
    discountRow.hidden = discount <= 0;
    discountEl.textContent = `−${fmt(discount)}`;
    totalEl.textContent = fmt(total);
    minEl.hidden = !(mode() === 'livraison' && total < MIN_ORDER && lines.length > 0);
  }

  function update(id: string, delta: number) {
    const l = lines.find((x) => x.id === id);
    if (!l) return;
    l.qty += delta;
    lines = lines.filter((x) => x.qty > 0);
    save(lines);
    render();
  }

  function showToast(msg: string) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout((toast as any)._t);
    (toast as any)._t = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  }

  function add(btn: HTMLElement) {
    const d = btn.dataset;
    const price = Number(d.price);
    if (!d.id || !d.name || !Number.isFinite(price)) return;
    const existing = lines.find((l) => l.id === d.id);
    if (existing) existing.qty++;
    else lines.push({ id: d.id, name: d.name, sizeLabel: d.sizeLabel || undefined, price, qty: 1, offer: d.offer === '1' });
    save(lines);
    render();
    showToast(`✓ Ajouté au panier : ${d.name}${d.sizeLabel ? ` ${d.sizeLabel}` : ''}`);
    document.querySelectorAll('.cart-btn').forEach((b) => {
      b.classList.remove('bump');
      void (b as HTMLElement).offsetWidth;
      b.classList.add('bump');
    });
    btn.classList.add('is-added');
    setTimeout(() => btn.classList.remove('is-added'), 900);
  }

  function open() {
    lastFocus = document.activeElement as HTMLElement;
    root!.hidden = false;
    requestAnimationFrame(() => {
      root!.classList.add('is-open');
      panel.focus();
    });
    document.documentElement.style.overflow = 'hidden';
    window.dispatchEvent(new CustomEvent('hp:lock'));
    document.querySelector('[data-cart-fab]')?.classList.remove('is-visible');
  }
  function close() {
    root!.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    window.dispatchEvent(new CustomEvent('hp:unlock'));
    setTimeout(() => {
      if (!root!.classList.contains('is-open')) root!.hidden = true;
    }, 550);
    lastFocus?.focus();
    render();
  }

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const addBtn = t.closest<HTMLElement>('[data-add]');
    if (addBtn) {
      e.preventDefault();
      add(addBtn);
      return;
    }
    if (t.closest('[data-cart-open]')) {
      e.preventDefault();
      open();
      return;
    }
    if (t.closest('[data-cart-close]')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('is-open')) close();
    if (e.key === 'Tab' && root.classList.contains('is-open')) {
      const f = [...panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input')].filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summaryText());
      showToast('Récapitulatif copié ✓');
    } catch {
      showToast('Copie impossible sur ce navigateur');
    }
  });

  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      lines = load();
      render();
    }
  });

  render();
}
