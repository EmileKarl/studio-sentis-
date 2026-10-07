import type { Locale } from "@/lib/i18n";

/**
 * Les dates que le site calcule, toutes à l'heure de Châteauguay.
 *
 * Le studio promet une date de livraison et un délai de réponse ; ces dates
 * sont donc calculées sur le calendrier du studio, pas sur celui du visiteur.
 * Un visiteur à Vancouver à 22 h lit encore « aujourd'hui » alors qu'il est
 * déjà demain à Châteauguay, et la promesse serait décalée d'un jour.
 *
 * D'où un jour civil représenté à **midi UTC** : à cette heure-là, aucun
 * fuseau habité ne change de date, et `getUTCDay` donne le bon jour de la
 * semaine sans dépendre du fuseau du navigateur.
 */
export const FUSEAU_STUDIO = "America/Toronto";

/** Le jour civil à Châteauguay pour un instant donné, à midi UTC. */
export function jourAuStudio(instant: number): Date {
  const parties = new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSEAU_STUDIO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const valeur = (type: string) =>
    parties.find((p) => p.type === type)?.value ?? "";
  return new Date(`${valeur("year")}-${valeur("month")}-${valeur("day")}T12:00:00Z`);
}

/**
 * Ajoute des jours **ouvrables** : samedi et dimanche ne comptent pas.
 *
 * Les jours fériés du Québec ne sont pas retirés. Le calcul peut donc
 * annoncer un jour trop tôt la semaine de la fête nationale ou de Noël ; la
 * soumission écrite, elle, les compte, et c'est elle qui engage.
 */
export function ajouterJoursOuvrables(jour: Date, jours: number): Date {
  const d = new Date(jour);
  let restants = jours;
  while (restants > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    const j = d.getUTCDay();
    if (j !== 0 && j !== 6) restants -= 1;
  }
  return d;
}

const LANGUE = { fr: "fr-CA", en: "en-CA" } as const;

/** Formate un jour produit par `jourAuStudio`, sans glisser de fuseau. */
export function formaterJour(
  jour: Date,
  locale: Locale,
  options: Intl.DateTimeFormatOptions,
): string {
  return jour.toLocaleDateString(LANGUE[locale], { ...options, timeZone: "UTC" });
}

/** L'heure qu'il est à Châteauguay, dans la langue de la page. */
export function heureAuStudio(instant: number, locale: Locale): string {
  return new Date(instant).toLocaleTimeString(LANGUE[locale], {
    hour: "numeric",
    minute: "2-digit",
    timeZone: FUSEAU_STUDIO,
  });
}
