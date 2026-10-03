"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useRef, useSyncExternalStore, type ReactNode } from "react";

import { DURATION, EASE } from "@/lib/motion";

/** S'abonner à rien : la valeur ne change jamais après l'hydratation. */
const rien = () => () => {};

/**
 * Transition de page du site de l'agence, en profondeur.
 *
 * `template.tsx` est remonté à chaque navigation, contrairement à
 * `layout.tsx` : c'est ce qui permet de rejouer l'animation à chaque page.
 *
 * Trois précautions, dont deux viennent de défauts déjà payés sur ce projet :
 *
 * 1. **Rien n'est animé au premier chargement.** `useSyncExternalStore` répond
 *    `false` au serveur et `true` une fois hydraté, donc `initial={false}` au
 *    rendu serveur : le HTML livré ne contient aucune opacité nulle. Un visiteur
 *    sans JavaScript verrait sinon une page entièrement vide — c'est exactement
 *    le défaut qui avait rendu le titre du héros invisible.
 * 2. **La transformation est effacée à la fin.** Un `transform` résiduel sur cet
 *    élément ferait de lui le bloc conteneur de ses descendants positionnés, et
 *    les séquences horizontales, qui tiennent sur `position: sticky`, ne
 *    colleraient plus.
 * 3. **`prefers-reduced-motion` coupe tout.** Le réglage global de `m.css`
 *    ne porte que sur les transitions CSS ; une animation pilotée en JavaScript
 *    doit le vérifier elle-même.
 * 4. **240 ms, pas davantage.** Une transition de page se paie à chaque clic et
 *    ne s'admire qu'une fois. Aucune animation de sortie non plus : Next ne
 *    monte la page suivante qu'après avoir démonté la précédente, une sortie
 *    n'ajouterait qu'un temps mort.
 */
export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const hydrate = useSyncExternalStore(
    rien,
    () => true,
    () => false,
  );

  if (reduced) return <>{children}</>;

  return (
    <div style={{ perspective: hydrate ? 1400 : undefined }}>
      <m.div
        ref={ref}
        initial={hydrate ? { opacity: 0, rotateX: 5, z: -140 } : false}
        animate={{ opacity: 1, rotateX: 0, z: 0 }}
        transition={{ duration: DURATION.base, ease: EASE.out }}
        onAnimationComplete={() => {
          const el = ref.current;
          if (!el) return;
          el.style.transform = "none";
          el.style.opacity = "";
          if (el.parentElement) el.parentElement.style.perspective = "none";
        }}
      >
        {children}
      </m.div>
    </div>
  );
}
