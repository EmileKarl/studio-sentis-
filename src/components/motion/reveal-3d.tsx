"use client";

import { motion, useReducedMotion } from "motion/react";
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
  className,
}: {
  children: ReactNode;
  depuis?: "bas" | "gauche" | "droite" | "face";
  /** Recul initial sur l'axe de profondeur, en pixels. */
  distance?: number;
  /** Inclinaison initiale, en degrés. */
  angle?: number;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const depart = {
    bas: { rotateX: angle, rotateY: 0, y: 24 },
    gauche: { rotateX: 0, rotateY: angle, x: -18 },
    droite: { rotateX: 0, rotateY: -angle, x: 18 },
    face: { rotateX: 0, rotateY: 0 },
  }[depuis];

  return (
    <div className={className} style={{ perspective: 1100 }}>
      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, z: -distance, ...depart }}
        whileInView={{ opacity: 1, z: 0, rotateX: 0, rotateY: 0, x: 0, y: 0 }}
        viewport={{ once: true, amount: "some", margin: "0px 0px -10% 0px" }}
        transition={{ duration: DURATION.slower, ease: EASE.out, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
