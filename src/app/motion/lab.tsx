"use client";

import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import {
  CursorFollow,
  Magnetic,
  Parallax,
  PinnedSequence,
  Reveal,
  Stagger,
  StaggerItem,
  TextReveal,
  type PinnedStep,
} from "@/components/motion";
import { HorizontalRail } from "@/components/sections/horizontal-rail";
import { SpecBlock } from "@/components/sections/spec-block";
import { TiltCard } from "@/components/motion/tilt-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const DIRECTIONS = ["up", "down", "left", "right"] as const;

const STEPS: PinnedStep[] = [
  {
    index: "01",
    title: "Le scroll reste au navigateur",
    body: "La section est épinglée par position: sticky. La molette, le clavier et le geste tactile gardent leur comportement système ; rien n'intercepte le défilement.",
  },
  {
    index: "02",
    title: "Motion lit, il ne pilote pas",
    body: "useScroll rapporte la progression dans la piste. Elle sert à faire varier l'opacité des étapes, pas à déplacer la page.",
  },
  {
    index: "03",
    title: "La piste reste courte",
    body: "Sa hauteur est calculée sur le nombre d'étapes. Une section épinglée plus longue que quelques écrans donne l'impression que la page est bloquée.",
  },
];

const RAIL = [
  { index: "H1", title: "Défilement natif", body: "scroll-snap et overflow-x: auto. Le geste tactile est celui du système, la zone est focusable au clavier." },
  { index: "H2", title: "Pas de scroll détourné", body: "Aucune conversion du scroll vertical en déplacement horizontal : c'est la première cause de pages qu'on n'arrive plus à quitter." },
  { index: "H3", title: "Repère de fin", body: "Le dernier élément affleure le bord pour signaler qu'il reste du contenu, sans barre de défilement personnalisée." },
  { index: "H4", title: "Quand passer à GSAP", body: "Lorsqu'une séquence doit synchroniser plusieurs timelines sur une même piste. Tant que ce n'est pas le cas, la dépendance ne se justifie pas." },
];

export function MotionLab() {
  const reduced = useReducedMotion();

  return (
    <>
      <Section index="A" title="Entrées" className="bg-surface-2 pt-0">
        <div className="grid gap-6 lg:grid-cols-2">
          <SpecBlock
            name="Reveal"
            source="motion/reveal.tsx"
            a11y="Sous prefers-reduced-motion, le composant rend l'état final sans transition : un élément ne peut pas rester invisible parce qu'un déclencheur de scroll n'est pas parti."
          >
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
              {DIRECTIONS.map((direction, i) => (
                <Reveal key={direction} direction={direction} delay={i * 0.06} repeat>
                  <div className="border-rule bg-surface-2 grid h-20 place-items-center border">
                    <span className="font-mono text-xs">{direction}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </SpecBlock>

          <SpecBlock
            name="Stagger"
            source="motion/stagger.tsx"
            a11y="L'orchestration vit sur le parent : les enfants ignorent leur index, on peut en ajouter ou en retirer sans retoucher les délais."
          >
            <Stagger as="ul" className="w-full space-y-2" gap={0.07}>
              {["Premier", "Deuxième", "Troisième", "Quatrième"].map((label) => (
                <StaggerItem as="li" key={label}>
                  <div className="border-rule bg-surface-2 flex items-center gap-3 border px-4 py-2.5">
                    <span className="bg-signal size-1.5 rounded-full" aria-hidden />
                    <span className="text-sm">{label}</span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </SpecBlock>
        </div>
      </Section>

      <Section index="B" title="Texte">
        <SpecBlock
          name="TextReveal"
          source="motion/text-reveal.tsx"
          a11y="Le texte complet est dans le DOM en sr-only ; les fragments animés sont aria-hidden. Lecteurs d'écran et robots d'indexation lisent la phrase une fois, entière."
        >
          <div className="w-full">
            <TextReveal
              as="h3"
              by="word"
              text="Le mouvement doit renforcer la compréhension."
              className="font-display text-ink max-w-[20ch] text-3xl font-semibold tracking-tight sm:text-4xl"
            />
            <TextReveal
              by="line"
              delay={0.2}
              text="Chaque fragment monte sous un masque. La phrase reste lisible avant, pendant et après l'animation."
              className="text-ink-secondary mt-6 max-w-(--content-max) text-base leading-relaxed"
            />
          </div>
        </SpecBlock>
      </Section>

      <Section index="C" title="Survol et curseur" className="bg-surface-2">
        <div className="grid gap-6 lg:grid-cols-3">
          <SpecBlock
            name="Magnetic"
            source="motion/magnetic.tsx"
            a11y="L'enveloppe animée n'est pas focusable : le bouton réel est son enfant, donc le clavier et le lecteur d'écran ne voient que lui. L'effet ne s'active que sur pointeur fin."
          >
            <Magnetic>
              <Button className="rounded-xs">
                Passez la souris <ArrowRight aria-hidden />
              </Button>
            </Magnetic>
          </SpecBlock>

          <SpecBlock
            name="TiltCard"
            source="motion/tilt-card.tsx"
            a11y="Inclinaison plafonnée à 5°. Au-delà, le texte de la carte devient pénible à lire pendant le mouvement."
          >
            <TiltCard className="border-rule bg-surface-2 w-full border p-5">
              <p className="font-display text-ink text-base font-semibold">Carte inclinée</p>
              <p className="text-ink-secondary mt-1 text-sm">
                Le ressort revient au repos à la sortie du pointeur.
              </p>
            </TiltCard>
          </SpecBlock>

          <SpecBlock
            name="CursorFollow"
            source="motion/cursor-follow.tsx"
            a11y="Décoratif : aria-hidden et pointer-events-none. Confiné à sa zone, jamais appliqué au curseur de la page entière."
          >
            <CursorFollow className="border-rule bg-surface-2 relative w-full overflow-hidden border p-8">
              <p className="text-ink-secondary relative text-sm">
                Le halo suit le pointeur à l&apos;intérieur de ce cadre, et
                seulement ici.
              </p>
            </CursorFollow>
          </SpecBlock>
        </div>
      </Section>

      <Section index="D" title="Scroll">
        <div className="grid gap-6 lg:grid-cols-2">
          <SpecBlock
            name="Parallax"
            source="motion/parallax.tsx"
            a11y="Course totale de 28px sur la traversée du viewport. Faible par construction : au-delà, le décalage nuit à la lecture du texte posé dessus."
          >
            <div className="border-rule relative h-44 w-full overflow-hidden border">
              <Parallax distance={28} className="absolute inset-0">
                <div className="bg-surface-2 h-[130%] w-full" aria-hidden />
              </Parallax>
              <p className="text-ink absolute inset-0 grid place-items-center font-mono text-xs">
                Faites défiler la page
              </p>
            </div>
          </SpecBlock>

          <SpecBlock
            name="HorizontalRail"
            source="sections/horizontal-rail.tsx"
            a11y="Zone focusable avec role=region : les flèches du clavier défilent une fois la zone sélectionnée. Aucun détournement du scroll vertical."
          >
            <div className="w-full">
              <HorizontalRail items={RAIL} />
            </div>
          </SpecBlock>
        </div>
      </Section>

      <Section index="E" title="Section épinglée" bleed className="py-0">
        <Container>
          <PinnedSequence steps={STEPS} />
        </Container>
      </Section>

      <Section
        index="F"
        title="Reduced motion"
        lead="Le contrôle le plus important de cette page, et le seul dont l'échec est invisible en démonstration."
        className="bg-surface-2"
      >
        <Alert className="rounded-xs">
          <AlertTitle className="font-display">
            État détecté : {reduced ? "mouvement réduit" : "mouvement complet"}
          </AlertTitle>
          <AlertDescription className="max-w-(--content-max)">
            {reduced
              ? "Chaque composant de cette page rend son état final directement, sans transition ni opacité initiale. Rien n'est masqué en attendant un déclencheur."
              : "Activez « réduire les animations » dans les réglages de votre système : cette page se recharge sans aucune animation, et rien ne disparaît."}
          </AlertDescription>
        </Alert>

        <div className="border-rule mt-8 grid grid-cols-1 gap-px border md:grid-cols-3">
          {[
            ["Ce qui est retiré", "Toutes les transitions, tous les décalages, tous les stagger. motion.css met les durées à 0,01ms et les distances à 0px en un seul endroit."],
            ["Ce qui est préservé", "L'état final. Un composant ne rend jamais une version raccourcie de son animation : il rend le résultat."],
            ["Comment c'est vérifié", "npm run verify charge la page avec reducedMotion: reduce et échoue si un titre reste sous une opacité de 0,9."],
          ].map(([title, body]) => (
            <div key={title} className="bg-paper p-6">
              <h3 className="font-display text-ink text-base font-semibold tracking-tight">
                {title}
              </h3>
              <p className="text-ink-secondary mt-2 text-sm leading-relaxed text-pretty">
                {body}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
