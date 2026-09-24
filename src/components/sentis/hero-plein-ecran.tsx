"use client";

import { ArrowDown, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/motion";
import { Zone } from "@/components/sentis/parts";
import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/grid-pattern";
import type { Dict, Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Héros plein écran.
 *
 * `min-h` plutôt que `h` : sur un téléphone en paysage, ou avec une taille de
 * police augmentée, un héros à hauteur fixe coupe son propre contenu. La
 * hauteur de viewport est un minimum, pas un plafond.
 *
 * On retranche la hauteur de l'en-tête, qui est collant mais reste dans le
 * flux : sans cela « plein écran » vaut un écran plus 64 px, et l'invitation à
 * descendre tombe sous la ligne de flottaison — exactement l'élément qui ne
 * doit pas s'y trouver.
 */
export function HeroPleinEcran({
  dict,
  locale,
}: {
  dict: Dict;
  locale: Locale;
}) {
  return (
    <section className="border-rule relative flex min-h-[calc(100dvh-4rem)] flex-col overflow-hidden border-b">
      <GridPattern
        width={56}
        height={56}
        className={cn(
          "text-rule absolute inset-0 h-full w-full",
          "[mask-image:radial-gradient(ellipse_at_30%_20%,white,transparent_72%)]",
        )}
        aria-hidden
      />

      <Zone className="relative flex flex-1 flex-col justify-center py-24">
        <Reveal direction="up" distance={12}>
          <p className="text-ink-muted flex items-center gap-2 text-sm">
            <MapPin className="size-4" aria-hidden />
            {dict.hero.lieu}
          </p>
        </Reveal>

        <Reveal direction="up" distance={18} delay={0.08}>
          <h1 className="font-display text-ink mt-8 max-w-[15ch] text-[2.5rem] leading-[0.98] font-semibold tracking-tight text-balance min-[360px]:text-5xl sm:text-6xl lg:text-7xl">
            {dict.hero.titre}
          </h1>
        </Reveal>

        <Reveal direction="up" distance={18} delay={0.16}>
          <p className="text-ink-secondary mt-8 max-w-(--content-max) text-lg leading-relaxed text-pretty sm:text-xl">
            {dict.hero.chapo}
          </p>
        </Reveal>

        <Reveal direction="up" distance={18} delay={0.24}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-md text-base">
              <Link href={`/${locale}/contact`}>
                {dict.nav.soumission} <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-md text-base">
              <Link href={`/${locale}/realisations`}>{dict.nav.realisations}</Link>
            </Button>
          </div>
        </Reveal>
      </Zone>

      <Zone className="relative pb-10">
        <p
          className="text-ink-muted flex items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase"
          aria-hidden
        >
          <ArrowDown className="size-3.5" />
          {locale === "fr" ? "Descendez" : "Scroll"}
        </p>
      </Zone>
    </section>
  );
}
