import type { Metadata } from "next";

import { DICT, LOCALES, type Locale } from "@/lib/i18n";
import {
  BUSINESS,
  ID_ENTREPRISE,
  ID_SITE,
  SITE_URL,
  SITE_URL_IS_PLACEHOLDER,
} from "@/lib/site";

/**
 * Métadonnées d'une page du site de l'agence.
 *
 * Ce fichier existe à cause d'un défaut précis, mesuré sur le site servi :
 * les quatre pages intérieures ne définissaient que leur titre et leur
 * description, et **héritaient donc du reste de la mise en page**. Résultat,
 * `/fr/services` déclarait :
 *
 *     <link rel="canonical" href="https://…/fr" />
 *
 * — c'est-à-dire « cette page est un doublon de l'accueil, ne l'indexez pas ».
 * Les quatre pages intérieures se sabordaient, et leurs balises Open Graph
 * annonçaient toutes le titre et l'URL de l'accueil.
 *
 * Passer par une fonction plutôt que recopier un objet dans chaque page n'est
 * pas de l'élégance : c'est la seule façon qu'une page nouvelle ne puisse pas
 * oublier sa canonique.
 *
 * Deuxième défaut, trouvé en repassant le site à la grille d'audit de
 * `AgriciDaniel/claude-seo` : les quatre pages intérieures reprenaient leur
 * titre affiché tel quel. `<title>Services</title>`, seul, sans marque, sans
 * métier et sans ville — juste à l'écran, où le menu et le logo disent le
 * reste, absurde dans une page de résultats. Et les deux accueils portaient
 * `— NEXUS UI`, le nom du gabarit technique, hérité du `template` de la mise
 * en page racine.
 *
 * D'où `title: { absolute }` : cette forme ignore explicitement tout `template`
 * ancestral. Le comportement observé de la chaîne de `template` de Next ne
 * suit pas l'intuition (l'accueil héritait du suffixe, les pages intérieures
 * non) ; plutôt que de raisonner dessus, on l'écarte.
 *
 * Les textes eux-mêmes vivent dans `DICT[locale].seo`, par chemin : une page
 * ne peut plus oublier son titre de recherche, et `npm run verify:seo` refuse
 * un titre hors de 50-60 caractères ou une description hors de 150-160.
 *
 * Ce qu'elle pose, pour chaque page :
 *
 * - un **titre** et une **description** écrits pour la recherche, pas repris
 *   de l'affichage ;
 * - une **canonique** qui pointe sur elle-même ;
 * - les **alternates de langue**, `fr` et `en`, plus `x-default` sur le
 *   français — le studio est à Châteauguay, son marché premier est
 *   francophone ;
 * - les balises **Open Graph** et **Twitter** de la page, pas celles du site ;
 * - le garde-fou `noindex` tant que le domaine n'est pas choisi.
 */
/** Chemins du site de l'agence, tels que `DICT[locale].seo` les connaît. */
export type CheminSeo = keyof (typeof DICT)["fr"]["seo"];

export function metadonneesPage({
  locale,
  chemin,
  noindex = false,
}: {
  locale: Locale;
  /** Chemin sous la langue, `""` pour l'accueil, `"/services"` sinon. */
  chemin: CheminSeo;
  /**
   * Retire la page des moteurs, en plus du garde-fou global sur le domaine.
   * Les pages légales s'en servent tant que l'identité de l'exploitant n'est
   * pas renseignée : un document qui engage l'entreprise et qui comporte des
   * trous ne doit pas pouvoir être indexé par inadvertance.
   */
  noindex?: boolean;
}): Metadata {
  const url = `/${locale}${chemin}`;
  const { titre, description } = DICT[locale].seo[chemin];

  // Les deux langues partagent leurs segments d'URL : /fr/services et
  // /en/services. Si cela changeait, ce serait ici, à un seul endroit.
  const languages = Object.fromEntries(
    LOCALES.map((l) => [l, `/${l}${chemin}`]),
  ) as Record<Locale, string>;

  return {
    // `absolute` : voir l'en-tête de ce fichier. Sans lui, la mise en page
    // racine ajoute « — NEXUS UI » au titre d'une page d'agence.
    title: { absolute: titre },
    description,
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": `/fr${chemin}` },
    },
    openGraph: {
      type: "website",
      url,
      siteName: "Studio Sentis",
      title: titre,
      description,
      locale: locale === "fr" ? "fr_CA" : "en_CA",
      alternateLocale: locale === "fr" ? "en_CA" : "fr_CA",
      images: [
        { url: "/og.png", width: 1200, height: 630, alt: "Studio Sentis" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titre,
      description,
      images: ["/og.png"],
    },
    robots:
      SITE_URL_IS_PLACEHOLDER || noindex
        ? { index: false, follow: false }
        : undefined,
  };
}

/**
 * Données structurées d'une page intérieure.
 *
 * Elles ne se limitent plus au fil d'Ariane. Le passage à la grille d'audit de
 * `AgriciDaniel/claude-seo` a montré que les quatre pages intérieures ne
 * déclaraient qu'un `BreadcrumbList` : un moteur arrivant sur `/fr/services`
 * depuis une recherche y trouvait le chemin de la page et rien sur
 * l'entreprise, alors que toute la valeur locale du site est là.
 *
 * Le nœud `WebPage` répare cela sans rien redéclarer : il se rattache par
 * `@id` à l'entreprise et au site décrits sur l'accueil. Deux déclarations
 * indépendantes du même commerce, si elles divergent d'un caractère, valent
 * moins qu'une seule à laquelle tout le monde renvoie.
 */
export function donneesPage(
  locale: Locale,
  chemin: string,
  titre: string,
  /**
   * Type de page. Schema.org en distingue quelques-uns que Google reconnaît,
   * et ils ne coûtent rien : une page de contact annoncée comme telle est
   * comprise comme telle. Le repli `WebPage` convient au reste.
   */
  type: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" = "WebPage",
) {
  const d = DICT[locale];
  const url = `${SITE_URL}/${locale}${chemin}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${url}#page`,
        url,
        name: titre,
        inLanguage: locale === "fr" ? "fr-CA" : "en-CA",
        isPartOf: { "@id": ID_SITE },
        about: { "@id": ID_ENTREPRISE },
        publisher: { "@id": ID_ENTREPRISE },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#ariane`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: d.nav.accueil,
            // Absolu : `item` d'un fil d'Ariane structuré doit être une URL
            // complète, contrairement aux `alternates` de Next qui sont
            // résolues contre `metadataBase`.
            item: `${SITE_URL}/${locale}`,
          },
          { "@type": "ListItem", position: 2, name: titre, item: url },
        ],
      },
    ],
  };
}

/**
 * Les quatre métiers, déclarés comme des services rendus par l'entreprise.
 *
 * Le motif vient des références de `claude-seo` pour les entreprises de
 * service à domicile : un nœud `Service` par prestation, rattaché à son
 * `provider` et à sa zone. Pour une recherche comme « identité visuelle
 * Montérégie », c'est ce qui relie le métier au lieu et à l'entreprise,
 * alors que la page ne portait jusqu'ici qu'un fil d'Ariane.
 *
 * Les textes sont ceux de la page. Rien n'est déclaré qui n'y soit lisible.
 */
export function donneesServices(locale: Locale) {
  const d = DICT[locale];
  const url = `${SITE_URL}/${locale}/services`;

  return {
    "@context": "https://schema.org",
    "@graph": d.pages.services.items.map((item, i) => ({
      "@type": "Service",
      "@id": `${url}#service-${i + 1}`,
      name: item.nom,
      description: item.detail,
      serviceType: item.nom,
      provider: { "@id": ID_ENTREPRISE },
      areaServed: BUSINESS.areaServed.map((name) => ({
        "@type": "AdministrativeArea",
        name,
      })),
      availableLanguage: BUSINESS.languages,
      // Les livrables sont écrits en toutes lettres sur la page : les répéter
      // en balisage ne crée aucune promesse nouvelle.
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: item.nom,
        itemListElement: item.livrables.map((livrable) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: livrable },
        })),
      },
    })),
  };
}
