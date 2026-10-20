import type { MetadataRoute } from "next";

import { LOCALES } from "@/lib/i18n";
import { CLES_SERVICE, SERVICES_DETAIL } from "@/lib/services-detail";
import { IDENTITE_INCOMPLETE, SITE_URL } from "@/lib/site";

/**
 * Le site de l'agence et la vitrine technique sont deux publics : les deux
 * sont déclarés, mais les pages commerciales portent une priorité supérieure.
 * Les variantes de langue sont liées entre elles par `alternates`, sans quoi
 * un moteur traite /fr et /en comme deux pages concurrentes sur le même sujet.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pagesSentis = [
    "",
    "/services",
    "/realisations",
    "/a-propos",
    "/contact",
    "/confidentialite",
    // Les mentions légales n'entrent dans le plan du site qu'une fois
    // l'identité de l'exploitant renseignée : tant qu'elles affichent des
    // trous, elles se déclarent `noindex`, et déclarer dans un sitemap une
    // page qu'on demande par ailleurs de ne pas indexer est une contradiction
    // que la Search Console signale comme une erreur.
    ...(IDENTITE_INCOMPLETE ? [] : ["/mentions-legales"]),
  ];

  /** Les pages légales existent pour être trouvables, pas pour être mises en avant. */
  const PRIORITE_BASSE = ["/confidentialite", "/mentions-legales"];

  const sentis = LOCALES.flatMap((locale) =>
    pagesSentis.map((chemin) => ({
      url: `${SITE_URL}/${locale}${chemin}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: chemin === "" ? 1 : PRIORITE_BASSE.includes(chemin) ? 0.3 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}/${l}${chemin}`]),
        ),
      },
    })),
  );

  /**
   * Les quatre pages de métier.
   *
   * Elles ne peuvent pas rejoindre `pagesSentis` : contrairement au reste du
   * site, **leurs adresses diffèrent d'une langue à l'autre** —
   * `/fr/services/creation-de-logo` et `/en/services/logo-design`. Les
   * `alternates` doivent donc être construites métier par métier, sinon le
   * plan du site déclarerait des adresses anglaises qui n'existent pas.
   *
   * Priorité 0,9 : au-dessus des pages intérieures, en dessous de l'accueil.
   * Ce sont elles qu'on veut voir sortir sur « création de logo ».
   */
  const services = LOCALES.flatMap((locale) =>
    CLES_SERVICE.map((cle) => {
      const detail = SERVICES_DETAIL[locale][cle];
      return {
        url: `${SITE_URL}/${locale}/services/${detail.slug[locale]}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.9,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [
              l,
              `${SITE_URL}/${l}/services/${SERVICES_DETAIL[l][cle].slug[l]}`,
            ]),
          ),
        },
      };
    }),
  );

  return [...sentis, ...services];
}
