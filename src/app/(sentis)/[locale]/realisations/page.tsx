import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Lancement } from "@/components/sentis/lancement";
import { EnTetePage } from "@/components/sentis/parts";
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
    chemin: "/realisations",
  });
}

export default async function RealisationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = DICT[locale];
  const p = d.pages.realisations;

  return (
    <>
      <DonneesStructurees data={donneesPage(locale, "/realisations", p.titre, "CollectionPage")} />

      <EnTetePage titre={p.titre} chapo={p.chapo} scene="constellation" />
      <Lancement dict={d} locale={locale} />
    </>
  );
}
