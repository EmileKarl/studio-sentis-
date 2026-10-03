import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Bloc de code. Statique : la doc décrit, elle n'exécute pas. */
export function Code({ children }: { children: string }) {
  return (
    <pre className="border-rule bg-surface-2 text-ink overflow-x-auto border p-4 font-mono text-xs leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

/** Règle du projet : une contrainte, pas un conseil. */
export function Rule({
  tone = "regle",
  children,
}: {
  tone?: "regle" | "piege";
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "border-l-2 py-1 pl-4",
        tone === "piege" ? "border-signal" : "border-rule-strong",
      )}
    >
      <p className="text-ink-muted font-mono text-[11px] tracking-[0.18em] uppercase">
        {tone === "piege" ? "Piège" : "Règle"}
      </p>
      <div className="text-ink-secondary mt-1.5 max-w-(--content-max) text-sm leading-relaxed text-pretty">
        {children}
      </div>
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <p className="text-ink-secondary max-w-(--content-max) text-base leading-relaxed text-pretty">
      {children}
    </p>
  );
}
