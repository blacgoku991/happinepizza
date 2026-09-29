/**
 * Données structurées schema.org (JSON-LD) pour le référencement.
 */
import { SITE, NAV } from '../data/site';
import { CATEGORIES, PIZZAS, PIZZA_CATEGORY, SIZES, type Pizza } from '../data/menu';

const U = SITE.url;
export const RESTAURANT_ID = `${U}/#restaurant`;
export const WEBSITE_ID = `${U}/#website`;

const abs = (path: string) => new URL(path, U).href;

export function restaurantSchema() {
  const sameAs = Object.values(SITE.social).filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': ['Restaurant', 'LocalBusiness'],
    '@id': RESTAURANT_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description,
    url: `${U}/`,
    telephone: SITE.phoneIntl,
    ...(SITE.email ? { email: SITE.email } : {}),
    image: [abs('/og/og-default.jpg'), abs('/icons/icon-512.png')],
    logo: abs('/icons/icon-512.png'),
    priceRange: SITE.priceRange,
    servesCuisine: ['Pizza', 'Italienne', 'Pâtes', 'Salades', 'Snacking'],
    acceptsReservations: false,
    currenciesAccepted: 'EUR',
    paymentAccepted: SITE.payments.join(', '),
    hasMenu: abs('/carte/'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.name} ${SITE.address.street} ${SITE.address.postalCode} ${SITE.address.city}`)}`,
    openingHoursSpecification: SITE.hours.flatMap((d) =>
      d.slots.map(([opens, closes]) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${d.schema}`,
        opens,
        closes,
      })),
    ),
    areaServed: SITE.zones.map((z) => ({ '@type': 'City', name: z })),
    ...(sameAs.length ? { sameAs } : {}),
    potentialAction: {
      '@type': 'OrderAction',
      target: { '@type': 'EntryPoint', urlTemplate: abs('/carte/'), inLanguage: 'fr-FR', actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'] },
      deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModeOwnFleet', 'http://purl.org/goodrelations/v1#DeliveryModePickUp'],
    },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${U}/`,
    name: SITE.name,
    inLanguage: 'fr-FR',
    publisher: { '@id': RESTAURANT_ID },
  };
}

export function navSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: NAV.map((n) => n.label),
    url: NAV.map((n) => abs(n.href)),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function pizzaOffers(p: Pizza) {
  return SIZES.filter((s) => p.prices[s.key] != null).map((s) => ({
    '@type': 'Offer',
    name: `Taille ${s.label}`,
    price: p.prices[s.key]!.toFixed(2),
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  }));
}

export function pizzaMenuItem(p: Pizza) {
  return {
    '@type': 'MenuItem',
    '@id': abs(`/pizzas/${p.slug}/#item`),
    name: `Pizza ${p.name}`,
    description: `${p.pitch} Ingrédients : ${p.ingredients.join(', ')}.`,
    url: abs(`/pizzas/${p.slug}/`),
    image: abs(`/og/pizza-${p.slug}.jpg`),
    offers: pizzaOffers(p),
    ...(p.tags?.includes('vege') ? { suitableForDiet: 'https://schema.org/VegetarianDiet' } : {}),
  };
}

export function menuSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': abs('/carte/#menu'),
    name: `La carte ${SITE.name}`,
    url: abs('/carte/'),
    inLanguage: 'fr-FR',
    mainEntityOfPage: abs('/carte/'),
    hasMenuSection: [
      {
        '@type': 'MenuSection',
        name: PIZZA_CATEGORY.name,
        description: PIZZA_CATEGORY.intro,
        url: abs(`/carte/${PIZZA_CATEGORY.slug}/`),
        hasMenuItem: PIZZAS.map(pizzaMenuItem),
      },
      ...CATEGORIES.map((c) => ({
        '@type': 'MenuSection',
        name: c.name,
        description: c.intro,
        url: abs(`/carte/${c.slug}/`),
        hasMenuItem: c.items.map((it) => ({
          '@type': 'MenuItem',
          name: it.name,
          ...(it.description ? { description: it.description } : {}),
          offers: { '@type': 'Offer', price: it.price.toFixed(2), priceCurrency: 'EUR' },
          ...(it.tags?.includes('vege') ? { suitableForDiet: 'https://schema.org/VegetarianDiet' } : {}),
        })),
      })),
    ],
  };
}

export function itemListSchema(name: string, items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: abs(it.path) })),
  };
}
