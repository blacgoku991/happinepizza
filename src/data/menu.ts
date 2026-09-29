/**
 * LA CARTE — source unique des produits.
 * Pour ajouter une pizza : copiez un bloc dans PIZZAS et adaptez-le.
 * Les pages, le panier, le sitemap et les données SEO se génèrent automatiquement.
 */

export type SizeKey = 'junior' | 'senior' | 'mega';

export const SIZES: Array<{ key: SizeKey; label: string }> = [
  { key: 'junior', label: 'Junior' },
  { key: 'senior', label: 'Senior' },
  { key: 'mega', label: 'Méga' },
];

export type Base = 'tomate' | 'creme' | 'barbecue' | 'ketchup' | 'thai' | 'choix';

export const BASES: Record<Base, string> = {
  tomate: 'Base tomate',
  creme: 'Base crème',
  barbecue: 'Base barbecue',
  ketchup: 'Base ketchup',
  thai: 'Base sauce thaï',
  choix: 'Base au choix',
};

export type Tag = 'vege' | 'epicee' | 'signature' | 'nouveau' | 'poisson' | 'best';

export const TAGS: Record<Tag, { label: string; color: 'tomato' | 'saffron' | 'basil' | 'ink' }> = {
  signature: { label: 'Signature', color: 'saffron' },
  best: { label: 'Best-seller', color: 'tomato' },
  vege: { label: 'Végétarienne', color: 'basil' },
  epicee: { label: 'Épicée', color: 'tomato' },
  poisson: { label: 'Poisson', color: 'ink' },
  nouveau: { label: 'Nouveau', color: 'saffron' },
};

export interface Pizza {
  slug: string;
  name: string;
  base: Base;
  ingredients: string[];
  prices: Partial<Record<SizeKey, number>>;
  tags?: Tag[];
  /** Phrase d'accroche (SEO + fiche produit). */
  pitch: string;
  /** Clé de la photo (par défaut : pizza-<slug>). */
  photo?: string;
}

export const PIZZAS: Pizza[] = [
  {
    slug: 'reine',
    name: 'Reine',
    base: 'tomate',
    ingredients: ['Sauce tomate', 'Mozzarella', 'Jambon frais', 'Champignons de Paris', 'Origan'],
    prices: { junior: 8.9, senior: 13.9, mega: 18.9 },
    tags: ['best'],
    pitch: "L'indémodable : jambon frais et champignons de Paris sur une sauce tomate généreuse.",
  },
  {
    slug: 'calzone',
    name: 'Calzone',
    base: 'tomate',
    ingredients: ['Sauce tomate', 'Mozzarella', 'Jambon frais', 'Œuf', 'Origan'],
    prices: { junior: 8.9, senior: 13.9, mega: 18.9 },
    pitch: 'La pizza chausson, dorée au four et fondante à cœur : jambon frais, œuf et mozzarella.',
  },
  {
    slug: 'campione',
    name: 'Campione',
    base: 'tomate',
    ingredients: ['Sauce tomate', 'Mozzarella', 'Champignons de Paris', 'Œuf', 'Bœuf haché', 'Origan'],
    prices: { junior: 9.4, senior: 15.9, mega: 21.9 },
    pitch: 'Bœuf haché, champignons de Paris et œuf coulant : la pizza des grandes faims.',
  },
  {
    slug: 'bresilienne',
    name: 'Brésilienne',
    base: 'tomate',
    ingredients: ['Sauce tomate', 'Mozzarella', 'Bœuf haché', 'Merguez', 'Olives', 'Poivrons', 'Origan'],
    prices: { junior: 9.4, senior: 15.9, mega: 21.9 },
    tags: ['epicee'],
    pitch: 'Merguez, bœuf haché, poivrons et olives : une pizza pleine de caractère.',
  },
  {
    slug: 'chicken',
    name: 'Chicken',
    base: 'creme',
    ingredients: ['Crème fraîche', 'Mozzarella', 'Poulet fumé', 'Pommes de terre persillées', 'Origan'],
    prices: { junior: 9.4, senior: 15.9, mega: 21.9 },
    pitch: 'Poulet fumé et pommes de terre persillées sur une crème fraîche onctueuse.',
  },
  {
    slug: 'fermiere',
    name: 'Fermière',
    base: 'tomate',
    ingredients: ['Sauce tomate', 'Mozzarella', 'Poulet rôti', "Fondu d'oignons", 'Pommes de terre persillées', 'Origan'],
    prices: { junior: 9.4, senior: 15.9, mega: 21.9 },
    pitch: "Poulet rôti, fondu d'oignons et pommes de terre persillées : le goût de la campagne.",
  },
  {
    slug: 'barbecue',
    name: 'Barbecue',
    base: 'barbecue',
    ingredients: ['Sauce barbecue', 'Mozzarella', 'Bœuf haché', 'Poivrons grillés', "Fondu d'oignons", 'Origan'],
    prices: { junior: 9.9, senior: 16.9, mega: 22.9 },
    tags: ['best'],
    pitch: "Sauce barbecue fumée, bœuf haché, poivrons grillés et fondu d'oignons.",
  },
  {
    slug: 'boursin',
    name: 'Boursin',
    base: 'creme',
    ingredients: ['Crème fraîche', 'Mozzarella', 'Poulet fumé', 'Pommes de terre persillées', 'Boursin', 'Origan'],
    prices: { junior: 9.9, senior: 16.9, mega: 22.9 },
    pitch: 'Poulet fumé et pommes de terre persillées, nappés de Boursin ail & fines herbes.',
  },
  {
    slug: 'burger',
    name: 'Burger',
    base: 'ketchup',
    ingredients: ['Sauce ketchup', 'Mozzarella', 'Bœuf haché', "Fondu d'oignons", 'Cheddar', 'Cornichons', 'Tomates cerises', 'Oignons'],
    prices: { junior: 9.9, senior: 16.9, mega: 22.9 },
    tags: ['signature'],
    pitch: 'Tout le burger dans une pizza : bœuf haché, cheddar, cornichons, oignons et tomates cerises.',
  },
  {
    slug: 'chilly',
    name: 'Chilly',
    base: 'thai',
    ingredients: ['Sauce thaï', 'Mozzarella', 'Poulet rôti', 'Poivrons grillés', 'Piment jalapeños', 'Origan'],
    prices: { junior: 9.9, senior: 16.9, mega: 22.9 },
    tags: ['epicee'],
    pitch: 'Sauce thaï, poulet rôti et jalapeños : la pizza qui réveille les papilles.',
  },
  {
    slug: 'british',
    name: 'British',
    base: 'creme',
    ingredients: ['Crème fraîche', 'Mozzarella', 'Œuf', 'Cheddar', 'Bacon', 'Bœuf haché', 'Origan'],
    prices: { junior: 10.9, senior: 17.9, mega: 23.9 },
    tags: ['signature'],
    pitch: 'Un breakfast anglais version pizza : bacon, œuf, cheddar et bœuf haché.',
  },
  {
    slug: '4-fromages',
    name: '4 Fromages',
    base: 'tomate',
    ingredients: ['Sauce tomate', 'Mozzarella', 'Gorgonzola', 'Chèvre', 'Raclette', 'Origan'],
    prices: { junior: 10.9, senior: 17.9, mega: 23.9 },
    tags: ['vege', 'best'],
    pitch: 'Mozzarella, gorgonzola, chèvre et raclette : quatre fromages, zéro compromis.',
  },
  {
    slug: 'chevre-miel',
    name: 'Chèvre Miel',
    base: 'creme',
    ingredients: ['Crème fraîche', 'Mozzarella', 'Chèvre', 'Miel', 'Olives', 'Origan'],
    prices: { junior: 10.9, senior: 17.9, mega: 23.9 },
    tags: ['vege'],
    pitch: 'Le duo sucré-salé préféré : chèvre fondant et filet de miel sur crème fraîche.',
  },
  {
    slug: 'salmone',
    name: 'Salmone',
    base: 'creme',
    ingredients: ['Crème fraîche', 'Mozzarella', 'Saumon', 'Origan'],
    prices: { junior: 10.9, senior: 17.9, mega: 23.9 },
    tags: ['poisson'],
    pitch: 'Saumon et crème fraîche : une pizza fine, délicate et gourmande.',
  },
  {
    slug: 'au-choix',
    name: 'Au choix',
    base: 'choix',
    ingredients: ['Sauce au choix', 'Mozzarella', '2 viandes au choix', '2 légumes au choix'],
    prices: { junior: 10.9, senior: 17.9, mega: 23.9 },
    tags: ['nouveau'],
    pitch: 'Composez la vôtre : la sauce, deux viandes et deux légumes de votre choix.',
  },
];

/* ---------- Autres produits ---------- */

export interface Item {
  slug: string;
  name: string;
  description?: string;
  price: number;
  /** Clé de la photo dans src/assets/photos (sans extension). */
  photo?: string;
  tags?: Tag[];
}

export interface Category {
  slug: string;
  name: string;
  title: string; // H1 de la page catégorie
  intro: string;
  seoTitle: string;
  seoDescription: string;
  emoji: string;
  items: Item[];
}

export const MENUS: Item[] = [
  { slug: 'menu-familiale', name: 'Menu Familiale', description: '1 pizza Junior + 1 cookie + 1 Coca 33 cl', price: 11.9, photo: 'menu-familiale' },
  { slug: 'menu-ambiance', name: 'Menu Ambiance', description: '2 pizzas Senior au choix + 1 Maxi Coca', price: 27.9, photo: 'menu-ambiance', tags: ['best'] },
  { slug: 'menu-duo', name: 'Menu Duo', description: '2 pizzas Méga au choix + 1 Maxi Coca', price: 37.9, photo: 'menu-duo' },
  { slug: 'menu-enfant-pizza', name: 'Menu Enfant Pizza', description: '1 pizza jambon au choix + 1 jus de fruits + 1 compote', price: 6.9, photo: 'menu-enfant-pizza' },
  { slug: 'menu-enfant-nuggets', name: 'Menu Enfant Nuggets', description: '6 nuggets + potatoes + 1 jus de fruits + 1 compote', price: 6.9 },
];

export const CATEGORIES: Category[] = [
  {
    slug: 'menus',
    name: 'Menus',
    title: 'Nos menus & formules',
    intro: 'Des formules pensées pour partager — en duo, en famille ou pour les plus petits.',
    seoTitle: 'Menus pizza : duo, famille & enfant',
    seoDescription:
      'Menus Happiness Pizza à Fontenay-Trésigny : Menu Duo 2 pizzas Méga, Menu Ambiance 2 pizzas Senior, menus enfant dès 6,90 €. Livraison et à emporter.',
    emoji: '🍱',
    items: MENUS,
  },
  {
    slug: 'pates',
    name: 'Pâtes',
    title: 'Nos pâtes gratinées',
    intro: 'Des pâtes généreuses, cuisinées minute et parsemées de parmesan.',
    seoTitle: 'Pâtes en livraison à Fontenay-Trésigny',
    seoDescription:
      'Spaghetti bolognaise, pennes fromagère, tagliatelles au saumon : les pâtes Happiness Pizza livrées à Fontenay-Trésigny et alentours.',
    emoji: '🍝',
    items: [
      { slug: 'spaghetti-bolognaise', name: 'Spaghetti Bolognaise', description: 'Sauce tomate, tomates concassées, viande hachée, ail, poivrons émincés, olives, parmesan', price: 8.5, photo: 'pates-bolognaise' },
      { slug: 'tagliatelle-saumon', name: 'Tagliatelle Saumon', description: 'Crème, aneth, saumon fumé, parmesan', price: 9.5, photo: 'pates-saumon', tags: ['poisson'] },
      { slug: 'pennes-fromagere', name: 'Pennes Fromagère', description: 'Sauce crème aux champignons, poulet, ail, champignons, parmesan', price: 9.9, photo: 'pates-fromagere' },
    ],
  },
  {
    slug: 'salades',
    name: 'Salades',
    title: 'Nos salades fraîches',
    intro: 'Méli-mélo croquant, tomates cerises et croûtons : la fraîcheur à la carte.',
    seoTitle: 'Salades fraîches à Fontenay-Trésigny',
    seoDescription:
      'Salade César, Fromagère ou Gourmande à 6,90 € : les salades fraîches Happiness Pizza, en livraison et à emporter à Fontenay-Trésigny.',
    emoji: '🥗',
    items: [
      { slug: 'salade-cesar', name: 'Salade César', description: 'Méli-mélo de salade, tomates cerises, poulet rôti, parmesan, croûtons, sauce César', price: 6.9 },
      { slug: 'salade-fromagere', name: 'Salade Fromagère', description: 'Méli-mélo de salade, tomates cerises, fromages, parmesan, croûtons, vinaigrette', price: 6.9, tags: ['vege'] },
      { slug: 'salade-gourmande', name: 'Salade Gourmande', description: 'Méli-mélo de salade, tomates cerises, thon, chèvre, poivrons grillés, croûtons, olives, vinaigrette', price: 6.9 },
    ],
  },
  {
    slug: 'paninis',
    name: 'Paninis',
    title: 'Nos paninis croustillants',
    intro: 'Pain doré et croustillant, cœur fondant : le snack parfait à toute heure.',
    seoTitle: 'Paninis chauds à Fontenay-Trésigny',
    seoDescription:
      'Paninis poulet, thon, jambon, chèvre, bœuf haché ou 3 fromages à 4,90 € chez Happiness Pizza, Fontenay-Trésigny. Livraison et à emporter.',
    emoji: '🥪',
    items: [
      { slug: 'panini-poulet', name: 'Panini Poulet', description: 'Sauce tomate, mozzarella, poulet fumé', price: 4.9 },
      { slug: 'panini-thon', name: 'Panini Thon', description: 'Sauce tomate, mozzarella, thon', price: 4.9, tags: ['poisson'] },
      { slug: 'panini-jambon', name: 'Panini Jambon', description: 'Crème fraîche, mozzarella, jambon', price: 4.9 },
      { slug: 'panini-chevre', name: 'Panini Chèvre', description: 'Sauce tomate, mozzarella, chèvre', price: 4.9, tags: ['vege'] },
      { slug: 'panini-boeuf-hache', name: 'Panini Bœuf haché', description: 'Sauce tomate, mozzarella, bœuf haché', price: 4.9 },
      { slug: 'panini-3-fromages', name: 'Panini 3 Fromages', description: 'Sauce tomate, mozzarella, chèvre, gorgonzola', price: 4.9, tags: ['vege'] },
    ],
  },
  {
    slug: 'desserts',
    name: 'Desserts',
    title: 'Nos desserts gourmands',
    intro: 'Parce qu’on a toujours une petite place pour le sucré.',
    seoTitle: 'Desserts gourmands à Fontenay-Trésigny',
    seoDescription:
      'Tiramisu maison, lava cake, brownie, cookie, donuts, muffin Nutella, panini Nutella et glaces : les desserts Happiness Pizza livrés chez vous.',
    emoji: '🍩',
    items: [
      { slug: 'tiramisu-maison', name: 'Tiramisu Maison', description: 'Fait maison, crémeux et généreux', price: 4.5, photo: 'dessert-tiramisu-maison', tags: ['signature'] },
      { slug: 'tiramisu', name: 'Tiramisu', price: 2.9, photo: 'dessert-tiramisu' },
      { slug: 'lava-cake', name: 'Lava Cake', description: 'Cœur coulant au chocolat', price: 2.9, photo: 'dessert-lava-cake' },
      { slug: 'brownie', name: 'Brownie', description: 'Fondant au chocolat', price: 2.9, photo: 'dessert-brownie' },
      { slug: 'cookie', name: 'Cookie', description: 'Moelleux aux pépites de chocolat', price: 2.9, photo: 'dessert-cookie' },
      { slug: 'donuts', name: 'Donuts', price: 2.9, photo: 'dessert-donuts' },
      { slug: 'beignet-trio', name: 'Beignet Trio', description: 'Trois beignets gourmands', price: 2.9, photo: 'dessert-beignet-trio' },
      { slug: 'muffin-nutella', name: 'Muffin Nutella', price: 3.5, photo: 'dessert-muffin-nutella' },
      { slug: 'panini-nutella', name: 'Panini Nutella', description: 'Pain croustillant, cœur Nutella fondant', price: 3.5, photo: 'dessert-panini-nutella' },
      { slug: 'glace', name: 'Glace', description: 'Pot de glace', price: 6.9, photo: 'dessert-glace' },
    ],
  },
  {
    slug: 'boissons',
    name: 'Boissons',
    title: 'Nos boissons fraîches',
    intro: 'Sodas, eaux et jus bien frais pour accompagner votre pizza.',
    seoTitle: 'Boissons fraîches à Fontenay-Trésigny',
    seoDescription:
      'Coca-Cola, Coca Zéro, Fanta, 7UP Mojito, Capri-Sun, Badoit, eau : les boissons fraîches à ajouter à votre commande Happiness Pizza.',
    emoji: '🥤',
    items: [
      { slug: 'coca-33cl', name: 'Coca-Cola 33 cl', price: 1.5 },
      { slug: 'coca-zero-33cl', name: 'Coca-Cola Zéro 33 cl', price: 1.5 },
      { slug: 'coca-cherry-33cl', name: 'Coca-Cola Cherry 33 cl', price: 1.5 },
      { slug: 'fanta-citron-33cl', name: 'Fanta Citron 33 cl', price: 1.5 },
      { slug: 'fanta-exotique-33cl', name: 'Fanta Exotique 33 cl', price: 1.5 },
      { slug: '7up-mojito-33cl', name: '7UP Mojito 33 cl', price: 1.5 },
      { slug: 'capri-sun', name: 'Capri-Sun', price: 1.5 },
      { slug: 'badoit', name: 'Badoit', price: 1.5 },
      { slug: 'eau', name: 'Eau', price: 1 },
      { slug: 'coca-1-5l', name: 'Coca-Cola 1,5 L', price: 3 },
      { slug: 'coca-zero-1-5l', name: 'Coca-Cola Zéro 1,5 L', price: 3 },
      { slug: 'fanta-1-5l', name: 'Fanta 1,5 L', price: 3 },
    ],
  },
];

export const PIZZA_CATEGORY = {
  slug: 'pizzas',
  name: 'Pizzas',
  title: 'Nos pizzas artisanales',
  intro: 'Pâte fraîche pétrie chaque jour, garnitures généreuses, en Junior, Senior ou Méga.',
  seoTitle: 'Pizzas artisanales à Fontenay-Trésigny',
  seoDescription:
    'Reine, 4 Fromages, Barbecue, Chèvre Miel, Burger, Chilly… nos pizzas artisanales en Junior, Senior et Méga, livrées à Fontenay-Trésigny et alentours.',
  emoji: '🍕',
};

/** Toutes les catégories dans l'ordre d'affichage de la carte. */
export const ALL_CATEGORIES = [
  { slug: PIZZA_CATEGORY.slug, name: PIZZA_CATEGORY.name, emoji: PIZZA_CATEGORY.emoji },
  ...CATEGORIES.map((c) => ({ slug: c.slug, name: c.name, emoji: c.emoji })),
];

export function minPrice(p: Pizza) {
  return Math.min(...(Object.values(p.prices) as number[]));
}

export function pizzaBySlug(slug: string) {
  return PIZZAS.find((p) => p.slug === slug);
}

/** Pizzas mises en avant sur l'accueil. */
export const FEATURED = ['burger', 'chevre-miel', '4-fromages', 'chilly', 'british', 'barbecue', 'reine', 'salmone']
  .map(pizzaBySlug)
  .filter(Boolean) as Pizza[];
