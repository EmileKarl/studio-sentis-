import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DonneesStructurees } from "@/components/sentis/donnees-structurees";
import { Entree } from "@/components/motion/entree";
import { EnTetePage, Section, Zone } from "@/components/sentis/parts";
import { Button } from "@/components/ui/button";
import { DICT, LOCALES, isLocale, type Locale } from "@/lib/i18n";
import { donneesService, metadonneesService } from "@/lib/seo-service";
import {
  CLES_SERVICE,
  SERVICES_DETAIL,
  type ServiceDetail,
} from "@/lib/services-detail";

/**
 * Une page par métier : logo, charte, site web, application.
 *
 * **Pourquoi elles existent, en une phrase :** Google classe des pages, pas
 * des sites. La page `/services` parle des quatre métiers à la fois, donc
 * elle n'est la meilleure réponse à aucune des quatre recherches. Le
 * raisonnement complet est dans `docs/seo/plan-seo.md`.
 *
 * **Les adresses diffèrent d'une langue à l'autre**, contrairement au reste du
 * site. `generateStaticParams` produit les huit combinaisons, et chacune ne
 * connaît que son propre segment — une page française ouverte avec le segment
 * anglais rend `notFound()` plutôt qu'un doublon, qui ferait deux adresses
 * pour un même contenu.
 *
 * **Rien de ce qui est affiché ici n'est inventé** : les prix et les délais
 * sont ceux de la grille de `i18n.ts`, et chaque page redit que seule la
 * soumission écrite engage. Les questions balisées en `FAQPage` sont celles
 * qui sont **affichées** — baliser une question invisible est précisément ce
 * que les règles de Google interdisent.
 */

type Params = { locale: string; service: string };

/** Retrouve le métier à partir du segment, dans la langue de la page. */
function trouver(locale: Locale, segment: string): ServiceDetail | null {
  const table = SERVICES_DETAIL[locale];
  for (const cle of CLES_SERVICE) {
    if (table[cle].slug[locale] === segment) return table[cle];
  }
  return null;
}

export function generateStaticParams(): Params[] {
  return LOCALES.flatMap((locale) =>
    CLES_SERVICE.map((cle) => ({
      locale,
      service: SERVICES_DETAIL[locale][cle].slug[locale],
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, service } = await params;
  if (!isLocale(locale)) return {};
  const detail = trouver(locale, service);
  return detail ? metadonneesService(locale, detail) : {};
}

export default async function PageService({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, service } = await params;
  if (!isLocale(locale)) notFound();
  const detail = trouver(locale, service);
  if (!detail) notFound();

  const d = DICT[locale];
  const table = SERVICES_DETAIL[locale];
  const voisins = CLES_SERVICE.filter((c) => c !== detail.cle).map((c) => table[c]);
  const enFrancais = locale === "fr";

  return (
    <>
      <DonneesStructurees data={donneesService(locale, detail)} />

      {/* Le fil d'Ariane visible. Il double le balisage, et c'est voulu : un
          visiteur arrivé ici par une recherche n'a pas vu la page Services et
          ne sait pas où il est. */}
      <Zone className="pt-6">
        <nav aria-label={enFrancais ? "Fil d'Ariane" : "Breadcrumb"}>
          <ol className="text-ink-muted flex flex-wrap items-center gap-x-2 font-mono text-xs tracking-[0.1em] uppercase">
            <li>
              <Link href={`/${locale}`} className="hover:text-ink underline-offset-4 hover:underline">
                {d.nav.accueil}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/${locale}/services`} className="hover:text-ink underline-offset-4 hover:underline">
                {d.nav.services}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ink-secondary">{detail.h1}</li>
          </ol>
        </nav>
      </Zone>

      <EnTetePage titre={detail.h1} chapo={detail.chapo} />

      {/* Le prix et le délai, tout de suite. C'est la promesse du studio, et
          c'est ce que la personne est venue chercher : inutile de le faire
          mériter par trois paragraphes. */}
      <Section tone="blanc">
        <Entree distance={12}>
          <dl className="border-rule grid gap-px overflow-hidden rounded-xl border bg-[var(--rule)] sm:grid-cols-3">
            {[
              [enFrancais ? "Prix" : "Price", detail.prix],
              [enFrancais ? "Délai" : "Lead time", detail.delai],
              [enFrancais ? "Forfait" : "Package", detail.forfait],
            ].map(([cle, valeur]) => (
              <div key={cle} className="bg-surface px-6 py-5">
                <dt className="text-ink-muted font-mono text-xs tracking-[0.2em] uppercase">
                  {cle}
                </dt>
                <dd className="font-display text-ink mt-2 text-2xl font-semibold tracking-tight">
                  {valeur}
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-ink-muted mt-4 text-sm leading-relaxed">
            {d.prix.note}
          </p>
        </Entree>
      </Section>

      <Section titre={detail.inclusTitre} tone="paper">
        <Entree distance={12}>
          <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {detail.inclus.map((item) => (
              <li key={item} className="text-ink-secondary flex gap-3 leading-relaxed">
                <span aria-hidden className="bg-signal mt-2.5 size-1.5 shrink-0 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </Entree>
      </Section>

      <Section titre={detail.etapesTitre} tone="blanc">
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {detail.etapes.map((etape, i) => (
            <Entree key={etape.titre} distance={14} delai={i * 70}>
              <li>
                <span className="text-ink-muted font-mono text-xs tracking-[0.2em] uppercase">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-ink mt-2 text-lg font-semibold tracking-tight">
                  {etape.titre}
                </h3>
                <p className="text-ink-secondary mt-2 leading-relaxed text-pretty">
                  {etape.corps}
                </p>
              </li>
            </Entree>
          ))}
        </ol>
      </Section>

      <Section tone="paper">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-x-16">
          {detail.corps.map((bloc, i) => (
            <Entree key={bloc.titre} distance={14} delai={i * 60}>
              <article>
                <h2 className="font-display text-ink text-2xl leading-tight font-semibold tracking-tight text-balance">
                  {bloc.titre}
                </h2>
                <p className="text-ink-secondary mt-3 max-w-(--content-max) leading-relaxed text-pretty">
                  {bloc.texte}
                </p>
              </article>
            </Entree>
          ))}
        </div>
      </Section>

      {/* La limite, dite avant qu'on la découvre. C'est la même règle que la
          page Réalisations, qui annonce qu'elle est vide. */}
      <Section titre={detail.limiteTitre} tone="blanc">
        <Entree distance={12}>
          <p className="text-ink-secondary max-w-(--content-max) text-lg leading-relaxed text-pretty">
            {detail.limite}
          </p>
        </Entree>
      </Section>

      <Section titre={detail.faqTitre} tone="paper">
        <div className="max-w-(--content-max)">
          {detail.faq.map((item, i) => (
            <Entree key={item.q} distance={10} delai={i * 40}>
              {/* `<details>` natif : pas de JavaScript, et les réponses sont
                  dans le HTML livré — donc lisibles par un moteur même
                  repliées, ce qui est la condition pour les baliser. */}
              <details className="border-rule group border-b py-5">
                <summary className="text-ink marker:text-ink-muted cursor-pointer list-outside text-lg leading-snug font-medium text-pretty">
                  {item.q}
                </summary>
                <p className="text-ink-secondary mt-3 leading-relaxed text-pretty">
                  {item.r}
                </p>
              </details>
            </Entree>
          ))}
        </div>
      </Section>

      {/* Les liens vers les trois autres métiers. Le texte du lien est le nom
          de la recherche — « charte graphique », pas « en savoir plus » :
          c'est ce mot-là qui dit au moteur de quoi parle la page d'arrivée. */}
      <Section titre={detail.voisinsTitre} tone="blanc">
        <ul className="grid gap-4 sm:grid-cols-3">
          {voisins.map((voisin, i) => (
            <Entree key={voisin.cle} distance={12} delai={i * 60}>
              <li>
                <Link
                  href={`/${locale}/services/${voisin.slug[locale]}`}
                  className="border-rule hover:border-rule-strong focus-visible:ring-signal bg-surface group block h-full rounded-xl border p-6 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span className="font-display text-ink text-xl font-semibold tracking-tight">
                    {voisin.h1}
                  </span>
                  <span className="text-ink-secondary mt-2 block leading-relaxed text-pretty">
                    {voisin.chapo}
                  </span>
                  <span className="text-signal-aa mt-4 flex items-center gap-1.5 font-medium">
                    {voisin.prix}
                    <ArrowRight aria-hidden className="size-4" />
                  </span>
                </Link>
              </li>
            </Entree>
          ))}
        </ul>
      </Section>

      {/* Le dernier appel. Deux fonds existent sur ce site, et pas davantage :
          le contraste de fin vient de l'encadré, pas d'une troisième teinte
          inventée pour l'occasion. */}
      <Section tone="paper">
        <Entree distance={14}>
          <div className="bg-ink text-paper flex flex-col items-start gap-6 rounded-2xl px-8 py-10 sm:px-12 sm:py-14">
            <h2 className="font-display max-w-[20ch] text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl">
              {detail.ctaTitre}
            </h2>
            <Button asChild size="lg" className="rounded-md text-base">
              <Link href={`/${locale}/contact`}>
                {detail.cta} <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </Entree>
      </Section>
    </>
  );
}
