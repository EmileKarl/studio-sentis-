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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Dict, Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

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
            <SheetContent side="right" className="w-[86vw] max-w-sm">
              <SheetHeader>
                <SheetTitle className="font-display text-xl">
                  <Logotype />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label={dict.nav.menu} className="px-4 pb-8">
                <ul className="flex flex-col">
                  {liens.map((lien) => (
                    <li key={lien.href} className="border-rule border-b">
                      <Link
                        href={lien.href}
                        onClick={fermer}
                        aria-current={pathname === lien.href ? "page" : undefined}
                        className={cn(
                          "block py-4 text-lg transition-colors",
                          pathname === lien.href
                            ? "text-signal-aa font-medium"
                            : "text-ink hover:text-signal-aa",
                        )}
                      >
                        {lien.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="mt-6 w-full rounded-md">
                  <Link href={`${base}/contact`} onClick={fermer}>
                    {dict.nav.soumission}
                  </Link>
                </Button>
                <Link
                  href={`/${dict.nav.autre}`}
                  hrefLang={dict.nav.autre}
                  onClick={fermer}
                  className="text-ink-secondary hover:text-ink mt-6 inline-block py-2 text-base"
                >
                  {dict.nav.langue}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
