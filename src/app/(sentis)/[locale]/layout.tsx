import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { notFound } from "next/navigation";

import { SentisFooter } from "@/components/sentis/footer";
import { SentisHeader } from "@/components/sentis/header";
import { DICT, LOCALES, isLocale } from "@/lib/i18n";

/** Serif à contraste doux : un atelier, pas un outil. Fraunces est variable. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

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
  const dict = DICT[locale];
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: "/fr", en: "/en" },
    },
  };
}

export default async function SentisLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = DICT[locale];

  return (
    // data-brand bascule toute la peau : mêmes noms de tokens, autres valeurs.
    // lang est posé ici parce que la racine ne connaît pas la langue de la page.
    <div
      data-brand="sentis"
      lang={locale}
      className={`${fraunces.variable} ${sourceSans.variable} bg-paper text-ink flex min-h-dvh flex-col`}
    >
      <a
        href="#contenu"
        className="focus-visible:ring-signal bg-ink text-paper sr-only rounded-md px-4 py-2 focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:ring-2"
      >
        {locale === "fr" ? "Aller au contenu" : "Skip to content"}
      </a>
      <SentisHeader dict={dict} locale={locale} />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <SentisFooter dict={dict} />
    </div>
  );
}
