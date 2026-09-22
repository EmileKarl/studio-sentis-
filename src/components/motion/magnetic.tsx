"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * §7.5 — bouton magnétique. Attire l'élément vers le curseur, dans une limite
 * courte.
 *
 * Le contenu reste un enfant normal : l'élément interactif (bouton, lien) va
 * à l'intérieur, de sorte que le clavier et le lecteur d'écran ne voient que
 * lui et jamais l'enveloppe animée. L'effet n'est branché que sur un pointeur
 * fin — sur tactile il n'a pas de sens, et `pointermove` y déclencherait un
 * saut au premier contact.
 */
export function Magnetic({
  children,
  strength = 0.35,
  max = 12,
  className,
}: {
  children: ReactNode;
  strength?: number;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 260, damping: 22, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 260, damping: 22, mass: 0.4 });

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const clamp = (value: number) => Math.max(-max, Math.min(max, value));

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        rawX.set(clamp((event.clientX - (rect.left + rect.width / 2)) * strength));
        rawY.set(clamp((event.clientY - (rect.top + rect.height / 2)) * strength));
      }}
      onPointerLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
