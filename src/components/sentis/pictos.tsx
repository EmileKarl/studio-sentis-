"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { DURATION, EASE } from "@/lib/motion";

/**
 * Pictogrammes des quatre métiers, dessinés à la main en SVG.
 *
 * Pas une bibliothèque d'icônes : ces quatre dessins sont propres au studio,
 * construits sur la même grille de 40, la même épaisseur de trait et les mêmes
 * angles droits que le reste du site. Une icône générique aurait dit « site
 * web » ; celles-ci disent aussi « dessiné ici ».
 *
 * Ils se tracent au défilement — la ligne s'écrit plutôt que d'apparaître. Sous
 * `prefers-reduced-motion`, ils sont simplement là, tracés.
 *
 * `aria-hidden` : chaque pictogramme accompagne un titre qui dit déjà la même
 * chose. Le répéter à la voix ne ferait que doubler la lecture.
 */

const TRAIT = 2.1;

function Trace({
  d,
  delay = 0,
  fill,
}: {
  d: string;
  delay?: number;
  fill?: boolean;
}) {
  const reduced = useReducedMotion();
  const commun = {
    d,
    fill: fill ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: TRAIT,
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
  };

  if (reduced) return <path {...commun} />;

  return (
    <m.path
      {...commun}
      // Le même marqueur que les entrées au scroll : sans JavaScript, la règle
      // sous <noscript> remet le tracé à plat au lieu de laisser un cadre vide.
      data-entree-animee
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: "some", margin: "0px 0px -40px 0px" }}
      transition={{
        pathLength: { duration: DURATION.slower, ease: EASE.out, delay },
        opacity: { duration: DURATION.fast, delay },
      }}
    />
  );
}

function Cadre({
  children,
  couleur,
}: {
  children: React.ReactNode;
  couleur: string;
}) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={`${couleur} size-14 shrink-0`}>
      {children}
    </svg>
  );
}

/** Site web : une fenêtre de navigateur et deux lignes de texte. */
export function PictoSite() {
  return (
    <Cadre couleur="text-accent-bleu">
      <Trace d="M3 7 H37 V33 H3 Z" />
      <Trace d="M3 14 H37" delay={0.12} />
      <Trace d="M8 21 H24" delay={0.2} />
      <Trace d="M8 27 H31" delay={0.26} />
    </Cadre>
  );
}

/** Application : un téléphone et le point du doigt. */
export function PictoApplication() {
  return (
    <Cadre couleur="text-accent-cyan">
      <Trace d="M11 3 H29 V37 H11 Z" />
      <Trace d="M11 9 H29" delay={0.12} />
      <Trace d="M11 31 H29" delay={0.16} />
      <Trace d="M17 19 H23 V25 H17 Z" delay={0.24} fill />
    </Cadre>
  );
}

/** Identité : un bloc d'impression, la lettre réservée dedans. */
export function PictoIdentite() {
  return (
    <Cadre couleur="text-accent-violet">
      <Trace d="M4 4 H36 V36 H4 Z" />
      <Trace d="M13 29 L20 12 L27 29" delay={0.14} />
      <Trace d="M16 23 H24" delay={0.26} />
    </Cadre>
  );
}

/** Informatique et marketing : trois machines empilées, et la courbe qui monte. */
export function PictoSuivi() {
  return (
    <Cadre couleur="text-accent-vert">
      <Trace d="M4 5 H28 V13 H4 Z" />
      <Trace d="M4 16 H28 V24 H4 Z" delay={0.12} />
      <Trace d="M4 27 H28 V35 H4 Z" delay={0.2} />
      <Trace d="M33 33 V17" delay={0.3} />
      <Trace d="M29.5 21 L33 17 L36.5 21" delay={0.36} />
    </Cadre>
  );
}

/**
 * Sélection par index, faite ici et non chez l'appelant.
 *
 * Un tableau de composants exporté depuis un module `"use client"` ne traverse
 * pas la frontière serveur : Next ne fabrique une référence client que pour les
 * fonctions exportées, pas pour un tableau qui les contient. L'appelant
 * recevait donc `undefined`, et la page Services échouait au build avec
 * « Element type is invalid ». La sélection reste du côté client.
 */
export function PictoService({ index }: { index: number }) {
  const liste = [PictoSite, PictoApplication, PictoIdentite, PictoSuivi];
  const Picto = liste[index % liste.length];
  return <Picto />;
}
