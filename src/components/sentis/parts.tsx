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
  tone?: "paper" | "sand";
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 sm:py-28",
        tone === "sand" && "bg-surface-2 border-rule border-y",
      )}
    >
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
}: {
  titre: string;
  chapo?: string;
}) {
  return (
    <section className="border-rule border-b py-16 sm:py-24">
      <Zone>
        <h1 className="font-display text-ink max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
          {titre}
        </h1>
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
  tone?: "paper" | "ink" | "signal" | "sand";
  titre: string;
  corps: string;
}) {
  const soutenu = tone === "ink" || tone === "signal";
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col justify-center px-6 sm:px-12 lg:px-20",
        tone === "ink" && "bg-ink text-paper",
        tone === "signal" && "bg-signal-aa text-white",
        tone === "sand" && "bg-surface-2 text-ink",
        tone === "paper" && "bg-paper text-ink",
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
