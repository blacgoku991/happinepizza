/**
 * Accès aux photos du site (src/assets/photos/*.jpg) et aux détourages
 * (src/assets/cutouts/*.png). Astro les optimise au build (AVIF/WebP, tailles multiples).
 */
import type { ImageMetadata } from 'astro';
import type { Pizza } from '../data/menu';

const PHOTOS = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });
const CUTOUTS = import.meta.glob<{ default: ImageMetadata }>('../assets/cutouts/*.png', { eager: true });

export function photo(key: string | undefined): ImageMetadata | undefined {
  if (!key) return undefined;
  return PHOTOS[`../assets/photos/${key}.jpg`]?.default;
}

export function cutout(key: string): ImageMetadata | undefined {
  return CUTOUTS[`../assets/cutouts/${key}.png`]?.default;
}

export function pizzaPhoto(p: Pick<Pizza, 'slug' | 'photo'>): ImageMetadata | undefined {
  return photo(p.photo ?? `pizza-${p.slug}`);
}

/** Chemin de l'image Open Graph d'une pizza (générée par scripts/generate-assets.mjs). */
export const ogPizza = (slug: string) => `/og/pizza-${slug}.jpg`;
