"use client";

import { motion, useReducedMotion } from "motion/react";

import { DURATION, EASE, STAGGER } from "@/lib/motion";

/**
 * §7.6 — apparition d'un texte par mots ou par lignes, sous masque.
 *
 * Le texte complet est toujours présent dans le DOM, lisible par un lecteur
 * d'écran et par un robot d'indexation ; les fragments animés sont
 * `aria-hidden`. Sous `prefers-reduced-motion`, on rend le texte nu, sans
 * fragments : rien ne peut rester coincé à `opacity: 0`.
 */
export function TextReveal({
  text,
  by = "word",
  delay = 0,
  className,
  as: Tag = "p",
}: {
  text: string;
  by?: "word" | "line";
  delay?: number;
  className?: string;
  as?: "p" | "h2" | "h3" | "span";
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const parts = by === "word" ? text.split(" ") : text.split(/(?<=\.)\s+/);
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: STAGGER.tight, delayChildren: delay } },
      }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {parts.map((part, i) => (
          // overflow-hidden : le masque d'où le fragment monte.
          <span key={`${part}-${i}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "105%" },
                shown: { y: "0%" },
              }}
              transition={{ duration: DURATION.slow, ease: EASE.out }}
            >
              {part}
              {i < parts.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </MotionTag>
  );
}
