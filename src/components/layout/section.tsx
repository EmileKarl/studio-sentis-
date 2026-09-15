import type { ComponentProps } from "react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

type SectionProps = ComponentProps<"section"> & {
  /** Numéro de section affiché en marge — repère éditorial, pas décoration. */
  index?: string;
  title?: string;
  lead?: string;
  bleed?: boolean;
};

export function Section({
  className,
  children,
  index,
  title,
  lead,
  bleed = false,
  ...props
}: SectionProps) {
  const header = title ? (
    <header className="border-rule mb-10 border-t pt-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-10">
        {index ? (
          <span className="text-ink-muted font-mono text-xs tracking-[0.2em] uppercase tabular-nums">
            {index}
          </span>
        ) : null}
        <div className="max-w-(--content-max)">
          <h2 className="font-display text-ink text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {title}
          </h2>
          {lead ? (
            <p className="text-ink-secondary mt-3 text-base leading-relaxed text-pretty">
              {lead}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  ) : null;

  const body = (
    <>
      {header}
      {children}
    </>
  );

  return (
    <section className={cn("py-16 sm:py-24", className)} {...props}>
      {bleed ? body : <Container>{body}</Container>}
    </section>
  );
}
