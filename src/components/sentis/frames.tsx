import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Cadres d'appareil qui contiennent une interface RÉELLE, pas une image.
 *
 * Une capture d'écran dans un portfolio ne prouve qu'une chose : que quelqu'un
 * sait exporter un PNG. Ici les démonstrations sont rendues par le navigateur
 * au moment où la page s'affiche — ce qui est visible est ce qui tourne.
 */
export function BrowserFrame({
  url,
  children,
  className,
}: {
  url: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-rule bg-surface-2 overflow-hidden rounded-xl border shadow-lg",
        className,
      )}
    >
      <div className="border-rule flex items-center gap-2 border-b px-3 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="bg-rule-strong size-2.5 rounded-full" />
          <span className="bg-rule-strong size-2.5 rounded-full" />
          <span className="bg-rule-strong size-2.5 rounded-full" />
        </div>
        <p className="bg-paper text-ink-muted mx-auto max-w-[60%] truncate rounded-md px-3 py-1 text-center font-mono text-[11px]">
          {url}
        </p>
      </div>
      <div className="bg-white">{children}</div>
    </div>
  );
}

export function PhoneFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-rule mx-auto w-full max-w-[266px] rounded-[2.25rem] border-4 bg-black p-1.5 shadow-lg",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.9rem] bg-white">
        {/* encoche décorative : elle situe l'appareil, elle ne porte rien */}
        <div
          aria-hidden
          className="absolute top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black"
        />
        {children}
      </div>
    </div>
  );
}
