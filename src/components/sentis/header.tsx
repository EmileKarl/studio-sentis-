"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Logotype } from "@/components/sentis/logotype";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Dict, Locale } from "@/lib/i18n";
import { BUSINESS, CONTACT_EMAIL } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * L'en-tête et son tiroir mobile.
 *
 * `site.ts` est importé ici, dans un composant client, et c'est volontaire.
 * J'ai essayé l'inverse — faire descendre la ville et le courriel en
 * propriétés depuis la mise en page, qui est un composant serveur, pour que le
 * module ne parte pas dans le paquet du navigateur. Mesuré, c'était pire :
 * 924,4 ko contre 923,8 sur chaque page. `site.ts` est déjà dans le paquet
 * client par `configurateur-prix` et `compte-a-rebours`, donc l'import ne
 * coûte rien de plus, tandis que deux chaînes de plus dans la charge RSC, sur
 * toutes les pages, coûtent. L'intuition disait le contraire ; la mesure a
 * tranché.
 */
export function SentisHeader({ dict, locale }: { dict: Dict; locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Le tiroir se referme depuis le clic lui-même, pas depuis un effet sur
  // `pathname` : sans cela il resterait ouvert par-dessus la page d'arrivée et
  // l'utilisateur croirait que son clic n'a rien fait.
  const fermer = () => setOpen(false);

  const base = `/${locale}`;
  const liens = [
    { href: base, label: dict.nav.accueil },
    { href: `${base}/services`, label: dict.nav.services },
    { href: `${base}/realisations`, label: dict.nav.realisations },
    { href: `${base}/a-propos`, label: dict.nav.apropos },
    { href: `${base}/contact`, label: dict.nav.contactCourt },
  ];

  return (
    <header className="border-rule bg-paper sticky top-0 z-40 border-b">
      {/* `gap-3` et non `gap-4` : le verrouillage sur une ligne est plus large
          que l'empilé qu'il remplace, et à 1024 px — la largeur où la
          navigation complète apparaît — l'en-tête débordait de 22 px. La
          place est reprise sur les écarts et sur l'interlettrage du
          mot-symbole, pas sur les points de rupture : repousser la
          navigation à `xl` aurait privé les tablettes en paysage du menu
          déployé et du sélecteur de langue. */}
      <div className="mx-auto flex h-16 w-full max-w-(--container-page) items-center justify-between gap-3 px-5 sm:px-8">
        {/* `flex items-center` sur le lien lui-même, et non sur le seul
            logotype : un `inline-flex` est une boîte en ligne, donc posée sur
            la ligne de base de son parent. Mesuré au navigateur, le
            verrouillage se centrait à 29 px quand la navigation et le bouton
            se centraient à 32 — trois pixels trop haut, assez pour que l'œil
            voie le logo flotter au-dessus de sa rangée sans savoir dire
            pourquoi. En faisant du lien un conteneur flex, le centrage devient
            géométrique et non typographique. */}
        <Link
          href={base}
          className="focus-visible:ring-signal -mx-1 flex h-full shrink-0 items-center rounded-md px-1 focus-visible:ring-2 focus-visible:outline-none"
        >
          <Logotype className="text-ink text-base" />
        </Link>

        {/* La barre de page active se pose sur le filet du bas de l'en-tête,
            pas à mi-hauteur : c'est le filet qui sépare l'en-tête de la page,
            donc c'est là que se lit « vous êtes sur cette page ». Pour cela il
            faut que le lien occupe toute la hauteur de la barre — d'où
            `h-16` et `items-stretch` ici plutôt que `items-center`. */}
        <nav aria-label={dict.nav.menu} className="hidden h-16 lg:block">
          <ul className="flex h-full items-stretch gap-1">
            {liens.map((lien) => {
              const actif = pathname === lien.href;
              return (
                <li key={lien.href} className="flex">
                  <Link
                    href={lien.href}
                    aria-current={actif ? "page" : undefined}
                    className={cn(
                      "focus-visible:ring-signal relative flex items-center rounded-md px-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none",
                      actif
                        ? "text-ink font-medium"
                        : "text-ink-secondary hover:text-ink",
                    )}
                  >
                    {lien.label}
                    {actif ? (
                      <span
                        aria-hidden
                        // `-bottom-px` : la barre recouvre le filet d'un
                        // pixel de l'en-tête au lieu de flotter au-dessus.
                        className="bg-signal absolute inset-x-3 -bottom-px block h-0.5"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/${dict.nav.autre}`}
            hrefLang={dict.nav.autre}
            className="text-ink-secondary hover:text-ink focus-visible:ring-signal hidden rounded-md px-2 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none sm:block"
          >
            {dict.nav.langue}
          </Link>
          <ThemeToggle />
          <Button asChild className="hidden rounded-md md:inline-flex">
            <Link href={`${base}/contact`}>{dict.nav.soumission}</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-md lg:hidden"
                aria-label={dict.nav.menu}
              >
                <Menu className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            {/* Le tiroir mobile est bâti en trois zones et non en une seule
                colonne de liens : l'en-tête nomme la marque, la navigation
                prend toute la place libre, le pied est ancré en bas. La
                version précédente empilait tout en haut et laissait la moitié
                basse vide — or c'est le bas du tiroir que le pouce atteint,
                donc c'est là que doit se trouver l'action. */}
            <SheetContent
              side="right"
              // `bg-paper` et non le `bg-popover` par défaut : ce dernier vaut
              // `--surface`, c'est-à-dire du blanc pur, alors que le site est
              // sur un papier chaud. Le tiroir doit être la même matière que
              // la page qu'il recouvre, pas une feuille d'un autre blanc.
              // `gap-0` : chaque zone porte ses propres marges.
              //
              // `data-[side=right]:w-[86vw]` et non `w-[86vw]` : `SheetContent`
              // pose lui-même `data-[side=right]:w-3/4`, un sélecteur
              // d'attribut, donc plus spécifique qu'une utilitaire simple. La
              // largeur écrite ici était purement décorative — mesuré au
              // navigateur, le tiroir sortait à 293 px sur un écran de 390,
              // c'est-à-dire les trois quarts par défaut. Il fait maintenant
              // les 335 px annoncés.
              className="bg-paper data-[side=right]:w-[86vw] max-w-sm gap-0"
            >
              <SheetHeader className="border-rule shrink-0 gap-1 border-b px-5 py-4 pr-14">
                {/* `text-left` : `SheetHeader` centre son contenu sur
                    certaines variantes ; ici le logotype doit s'aligner sur la
                    colonne des liens qui le suit. */}
                <SheetTitle className="text-left">
                  <Logotype className="text-ink text-base" />
                </SheetTitle>
                {/* Deux faits, pas une accroche : la ville et la province.
                    Ils n'ont pas à être traduits, donc ils viennent de
                    `site.ts` et non du dictionnaire — une seule source pour
                    l'en-tête, le pied de page et les données structurées. */}
                <p className="text-ink-muted text-xs">
                  {BUSINESS.city}, {BUSINESS.region}
                </p>
              </SheetHeader>

              {/* `flex-1` : la navigation absorbe la hauteur restante, ce qui
                  pousse le pied en bas du tiroir. Les liens restent alignés en
                  haut : j'ai essayé de les centrer dans la hauteur libre —
                  mesuré, 571 px de zone pour 260 px de liens — et l'image au
                  navigateur tranche. Centré, le trou de 311 px se coupe en
                  deux et celui du haut s'ouvre juste sous le filet de
                  l'en-tête, là où l'œil arrive : il se lit comme un défaut.
                  Aligné en haut, la liste part de l'en-tête, le pied tient le
                  bas, et le blanc du milieu est du blanc, pas un oubli.
                  `overflow-y-auto` pour le téléphone trop court : les liens
                  défilent alors sans décrocher le pied. */}
              <nav
                aria-label={dict.nav.menu}
                className="flex-1 overflow-y-auto px-3 py-4"
              >
                <ul className="flex flex-col">
                  {liens.map((lien) => {
                    const actif = pathname === lien.href;
                    return (
                      <li key={lien.href}>
                        <Link
                          href={lien.href}
                          onClick={fermer}
                          aria-current={actif ? "page" : undefined}
                          // Plus de filet entre chaque lien : cinq traits
                          // pleine largeur faisaient de la navigation une
                          // liste d'articles. La hiérarchie est portée par la
                          // taille et la couleur, la séparation par l'espace.
                          // `pl-4` sur tous les liens, actif ou non, sinon le
                          // texte se décale quand on change de page.
                          className={cn(
                            "focus-visible:ring-signal relative flex min-h-12 items-center rounded-md py-3 pr-3 pl-4 text-xl transition-colors focus-visible:ring-2 focus-visible:outline-none",
                            actif
                              ? "text-ink font-medium"
                              : "text-ink-secondary hover:text-ink",
                          )}
                        >
                          {actif ? (
                            // Le même signal que dans l'en-tête de bureau, mis
                            // debout : là une barre sous le lien, ici une
                            // barre à sa gauche. La couleur seule ne suffit
                            // pas à dire « vous êtes ici » — `aria-current`
                            // le dit aux lecteurs d'écran, cette barre le dit
                            // à l'œil qui ne distingue pas le bleu.
                            <span
                              aria-hidden
                              className="bg-signal absolute inset-y-2 left-0 block w-0.5 rounded-full"
                            />
                          ) : null}
                          {lien.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <SheetFooter className="border-rule shrink-0 gap-3 border-t px-5 py-5">
                <Button asChild size="lg" className="w-full rounded-md">
                  <Link href={`${base}/contact`} onClick={fermer}>
                    {dict.nav.soumission}
                  </Link>
                </Button>
                {/* Pas de picto devant ces deux liens. J'en avais mis deux —
                    une enveloppe et un globe — et je les ai retirés après
                    mesure : `lucide-react` les livre en JS, et les deux pesaient
                    0,9 ko, assez pour faire passer `/fr/contact` de 939,9 à
                    940,8 ko, c'est-à-dire au-dessus de son budget. Une adresse
                    courriel et le mot « English » se lisent sans dessin ; le
                    filet au-dessus du sélecteur de langue suffit à le séparer
                    du reste.

                    Le courriel en clair, sous le bouton : sur un téléphone,
                    écrire directement est souvent plus rapide que remplir un
                    formulaire, et pour un studio local c'est le geste réel.
                    Le libellé est l'adresse elle-même — elle se lit dans les
                    deux langues, donc rien à traduire. */}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  onClick={fermer}
                  className="text-ink-secondary hover:text-ink focus-visible:ring-signal flex min-h-11 items-center rounded-md text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span className="min-w-0 truncate">{CONTACT_EMAIL}</span>
                </a>
                {/* Le sélecteur de langue n'est visible qu'à partir de `sm`
                    dans l'en-tête : sur un téléphone, ce tiroir est son seul
                    emplacement. Il est donc séparé par un filet, pas noyé
                    dans la liste des pages — ce n'est pas une page de plus,
                    c'est le même site dans l'autre langue. */}
                <Link
                  href={`/${dict.nav.autre}`}
                  hrefLang={dict.nav.autre}
                  onClick={fermer}
                  className="text-ink-secondary hover:text-ink focus-visible:ring-signal border-rule flex min-h-11 items-center rounded-md border-t pt-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {dict.nav.langue}
                </Link>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
