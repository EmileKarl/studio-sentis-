"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

import { DURATION } from "@/lib/motion";

/**
 * Révélation « encre ».
 *
 * Un bruit fractal (`feTurbulence`) déplace les pixels du bloc
 * (`feDisplacementMap`), puis l'amplitude du déplacement retombe à zéro : le
 * texte se reforme comme une impression qui sèche, au lieu d'apparaître en
 * fondu. C'est la métaphore de l'imprimé, cohérente avec la direction
 * éditoriale, et non un effet emprunté au vocabulaire SaaS.
 *
 * Deux précautions qui font la différence entre un effet et un défaut :
 *
 * 1. L'opacité ne bouge JAMAIS. Le contenu est à 100 % du premier au dernier
 *    frame — il n'existe aucun instant où il pourrait rester invisible si
 *    l'animation ne partait pas.
 * 2. Le filtre est RETIRÉ à la fin, pas laissé à amplitude nulle. Un filtre SVG
 *    force la rastérisation du texte : le laisser en place coûterait la netteté
 *    du rendu sous-pixel pour toute la durée de vie de la page.
 */
export function InkBleed({
  children,
  amplitude = 18,
  className,
}: {
  children: React.ReactNode;
  amplitude?: number;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const displaceRef = useRef<SVGFEDisplacementMapElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [filtering, setFiltering] = useState(true);

  useEffect(() => {
    if (reduced || !inView) return;

    let frame = 0;
    const started = performance.now();
    const total = DURATION.slower * 1000;

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / total);
      // ease-out cubique : l'encre se fixe vite, puis se stabilise.
      const eased = 1 - Math.pow(1 - t, 3);
      displaceRef.current?.setAttribute(
        "scale",
        String(amplitude * (1 - eased)),
      );
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setFiltering(false);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, amplitude]);

  return (
    <div ref={ref} className={className}>
      {filtering && !reduced ? (
        <svg aria-hidden className="pointer-events-none absolute size-0">
          <filter id={`ink-${id}`} colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.045"
              numOctaves={2}
              seed={7}
              result="noise"
            />
            <feDisplacementMap
              ref={displaceRef}
              in="SourceGraphic"
              in2="noise"
              scale={amplitude}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      ) : null}
      <div
        style={
          filtering && !reduced && inView
            ? { filter: `url(#ink-${id})`, willChange: "filter" }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
