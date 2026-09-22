"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * §6.7 — carte inclinée au survol. L'inclinaison est plafonnée à quelques
 * degrés : au-delà, le texte de la carte devient pénible à lire pendant le
 * mouvement, ce qui coûte plus que l'effet ne rapporte.
 */
export function TiltCard({
  children,
  maxAngle = 5,
  className,
}: {
  children: ReactNode;
  maxAngle?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 20, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [0, 1], [maxAngle, -maxAngle]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxAngle, maxAngle]), spring);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div style={{ perspective: 900 }}>
      <motion.div
        ref={ref}
        className={className}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={(event) => {
          if (event.pointerType !== "mouse") return;
          const rect = ref.current?.getBoundingClientRect();
          if (!rect) return;
          px.set((event.clientX - rect.left) / rect.width);
          py.set((event.clientY - rect.top) / rect.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
