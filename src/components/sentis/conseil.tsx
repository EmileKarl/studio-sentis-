import Link from "next/link";

import { Section } from "@/components/sentis/parts";
import { Button } from "@/components/ui/button";
import type { Dict, Locale } from "@/lib/i18n";

/**
 * Le conseil : deux questions, une seule réponse.
 *
 * **Le problème qu'il règle.** La page Services présente quatre métiers, et
 * c'est un bon inventaire. Mais quelqu'un qui ne sait pas ce qu'il lui faut
 * doit arbitrer entre quatre familles avant d'avoir lu un seul prix — et la
 * page d'accueil, elle, porte douze sections. Trop de choix ne fait pas
 * choisir : il fait partir. Ce bloc prend le problème à l'envers. Il pose
 * deux questions fermées, à trois réponses chacune, et rend **une seule**
 * recommandation, avec son prix et son délai. Neuf cases existent ; le
 * visiteur n'en voit jamais qu'une.
 *
 * **Pourquoi il ne contient pas une ligne de JavaScript.** Tout tient en
 * deux boutons radio et une poignée de règles `:has()` dans `sentis.css`.
 * Trois conséquences, toutes voulues :
 *
 * 1. il fonctionne **avant** que la page soit hydratée — c'est le défaut que
 *    le client avait signalé sur le héros, et il n'est pas question de le
 *    réintroduire ici ;
 * 2. il ne coûte rien au budget de poids, qui est déjà serré ;
 * 3. il n'a pas d'état à perdre : le navigateur garde les réponses au retour
 *    arrière, gratuitement.
 *
 * `:has()` n'existe pas partout. Là où il manque, les neuf réponses restent
 * masquées et un lien vers la page Prix prend leur place — jamais un bloc
 * vide, jamais une question sans réponse.
 *
 * **Les neuf réponses sont dans le dictionnaire**, pas ici : ce sont des
 * décisions commerciales, elles se relisent et se traduisent comme le reste
 * du site.
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
      {/* `<form>` sans action : rien ne s'envoie, rien ne se soumet. La
          balise est là pour le groupement, et parce qu'elle donne au
          navigateur le droit de restaurer les réponses au retour arrière. */}
      <form className="conseil grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div className="flex flex-col gap-8">
          {[
            { nom: "conseil-q1", q: t.q1 },
            { nom: "conseil-q2", q: t.q2 },
          ].map(({ nom, q }) => (
            <fieldset key={nom} className="border-0 p-0">
              <legend className="text-ink mb-3 text-base font-medium">
                {q.libelle}
              </legend>
              <div className="flex flex-col gap-2">
                {q.options.map((option) => (
                  // L'entrée est **dans** l'étiquette : pas d'identifiant à
                  // inventer, donc le bloc peut apparaître deux fois sur le
                  // site sans collision.
                  <label
                    key={option.cle}
                    className="conseil-choix border-rule hover:border-rule-strong relative flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-base transition-colors"
                  >
                    {/* L'entrée couvre toute l'étiquette, à l'opacité zéro.
                        Elle reste une vraie case radio — focalisable, lue par
                        les lecteurs d'écran, restaurée au retour arrière —
                        mais sa cible tactile devient la rangée entière. Le
                        détecteur du projet mesure la boîte de l'entrée
                        elle-même : à 16 × 16 px, la case native échouait six
                        fois sur la page. Le rond visible est dessiné à côté,
                        en `aria-hidden`. */}
                    <input
                      type="radio"
                      name={nom}
                      value={option.cle}
                      className="absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none opacity-0"
                    />
                    <span aria-hidden className="conseil-puce" />
                    <span>{option.texte}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        {/* `aria-live` : la réponse apparaît sans rechargement ni navigation.
            Sans cela, un lecteur d'écran ne saurait pas qu'elle est arrivée. */}
        <div
          aria-live="polite"
          className="border-rule bg-paper flex min-h-56 flex-col justify-center rounded-lg border p-6 sm:p-8"
        >
          <p className="conseil-attente text-ink-muted text-base">
            {t.attente}
          </p>

          {/* Visible seulement là où `:has()` manque. */}
          <p className="conseil-repli text-ink-muted hidden text-base">
            {t.sansSupport}{" "}
            <Link
              href={`/${locale}/prix`}
              className="text-signal-aa underline underline-offset-2"
            >
              {t.ctaPrix}
            </Link>
          </p>

          {t.resultats.map((r) => (
            <div
              key={`${r.q1}-${r.q2}`}
              className="conseil-reponse"
              data-q1={r.q1}
              data-q2={r.q2}
            >
              <p className="text-ink-muted text-xs tracking-wider uppercase">
                {t.avant}
              </p>
              <p className="font-display text-ink mt-2 text-2xl leading-tight font-semibold tracking-tight">
                {r.nom}
              </p>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-ink text-xl font-semibold tabular-nums">
                  {r.prix}
                </span>
                <span className="text-ink-muted text-sm">{r.delai}</span>
              </p>
              <p className="text-ink-secondary mt-4 text-base leading-relaxed text-pretty">
                {r.pourquoi}
              </p>
              <p className="text-signal-aa mt-4 text-sm font-medium">
                {t.rabais}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-md">
                  <Link href={`/${locale}/contact`}>{t.cta}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-md"
                >
                  <Link href={`/${locale}/prix`}>{t.ctaPrix}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </form>
    </Section>
  );
}
