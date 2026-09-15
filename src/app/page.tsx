import Link from "next/link";

import { Hero } from "@/components/sections/hero";
import { HorizontalRail } from "@/components/sections/horizontal-rail";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { Counter } from "@/components/sections/counter";
import { NAV } from "@/lib/nav";
import { getStats } from "@/lib/stats";

const PILLARS = [
  {
    index: "01",
    title: "Des tokens, pas des valeurs",
    body: "Couleur, espacement, rayon, ombre et motion vivent dans deux fichiers CSS. Changer la direction artistique du projet ne demande pas de toucher un seul composant.",
  },
  {
    index: "02",
    title: "Le contraste est vérifié, pas supposé",
    body: "Chaque paire texte/surface est passée au détecteur avant d'entrer dans les tokens. Trois couleurs candidates ont été rejetées pour échec WCAG AA.",
  },
  {
    index: "03",
    title: "Le mouvement a une grammaire",
    body: "Durées, courbes et distances sont des tokens. prefers-reduced-motion est traité une fois, globalement, et non composant par composant.",
  },
  {
    index: "04",
    title: "Le responsive est une fonctionnalité",
    body: "Neuf largeurs à vérifier, de 320 px à 1440 px. Pas de débordement, pas de bouton hors écran, pas de titre qui casse la mise en page.",
  },
  {
    index: "05",
    title: "Les bibliothèques se méritent",
    body: "shadcn/ui pour les primitives accessibles, Magic UI pour dix composants choisis, Motion pour les transitions. Rien d'autre tant que rien d'autre ne sert.",
  },
];

const STACK = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS v4",
  "shadcn/ui",
  "Magic UI",
  "Motion",
  "Lucide",
  "next-themes",
];

export default function Home() {
  const stats = getStats();

  return (
    <>
      <Hero />

      <Section
        index="§1"
        title="Le projet est une infrastructure, pas une page"
        lead="NEXUS UI doit servir de base à des sites vitrines, des SaaS, des dashboards, des portfolios et des applications métier. Ce qui suit est donc construit pour être copié dans le projet suivant, pas pour être regardé une fois."
      >
        <HorizontalRail items={PILLARS} />
        <p className="text-ink-muted mt-4 max-w-(--content-max) font-mono text-xs">
          ← Faites défiler horizontalement, ou utilisez les flèches après avoir
          sélectionné la zone.
        </p>
      </Section>

      <Section
        index="§2"
        title="Où en est le système"
        lead="Les chiffres ci-dessous sont comptés sur le disque au moment du build. Ils ne peuvent pas être gonflés, et ils augmentent tout seuls."
        className="bg-surface-2"
      >
        <dl className="border-rule grid grid-cols-1 gap-px border sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-paper p-6">
              <dd className="font-display text-ink text-4xl font-bold tabular-nums">
                <Counter value={stat.value} />
              </dd>
              <dt className="text-ink mt-2 text-sm font-medium">{stat.label}</dt>
              <p className="text-ink-muted mt-1 text-xs leading-relaxed text-pretty">
                {stat.detail}
              </p>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        index="§3"
        title="Les pages du système"
        lead="Le cahier des charges en prévoit huit. Celles qui ne sont pas encore construites sont marquées comme telles — ici aussi, rien n'est présenté comme fini tant qu'il ne l'est pas."
      >
        <ul className="border-rule grid grid-cols-1 gap-px border md:grid-cols-2 lg:grid-cols-3">
          {NAV.map((item) => {
            const live = item.status === "live";
            return (
              <li key={item.href} className="bg-paper p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-ink text-lg font-semibold tracking-tight">
                    {live ? (
                      <Link
                        href={item.href}
                        className="hover:text-signal-aa focus-visible:ring-signal -my-1 inline-block rounded-xs py-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      item.label
                    )}
                  </h3>
                  <span
                    className={
                      live
                        ? "bg-signal mt-2 size-1.5 shrink-0 rounded-full"
                        : "border-rule-strong mt-2 size-1.5 shrink-0 rounded-full border"
                    }
                    aria-hidden
                  />
                </div>
                <p className="text-ink-secondary mt-2 text-sm leading-relaxed text-pretty">
                  {item.description}
                </p>
                <p className="text-ink-muted mt-3 font-mono text-[11px] tracking-[0.18em] uppercase">
                  {live ? "Construite" : "Prévue"}
                </p>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section index="§4" title="La stack" bleed className="bg-surface-2 py-16">
        <Container>
          <p className="text-ink-secondary max-w-(--content-max) text-base leading-relaxed text-pretty">
            Chaque dépendance est là parce qu&apos;elle fait quelque chose que
            le projet ne sait pas faire seul. GSAP, Lenis et Three.js ne sont
            pas installés : aucune séquence ne les justifie encore.
          </p>
        </Container>
        <Marquee className="mt-10 [--duration:36s]" pauseOnHover>
          {STACK.map((item) => (
            <span
              key={item}
              className="border-rule bg-paper text-ink mx-1 border px-5 py-2.5 font-mono text-sm whitespace-nowrap"
            >
              {item}
            </span>
          ))}
        </Marquee>
      </Section>

      <Section index="§5" title="Prendre le système en main">
        <div className="border-rule bg-surface border p-8 sm:p-12">
          <p className="text-ink-secondary max-w-(--content-max) text-lg leading-relaxed text-pretty">
            Les fondations sont posées : tokens vérifiés, primitives
            accessibles, thème clair/sombre persistant, navigation responsive.
            La suite consiste à construire les pages restantes sur cette base,
            dans l&apos;ordre fixé par le cahier des charges.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-xs">
              <Link href="/design-system">Design system</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xs">
              <Link href="/components">Composants</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
