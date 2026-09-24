import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FormulaireSoumission } from "@/components/sentis/formulaire";
import { EnTetePage, Section } from "@/components/sentis/parts";
import { DICT, LOCALES, isLocale } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/site";

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
  const p = DICT[locale].pages.contact;
  return { title: p.titre, description: p.chapo };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = DICT[locale];
  const p = d.pages.contact;

  return (
    <>
      <EnTetePage titre={p.titre} chapo={p.chapo} />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <div className="min-w-0">
            <FormulaireSoumission dict={d} />
          </div>

          <aside className="lg:border-rule lg:border-l lg:pl-10">
            <h2 className="font-display text-ink text-xl font-semibold tracking-tight">
              {p.infosTitre}
            </h2>
            <dl className="mt-6 space-y-5">
              {p.infos.map(([cle, valeur]) => (
                <div key={cle}>
                  <dt className="text-ink-muted font-mono text-[11px] tracking-[0.18em] uppercase">
                    {cle}
                  </dt>
                  <dd className="text-ink mt-1 text-pretty">
                    {valeur.includes("@") ? (
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="hover:text-signal-aa focus-visible:ring-signal -my-1 inline-block rounded-sm py-1 underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                      >
                        {valeur}
                      </a>
                    ) : (
                      valeur
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="border-rule text-ink-secondary mt-8 border-t pt-6 text-sm leading-relaxed text-pretty">
              {p.direct}{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-ink hover:text-signal-aa underline underline-offset-4 transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}
