import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DonneesStructurees } from "@/components/sentis/donnees-structurees";
import { PageLegale } from "@/components/sentis/page-legale";
import { LOCALES, isLocale } from "@/lib/i18n";
import { TEXTES_LEGAUX } from "@/lib/legal";
import { donneesPage, metadonneesPage } from "@/lib/seo";
import {
  BUSINESS,
  CONTACT_EMAIL,
  EXPLOITANT,
  IDENTITE_INCOMPLETE,
} from "@/lib/site";

const CHEMIN = "/mentions-legales";

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
    chemin: CHEMIN,
    // Tant qu'il manque le nom légal, le NEQ, l'adresse ou l'hébergeur, cette
    // page reste hors des moteurs : elle affiche des trous, et un document
    // d'identité incomplet indexé est pire qu'un document absent.
    noindex: IDENTITE_INCOMPLETE,
  });
}

export default async function MentionsLegalesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = TEXTES_LEGAUX[locale].mentions;

  /**
   * Fiche d'identité de l'exploitant.
   *
   * Une valeur absente n'est pas masquée : elle est affichée comme un manque
   * explicite. Cacher la ligne donnerait une fiche d'apparence complète, et
   * c'est justement ce qu'il ne faut pas — ni pour le visiteur, ni pour la
   * personne qui doit se souvenir de la remplir.
   */
  const lignes = [
    { label: t.identite.nomLegal, valeur: EXPLOITANT.nomLegal },
    { label: t.identite.neq, valeur: EXPLOITANT.neq },
    {
      label: t.identite.adresse,
      valeur: EXPLOITANT.adresse
        ? EXPLOITANT.adresse
        : `${BUSINESS.city}, ${BUSINESS.regionName}, Canada — ${t.trou}`,
    },
    { label: t.identite.hebergeur, valeur: EXPLOITANT.hebergeur },
    { label: t.identite.courriel, valeur: CONTACT_EMAIL, courriel: true },
  ];

  return (
    <>
      <DonneesStructurees data={donneesPage(locale, CHEMIN, t.titre)} />

      <PageLegale
        locale={locale}
        titre={t.titre}
        chapo={t.chapo}
        libelleMaj={TEXTES_LEGAUX[locale].maj}
        libelleSommaire={TEXTES_LEGAUX[locale].sommaire}
        sections={[...t.sections]}
        enTete={
          <div>
            <h2 className="font-display text-ink text-2xl font-semibold tracking-tight">
              {t.identiteTitre}
            </h2>
            <dl className="border-rule mt-5 max-w-(--content-max) divide-rule divide-y border-y">
              {lignes.map((ligne) => (
                <div
                  key={ligne.label}
                  className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4"
                >
                  <dt className="text-ink-muted text-sm">{ligne.label}</dt>
                  <dd className="text-ink text-sm">
                    {ligne.valeur ? (
                      ligne.courriel ? (
                        <a
                          href={`mailto:${ligne.valeur}`}
                          className="hover:text-signal-aa focus-visible:ring-signal rounded-sm underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                        >
                          {ligne.valeur}
                        </a>
                      ) : (
                        ligne.valeur
                      )
                    ) : (
                      <span className="text-ink-muted italic">{t.trou}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            {IDENTITE_INCOMPLETE ? (
              <p className="text-ink-secondary bg-surface border-rule mt-5 max-w-(--content-max) border-l-2 py-3 pl-4 text-sm leading-relaxed text-pretty">
                {t.trouNote}
              </p>
            ) : null}
          </div>
        }
      />
    </>
  );
}
