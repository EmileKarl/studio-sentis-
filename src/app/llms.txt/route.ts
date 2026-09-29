import { DICT, LOCALES } from "@/lib/i18n";
import { BUSINESS, CONTACT_EMAIL, SITE_URL } from "@/lib/site";

/**
 * `/llms.txt` — index du site au format llmstxt.org.
 *
 * **Ce fichier n'est pas un levier de référencement, et il ne faut pas le
 * vendre comme tel.** Les preuves rassemblées par `AgriciDaniel/claude-seo`
 * dans `skills/seo-geo/references/llmstxt-evidence.md` sont sans ambiguïté :
 *
 * - Google écrit dans sa propre documentation que la recherche Google
 *   **ignore** ces fichiers, et qu'en créer un « ne nuira ni n'aidera » ;
 * - John Mueller a qualifié l'usage de découverte de « voie sans issue » ;
 * - une étude de journaux de serveur (OtterlyAI) mesure 0,1 % du trafic des
 *   robots d'IA sur `/llms.txt` ;
 * - sur les cinquante domaines les plus cités par les IA, un seul en publiait
 *   un (SE Ranking, 300 000 domaines).
 *
 * Il est publié quand même, pour deux raisons honnêtes et petites : la
 * catégorie « Agentic Browsing » de Lighthouse le vérifie, et un agent à qui
 * l'on donne l'adresse du studio y trouve en quinze lignes ce qu'il devrait
 * sinon deviner. Coût : un fichier statique. Ce n'est pas un pari sur l'avenir,
 * c'est le prix d'une option qui ne coûte rien.
 *
 * Il est régénéré depuis le dictionnaire : une page ajoutée au site y entre
 * sans qu'on y pense, et aucune formulation ne peut diverger de celle du site.
 */

export const dynamic = "force-static";

const CHEMINS = [
  "",
  "/services",
  "/realisations",
  "/a-propos",
  "/contact",
  "/mentions-legales",
  "/confidentialite",
] as const;

export function GET() {
  const fr = DICT.fr;

  const lignes = [
    `# ${BUSINESS.name}`,
    "",
    `> ${fr.seo[""].description}`,
    "",
    `${BUSINESS.name} est un studio de ${BUSINESS.city}, ${BUSINESS.regionName}, Canada.`,
    `Il conçoit des sites web, des applications et des identités visuelles.`,
    `Zone desservie : ${BUSINESS.areaServed.join(", ")}, et à distance.`,
    `Langues : français et anglais. Les prix sont affichés sur le site, en dollars canadiens.`,
    `Contact : ${CONTACT_EMAIL}`,
    "",
    "## Pages (français)",
    "",
    ...CHEMINS.map(
      (chemin) =>
        `- [${fr.seo[chemin].titre}](${SITE_URL}/fr${chemin}) : ${fr.seo[chemin].description}`,
    ),
    "",
    "## Pages (English)",
    "",
    ...CHEMINS.map(
      (chemin) =>
        `- [${DICT.en.seo[chemin].titre}](${SITE_URL}/en${chemin}) : ${DICT.en.seo[chemin].description}`,
    ),
    "",
    "## Notes",
    "",
    "- Les travaux présentés dans Réalisations sont des démonstrations conçues",
    "  par le studio, pas des mandats livrés à des clients. Aucune entreprise",
    "  réelle n'y est présentée comme cliente, et les noms qui y figurent sont",
    "  fictifs.",
    "- Les montants affichés sont des prix de départ. Seule une soumission",
    "  écrite engage le studio.",
    `- Langues disponibles : ${LOCALES.join(", ")}.`,
    "",
  ];

  return new Response(lignes.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
