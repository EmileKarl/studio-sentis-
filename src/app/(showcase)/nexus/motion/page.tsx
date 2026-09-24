import type { Metadata } from "next";

import { MotionLab } from "./lab";
import { Section } from "@/components/layout/section";
import { TokenTable } from "@/components/sections/token-table";

export const metadata: Metadata = {
  title: "Motion Lab",
  description:
    "Bibliothèque d'animations : entrées, stagger, révélation de texte, scroll, parallaxe, sections épinglées, interactions au curseur et transitions de page.",
};

const RULES = [
  { name: "Entrée", value: "420ms · ease-out", note: "Reveal, Stagger, TextReveal" },
  { name: "Survol", value: "160ms · ease-out", note: "Boutons, liens, cartes" },
  { name: "Overlay", value: "240ms · ease-out", note: "Modale, tiroir, popover" },
  { name: "Transition de page", value: "240ms · ease-out", note: "Opacité + 8px, sans sortie" },
  { name: "Stagger", value: "40 / 70 / 120ms", note: "Serré, standard, ample" },
  { name: "Course", value: "8 / 16 / 28px", note: "Au-delà, cela lit comme un reflux de layout" },
];

export default function MotionPage() {
  return (
    <>
      <Section
        index="§9.4"
        title="Motion Lab"
        lead="La bibliothèque d'animations du projet, et la démonstration de chaque famille. Durées, courbes, décalages et distances viennent tous de src/styles/motion.css — aucune valeur n'est écrite dans un composant."
      >
        <TokenTable caption="Règles de motion appliquées" rows={RULES} />
      </Section>

      <MotionLab />
    </>
  );
}
