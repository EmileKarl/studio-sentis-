"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Objet flottant : le contenu cesse d'être une image posée à plat et devient
 * une chose dans l'espace. La rotation de base suit le défilement et se remet
 * d'aplomb au centre de l'écran ; le pointeur y ajoute sa part.
 *
 * L'inclinaison est plafonnée à quelques degrés. Ces cadres contiennent des
 * interfaces réelles, avec du texte à 11 px : au-delà de ~10°, le rendu
 * sous-pixel du navigateur commence à le brouiller, et la démonstration perd
 * précisément ce qu'elle est censée prouver.
 */
export function ObjetFlottant3D({
  children,
  amplitude = 9,
  className,
}: {
  children: ReactNode;
  amplitude?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const ressort = { stiffness: 140, damping: 24, mass: 0.6 };
  // Le passage devant le regard : incliné en arrivant, d'aplomb au centre,
  // incliné dans l'autre sens en partant.
  const baseX = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [amplitude, 0, -amplitude]),
    ressort,
  );

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const pointeurY = useSpring(useTransform(px, [0, 1], [-amplitude, amplitude]), ressort);
  const pointeurX = useSpring(useTransform(py, [0, 1], [amplitude * 0.6, -amplitude * 0.6]), ressort);
  const rotateX = useTransform([baseX, pointeurX], ([a, b]: number[]) => a + b);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className} style={{ perspective: 1400 }}>
      <motion.div
        style={{ rotateX, rotateY: pointeurY, transformStyle: "preserve-3d" }}
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
      </motion.div>
    </div>
  );
}

/**
 * Prisme : un vrai volume en CSS 3D, tourné par le défilement.
 *
 * Purement décoratif — `aria-hidden`, aucune information sur ses faces qui ne
 * soit déjà écrite à côté en texte courant. Un lecteur d'écran ne rencontre
 * jamais un objet dont les faces sont, pour lui, quatre blocs de texte sans
 * ordre.
 */
export function Prisme3D({
  faces,
  taille = 190,
  className,
}: {
  /** Quatre faces, dans l'ordre de rotation. */
  faces: string[];
  taille?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateY = useSpring(useTransform(scrollYProgress, [0, 1], [-45, 315]), {
    stiffness: 90,
    damping: 24,
    mass: 0.7,
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [-14, 14]);

  const demi = taille / 2;
  const cotes = faces.slice(0, 4);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("flex items-center justify-center", className)}
      // Largeur explicite : les faces sont en position absolue, donc la boîte
      // ne les mesure pas. Sans cela le prisme déborde sa colonne en tournant
      // et pousse la page entière hors du viewport.
      style={{ perspective: 900, width: taille * 1.7, height: taille * 1.5 }}
    >
      <motion.div
        className="relative"
        style={{
          width: taille,
          height: taille,
          transformStyle: "preserve-3d",
          // Sans mouvement, le prisme garde un angle de trois quarts : on voit
          // encore un volume, pas un carré.
          rotateY: reduced ? -30 : rotateY,
          rotateX: reduced ? -10 : rotateX,
        }}
      >
        {cotes.map((face, i) => (
          <div
            key={face}
            className="border-rule-strong bg-paper/70 text-ink absolute inset-0 flex items-center justify-center border text-center"
            style={{
              transform: `rotateY(${i * 90}deg) translateZ(${demi}px)`,
              backfaceVisibility: "hidden",
            }}
          >
            <span className="font-display px-4 text-xl font-semibold tracking-tight text-balance">
              {face}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
