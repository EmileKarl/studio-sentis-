"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import type { Dict, Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * « Testez votre site » : le visiteur mesure son propre site, ici, maintenant.
 *
 * Il remplace la section des démonstrations, dont le client doutait de
 * l'utilité. Une maquette de boulangerie fictive montre ce que le studio sait
 * faire ; un test du site du visiteur lui montre **ce que ça changerait pour
 * lui**, avec ses propres chiffres. C'est aussi la promesse « vérifié, pas
 * supposé » mise entre ses mains.
 *
 * La mesure est faite par **Google PageSpeed Insights**, appelé directement
 * depuis le navigateur du visiteur : aucun serveur du studio ne voit passer
 * l'adresse, et la politique de confidentialité le dit. Sans clé, l'API est
 * limitée et peut refuser aux heures chargées ; une clé restreinte au domaine
 * se pose dans `NEXT_PUBLIC_PSI_KEY` — publique par nature, elle ne donne
 * accès qu'à ce service, depuis ce site.
 *
 * Une mesure prend vingt à quarante secondes. Le bloc affiche le temps écoulé
 * pendant l'attente : une attente qu'on voit avancer se supporte, une roue qui
 * tourne sans fin se quitte.
 */

const API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"] as const;
type Categorie = (typeof CATEGORIES)[number];

type Resultat = {
  hote: string;
  notes: Record<Categorie, number | null>;
  lcp: string | null;
  cls: string | null;
  https: boolean;
};

type Etat =
  | { nom: "attente" }
  | { nom: "mesure"; depuis: number }
  | { nom: "resultat"; resultat: Resultat }
  | { nom: "erreur"; message: string; adresse?: string };

/** Accepte « votre-commerce.ca », « www.x.ca » ou une adresse complète. */
function normaliser(saisie: string): URL | null {
  const brut = saisie.trim();
  if (!brut) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(brut) ? brut : `https://${brut}`);
    if (!url.hostname.includes(".") || url.hostname.endsWith(".")) return null;
    return url;
  } catch {
    return null;
  }
}

function verdict(note: number): "bon" | "moyen" | "faible" {
  if (note >= 90) return "bon";
  if (note >= 50) return "moyen";
  return "faible";
}

const COULEUR = {
  bon: "text-accent-vert",
  moyen: "text-accent-violet",
  faible: "text-signal-aa",
} as const;

const BARRE = {
  bon: "bg-accent-vert",
  moyen: "bg-accent-violet",
  faible: "bg-signal-aa",
} as const;

export function TestSite({
  locale,
  textes,
}: {
  locale: Locale;
  textes: Dict["testSite"];
}) {
  const id = useId();
  const [saisie, setSaisie] = useState("");
  const [etat, setEtat] = useState<Etat>({ nom: "attente" });
  const [secondes, setSecondes] = useState(0);
  const annulation = useRef<AbortController | null>(null);

  // Le compteur ne tourne que pendant une mesure, et s'arrête avec elle.
  useEffect(() => {
    if (etat.nom !== "mesure") return;
    const id = setInterval(() => setSecondes(Math.round((Date.now() - etat.depuis) / 1000)), 1000);
    return () => clearInterval(id);
  }, [etat]);

  useEffect(() => () => annulation.current?.abort(), []);

  async function tester(evenement: FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    const url = normaliser(saisie);
    if (!url) {
      setEtat({ nom: "erreur", message: textes.erreurs.adresse });
      return;
    }

    annulation.current?.abort();
    const controleur = new AbortController();
    annulation.current = controleur;
    const delai = setTimeout(() => controleur.abort(), 75_000);
    setSecondes(0);
    setEtat({ nom: "mesure", depuis: Date.now() });

    const parametres = new URLSearchParams({ url: url.href, strategy: "mobile", locale });
    for (const c of CATEGORIES) parametres.append("category", c);
    const cle = process.env.NEXT_PUBLIC_PSI_KEY;
    if (cle) parametres.set("key", cle);

    try {
      const reponse = await fetch(`${API}?${parametres}`, { signal: controleur.signal });
      if (!reponse.ok) throw new Error(String(reponse.status));
      const donnees = await reponse.json();
      const lh = donnees.lighthouseResult;
      if (!lh) throw new Error("sans résultat");
      const note = (c: Categorie) => {
        const score = lh.categories?.[c]?.score;
        return typeof score === "number" ? Math.round(score * 100) : null;
      };
      const finale: string = lh.finalDisplayedUrl ?? lh.finalUrl ?? url.href;
      setEtat({
        nom: "resultat",
        resultat: {
          hote: new URL(finale).hostname,
          notes: {
            performance: note("performance"),
            accessibility: note("accessibility"),
            "best-practices": note("best-practices"),
            seo: note("seo"),
          },
          lcp: lh.audits?.["largest-contentful-paint"]?.displayValue ?? null,
          cls: lh.audits?.["cumulative-layout-shift"]?.displayValue ?? null,
          https: finale.startsWith("https://"),
        },
      });
    } catch {
      if (annulation.current === controleur) {
        setEtat({ nom: "erreur", message: textes.erreurs.service, adresse: url.href });
      }
    } finally {
      clearTimeout(delai);
    }
  }

  const mesureEnCours = etat.nom === "mesure";
  const resultat = etat.nom === "resultat" ? etat.resultat : null;
  const toutBon =
    resultat !== null &&
    CATEGORIES.every((c) => (resultat.notes[c] ?? 0) >= 90);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-5">
        <h2 className="font-display text-ink text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
          {textes.titre}
        </h2>
        <p className="text-ink-secondary mt-4 max-w-(--content-max) text-lg leading-relaxed text-pretty">
          {textes.chapo}
        </p>

        <form onSubmit={tester} noValidate className="mt-8">
          <label htmlFor={id} className="text-ink text-sm font-medium">
            {textes.label}
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id={id}
              name="adresse"
              type="url"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              placeholder={textes.placeholder}
              aria-describedby={`${id}-note`}
              aria-invalid={etat.nom === "erreur" && etat.message === textes.erreurs.adresse}
              className="border-rule-strong bg-surface text-ink placeholder:text-ink-muted focus-visible:ring-signal min-w-0 flex-1 rounded-md border px-3.5 py-2.5 text-base focus-visible:ring-2 focus-visible:outline-none"
            />
            <Button
              type="submit"
              size="lg"
              disabled={mesureEnCours}
              className="rounded-md text-base active:translate-y-px"
            >
              {textes.bouton}
            </Button>
          </div>
          <p id={`${id}-note`} className="text-ink-muted mt-3 text-sm leading-relaxed text-pretty">
            {textes.viePrivee}
          </p>
        </form>
      </div>

      {/* Le bulletin. `aria-live` : la fin d'une mesure de trente secondes
          doit être annoncée, sinon un lecteur d'écran n'en saurait rien. */}
      <div
        aria-live="polite"
        aria-busy={mesureEnCours}
        className="bg-surface border-rule rounded-2xl border p-6 sm:p-8 lg:col-span-7"
      >
        {etat.nom === "erreur" ? (
          <div role="alert">
            <p className="text-signal-aa leading-relaxed text-pretty">{etat.message}</p>
            {/* Si Google refuse — quota sans clé, le plus souvent — le
                visiteur garde un moyen de faire le test : le même, sur le
                site de Google, l'adresse déjà remplie. */}
            {etat.adresse ? (
              <a
                href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(etat.adresse)}&form_factor=mobile`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink focus-visible:ring-signal mt-3 inline-flex items-center gap-1.5 rounded-sm font-medium underline decoration-1 underline-offset-4 hover:decoration-2 focus-visible:ring-2 focus-visible:outline-none"
              >
                {textes.lienGoogle} <ArrowRight aria-hidden className="size-4" />
              </a>
            ) : null}
          </div>
        ) : null}

        {mesureEnCours ? (
          <p className="text-ink flex items-baseline justify-between gap-4 leading-relaxed">
            <span>{textes.enCours}</span>
            <span className="text-ink-muted shrink-0 tabular-nums">{secondes}&nbsp;s</span>
          </p>
        ) : null}

        {resultat ? (
          <p className="text-ink-secondary text-sm">
            {textes.resultatPour}{" "}
            <span className="text-ink font-medium break-all">{resultat.hote}</span>
          </p>
        ) : null}

        {/* Les quatre notes. Avant la première mesure, des tirets : le
            bulletin montre sa forme, pas des chiffres inventés. */}
        <dl
          className={cn(
            "grid grid-cols-2 gap-x-6 gap-y-6",
            etat.nom !== "attente" ? "mt-6" : "",
            mesureEnCours ? "opacity-60" : "",
          )}
        >
          {CATEGORIES.map((c) => {
            const note = resultat?.notes[c] ?? null;
            const v = note === null ? null : verdict(note);
            return (
              <div key={c}>
                <dt className="text-ink-secondary text-sm">{textes.categories[c]}</dt>
                <dd className="mt-1">
                  <span
                    className={cn(
                      "font-display block text-4xl leading-none font-semibold tabular-nums sm:text-5xl",
                      v ? COULEUR[v] : "text-ink-muted",
                    )}
                  >
                    {note ?? "-"}
                  </span>
                  <span className="bg-rule mt-3 block h-1 overflow-hidden rounded-full">
                    <span
                      className={cn(
                        "block h-full origin-left rounded-full transition-transform duration-(--duration-slow) ease-(--ease-out)",
                        v ? BARRE[v] : "bg-transparent",
                      )}
                      style={{ transform: `scaleX(${(note ?? 0) / 100})` }}
                    />
                  </span>
                  <span className="text-ink-muted mt-1.5 block min-h-5 text-xs">
                    {v ? textes.verdicts[v] : null}
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>

        {resultat ? (
          <>
            <dl className="border-rule mt-6 border-t pt-4 text-sm">
              {[
                [textes.mesures.lcp, resultat.lcp],
                [textes.mesures.cls, resultat.cls],
                [textes.mesures.https, resultat.https ? textes.oui : textes.non],
              ].map(([cle, valeur]) => (
                <div key={cle} className="border-rule flex justify-between gap-4 border-b border-dashed py-2 last:border-0">
                  <dt className="text-ink-secondary">{cle}</dt>
                  <dd className="text-ink font-medium tabular-nums">{valeur ?? "-"}</dd>
                </div>
              ))}
            </dl>
            <p className="text-ink mt-6 leading-relaxed text-pretty">
              {toutBon ? textes.conclusionBon : textes.conclusionMoyen}
            </p>
            <Button asChild size="lg" className="mt-5 rounded-md text-base active:translate-y-px">
              <Link href={`/${locale}/contact`}>
                {textes.cta} <ArrowRight aria-hidden />
              </Link>
            </Button>
            <p className="text-ink-muted mt-5 text-xs">
              {textes.source} {textes.variation}
            </p>
          </>
        ) : etat.nom === "attente" ? (
          <p className="text-ink-muted mt-6 text-sm leading-relaxed">{textes.vide}</p>
        ) : null}
      </div>
    </div>
  );
}
