"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export type PinnedStep = { index: string; title: string; body: string };

/**
 * §7.3 — section épinglée : le titre reste visible pendant que les étapes
 * défilent.
 *
 * Construite sur `position: sticky` plutôt que sur GSAP ScrollTrigger. Sticky
 * est natif : le scroll de la page n'est jamais détourné, le clavier et la
 * molette gardent leur comportement système, et il n'y a rien à nettoyer au
 * démontage. Motion ne sert qu'à lire la progression pour animer l'état des
 * étapes — il ne pilote pas le défilement.
 *
 * La hauteur de la piste dépend du nombre d'étapes : une section épinglée plus
 * longue que quelques écrans donne l'impression que la page est bloquée.
 */
export function PinnedSequence({ steps }: { steps: PinnedStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} style={{ height: `${steps.length * 60 + 60}vh` }}>
      <div className="sticky top-14 flex min-h-[calc(100vh-3.5rem)] flex-col justify-center py-16">
        <div className="border-rule border-t pt-6">
          <h3 className="font-display text-ink max-w-[22ch] text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Le titre tient, le contenu passe
          </h3>
        </div>

        <ol className="mt-10 space-y-4">
          {steps.map((step, i) => (
            <PinnedStepRow
              key={step.index}
              step={step}
              progress={scrollYProgress}
              from={i / steps.length}
              to={(i + 1) / steps.length}
              isFirst={i === 0}
              isLast={i === steps.length - 1}
              reduced={Boolean(reduced)}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

function PinnedStepRow({
  step,
  progress,
  from,
  to,
  isFirst,
  isLast,
  reduced,
}: {
  step: PinnedStep;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  from: number;
  to: number;
  isFirst: boolean;
  isLast: boolean;
  reduced: boolean;
}) {
  // Chaque étape s'éclaire sur sa tranche de progression puis se retire.
  //
  // Le fondu se prend À L'INTÉRIEUR de la tranche, jamais en débordant de part
  // et d'autre : Motion confie une valeur liée au scroll à l'API d'animation
  // du navigateur, qui exige des offsets dans [0, 1] et croissants. Une plage
  // [from - 0.08, …, to + 0.08] produit -0.08 sur la première étape et 1.08 sur
  // la dernière, et lève « Offsets must be monotonically non-decreasing » au
  // montage — sur chaque chargement de la page.
  const pad = (to - from) * 0.2;

  // L'état actif ne passe PAS par l'opacité du texte : à 0,35 le corps de
  // l'étape tombait à 1,8:1, très en dessous du minimum de 4,5:1. Le signal
  // est porté par un filet d'accent qui se déploie sur la tranche de l'étape,
  // pendant que le texte reste entièrement lisible du début à la fin.
  // La première étape est déjà allumée à progression 0, et la dernière le
  // reste jusqu'à 1. Sans cela, aucune étape n'est active aux deux extrémités
  // de la piste — et on stationne précisément à la fin, où la section est
  // encore épinglée mais où plus rien ne signale où l'on en est.
  const scaleY = useTransform(
    progress,
    [from, from + pad, to - pad, to],
    [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0],
  );
  const x = useTransform(progress, [from, from + pad], [isFirst ? 0 : 8, 0]);

  return (
    <motion.li
      style={reduced ? undefined : { x }}
      className="border-rule bg-surface relative flex gap-4 border p-5"
    >
      <motion.span
        aria-hidden
        className="bg-signal absolute top-0 bottom-0 left-0 w-0.5 origin-center"
        style={reduced ? { transform: "scaleY(1)" } : { scaleY }}
      />
      <span className="text-signal-aa font-mono text-xs tabular-nums">{step.index}</span>
      <div className="min-w-0">
        <p className="font-display text-ink text-lg font-semibold tracking-tight">
          {step.title}
        </p>
        <p className="text-ink-secondary mt-1 max-w-(--content-max) text-sm leading-relaxed text-pretty">
          {step.body}
        </p>
      </div>
    </motion.li>
  );
}
