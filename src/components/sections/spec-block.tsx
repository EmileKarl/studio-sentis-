import type { ReactNode } from "react";

/**
 * §6 — chaque composant présenté doit montrer son apparence, ses variantes,
 * ses états et sa règle d'accessibilité. Ce bloc impose ce contrat : on ne
 * peut pas afficher un composant sans dire comment il se comporte au clavier.
 */
export function SpecBlock({
  name,
  source,
  a11y,
  children,
}: {
  name: string;
  source: string;
  a11y: string;
  children: ReactNode;
}) {
  // min-w-0 : sans lui, l'article hérite de min-width:auto en tant qu'élément
  // de grille, et la piste se dimensionne sur la largeur minimale du tableau
  // qu'il contient (314px) — ce qui faisait déborder toutes les cartes de la
  // même rangée sous 375px.
  return (
    <article className="border-rule bg-paper min-w-0 border">
      <header className="border-rule bg-surface-2 flex flex-wrap items-baseline justify-between gap-2 border-b px-4 py-2.5">
        <h3 className="font-display text-ink text-sm font-semibold tracking-tight">
          {name}
        </h3>
        <code className="text-ink-muted font-mono text-[11px]">{source}</code>
      </header>
      <div className="flex min-h-28 flex-wrap items-center gap-3 p-4 sm:p-6 [&>*]:min-w-0">
        {children}
      </div>
      <footer className="border-rule border-t px-4 py-2.5">
        <p className="text-ink-muted max-w-(--content-max) text-xs text-pretty">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase">
            A11y
          </span>{" "}
          — {a11y}
        </p>
      </footer>
    </article>
  );
}
