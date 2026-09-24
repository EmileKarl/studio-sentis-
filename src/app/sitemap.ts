import type { MetadataRoute } from "next";

import { LOCALES } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

/**
 * Le site de l'agence et la vitrine technique sont deux publics : les deux
 * sont déclarés, mais les pages commerciales portent une priorité supérieure.
 * Les variantes de langue sont liées entre elles par `alternates`, sans quoi
 * un moteur traite /fr et /en comme deux pages concurrentes sur le même sujet.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const sentis = LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${SITE_URL}/${l}`]),
      ),
    },
  }));

  const nexus = [
    "/nexus",
    "/nexus/design-system",
    "/nexus/components",
    "/nexus/motion",
    "/nexus/gallery",
    "/nexus/dashboard",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...sentis, ...nexus];
}
