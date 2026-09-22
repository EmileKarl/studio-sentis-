"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * §7.4 — parallaxe. Volontairement faible : `distance` est la course totale en
 * pixels sur toute la traversée du viewport. Au-delà d'une trentaine de pixels
 * le décalage se lit comme un défaut d'alignement plutôt que comme de la
 * profondeur, et il nuit à la lecture du texte posé dessus.
 */
export function Parallax({
  children,
  distance = 28,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
