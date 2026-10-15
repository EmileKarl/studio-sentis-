import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/sentis/parts";
import { Button } from "@/components/ui/button";
import type { Dict, Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Le choix : une question, deux portes.
 *
 * **D'où vient cette forme.** Le client a envoyé une vidéo — « Trop de choix
 * tue le choix », @blyinder — puis le fichier lui-même, ce qui a permis de la
 * lire image par image. Sa démonstration est en trois temps : on vous montre
 * vingt-quatre paires de chaussures et trois secondes pour choisir — « Trop
 * tard » ; on vous en montre trois, vous choisissez tout de suite ; puis elle
 * nomme l'étude des confitures de 2000. Sa conclusion pratique tient en un
 * écran : **deux offres, un interlocuteur, une seconde pour décider.**
 *
 * **Ce que ce bloc a d'abord été.** Deux questions à trois réponses, donc
 * neuf recommandations. C'était déjà mieux que quatre métiers à comparer,
 * mais c'était encore deux décisions à prendre. La vidéo en demande une.
 * Celle-ci est la bonne version : **une question, deux portes.**
 *
 * **Ce que je n'ai pas repris.** La vidéo avance « 3 % contre 30 % » pour
 * l'étude des confitures. Le chiffre est célèbre, mais sa réplication est
 * contestée — plusieurs méta-analyses trouvent un effet proche de zéro. Une
 * statistique fragile sur le site d'une entreprise qui vend de la rigueur,
 * c'est un risque pour rien. On garde la forme, pas le chiffre.
 *
 * **Toujours zéro JavaScript.** Deux boutons radio et deux règles `:has()`.
 * Le bloc fonctionne avant que la page soit hydratée, ne coûte rien au
 * budget de poids, et le navigateur restaure le choix au retour arrière.
 * Là où `:has()` manque, un lien vers la page Prix prend la place.
 */
export function Conseil({
  dict,
  locale,
  tone = "blanc",
}: {
  dict: Dict;
  locale: Locale;
  /** Le fond de la section, pour alterner avec celle qui précède. */
  tone?: "paper" | "blanc";
}) {
  const t = dict.pages.conseil;

  return (
    <Section id="conseil" titre={t.titre} chapo={t.chapo} tone={tone}>
      {/* L'étiquette de section, reprise de la grammaire de la vidéo : un
          mot en petites capitales, posé sur un filet. Elle dit où l'on est
          sans ajouter un titre de plus. */}
      <p className="border-rule text-ink-muted mb-8 border-t pt-3 font-mono text-xs tracking-widest uppercase">
        {t.etiquette}
      </p>

      {/* `<form>` sans action : rien ne s'envoie. La balise sert au
          groupement, et donne au navigateur le droit de restaurer le choix
          au retour arrière. */}
      <form className="conseil">
        <fieldset className="border-0 p-0">
          {/* La question est déjà le titre de la section : la légende la
              répète pour les lecteurs d'écran, qui n'ont pas le contexte
              visuel, et reste invisible à l'œil. */}
          <legend className="sr-only">{t.titre}</legend>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {t.offres.map((offre, i) => (
              <label
                key={offre.cle}
                className={cn(
                  "conseil-porte relative flex min-h-56 cursor-pointer flex-col justify-between rounded-lg p-6 transition-transform sm:p-7",
                  // Bleu et encre, pas bleu et jaune comme la vidéo : ce
                  // sont les deux aplats que la marque utilise déjà, sur le
                  // bouton et sur les flyers. Une troisième couleur
                  // n'apporterait rien qu'une couleur de plus.
                  i === 0
                    ? "bg-signal text-signal-contrast"
                    : "bg-ink text-paper",
                )}
              >
                {/* `z-10` : l'entrée est **au-dessus** du contenu de la
                    carte, pas en dessous. Sans cela elle reste cliquable —
                    l'étiquette enveloppe tout — mais c'est le texte qui
                    reçoit le pointeur, et une carte de choix qui se
                    sélectionne par la sémantique plutôt que par la surface
                    est fragile : elle casse dès qu'on y met un lien. */}
                <input
                  type="radio"
                  name="conseil-porte"
                  value={offre.cle}
                  className="absolute inset-0 z-10 m-0 h-full w-full cursor-pointer appearance-none opacity-0"
                />

                <span className="flex items-start justify-between gap-4">
                  {/* Pas d'`opacity` sur ces libellés. Le contrôle du projet
                      refuse tout texte sous 0,9 d'opacité une fois à l'écran, et
                      il a raison : un texte à 70 % est un texte qu'on lit moins
                      bien, pas un texte « secondaire ». La hiérarchie se fait
                      ici par la taille et la casse. */}
                  <span className="font-mono text-xs tracking-widest">
                    {offre.num}
                  </span>
                  <span
                    aria-hidden
                    className="conseil-coche grid size-6 shrink-0 place-items-center rounded-full border"
                  >
                    <Check className="size-3.5" />
                  </span>
                </span>

                <span className="mt-8 block">
                  <span className="block text-base leading-snug">
                    {offre.question}
                  </span>
                  <span className="mt-3 flex items-center gap-3">
                    <span className="font-display text-3xl leading-none font-semibold tracking-tight sm:text-4xl">
                      {offre.mot}
                    </span>
                    <ArrowRight className="size-5 shrink-0" aria-hidden />
                  </span>
                  <span className="mt-3 block font-mono text-xs tracking-widest uppercase">
                    {offre.sous}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* `aria-live` : la réponse arrive sans navigation. Sans cela, un
            lecteur d'écran ne saurait pas qu'elle est là. */}
        <div aria-live="polite" className="mt-6">
          <p className="conseil-attente text-ink-muted text-base">
            {t.attente}
          </p>

          {/* Visible seulement là où `:has()` manque. */}
          <p className="conseil-repli text-ink-muted hidden text-base">
            {t.sansSupport}{" "}
            {/* `#prix` sur l'accueil, et non `/prix` : la grille de prix est
                une section de l'accueil, il n'y a pas de page dediee. Le lien
                precedent pointait sur `/${locale}/prix`, qui repond 404 —
                invisible en production parce que ce repli ne s'affiche que la
                ou `:has()` manque, donc sur les navigateurs que personne ici
                n'ouvre. Un lien mort reste un lien mort. */}
            <Link
              href={`/${locale}#prix`}
              className="text-signal-aa underline underline-offset-2"
            >
              {t.ctaPrix}
            </Link>
          </p>

          {t.offres.map((offre) => (
            <div
              key={offre.cle}
              className="conseil-reponse border-rule bg-paper rounded-lg border p-6 sm:p-8"
              data-porte={offre.cle}
            >
              <p className="text-ink-muted font-mono text-xs tracking-widest uppercase">
                {t.avant}
              </p>
              <p className="font-display text-ink mt-2 text-2xl leading-tight font-semibold tracking-tight">
                {offre.nom}
              </p>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-ink text-xl font-semibold tabular-nums">
                  {offre.prix}
                </span>
                <span className="text-ink-muted text-sm">{offre.delai}</span>
                <span className="text-signal-aa text-sm font-medium">
                  {t.rabais}
                </span>
              </p>
              <p className="text-ink-secondary mt-4 max-w-(--content-max) text-base leading-relaxed text-pretty">
                {offre.pourquoi}
              </p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {offre.inclus.map((ligne) => (
                  <li
                    key={ligne}
                    className="text-ink-secondary flex items-start gap-2 text-sm"
                  >
                    <Check
                      className="text-signal mt-0.5 size-4 shrink-0"
                      aria-hidden
                    />
                    <span>{ligne}</span>
                  </li>
                ))}
              </ul>
              {/* Un seul bouton ici aussi. Le prix vient d'être affiché,
                  juste au-dessus : un « voir tous les prix » posé à côté
                  rouvrirait le choix que ce bloc existe pour fermer. Le lien
                  vers la page Prix reste dans le repli, là où il sert
                  vraiment — quand la recommandation ne peut pas s'afficher. */}
              <div className="mt-6">
                <Button asChild size="lg" className="rounded-md">
                  <Link href={`/${locale}/contact`}>{t.cta}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </form>
    </Section>
  );
}
