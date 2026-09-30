"use client";

import { useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";

/**
 * Texte qui s'allume mot à mot au défilement.
 *
 * Le but n'est pas décoratif : ce bloc porte l'argument central de la page
 * Réalisations — pourquoi elle est vide — et il doit être lu **jusqu'au
 * bout**. Un texte dont les mots s'éclairent au fil du défilement donne au
 * lecteur une raison mécanique de continuer : il voit où il en est, et il voit
 * qu'il reste quelque chose.
 *
 * **Ce qui s'anime est la couleur, pas l'opacité.** C'est une contrainte du
 * projet, et elle est bonne : le contrôle navigateur signale tout texte
 * au-dessous de 90 % d'opacité, parce que c'est ainsi que se manifeste une
 * animation d'entrée restée bloquée — il a déjà attrapé le logotype pour cette
 * raison. Un fondu progressif ferait donc échouer la barrière, et à juste
 * titre : une opacité arbitraire échappe aux mesures de contraste.
 *
 * Ici les deux bornes sont des tokens **mesurés** : `--ink-muted` (4,8:1 sur
 * chaque fond du site) et `--ink` (15:1). Toute valeur intermédiaire se trouve
 * entre les deux, donc **aucune image de l'animation n'est illisible**. Le
 * texte non encore atteint est du texte gris, pas du texte effacé.
 *
 * Les deux couleurs sont résolues au navigateur plutôt qu'écrites en dur :
 * Motion interpole des couleurs, pas des `var()`. C'est le même procédé que le
 * globe de la page contact. Un changement de thème les relit.
 *
 * Sans JavaScript, ou avec « animations réduites » activé, le texte s'affiche
 * entièrement en `--ink` : la page ne perd rien, elle perd le mouvement.
 */

function Mot({
  mot,
  debut,
  fin,
  progression,
  depart,
  front,
  arrivee,
}: {
  mot: string;
  debut: number;
  fin: number;
  progression: MotionValue<number>;
  depart: string;
  /** Couleur du front de vague, traversée au passage. */
  front: string;
  arrivee: string;
}) {
  // Trois arrêts et non deux. Avec deux — gris ardoise vers encre — l'effet
  // existait et se mesurait, mais ne se **voyait** pas : les deux tokens sont
  // proches sur un fond crème, et le client, qui l'avait demandé, ne l'a pas
  // trouvé sur la page. Le passage par l'accent donne au front de vague une
  // couleur franche : on voit alors où en est la lecture, ce qui est toute la
  // fonction de l'effet.
  //
  // Les trois arrêts sont des tokens mesurés — `--ink-muted` 4,8:1, l'accent
  // 5,9:1 sur le papier, `--ink` 15:1 — donc aucune image de l'animation n'est
  // illisible, y compris en plein passage de la vague.
  const couleur = useTransform(
    progression,
    [debut, (debut + fin) / 2, fin],
    [depart, front, arrivee],
  );
  // `m.span` par mot : chaque mot a sa propre plage de défilement, donc son
  // propre `useTransform`. Un composant par mot est la seule façon d'appeler
  // le hook un nombre variable de fois sans enfreindre les règles des hooks.
  return <m.span style={{ color: couleur }}>{mot} </m.span>;
}

export function TexteProgressif({
  texte,
  className,
}: {
  /** Les paragraphes, dans l'ordre. */
  texte: string[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [couleurs, setCouleurs] = useState<[string, string, string] | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    // Le bloc commence à s'allumer dès que son haut entre par le bas de
    // l'écran, et finit quand son bas remonte à 42 % de la hauteur : la fin du
    // texte est donc atteinte **avant** que le bloc ne sorte de l'écran. Caler
    // la fin sur la sortie ferait disparaître le dernier mot au moment où il
    // s'allume.
    //
    // La plage a été élargie après mesure : avec « start 0.8 → end 0.55 », ce
    // bloc de trois paragraphes était entièrement allumé après sept cents
    // pixels de défilement, soit moins d'un écran. L'effet existait mais ne
    // durait pas assez pour tenir le lecteur, ce qui est toute sa raison
    // d'être.
    offset: ["start 0.95", "end 0.42"],
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const lire = () => {
      const s = getComputedStyle(el);
      const eteint = s.getPropertyValue("--ink-muted").trim();
      const front = s.getPropertyValue("--accent-violet").trim();
      const allume = s.getPropertyValue("--ink").trim();
      if (eteint && front && allume) setCouleurs([eteint, front, allume]);
    };
    lire();
    // Le thème se change sur `<html>` : on relit les deux couleurs quand sa
    // classe bouge, sans quoi le texte garderait les valeurs du thème clair.
    const obs = new MutationObserver(lire);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => obs.disconnect();
  }, []);

  const mots = texte.map((p) => p.split(" "));
  const total = mots.reduce((n, p) => n + p.length, 0);

  // Sans mouvement ou avant que les couleurs soient lues : le texte complet,
  // en encre pleine. C'est aussi ce que voit un visiteur sans JavaScript.
  if (reduced || !couleurs) {
    return (
      <div ref={ref} className={className}>
        {texte.map((p) => (
          <p key={p} className="text-ink mt-5 text-lg leading-relaxed text-pretty">
            {p}
          </p>
        ))}
      </div>
    );
  }

  let curseur = 0;
  return (
    <div ref={ref} className={className}>
      {texte.map((paragraphe, iP) => (
        <p key={paragraphe} className="mt-5 text-lg leading-relaxed text-pretty">
          {mots[iP].map((mot) => {
            const rang = curseur++;
            // Chaque mot s'allume sur une fenêtre qui chevauche celle de ses
            // voisins : sans chevauchement, les mots s'allumeraient un par un
            // comme un métronome, ce qui se remarque au lieu de se lire.
            const debut = rang / total;
            // Douze mots de chevauchement et non six : le front de vague doit
            // rester visible assez longtemps pour être lu comme un mouvement,
            // pas comme un scintillement.
            const fin = Math.min(1, (rang + 12) / total);
            return (
              <Mot
                key={`${rang}-${mot}`}
                mot={mot}
                debut={debut}
                fin={fin}
                progression={scrollYProgress}
                depart={couleurs[0]}
                front={couleurs[1]}
                arrivee={couleurs[2]}
              />
            );
          })}
        </p>
      ))}
    </div>
  );
}
