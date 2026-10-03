import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { HorizontalTrack, ObjetFlottant3D, Reveal3D } from "@/components/motion";
import { Scene3DDifferee } from "@/components/motion/differe";
import { ConfigurateurPrix } from "@/components/sentis/configurateur-prix";
import { DemoBoulangerie } from "@/components/sentis/demos";
import { BrowserFrame } from "@/components/sentis/frames";
import { HeroPleinEcran } from "@/components/sentis/hero-plein-ecran";
import { PanneauSentis, Section, Zone } from "@/components/sentis/parts";
import { Button } from "@/components/ui/button";
import { DICT, isLocale } from "@/lib/i18n";
import { metadonneesPage } from "@/lib/seo";
import { LocalBusinessJsonLd } from "@/components/sentis/local-business";

// Les quatre panneaux du manifeste alternent quatre aplats francs. La
// version précédente en posait deux en teintes pâles : sur un plein écran,
// un fond presque blanc ne se distinguait pas de la page.
const TONS = ["ink", "bleuPlein", "signal", "violetPlein"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return metadonneesPage({
    locale,
    chemin: "",
  });
}

export default async function SentisHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = DICT[locale];
  const p = d.pages.accueil;

  return (
    <>
      <LocalBusinessJsonLd locale={locale} />

      <HeroPleinEcran dict={d} locale={locale} />

      {/* --- Séquence horizontale : le manifeste, qui EST une progression --- */}
      <HorizontalTrack
        label={locale === "fr" ? "Nos engagements, séquence horizontale" : "Our commitments, horizontal sequence"}
        panels={p.manifeste.map((m, i) => (
          <PanneauSentis key={m.titre} tone={TONS[i % TONS.length]} titre={m.titre} corps={m.corps} />
        ))}
      />

      {/* --- Retour au vertical : on s'arrête, on lit --- */}
      <Section titre={d.probleme.titre} chapo={d.probleme.intro} tone="bleu">
        <ul className="grid gap-6 md:grid-cols-3">
          {d.probleme.items.map((item, i) => (
            // Le Reveal3D est dans le <li> : un <div> entre <ul> et <li>
            // casserait le comptage de la liste pour un lecteur d'écran.
            <li key={item.titre}>
              <Reveal3D
                depuis={i === 0 ? "gauche" : i === 1 ? "bas" : "droite"}
                distance={110}
                delay={i * 0.06}
                className="h-full"
                classeAnimee="bg-paper h-full rounded-lg p-6 shadow-sm"
              >
                <>
                  <h3 className="font-display text-ink text-xl leading-snug font-semibold text-balance">
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

      {/* --- Séquence horizontale : le déroulé d'un projet --- */}
      <HorizontalTrack
        label={locale === "fr" ? "Déroulé d'un projet, séquence horizontale" : "How a project runs, horizontal sequence"}
        panels={d.methode.etapes.map((e, i) => (
          <PanneauSentis
            key={e.n}
            tone={TONS[(i + 2) % TONS.length]}
            titre={e.titre}
            corps={e.corps}
          />
        ))}
      />

      {/* --- Vertical : un aperçu des réalisations, le reste sur sa page --- */}
      <Section titre={d.travaux.titre} chapo={d.travaux.intro} tone="violet">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-12">
          <div className="order-2 lg:order-1">
            <h3 className="font-display text-ink text-2xl font-semibold tracking-tight text-balance">
              {d.travaux.items[0].titre}
            </h3>
            <p className="text-ink-secondary mt-3 max-w-(--content-max) leading-relaxed text-pretty">
              {d.travaux.items[0].corps}
            </p>
            <p className="text-ink-muted mt-4 max-w-(--content-max) font-mono text-xs">
              {d.travaux.items[0].etiquette} · {d.travaux.items[0].meta}
            </p>
            <Button asChild variant="outline" size="lg" className="mt-6 rounded-md">
              <Link href={`/${locale}/realisations`}>
                {d.nav.realisations} <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
          <div className="order-1 min-w-0 lg:order-2">
            <ObjetFlottant3D>
              <BrowserFrame url="lefournil.example">
                <DemoBoulangerie />
              </BrowserFrame>
            </ObjetFlottant3D>
          </div>
        </div>
      </Section>

      {/* --- Vertical : les prix, argument central ---
          Un configurateur plutôt qu'une grille : c'est la seule forme qui
          tienne sur la page la promesse faite partout ailleurs sur le site —
          le prix **et la date**, tout de suite. Voir
          `src/components/sentis/configurateur-prix.tsx`. */}
      <Section id="prix" titre={d.prix.titre} chapo={d.prix.intro} tone="cyan">
        <ConfigurateurPrix dict={d} locale={locale} />

        <div className="border-rule mt-16 border-t pt-10">
          <h3 className="font-display text-ink text-2xl font-semibold tracking-tight">
            {d.prix.composition.titre}
          </h3>
          <p className="text-ink-secondary mt-4 max-w-(--content-max) leading-relaxed text-pretty">
            {d.prix.composition.chapo}
          </p>
          <ul className="text-ink-secondary marker:text-signal-aa mt-5 max-w-(--content-max) list-disc space-y-2 pl-5 leading-relaxed">
            {d.prix.composition.items.map((item) => (
              <li key={item} className="text-pretty">
                {item}
              </li>
            ))}
          </ul>
          {/* La comparaison sur trois ans est le seul chiffre de la page qui
              parle d'un concurrent. Il est vérifiable à la calculette, ce qui
              est la seule façon honnête d'en citer un. */}
          <p className="text-ink bg-paper border-signal-aa mt-6 max-w-(--content-max) border-l-2 py-4 pl-5 leading-relaxed text-pretty">
            {d.prix.composition.comparaison}
          </p>
          <p className="text-ink-secondary mt-6 max-w-(--content-max) leading-relaxed text-pretty">
            {d.prix.note}
          </p>
        </div>
      </Section>

      {/* --- Appel final --- */}
      <section className="bg-ink text-paper relative overflow-hidden py-24 sm:py-32">
        {/* L'onde est le seul décor de cette section : pas de filet, pas de
            carte, rien qui concurrence le seul bouton de la page. */}
        <Scene3DDifferee
          variante="onde"
          alpha={0.55}
          vitesse={0.8}
          decalage={0.3}
          zoom={0.92}
          className="text-rule-strong"
        />
        <Zone className="relative">
          {/* `sansFondu` : ce titre est le dernier appel de la page, et le
              contrôle navigateur l'a trouvé à 0 % d'opacité alors qu'il était
              dans le viewport — l'entrée au défilement n'avait pas encore
              couru. Le texte qui porte la conversion ne doit dépendre d'aucune
              animation pour être lu. Il s'anime en position, pas en opacité. */}
          <Reveal3D depuis="bas" distance={70} angle={9} sansFondu>
            <h2 className="font-display max-w-[18ch] text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
              {d.contact.titre}
            </h2>
          </Reveal3D>
          <p className="mt-6 max-w-(--content-max) text-lg leading-relaxed text-pretty">
            {d.contact.corps}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-paper text-ink hover:bg-paper/90 mt-10 rounded-md text-base"
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
