"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

const subscribe = () => () => {};

const OPTIONS = [
  { value: "light", label: "Clair", Icon: Sun },
  { value: "dark", label: "Sombre", Icon: Moon },
  { value: "system", label: "Système", Icon: Monitor },
] as const;

/**
 * §10 — clair / sombre / système, avec persistance (next-themes écrit dans
 * localStorage). Rendu inerte avant l'hydratation pour éviter d'afficher un
 * état actif faux.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Le thème n'est connu qu'au client. useSyncExternalStore donne « false » au
  // rendu serveur et « true » au client sans appeler setState dans un effet,
  // ce qui éviterait des rendus en cascade.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  return (
    <div
      role="radiogroup"
      aria-label="Thème de l'interface"
      className="border-rule flex items-center gap-0.5 rounded-xs border p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "focus-visible:ring-signal grid size-7 place-items-center rounded-xs transition-colors focus-visible:ring-2 focus-visible:outline-none",
              active
                ? "bg-ink text-paper"
                : "text-ink-muted hover:text-ink hover:bg-surface-2",
            )}
          >
            <Icon className="size-3.5" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
