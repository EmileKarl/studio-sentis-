import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Le texte est bilingue parce que la langue du visiteur n'est pas connue hors
 * des routes /fr et /en : ce fichier sert les deux.
 */
export default function NotFound() {
  return (
    // Volontairement sans police déclarée : `not-found.tsx` fait partie de
    // l'arbre de **toutes** les routes, donc y importer les polices de la
    // vitrine les faisait précharger sur chaque page du site de l'agence —
    // c'est exactement ce que ce découpage cherchait à éviter. Le 404 compose
    // donc avec les polices du système, ce qui n'a jamais coûté un client.
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
            <Link href="/fr">Accueil</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-md">
            <Link href="/en">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
