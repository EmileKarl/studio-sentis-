"use client";

import type { Dict, Locale } from "@/lib/i18n";
import { ajouterJoursOuvrables, formaterJour, jourAuStudio } from "@/lib/dates";
import { useMinute } from "@/components/sentis/temoin-heure";

type Forfait = Dict["prix"]["forfaits"][number];

/** Services : le bon de livraison, si l'on commençait aujourd'hui. */
export function TemoinLivraison({
  locale,
  textes,
  forfaits,
}: {
  locale: Locale;
  textes: Dict["temoins"]["livraison"];
  forfaits: readonly Forfait[];
}) {
  const maintenant = useMinute();
  const jour = maintenant === null ? null : jourAuStudio(maintenant);

  return (
    <figure className="temoin-objet bg-surface text-ink w-full max-w-[19rem] rounded-md sm:w-[22rem] sm:max-w-none">
      <table className="w-full text-sm">
        <caption className="border-rule border-b px-5 pt-4 pb-3 text-left">
          <span className="font-display block text-base font-semibold">
            {textes.titre}
          </span>
          <span className="text-ink-muted mt-0.5 block min-h-5 text-xs tabular-nums">
            {jour
              ? formaterJour(jour, locale, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
              : null}
          </span>
        </caption>
        <thead className="sr-only">
          <tr>
            {textes.colonnes.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {forfaits.map((f) => (
            <tr key={f.cle} className="border-rule border-b border-dashed last:border-0">
              <th scope="row" className="py-2.5 pl-5 text-left font-normal">
                {f.nom}
              </th>
              <td className="text-ink-secondary px-3 py-2.5 text-right whitespace-nowrap tabular-nums">
                {f.prix}
              </td>
              <td className="text-accent-vert py-2.5 pr-5 text-right font-medium whitespace-nowrap tabular-nums">
                {jour
                  ? formaterJour(ajouterJoursOuvrables(jour, f.jours), locale, {
                      day: "numeric",
                      month: "short",
                    })
                  : " "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="text-ink-muted border-rule border-t border-dashed px-5 py-3 text-xs leading-relaxed text-pretty">
        {textes.note}
      </figcaption>
    </figure>
  );
}
