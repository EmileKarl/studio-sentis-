import type { Metadata } from "next";

import type { Variante3D } from "@/components/motion";
import { EnTetePage } from "@/components/sentis/parts";

/**
 * Page d'aperçu des volumes proposés.
 *
 * **Temporaire.** Elle existe pour que le client voie les trois propositions
 * *en mouvement* — un arrêt sur image ne dit rien d'une animation — et elle
 * disparaît dès qu'une variante est retenue, avec les deux autres.
 *
 * Elle est hors des moteurs et hors du plan du site : c'est un outil de
 * décision, pas une page du site.
 */
export const metadata: Metadata = {
  title: { absolute: "Aperçu des volumes — Studio Sentis" },
  robots: { index: false, follow: false },
};

const PROPOSITIONS: [Variante3D, string, string][] = [
  [
    "helice",
    "A — Double hélice",
    "Deux spirales entrelacées, reliées par des barreaux. Silhouette verticale et ouverte, là où l'anneau est fermé et le treillis cubique. Se lit comme un déroulement — une méthode qui se suit.",
  ],
  [
    "constellation",
    "B — Constellation",
    "Un nuage clairsemé dont seuls les points assez proches sont reliés. Se lit comme un réseau de relations : des liens établis, et d'autres à établir.",
  ],
  [
    "ruban",
    "C — Ruban de Möbius",
    "Une bande qui se retourne sur elle-même : une seule surface, un seul bord. Le plus « objet » des trois, et celui dont la torsion se lit même à faible opacité.",
  ],
  [
    "anneau",
    "Actuel — en-tête Services",
    "Le tore actuel, pour comparaison.",
  ],
  [
    "treillis",
    "Actuel — en-tête Réalisations",
    "Le treillis cubique actuel, pour comparaison.",
  ],
];

export default function ApercuScenes() {
  return (
    <>
      {PROPOSITIONS.map(([variante, titre, note]) => (
        <EnTetePage key={variante} titre={titre} chapo={note} scene={variante} />
      ))}
    </>
  );
}
