"use client";

import {
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";

/**
 * Texte qui se lit ligne à ligne au défilement, comme les paroles d'une
 * chanson.
 *
 * **Deuxième version, et le premier essai est instructif.** Il allumait le
 * texte *mot à mot*, avec un front de couleur qui traversait les phrases. Il
 * fonctionnait, il était mesuré, et il était mauvais : une vague qui passe au
 * milieu d'une phrase coupe la lecture au lieu de la porter. Le client l'a dit
 * en un mot — « trop distrait » — et il avait raison. Un effet de lecture qui
 * attire l'œil sur lui-même a échoué, quelle que soit sa justesse technique.
 *
 * Le principe retenu est celui des paroles défilantes : **une ligne à la fois
 * est allumée, les autres sont en retrait.** Ce qui change, ce n'est plus la
 * couleur à l'intérieur d'une phrase mais le rapport entre les lignes. L'œil
 * n'a plus à suivre un front : il lui suffit de voir laquelle est nette.
 *
 * Trois choses rendent cela calme plutôt qu'agité :
 *
 * - **L'unité est la ligne, pas le mot.** Une ligne s'allume d'un coup et le
 *   reste le temps qu'on la lise. Rien ne bouge à l'intérieur.
 * - **Un plateau, pas un pic.** La courbe monte, *tient*, puis redescend. Sans
 *   ce palier, la ligne active clignoterait au moindre mouvement de molette.
 * - **Les lignes déjà lues retombent en retrait**, comme sur un lecteur de
 *   musique. C'est ce qui pousse vers la suite, et c'était la demande
 *   d'origine : tenir le lecteur jusqu'au bout du texte.
 *
 * **Ce qui s'anime est la couleur, pas l'opacité.** Le contrôle navigateur du
 * projet signale tout texte sous 90 % d'opacité — c'est ainsi qu'on repère une
 * animation d'entrée restée bloquée, et il a déjà attrapé le logotype pour
 * cette raison. Les deux bornes sont donc des tokens **mesurés** :
 * `--ink-muted` (4,8:1 sur chaque fond du site) et `--ink` (15:1). Une ligne en
 * retrait est du texte gris, parfaitement lisible ; elle n'est jamais effacée.
 * Plus d'accent coloré : c'est lui qui distrayait.
 *
 * Les couleurs sont résolues au navigateur plutôt qu'écrites en dur, Motion
 * interpolant des couleurs et non des `var()`. C'est le procédé du globe de la
 * page contact. Un changement de thème les relit.
 *
 * Sans JavaScript, ou avec « animations réduites », tout le texte s'affiche en
 * `--ink` : la page ne perd rien, elle perd le mouvement.
 */

function Ligne({
  texte,
  centre,
  demiPlateau,
  fondu,
  progression,
  eteinte,
  allumee,
}: {
  texte: string;
  /** Position de la ligne dans la course, entre 0 et 1. */
  centre: number;
  /** Demi-largeur du palier où la ligne reste pleinement allumée. */
  demiPlateau: number;
  /** Largeur de la montée et de la descente. */
  fondu: number;
  progression: MotionValue<number>;
  eteinte: string;
  allumee: string;
}) {
  const bornes = [
    centre - demiPlateau - fondu,
    centre - demiPlateau,
    centre + demiPlateau,
    centre + demiPlateau + fondu,
  ];
  const couleur = useTransform(progression, bornes, [
    eteinte,
    allumee,
    allumee,
    eteinte,
  ]);
  // Une respiration de deux pour cent, pas davantage : à l'échelle d'une ligne
  // de texte, c'est ce qui se sent sans se voir. Au-delà, le texte se met à
  // sauter et on retombe dans le défaut qu'on vient de corriger.
  const echelle = useTransform(progression, bornes, [1, 1.02, 1.02, 1]);

  return (
    <m.span
      className="block origin-left"
      style={{ color: couleur, scale: echelle }}
    >
      {texte}
    </m.span>
  );
}

export function TexteProgressif({
  texte,
  className,
}: {
  /** Les paragraphes, chacun découpé en lignes. */
  texte: string[][];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [couleurs, setCouleurs] = useState<[string, string] | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    // La course commence quand le bloc entre par le bas de l'écran et se
    // termine quand son bas remonte à 42 % de la hauteur : la dernière ligne
    // s'allume donc **avant** que le bloc ne sorte, et non au moment où il
    // disparaît.
    offset: ["start 0.95", "end 0.42"],
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const lire = () => {
      const s = getComputedStyle(el);
      const eteinte = s.getPropertyValue("--ink-muted").trim();
      const allumee = s.getPropertyValue("--ink").trim();
      if (eteinte && allumee) setCouleurs([eteinte, allumee]);
    };
    lire();
    // Le thème se change sur `<html>` : sans cet observateur, le texte
    // garderait les couleurs du thème clair après une bascule.
    const obs = new MutationObserver(lire);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => obs.disconnect();
  }, []);

  const total = texte.reduce((n, p) => n + p.length, 0);

  if (reduced || !couleurs) {
    return (
      <div ref={ref} className={className}>
        {texte.map((paragraphe) => (
          <p
            key={paragraphe.join(" ")}
            className="text-ink mt-5 text-lg leading-relaxed text-pretty"
          >
            {paragraphe.join(" ")}
          </p>
        ))}
      </div>
    );
  }

  // Le palier couvre une ligne entière et le fondu une demi-ligne : une ligne
  // reste donc nette pendant tout le temps qu'il faut pour la lire, et deux
  // lignes voisines ne sont jamais allumées ensemble à pleine force.
  const pas = 1 / total;
  const demiPlateau = pas * 0.5;
  const fondu = pas * 0.5;

  let rang = 0;
  return (
    <div ref={ref} className={className}>
      {texte.map((paragraphe) => (
        <p key={paragraphe.join(" ")} className="mt-5 text-lg leading-relaxed">
          {paragraphe.map((ligne) => {
            const centre = (rang++ + 0.5) * pas;
            return (
              <Ligne
                key={ligne}
                texte={ligne}
                centre={centre}
                demiPlateau={demiPlateau}
                fondu={fondu}
                progression={scrollYProgress}
                eteinte={couleurs[0]}
                allumee={couleurs[1]}
              />
            );
          })}
        </p>
      ))}
    </div>
  );
}
