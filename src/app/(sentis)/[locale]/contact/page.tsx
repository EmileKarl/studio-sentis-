import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FormulaireSoumission } from "@/components/sentis/formulaire";
import { GlobeDiffere } from "@/components/motion/differe";
import { EnTetePage, Section } from "@/components/sentis/parts";
import { DICT, LOCALES, isLocale } from "@/lib/i18n";
import { filAriane, metadonneesPage } from "@/lib/seo";
import { DonneesStructurees } from "@/components/sentis/donnees-structurees";
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
  return metadonneesPage({
    locale,
    chemin: "/contact",
    titre: p.titre,
    description: p.chapo,
  });
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
      <DonneesStructurees data={filAriane(locale, "/contact", p.titre)} />

      <EnTetePage titre={p.titre} chapo={p.chapo} scene="onde" />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <div className="min-w-0">
            <FormulaireSoumission dict={d} />

            {/* Avis au point de collecte.
                La Loi 25 demande que la personne sache, au moment où elle
                remplit le champ, ce qu'il advient de ce qu'elle écrit — pas
                dans une page qu'il faut penser à aller chercher. Il est ici et
                non dans le formulaire pour une raison prosaïque : le
                formulaire est un composant client, et lui passer la langue
                pour construire un lien aurait alourdi le paquet JavaScript de
                la page pour deux lignes de texte. */}
            <p className="text-ink-muted border-rule mt-8 max-w-(--content-max) border-t pt-6 text-sm leading-relaxed text-pretty">
              {p.viePrivee}{" "}
              <Link
                href={`/${locale}/confidentialite`}
                className="text-ink-secondary hover:text-ink focus-visible:ring-signal rounded-sm underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                {p.viePriveeLien}
              </Link>
              .
            </p>
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

            {/* Le globe, puis les villes en toutes lettres : le dessin montre
                d'où l'on travaille et jusqu'où ça porte, le texte dit qui est
                couvert. À l'échelle d'un globe, la liste ne tiendrait pas. */}
            <div className="border-rule bg-paper mt-8 overflow-hidden rounded-lg border">
              <GlobeDiffere legende={p.couvertureLegende} />
            </div>

            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-ink-muted font-mono text-[11px] tracking-[0.18em] uppercase">
                  {p.couvertureTitre}
                </dt>
                <dd className="text-ink-secondary mt-1 text-sm leading-relaxed text-pretty">
                  {p.couvertureVilles}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted font-mono text-[11px] tracking-[0.18em] uppercase">
                  {p.couvertureEnLigneTitre}
                </dt>
                <dd className="text-ink-secondary mt-1 text-sm leading-relaxed text-pretty">
                  {p.couvertureEnLigne}
                </dd>
              </div>
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
