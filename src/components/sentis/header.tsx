"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
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

export function SentisHeader({ dict, locale }: { dict: Dict; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const liens = [
    { href: "#travaux", label: dict.travaux.titre },
    { href: "#offre", label: dict.nav.offre },
    { href: "#prix", label: dict.nav.prix },
    { href: "#methode", label: dict.nav.methode },
  ];

  return (
    <header className="border-rule bg-paper sticky top-0 z-40 border-b">
      <div className="mx-auto flex h-16 w-full max-w-(--container-page) items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href={`/${locale}`}
          className="focus-visible:ring-signal -mx-1 rounded-md px-1 py-1.5 focus-visible:ring-2 focus-visible:outline-none"
        >
          <span className="font-display text-ink text-xl font-semibold tracking-tight">
            Studio Sentis
          </span>
        </Link>

        <nav aria-label={dict.nav.offre} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {liens.map((lien) => (
              <li key={lien.href}>
                <a
                  href={lien.href}
                  className="text-ink-secondary hover:text-ink focus-visible:ring-signal rounded-md px-3 py-2 text-base transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {lien.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={`/${dict.nav.autre}`}
            hrefLang={dict.nav.autre}
            className="text-ink-secondary hover:text-ink focus-visible:ring-signal hidden rounded-md px-2 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none sm:block"
          >
            {dict.nav.langue}
          </Link>
          <ThemeToggle />
          <Button asChild className="hidden rounded-md md:inline-flex">
            <a href="#contact">{dict.nav.contact}</a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-md md:hidden"
                aria-label={dict.nav.offre}
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
              <nav className="px-4 pb-8">
                <ul className="flex flex-col">
                  {[...liens, { href: "#contact", label: dict.nav.contact }].map((lien) => (
                    <li key={lien.href} className="border-rule border-b last:border-b-0">
                      <a
                        href={lien.href}
                        onClick={() => setOpen(false)}
                        className="text-ink hover:text-signal-aa block py-4 text-lg transition-colors"
                      >
                        {lien.label}
                      </a>
                    </li>
                  ))}
                  <li className="border-rule border-t pt-4">
                    <Link
                      href={`/${dict.nav.autre}`}
                      hrefLang={dict.nav.autre}
                      onClick={() => setOpen(false)}
                      className="text-ink-secondary hover:text-ink block py-2 text-base"
                    >
                      {dict.nav.langue}
                    </Link>
                  </li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
