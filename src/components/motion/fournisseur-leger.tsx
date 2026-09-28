"use client";

import { LazyMotion, domAnimation } from "motion/react";
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
 * Ce fichier-ci ne sert que le site de l'agence, avec **`domAnimation`** :
 * animations, variantes, entrées au scroll, gestes de survol. C'est tout ce
 * dont il a besoin.
 *
 * Les deux jeux vivent dans deux fichiers séparés, et ce n'est pas du rangement
 * : un seul module qui importait `domAnimation` et `domMax` les faisait
 * atterrir dans le même morceau, et le site de l'agence chargeait les 25 ko du
 * jeu complet pour n'en utiliser que 15. Mesuré : le chemin critique était
 * passé de 889 à 932 ko.
 *
 * `strict` est posé exprès : il fait échouer bruyamment tout usage de
 * `motion.div` resté dans la sous-arborescence. Sans lui, un oubli
 * réintroduirait silencieusement le paquet complet et annulerait le gain.
 */
export function MotionLeger({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
