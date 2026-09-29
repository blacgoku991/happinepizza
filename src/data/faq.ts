import { SITE } from './site';
import { PIZZAS } from './menu';

const hoursText = SITE.hours
  .map((d) => `${d.day} : ${d.slots.length ? d.slots.map(([a, b]) => `${a.replace(':', 'h')}-${b.replace(':', 'h')}`).join(' et ') : 'fermé'}`)
  .join(' ; ');

const vege = PIZZAS.filter((p) => p.tags?.includes('vege')).map((p) => p.name);

export const FAQS: Array<{ q: string; a: string }> = [
  {
    q: `Livrez-vous à ${SITE.address.city} et dans les villes alentour ?`,
    a: `Oui. ${SITE.name} livre ${SITE.address.city} et les communes voisines dans un rayon de ${SITE.delivery.radiusKm} km : ${SITE.zones.slice(1).join(', ')}. En cas de doute sur votre adresse, appelez-nous au ${SITE.phone}.`,
  },
  {
    q: 'La livraison est-elle gratuite ?',
    a: `Oui, la livraison est gratuite dans un rayon de ${SITE.delivery.radiusKm} km, avec un minimum de commande de ${SITE.delivery.minOrder} €.`,
  },
  {
    q: 'Comment passer commande ?',
    a: `Par téléphone au ${SITE.phone}. Vous pouvez préparer votre panier sur le site, puis nous appeler : il ne vous reste plus qu'à nous lire votre récapitulatif.`,
  },
  {
    q: 'Quels sont vos horaires d’ouverture ?',
    a: `Nous sommes ouverts 7 jours sur 7. ${hoursText}.`,
  },
  {
    q: 'Quelle est l’offre du moment ?',
    a: `${SITE.offer.title} ! ${SITE.offer.conditions}`,
  },
  {
    q: 'Quels moyens de paiement acceptez-vous ?',
    a: `Nous acceptons : ${SITE.payments.join(', ').toLowerCase()}.`,
  },
  {
    q: 'Avez-vous des pizzas végétariennes ?',
    a: `Oui : ${vege.join(', ')}. Vous pouvez aussi composer votre pizza « Au choix » avec les légumes de votre choix.`,
  },
  {
    q: 'Peut-on manger sur place ou emporter ?',
    a: `Bien sûr ! Retrouvez-nous au ${SITE.address.street} à ${SITE.address.city} pour manger sur place ou emporter votre commande.`,
  },
];
