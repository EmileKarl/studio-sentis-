import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Carte3D, Couche3D } from "@/components/motion/carte-3d";
import { Entree } from "@/components/motion/entree";
import { EnTetePage, Section, Zone } from "@/components/sentis/parts";
import { PictoService } from "@/components/sentis/pictos";
import { TemoinLivraison } from "@/components/sentis/temoin-livraison";
import { Button } from "@/components/ui/button";
import { DICT, LOCALES, isLocale } from "@/lib/i18n";
import { donneesPage, donneesServices, metadonneesPage } from "@/lib/seo";
import { DonneesStructurees } from "@/components/sentis/donnees-structurees";

/**
 * Quatre métiers, quatre tuiles, et plus un article.
 *
 * La version précédente dépliait chaque métier en une section pleine largeur :
 * un titre, un résumé, un paragraphe de détail, cinq puces de livrables et une
 * limite. Quatre fois. Mesuré : **460 mots sur 4 152 px de hauteur**, dont
 * vingt blocs de texte courant. Le client l'a nommé en un mot — « comme un
 * blog » — et il avait raison : une page de services qui se lit en défilant
 * paragraphe après paragraphe n'est pas une page de services, c'est un article
 * sur les services.
 *
 * Trois changements, dans l'ordre de ce qu'ils rapportent :
 *
 * 1. **Le texte long passe sous un dépliant.** Le détail de chaque métier
 *    n'est pas supprimé — il intéresse celui qui hésite — mais il ne remplit
 *    plus la page pour les neuf autres. Un `<details>` natif : pas d'état
 *    React, pas de JavaScript, et il s'ouvre même si le script ne charge pas.
 * 2. **Les livrables deviennent des pastilles.** Cinq puces empilées font cinq
 *    lignes ; les mêmes cinq libellés en pastilles font un nuage qu'on
 *    embrasse d'un regard. Même information, un quart de la hauteur.
 * 3. **La grille est asymétrique.** Quatre tuiles de taille égale sur une
 *    rangée, c'est un tableau ; 4-2 puis 2-4, c'est une composition. Rien
 *    n'oblige des services différents à occuper la même surface.
 *
 * Et la troisième dimension est **réelle**, pas suggérée : chaque tuile est un
 * objet en perspective dont le pictogramme flotte en avant du fond, sur l'axe
 * de profondeur. C'est le décalage entre ces deux plans en tournant — la
 * parallaxe — qui donne l'épaisseur. Une carte qui s'incline sans parallaxe
 * reste une image plate qu'on penche, et l'œil le voit.
 */
/**
 * **Une grille 2×2, et c'est un retour en arrière assumé.**
 *
 * La première tentative posait quatre tuiles de tailles inégales — 4-2 puis
 * 2-4 sur six colonnes — pour que la page soit une composition et non un
 * tableau. Mesuré au navigateur, ça ne tient pas : dans une grille, toutes les
 * tuiles d'une rangée prennent la hauteur de la plus haute. La tuile étroite
 * est la plus haute, parce que cinq pastilles empilées dans une colonne
 * étroite font cinq lignes. La tuile large héritait donc de cette hauteur avec
 * la moitié du contenu, et sortait avec un tiers de vide en bas.
 *
 * Il y avait deux sorties : remplir les tuiles larges en ressortant le texte
 * long — ce que la demande interdit — ou renoncer à l'asymétrie. L'asymétrie
 * était mon idée, pas une exigence ; le texte court en est une. Quatre tuiles
 * égales, aucun trou.
 */

/**
 * Les classes de couleur, écrites en entier et non composées.
 *
 * `text-accent-${couleur}` ne survit pas au balayage de Tailwind : la classe
 * n'existe nulle part dans le source, donc elle n'est pas générée. Un tableau
 * de chaînes littérales est la seule forme que le compilateur voit.
 *
 * Les tuiles n'ont plus de lavis de couleur (demande du client,
 * 2026-10-05) : la couleur de chaque métier tient dans son pictogramme et son
 * numéro, et la tuile est blanche sur le papier.
 */
const ACCENT_TUILE = [
  "text-accent-bleu",
  "text-accent-cyan",
  "text-accent-violet",
  "text-accent-vert",
] as const;

/**
 * Les forfaits du bon de livraison de l'en-tête : un par métier qui se vend
 * au forfait, plus le cadrage, qui est la porte d'entrée des applications.
 * L'informatique et le marketing se facturent à l'heure ou au mois ; ils n'ont
 * pas de date de livraison à promettre, donc pas de ligne ici.
 */
const FORFAITS_TEMOIN: readonly string[] = ["une-page", "vitrine", "identite", "cadrage"];

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
  return metadonneesPage({ locale, chemin: "/services" });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = DICT[locale];
  const p = d.pages.services;

  return (
    <>
      <DonneesStructurees data={donneesPage(locale, "/services", p.titre, "CollectionPage")} />
      <DonneesStructurees data={donneesServices(locale)} />

      <EnTetePage
        titre={p.titre}
        chapo={p.chapo}
        temoin={
          <TemoinLivraison
            locale={locale}
            textes={d.temoins.livraison}
            forfaits={d.prix.forfaits.filter((f) => FORFAITS_TEMOIN.includes(f.cle))}
          />
        }
      />

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {p.items.map((item, i) => (
            <Entree key={item.nom} delai={i * 70} className="h-full">
              <Carte3D
                className="bg-surface border-rule flex h-full flex-col rounded-2xl border p-6 sm:p-8"
              >
                {/* Trois plans de profondeur : le fond de la tuile, les
                    pastilles un peu en avant, le pictogramme franchement
                    devant. C'est le **nombre de plans** qui fait lire une
                    épaisseur, pas l'angle — au-delà de huit degrés, le rendu
                    sous-pixel brouille le texte et la tuile paraît floue
                    plutôt qu'inclinée. */}
                <Couche3D z={44} className="flex items-start justify-between gap-4">
                  <PictoService index={i} />
                  <span
                    className={`font-mono text-xs tracking-[0.2em] tabular-nums ${ACCENT_TUILE[i]}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Couche3D>

                <Couche3D z={22} className="mt-6">
                  <h2 className="font-display text-ink text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl">
                    {item.nom}
                  </h2>
                  <p className="text-ink mt-2 text-lg leading-snug text-pretty">
                    {item.resume}
                  </p>
                </Couche3D>

                {/* Les livrables en pastilles. Cinq puces empilées font cinq
                    lignes ; les mêmes libellés en pastilles font un nuage qu'on
                    embrasse d'un regard. Même information, un quart de la
                    hauteur. */}
                <Couche3D z={10} className="mt-6">
                  <ul className="flex flex-wrap gap-2">
                    {item.livrables.map((l) => (
                      <li
                        key={l}
                        className="bg-paper text-ink-secondary rounded-full px-3 py-1 text-xs leading-relaxed"
                      >
                        {l}
                      </li>
                    ))}
                  </ul>
                </Couche3D>

                {/* Le texte long, replié. Un `<details>` natif : aucun état
                    React, aucun script, et il s'ouvre même si le JavaScript ne
                    charge pas. Ce qui remplissait la page reste disponible à
                    celui qui hésite, sans la remplir pour les autres. */}
                <details className="group/d mt-auto pt-6">
                  <summary
                    className={`focus-visible:ring-signal inline-flex cursor-pointer list-none items-center gap-1.5 rounded-sm py-1 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none ${ACCENT_TUILE[i]}`}
                  >
                    {p.deplier}
                    <ArrowRight
                      className="size-4 transition-transform duration-(--duration-fast) ease-(--ease-out) group-open/d:rotate-90"
                      aria-hidden
                    />
                  </summary>
                  <p className="text-ink-secondary mt-4 max-w-(--content-max) text-sm leading-relaxed text-pretty">
                    {item.detail}
                  </p>
                </details>
              </Carte3D>
            </Entree>
          ))}
        </div>

        {/* Projets d'envergure. Le client peut monter et piloter une équipe
            (2026-10-05) ; la page disait l'inverse ailleurs. Une bande pleine
            largeur plutôt qu'une cinquième tuile : ce n'est pas un métier de
            plus, c'est une échelle de plus pour les quatre. */}
        <Entree delai={280}>
          <div className="bg-surface border-rule mt-5 grid gap-8 rounded-2xl border p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
            <div>
              <h2 className="font-display text-ink text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl">
                {p.envergure.titre}
              </h2>
              <p className="text-ink-secondary mt-3 max-w-(--content-max) text-lg leading-relaxed text-pretty">
                {p.envergure.corps}
              </p>
              <Button asChild size="lg" className="mt-6 rounded-md text-base active:translate-y-px">
                <Link href={`/${locale}/contact`}>
                  {p.envergure.cta} <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
            <ul className="text-ink-secondary space-y-3 self-center leading-relaxed">
              {p.envergure.points.map((point) => (
                <li key={point} className="border-rule flex gap-3 border-b border-dashed pb-3 last:border-0 last:pb-0">
                  <ArrowRight aria-hidden className="text-accent-bleu mt-1 size-4 shrink-0" />
                  <span className="text-pretty">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </Entree>
      </Section>

      {/* Les limites, toutes ensemble et en petit.

          Elles étaient quatre paragraphes dispersés, un par métier, chacun au
          bas d'une section. Rassemblées, elles tiennent en un bloc et disent
          quelque chose qu'elles ne disaient pas éparpillées : voici le
          périmètre du studio, en entier. Annoncer une limite reste ce qui rend
          une promesse crédible ; ce qui change, c'est qu'on la lit d'un coup. */}
      <Section tone="blanc" titre={p.limitesTitre} chapo={p.limitesChapo}>
        <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {p.items.map((item, i) => (
            <li key={item.nom} className="max-w-(--content-max)">
              <p
                className={`font-mono text-[11px] tracking-[0.2em] uppercase ${ACCENT_TUILE[i]}`}
              >
                {item.nom}
              </p>
              <p className="text-ink-secondary mt-2 text-sm leading-relaxed text-pretty">
                {item.horsPerimetre}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* La page se ferme sur l'encre : après des lavis clairs, un fond soutenu
          fait lire le bouton comme la sortie et non comme une section de plus. */}
      <section className="bg-ink py-20 sm:py-24">
        <Zone>
          <h2 className="font-display text-paper max-w-[20ch] text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {p.ctaTitre}
          </h2>
          <p className="text-paper/70 mt-4 max-w-(--content-max) text-lg leading-relaxed text-pretty">
            {p.ctaCorps}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-paper text-ink hover:bg-paper/90 rounded-md text-base"
            >
              <Link href={`/${locale}/contact`}>
                {d.nav.soumission} <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-paper/35 text-paper hover:bg-paper/10 hover:text-paper rounded-md bg-transparent text-base"
            >
              <Link href={`/${locale}#prix`}>{p.ctaLien}</Link>
            </Button>
          </div>
        </Zone>
      </section>
    </>
  );
}
