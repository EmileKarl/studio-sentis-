"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import type { Dict } from "@/lib/i18n";
import { FIN_OFFRE } from "@/lib/site";

/**
 * Compte à rebours de l'offre de lancement.
 *
 * Trois précautions, chacune pour un défaut précis :
 *
 * 1. **Rien au rendu serveur.** Une page de ce site est construite une fois,
 *    puis servie telle quelle pendant des semaines. Un compte à rebours calculé
 *    au serveur afficherait l'écart au moment de la **construction**, figé —
 *    « 12 jours » pendant un mois. Le premier rendu est donc vide, et les
 *    chiffres n'arrivent qu'au client, où l'heure est vraie.
 * 2. **`useSyncExternalStore` pour savoir qu'on est au client**, et non un
 *    effet qui appelle `setState`. Ce projet a déjà payé ce défaut : un
 *    initialiseur d'état qui divergeait entre serveur et client provoquait
 *    l'erreur React #418 et dix-huit constats au contrôle navigateur.
 * 3. **Pas de `<time>` sur les chiffres qui bougent.** Le lecteur d'écran
 *    relirait la valeur à chaque seconde. Le bloc est marqué `aria-hidden` et
 *    la date de fin est donnée en toutes lettres à côté, une fois.
 *
 * Sans `NEXT_PUBLIC_FIN_OFFRE`, il ne s'affiche pas : une échéance inventée sur
 * la seule page du site qui promet une date serait le pire endroit pour mentir.
 */

function restant(fin: number) {
  const delta = Math.max(0, fin - Date.now());
  return {
    fini: delta === 0,
    jours: Math.floor(delta / 86400000),
    heures: Math.floor(delta / 3600000) % 24,
    minutes: Math.floor(delta / 60000) % 60,
    secondes: Math.floor(delta / 1000) % 60,
  };
}

export function CompteARebours({ dict }: { dict: Dict }) {
  const c = dict.pages.realisations.offre.compteARebours;

  // Vrai seulement au client. Voir la précaution 2 ci-dessus.
  const auClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const fin = FIN_OFFRE ? new Date(FIN_OFFRE).getTime() : NaN;
  const dateValide = Number.isFinite(fin);

  const [temps, setTemps] = useState(() =>
    dateValide ? restant(fin) : null,
  );

  // Pas de `setTemps` immédiat ici : l'initialiseur de `useState` a déjà
  // calculé l'écart au premier rendu client, à quelques millisecondes près.
  // L'appeler une fois de plus dans l'effet ne corrige rien et déclenche
  // `react-hooks/set-state-in-effect`, la règle qui a déjà servi dans ce
  // projet à débusquer un tiroir de menu qui se rouvrait tout seul.
  useEffect(() => {
    if (!dateValide) return;
    const id = setInterval(() => setTemps(restant(fin)), 1000);
    return () => clearInterval(id);
  }, [dateValide, fin]);

  if (!dateValide) {
    return (
      <p className="text-ink-secondary text-sm leading-relaxed">
        {c.sansDate}
      </p>
    );
  }

  if (!auClient || !temps) {
    // Réserve la hauteur du bloc pour que rien ne saute à l'hydratation.
    return <div aria-hidden className="h-[4.5rem]" />;
  }

  if (temps.fini) {
    return (
      <p className="text-ink-secondary text-sm leading-relaxed">{c.terminee}</p>
    );
  }

  const cases = [
    { valeur: temps.jours, label: c.jours },
    { valeur: temps.heures, label: c.heures },
    { valeur: temps.minutes, label: c.minutes },
    { valeur: temps.secondes, label: c.secondes },
  ];

  return (
    <div>
      <p className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
        {c.titre}
      </p>
      {/* `aria-hidden` : voir la précaution 3. La date de fin est donnée en
          clair juste en dessous, hors de ce bloc. */}
      <div aria-hidden className="mt-3 flex gap-3 sm:gap-4">
        {cases.map((cas) => (
          <div key={cas.label} className="text-center">
            <span className="font-display text-ink block text-3xl leading-none font-semibold tabular-nums sm:text-4xl">
              {String(cas.valeur).padStart(2, "0")}
            </span>
            <span className="text-ink-muted mt-1 block text-xs">
              {cas.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
