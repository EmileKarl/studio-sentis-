"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";

import { DURATION, EASE } from "@/lib/motion";

/**
 * Entrée en profondeur : l'élément arrive depuis l'arrière de la scène et se
 * remet d'aplomb. C'est la même mécanique que `Reveal`, en trois dimensions.
 *
 * Deux garde-fous, appris à ce projet :
 *
 * - Le déclencheur part dès que l'élément entre (`amount: "some"`). Avec un
 *   seuil plus haut, un bloc plus grand que l'écran reste à `opacity: 0` en
 *   plein viewport — un texte blanc sur fond blanc, que le contrôle navigateur
 *   rattrape mais qu'un visiteur aurait vu avant lui.
 * - L'angle de départ reste sous 16°. Au-delà, le texte passe par un état
 *   franchement déformé, et sur une ligne de titre cela se lit comme un défaut
 *   d'affichage plutôt que comme une intention.
 */
export function Reveal3D({
  children,
  depuis = "bas",
  distance = 90,
  angle = 12,
  delay = 0,
  sansFondu = false,
  className,
  classeAnimee,
}: {
  children: ReactNode;
  depuis?: "bas" | "gauche" | "droite" | "face";
  /** Recul initial sur l'axe de profondeur, en pixels. */
  distance?: number;
  /** Inclinaison initiale, en degrés. */
  angle?: number;
  delay?: number;
  /**
   * Anime la position sans le fondu : l'élément est peint tout de suite, à sa
   * place de départ, puis glisse.
   *
   * C'est réservé à l'élément **LCP** d'une page. Mesure à l'appui : le titre
   * de l'accueil, animé en opacité, faisait grimper le LCP à 1 148 ms sur un
   * téléphone, contre 148 ms sur une page intérieure dont le plus grand
   * élément n'est pas animé. Le navigateur n'enregistre le LCP qu'au moment où
   * l'élément devient réellement visible : animer l'opacité du plus grand
   * texte d'une page, c'est repousser sa mesure de toute la durée de
   * l'animation. Le mouvement, lui, ne coûte rien.
   */
  sansFondu?: boolean;
  className?: string;
  /**
   * Classes portées par l'élément animé lui-même, plutôt que par un enfant.
   * Une carte posée à l'intérieur de l'enveloppe ajoute un niveau de boîtes
   * pour rien. (Cela n'a pas fait taire le constat `nested-cards` du
   * détecteur, qui vise autre chose — voir `docs/audit.md`.)
   */
  classeAnimee?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={className}>
        <div className={classeAnimee}>{children}</div>
      </div>
    );
  }

  const depart = {
    bas: { rotateX: angle, rotateY: 0, y: 24 },
    gauche: { rotateX: 0, rotateY: angle, x: -18 },
    droite: { rotateX: 0, rotateY: -angle, x: 18 },
    face: { rotateX: 0, rotateY: 0 },
  }[depuis];

  return (
    <div className={className} style={{ perspective: 1100 }}>
      <m.div
        data-entree-animee
        className={classeAnimee}
        style={{ transformStyle: "preserve-3d" }}
        initial={{ opacity: sansFondu ? 1 : 0, z: -distance, ...depart }}
        whileInView={{ opacity: 1, z: 0, rotateX: 0, rotateY: 0, x: 0, y: 0 }}
        // La marge basse retarde le départ pour que l'entrée se joue une fois
        // l'élément franchement visible, et non sur son premier pixel.
        //
        // Elle valait `-10%`, soit 90 px sur un écran de 900, et c'était un
        // défaut : le détecteur considère qu'un texte est dans le viewport dès
        // que son haut passe à 40 px du bas, donc il restait une bande de 50 px
        // où un texte était **visible à opacité 0**. Invisible la plupart du
        // temps, parce qu'il faut qu'un pas de défilement s'arrête dedans —
        // ce qui est arrivé sur la page Services dès que le sommaire a décalé
        // le contenu. Une valeur fixe de 40 px aligne le déclencheur sur le
        // seuil mesuré : tout ce que le contrôle juge visible a déjà démarré.
        viewport={{ once: true, amount: "some", margin: "0px 0px -40px 0px" }}
        transition={{ duration: DURATION.slower, ease: EASE.out, delay }}
      >
        {children}
      </m.div>
    </div>
  );
}
