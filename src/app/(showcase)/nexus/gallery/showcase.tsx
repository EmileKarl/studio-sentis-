"use client";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { GridRecompose, InkBleed, WeightWave } from "@/components/motion";
import { SpecBlock } from "@/components/sections/spec-block";

const PATTERNS = [
  {
    name: "Grille",
    id: "p-grid",
    svg: (
      <pattern id="p-grid" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M24 0H0v24" fill="none" stroke="currentColor" strokeWidth="1" />
      </pattern>
    ),
  },
  {
    name: "Points",
    id: "p-dots",
    svg: (
      <pattern id="p-dots" width="16" height="16" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.4" fill="currentColor" />
      </pattern>
    ),
  },
  {
    name: "Hachures",
    id: "p-hatch",
    svg: (
      <pattern
        id="p-hatch"
        width="10"
        height="10"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1.5" />
      </pattern>
    ),
  },
  {
    name: "Trame",
    id: "p-halftone",
    svg: (
      <pattern id="p-halftone" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="3.4" fill="currentColor" />
        <circle cx="15" cy="15" r="1.6" fill="currentColor" />
      </pattern>
    ),
  },
];

export function GalleryShowcase() {
  return (
    <>
      <Section
        index="A"
        title="Recomposition de grille"
        lead="Les mêmes blocs passent d'une composition à l'autre. Motion mesure la position avant et après, puis interpole en transform : aucun bloc n'est démonté, donc le focus clavier et la sélection de texte survivent à la transition."
        className="bg-surface-2 pt-0"
      >
        <GridRecompose />
      </Section>

      <Section
        index="B"
        title="Onde de graisse"
        lead="Archivo est une police variable. Plutôt que de faire entrer le texte, on interpole son axe wght caractère par caractère selon la distance au pointeur. La lettre ne se déplace pas et ne s'efface jamais — seule son épaisseur respire."
      >
        <div className="border-rule bg-surface border p-6 sm:p-12">
          <WeightWave
            as="h3"
            text="Le poids fait le rythme"
            className="text-ink cursor-default text-4xl leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-7xl"
            min={260}
            max={900}
            spread={0.2}
          />
          <WeightWave
            as="p"
            text="Passez le pointeur le long de cette ligne."
            className="text-ink-secondary mt-8 cursor-default text-lg sm:text-2xl"
            min={300}
            max={700}
            spread={0.16}
          />
        </div>
        <p className="text-ink-muted mt-4 max-w-(--content-max) font-mono text-xs">
          Sans pointeur fin — tactile, ou hover: none — l&apos;onde est pilotée
          par la progression du scroll, pour que l&apos;effet reste vivant sur
          mobile plutôt que d&apos;y être mort.
        </p>
      </Section>

      <Section
        index="C"
        title="Révélation à l'encre"
        lead="Un bruit fractal déplace les pixels du bloc, puis l'amplitude retombe à zéro : le texte se reforme comme une impression qui sèche. Le filtre est retiré à la fin — le laisser en place coûterait la netteté du rendu sous-pixel pour toute la vie de la page."
        className="bg-surface-2"
      >
        <InkBleed amplitude={22} className="border-rule bg-surface relative border p-6 sm:p-12">
          <h3 className="font-display text-ink max-w-[16ch] text-3xl font-bold tracking-[-0.02em] text-balance sm:text-5xl">
            L&apos;encre se dépose, puis elle sèche
          </h3>
          <p className="text-ink-muted mt-3 font-mono text-xs">
            feTurbulence + feDisplacementMap
          </p>
          <p className="text-ink-secondary mt-6 max-w-(--content-max) text-base leading-relaxed text-pretty">
            L&apos;opacité ne bouge à aucun moment. Ce bloc est à cent pour cent
            du premier au dernier frame : il est déformé, jamais invisible.
          </p>
        </InkBleed>
      </Section>

      <Section
        index="D"
        title="Filets pilotés par le scroll, sans JavaScript"
        lead="animation-timeline lie une animation CSS à la position d'un élément dans le viewport. Pas d'IntersectionObserver, pas d'écouteur de scroll, pas de rAF : le travail se fait sur le thread de composition, donc il ne peut pas être retardé par du JavaScript."
      >
        <div className="border-rule bg-surface border p-6 sm:p-10">
          <div className="flex gap-6">
            <div
              className="sd-meter bg-surface-2 relative w-1 shrink-0 overflow-hidden"
              aria-hidden
            >
              <span className="bg-signal absolute inset-0 block" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="sd-weight font-display text-ink text-3xl tracking-tight sm:text-4xl">
                La graisse suit le défilement
              </h3>
              <div className="bg-signal sd-rule mt-6 h-px w-full" aria-hidden />
              <p className="text-ink-secondary mt-6 max-w-(--content-max) text-base leading-relaxed text-pretty">
                Le filet se trace, la colonne se remplit et le titre prend du
                poids à mesure que ce bloc traverse le viewport. Tout est écrit
                dans <code className="font-mono text-sm">scroll-driven.css</code>,
                sous <code className="font-mono text-sm">@supports</code>.
              </p>
              <div className="bg-rule sd-rule mt-6 h-px w-full" aria-hidden />
            </div>
          </div>
        </div>
        <p className="text-ink-muted mt-4 max-w-(--content-max) font-mono text-xs">
          Là où la propriété n&apos;existe pas, rien n&apos;est masqué : le bloc
          est simplement rendu dans son état final.
        </p>
      </Section>

      <Section index="E" title="Patterns" className="bg-surface-2">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {PATTERNS.map((pattern) => (
            <figure key={pattern.id} className="border-rule bg-paper border">
              <svg
                viewBox="0 0 120 80"
                className="text-rule-strong block h-24 w-full"
                aria-hidden
              >
                <defs>{pattern.svg}</defs>
                <rect width="120" height="80" fill={`url(#${pattern.id})`} />
              </svg>
              <figcaption className="border-rule border-t p-3">
                <p className="text-ink font-mono text-xs">{pattern.name}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="text-ink-muted mt-4 max-w-(--content-max) text-sm leading-relaxed text-pretty">
          Quatre trames SVG en <code className="font-mono">currentColor</code> :
          elles suivent le thème sans seconde déclaration, et restent nettes à
          n&apos;importe quelle densité d&apos;écran.
        </p>
      </Section>

      <Section index="F" title="Variantes de hero" bleed>
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            <SpecBlock
              name="Éditorial"
              source="Titre pleine chasse, filet, chapô court"
              a11y="Un seul h1 par page ; les variantes présentées ici sont des h3."
            >
              <div className="w-full">
                <h3 className="font-display text-ink text-2xl leading-[0.95] font-bold tracking-[-0.03em]">
                  Une base, pas un template.
                </h3>
                <div className="bg-signal mt-3 h-px w-12" aria-hidden />
                <p className="text-ink-secondary mt-3 text-sm">Chapô de deux lignes.</p>
              </div>
            </SpecBlock>

            <SpecBlock
              name="Split"
              source="Titre à gauche, index à droite"
              a11y="La colonne d'index est décorative et sortie de l'ordre de lecture."
            >
              <div className="grid w-full grid-cols-[1fr_auto] gap-4">
                <h3 className="font-display text-ink text-2xl leading-[0.95] font-bold tracking-[-0.03em]">
                  Système, pas page
                </h3>
                <span className="text-ink-muted font-mono text-[11px] tabular-nums" aria-hidden>
                  01/05
                </span>
              </div>
            </SpecBlock>

            <SpecBlock
              name="Tableau"
              source="Titre + définitions en grille à filet"
              a11y="Une liste de définitions <dl>, pas une grille de div."
            >
              <div className="w-full">
                <h3 className="font-display text-ink text-2xl leading-[0.95] font-bold tracking-[-0.03em]">
                  Mesuré
                </h3>
                <dl className="border-rule mt-3 grid grid-cols-2 gap-px border">
                  {[["Tokens", "141"], ["Pages", "5"]].map(([k, v]) => (
                    <div key={k} className="bg-paper p-2">
                      <dt className="text-ink-muted font-mono text-[11px] uppercase">{k}</dt>
                      <dd className="text-ink font-mono text-sm tabular-nums">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </SpecBlock>
          </div>
        </Container>
      </Section>
    </>
  );
}
