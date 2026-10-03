/**
 * Tokens de motion côté JavaScript.
 *
 * `src/styles/motion.css` reste l'autorité visuelle : ces constantes en sont le
 * miroir, parce que Motion a besoin de nombres et de tableaux, pas de chaînes
 * CSS. Les deux fichiers sont vérifiés identiques par
 * `tests/motion-tokens-sync.mjs`, lancé avec `npm run verify:tokens` — modifier
 * l'un sans l'autre fait échouer ce contrôle.
 */

/** Durées, en secondes (Motion) ; motion.css les exprime en millisecondes. */
export const DURATION = {
  instant: 0.09,
  fast: 0.16,
  base: 0.24,
  slow: 0.42,
  slower: 0.7,
} as const;

/** Courbes, en points de contrôle cubic-bezier. Aucun rebond. */
export const EASE = {
  out: [0.22, 1, 0.36, 1],
  in: [0.64, 0, 0.78, 0],
  inOut: [0.65, 0, 0.35, 1],
} as const;

/** Décalage entre éléments d'une même séquence, en secondes. */
export const STAGGER = {
  tight: 0.04,
  base: 0.07,
  loose: 0.12,
} as const;

/** Distance de déplacement, en pixels. Courte : au-delà, cela lit comme un
 *  reflux de mise en page plutôt que comme une apparition. */
export const TRAVEL = {
  sm: 8,
  md: 16,
  lg: 28,
} as const;

export type Direction = "up" | "down" | "left" | "right" | "none";

/** Décalage initial d'une entrée, selon sa direction. */
export function offsetFor(direction: Direction, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    case "none":
      return {};
  }
}
