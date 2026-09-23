import Link from "next/link";

import { Container } from "@/components/layout/container";
import { NAV } from "@/lib/nav";

const STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Magic UI",
  "Motion",
  "Lucide",
];

export function SiteFooter() {
  return (
    <footer className="border-rule border-t">
      <Container className="grid gap-10 py-12 md:grid-cols-[1fr_auto_auto] md:gap-16">
        <div>
          <p className="font-display text-ink text-sm font-bold tracking-[0.18em] uppercase">
            Nexus UI
          </p>
          <p className="text-ink-secondary mt-3 max-w-(--content-max) text-sm leading-relaxed text-pretty">
            Infrastructure de création numérique : un design system, une
            bibliothèque de composants et une bibliothèque d&apos;animations,
            conçus pour être réutilisés d&apos;un projet à l&apos;autre.
          </p>
        </div>

        <nav aria-label="Pages">
          <h2 className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
            Pages
          </h2>
          <ul className="mt-4 space-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                {item.status === "planned" ? (
                  <span className="text-ink-muted/60 inline-block py-1 text-sm">
                    {item.label}{" "}
                    <span className="font-mono text-[11px]">(prévue)</span>
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-ink-secondary hover:text-ink inline-block py-1 text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
            Stack
          </h2>
          <ul className="mt-4 space-y-2">
            {STACK.map((item) => (
              <li key={item} className="text-ink-secondary text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
