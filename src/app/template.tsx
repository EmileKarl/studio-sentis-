"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { DURATION, EASE } from "@/lib/motion";

/**
 * §7.7 — transition de page.
 *
 * `template.tsx` est remonté à chaque navigation, contrairement à `layout.tsx`.
 * L'animation est volontairement minimale : une opacité et huit pixels. Une
 * transition de page plus longue retarde l'apparition du contenu à chaque clic,
 * ce que l'on paie sur toute la durée de la visite alors qu'on ne l'admire
 * qu'une fois.
 *
 * Aucune animation de sortie : Next ne monte la page suivante qu'après avoir
 * démonté la précédente, donc une sortie ne ferait qu'ajouter un temps mort
 * avant que quoi que ce soit s'affiche.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.base, ease: EASE.out }}
    >
      {children}
    </motion.div>
  );
}
