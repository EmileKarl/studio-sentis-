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
