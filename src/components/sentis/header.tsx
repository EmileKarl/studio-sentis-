"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
      <div className="mx-auto flex h-16 w-full max-w-(--container-page) items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href={base}
          className="focus-visible:ring-signal -mx-1 shrink-0 rounded-md px-1 py-1.5 focus-visible:ring-2 focus-visible:outline-none"
        >
          <span className="font-display text-ink text-xl font-semibold tracking-tight">
            Studio Sentis
          </span>
        </Link>

        <nav aria-label={dict.nav.menu} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {liens.map((lien) => {
              const actif = pathname === lien.href;
              return (
                <li key={lien.href}>
                  <Link
                    href={lien.href}
                    aria-current={actif ? "page" : undefined}
                    className={cn(
                      "focus-visible:ring-signal relative rounded-md px-3 py-2 transition-colors focus-visible:ring-2 focus-visible:outline-none",
                      actif
                        ? "text-ink font-medium"
                        : "text-ink-secondary hover:text-ink",
                    )}
                  >
                    {lien.label}
                    {actif ? (
                      <span
                        aria-hidden
                        className="bg-signal absolute inset-x-3 -bottom-0.5 block h-0.5 rounded-full"
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
                  Studio Sentis
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
