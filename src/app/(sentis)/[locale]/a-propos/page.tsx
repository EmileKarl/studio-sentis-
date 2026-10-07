import type { Metadata } from "next";
import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EnTetePage, Section, Zone } from "@/components/sentis/parts";
import { TemoinCahier } from "@/components/sentis/temoin-cahier";
import { Button } from "@/components/ui/button";
import { DICT, LOCALES, isLocale } from "@/lib/i18n";
import { donneesPage, metadonneesPage } from "@/lib/seo";
import { PLACES_LANCEMENT, PLACES_PRISES } from "@/lib/site";
import { DonneesStructurees } from "@/components/sentis/donnees-structurees";

/**
 * À propos, en carnet de bord.
 *
 * La version précédente empilait trois paragraphes numérotés, quatre cartes de
 * refus et trois cartes de principes : **429 mots, dix-huit blocs de texte
 * courant**, la page la plus « blog » du site après la refonte de Services et
 * de Réalisations. Elle répétait aussi l'accueil (les trois raisons de
 * repousser un projet) et Services (« Ce que je ne fais pas », même titre).
 *
 * La demande du client tenait en une phrase : faire comprendre que l'histoire
 * s'écrit, s'écrira et se racontera avec ses clients, à partir de maintenant.
 * Un carnet de bord le dit par sa forme, avant toute lecture :
 *
 * - **Déjà écrit** : quatre lignes, chacune vérifiable sur le site même.
 * - **Ne s'écrira jamais** : les quatre refus, barrés. Le trait dit le refus à
 *   l'œil ; le titre du groupe le dit en mots, parce qu'un lecteur d'écran
 *   n'annonce pas le barré.
 * - **S'écrira avec vous** : dix lignes vides, numérotées, une par place de
 *   l'offre de lancement. La page Réalisations montre les mêmes dix places en
 *   cadres de portfolio ; ici ce sont des lignes, parce qu'ici on écrit.
 *
 * Le fil vertical **s'écrit au défilement** : un trait plein qui avance sur un
 * pointillé, en CSS piloté par le défilement (`.sd-fil`), sans JavaScript.
 * C'est le seul mouvement du corps de page ; le reste est posé, lisible
 * d'emblée.
 */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return metadonneesPage({
    locale,
    chemin: "/a-propos",
  });
}

/** Le point d'une entrée sur le fil. */
function Point({ plein = false }: { plein?: boolean }) {
  return (
    <span
      aria-hidden
      className={
        plein
          ? "bg-accent-cyan ring-paper absolute top-[0.4rem] left-0 size-[15px] rounded-full ring-4"
          : "border-ink bg-paper ring-paper absolute top-[0.4rem] left-0 size-[15px] rounded-full border-2 ring-4"
      }
    />
  );
}

function TitreGroupe({ children }: { children: string }) {
  return (
    <h3 className="font-display text-ink relative pl-10 text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
      {/* Un losange sur le fil : un changement de temps, pas une entrée. */}
      <span
        aria-hidden
        className="bg-ink ring-paper absolute top-1/2 left-[3px] size-[9px] -translate-y-1/2 rotate-45 ring-4"
      />
      {children}
    </h3>
  );
}

export default async function AProposPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = DICT[locale];
  const p = d.pages.apropos;
  const c = p.carnet;

  return (
    <>
      <DonneesStructurees data={donneesPage(locale, "/a-propos", p.titre, "AboutPage")} />

      <EnTetePage
        titre={p.titre}
        chapo={p.chapo}
        temoin={<TemoinCahier locale={locale} cahier={p.cahier} />}
      />

      <Section>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="min-w-0 lg:col-span-8">
            <h2 className="sr-only">{c.titre}</h2>

            <div className="relative">
              {/* Le fil : un pointillé pour ce qui n'est pas encore lu, un
                  trait plein qui s'écrit par-dessus au défilement. */}
              <div
                aria-hidden
                className="border-rule-strong absolute top-3 bottom-4 left-[7px] border-l border-dashed"
              />
              <div
                aria-hidden
                className="bg-ink sd-fil absolute top-3 bottom-4 left-[7px] w-px"
              />

              {/* --- Déjà écrit --------------------------------------- */}
              <TitreGroupe>{c.ecrit.titre}</TitreGroupe>
              <ol className="mt-8 space-y-9">
                {c.ecrit.entrees.map((entree, i) => (
                  <li key={entree.titre} className="relative pl-10">
                    <Point plein={i === 0} />
                    <p className="font-display text-ink text-lg leading-snug font-semibold text-balance sm:text-xl">
                      {entree.titre}
                    </p>
                    <p className="text-ink-secondary mt-1.5 max-w-[56ch] leading-relaxed text-pretty">
                      {entree.corps}
                      {"lien" in entree ? (
                        <>
                          {" "}
                          <Link
                            href={`/${locale}#prix`}
                            className="text-ink focus-visible:ring-signal rounded-sm font-medium underline decoration-1 underline-offset-4 transition-colors hover:decoration-2 focus-visible:ring-2 focus-visible:outline-none"
                          >
                            {entree.lien}
                          </Link>
                        </>
                      ) : null}
                    </p>
                  </li>
                ))}
              </ol>

              {/* --- Ne s'écrira jamais -------------------------------- */}
              <div className="mt-16 sm:mt-20">
                <TitreGroupe>{c.jamais.titre}</TitreGroupe>
                <ul className="mt-8 space-y-8">
                  {c.jamais.entrees.map((entree) => (
                    <li key={entree.titre} className="relative pl-10">
                      {/* Une croix plutôt qu'un point : ces lignes ne seront
                          pas écrites. */}
                      <X
                        aria-hidden
                        strokeWidth={2.5}
                        className="text-accent-violet bg-paper absolute top-[0.3rem] -left-px size-4"
                      />
                      <p className="font-display text-ink-secondary decoration-accent-violet text-lg leading-snug font-semibold text-balance line-through decoration-2 sm:text-xl">
                        {entree.titre}
                      </p>
                      <p className="text-ink-secondary mt-1.5 max-w-[56ch] leading-relaxed text-pretty">
                        {entree.corps}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* --- S'écrira avec vous -------------------------------- */}
              <div className="mt-16 sm:mt-20">
                <TitreGroupe>{c.avenir.titre}</TitreGroupe>
                {/* Dix lignes, une par place. `aria-hidden` sur la liste : dix
                    lignes vides annoncées une à une ne diraient rien de plus
                    que la phrase qui suit, qui donne le nombre en mots. */}
                <ol aria-hidden className="mt-6">
                  {Array.from({ length: PLACES_LANCEMENT }, (_, i) => (
                    <li key={i} className="relative flex h-10 items-end pl-10">
                      <span className="border-ink-muted bg-paper ring-paper absolute bottom-2.5 left-[3px] size-[9px] rounded-full border ring-4" />
                      <span className="border-rule-strong flex flex-1 items-end gap-4 border-b border-dashed pb-1.5">
                        <span className="text-ink-muted w-12 shrink-0 text-sm tabular-nums">
                          {c.avenir.numero}&nbsp;{String(i + 1).padStart(2, "0")}
                        </span>
                        {i === PLACES_PRISES ? (
                          <span className="text-ink-secondary text-sm">{c.avenir.invite}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="text-ink-secondary mt-6 pl-10 leading-relaxed text-pretty">
                  {c.avenir.note}{" "}
                  <Link
                    href={`/${locale}/realisations`}
                    className="text-ink focus-visible:ring-signal inline-flex items-center gap-1 rounded-sm font-medium underline decoration-1 underline-offset-4 transition-colors hover:decoration-2 focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {c.avenir.lien}
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Les règles du carnet : collées à droite pendant qu'on lit le
              fil, comme la page de garde d'un carnet. Sur téléphone, elles
              viennent après. */}
          <aside className="lg:col-span-4">
            <div className="bg-surface border-rule rounded-2xl border p-6 sm:p-8 lg:sticky lg:top-28">
              <h2 className="font-display text-ink text-2xl leading-tight font-semibold tracking-tight">
                {p.regles.titre}
              </h2>
              <ul className="mt-6 space-y-6">
                {p.regles.items.map((regle) => (
                  <li key={regle.titre}>
                    <p className="font-display text-ink text-lg font-semibold">
                      {regle.titre}
                    </p>
                    <p className="text-ink-secondary mt-1 leading-relaxed text-pretty">
                      {regle.corps}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      {/* La page se ferme sur l'encre, comme Services : après le papier, un
          fond soutenu fait lire le bouton comme la sortie. */}
      <section className="bg-ink py-20 sm:py-24">
        <Zone>
          <h2 className="font-display text-paper max-w-[20ch] text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {p.fin.titre}
          </h2>
          <p className="text-paper/70 mt-4 max-w-(--content-max) text-lg leading-relaxed text-pretty">
            {p.fin.corps}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-paper text-ink hover:bg-paper/90 rounded-md text-base active:translate-y-px"
            >
              <Link href={`/${locale}/contact`}>
                {d.nav.soumission} <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-paper/35 text-paper hover:bg-paper/10 hover:text-paper rounded-md bg-transparent text-base active:translate-y-px"
            >
              <Link href={`/${locale}/realisations`}>{p.fin.lienPlaces}</Link>
            </Button>
          </div>
        </Zone>
      </section>
    </>
  );
}
