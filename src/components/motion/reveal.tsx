"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { DURATION, EASE, TRAVEL, offsetFor, type Direction } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  direction?: Direction;
  distance?: number;
  delay?: number;
  blur?: boolean;
  /** Rejoue à chaque passage plutôt qu'une seule fois. */
  repeat?: boolean;
  className?: string;
};

/**
 * §6.7 — entrée au scroll. Brique de base de toute la page : Stagger, TextReveal
 * et ScrollReveal en dérivent.
 *
 * Sous `prefers-reduced-motion`, le composant ne rend pas une animation plus
 * courte : il rend l'état final, sans transition ni opacité initiale. Un
 * élément ne peut donc jamais rester invisible parce qu'un déclencheur de
 * scroll n'est pas parti.
 */
export function Reveal({
  children,
  direction = "up",
  distance = TRAVEL.md,
  delay = 0,
  blur = false,
  repeat = false,
  className,
}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        filter: blur ? "blur(6px)" : undefined,
        ...offsetFor(direction, distance),
      }}
      whileInView={{ opacity: 1, filter: blur ? "blur(0px)" : undefined, x: 0, y: 0 }}
      viewport={{ once: !repeat, amount: "some", margin: "0px 0px -10% 0px" }}
      transition={{ duration: DURATION.slow, ease: EASE.out, delay }}
    >
      {children}
    </motion.div>
  );
}
