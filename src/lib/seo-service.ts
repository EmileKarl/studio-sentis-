import type { Metadata } from "next";

import { DICT, LOCALES, type Locale } from "@/lib/i18n";
import {
  BUSINESS,
  ID_ENTREPRISE,
  ID_SITE,
  SITE_URL,
  SITE_URL_IS_PLACEHOLDER,
} from "@/lib/site";
import type { ServiceDetail } from "@/lib/services-detail";

/**
 * Métadonnées et balisage des quatre pages de métier.
 *
 * Elles ont leur propre fichier plutôt que de s'ajouter à `seo.ts`, pour une
 * raison précise : `metadonneesPage` suppose que **les deux langues partagent
 * leurs segments d'URL** — `/fr/services` et `/en/services`. C'est vrai partout
 * ailleurs sur le site, et faux ici : une page faite pour être trouvée doit
 * porter l'adresse que la personne tape, donc `/fr/services/creation-de-logo`
 * d'un côté et `/en/services/logo-design` de l'autre.
 *
 * Plutôt que d'ajouter un cas particulier dans une fonction qui marche, les
 * deux cohabitent. `seo.ts` n'est pas modifié.
 */

export function metadonneesService(
  locale: Locale,
  service: ServiceDetail,
): Metadata {
  const url = `/${locale}/services/${service.slug[locale]}`;

  // Chaque langue pointe vers SON adresse. C'est tout l'objet de ce fichier.
  const languages = Object.fromEntries(
    LOCALES.map((l) => [l, `/${l}/services/${service.slug[l]}`]),
  ) as Record<Locale, string>;

  return {
    title: { absolute: service.titre },
    description: service.description,
    alternates: {
      canonical: url,
      languages: {
        ...languages,
        "x-default": `/fr/services/${service.slug.fr}`,
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: "Studio Sentis",
      title: service.titre,
      description: service.description,
      locale: locale === "fr" ? "fr_CA" : "en_CA",
      alternateLocale: locale === "fr" ? "en_CA" : "fr_CA",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Studio Sentis" }],
    },
    twitter: {
      card: "summary_large_image",
      title: service.titre,
      description: service.description,
      images: ["/og.png"],
    },
    robots: SITE_URL_IS_PLACEHOLDER ? { index: false, follow: false } : undefined,
  };
}

/**
 * Trois nœuds par page, et pas un de plus que ce qui est lisible à l'écran.
 *
 * - `Service` — le métier, son prix, sa zone, rattaché par `@id` à
 *   l'entreprise déclarée sur l'accueil. Deux déclarations indépendantes du
 *   même commerce valent moins qu'une seule à laquelle tout renvoie.
 * - `FAQPage` — les questions de la page. Elles sont balisées **parce
 *   qu'elles sont affichées** : baliser une question invisible est
 *   exactement ce que les règles de Google interdisent.
 * - `BreadcrumbList` — Accueil › Services › ce métier.
 *
 * `offers` porte le prix affiché sur la page. Le déclarer n'ajoute aucune
 * promesse : il est écrit en toutes lettres trois paragraphes plus haut, et
 * la page rappelle que seule la soumission écrite engage.
 */
export function donneesService(locale: Locale, service: ServiceDetail) {
  const d = DICT[locale];
  const url = `${SITE_URL}/${locale}/services/${service.slug[locale]}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.h1,
        description: service.description,
        serviceType: service.h1,
        provider: { "@id": ID_ENTREPRISE },
        areaServed: BUSINESS.areaServed.map((name) => ({
          "@type": "AdministrativeArea",
          name,
        })),
        availableLanguage: BUSINESS.languages,
        offers: {
          "@type": "Offer",
          name: service.forfait,
          price: service.montant,
          priceCurrency: "CAD",
          url,
          availability: "https://schema.org/InStock",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: service.inclusTitre,
          itemListElement: service.inclus.map((livrable) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: livrable },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#questions`,
        inLanguage: locale === "fr" ? "fr-CA" : "en-CA",
        isPartOf: { "@id": ID_SITE },
        mainEntity: service.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.r },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#ariane`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: d.nav.accueil,
            item: `${SITE_URL}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: d.nav.services,
            item: `${SITE_URL}/${locale}/services`,
          },
          { "@type": "ListItem", position: 3, name: service.h1, item: url },
        ],
      },
    ],
  };
}
