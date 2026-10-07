"use client";

import { useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useRef, useState, type FocusEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Séquence horizontale pilotée par le défilement vertical.
 *
 * Le scroll de la page n'est JAMAIS intercepté. La piste est simplement haute,
 * et le panneau qu'elle contient est `position: sticky` : on descend
 * normalement, et c'est le contenu du panneau qui se déplace en X. La barre de
 * défilement, Page suivante, les flèches, Origine/Fin, le geste tactile et les
 * lecteurs d'écran gardent tous leur comportement système.
 *
 * C'est la différence entre un effet et un piège. Convertir le geste vertical
 * en déplacement horizontal — la manière « évidente » de faire cela — produit
 * des pages dont on n'arrive plus à sortir : la barre ne correspond plus à
 * rien, le clavier ne suit plus, et l'utilisateur perd le seul repère de
 * position dont il dispose.
 *
 * Sous `prefers-reduced-motion`, la piste devient un empilement vertical
 * ordinaire. Rien n'est masqué, rien ne dépend d'une animation qui ne se joue
 * pas.
 */
export function HorizontalTrack({
  panels,
  label,
  className,
}: {
  panels: ReactNode[];
  /** Décrit la séquence pour les technologies d'assistance. */
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cadre = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const count = panels.length;
  // La plage reste dans [0, 1] : une valeur liée au scroll qui en sort est
  // refusée par l'API d'animation du navigateur.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(count - 1) * 100}%`]);

  /**
   * Un panneau peut porter des contrôles — un bouton, un champ, un lien. Au
   * clavier, on peut y arriver alors que le panneau est encore hors champ :
   * le navigateur ferait alors défiler le cadre collant de côté pour montrer
   * l'élément, et la piste resterait décalée pour de bon. On fait l'inverse :
   * on annule ce décalage et on amène la page à la hauteur où ce panneau est
   * celui qu'on lit. Le défilement reste celui de la page, comme partout.
   */
  const suivreLeFocus = (evenement: FocusEvent<HTMLElement>) => {
    const piste = ref.current;
    const panneau = (evenement.target as HTMLElement).closest("[data-panneau]");
    if (!piste || !panneau) return;
    const index = Number(panneau.getAttribute("data-panneau"));
    const haut = window.scrollY + piste.getBoundingClientRect().top;
    const course = piste.offsetHeight - window.innerHeight;
    const cible = haut + (count > 1 ? (index / (count - 1)) * course : 0);
    requestAnimationFrame(() => {
      if (cadre.current) cadre.current.scrollLeft = 0;
    });
    if (Math.abs(window.scrollY - cible) > 4) window.scrollTo({ top: cible });
  };

  if (reduced) {
    return (
      <section aria-label={label} className={className}>
        {panels.map((panel, i) => (
          <div key={i} className="border-rule border-b last:border-b-0">
            {panel}
          </div>
        ))}
      </section>
    );
  }

  return (
    <section
      ref={ref}
      aria-label={label}
      onFocusCapture={suivreLeFocus}
      className={cn("relative", className)}
      // Une écran par panneau, plus une pour amorcer : en dessous, la séquence
      // défile trop vite pour être lue ; au-dessus, elle donne l'impression
      // que la page est bloquée.
      style={{ height: `${count * 90 + 10}vh` }}
    >
      <div ref={cadre} className="sticky top-0 h-dvh overflow-hidden">
        <m.div style={{ x }} className="flex h-full">
          {panels.map((panel, i) => (
            <Panneau key={i} progress={scrollYProgress} index={i} count={count}>
              {panel}
            </Panneau>
          ))}
        </m.div>

        <TrackProgress progress={scrollYProgress} count={count} />
      </div>
    </section>
  );
}

/**
 * Chaque panneau pivote en passant : incliné en arrivant, d'aplomb au centre,
 * incliné en repartant. C'est ce qui fait lire la séquence comme des plans qui
 * défilent devant le regard plutôt que comme une bande qui glisse.
 *
 * L'angle est plafonné à 10°. Ces panneaux portent un titre en grand corps ;
 * au-delà, le rendu sous-pixel du texte se brouille pendant tout le mouvement.
 * La rotation revient exactement à zéro au centre, donc le panneau qu'on lit
 * est toujours d'aplomb.
 *
 * Le débordement causé par la rotation est coupé par le cadre collant, qui est
 * en `overflow: hidden` : la page, elle, ne s'élargit pas.
 */
function Panneau({
  progress,
  index,
  count,
  children,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  index: number;
  count: number;
  children: ReactNode;
}) {
  const step = 1 / (count - 1 || 1);
  const centre = index * step;
  // Même serrage que les pastilles : la plage doit rester dans [0, 1] et
  // strictement croissante, sinon l'API d'animation du navigateur la refuse.
  const debut = Math.max(0, centre - step);
  const fin = Math.min(1, centre + step);
  const pivot = Math.min(Math.max(centre, debut + 0.001), fin - 0.001);
  const plage = [debut, pivot, fin];

  const rotateY = useTransform(progress, plage, [10, 0, -10]);
  const z = useTransform(progress, plage, [-140, 0, -140]);

  return (
    <div data-panneau={index} className="h-full w-screen shrink-0" style={{ perspective: 1600 }}>
      <m.div
        className="h-full w-full"
        style={{ rotateY, z, transformStyle: "preserve-3d" }}
      >
        {children}
      </m.div>
    </div>
  );
}

/**
 * Repère de position. Sans lui, une séquence horizontale retire à
 * l'utilisateur la seule information que la barre de défilement lui donnait :
 * où il en est et combien il reste.
 *
 * Un seul repère, dans le cadre, plutôt qu'une étiquette numérotée répétée
 * dans chaque panneau : le même renseignement onze fois se lit comme un tic
 * de gabarit, et la version vivante est de toute façon plus juste.
 */
function TrackProgress({
  progress,
  count,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  count: number;
}) {
  const [actif, setActif] = useState(1);

  // setState dans un abonnement, pas dans le corps d'un effet : c'est le
  // motif que la règle react-hooks autorise.
  useMotionValueEvent(progress, "change", (v) => {
    const i = Math.min(count, Math.max(1, Math.round(v * (count - 1)) + 1));
    setActif(i);
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3"
    >
      <span className="text-ink-muted bg-paper/80 rounded-full px-2.5 py-1 font-mono text-xs tabular-nums">
        {String(actif).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </span>
      <span className="flex gap-1.5">
        {Array.from({ length: count }).map((_, i) => (
          <Pip key={i} progress={progress} index={i} count={count} />
        ))}
      </span>
    </div>
  );
}

function Pip({
  progress,
  index,
  count,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  index: number;
  count: number;
}) {
  const step = 1 / (count - 1 || 1);
  const centre = index * step;

  // La plage doit rester dans [0, 1] ET strictement croissante. Après serrage,
  // le premier et le dernier point produisaient deux bornes identiques — le
  // même défaut qui avait fait lever une erreur sur la section épinglée.
  const half = step * 0.6;
  const debut = Math.max(0, centre - half);
  const fin = Math.min(1, centre + half);
  const pivot = Math.min(Math.max(centre, debut + 0.001), fin - 0.001);
  const plage = [debut, pivot, fin];

  const opacity = useTransform(progress, plage, [0.25, 1, 0.25]);
  const scale = useTransform(progress, plage, [1, 1.6, 1]);

  return (
    <m.span
      style={{ opacity, scale }}
      className="bg-signal block size-1.5 rounded-full"
    />
  );
}
