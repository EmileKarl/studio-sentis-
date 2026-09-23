import type { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { SpecBlock } from "@/components/sections/spec-block";
import { ComponentsDemo } from "./demo";

export const metadata: Metadata = {
  title: "Composants",
  description:
    "Bibliothèque de composants réutilisables : contrôles, formulaires, navigation, cartes, overlays, feedback, données et motion.",
};

export default function ComponentsPage() {
  return (
    <>
      <Section
        index="§9.3"
        title="Composants"
        lead="Les primitives viennent de shadcn/ui, construites sur Radix : le comportement clavier, la gestion du focus et les rôles ARIA sont fournis par la primitive, pas réimplémentés. Dix composants Magic UI complètent la couche motion et pattern."
      >
        <SpecBlock
          name="Contrat de présentation"
          source="src/components/sections/spec-block.tsx"
          a11y="Chaque bloc ci-dessous déclare sa règle d'accessibilité. Un composant sans règle énoncée n'est pas considéré comme livré."
        >
          <p className="text-ink-secondary max-w-(--content-max) text-sm leading-relaxed text-pretty">
            Le cahier des charges impose que chaque composant montre son
            apparence, ses variantes, ses états, son comportement responsive et
            ses règles d&apos;accessibilité. Les variantes et états complets de
            chaque famille, ainsi que les exemples de code, arrivent avec la
            page Documentation.
          </p>
        </SpecBlock>
      </Section>

      <ComponentsDemo />
    </>
  );
}
