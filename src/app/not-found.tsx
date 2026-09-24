import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Le 404 sert deux publics sur un seul déploiement, et ne sait pas lequel se
 * trompe d'adresse : il propose donc les deux entrées plutôt que d'en deviner
 * une. Le texte est bilingue pour la même raison — la langue du visiteur n'est
 * pas connue hors des routes /fr et /en.
 */
export default function NotFound() {
  return (
    <div className="bg-paper text-ink grid min-h-dvh place-items-center px-5 py-20">
      <div className="max-w-(--content-max)">
        <p className="text-ink-muted font-mono text-sm tracking-[0.18em] uppercase">
          404
        </p>
        <h1 className="font-display text-ink mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Cette page n&apos;existe pas
        </h1>
        <p className="text-ink-secondary mt-3 text-lg" lang="en">
          This page doesn&apos;t exist.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-md">
            <Link href="/fr">Studio Sentis</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-md">
            <Link href="/nexus">NEXUS UI</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
