import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Entrée au défilement, décidée avec le cadre plutôt qu'à l'habitude.
 *
 * Les quatre questions, dans l'ordre :
 *
 * 1. **Faut-il animer ?** Oui, mais à peine. Un visiteur voit cette page une
 *    ou deux fois ; le seul but légitime est d'éviter qu'un bloc surgisse d'un
 *    coup. Ce n'est pas un but d'ornement, c'est un but de confort.
 * 2. **Quel but ?** Celui-là, et aucun autre. `Reveal3D`, qui servait ici
 *    avant, inclinait chaque bloc de 12° et le reculait de 80 px sur l'axe de
 *    profondeur. Posée sur un paragraphe, une inclinaison 3D ne répond à
 *    aucune question : elle est là parce qu'elle est jolie.
 * 3. **Quelle courbe ?** L'élément entre, donc `--ease-out`. Jamais `ease-in`
 *    sur une entrée : elle démarre lentement, c'est-à-dire exactement au
 *    moment où l'œil regarde.
 * 4. **Quelle durée ?** `--duration-slow`, 420 ms.
 *
 * **Plus une ligne de JavaScript, et c'est une correction de bogue.**
 *
 * La version précédente posait `opacity: 0` côté serveur et attendait qu'un
 * `IntersectionObserver` vienne la lever. Entre le moment où le navigateur
 * peint la page et celui où il a fini d'exécuter 877 ko de JavaScript, le
 * texte était donc littéralement invisible. Mesuré, JavaScript bloqué : 88
 * textes dans ce cas sur le site, dont quatre dans le premier écran de
 * l'accueil — la ligne de territoire, le sous-titre, le bouton de soumission
 * et le lien vers les réalisations. Sur un téléphone, ça se voit.
 *
 * Tout est maintenant dans `scroll-driven.css` : l'animation part avec la
 * page, le fil principal ne peut pas la retarder, et elle se termine toujours.
 * Le composant n'a plus d'état, plus d'effet, plus de `"use client"` — il ne
 * pose qu'une classe et deux variables.
 */
export function Entree({
  children,
  className,
  delai = 0,
  distance,
}: {
  children: ReactNode;
  className?: string;
  /** Décalage en millisecondes, pour une suite de blocs. Court : au-delà de
   *  80 ms entre deux éléments, l'attente se lit comme une lenteur. */
  delai?: number;
  /** Course verticale en pixels. Par défaut `--travel-md`, 16 px. */
  distance?: number;
}) {
  const style: CSSProperties = {};
  if (delai) (style as Record<string, string>)["--entree-delai"] = `${delai}ms`;
  if (distance !== undefined)
    (style as Record<string, string>)["--entree-y"] = `${distance}px`;

  return (
    <div
      // Le filet sous `<noscript>` (voir `app/layout.tsx`) reste utile pour
      // les composants qui animent encore en JavaScript ; celui-ci n'en a
      // plus besoin.
      data-entree-animee
      className={cn("entree", className)}
      style={Object.keys(style).length ? style : undefined}
    >
      {children}
    </div>
  );
}
