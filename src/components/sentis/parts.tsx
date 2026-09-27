import type { ReactNode } from "react";

import { Reveal3D, Scene3D, type Variante3D } from "@/components/motion";

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
 * Fonds de section.
 *
 * Le site n'avait que deux fonds, crème et sable : juste, mais monotone sur
 * cinq pages. Ces teintes très pâles donnent une couleur propre à chaque
 * section. Elles sont définies et mesurées dans `src/styles/sentis.css`, et
 * `npm run verify:teintes` refuse toute valeur qui ferait passer une couleur de
 * texte sous 4,5:1.
 */
const FONDS = {
  paper: "",
  sand: "bg-surface-2 border-rule border-y",
  sauge: "bg-teinte-sauge border-rule border-y",
  ciel: "bg-teinte-ciel border-rule border-y",
  argile: "bg-teinte-argile border-rule border-y",
  ocre: "bg-teinte-ocre border-rule border-y",
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
 */
export function EnTetePage({
  titre,
  chapo,
  scene,
}: {
  titre: string;
  chapo?: string;
  /**
   * Chaque page intérieure a son volume : c'est ce qui fait qu'on sait avoir
   * changé de page avant même d'avoir lu le titre.
   */
  scene?: Variante3D;
}) {
  return (
    <section className="border-rule relative overflow-hidden border-b py-16 sm:py-24">
      {scene ? (
        <Scene3D
          variante={scene}
          alpha={0.6}
          decalage={0.42}
          zoom={0.82}
          scroll={0.45}
          className="[mask-image:radial-gradient(ellipse_at_80%_50%,white,transparent_72%)]"
        />
      ) : null}
      <Zone className="relative">
        <Reveal3D depuis="bas" distance={80} angle={10}>
          <h1 className="font-display text-ink max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
            {titre}
          </h1>
        </Reveal3D>
        {chapo ? (
          <p className="text-ink-secondary mt-6 max-w-(--content-max) text-lg leading-relaxed text-pretty">
            {chapo}
          </p>
        ) : null}
      </Zone>
    </section>
  );
}

/** Panneau plein écran d'une séquence horizontale, aux couleurs de Sentis. */
export function PanneauSentis({
  tone = "paper",
  titre,
  corps,
}: {
  tone?: Fond | "ink" | "signal";
  titre: string;
  corps: string;
}) {
  // Les deux fonds soutenus renversent le texte ; les teintes pâles le gardent
  // en encre, exactement comme le reste du site.
  const soutenu = tone === "ink" || tone === "signal";
  const fondsPanneau: Record<string, string> = {
    ink: "bg-ink text-paper",
    signal: "bg-signal-aa text-white",
    paper: "bg-paper text-ink",
    sand: "bg-surface-2 text-ink",
    sauge: "bg-teinte-sauge text-ink",
    ciel: "bg-teinte-ciel text-ink",
    argile: "bg-teinte-argile text-ink",
    ocre: "bg-teinte-ocre text-ink",
  };
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col justify-center px-6 sm:px-12 lg:px-20",
        fondsPanneau[tone],
      )}
    >
      <h2
        className={cn(
          "font-display max-w-[15ch] text-4xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl",
          soutenu ? "text-inherit" : "text-ink",
        )}
      >
        {titre}
      </h2>
      <p
        className={cn(
          "mt-7 max-w-[40ch] text-base leading-relaxed text-pretty sm:text-lg",
          soutenu ? "text-inherit" : "text-ink-secondary",
        )}
      >
        {corps}
      </p>
    </div>
  );
}
