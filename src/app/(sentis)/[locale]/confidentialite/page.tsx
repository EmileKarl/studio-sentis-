import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DonneesStructurees } from "@/components/sentis/donnees-structurees";
import { PageLegale } from "@/components/sentis/page-legale";
import { LOCALES, isLocale } from "@/lib/i18n";
import { TEXTES_LEGAUX } from "@/lib/legal";
import { donneesPage, metadonneesPage } from "@/lib/seo";

const CHEMIN = "/confidentialite";

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
  });
}

export default async function ConfidentialitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = TEXTES_LEGAUX[locale].confidentialite;

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
      />
    </>
  );
}
