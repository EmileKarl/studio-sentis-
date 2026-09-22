"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, useState, type ReactNode } from "react";

/**
 * §7.5 — élément qui suit le curseur, confiné à une zone.
 *
 * Purement décoratif, donc `aria-hidden` et `pointer-events-none` : il ne doit
 * jamais intercepter un clic ni apparaître dans l'ordre de lecture. Confiné à
 * son conteneur plutôt qu'appliqué à la page entière — un curseur personnalisé
 * global remplace un curseur système que l'utilisateur connaît, et casse les
 * repères de forme (texte, lien, redimensionnement).
 */
export function CursorFollow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 320, damping: 28, mass: 0.35 };
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || reduced) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        rawX.set(event.clientX - rect.left);
        rawY.set(event.clientY - rect.top);
        setVisible(true);
      }}
      onPointerLeave={() => setVisible(false)}
    >
      {children}
      {reduced ? null : (
        <motion.span
          aria-hidden
          className="bg-signal pointer-events-none absolute top-0 left-0 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-multiply dark:mix-blend-screen"
          style={{ x, y, opacity: visible ? 0.22 : 0 }}
          transition={{ opacity: { duration: 0.2 } }}
        />
      )}
    </div>
  );
}
