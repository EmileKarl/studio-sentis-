"use client";

import { cn } from "@/lib/utils";

export type RailItem = {
  index: string;
  title: string;
  body: string;
};

/**
 * §7.2 — défilement horizontal. Scroll natif avec scroll-snap plutôt qu'une
 * séquence GSAP pinnée : au tactile le geste reste celui du système, le
 * clavier fonctionne sans code supplémentaire, et rien ne détourne le scroll
 * vertical de la page. GSAP/ScrollTrigger sera réservé aux séquences que le
 * scroll natif ne sait pas faire (Motion Lab).
 */
export function HorizontalRail({ items }: { items: RailItem[] }) {
  return (
    <div
      role="region"
      aria-label="Parcours du système, défilement horizontal"
      tabIndex={0}
      className={cn(
        "focus-visible:ring-signal -mx-4 flex snap-x snap-mandatory gap-px overflow-x-auto px-4 pb-4 focus-visible:ring-2 focus-visible:outline-none sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10",
        "[scrollbar-width:thin]",
      )}
    >
      {items.map((item) => (
        <article
          key={item.index}
          className="border-rule bg-surface flex w-[78vw] shrink-0 snap-start flex-col border p-6 sm:w-[46vw] lg:w-[24rem]"
        >
          <span className="text-signal-aa font-mono text-xs tracking-[0.2em] tabular-nums">
            {item.index}
          </span>
          <h3 className="font-display text-ink mt-4 text-xl font-semibold tracking-tight text-balance">
            {item.title}
          </h3>
          <p className="text-ink-secondary mt-3 text-sm leading-relaxed text-pretty">
            {item.body}
          </p>
        </article>
      ))}
    </div>
  );
}
