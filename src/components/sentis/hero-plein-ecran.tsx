"use client";

import { ArrowDown, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

import { Reveal3D } from "@/components/motion";
import { Entree } from "@/components/motion/entree";
import { Scene3DDifferee } from "@/components/motion/differe";
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

      {/* Le treillis tourne en continu et suit le défilement : c'est la
          première chose qui bouge, avant même que le visiteur ait lu le titre.
          Il est masqué vers la gauche pour laisser la colonne de texte nette. */}
      <Scene3DDifferee
        variante="treillis"
        // 0,20 et non 0,6 : la planche « Concept 16 » remplace le violet
        // profond de l'accent précédent par un terracotta nettement plus
        // clair. À opacité égale, le contrôle mesurait le chapô du héros à
        // 2,69:1 sur le pire pixel de fond en thème sombre, pour un plancher à
        // 4,5. La valeur est descendue par paliers — 0,38 donnait encore
        // 3,16:1 et 0,24 encore 4,47:1 — jusqu'à ce que `npm run verify:scene`
        // repasse. Elle n'est pas choisie à l'œil : c'est le prix d'un accent
        // clair posé derrière du texte clair, et la scène y gagne la discrétion
        // que « néo-minimaliste » demandait de toute façon.
        alpha={0.2}
        decalage={0.34}
        zoom={1.22}
        className="text-accent-bleu [mask-image:radial-gradient(ellipse_at_76%_48%,white,transparent_74%)]"
      />

      <Zone className="relative flex flex-1 flex-col justify-center py-24">
        {/* La cascade du héros — 0, 160, 240 ms — est celle qui était réglée
            en JavaScript. Elle est maintenant en CSS, donc elle part même si
            le JavaScript n'est pas encore arrivé. C'est exactement le défaut
            que le client a vu : ces trois blocs restaient invisibles tant que
            les 875 ko n'étaient pas téléchargés et analysés. */}
        <Entree distance={12}>
          <p className="text-ink-muted flex items-center gap-2 text-sm">
            <MapPin className="size-4" aria-hidden />
            {dict.hero.lieu}
          </p>
        </Entree>

        {/* `sansFondu` : ce titre est l'élément LCP de la page d'accueil. Animé
            en opacité, il repoussait la mesure à 1 148 ms sur un téléphone.
            Voir le commentaire de l'option dans `Reveal3D`. */}
        <Reveal3D depuis="bas" distance={110} angle={10} delay={0.06} sansFondu>
          <h1 className="font-display text-ink mt-8 max-w-[15ch] text-[2.5rem] leading-[0.98] font-semibold tracking-tight text-balance min-[360px]:text-5xl sm:text-6xl lg:text-7xl">
            {dict.hero.titre}
          </h1>
        </Reveal3D>

        <Entree distance={18} delai={160}>
          <p className="text-ink-secondary mt-8 max-w-(--content-max) text-lg leading-relaxed text-pretty sm:text-xl">
            {dict.hero.chapo}
          </p>
        </Entree>

        <Entree distance={18} delai={240}>
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
        </Entree>
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
