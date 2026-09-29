import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { notFound } from "next/navigation";

import { SentisFooter } from "@/components/sentis/footer";
import { PreNavigation } from "@/components/sentis/pre-navigation";
import { MotionLeger } from "@/components/motion/fournisseur-leger";
import { SentisHeader } from "@/components/sentis/header";
import { DICT, LOCALES, isLocale } from "@/lib/i18n";
import { SITE_URL, SITE_URL_IS_PLACEHOLDER } from "@/lib/site";

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
    metadataBase: new URL(SITE_URL),
    // `absolute` et non une simple chaîne : la mise en page racine déclare
    // `template: "%s — NEXUS UI"`, le nom du gabarit technique, qui se
    // retrouvait dans le titre de recherche du site de l'agence. Chaque page
    // pose de toute façon le sien via `metadonneesPage` ; ceci ne sert que de
    // repli, mais un repli faux est un défaut qui attend son tour.
    title: { absolute: dict.seo[""].titre },
    description: dict.seo[""].description,
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: "/fr", en: "/en" },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_CA" : "en_CA",
      alternateLocale: locale === "fr" ? "en_CA" : "fr_CA",
      url: `/${locale}`,
      siteName: "Studio Sentis",
      title: dict.seo[""].titre,
      description: dict.seo[""].description,
      // Une seule image pour les deux langues : elle ne porte que le nom, le
      // métier et le lieu, qui sont vrais dans les deux. Elle est fabriquée
      // par `scripts/generer-images-marque.mjs`.
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Studio Sentis" }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.seo[""].titre,
      description: dict.seo[""].description,
      images: ["/og.png"],
    },
    // Tant que le domaine n'est pas connu, on n'indexe pas : une adresse
    // d'exemple indexée devrait ensuite être désindexée à la main.
    robots: SITE_URL_IS_PLACEHOLDER ? { index: false, follow: false } : undefined,
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
      data-langue-document={locale}
      className={`${fraunces.variable} ${sourceSans.variable} bg-paper text-ink flex min-h-dvh flex-col`}
    >
      {/*
        `<html lang>` est posé par la mise en page racine, qui ne connaît pas
        la langue : elle sert /fr et /en, et annonçait donc « fr » sur tout le
        site anglais. Le `lang` de ce conteneur corrige la sous-arborescence —
        c'est ce que lisent les lecteurs d'écran et la césure — et ce script
        corrige l'attribut du document lui-même, avant la peinture.

        La vraie solution serait plusieurs mises en page racines, une par
        groupe de routes, chacune avec son propre `<html>`. Elle demande de
        déplacer la redirection de `/`, le 404 et les conventions d'icônes ;
        c'est écrit dans `docs/audit.md` comme un compromis, pas comme un
        achèvement.
      */}
      <script
        // Contenu littéral, issu d'un segment d'URL déjà validé par `isLocale`.
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(locale)}`,
        }}
      />
      <PreNavigation locale={locale} />
      <a
        href="#contenu"
        className="focus-visible:ring-signal bg-ink text-paper sr-only rounded-md px-4 py-2 focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:ring-2"
      >
        {locale === "fr" ? "Aller au contenu" : "Skip to content"}
      </a>
      <MotionLeger>
        <SentisHeader dict={dict} locale={locale} />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <SentisFooter dict={dict} locale={locale} />
      </MotionLeger>
    </div>
  );
}
