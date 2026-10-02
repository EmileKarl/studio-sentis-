import Link from "next/link";

import type { Dict, Locale } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/site";
import { Logotype } from "@/components/sentis/logotype";

export function SentisFooter({ dict, locale }: { dict: Dict; locale: Locale }) {
  const base = `/${locale}`;
  const liens = [
    { href: base, label: dict.nav.accueil },
    { href: `${base}/services`, label: dict.nav.services },
    { href: `${base}/realisations`, label: dict.nav.realisations },
    { href: `${base}/a-propos`, label: dict.nav.apropos },
    { href: `${base}/contact`, label: dict.nav.contactCourt },
  ];

  return (
    <footer className="border-rule border-t">
      <div className="mx-auto grid w-full max-w-(--container-page) gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-ink text-xl">
            <Logotype />
          </p>
          <p className="text-ink-secondary mt-3 max-w-(--content-max) text-sm leading-relaxed text-pretty">
            {dict.meta.description}
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-ink hover:text-signal-aa focus-visible:ring-signal mt-4 inline-block rounded-sm py-1 text-sm underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <nav aria-label={dict.nav.menu}>
          <h2 className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
            {dict.nav.menu}
          </h2>
          <ul className="mt-4 space-y-1">
            {liens.map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  className="text-ink-secondary hover:text-ink inline-block py-1 text-sm transition-colors"
                >
                  {lien.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
            {dict.contact.note}
          </h2>
          <p className="text-ink-secondary mt-4 text-sm leading-relaxed">
            {dict.pied.droits}
          </p>
        </div>
      </div>

      {/* Barre légale.
          Elle est séparée de la navigation du dessus parce qu'elle ne s'adresse
          pas au même moment : on parcourt le menu pour choisir, on descend
          jusqu'ici pour vérifier. Les mettre dans la même liste aurait donné
          sept liens de même poids, dont deux que presque personne ne suit.

          Pas d'année de copyright : ces pages sont générées à la construction,
          donc `new Date().getFullYear()` y serait figé au jour du déploiement.
          Un site qui affiche « © 2026 » en 2028 a l'air abandonné — mieux vaut
          ne rien dater du tout que dater faux. */}
      <div className="border-rule border-t">
        <nav
          aria-label={dict.pied.legal}
          className="mx-auto flex w-full max-w-(--container-page) flex-wrap items-center gap-x-6 gap-y-1 px-5 py-5 sm:px-8"
        >
          <Link
            href={`${base}/mentions-legales`}
            className="text-ink-secondary hover:text-ink inline-block py-1 text-sm transition-colors"
          >
            {dict.pied.mentions}
          </Link>
          <Link
            href={`${base}/confidentialite`}
            className="text-ink-secondary hover:text-ink inline-block py-1 text-sm transition-colors"
          >
            {dict.pied.confidentialite}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
