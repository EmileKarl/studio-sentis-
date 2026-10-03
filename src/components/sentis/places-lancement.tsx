"use client";

import { useEffect, useRef, useState } from "react";

import { PLACES_LANCEMENT } from "@/lib/site";

/**
 * Les dix places, dessinées pour être comptées.
 *
 * C'est le seul endroit de cette page où le mouvement se justifie vraiment.
 * Partout ailleurs une entrée ne fait qu'éviter un surgissement ; ici elle
 * **fait quelque chose** : dix pastilles qui s'allument l'une après l'autre
 * sont comptées par l'œil, alors que dix pastilles qui apparaissent ensemble
 * sont vues comme un bloc. Le décalage ne décore pas le nombre, il le dit.
 *
 * Décalage de 40 ms, soit `--stagger-tight`. Dix pastilles font 360 ms en
 * tout — au-delà, l'attente se lirait comme une lenteur, et rien ici ne vaut
 * qu'on attende. Le décalage est purement décoratif : il ne retarde aucune
 * interaction, parce que ces pastilles n'en portent aucune.
 *
 * Chaque pastille part de `scale(0.9)` et non de `scale(0)` : rien, dans le
 * monde réel, n'apparaît à partir de rien. Une forme qui grandit un peu se lit
 * comme une forme qui arrive ; une forme qui part de zéro se lit comme un
 * défaut d'affichage.
 *
 * **Les pastilles sont vides, et elles le resteront jusqu'à la première
 * signature.** En afficher des prises serait le seul mensonge d'une page dont
 * tout l'argument est de ne pas en faire. Le trait est tireté pour cette
 * raison : une place réservée se dessine en plein, une place libre en pointillé.
 *
 * `aria-hidden` sur la liste : dix éléments identiques annoncés un par un
 * donneraient dix fois « élément, 1 », « élément, 2 » pour rien. La phrase
 * juste en dessous porte la même information en mots, une fois.
 */
export function PlacesLancement({
  titre,
  etat,
}: {
  titre: string;
  etat: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vu, setVu] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (!entree.isIntersecting) return;
        setVu(true);
        observateur.disconnect();
      },
      { rootMargin: "0px 0px -40px 0px" },
    );
    observateur.observe(element);
    return () => observateur.disconnect();
  }, []);

  return (
    <div ref={ref} data-vu={vu} className="group/places">
      <p className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
        {titre}
      </p>
      <ul
        aria-hidden
        className="mt-5 grid grid-cols-5 gap-3 sm:gap-4 lg:grid-cols-10"
      >
        {Array.from({ length: PLACES_LANCEMENT }, (_, i) => (
          <li
            key={i}
            data-entree-animee
            // Le délai vit dans une variable plutôt que dans dix classes :
            // Tailwind ne génère pas une classe qu'il ne voit pas écrite, et
            // dix littéraux pour une suite arithmétique seraient dix occasions
            // de se tromper le jour où le nombre de places change.
            style={{ "--i": i } as React.CSSProperties}
            className="border-accent-bleu text-accent-bleu flex aspect-square scale-90 translate-y-2 items-center justify-center rounded-xl border-2 border-dashed font-mono text-sm tabular-nums opacity-0 transition-[opacity,scale,translate] delay-(--delai-place) duration-(--duration-base) ease-(--ease-out) group-data-[vu=true]/places:scale-100 group-data-[vu=true]/places:translate-y-0 group-data-[vu=true]/places:opacity-100 [--delai-place:calc(var(--i)*40ms)]"
          >
            {i + 1}
          </li>
        ))}
      </ul>
      <p className="text-ink-secondary mt-5 max-w-(--content-max) leading-relaxed text-pretty">
        {etat}
      </p>
    </div>
  );
}
