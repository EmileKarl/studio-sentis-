"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { DURATION, EASE, STAGGER, TRAVEL, offsetFor, type Direction } from "@/lib/motion";

/**
 * §6.7 — conteneur à décalage. L'orchestration vit sur le parent : les enfants
 * n'ont pas à connaître leur propre index, ce qui permet d'en ajouter ou d'en
 * retirer sans retoucher les délais.
 */
export function Stagger({
  children,
  gap = STAGGER.base,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  gap?: number;
  delay?: number;
  className?: string;
  as?: "div" | "ul" | "ol" | "dl";
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[Tag];

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  direction = "up",
  distance = TRAVEL.md,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  direction?: Direction;
  distance?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[Tag];

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, ...offsetFor(direction, distance) },
        shown: { opacity: 1, x: 0, y: 0 },
      }}
      transition={{ duration: DURATION.slow, ease: EASE.out }}
    >
      {children}
    </MotionTag>
  );
}
