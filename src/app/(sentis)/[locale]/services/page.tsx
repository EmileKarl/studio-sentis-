import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";
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
  const p = DICT[locale].pages.services;
  return { title: p.titre, description: p.chapo };
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
      <EnTetePage titre={p.titre} chapo={p.chapo} />

      <Section>
        <div className="space-y-20 sm:space-y-28">
          {p.items.map((item, i) => (
            <Reveal key={item.nom} direction="up" distance={16}>
              <article className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
                <div>
                  <p className="text-ink-muted font-mono text-xs tracking-[0.2em] tabular-nums">
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
                            className="text-signal-aa mt-0.5 size-4 shrink-0"
                            aria-hidden
                          />
                          <span className="text-ink-secondary text-pretty">{l}</span>
                        </span>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="bg-surface-2 border-rule border-t py-20 sm:py-24">
        <Zone>
          <h2 className="font-display text-ink max-w-[20ch] text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {p.ctaTitre}
          </h2>
          <p className="text-ink-secondary mt-4 max-w-(--content-max) text-lg leading-relaxed text-pretty">
            {p.ctaCorps}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-md text-base">
              <Link href={`/${locale}/contact`}>
                {d.nav.soumission} <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-md text-base">
              <Link href={`/${locale}#prix`}>{p.ctaLien}</Link>
            </Button>
          </div>
        </Zone>
      </section>
    </>
  );
}
