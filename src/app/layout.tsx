import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

/**
 * Une seule famille, Inter, comme le demande la planche de marque.
 *
 * Elle est déclarée **ici** et non dans la mise en page de la vitrine, et ce
 * déplacement corrige un vrai défaut — voir le commentaire du `<body>`.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Studio Sentis — sites web, applications et identité visuelle",
    template: "%s — Studio Sentis",
  },
  description:
    "Studio web d'une personne à Châteauguay : sites, applications, identité visuelle et accompagnement informatique pour la Montérégie et le Grand Montréal.",
};

/**
 * Racine : police, thème, providers et **la peau de la marque**.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning className="h-full antialiased">
      {/*
        `data-brand` et la variable de police vivent sur le `<body>`, et c'est
        une correction de bogue, pas un rangement.

        Elles étaient posées sur un `<div>` à l'intérieur de la mise en page de
        la vitrine. Or Radix rend ses surfaces flottantes — le tiroir du menu
        mobile, les listes déroulantes du formulaire — dans un **portail
        rattaché à `document.body`**, donc *en dehors* de ce `<div>`. Ces
        surfaces héritaient donc des jetons par défaut, ceux de l'autre marque
        du dépôt : le symbole du logo sortait en vermillon au lieu du bleu, et
        comme `--font-inter` n'existait pas à cet endroit, la déclaration de
        police devenait invalide et le navigateur retombait sur sa serif par
        défaut. Deux symptômes, une seule cause, invisible depuis l'ordinateur
        parce que le tiroir ne s'ouvre qu'en dessous de `lg`.

        Sur le `<body>`, tout portail en hérite par construction.

        Et sur le `<body>`, pas sur le `<html>` : le thème sombre s'écrit
        `.dark [data-brand="sentis"]`, un sélecteur de **descendant**. La classe
        `.dark` étant posée sur le `<html>`, y mettre aussi `data-brand` ferait
        du même élément sa propre cible — la règle ne s'appliquerait jamais et
        le thème sombre tomberait en silence.
      */}
      <body
        data-brand="sentis"
        className={`${inter.variable} bg-paper text-ink min-h-full`}
      >
        {/*
          Les entrées au scroll sont rendues côté serveur à `opacity: 0` — c'est
          ce qui leur permet d'apparaître sans clignoter. Sans JavaScript, elles
          ne réapparaîtraient jamais : le titre du héros, les cartes, la grille
          de prix resteraient invisibles sur une page pourtant entièrement
          rendue. Cette règle ne s'applique que dans ce cas précis, et ne coûte
          rien aux autres visiteurs.
        */}
        <noscript>
          <style>{`[data-entree-animee]{opacity:1!important;transform:none!important;filter:none!important;stroke-dasharray:none!important;stroke-dashoffset:0!important}`}</style>
        </noscript>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={200}>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
