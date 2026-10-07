import { Check, X } from "lucide-react";

import type { Dict } from "@/lib/i18n";

/**
 * « Ce que ces montants couvrent », sous le configurateur de prix.
 *
 * La version précédente était un article : un paragraphe de soixante mots,
 * une liste à puces, une phrase encadrée d'un filet coloré à gauche — le
 * motif d'encadré que le plancher de qualité refuse — et une note. Tout y
 * était vrai, et presque rien ne se voyait.
 *
 * Deux objets à la place, chacun dans la grammaire de ce qu'il dit :
 *
 * - **Un reçu.** Ce que couvre un forfait se lit ligne à ligne, comme ce
 *   qu'on paie, et finit sur un total qui est l'argument : zéro dollar
 *   découvert en cours de route. Ce n'est pas une promesse de plus : la note
 *   du site dit déjà que ce qui sort du cadre est chiffré avant d'être
 *   commencé, jamais après.
 * - **Un comparatif.** La phrase « un abonnement à 60 $ coûte 2 160 $ sur
 *   trois ans, et vous ne possédez rien » devient un tableau à trois lignes :
 *   ce qu'on a payé, ce qu'on possède, ce qui arrive si l'on arrête. Le
 *   chiffre reste vérifiable à la calculette, et le tableau dit aussi ce que
 *   la phrase taisait : l'hébergement d'un site livré se paie à part.
 *
 * Aucun JavaScript : le budget de poids est déjà serré, et rien ici ne bouge.
 */
export function CouverturePrix({ dict }: { dict: Dict }) {
  const c = dict.prix.composition;

  return (
    <div className="border-rule mt-16 border-t pt-12">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h3 className="font-display text-ink text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl">
            {c.titre}
          </h3>
          <p className="text-ink-secondary mt-4 max-w-(--content-max) text-lg leading-relaxed text-pretty">
            {c.chapo}
          </p>
          <p className="text-ink-muted mt-6 max-w-(--content-max) text-sm leading-relaxed text-pretty">
            {dict.prix.note}
          </p>
        </div>

        {/* Le reçu. Papier sur la section blanche, comme un ticket posé sur
            le comptoir. */}
        <figure className="bg-paper border-rule rounded-xl border p-6 sm:p-8 lg:col-span-7">
          <figcaption className="font-display text-ink text-lg font-semibold">
            {c.recuTitre}
          </figcaption>
          <ul className="mt-4">
            {c.items.map((item) => (
              <li
                key={item.titre}
                className="border-rule flex items-start gap-3 border-b border-dashed py-3.5"
              >
                <Check aria-hidden strokeWidth={2.5} className="text-accent-vert mt-0.5 size-5 shrink-0" />
                <span className="min-w-0">
                  <span className="text-ink block font-medium">{item.titre}</span>
                  <span className="text-ink-secondary block text-sm">{item.detail}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-baseline justify-between gap-6">
            <span className="text-ink font-medium text-pretty">{c.fraisLibelle}</span>
            <span className="font-display text-accent-vert text-4xl leading-none font-semibold tabular-nums">
              {c.fraisMontant}
            </span>
          </p>
        </figure>
      </div>

      {/* Le comparatif : un vrai tableau, parce que c'en est un — deux offres,
          trois questions. Un lecteur d'écran annonce la ligne et la colonne
          de chaque case ; une grille de `div` ne le ferait pas. */}
      <div className="mt-12 sm:mt-16">
        {/* Sur téléphone, trois colonnes dans 350 px coupaient la réponse du
            studio à deux mots par ligne. La même information en lignes :
            la question, puis les deux réponses côte à côte. Le tableau
            reprend la main dès 640 px ; un seul des deux est affiché, donc
            un seul est lu. */}
        <div className="sm:hidden">
          <h3 className="font-display text-ink text-2xl leading-tight font-semibold tracking-tight">
            {c.comparaisonTitre}
          </h3>
          <div aria-hidden className="mt-5 grid grid-cols-2 gap-3 text-xs font-medium">
            <p className="text-ink-secondary">{c.colonnes[0]}</p>
            <p className="text-ink">{c.colonnes[1]}</p>
          </div>
          <dl className="mt-3">
            {c.lignes.map((ligne) => (
              <div key={ligne.cle} className="border-rule border-t py-4">
                <dt className="text-ink-secondary text-sm font-medium">{ligne.cle}</dt>
                <dd className="mt-2 grid grid-cols-2 gap-3">
                  <span className="text-ink-muted text-pretty">
                    <span className="sr-only">{c.colonnes[0]} : </span>
                    {ligne.abonnement}
                  </span>
                  <span className="bg-paper text-ink rounded-md px-2.5 py-1.5 font-medium text-pretty">
                    <span className="sr-only">{c.colonnes[1]} : </span>
                    {ligne.studio}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <table className="hidden w-full table-fixed border-separate border-spacing-0 text-left sm:table">
          <caption className="font-display text-ink mb-5 text-left text-2xl leading-tight font-semibold tracking-tight">
            {c.comparaisonTitre}
          </caption>
          <colgroup>
            <col className="w-[30%] sm:w-[28%]" />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <td className="border-rule border-b" />
              <th scope="col" className="border-rule text-ink-secondary border-b px-3 pb-3 align-bottom text-sm font-medium sm:px-5">
                {c.colonnes[0]}
              </th>
              <th
                scope="col"
                className="bg-paper border-rule text-ink rounded-t-xl border-b px-3 pt-4 pb-3 align-bottom text-sm font-semibold sm:px-5"
              >
                {c.colonnes[1]}
              </th>
            </tr>
          </thead>
          <tbody>
            {c.lignes.map((ligne, i) => (
              <tr key={ligne.cle}>
                <th scope="row" className="border-rule text-ink-secondary border-b py-4 pr-3 align-top text-sm font-medium sm:text-base">
                  {ligne.cle}
                </th>
                <td className="border-rule text-ink-muted border-b px-3 py-4 align-top sm:px-5">
                  <span className="flex items-start gap-2">
                    {/* Pas d'icône sur la ligne du montant : payer n'est pas
                        un défaut en soi. Les croix et les coches disent ce
                        qu'on possède, pas ce qu'on a dépensé. */}
                    {i > 0 ? <X aria-hidden className="mt-1 size-4 shrink-0" /> : null}
                    <span className="text-pretty">{ligne.abonnement}</span>
                  </span>
                </td>
                <td
                  className={
                    "bg-paper text-ink px-3 py-4 align-top font-medium sm:px-5" +
                    (i === c.lignes.length - 1 ? " rounded-b-xl" : " border-rule border-b")
                  }
                >
                  <span className="flex items-start gap-2">
                    {i > 0 ? (
                      <Check aria-hidden strokeWidth={2.5} className="text-accent-vert mt-1 size-4 shrink-0" />
                    ) : null}
                    <span className="text-pretty">{ligne.studio}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-ink-muted mt-4 max-w-(--content-max) text-sm leading-relaxed text-pretty">
          {c.hebergement}
        </p>
      </div>
    </div>
  );
}
