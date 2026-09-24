import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { HorizontalTrack } from "@/components/motion";
import { Panel, PanelTexte, PanelTitre } from "./panels";

export const metadata: Metadata = {
  title: "Défilement",
  description:
    "Séquences horizontales et verticales alternées, pilotées par le défilement vertical de la page — sans jamais l'intercepter.",
};

/** Section verticale ordinaire, entre deux séquences horizontales. */
function Vertical({
  index,
  titre,
  children,
}: {
  index: string;
  titre: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-rule border-y py-24 sm:py-32">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:gap-12">
          <p className="text-ink-muted shrink-0 font-mono text-xs tracking-[0.2em] uppercase">
            {index}
          </p>
          <div className="min-w-0">
            <h2 className="font-display text-ink max-w-[20ch] text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
              {titre}
            </h2>
            <div className="mt-6 space-y-5">{children}</div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-ink-secondary max-w-(--content-max) text-base leading-relaxed text-pretty">
      {children}
    </p>
  );
}

export default function ScrollPage() {
  return (
    <>
      {/* ---------------------------------------------- 1 · horizontale */}
      <HorizontalTrack
        label="Manifeste, séquence horizontale de quatre panneaux"
        panels={[
          <Panel key="1" tone="ink">
            <PanelTitre tone="ink">Descendez.</PanelTitre>
            <PanelTexte tone="ink">
              Vous défilez verticalement, comme sur n&apos;importe quelle page.
              C&apos;est le contenu qui se déplace de côté.
            </PanelTexte>
          </Panel>,
          <Panel key="2" tone="paper">
            <PanelTitre>Rien n&apos;a été intercepté.</PanelTitre>
            <PanelTexte>
              La barre de défilement, les flèches, Page suivante, Origine et Fin
              répondent exactement comme d&apos;habitude. Essayez.
            </PanelTexte>
          </Panel>,
          <Panel key="3" tone="signal">
            <PanelTitre tone="signal">Parce que c&apos;est là que ça casse.</PanelTitre>
            <PanelTexte tone="signal">
              Convertir le geste vertical en déplacement horizontal est la
              manière évidente de faire ceci. C&apos;est aussi celle qui produit
              des pages dont on ne sort plus.
            </PanelTexte>
          </Panel>,
          <Panel key="4" tone="sand">
            <PanelTitre>Une piste haute, un panneau collant.</PanelTitre>
            <PanelTexte>
              Toute la mécanique tient en deux propriétés CSS et une
              interpolation. Le reste est du contenu.
            </PanelTexte>
          </Panel>,
        ]}
      />

      {/* ------------------------------------------------ 2 · verticale */}
      <Vertical index="§2" titre="Pourquoi l'alternance fonctionne">
        <P>
          Une page entièrement horizontale fatigue : elle retire le repère de
          position que la barre de défilement donne gratuitement, et elle impose
          un geste que personne n&apos;a choisi. Une page entièrement verticale
          ne surprend jamais.
        </P>
        <P>
          L&apos;alternance résout les deux. La séquence horizontale sert ce qui
          est réellement une progression — un manifeste, une chronologie, une
          comparaison — et la section verticale rend la lecture au lecteur dès
          que le propos demande de s&apos;arrêter.
        </P>
        <P>
          Le rythme compte autant que l&apos;effet : une séquence horizontale
          de plus de quatre ou cinq panneaux cesse d&apos;être une surprise et
          devient une corvée.
        </P>
      </Vertical>

      {/* ---------------------------------------------- 3 · horizontale */}
      <HorizontalTrack
        label="Déroulé d'un projet, séquence horizontale de quatre étapes"
        panels={[
          <Panel key="1" tone="sand">
            <PanelTitre>On se parle.</PanelTitre>
            <PanelTexte>
              Trente minutes. Vous décrivez votre activité, je pose les
              questions qui manquent. Aucun engagement.
            </PanelTexte>
          </Panel>,
          <Panel key="2" tone="paper">
            <PanelTitre>Un prix. Une date.</PanelTitre>
            <PanelTexte>
              Par écrit, sous 48 heures. Le montant est ferme et la date aussi.
            </PanelTexte>
          </Panel>,
          <Panel key="3" tone="ink">
            <PanelTitre tone="ink">Vous voyez avancer.</PanelTitre>
            <PanelTexte tone="ink">
              Un lien de suivi dès le premier jour. Vous commentez au fur et à
              mesure, pas à la fin.
            </PanelTexte>
          </Panel>,
          <Panel key="4" tone="signal">
            <PanelTitre tone="signal">Vous prenez la main.</PanelTitre>
            <PanelTexte tone="signal">
              Le site est à vous. Une heure de prise en main pour que vous
              puissiez le modifier seul.
            </PanelTexte>
          </Panel>,
        ]}
      />

      {/* ------------------------------------------------ 4 · verticale */}
      <Vertical index="§4" titre="Ce que ça coûte, honnêtement">
        <P>
          Une séquence horizontale occupe la hauteur de plusieurs écrans pour
          un contenu qui en tiendrait un. C&apos;est du temps de lecture acheté
          avec de la place : il faut que le contenu le vaille.
        </P>
        <P>
          Sous <code className="font-mono text-sm">prefers-reduced-motion</code>,
          chaque séquence redevient un empilement vertical ordinaire. Rien
          n&apos;est masqué, rien n&apos;attend une animation qui ne se jouera
          pas.
        </P>
        <P>
          Et le repère de position revient sous forme de points : sans lui, une
          séquence horizontale retire au lecteur la seule information que la
          barre lui donnait — où il en est, et combien il reste.
        </P>
      </Vertical>

      {/* ---------------------------------------------- 5 · horizontale */}
      <HorizontalTrack
        label="Conclusion, séquence horizontale de trois panneaux"
        panels={[
          <Panel key="1" tone="paper">
            <PanelTitre>Un effet se juge à ce qu&apos;il retire.</PanelTitre>
            <PanelTexte>
              Pas à ce qu&apos;il ajoute. Celui-ci ne retire ni la barre de
              défilement, ni le clavier, ni la possibilité de partir.
            </PanelTexte>
          </Panel>,
          <Panel key="2" tone="ink">
            <PanelTitre tone="ink">Le contenu d&apos;abord.</PanelTitre>
            <PanelTexte tone="ink">
              Une séquence horizontale sur un propos qui ne progresse pas est un
              carrousel déguisé.
            </PanelTexte>
          </Panel>,
          <Panel key="3" tone="signal">
            <PanelTitre tone="signal">Continuez à descendre.</PanelTitre>
            <PanelTexte tone="signal">
              La page se termine normalement, comme elle a commencé.
            </PanelTexte>
          </Panel>,
        ]}
      />

      <section className="py-24">
        <Container>
          <p className="text-ink-muted max-w-(--content-max) font-mono text-sm leading-relaxed">
            src/components/motion/horizontal-track.tsx
          </p>
        </Container>
      </section>
    </>
  );
}
