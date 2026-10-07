import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Conteneur et rythme communs à toutes les pages du site. */
export function Zone({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-(--container-page) px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/**
 * Fonds de section : le papier, ou le blanc.
 *
 * Il y en avait six, dont quatre lavis de couleur — un par section, pour
 * qu'aucune page ne soit monotone. Le client les a jugés « comme un cahier de
 * couleurs » (2026-10-05), et il a raison sur le fond : une couleur qui
 * change à chaque section ne dit rien, elle décore. La couleur reste là où
 * elle signifie quelque chose — un titre, un chiffre, un pictogramme, un
 * bouton — et les photos portent le reste. Entre deux sections, un filet et
 * le passage du papier au blanc suffisent à marquer la coupure.
 */
const FONDS = {
  paper: "",
  blanc: "bg-surface border-rule border-y",
} as const;

export type Fond = keyof typeof FONDS;

export function Section({
  id,
  titre,
  chapo,
  tone = "paper",
  children,
}: {
  id?: string;
  titre?: string;
  chapo?: string;
  tone?: Fond;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", FONDS[tone])}>
      <Zone>
        {titre ? (
          <header className="mb-12 max-w-(--content-max)">
            <h2 className="font-display text-ink text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
              {titre}
            </h2>
            {chapo ? (
              <p className="text-ink-secondary mt-4 text-lg leading-relaxed text-pretty">
                {chapo}
              </p>
            ) : null}
          </header>
        ) : null}
        {children}
      </Zone>
    </section>
  );
}

/**
 * En-tête de page intérieure : plus court qu'un héros, mais pas plat.
 *
 * Pas de surtitre en capitales au-dessus du h1 : il répétait le titre mot pour
 * mot (« Réalisations » au-dessus de « Réalisations ») et l'état actif du menu
 * dit déjà où l'on se trouve.
 *
 * **Le témoin remplace le volume 3D.** Chaque page portait à droite de son
 * titre un nuage de points WebGL de sa couleur. Il disait qu'on avait changé
 * de page, mais rien de la page elle-même, et il coûtait une scène 3D par
 * visite. À sa place, un objet qui tient une promesse en direct — voir
 * `temoins.tsx`. Le titre, lui, n'a plus d'animation d'entrée : c'est le
 * premier texte de la page, il doit être là tout de suite.
 */
export function EnTetePage({
  titre,
  chapo,
  temoin,
}: {
  titre: string;
  chapo?: string;
  /** L'objet posé à droite du titre, sous le chapeau sur téléphone. */
  temoin?: ReactNode;
}) {
  return (
    <section className="border-rule relative overflow-hidden border-b py-14 sm:py-20">
      <Zone className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
        <div className="min-w-0">
          <h1 className="font-display text-ink max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
            {titre}
          </h1>
          {chapo ? (
            <p className="text-ink-secondary mt-6 max-w-(--content-max) text-lg leading-relaxed text-pretty sm:text-xl">
              {chapo}
            </p>
          ) : null}
        </div>
        {temoin ? <div className="lg:justify-self-end lg:pr-2">{temoin}</div> : null}
      </Zone>
    </section>
  );
}
