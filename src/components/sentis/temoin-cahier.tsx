"use client";

import type { Dict, Locale } from "@/lib/i18n";
import { formaterJour, jourAuStudio } from "@/lib/dates";
import { useMinute } from "@/components/sentis/temoin-heure";

/** À propos : la page 1 du carnet, datée du jour où on la lit. */
export function TemoinCahier({
  locale,
  cahier,
}: {
  locale: Locale;
  cahier: Dict["pages"]["apropos"]["cahier"];
}) {
  const maintenant = useMinute();
  const date =
    maintenant === null
      ? null
      : formaterJour(jourAuStudio(maintenant), locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });

  return (
    <figure
      aria-hidden
      className="temoin-objet cahier-page w-full max-w-[19rem] -rotate-1 rounded-sm pt-[calc(var(--interligne)*2)] pr-5 pb-(--interligne) pl-14 sm:w-[22rem] sm:max-w-none lg:w-[25rem] lg:pr-7"
    >
      <p className="text-ink-muted absolute top-2 right-4 text-xs tabular-nums">
        {cahier.page}
      </p>
      {/* La date, sur deux lignes du cahier : le lieu, puis le jour, surligné
          comme au marqueur. Tant qu'elle n'est pas connue, les lignes restent
          vides mais gardent leur hauteur : rien ne saute à l'hydratation. */}
      <p className="font-display text-ink text-[1.0625rem] font-semibold lg:text-lg">
        {date ? cahier.lieu : "\u00a0"}
      </p>
      <p className="font-display text-ink text-[1.0625rem] font-semibold lg:text-lg">
        {date ? (
          <span className="bg-teinte-cyan px-1 whitespace-nowrap">{date}</span>
        ) : (
          "\u00a0"
        )}
      </p>
      <p className="h-(--interligne)" />
      <p className="flex h-(--interligne) items-end pb-1">
        <span className="curseur bg-ink inline-block h-5 w-0.5" />
      </p>
    </figure>
  );
}
