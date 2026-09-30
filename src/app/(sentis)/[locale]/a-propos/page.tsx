import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Prisme3D, Reveal3D } from "@/components/motion";
import { EnTetePage, Section, Zone } from "@/components/sentis/parts";
import { Button } from "@/components/ui/button";
import { DICT, LOCALES, isLocale } from "@/lib/i18n";
import { donneesPage, metadonneesPage } from "@/lib/seo";
import { DonneesStructurees } from "@/components/sentis/donnees-structurees";

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

export default async function AProposPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = DICT[locale];
  const p = d.pages.apropos;

  return (
    <>
      <DonneesStructurees data={donneesPage(locale, "/a-propos", p.titre, "AboutPage")} />

      <EnTetePage titre={p.titre} chapo={p.chapo} scene="poussiere" />

      <Section>
        <div className="space-y-16">
          {p.histoire.map((bloc, i) => (
            <Reveal3D key={bloc.titre} depuis="bas" distance={90}>
              <article className="grid gap-4 md:grid-cols-[auto_1fr] md:gap-12">
                <p className="text-ink-muted font-mono text-xs tracking-[0.2em] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="min-w-0">
                  <h2 className="font-display text-ink max-w-[22ch] text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                    {bloc.titre}
                  </h2>
                  <p className="text-ink-secondary mt-4 max-w-(--content-max) text-lg leading-relaxed text-pretty">
                    {bloc.corps}
                  </p>
                </div>
              </article>
            </Reveal3D>
          ))}
        </div>
      </Section>

      {/* Ce que le studio refuse, avant ce qu'il promet.
          Pour une entreprise sans références, une limite énoncée vaut plus
          qu'un principe : n'importe qui peut écrire « rigueur », personne ne
          s'interdit publiquement de facturer à l'heure sans le penser. */}
      <Section tone="cyan" titre={p.limites.titre} chapo={p.limites.chapo}>
        <ul className="grid gap-6 md:grid-cols-2">
          {p.limites.items.map((item, i) => (
            <li key={item.titre}>
              <Reveal3D
                depuis={i % 2 === 0 ? "gauche" : "droite"}
                distance={90}
                delay={(i % 2) * 0.06}
                className="h-full"
                classeAnimee="bg-paper h-full rounded-lg p-6 shadow-sm"
              >
                <>
                  <h3 className="font-display text-ink text-xl font-semibold text-balance">
                    {item.titre}
                  </h3>
                  <p className="text-ink-secondary mt-3 leading-relaxed text-pretty">
                    {item.corps}
                  </p>
                </>
              </Reveal3D>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="vert">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
          <h2 className="font-display text-ink max-w-(--content-max) text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            {p.valeursTitre}
          </h2>
          {/* Le prisme tourne au défilement. Ses faces ne disent rien que les
              cartes ci-dessous ne disent en toutes lettres : il est marqué
              `aria-hidden` et la section se lit sans lui. */}
          <Prisme3D
            faces={[...p.valeurs.map((v) => v.titre), "Studio Sentis"]}
            taille={170}
            colore
            className="hidden lg:flex"
          />
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {p.valeurs.map((v, i) => (
            // Le Reveal3D est DANS le <li> : un <div> entre <ul> et <li>
            // casserait la liste pour un lecteur d'écran, qui ne compterait
            // plus trois éléments.
            <li key={v.titre}>
              <Reveal3D
                depuis={i === 0 ? "gauche" : i === 1 ? "bas" : "droite"}
                distance={110}
                delay={i * 0.06}
                className="h-full"
                classeAnimee="bg-paper h-full rounded-lg p-6 shadow-sm"
              >
                <>
                  <h3 className="font-display text-ink text-xl font-semibold text-balance">
                    {v.titre}
                  </h3>
                  <p className="text-ink-secondary mt-3 leading-relaxed text-pretty">
                    {v.corps}
                  </p>
                </>
              </Reveal3D>
            </li>
          ))}
        </ul>
      </Section>

      <section className="bg-ink text-paper py-20 sm:py-24">
        <Zone>
          <h2 className="font-display max-w-[20ch] text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {d.contact.titre}
          </h2>
          <Button
            asChild
            size="lg"
            className="bg-paper text-ink hover:bg-paper/90 mt-8 rounded-md text-base"
          >
            <Link href={`/${locale}/contact`}>
              {d.nav.soumission} <ArrowRight aria-hidden />
            </Link>
          </Button>
        </Zone>
      </section>
    </>
  );
}
