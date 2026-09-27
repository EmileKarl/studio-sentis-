"use client";

import { motion, useReducedMotion } from "motion/react";

import { DURATION, EASE } from "@/lib/motion";

/**
 * Le territoire desservi, en schéma.
 *
 * Ce n'est pas une carte : aucune côte n'est exacte, aucune distance n'est à
 * l'échelle. C'est un diagramme, et il le dit — « schéma » est écrit dessus.
 * Une carte approximative présentée comme une carte serait un petit mensonge
 * de plus sur un site dont l'argument est de n'en faire aucun.
 *
 * `aria-hidden` : les trois lieux sont déjà écrits en toutes lettres dans le
 * bloc de coordonnées, juste à côté. Les faire relire par le dessin ne dirait
 * rien de neuf.
 */
export function CarteTerritoire({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  const onde = (r: number, delay: number) =>
    reduced ? (
      <circle cx="150" cy="128" r={r} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    ) : (
      <motion.circle
        cx="150"
        cy="128"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        data-entree-animee
        initial={{ scale: 0.7, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.5 }}
        viewport={{ once: true, amount: "some" }}
        transition={{ duration: DURATION.slower, ease: EASE.out, delay }}
        style={{ transformOrigin: "150px 128px" }}
      />
    );

  return (
    <svg
      viewBox="0 0 300 210"
      aria-hidden
      className={className}
      role="presentation"
    >
      {/* Le fleuve : une bande, pas un tracé réel. */}
      <path
        d="M0 84 C 70 64, 140 92, 200 70 C 240 56, 275 62, 300 54 L300 84 C 275 92, 240 86, 200 100 C 140 122, 70 94, 0 114 Z"
        className="text-rule"
        fill="currentColor"
      />

      {/* L'île, au nord. */}
      <path
        d="M52 46 C 92 26, 150 30, 186 22 C 206 18, 214 32, 196 42 C 156 62, 96 62, 60 62 C 44 62, 40 52, 52 46 Z"
        className="text-rule-strong"
        fill="currentColor"
        opacity="0.55"
      />

      {/* Les ondes : la portée depuis Châteauguay. */}
      <g className="text-signal-aa">
        {onde(26, 0.05)}
        {onde(48, 0.14)}
        {onde(70, 0.23)}
      </g>

      {/* Châteauguay. */}
      <circle cx="150" cy="128" r="5.5" className="text-signal-aa" fill="currentColor" />

      <g className="fill-ink-secondary" fontSize="11" fontFamily="var(--font-body-brand)">
        <text x="66" y="40" className="fill-ink">
          Montréal
        </text>
        <text x="8" y="106">
          Fleuve Saint-Laurent
        </text>
        <text x="162" y="132" className="fill-ink" fontWeight="600">
          Châteauguay
        </text>
        <text x="162" y="147">
          Montérégie
        </text>
      </g>

      {/* 11 px et non 10 : c'est le plancher que le projet s'est fixé pour tout
          texte fonctionnel. Et les capitales à interlettrage large sont le tic
          que le détecteur traque ailleurs sur le site — aucune raison de le
          tolérer ici. */}
      <text
        x="292"
        y="204"
        textAnchor="end"
        fontSize="11"
        className="fill-ink-muted"
        fontFamily="var(--font-mono)"
      >
        Schéma — pas à l&apos;échelle
      </text>
    </svg>
  );
}
