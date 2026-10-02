import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal3D, Stagger, StaggerItem } from "@/components/motion";
import { EnTetePage, Section, Zone, type Fond } from "@/components/sentis/parts";
import { PictoService } from "@/components/sentis/pictos";
import { Button } from "@/components/ui/button";
import { DICT, LOCALES, isLocale } from "@/lib/i18n";
import { donneesPage, donneesServices, metadonneesPage } from "@/lib/seo";
import { DonneesStructurees } from "@/components/sentis/donnees-structurees";

/**
 * Un métier, une couleur du livre.
 *
 * La page était une liste de quatre articles alternant gauche-droite sur un
 * fond unique : lisible, mais rien n'y distinguait un métier d'un autre avant
 * d'avoir lu le titre, et il fallait faire défiler la page entière pour savoir
 * ce qu'elle contenait.
 *
 * Les quatre couleurs de la combinaison 333 de Sanzo Wada donnent la réponse
 * aux deux problèmes à la fois. Chaque métier reçoit une couleur, et il la
 * garde partout : sur sa carte du sommaire, sur le fond de sa section, sur son
 * pictogramme, sur ses puces de livrables. Le sommaire devient alors la
 * **planche de la combinaison** — les quatre lavis côte à côte — et sert de
 * table des matières cliquable. En défilant, on traverse la même suite de
 * couleurs dans le même ordre : bleu, jaune, sienna, vert.
 *
 * L'ordre n'est pas décoratif, c'est celui des métiers : les sites web
 * prennent le bleu de la marque parce que c'est l'offre principale.
 */
const COULEUR_SERVICE: readonly Fond[] = ["bleu", "cyan", "violet", "vert"];

/**
 * Les classes d'accent, écrites en entier et non composées.
 *
 * `text-accent-${couleur}` ne survit pas au balayage de Tailwind : la classe
 * n'existe nulle part dans le source, donc elle n'est pas générée et le texte
 * sort en couleur héritée. Un tableau de chaînes littérales est la seule forme
 * que le compilateur voit.
 */
const ACCENT_SERVICE = [
  "text-accent-bleu",
  "text-accent-cyan",
  "text-accent-violet",
  "text-accent-vert",
] as const;

const BORDURE_SERVICE = [
  "border-accent-bleu",
  "border-accent-cyan",
  "border-accent-violet",
  "border-accent-vert",
] as const;

const CARTE_SERVICE = [
  "bg-teinte-bleu",
  "bg-teinte-cyan",
  "bg-teinte-violet",
  "bg-teinte-vert",
] as const;

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
    chemin: "/services",
  });
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

      <EnTetePage titre={p.titre} chapo={p.chapo} scene="helice" />

      {/* Le sommaire. Quatre cartes, quatre lavis du livre, et chacune mène à
          sa section. Ce n'est pas une redite du contenu : c'est la seule vue de
          la page où les quatre métiers tiennent dans un même écran, et c'est
          celle qui permet de n'en lire qu'un. */}
      <Section titre={p.sommaire.titre} chapo={p.sommaire.chapo}>
        <Stagger
          as="ol"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        >
          {p.items.map((item, i) => (
            <StaggerItem as="li" key={item.nom}>
              {/* Toute la carte est cliquable, et c'est l'ancre elle-même qui
                  porte la surface : une carte dont seul le libellé du bas est
                  actionnable donne une cible de 20 px sur un écran tactile. */}
              <a
                href={`#service-${i + 1}`}
                className={`group focus-visible:ring-signal flex h-full flex-col rounded-lg p-6 transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${CARTE_SERVICE[i]}`}
              >
                <PictoService index={i} />
                <p className="text-ink-muted mt-5 font-mono text-xs tracking-[0.2em] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display text-ink mt-2 text-xl leading-snug font-semibold text-balance">
                  {item.nom}
                </h3>
                <p className="text-ink-secondary mt-2 grow text-sm leading-relaxed text-pretty">
                  {item.resume}
                </p>
                <span
                  className={`mt-5 inline-flex items-center gap-1.5 text-sm font-medium ${ACCENT_SERVICE[i]}`}
                >
                  {p.voirDetail}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Une section par métier, sur sa propre couleur. Les filets haut et bas
          que `Section` pose sur une teinte suffisent à séparer deux lavis
          voisins ; sans eux, bleu et jaune se touchent et l'œil lit un dégradé
          raté plutôt que deux bandes. */}
      {p.items.map((item, i) => (
        <Section key={item.nom} id={`service-${i + 1}`} tone={COULEUR_SERVICE[i]}>
          <Reveal3D depuis={i % 2 === 0 ? "gauche" : "droite"} distance={100}>
            <article className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div>
                <PictoService index={i} />
                <p className="text-ink-muted mt-5 font-mono text-xs tracking-[0.2em] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="font-display text-ink mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  {item.nom}
                </h2>
                <p className="text-ink mt-4 text-lg leading-relaxed text-pretty">
                  {item.resume}
                </p>
              </div>
              <div>
                <p className="text-ink-secondary max-w-(--content-max) leading-relaxed text-pretty">
                  {item.detail}
                </p>
                <Stagger as="ul" className="mt-6 space-y-2.5">
                  {item.livrables.map((l) => (
                    <StaggerItem as="li" key={l}>
                      <span className="flex items-start gap-3">
                        <Check
                          className={`mt-0.5 size-4 shrink-0 ${ACCENT_SERVICE[i]}`}
                          aria-hidden
                        />
                        <span className="text-ink-secondary text-pretty">{l}</span>
                      </span>
                    </StaggerItem>
                  ))}
                </Stagger>
                {/* Ce que la prestation ne couvre pas, sous les livrables et
                    dans le même bloc. Annoncer une limite au même endroit
                    qu'une promesse est ce qui la rend crédible ; la reléguer
                    en bas de page reviendrait à l'enterrer, ce que le studio
                    dit ne pas faire ailleurs sur le site. Elle écarte aussi
                    les demandes hors sujet avant le premier courriel.

                    Le filet de gauche prend la couleur du métier : sur un
                    lavis coloré, `--rule` est un gris qui disparaît. */}
                <p
                  className={`text-ink-muted mt-6 max-w-(--content-max) border-l-2 pl-4 text-sm leading-relaxed text-pretty ${BORDURE_SERVICE[i]}`}
                >
                  {item.horsPerimetre}
                </p>
              </div>
            </article>
          </Reveal3D>
        </Section>
      ))}

      {/* La page se ferme sur l'encre. Après quatre lavis clairs, un fond
          soutenu fait lire le bouton comme la sortie de la page et non comme
          une cinquième section. */}
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
