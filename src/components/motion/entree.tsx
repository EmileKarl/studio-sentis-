"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

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
 *    aucune question : elle est là parce qu'elle est jolie, et on la voit à
 *    chaque section.
 * 3. **Quelle courbe ?** L'élément entre, donc `--ease-out`. Jamais `ease-in`
 *    sur une entrée : elle démarre lentement, c'est-à-dire exactement au
 *    moment où l'œil regarde.
 * 4. **Quelle durée ?** `--duration-base`, 240 ms. L'ancienne valait 700 ms.
 *
 * **Pourquoi en CSS et non en JavaScript.** Motion anime `y`, `z` et `rotateX`
 * sur le fil principal, via `requestAnimationFrame`. Cette page porte une
 * scène WebGL dans son en-tête : quand le fil principal est pris, ces entrées
 * sautent des images. Une transition CSS tourne hors du fil principal et ne
 * saute rien. L'observateur ne fait que poser un attribut — tout le reste est
 * du style, et les trois propriétés animées (`opacity`, `translate`, `scale`)
 * sont composées par le GPU.
 *
 * **`-40px` en marge basse, et c'est une valeur mesurée.** C'est le seuil
 * exact à partir duquel `tests/responsive-check.mjs` considère qu'un texte est
 * dans la fenêtre. Déclencher plus tard laisserait une bande où un texte est
 * visible à opacité 0 — le défaut que `97dfccb` a corrigé ailleurs sur le
 * site. Les deux valeurs sont les deux faces d'une seule décision.
 *
 * `prefers-reduced-motion` est traité globalement dans `motion.css`, qui écrase
 * les durées à 0,01 ms et les distances à 0. Il n'y a donc rien à faire ici, et
 * c'est voulu : une règle par composant finit par être oubliée dans l'un d'eux.
 */
export function Entree({
  children,
  className,
  delai = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Décalage en millisecondes, pour une suite de blocs. Court : au-delà de
   *  80 ms entre deux éléments, l'attente se lit comme une lenteur. */
  delai?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vu, setVu] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (!entree.isIntersecting) return;
        setVu(true);
        observateur.disconnect();
      },
      { rootMargin: "0px 0px -40px 0px" },
    );
    observateur.observe(element);
    return () => observateur.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      // Le filet sous `<noscript>` (voir `app/layout.tsx`) remet tout
      // `[data-entree-animee]` à son état final : sans JavaScript, la page est
      // lisible au lieu d'être une suite de blocs transparents.
      data-entree-animee
      data-vu={vu}
      style={delai ? { transitionDelay: `${delai}ms` } : undefined}
      className={cn(
        "translate-y-4 opacity-0 transition-[opacity,translate] duration-(--duration-base) ease-(--ease-out)",
        "data-[vu=true]:translate-y-0 data-[vu=true]:opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
