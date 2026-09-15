"use client";

import { useSyncExternalStore } from "react";

import { NumberTicker } from "@/components/ui/number-ticker";

const subscribe = () => () => {};

/**
 * NumberTicker rend `startValue` (0) côté serveur et ne compte qu'une fois
 * entré dans le champ. Sur une page qui affirme que ses chiffres ne peuvent
 * pas mentir, livrer « 0 » à la place de « 37 » dans le HTML — donc sans
 * JavaScript, et pour les robots d'indexation — est un défaut, pas un détail
 * d'animation.
 *
 * On rend donc la vraie valeur au serveur, et on ne passe au compteur animé
 * qu'après hydratation, quand le JavaScript a prouvé qu'il tournait.
 */
export function Counter({ value }: { value: number }) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);

  if (!hydrated) {
    return <span className="inline-block tabular-nums">{value}</span>;
  }

  // text-ink : le composant force text-black dark:text-white, ce qui ignore
  // les tokens du projet.
  return <NumberTicker value={value} className="text-ink!" />;
}
