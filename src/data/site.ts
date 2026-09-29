/**
 * Informations de l'établissement — SOURCE UNIQUE utilisée partout
 * (en-tête, pied de page, pages, données structurées SEO…).
 * Modifiez ici, tout le site se met à jour.
 */

export const SITE = {
  name: 'Happiness Pizza',
  legalName: "HAPPINESS' PIZZA",
  url: 'https://happinesspizza.fr',
  tagline: 'La pizza qui rend heureux',
  description:
    "Pizzeria artisanale à Fontenay-Trésigny (77) : pizzas Junior, Senior et Méga, pâtes, salades, paninis et desserts. Pâte fraîche du jour, ingrédients de qualité. Livraison, à emporter et sur place.",
  locale: 'fr_FR',
  language: 'fr',

  phone: '01 64 51 69 60',
  phoneIntl: '+33164516960',
  email: '', // à compléter si vous souhaitez afficher une adresse e-mail

  address: {
    street: '37 avenue du Général de Gaulle',
    postalCode: '77610',
    city: 'Fontenay-Trésigny',
    region: 'Île-de-France',
    department: 'Seine-et-Marne',
    country: 'FR',
  },
  /** Coordonnées approximatives (centre de Fontenay-Trésigny) — à affiner si besoin. */
  geo: { lat: 48.7064, lng: 2.8713 },

  /** Horaires (format 24h). Un jour peut avoir 0, 1 ou 2 services. */
  hours: [
    { day: 'Lundi', schema: 'Monday', slots: [['11:00', '14:30'], ['18:00', '22:30']] },
    { day: 'Mardi', schema: 'Tuesday', slots: [['11:00', '14:30'], ['18:00', '22:30']] },
    { day: 'Mercredi', schema: 'Wednesday', slots: [['11:00', '14:30'], ['18:00', '22:30']] },
    { day: 'Jeudi', schema: 'Thursday', slots: [['11:00', '14:30'], ['18:00', '22:30']] },
    { day: 'Vendredi', schema: 'Friday', slots: [['18:00', '23:00']] },
    { day: 'Samedi', schema: 'Saturday', slots: [['11:00', '14:30'], ['18:00', '23:00']] },
    { day: 'Dimanche', schema: 'Sunday', slots: [['11:00', '14:30'], ['18:00', '23:00']] },
  ] as Array<{ day: string; schema: string; slots: Array<[string, string]> }>,

  delivery: {
    radiusKm: 8,
    free: true,
    minOrder: 15,
    time: '30 à 40 min',
  },

  services: ['Livraison', 'À emporter', 'Sur place'],
  payments: ['Carte bancaire', 'Espèces', 'Titres-restaurant'],

  /** Communes proches de Fontenay-Trésigny (rayon de livraison) — à ajuster selon vos tournées. */
  zones: [
    'Fontenay-Trésigny',
    'Marles-en-Brie',
    'Châtres',
    'La Houssaye-en-Brie',
    'Bernay-Vilbert',
    'Liverdy-en-Brie',
    'Crèvecœur-en-Brie',
    'Lumigny-Nesles-Ormeaux',
    'Neufmoutiers-en-Brie',
    'Ozouer-le-Voulgis',
    'Chaumes-en-Brie',
  ],

  /** Offre mise en avant. */
  offer: {
    title: '2 pizzas achetées = la 3e offerte',
    short: '2 achetées = 3e offerte',
    conditions: 'Valable sur les pizzas Senior et Méga, hors Margherita. La moins chère des trois est offerte.',
  },

  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
    google: '',
  },

  /** Lien de commande en ligne externe (Uber Eats, Deliveroo, click & collect…) — laisser vide si aucun. */
  orderUrl: '',

  legal: {
    siren: '930 494 653',
    siret: '930 494 653 00015',
    rcs: 'RCS Meaux',
    form: 'SARL au capital de 500 €',
    director: 'Messaoud Menghour',
    host: {
      name: '', // à compléter avec votre hébergeur (ex. OVH, o2switch, Netlify…)
      address: '',
    },
  },

  since: 2024,
  priceRange: '€',
} as const;

export const NAV = [
  { href: '/carte/', label: 'La carte' },
  { href: '/carte/pizzas/', label: 'Pizzas' },
  { href: '/carte/menus/', label: 'Menus' },
  { href: '/livraison/', label: 'Livraison' },
  { href: '/a-propos/', label: 'Notre histoire' },
  { href: '/contact/', label: 'Contact' },
];

export const telHref = `tel:${SITE.phoneIntl}`;
export const fullAddress = `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}`;
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Happiness Pizza ${fullAddress}`)}`;

export function formatPrice(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}
