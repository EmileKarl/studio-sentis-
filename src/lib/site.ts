/**
 * Identité publique du site.
 *
 * Le domaine n'est PAS écrit en dur : il n'est pas encore choisi. Tant que
 * NEXT_PUBLIC_SITE_URL n'est pas défini, la valeur de repli est explicitement
 * un exemple, de sorte qu'une URL inventée ne puisse pas se retrouver dans un
 * sitemap ou une balise canonique sans qu'on s'en aperçoive.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.invalid";

export const SITE_URL_IS_PLACEHOLDER = !process.env.NEXT_PUBLIC_SITE_URL;

export const CONTACT_EMAIL = "Emiletchesseu@gmail.com";

export const BUSINESS = {
  name: "Studio Sentis",
  city: "Châteauguay",
  region: "QC",
  regionName: "Québec",
  country: "CA",
  languages: ["fr-CA", "en-CA"],
  /** Zone réellement desservie, telle que consignée dans PRODUCT.md. */
  areaServed: ["Châteauguay", "Montérégie", "Grand Montréal", "Québec"],
} as const;

/**
 * Identité de l'exploitant, telle qu'elle doit figurer dans les mentions
 * légales.
 *
 * Rien n'est inventé ici. Le nom légal, le NEQ, l'adresse et l'hébergeur sont
 * des faits administratifs : les écrire au jugé dans un document qui engage
 * l'entreprise serait pire que de ne rien écrire. Tant qu'une valeur manque,
 * la page l'affiche comme un trou visible — « à compléter » — et se met en
 * `noindex`, exactement comme le site entier tant que le domaine n'est pas
 * choisi. Un document légal à moitié faux ne doit pas pouvoir se retrouver
 * dans un moteur de recherche sans que quelqu'un s'en aperçoive.
 *
 * Elles se remplissent par variables d'environnement, sans toucher au code.
 */
export const EXPLOITANT = {
  /** Nom légal sous lequel l'entreprise est immatriculée au Québec. */
  nomLegal: process.env.NEXT_PUBLIC_NOM_LEGAL ?? "",
  /** Numéro d'entreprise du Québec (Registraire des entreprises). */
  neq: process.env.NEXT_PUBLIC_NEQ ?? "",
  /** Adresse de l'établissement, telle qu'inscrite au registre. */
  adresse: process.env.NEXT_PUBLIC_ADRESSE ?? "",
  /** Hébergeur du site, une fois le déploiement arrêté. */
  hebergeur: process.env.NEXT_PUBLIC_HEBERGEUR ?? "",
} as const;

/** Vrai tant qu'un des champs ci-dessus manque. */
export const IDENTITE_INCOMPLETE = Object.values(EXPLOITANT).some((v) => !v);

/**
 * Date de dernière révision des textes légaux, au format ISO.
 *
 * Elle est ici et non dans les traductions pour qu'il n'y ait qu'un endroit à
 * changer, et pour qu'on ne puisse pas la laisser diverger entre le français
 * et l'anglais. **À relever chaque fois que le texte des pages légales
 * change** — c'est la seule information de ces pages qu'un visiteur peut
 * vérifier, et une date périmée les décrédibilise entièrement.
 */
export const LEGAL_MAJ = "2026-09-29";
