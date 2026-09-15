import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/grid-pattern";
import { TextAnimate } from "@/components/ui/text-animate";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="border-rule relative overflow-hidden border-b">
      {/* La grille n'est pas un fond décoratif : c'est la grille de composition
          du projet, rendue visible. */}
      <GridPattern
        width={48}
        height={48}
        className={cn(
          "text-rule/70 absolute inset-0 h-full w-full",
          "[mask-image:radial-gradient(ellipse_at_top_left,white,transparent_75%)]",
        )}
        aria-hidden
      />

      <Container className="relative py-20 sm:py-28 lg:py-36">
        <h1 className="font-display text-ink max-w-[14ch] text-5xl leading-[0.95] font-bold tracking-[-0.03em] text-balance sm:text-7xl lg:text-8xl">
          Une base, pas un template.
        </h1>

        <TextAnimate
          as="p"
          animation="slideUp"
          by="line"
          once
          className="text-ink-secondary mt-8 max-w-(--content-max) text-lg leading-relaxed text-pretty"
        >
          NEXUS UI est l&apos;infrastructure de création numérique sur laquelle
          se construisent les projets suivants : un design system complet, une
          bibliothèque de composants réutilisables et une bibliothèque
          d&apos;animations. Chaque décision visuelle est vérifiée avant
          d&apos;être inscrite dans les tokens.
        </TextAnimate>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="rounded-xs">
            <Link href="/design-system">Voir le design system</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xs">
            <Link href="/components">Parcourir les composants</Link>
          </Button>
        </div>

        <dl className="border-rule mt-16 grid max-w-3xl grid-cols-1 gap-px border sm:grid-cols-3">
          {[
            ["Direction", "Swiss editorial"],
            ["Contraste", "WCAG AA vérifié"],
            ["Motion", "reduced-motion natif"],
          ].map(([term, value]) => (
            <div key={term} className="bg-paper p-4">
              <dt className="text-ink-muted font-mono text-[11px] tracking-[0.18em] uppercase">
                {term}
              </dt>
              <dd className="text-ink mt-1.5 text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
