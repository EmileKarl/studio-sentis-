"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Ce qui s'affiche quand une page du site casse.
 *
 * Sans ce fichier, une erreur de rendu donne en production un écran
 * pratiquement blanc portant « Application error: a client-side exception has
 * occurred ». Le visiteur ne sait pas s'il a mal cliqué, si le site est mort,
 * ni quoi faire — et il part.
 *
 * Ce site n'émet **aucune requête réseau** : le formulaire compose un
 * `mailto:`, rien n'est chargé depuis une API. Le seul échec réellement
 * possible est donc un **import dynamique qui n'arrive pas** — la scène WebGL
 * et le globe sont chargés à la demande (`differe.tsx`), et sur un réseau qui
 * coupe, ce chargement échoue. C'est exactement le cas que cette limite
 * rattrape, et `reset()` suffit à le réparer puisqu'il suffit de redemander le
 * morceau manquant.
 *
 * **Comment la revérifier.** Elle a été prouvée au navigateur avant d'être
 * livrée : page jetable sous `[locale]`, composant client qui lève dans un
 * effet, et vérification que le titre sort dans les deux langues, que l'en-tête
 * du site reste en place et que `reset()` relance le rendu. Pour refaire
 * l'essai, recréer cette page — **sans préfixer son dossier d'un `_`**, Next
 * traite les dossiers commençant par un tiret bas comme privés et ne les route
 * pas, ce qui donne un 404 qu'on prend pour une limite d'erreur qui ne marche
 * pas.
 *
 * Le texte reste dans ce fichier plutôt que dans le dictionnaire : trois
 * chaînes par langue ne justifient pas d'embarquer tout `i18n.ts` dans le
 * morceau d'erreur, et surtout une limite d'erreur ne doit dépendre de rien
 * qui puisse être la cause de l'erreur.
 */
const TEXTES = {
  fr: {
    etiquette: "Erreur",
    titre: "Cette page n'a pas pu s'afficher",
    corps:
      "Ce n'est pas vous. Réessayez — et si ça recommence, écrivez-moi, je veux le savoir.",
    reessayer: "Réessayer",
    accueil: "Retour à l'accueil",
    reference: "Référence",
  },
  en: {
    etiquette: "Error",
    titre: "This page could not be displayed",
    corps:
      "It isn't you. Try again — and if it happens twice, write to me, I want to know.",
    reessayer: "Try again",
    accueil: "Back to home",
    reference: "Reference",
  },
} as const;

export default function Erreur({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "fr";
  const t = TEXTES[locale];

  // Une erreur silencieuse est une erreur qu'on ne corrigera jamais. Sur
  // Vercel, ce `console.error` part dans les journaux d'exécution du
  // déploiement ; c'est le minimum tant qu'aucun service de suivi d'erreurs
  // n'est branché, et c'est le point d'accrochage le jour où il le sera.
  useEffect(() => {
    console.error("[sentis] rendu interrompu", error);
  }, [error]);

  return (
    <div className="bg-paper text-ink grid min-h-[60dvh] place-items-center px-5 py-20">
      <div className="max-w-(--content-max)">
        <p className="text-ink-muted font-mono text-sm tracking-[0.18em] uppercase">
          {t.etiquette}
        </p>
        <h1 className="font-display text-ink mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {t.titre}
        </h1>
        <p className="text-ink-secondary mt-3 text-lg leading-relaxed text-pretty">
          {t.corps}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {/* Un `<button>` natif plutôt que le composant partagé : la limite
              d'erreur ne doit pas dépendre d'un module qui peut lui-même être
              ce qui a cassé. Les classes, elles, viennent des jetons — ils sont
              dans la feuille de style, pas dans un module JavaScript. */}
          <button
            type="button"
            onClick={reset}
            className="bg-ink text-paper focus-visible:ring-signal rounded-md px-5 py-3 text-base font-medium transition-transform duration-(--duration-fast) ease-(--ease-out) focus-visible:ring-2 focus-visible:outline-none active:scale-[0.97]"
          >
            {t.reessayer}
          </button>
          <a
            href={`/${locale}`}
            className="border-rule-strong text-ink focus-visible:ring-signal rounded-md border px-5 py-3 text-base font-medium focus-visible:ring-2 focus-visible:outline-none"
          >
            {t.accueil}
          </a>
        </div>

        {/* L'empreinte que Next attache à l'erreur : inutile au visiteur, mais
            c'est la seule chose qui permet de retrouver l'incident dans les
            journaux quand il la recopie dans un courriel. */}
        {error.digest ? (
          <p className="text-ink-muted mt-8 font-mono text-xs">
            {t.reference} : {error.digest}
          </p>
        ) : null}
      </div>
    </div>
  );
}
