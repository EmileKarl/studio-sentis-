"use client";

import { LazyMotion, domMax } from "motion/react";
import type { ReactNode } from "react";

/**
 * Chargement à la demande des fonctionnalités de Motion.
 *
 * Tous les composants animés du projet utilisent `m` — la version mince de
 * `motion`, qui ne sait rien faire toute seule. C'est ce fournisseur qui lui
 * apporte ses capacités. Mesuré sur la documentation de Motion : le composant
 * `motion` complet pèse 34 ko, contre 4,6 ko pour `m` plus 15 ko de
 * fonctionnalités `domAnimation`, ou 25 ko pour `domMax`.
 *
 * Ce fichier-ci sert la vitrine NEXUS et l'enveloppe applicative, avec
 * **`domMax`** : il ajoute à `domAnimation` les animations de mise en page
 * (`layout`) et le glisser-déposer. La recomposition de grille de la page
 * Design System en a besoin.
 *
 * Il est séparé du jeu léger pour que le site de l'agence, qui n'en a pas
 * l'usage, ne le charge jamais.
 *
 * `strict` est posé exprès : il fait échouer bruyamment tout usage de
 * `motion.div` resté dans la sous-arborescence. Sans lui, un oubli
 * réintroduirait silencieusement le paquet complet et annulerait le gain.
 */
export function MotionComplet({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
