import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { HorizontalTrack } from "@/components/motion";
import { DemoBoulangerie } from "@/components/sentis/demos";
import { BrowserFrame } from "@/components/sentis/frames";
import { HeroPleinEcran } from "@/components/sentis/hero-plein-ecran";
import { PanneauSentis, Section, Zone } from "@/components/sentis/parts";
import { Button } from "@/components/ui/button";
import { DICT, isLocale } from "@/lib/i18n";
import { LocalBusinessJsonLd } from "@/components/sentis/local-business";

const TONS = ["ink", "paper", "signal", "sand"] as const;

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
      <Section titre={d.probleme.titre} chapo={d.probleme.intro} tone="sand">
        <ul className="grid gap-6 md:grid-cols-3">
          {d.probleme.items.map((item) => (
            <li key={item.titre} className="bg-paper rounded-lg p-6 shadow-sm">
              <h3 className="font-display text-ink text-xl leading-snug font-semibold text-balance">
                {item.titre}
              </h3>
              <p className="text-ink-secondary mt-3 leading-relaxed text-pretty">
                {item.corps}
              </p>
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
      <Section titre={d.travaux.titre} chapo={d.travaux.intro}>
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
            <BrowserFrame url="lefournil.example">
              <DemoBoulangerie />
            </BrowserFrame>
          </div>
        </div>
      </Section>

      {/* --- Vertical : les prix, argument central --- */}
      <Section titre={d.prix.titre} chapo={d.prix.intro} tone="sand">
        <div className="border-rule bg-paper overflow-hidden rounded-lg border">
          <ul className="divide-rule divide-y">
            {d.prix.forfaits.map((f) => (
              <li
                key={f.nom}
                className="flex flex-col gap-3 p-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              >
                <div className="min-w-0 sm:max-w-md">
                  <h3 className="font-display text-ink text-xl font-semibold">{f.nom}</h3>
                  <p className="text-ink-secondary mt-1 leading-relaxed text-pretty">
                    {f.detail}
                  </p>
                </div>
                <div className="shrink-0 sm:text-right">
                  <p className="font-display text-ink text-2xl font-semibold tabular-nums">
                    {f.prix}
                  </p>
                  <p className="text-ink-muted mt-0.5 text-sm">{f.delai}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-ink-secondary mt-8 max-w-(--content-max) leading-relaxed text-pretty">
          {d.prix.note}
        </p>
      </Section>

      {/* --- Appel final --- */}
      <section className="bg-ink text-paper py-24 sm:py-32">
        <Zone>
          <h2 className="font-display max-w-[18ch] text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            {d.contact.titre}
          </h2>
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
