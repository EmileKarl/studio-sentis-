import type { Metadata } from "next";

import { DICT, LOCALES, type Locale } from "@/lib/i18n";
import { SITE_URL, SITE_URL_IS_PLACEHOLDER } from "@/lib/site";

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
 * Ce qu'elle pose, pour chaque page :
 *
 * - une **canonique** qui pointe sur elle-même ;
 * - les **alternates de langue**, `fr` et `en`, plus `x-default` sur le
 *   français — le studio est à Châteauguay, son marché premier est
 *   francophone ;
 * - les balises **Open Graph** et **Twitter** de la page, pas celles du site ;
 * - le garde-fou `noindex` tant que le domaine n'est pas choisi.
 */
export function metadonneesPage({
  locale,
  chemin,
  titre,
  description,
}: {
  locale: Locale;
  /** Chemin sous la langue, `""` pour l'accueil, `"/services"` sinon. */
  chemin: string;
  titre: string;
  description: string;
}): Metadata {
  const url = `/${locale}${chemin}`;

  // Les deux langues partagent leurs segments d'URL : /fr/services et
  // /en/services. Si cela changeait, ce serait ici, à un seul endroit.
  const languages = Object.fromEntries(
    LOCALES.map((l) => [l, `/${l}${chemin}`]),
  ) as Record<Locale, string>;

  return {
    title: titre,
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
    robots: SITE_URL_IS_PLACEHOLDER ? { index: false, follow: false } : undefined,
  };
}

/**
 * Fil d'Ariane structuré pour une page intérieure.
 *
 * Google s'en sert pour afficher « Studio Sentis › Services » sous le lien de
 * résultat, à la place de l'URL. C'est du balisage, pas une promesse : il ne
 * décrit que des pages qui existent réellement.
 */
export function filAriane(locale: Locale, chemin: string, titre: string) {
  const d = DICT[locale];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: d.nav.accueil,
        // Absolu : `item` d'un fil d'Ariane structuré doit être une URL
        // complète, contrairement aux `alternates` de Next qui sont résolues
        // contre `metadataBase`.
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: titre,
        item: `${SITE_URL}/${locale}${chemin}`,
      },
    ],
  };
}
