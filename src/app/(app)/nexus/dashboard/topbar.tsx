"use client";

import { Bell, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const NOTIFICATIONS = [
  { id: 1, title: "Vérification terminée", body: "72 chargements, aucun constat.", unread: true },
  { id: 2, title: "Palette de graphiques remplacée", body: "L'ancien jeu échouait 3 contrôles sur 5.", unread: true },
  { id: 3, title: "Motion Lab publié", body: "Neuf familles d'animation documentées.", unread: false },
];

export function DashboardTopbar() {
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <header className="border-rule bg-paper sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b px-4 sm:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />

      <span className="text-ink-secondary shrink-0 font-mono text-[11px] tracking-[0.18em] uppercase">
        Dashboard
      </span>

      <div className="relative ml-auto hidden max-w-xs flex-1 sm:block">
        <Search
          className="text-ink-muted pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Rechercher"
          aria-label="Rechercher dans le tableau de bord"
          className="rounded-xs pl-8"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative ml-auto rounded-xs sm:ml-0"
            aria-label={`Notifications, ${unread} non lues`}
          >
            <Bell className="size-4" aria-hidden />
            {unread ? (
              <span
                className="bg-signal absolute top-1 right-1 size-1.5 rounded-full"
                aria-hidden
              />
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 rounded-xs p-0">
          <div className="border-rule flex items-center justify-between border-b px-4 py-2.5">
            <p className="font-display text-ink text-sm font-semibold">Notifications</p>
            <Badge variant="outline" className="font-mono text-[11px] tabular-nums">
              {unread} non lues
            </Badge>
          </div>
          <ul>
            {NOTIFICATIONS.map((n) => (
              <li key={n.id} className="border-rule border-b px-4 py-3 last:border-b-0">
                <div className="flex items-start gap-2">
                  <span
                    className={
                      n.unread
                        ? "bg-signal mt-1.5 size-1.5 shrink-0 rounded-full"
                        : "bg-rule-strong mt-1.5 size-1.5 shrink-0 rounded-full"
                    }
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-ink text-sm font-medium">{n.title}</p>
                    <p className="text-ink-secondary mt-0.5 text-xs text-pretty">{n.body}</p>
                    <p className="sr-only">{n.unread ? "Non lue" : "Lue"}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </header>
  );
}
