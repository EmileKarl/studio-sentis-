import type { MetadataRoute } from "next";

import { SITE_URL, SITE_URL_IS_PLACEHOLDER } from "@/lib/site";

/**
 * Politique d'exploration.
 *
 * Deux décisions y vivent, et la seconde est commerciale autant que technique.
 *
 * **1. Tant que le domaine n'est pas choisi, rien n'est indexé.** Mieux vaut un
 * site absent qu'un site indexé sous une adresse d'exemple, qu'il faudrait
 * ensuite faire désindexer à la main.
 *
 * **2. Les robots d'IA sont nommés, pas subis.** Ils se répartissent en deux
 * familles que le groupe `*` confond :
 *
 * - les robots de **recherche** (OAI-SearchBot, Claude-SearchBot,
 *   PerplexityBot) lisent le site pour le **citer** dans une réponse, avec un
 *   lien. Pour un studio qui n'a ni notoriété ni carnet d'adresses, c'est une
 *   porte d'entrée, pas une fuite ;
 * - les robots d'**entraînement** (GPTBot, ClaudeBot, CCBot, et les jetons de
 *   contrôle Google-Extended et Applebot-Extended) prennent le texte pour
 *   entraîner un modèle, sans lien retour.
 *
 * Les deux sont autorisés aujourd'hui. Le studio vend des sites, pas de la
 * prose : son texte n'a pas de valeur de rareté, et se fermer à
 * l'entraînement n'apporte rien tant qu'on cherche à se faire connaître.
 * Le jour où cette réponse change, il n'y a qu'à passer `ENTRAINEMENT` à
 * `false` — c'est pour cela que ces groupes sont écrits noir sur blanc plutôt
 * que laissés au groupe fourre-tout.
 */

/** Robots qui lisent le site pour le citer, avec un lien de retour. */
const RECHERCHE = ["OAI-SearchBot", "Claude-SearchBot", "PerplexityBot"];

/** Robots et jetons de contrôle qui gouvernent l'entraînement des modèles. */
const ENTRAINEMENT_AGENTS = [
  "GPTBot",
  "ClaudeBot",
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
];

/** Autoriser l'usage du texte du site pour entraîner des modèles. */
const ENTRAINEMENT = true;

export default function robots(): MetadataRoute.Robots {
  if (SITE_URL_IS_PLACEHOLDER) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: RECHERCHE, allow: "/" },
      ENTRAINEMENT
        ? { userAgent: ENTRAINEMENT_AGENTS, allow: "/" }
        : { userAgent: ENTRAINEMENT_AGENTS, disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
