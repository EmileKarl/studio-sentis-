import type { MetadataRoute } from "next";

import { LOCALES } from "@/lib/i18n";
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

  return sentis;
}
