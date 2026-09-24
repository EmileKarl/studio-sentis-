import type { MetadataRoute } from "next";

import { SITE_URL, SITE_URL_IS_PLACEHOLDER } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Tant que le domaine réel n'est pas connu, on n'invite pas les moteurs à
  // indexer une URL d'exemple : mieux vaut un site absent qu'un site indexé
  // sous une adresse fausse, qu'il faudrait ensuite faire désindexer.
  if (SITE_URL_IS_PLACEHOLDER) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
