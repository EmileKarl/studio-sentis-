"use client";

import type { Dict, Locale } from "@/lib/i18n";
import {
  ajouterJoursOuvrables,
  formaterJour,
  heureAuStudio,
  jourAuStudio,
} from "@/lib/dates";
import { useMinute } from "@/components/sentis/temoin-heure";

/** Contact : le reçu. L'heure qu'il est au studio, et la réponse promise. */
export function TemoinReponse({
  locale,
  textes,
}: {
  locale: Locale;
  textes: Dict["temoins"]["reponse"];
}) {
  const maintenant = useMinute();
  const heure = maintenant === null ? null : heureAuStudio(maintenant, locale);
  const limite =
    maintenant === null
      ? null
      : formaterJour(ajouterJoursOuvrables(jourAuStudio(maintenant), 2), locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
        });

  return (
    <figure className="temoin-objet bg-surface text-ink w-full max-w-[19rem] rounded-md px-6 pt-5 pb-5 sm:w-[20rem] sm:max-w-none">
      <p className="font-display text-base font-semibold">{textes.titre}</p>
      {/* L'heure change toute seule : elle est tenue hors de l'arbre
          d'accessibilité, sinon un lecteur d'écran la relirait à chaque
          minute. La date limite, elle, est lue normalement. */}
      <p aria-hidden className="mt-3 min-h-[4.25rem]">
        <span className="font-display block text-5xl leading-none font-semibold tracking-tight whitespace-nowrap tabular-nums">
          {heure}
        </span>
        <span className="text-ink-secondary mt-1.5 block text-sm">
          {heure ? textes.heure : null}
        </span>
      </p>
      <div aria-hidden className="border-rule my-4 border-t border-dashed" />
      <p className="text-ink-secondary text-sm">{textes.avant}</p>
      <p className="font-display text-accent-bleu mt-0.5 min-h-7 text-xl font-semibold text-pretty">
        {limite}
      </p>
      <figcaption className="text-ink-muted mt-3 text-xs">{textes.note}</figcaption>
    </figure>
  );
}
