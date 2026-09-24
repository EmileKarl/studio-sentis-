import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Travaux } from "@/components/sentis/travaux";
import { EnTetePage } from "@/components/sentis/parts";
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
  const p = DICT[locale].pages.realisations;
  return { title: p.titre, description: p.chapo };
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
      <EnTetePage titre={p.titre} chapo={p.chapo} />
      <Travaux dict={d} />
    </>
  );
}
