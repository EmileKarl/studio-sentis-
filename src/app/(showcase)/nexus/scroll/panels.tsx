import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Panneau plein écran d'une séquence horizontale. */
export function Panel({
  children,
  tone = "paper",
}: {
  children: ReactNode;
  tone?: "paper" | "ink" | "signal" | "sand";
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col justify-center px-6 py-16 sm:px-12 sm:py-20 lg:px-20",
        tone === "ink" && "bg-ink text-paper",
        tone === "signal" && "bg-signal-aa text-white",
        tone === "sand" && "bg-surface-2 text-ink",
        tone === "paper" && "bg-paper text-ink",
      )}
    >
      {/* Largeur en rem, pas en ch : le ch se résout sur la police de
          l'élément qui le porte, et ce conteneur est en 16px alors que le
          titre qu'il contient monte à 60px. La mesure en ch appartient
          aux éléments de texte eux-mêmes, plus bas. */}
      <div className="w-full max-w-[44rem]">{children}</div>
    </div>
  );
}

export function PanelTitre({
  children,
  tone = "paper",
}: {
  children: ReactNode;
  tone?: "paper" | "ink" | "signal" | "sand";
}) {
  return (
    <h3
      className={cn(
        "font-display max-w-[15ch] text-4xl leading-[0.95] font-bold tracking-[-0.035em] text-balance sm:text-6xl lg:text-7xl",
        tone === "ink" || tone === "signal" ? "text-inherit" : "text-ink",
      )}
    >
      {children}
    </h3>
  );
}

export function PanelTexte({
  children,
  tone = "paper",
}: {
  children: ReactNode;
  tone?: "paper" | "ink" | "signal" | "sand";
}) {
  return (
    <p
      className={cn(
        "mt-6 max-w-[38ch] text-base leading-relaxed text-pretty sm:text-lg",
        tone === "ink" || tone === "signal" ? "text-inherit" : "text-ink-secondary",
      )}
    >
      {children}
    </p>
  );
}
