import { ArrowRight, Check, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DICT, isLocale } from "@/lib/i18n";
import { LocalBusinessJsonLd } from "@/components/sentis/local-business";
import { CONTACT_EMAIL } from "@/lib/site";

/** Section : l'unité de rythme du site. Plus d'air que sur NEXUS UI. */
function Section({
  id,
  title,
  lead,
  children,
  tone = "paper",
}: {
  id?: string;
  title?: string;
  lead?: string;
  children: React.ReactNode;
  tone?: "paper" | "sand";
}) {
  return (
    <section
      id={id}
      className={tone === "sand" ? "bg-surface-2 py-20 sm:py-28" : "py-20 sm:py-28"}
    >
      <div className="mx-auto w-full max-w-(--container-page) px-5 sm:px-8">
        {title ? (
          <header className="mb-12 max-w-(--content-max)">
            <h2 className="font-display text-ink text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
              {title}
            </h2>
            {lead ? (
              <p className="text-ink-secondary mt-4 text-lg leading-relaxed text-pretty">
                {lead}
              </p>
            ) : null}
          </header>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export default async function SentisHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = DICT[locale];

  return (
    <>
      <LocalBusinessJsonLd locale={locale} />

      {/* ---------------------------------------------------------------- Hero */}
      <section className="py-20 sm:py-28 lg:py-36">
        <div className="mx-auto w-full max-w-(--container-page) px-5 sm:px-8">
          <p className="text-ink-muted flex items-center gap-2 text-sm">
            <MapPin className="size-4" aria-hidden />
            {d.hero.lieu}
          </p>

          {/* La taille maximale est calée sur la langue la PLUS LONGUE, pas sur
              le français. À 72px, le titre anglais (48 caractères contre 43)
              occupait 28% de la hauteur d'écran et repoussait tout le reste
              sous la ligne de flottaison. */}
          <h1 className="font-display text-ink mt-6 max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {d.hero.titre}
          </h1>

          <p className="text-ink-secondary mt-8 max-w-(--content-max) text-xl leading-relaxed text-pretty">
            {d.hero.chapo}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-md text-base">
              <a href="#contact">
                {d.hero.cta} <ArrowRight aria-hidden />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-md text-base">
              <a href="#prix">{d.hero.ctaSecondaire}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Problème */}
      <Section id="probleme" title={d.probleme.titre} lead={d.probleme.intro} tone="sand">
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

      {/* ------------------------------------------------------------- Réponse */}
      <Section title={d.reponse.titre}>
        <ul className="grid gap-8 md:grid-cols-3">
          {d.reponse.items.map((item) => (
            <li key={item.titre}>
              <span className="bg-signal/12 text-signal-aa grid size-10 place-items-center rounded-full">
                <Check className="size-5" aria-hidden />
              </span>
              <h3 className="font-display text-ink mt-4 text-xl font-semibold text-balance">
                {item.titre}
              </h3>
              <p className="text-ink-secondary mt-2 leading-relaxed text-pretty">
                {item.corps}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------------------------ Services */}
      <Section id="offre" title={d.services.titre} tone="sand">
        <ul className="grid gap-6 md:grid-cols-3">
          {d.services.items.map((item) => (
            <li key={item.titre} className="bg-paper rounded-lg p-6 shadow-sm">
              <h3 className="font-display text-ink text-xl font-semibold text-balance">
                {item.titre}
              </h3>
              <p className="text-ink-secondary mt-3 leading-relaxed text-pretty">
                {item.corps}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-ink-muted mt-8 max-w-(--content-max) text-pretty">
          {d.services.autres}
        </p>
      </Section>

      {/* ---------------------------------------------------------------- Prix */}
      <Section id="prix" title={d.prix.titre} lead={d.prix.intro}>
        <div className="border-rule overflow-hidden rounded-lg border">
          <ul className="divide-rule divide-y">
            {d.prix.forfaits.map((f) => (
              <li
                key={f.nom}
                className="bg-paper flex flex-col gap-3 p-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              >
                <div className="min-w-0 sm:max-w-md">
                  <h3 className="font-display text-ink text-xl font-semibold">
                    {f.nom}
                  </h3>
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

      {/* -------------------------------------------------------------- Versus */}
      <Section title={d.versus.titre} lead={d.versus.intro} tone="sand">
        <ul className="grid gap-6 sm:grid-cols-2">
          {d.versus.items.map((item) => (
            <li key={item.titre} className="bg-paper rounded-lg p-6 shadow-sm">
              <h3 className="font-display text-ink text-lg font-semibold text-balance">
                {item.titre}
              </h3>
              <p className="text-ink-secondary mt-2 leading-relaxed text-pretty">
                {item.corps}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------------------------- Méthode */}
      <Section id="methode" title={d.methode.titre}>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {d.methode.etapes.map((etape) => (
            <li key={etape.n}>
              <span className="text-signal-aa font-display text-3xl font-semibold tabular-nums">
                {etape.n}
              </span>
              <h3 className="font-display text-ink mt-3 text-xl font-semibold text-balance">
                {etape.titre}
              </h3>
              <p className="text-ink-secondary mt-2 leading-relaxed text-pretty">
                {etape.corps}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* -------------------------------------------------------------- Preuve */}
      <Section title={d.preuve.titre} tone="sand">
        <p className="text-ink-secondary max-w-(--content-max) text-lg leading-relaxed text-pretty">
          {d.preuve.corps}
        </p>
        <Button asChild variant="outline" size="lg" className="mt-8 rounded-md text-base">
          <Link href="/nexus">
            {d.preuve.lien} <ArrowRight aria-hidden />
          </Link>
        </Button>
      </Section>

      {/* ------------------------------------------------------------- Contact */}
      <Section id="contact" title={d.contact.titre}>
        <p className="text-ink-secondary max-w-(--content-max) text-lg leading-relaxed text-pretty">
          {d.contact.corps}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button asChild size="lg" className="rounded-md text-base">
            <a href={`mailto:${CONTACT_EMAIL}`}>
              <Mail aria-hidden /> {d.contact.courriel}
            </a>
          </Button>
          <p className="text-ink-muted text-sm">{d.contact.note}</p>
        </div>
      </Section>
    </>
  );
}
