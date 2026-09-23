"use client";

import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Recomposition de grille.
 *
 * La grille elle-même est l'animation. Les mêmes douze blocs se réorganisent
 * entre cinq compositions du §3.1 H — 12 colonnes, bento, split, éditoriale,
 * masonry — et Motion mesure la position avant/après pour interpoler en
 * transform (FLIP). Aucun bloc n'est démonté ni remonté : c'est le même
 * élément qui se déplace, ce qui préserve le focus clavier et la sélection de
 * texte pendant la transition.
 *
 * Pour une direction suisse, c'est l'effet le plus juste possible : ce qui est
 * mis en scène n'est pas un ornement ajouté par-dessus la grille, c'est la
 * grille.
 */

const LAYOUTS = {
  "12-col": "Grille 12 colonnes",
  bento: "Bento",
  split: "Split",
  editorial: "Éditoriale",
  masonry: "Masonry",
} as const;

type LayoutKey = keyof typeof LAYOUTS;

/** Placement de chaque bloc, par composition. `null` = bloc retiré. */
const PLACEMENT: Record<LayoutKey, (string | null)[]> = {
  "12-col": Array.from({ length: 12 }, () => "col-span-3 row-span-1"),
  bento: [
    "col-span-6 row-span-2",
    "col-span-6 row-span-1",
    "col-span-3 row-span-1",
    "col-span-3 row-span-1",
    "col-span-4 row-span-1",
    "col-span-4 row-span-1",
    "col-span-4 row-span-1",
    "col-span-12 row-span-1",
    null,
    null,
    null,
    null,
  ],
  split: [
    "col-span-5 row-span-3",
    "col-span-7 row-span-1",
    "col-span-7 row-span-1",
    "col-span-7 row-span-1",
    "col-span-12 row-span-1",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  editorial: [
    "col-span-8 row-span-2",
    "col-span-4 row-span-1",
    "col-span-4 row-span-1",
    "col-span-3 row-span-1",
    "col-span-3 row-span-1",
    "col-span-6 row-span-1",
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  masonry: [
    "col-span-4 row-span-2",
    "col-span-4 row-span-1",
    "col-span-4 row-span-3",
    "col-span-4 row-span-1",
    "col-span-4 row-span-2",
    "col-span-4 row-span-1",
    "col-span-8 row-span-1",
    null,
    null,
    null,
    null,
    null,
  ],
};

export function GridRecompose() {
  const [layout, setLayout] = useState<LayoutKey>("12-col");
  const reduced = useReducedMotion();
  const placement = PLACEMENT[layout];

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Composition de la grille"
        className="border-rule mb-6 flex flex-wrap gap-0.5 border p-0.5"
      >
        {(Object.keys(LAYOUTS) as LayoutKey[]).map((key) => {
          const active = key === layout;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setLayout(key)}
              className={cn(
                "focus-visible:ring-signal rounded-xs px-3 py-1.5 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none",
                active
                  ? "bg-ink text-paper"
                  : "text-ink-secondary hover:bg-surface-2 hover:text-ink",
              )}
            >
              {LAYOUTS[key]}
            </button>
          );
        })}
      </div>

      <LayoutGroup>
        <div className="grid auto-rows-[3.5rem] grid-cols-12 gap-2">
          {placement.map((span, i) =>
            span === null ? null : (
              <motion.div
                key={i}
                layout={!reduced}
                layoutId={reduced ? undefined : `tile-${i}`}
                transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.6 }}
                className={cn(
                  "border-rule bg-surface flex items-end border p-2",
                  span,
                )}
              >
                <span className="text-ink-muted font-mono text-[11px] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.div>
            ),
          )}
        </div>
      </LayoutGroup>

      <p aria-live="polite" className="text-ink-muted mt-4 font-mono text-xs">
        {LAYOUTS[layout]} — {placement.filter(Boolean).length} blocs
      </p>
    </div>
  );
}
