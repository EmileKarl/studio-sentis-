"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import type { Dict, Locale } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/site";

/**
 * Configurateur de prix.
 *
 * Il remplace une grille de six lignes « nom — prix », c'est-à-dire ce que
 * fait tout le monde. Le but n'était pas d'être différent pour l'être : c'est
 * la seule forme qui **tient la promesse du site sur la page elle-même**. Le
 * studio dit partout « le prix et la date, dès le premier échange » ; ici le
 * visiteur assemble son projet et voit les deux se calculer avant d'avoir
 * écrit à qui que ce soit.
 *
 * Quatre décisions, chacune pour une raison :
 *
 * 1. **Un point de départ, pas une case à cocher.** Les cinq forfaits de base
 *    s'excluent : on ne commande pas un site une page *et* un site vitrine.
 *    Un groupe de boutons radio dit cela sans qu'il faille l'expliquer.
 * 2. **La date est une vraie date**, calculée en jours ouvrables depuis
 *    aujourd'hui. Une fourchette « 3 à 4 semaines » n'engage personne ; une
 *    date au calendrier, si — et c'est précisément l'argument du studio.
 * 3. **Le calcul est rendu au client, jamais au serveur.** Ces pages sont
 *    construites une fois puis servies des semaines : une date calculée à la
 *    construction serait figée. D'où `useSyncExternalStore`, qui donne une
 *    valeur au serveur et une autre au client sans divergence au premier
 *    rendu — le projet a déjà payé l'erreur React #418 pour l'avoir fait
 *    autrement.
 * 4. **Le bouton compose un courriel**, comme le formulaire de contact. Il n'y
 *    a pas de service d'envoi : simuler une soumission qui n'arrive nulle part
 *    serait le pire des deux mondes. La sélection part en clair dans le corps
 *    du message.
 *
 * Les montants viennent du dictionnaire, donc les données structurées de la
 * page et cet écran ne peuvent pas diverger.
 *
 * **Aucune opacité d'élément sur du texte**, et ce n'est pas un détail : le
 * contrôle navigateur signale tout texte sous 90 % d'opacité, parce que c'est
 * ainsi qu'on repère une animation d'entrée restée bloquée. Il a déjà attrapé
 * le logotype pour cette raison, puis ce panneau. Les atténuations passent donc
 * par `text-paper/70`, qui est une couleur composée — mesurable — et non par
 * `opacity-70`, qui ne l'est pas.
 */

/** Ajoute un nombre de jours **ouvrables** à une date. */
function ajouterJoursOuvrables(depart: Date, jours: number) {
  const d = new Date(depart);
  let restants = jours;
  while (restants > 0) {
    d.setDate(d.getDate() + 1);
    const j = d.getDay();
    if (j !== 0 && j !== 6) restants -= 1;
  }
  return d;
}

export function ConfigurateurPrix({
  dict,
  locale,
}: {
  dict: Dict;
  locale: Locale;
}) {
  const p = dict.prix;
  const c = p.config;

  const bases = p.forfaits.filter((f) => f.type === "base");
  const options = p.forfaits.filter((f) => f.type === "option");
  const suivi = p.forfaits.find((f) => f.type === "suivi");

  const [base, setBase] = useState<string | null>(null);
  const [choisies, setChoisies] = useState<string[]>([]);
  const [avecSuivi, setAvecSuivi] = useState(false);

  // Vrai seulement au client : la date ne doit pas être calculée à la
  // construction. Voir la décision 3 en tête de fichier.
  const auClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const total = useMemo(() => {
    const retenu = p.forfaits.filter(
      (f) => f.cle === base || (f.type === "option" && choisies.includes(f.cle)),
    );
    return {
      montant: retenu.reduce((n, f) => n + f.montant, 0),
      jours: retenu.reduce((n, f) => n + f.jours, 0),
      lignes: retenu,
    };
  }, [base, choisies, p.forfaits]);

  const argent = (n: number) =>
    new Intl.NumberFormat(locale === "en" ? "en-CA" : "fr-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(n);

  const date =
    auClient && total.jours > 0
      ? ajouterJoursOuvrables(new Date(), total.jours).toLocaleDateString(
          locale === "en" ? "en-CA" : "fr-CA",
          { weekday: "long", day: "numeric", month: "long", timeZone: "America/Toronto" },
        )
      : null;

  const lien = useMemo(() => {
    if (!base) return `/${locale}/contact`;
    const corps = [
      `${c.total} :`,
      ...total.lignes.map((f) => `- ${f.nom} — ${f.prix}`),
      ...(avecSuivi && suivi ? [`- ${suivi.nom} — ${suivi.prix}`] : []),
      "",
      `${c.total} : ${argent(total.montant)} ${c.unique}`,
      date ? `${c.livraison} ${date}` : "",
      "",
    ].join("\n");
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `${c.cta} — ${total.lignes[0]?.nom ?? ""}`,
    )}&body=${encodeURIComponent(corps)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, choisies, avecSuivi, date, total.montant]);

  const basculer = (cle: string) =>
    setChoisies((liste) =>
      liste.includes(cle) ? liste.filter((x) => x !== cle) : [...liste, cle],
    );

  return (
    <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-14">
      <div className="space-y-10">
        <fieldset>
          <legend className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
            {c.etape1}
          </legend>
          <div className="mt-4 space-y-3">
            {bases.map((f) => (
              <label
                key={f.cle}
                className={`border-rule bg-paper has-focus-visible:ring-signal relative block cursor-pointer rounded-lg border p-5 transition-colors has-focus-visible:ring-2 ${
                  base === f.cle ? "border-signal-aa" : "hover:border-rule-strong"
                }`}
              >
                {/* La commande native couvre toute la carte plutôt que de
                    faire seize pixels dans un coin. Le contrôle navigateur
                    mesurait seize sur seize pour un minimum tactile de
                    quarante-quatre : sur un téléphone, on visait une pastille
                    au lieu d'un bloc. La pastille visible est dessinée à côté,
                    `aria-hidden`, et suit l'état réel de la commande. */}
                <input
                  type="radio"
                  name="base"
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                  checked={base === f.cle}
                  onChange={() => setBase(f.cle)}
                />
                <span className="flex items-baseline justify-between gap-4">
                  <span className="flex items-baseline gap-3">
                    <span
                      aria-hidden
                      className={`mt-1.5 block size-4 shrink-0 rounded-full border-2 transition-colors ${
                        base === f.cle
                          ? "border-signal-aa bg-signal-aa ring-paper ring-2 ring-inset"
                          : "border-rule-strong"
                      }`}
                    />
                    <span className="font-display text-ink text-lg font-semibold">
                      {f.nom}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="font-display text-ink block text-lg font-semibold tabular-nums">
                      {f.prix}
                    </span>
                    {"avant" in f && f.avant ? (
                      <span className="text-ink-muted block text-xs">
                        {c.economie} {argent(f.avant)}
                      </span>
                    ) : null}
                  </span>
                </span>
                <span className="text-ink-secondary mt-2 block pl-7 text-sm leading-relaxed text-pretty">
                  {f.detail}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
            {c.etape2}
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {options.map((f) => (
              <label
                key={f.cle}
                className={`border-rule bg-paper has-focus-visible:ring-signal relative block cursor-pointer rounded-lg border p-4 transition-colors has-focus-visible:ring-2 ${
                  choisies.includes(f.cle)
                    ? "border-signal-aa"
                    : "hover:border-rule-strong"
                }`}
              >
                <input
                  type="checkbox"
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                  checked={choisies.includes(f.cle)}
                  onChange={() => basculer(f.cle)}
                />
                <span className="flex items-baseline justify-between gap-3">
                  <span className="flex items-baseline gap-3">
                    <span
                      aria-hidden
                      className={`mt-1 block size-4 shrink-0 rounded-xs border-2 transition-colors ${
                        choisies.includes(f.cle)
                          ? "border-signal-aa bg-signal-aa ring-paper ring-2 ring-inset"
                          : "border-rule-strong"
                      }`}
                    />
                    <span className="text-ink font-medium">{f.nom}</span>
                  </span>
                  <span className="text-ink shrink-0 font-semibold tabular-nums">
                    {f.prix}
                  </span>
                </span>
                <span className="text-ink-secondary mt-1.5 block pl-7 text-sm leading-relaxed text-pretty">
                  {f.detail}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {suivi ? (
          <fieldset>
            <legend className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
              {c.etape3}
            </legend>
            <label
              className={`border-rule bg-paper has-focus-visible:ring-signal relative mt-4 block cursor-pointer rounded-lg border p-5 transition-colors has-focus-visible:ring-2 ${
                avecSuivi ? "border-signal-aa" : "hover:border-rule-strong"
              }`}
            >
              <input
                type="checkbox"
                className="absolute inset-0 size-full cursor-pointer opacity-0"
                checked={avecSuivi}
                onChange={() => setAvecSuivi((v) => !v)}
              />
              <span className="flex items-baseline justify-between gap-4">
                <span className="flex items-baseline gap-3">
                  <span
                    aria-hidden
                    className={`mt-1.5 block size-4 shrink-0 rounded-xs border-2 transition-colors ${
                      avecSuivi
                        ? "border-signal-aa bg-signal-aa ring-paper ring-2 ring-inset"
                        : "border-rule-strong"
                    }`}
                  />
                  <span className="font-display text-ink text-lg font-semibold">
                    {suivi.nom}
                  </span>
                </span>
                <span className="font-display text-ink shrink-0 text-lg font-semibold tabular-nums">
                  {suivi.prix}
                </span>
              </span>
              <span className="text-ink-secondary mt-2 block pl-7 text-sm leading-relaxed text-pretty">
                {suivi.detail}
              </span>
            </label>
          </fieldset>
        ) : null}
      </div>

      {/* Le récapitulatif suit le défilement : sur un écran de bureau, les
          choix et leur conséquence restent visibles ensemble, ce qui est tout
          l'intérêt d'un configurateur. */}
      <div className="bg-ink text-paper sticky top-24 rounded-lg p-7">
        <p className="text-paper/70 font-mono text-[11px] tracking-[0.2em] uppercase">
          {c.total}
        </p>

        {base ? (
          <>
            <p className="font-display mt-4 text-5xl font-semibold tabular-nums">
              {argent(total.montant)}
            </p>
            <p className="text-paper/70 mt-1 text-sm">{c.unique}</p>

            {avecSuivi && suivi ? (
              <p className="mt-4 text-sm">
                <span className="font-semibold tabular-nums">
                  + {argent(suivi.montant)}
                </span>{" "}
                <span className="text-paper/70">{c.parMois}</span>
              </p>
            ) : null}

            <div className="mt-6 border-t border-white/15 pt-5">
              <p className="text-paper/70 text-sm">{c.livraison}</p>
              {/* Réserve la hauteur : sans elle, la ligne apparaît à
                  l'hydratation et tout le bloc saute. */}
              <p className="font-display mt-1 min-h-[1.75rem] text-xl font-semibold">
                {date ?? " "}
              </p>
              <p className="text-paper/70 mt-1 text-sm tabular-nums">
                {total.jours} {c.jours}
              </p>
            </div>

            <ul className="mt-6 space-y-1.5 text-sm">
              {total.lignes.map((f) => (
                <li key={f.cle} className="flex items-start gap-2">
                  <Check className="text-paper/70 mt-0.5 size-3.5 shrink-0" aria-hidden />
                  <span className="text-paper/90">{f.nom}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              size="lg"
              className="bg-paper text-ink hover:bg-paper/90 mt-7 w-full rounded-md text-base"
            >
              <a href={lien}>
                {c.cta} <ArrowRight aria-hidden />
              </a>
            </Button>
            <p className="text-paper/70 mt-3 text-sm leading-relaxed">{c.ctaNote}</p>
            <Link
              href={`/${locale}/contact`}
              className="text-paper/70 hover:text-paper mt-3 inline-block rounded-sm text-sm underline underline-offset-4 transition-colors"
            >
              {c.formulaire}
            </Link>
          </>
        ) : (
          <p className="text-paper/80 mt-4 leading-relaxed">{c.rien}</p>
        )}
      </div>
    </div>
  );
}
