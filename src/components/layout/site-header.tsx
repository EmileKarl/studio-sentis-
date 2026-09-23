"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-rule bg-paper sticky top-0 z-40 border-b">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="focus-visible:ring-signal group -mx-1 flex items-baseline gap-2 rounded-xs px-1 py-1.5 focus-visible:ring-2 focus-visible:outline-none"
        >
          <span className="font-display text-ink text-sm font-bold tracking-[0.18em] uppercase">
            Nexus
          </span>
          <span className="bg-signal inline-block size-1.5 translate-y-[-1px] rounded-full" aria-hidden />
          <span className="text-ink-muted font-mono text-[11px] tracking-[0.18em] uppercase">
            UI
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              const planned = item.status === "planned";
              return (
                <li key={item.href}>
                  {planned ? (
                    <span
                      className="text-ink-muted/60 flex cursor-not-allowed items-center gap-1.5 px-3 py-1.5 text-sm"
                      title="Page prévue, pas encore construite"
                    >
                      {item.label}
                      <span className="bg-rule size-1 rounded-full" aria-hidden />
                      <span className="sr-only">(prévue, pas encore disponible)</span>
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "focus-visible:ring-signal rounded-xs px-3 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
                        active
                          ? "text-ink font-medium"
                          : "text-ink-secondary hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Ouvrir le menu"
              >
                <Menu className="size-4" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm">
              <SheetHeader>
                <SheetTitle className="font-display tracking-tight">
                  Navigation
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Navigation mobile" className="px-4 pb-8">
                <ul className="flex flex-col">
                  {NAV.map((item) => {
                    const planned = item.status === "planned";
                    return (
                      <li key={item.href} className="border-rule border-b last:border-b-0">
                        {planned ? (
                          <div className="flex items-center justify-between gap-3 py-4">
                            <span className="text-ink-muted text-base">
                              {item.label}
                            </span>
                            <Badge variant="outline" className="font-mono text-[11px]">
                              prévue
                            </Badge>
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="text-ink hover:text-signal-aa block py-4 text-base transition-colors"
                          >
                            {item.label}
                            <span className="text-ink-muted mt-1 block text-sm text-pretty">
                              {item.description}
                            </span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
