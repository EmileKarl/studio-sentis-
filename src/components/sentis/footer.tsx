import Link from "next/link";

import type { Dict, Locale } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/site";

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
          <p className="font-display text-ink text-xl font-semibold tracking-tight">
            Studio Sentis
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
          <p className="text-ink-muted mt-3 text-sm">
            {dict.pied.mention}{" "}
            <Link
              href="/nexus"
              className="hover:text-ink focus-visible:ring-signal -my-1 inline-block rounded-sm py-1 underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              NEXUS UI
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
