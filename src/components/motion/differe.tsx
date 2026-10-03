"use client";

import dynamic from "next/dynamic";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { Variante3D } from "@/components/motion/scene-3d";

/**
 * Chargement différé du décor.
 *
 * Les scènes WebGL et le globe sont deux choses à la fois : ce qui fait le
 * plus d'effet, et ce dont la page se passe le mieux. Aucun des deux ne porte
 * d'information — ils sont `aria-hidden`, et le texte dit déjà tout. Ils n'ont
 * donc rien à faire dans le premier paquet de JavaScript, ni dans le rendu
 * serveur.
 *
 * `ssr: false` n'est pas un détail : un canvas rendu au serveur est un canvas
 * vide dans le HTML. On économise les octets **et** le travail d'hydratation,
 * sans rien perdre à l'écran.
 *
 * Mesuré avant ce changement : les cinq pages du site chargeaient exactement
 * les mêmes 889 ko de JavaScript, décor compris — la page contact tirait le
 * moteur de scène 3D qu'elle n'utilise pas, et l'accueil tirait le trait de
 * côte du globe, 14 ko de coordonnées qu'il n'affiche jamais.
 */

const Scene3DBase = dynamic(
  () => import("@/components/motion/scene-3d").then((mod) => mod.Scene3D),
  { ssr: false },
);

const GlobeBase = dynamic(
  () =>
    import("@/components/sentis/globe-territoire").then(
      (mod) => mod.GlobeTerritoire,
    ),
  { ssr: false },
);

/**
 * Monte son contenu quand le navigateur n'a plus rien d'urgent à faire.
 *
 * `next/dynamic` va chercher le morceau au **montage** du composant. Rendre la
 * scène tout de suite revient donc à la remettre dans le chemin critique, ce
 * que la mesure a confirmé : découper sans différer le montage n'avait rien
 * changé au poids du premier chargement.
 *
 * `requestIdleCallback` attend que la page soit peinte et interactive. Le
 * décor arrive deux cents millisecondes plus tard, ce qui ne se voit pas — il
 * apparaît de toute façon en fondu — et le texte, lui, est peint plus tôt.
 */
function ApresInactivite({ children }: { children: ReactNode }) {
  const [pret, setPret] = useState(false);

  useEffect(() => {
    // `requestIdleCallback` n'existe pas encore sur Safari iOS : le repli par
    // minuterie donne le même résultat, juste moins finement.
    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(() => setPret(true), { timeout: 1200 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(() => setPret(true), 200);
    return () => clearTimeout(id);
  }, []);

  return pret ? <>{children}</> : null;
}

export function Scene3DDifferee(props: {
  variante?: Variante3D;
  alpha?: number;
  vitesse?: number;
  scroll?: number;
  decalage?: number;
  zoom?: number;
  className?: string;
}) {
  return (
    <ApresInactivite>
      <Scene3DBase {...props} />
    </ApresInactivite>
  );
}

/**
 * Ne monte son contenu qu'une fois le cadre approché.
 *
 * `next/dynamic` va chercher le morceau au montage du composant — c'est-à-dire
 * tout de suite. Pour le globe, qui vit en bas de la page contact, ce serait
 * télécharger son trait de côte pendant que le visiteur lit le formulaire.
 * L'observateur décale ce téléchargement jusqu'à 300 px avant l'entrée à
 * l'écran : assez tôt pour que rien ne se voie, assez tard pour ne rien coûter
 * à quelqu'un qui ne descend pas.
 */
function QuandVisible({
  children,
  hauteur,
}: {
  children: ReactNode;
  /** Réservée d'avance, pour qu'aucune ligne ne bouge au moment du montage. */
  hauteur: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Sans IntersectionObserver (navigateur ancien, environnement de test
  // exotique), on monte tout de suite plutôt que de ne jamais rien montrer.
  //
  // `useSyncExternalStore` et non un initialiseur d'état : sur le serveur
  // `IntersectionObserver` est toujours absent, donc un initialiseur renvoyait
  // `true` au rendu serveur et `false` au client. React refusait l'hydratation
  // — erreur #418, dix-huit constats au contrôle navigateur. Ce hook est fait
  // pour ce cas précis : une valeur au serveur, une autre au client, sans
  // divergence au premier rendu.
  const sansObservateur = useSyncExternalStore(
    () => () => {},
    () => typeof IntersectionObserver === "undefined",
    () => false,
  );
  const [vu, setVu] = useState(false);
  const visible = sansObservateur || vu;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entrees) => {
        if (entrees.some((e) => e.isIntersecting)) {
          setVu(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: hauteur }}>
      {visible ? children : null}
    </div>
  );
}

export function GlobeDiffere({ legende }: { legende: string }) {
  return (
    <QuandVisible hauteur={300}>
      <GlobeBase legende={legende} />
    </QuandVisible>
  );
}
