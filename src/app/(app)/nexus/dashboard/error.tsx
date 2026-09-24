"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

/**
 * Frontière d'erreur de la route. Elle dit ce qui s'est passé et ce que la
 * personne peut faire ; elle n'affiche pas la trace technique, qui n'aide
 * personne et expose la structure interne.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="flex flex-col items-start gap-4 p-8 sm:p-12">
      <AlertTriangle className="text-error size-6" aria-hidden />
      <div>
        <h1 className="font-display text-ink text-2xl font-semibold tracking-tight">
          Le tableau de bord n&apos;a pas pu s&apos;afficher
        </h1>
        <p className="text-ink-secondary mt-2 max-w-(--content-max) text-base leading-relaxed text-pretty">
          L&apos;erreur a été enregistrée. Réessayer recharge uniquement cette
          section : la navigation et le thème restent en place.
        </p>
        {error.digest ? (
          <p className="text-ink-muted mt-3 font-mono text-xs">
            Référence : {error.digest}
          </p>
        ) : null}
      </div>
      <Button className="rounded-xs" onClick={reset}>
        <RotateCw aria-hidden /> Réessayer
      </Button>
    </div>
  );
}
