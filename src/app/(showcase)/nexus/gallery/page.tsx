import type { Metadata } from "next";

import { GalleryShowcase } from "./showcase";
import { Section } from "@/components/layout/section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Compositions, grilles, patterns et animations de signature : recomposition de grille, onde de graisse typographique, révélation à l'encre, filets pilotés nativement par le scroll.",
};

export default function GalleryPage() {
  return (
    <>
      <Section
        index="§9.5"
        title="Gallery"
        lead="Les compositions possibles du système, et les quatre animations de signature du projet. Aucune n'est un effet posé par-dessus la mise en page : chacune anime ce dont le projet est fait — la grille, la graisse typographique, l'encre, le filet."
      >
        <Alert className="rounded-xs">
          <AlertTitle className="font-display">
            Une contrainte commune aux quatre
          </AlertTitle>
          <AlertDescription className="max-w-(--content-max)">
            Aucune ne touche à l&apos;opacité du texte. Il n&apos;existe donc
            aucun instant où le contenu serait illisible, ni aucun état dans
            lequel il pourrait rester bloqué si l&apos;animation ne partait pas
            — le défaut que ce projet a rencontré trois fois et qui lui a coûté
            un titre, des compteurs et des étapes de section.
          </AlertDescription>
        </Alert>
      </Section>

      <GalleryShowcase />
    </>
  );
}
