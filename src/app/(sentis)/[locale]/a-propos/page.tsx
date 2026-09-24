import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion";
import { EnTetePage, Section, Zone } from "@/components/sentis/parts";
import { Button } from "@/components/ui/button";
import { DICT, LOCALES, isLocale } from "@/lib/i18n";

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
  const p = DICT[locale].pages.apropos;
  return { title: p.titre, description: p.chapo };
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
      <EnTetePage titre={p.titre} chapo={p.chapo} />

      <Section>
        <div className="space-y-16">
          {p.histoire.map((bloc, i) => (
            <Reveal key={bloc.titre} direction="up" distance={16}>
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
            </Reveal>
          ))}
        </div>
      </Section>

      <Section titre={p.valeursTitre} tone="sand">
        <ul className="grid gap-6 md:grid-cols-3">
          {p.valeurs.map((v) => (
            <li key={v.titre} className="bg-paper rounded-lg p-6 shadow-sm">
              <h3 className="font-display text-ink text-xl font-semibold text-balance">
                {v.titre}
              </h3>
              <p className="text-ink-secondary mt-3 leading-relaxed text-pretty">
                {v.corps}
              </p>
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
