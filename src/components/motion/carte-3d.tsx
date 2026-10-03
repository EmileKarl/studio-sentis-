"use client";

import { useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Une tuile qui est un objet dans l'espace, et non un rectangle qui bouge.
 *
 * La différence tient en un mot : **parallaxe**. Une carte qui s'incline sans
 * plus reste une image plate qu'on penche — l'œil le voit tout de suite. Ce
 * qui donne le volume, c'est que les couches à l'intérieur ne se déplacent pas
 * de la même quantité : le pictogramme, posé en avant sur l'axe de profondeur,
 * balaie plus que le fond de la carte. C'est ce décalage, et lui seul, qui
 * fait lire une épaisseur.
 *
 * D'où `transform-style: preserve-3d` sur la carte et un `translateZ` sur les
 * couches qui doivent flotter. Sans `preserve-3d`, les enfants sont aplatis
 * dans le plan du parent et le `translateZ` ne fait rien du tout.
 *
 * **Ressort plutôt que durée.** Lier une rotation directement à la position du
 * pointeur donne un mouvement sans inertie, qui se lit comme artificiel : la
 * carte colle au curseur. Un ressort interpole, donc la carte a une masse. Ce
 * sont des valeurs sans rebond (`damping` élevé) — une tuile de services qui
 * rebondit serait un jouet.
 *
 * **Décoratif, donc conditionnel.** Cette inclinaison ne transporte aucune
 * information. Elle est donc coupée net sous `prefers-reduced-motion`, et elle
 * ne part jamais au doigt : `pointerType !== "mouse"` l'écarte sur tactile, où
 * elle n'aurait de toute façon pas de sens — il n'y a pas de survol.
 */
export function Carte3D({
  children,
  className,
  /** Inclinaison maximale, en degrés. Au-delà de ~8°, le rendu sous-pixel du
   *  texte commence à se brouiller et la tuile paraît floue plutôt qu'inclinée. */
  amplitude = 7,
}: {
  children: ReactNode;
  className?: string;
  amplitude?: number;
}) {
  const reduced = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const ressort = { stiffness: 170, damping: 24, mass: 0.5 };
  const rotateY = useSpring(
    useTransform(px, [0, 1], [-amplitude, amplitude]),
    ressort,
  );
  const rotateX = useSpring(
    useTransform(py, [0, 1], [amplitude, -amplitude]),
    ressort,
  );

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div style={{ perspective: 900 }} className="h-full">
      <m.div
        className={cn("h-full", className)}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={(event) => {
          if (event.pointerType !== "mouse") return;
          const r = event.currentTarget.getBoundingClientRect();
          px.set((event.clientX - r.left) / r.width);
          py.set((event.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
      >
        {children}
      </m.div>
    </div>
  );
}

/**
 * Une couche posée en avant de la carte, sur l'axe de profondeur.
 *
 * C'est elle qui fait le volume : en tournant, elle se décale par rapport au
 * fond. `translateZ` seul suffit — pas besoin de dupliquer la rotation, le
 * parent la porte déjà et `preserve-3d` la propage.
 */
export function Couche3D({
  children,
  z = 26,
  className,
}: {
  children: ReactNode;
  /** Distance en avant du plan de la carte, en pixels. */
  z?: number;
  className?: string;
}) {
  return (
    <div className={className} style={{ transform: `translateZ(${z}px)` }}>
      {children}
    </div>
  );
}
