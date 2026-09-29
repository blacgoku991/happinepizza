// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://happinesspizza.fr',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (path === '/') item.priority = 1.0;
        else if (path.startsWith('/carte/')) item.priority = 0.9;
        else if (path.startsWith('/pizzas/')) item.priority = 0.8;
        else if (path.startsWith('/mentions')) item.priority = 0.2;
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],
  // Redirections des anciennes URL WordPress/WooCommerce (préserve le référencement)
  redirects: {
    '/home': '/',
    '/happiness-pizza': '/a-propos/',
    '/contacts-2': '/contact/',
    '/categorie-produit/pizzas-junior': '/carte/pizzas/',
    '/categorie-produit/pizzas-senior': '/carte/pizzas/',
    '/categorie-produit/pizzas-mega': '/carte/pizzas/',
    '/categorie-produit/pates': '/carte/pates/',
    '/categorie-produit/salades': '/carte/salades/',
    '/categorie-produit/paninis': '/carte/paninis/',
    '/categorie-produit/desserts': '/carte/desserts/',
    '/categorie-produit/boissons': '/carte/boissons/',
    '/categorie-produit/offres': '/carte/menus/',
    '/produit/menu-familiale': '/carte/menus/',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
