"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Onde de graisse typographique.
 *
 * Le texte ne bouge pas, ne s'efface pas, n'apparaît pas : seule sa GRAISSE
 * ondule, en interpolant l'axe variable `wght` d'Archivo caractère par
 * caractère selon la distance au pointeur. La lettre reste à sa place et à
 * pleine opacité du début à la fin.
 *
 * C'est ce qui rend l'effet utilisable sur un titre réel plutôt que sur une
 * démonstration : il n'existe aucun instant où le texte est illisible, donc
 * aucun risque de contraste, aucun reflux de mise en page, et rien à réparer
 * si l'animation ne part pas.
 *
 * Sans pointeur fin — tactile, ou `hover: none` — l'onde est pilotée par la
 * progression du scroll : l'effet reste vivant sur mobile au lieu d'être mort.
 */
export function WeightWave({
  text,
  className,
  min = 300,
  max = 900,
  /** Largeur de l'onde, en fraction de la largeur de l'élément. */
  spread = 0.22,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  min?: number;
  max?: number;
  spread?: number;
  as?: "span" | "h2" | "h3" | "p";
}) {
  const hostRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host || reduced) return;

    const letters = Array.from(
      host.querySelectorAll<HTMLElement>("[data-letter]"),
    );
    if (!letters.length) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // Position visée de l'onde (0→1) et position rendue : l'écart entre les
    // deux donne l'inertie, sans ressort ni bibliothèque.
    let target = fine ? -1 : 0;
    let current = fine ? -1 : 0;
    let frame = 0;
    let running = false;

    const paint = () => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0) {
        running = false;
        return;
      }
      current += (target - current) * 0.18;

      const settled = Math.abs(target - current) < 0.001;
      for (const letter of letters) {
        const box = letter.getBoundingClientRect();
        const pos = (box.left + box.width / 2 - rect.left) / rect.width;
        const distance = Math.abs(pos - current);
        // Cloche cosinus : pleine graisse au centre, retour au repos au bord.
        const falloff =
          distance > spread
            ? 0
            : (Math.cos((distance / spread) * Math.PI) + 1) / 2;
        const weight = Math.round(min + (max - min) * falloff);
        letter.style.fontVariationSettings = `'wght' ${weight}`;
      }

      if (!settled || !fine) {
        frame = requestAnimationFrame(paint);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(paint);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      target = (event.clientX - rect.left) / rect.width;
      start();
    };

    // Sortie du pointeur : l'onde s'éteint au lieu de rester figée là où on
    // a quitté l'élément.
    const onPointerLeave = () => {
      target = -1;
      start();
    };

    const onScroll = () => {
      const rect = host.getBoundingClientRect();
      const progress =
        1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
      target = Math.min(1, Math.max(0, progress * 1.6 - 0.3));
      start();
    };

    if (fine) {
      host.addEventListener("pointermove", onPointerMove);
      host.addEventListener("pointerleave", onPointerLeave);
      paint();
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced, min, max, spread, text]);

  // Le texte reste lisible d'un bloc pour les technologies d'assistance ; les
  // lettres découpées sont décoratives.
  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag
      ref={hostRef as never}
      className={cn("font-display", className)}
      style={{ fontVariationSettings: `'wght' ${min}` }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {Array.from(text).map((char, i) => (
          <span
            key={`${char}-${i}`}
            data-letter
            className="inline-block"
            style={{ fontVariationSettings: `'wght' ${min}` }}
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </span>
    </Tag>
  );
}
