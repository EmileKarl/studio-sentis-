import { DICT, type Locale } from "@/lib/i18n";
import {
  BUSINESS,
  CONTACT_EMAIL,
  ID_ENTREPRISE,
  ID_SITE,
  SITE_URL,
} from "@/lib/site";

/**
 * Données structurées schema.org de l'entreprise.
 *
 * Pour une entreprise dont le positionnement repose sur la proximité, c'est ce
 * qui permet à un moteur de comprendre où elle se trouve et ce qu'elle fait —
 * donc de la proposer à quelqu'un qui cherche « site web Châteauguay ».
 *
 * Rien n'est déclaré ici qui ne soit vrai ailleurs sur la page : pas de note
 * moyenne, pas d'avis, pas d'horaires inventés, pas de téléphone ni de
 * coordonnées géographiques que le studio ne publie pas. Une donnée structurée
 * fausse est une donnée qu'un moteur peut sanctionner.
 *
 * Trois défauts corrigés après passage à la grille d'audit de
 * `AgriciDaniel/claude-seo` :
 *
 * 1. **L'entité n'existait que sur l'accueil.** Les pages intérieures ne
 *    portaient qu'un fil d'Ariane : un moteur arrivant sur `/fr/services`
 *    depuis une recherche n'y trouvait rien sur l'entreprise. D'où l'`@id`
 *    stable ci-dessous, auquel les autres pages se rattachent au lieu de
 *    redéclarer l'entreprise — deux déclarations divergentes du même commerce
 *    valent moins qu'une seule.
 * 2. **Le forfait mensuel mentait.** La page affiche « 85 $ / mois » ; le
 *    balisage réduisait ce texte à ses chiffres et annonçait un prix unique de
 *    85 $. Un prix récurrent se déclare avec une `UnitPriceSpecification` et
 *    sa période de facturation.
 * 3. **`areaServed` nommait des lieux sans les identifier.** « Châteauguay »
 *    désigne aussi une rivière, une circonscription et un ancien comté. Les
 *    `sameAs` vers Wikipédia et Wikidata lèvent l'ambiguïté ; chaque
 *    identifiant a été vérifié contre l'API de Wikipédia, pas écrit de
 *    mémoire.
 */

/**
 * Zones desservies, avec leur entité de référence.
 *
 * Vérifié le 2026-09-29 via `fr.wikipedia.org/api/rest_v1/page/summary` :
 * chaque `wikidata` est celui que Wikipédia renvoie pour la page citée.
 */
const ZONES = [
  {
    nom: "Châteauguay",
    wikipedia: "https://fr.wikipedia.org/wiki/Ch%C3%A2teauguay",
    wikidata: "https://www.wikidata.org/wiki/Q141522",
  },
  {
    nom: "Montérégie",
    wikipedia: "https://fr.wikipedia.org/wiki/Mont%C3%A9r%C3%A9gie",
    wikidata: "https://www.wikidata.org/wiki/Q931679",
  },
  {
    nom: "Grand Montréal",
    wikipedia:
      "https://fr.wikipedia.org/wiki/R%C3%A9gion_m%C3%A9tropolitaine_de_Montr%C3%A9al",
    wikidata: "https://www.wikidata.org/wiki/Q3455619",
  },
  {
    nom: "Québec",
    wikipedia: "https://fr.wikipedia.org/wiki/Qu%C3%A9bec_(province)",
    wikidata: "https://www.wikidata.org/wiki/Q176",
  },
] as const;

/**
 * Sépare un prix affiché en un montant et, s'il y en a une, une périodicité.
 *
 * Le texte de la page fait foi : `"85 $ / mois"` doit produire un prix
 * récurrent, pas un prix unique de 85 $. Le repli sur `undefined` est
 * volontaire — une offre sans prix vaut mieux qu'une offre au mauvais prix.
 */
function lirePrix(affiche: string): { montant?: string; mensuel: boolean } {
  const mensuel = /\/\s*(mois|month)/i.test(affiche);
  const montant = affiche.replace(/[^\d]/g, "");
  return { montant: montant || undefined, mensuel };
}

export function LocalBusinessJsonLd({ locale }: { locale: Locale }) {
  const d = DICT[locale];

  const entreprise = {
    "@type": "ProfessionalService",
    "@id": ID_ENTREPRISE,
    name: BUSINESS.name,
    description: d.seo[""].description,
    url: `${SITE_URL}/${locale}`,
    email: CONTACT_EMAIL,
    // L'image de partage porte le nom, le métier et le lieu : c'est la seule
    // image de marque que le studio publie, et elle est vraie dans les deux
    // langues.
    image: `${SITE_URL}/og.png`,
    logo: `${SITE_URL}/icon.png`,
    // Sous 100 caractères, et repris des montants affichés sur la page Prix.
    priceRange: "1 200 $ – 15 000 $ CAD",
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    areaServed: ZONES.map((zone) => ({
      "@type": "AdministrativeArea",
      name: zone.nom,
      sameAs: [zone.wikipedia, zone.wikidata],
    })),
    availableLanguage: BUSINESS.languages,
    knowsLanguage: BUSINESS.languages,
    serviceType: d.services.items.map((item) => item.titre),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: d.prix.titre,
      itemListElement: d.prix.forfaits.map((f) => {
        const { montant, mensuel } = lirePrix(f.prix);
        const offre: Record<string, unknown> = {
          "@type": "Offer",
          name: f.nom,
          description: f.detail,
          priceCurrency: "CAD",
        };
        if (montant && mensuel) {
          offre.priceSpecification = {
            "@type": "UnitPriceSpecification",
            price: montant,
            priceCurrency: "CAD",
            billingDuration: 1,
            billingIncrement: 1,
            unitCode: "MON",
          };
        } else if (montant) {
          offre.price = montant;
        }
        return offre;
      }),
    },
  };

  const site = {
    "@type": "WebSite",
    "@id": ID_SITE,
    url: `${SITE_URL}/${locale}`,
    name: BUSINESS.name,
    inLanguage: locale === "fr" ? "fr-CA" : "en-CA",
    publisher: { "@id": ID_ENTREPRISE },
  };

  // Un seul bloc portant un `@graph` plutôt que deux scripts : les nœuds y
  // sont liés par leur `@id`, ce qu'un moteur lit comme une seule entité
  // décrite sous plusieurs angles.
  const data = { "@context": "https://schema.org", "@graph": [entreprise, site] };

  return (
    <script
      type="application/ld+json"
      // Contenu statique issu du dictionnaire, jamais d'une saisie externe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
