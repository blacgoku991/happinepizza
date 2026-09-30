# Happiness Pizza — nouveau site

Site vitrine et carte en ligne de **Happiness Pizza**, pizzeria artisanale au 37 avenue du Général de Gaulle, 77610 Fontenay-Trésigny.

- **Design « Ember Luxe »** : mode sombre premium (noir chaud, lueur de braise orange, accents dorés), typographies Syne + Instrument Serif + Manrope, nouveau logo (arche de four à bois et flamme).
- **Vraies photos** retouchées : recadrage, étalonnage chaud et sombre, vignettage, détourage circulaire des pizzas vues de dessus.
- **3D au scroll** : dans l'en-tête de l'accueil, une vraie pizza détourée, avec son épaisseur et son ombre, s'incline et tourne au défilement, entourée de braises animées. On retrouve aussi une pile de 3 pizzas pour l'offre, une parallaxe sur le four à bois et une pizza « soleil » dans l'appel final.
- **Carte complète** avec photo pour chaque pizza, pâte et dessert.
- **Panier** : sélecteur Junior / Senior / Méga, offre « 2 achetées = 3e offerte » calculée automatiquement, livraison ou à emporter, récapitulatif à copier. La commande se finalise par téléphone.
- **SEO** : voir la section dédiée plus bas.

## Démarrer

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # génère le site statique dans dist/
npm run preview   # prévisualise dist/
```

Node.js 22.12 ou plus récent est requis.

## Photos

Les photos sont dans `src/assets/photos` (produits et ambiances) et `src/assets/cutouts` (pizzas détourées). Astro génère automatiquement les versions AVIF/WebP adaptées à chaque écran.

**Les photos actuelles sont provisoires.** Elles proviennent de la banque d'images libre du projet open source Foodish (github.com/surhud004/Foodish), dont les droits d'usage commercial ne sont pas garantis. **Remplacez-les par vos propres photos** avant la mise en ligne : c'est plus sûr juridiquement, et vos clients verront vos vraies pizzas.

Pour les remplacer :
- soit déposez vos fichiers dans `src/assets/photos` en gardant les mêmes noms (par exemple `pizza-reine.jpg`) ;
- soit adaptez la table de `scripts/prepare-photos.mjs`, puis lancez `node scripts/prepare-photos.mjs <dossier-de-vos-photos>` : le script recadre, étalonne et détoure automatiquement.

## Modifier le contenu

| Quoi | Fichier |
|---|---|
| Téléphone, adresse, horaires, zones de livraison, offre, réseaux sociaux, mentions légales | `src/data/site.ts` |
| Pizzas, menus, pâtes, salades, paninis, desserts, boissons (noms, ingrédients, prix) | `src/data/menu.ts` |
| Questions fréquentes | `src/data/faq.ts` |

Toutes les pages, le panier, le sitemap et les données structurées se mettent à jour automatiquement.

**Ajouter une pizza** : copiez un bloc dans `PIZZAS` (`src/data/menu.ts`), changez le `slug`, le nom, la base, les ingrédients et les prix. Sa page `/pizzas/<slug>/` et son illustration sont créées toutes seules. Lancez ensuite `npm run assets` pour générer son image de partage (réseaux sociaux).

`npm run assets` régénère le favicon, les icônes et les images Open Graph (1200×630) dans `public/`. Il utilise Playwright/Chromium ; si Chromium manque, lancez `npx playwright install chromium`.

## Mettre en ligne

Le site est 100 % statique : il suffit d'envoyer le contenu du dossier `dist/`.

- **Hébergement classique** (OVH, o2switch, Hostinger… Apache) : `npm run build`, puis envoyez **tout le contenu** de `dist/` à la racine du site (FTP). N'oubliez pas le fichier caché `.htaccess` : il gère le HTTPS, les redirections 301 des anciennes URL WordPress, le cache et les en-têtes de sécurité.
- **Netlify / Cloudflare Pages** : commande `npm run build`, dossier `dist`. Les fichiers `_redirects` et `_headers` sont pris en compte automatiquement.
- **Vercel** : import du dépôt ; `vercel.json` contient les redirections.

Les anciennes URL (`/categorie-produit/...`, `/produit/pizza-...`, `/happiness-pizza/`, `/contacts-2/`, `/home/`) sont redirigées en 301 vers les nouvelles pages, pour conserver le référencement acquis.

## SEO intégré

- Une URL propre et un contenu unique pour chaque pizza (`/pizzas/chevre-miel/`…) et chaque catégorie (`/carte/pizzas/`, `/carte/desserts/`…).
- Titres et meta descriptions optimisés et sans troncature (≤ 60 et ≤ 158 caractères), un seul H1 par page, fil d'Ariane.
- Données structurées JSON-LD :
  - `Restaurant` (adresse, coordonnées GPS, horaires, zone desservie, moyens de paiement) ;
  - `Menu`, `MenuSection` et `MenuItem` avec les prix ;
  - `BreadcrumbList`, `FAQPage` et `WebSite`.
- `sitemap-index.xml`, `robots.txt`, balises canonical, Open Graph et Twitter Cards avec une image dédiée par pizza, balises géographiques (SEO local).
- Performance :
  - HTML statique, polices auto-hébergées et préchargées ;
  - 3D chargée seulement après l'affichage du texte, et mise en pause hors écran ;
  - aucun cookie ni traceur.
- Accessibilité : lien d'évitement, navigation au clavier, panier accessible (focus piégé, Échap), contrastes élevés, respect de `prefers-reduced-motion`.

### Après la mise en ligne (fortement recommandé)

1. **Google Search Console** : ajoutez le domaine et soumettez `https://happinesspizza.fr/sitemap-index.xml`.
2. **Fiche Google Business Profile** : c'est le levier n° 1 pour une pizzeria locale. Vérifiez que l'adresse, le téléphone et les horaires sont **identiques** au site, ajoutez le lien du site et des photos, et demandez des avis à vos clients.
3. Mettez à jour l'adresse du site sur PagesJaunes, Mappy, l'annuaire de la mairie, Uber Eats et Deliveroo si vous y êtes.

## Informations à confirmer par la pizzeria

L'ancien site contenait des textes hérités d'un modèle d'une autre pizzeria (mentions de « Metz » et d'une adresse à Vitry-sur-Seine). Les informations du nouveau site viennent des registres officiels, de PagesJaunes et de l'ancien site. À vérifier avant publication :

- [ ] **Carte des pizzas** : 15 pizzas ont été récupérées sur l'ancien site, qui en annonce 27. Il manque notamment la Margherita et celles des pages 2 et 3. Ajoutez-les dans `src/data/menu.ts`.
- [ ] **Prix déduits** : Junior et Méga de la Reine, de la Fermière et de la Salmone, déduits de la grille de prix des autres pizzas.
- [ ] **Offre** « 2 achetées = 3e offerte » et ses conditions.
- [ ] **Livraison** : rayon de 8 km, minimum de 15 €, liste des communes.
- [ ] **Horaires** : repris de PagesJaunes et de l'annuaire de la mairie.
- [ ] **Coordonnées** : e-mail, réseaux sociaux (Instagram, Facebook, TikTok), lien Uber Eats ou Deliveroo éventuel.
- [ ] **Produits** : prix de la Glace (6,90 €) ; produits Tex-Mex et Hot Bread, présents dans l'ancien menu mais sans détail.
- [ ] **Mentions légales** : nom de l'hébergeur.
- [ ] **Coordonnées GPS** exactes (`geo` dans `site.ts`).

## Structure

```text
src/
  data/        site.ts · menu.ts · faq.ts   ← le contenu
  components/  Header, Footer, CartDrawer, PizzaCard, ItemCard, Hours, Faq…
  layouts/     Base.astro (SEO, JSON-LD, polices)
  assets/      photos/ · cutouts/ (vraies photos)
  lib/         photos.ts · schema.ts (JSON-LD)
  scripts/     home.ts (3D de l'accueil) · motion.ts (Lenis, apparitions) · cart.ts (panier)
  pages/       accueil, carte, pizzas/[slug], livraison, a-propos, contact, mentions-legales, 404
public/        favicon, icônes, images Open Graph, robots.txt, .htaccess, _redirects, _headers
scripts/       generate-assets.mjs · prepare-photos.mjs
```
