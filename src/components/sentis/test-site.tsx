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
 * l'adresse, et la politique de confidentialité le dit.
 *
 * **Sans clé, ce bloc ne peut pas mesurer — jamais, pas « aux heures
 * chargées ».** C'est ce que disait la version précédente, et c'était faux :
 * les appels sans clé ne sont pas comptés par appelant, ils tombent tous dans
 * un seul projet anonyme partagé par le monde entier, dont le quota du jour
 * est épuisé en permanence. Mesuré sur le site en ligne : `429 Quota
 * exceeded … consumer 'project_number:583797351490'`, à chaque essai.
 *
 * D'où les deux modes de ce bloc, décidés à la compilation :
 *
 * - **Avec `NEXT_PUBLIC_PSI_KEY`** — la mesure se fait ici, et le bulletin
 *   s'affiche. La clé est publique par nature ; restreinte au domaine et à
 *   cette seule API, elle ne donne accès à rien d'autre.
 * - **Sans clé** — le bloc ne fait plus semblant. Le bouton mène directement
 *   au même test sur le site de Google, l'adresse déjà remplie, et le panneau
 *   de droite explique ce que le test dira. Faire patienter trente secondes
 *   pour afficher une erreur garantie, c'est pire que ne rien proposer.
 *
 * Une mesure prend vingt à quarante secondes. Le bloc affiche le temps écoulé
 * pendant l'attente : une attente qu'on voit avancer se supporte, une roue qui
 * tourne sans fin se quitte.
 */

const API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

/** Inlinée à la compilation : sa présence décide du mode du bloc. */
const CLE = process.env.NEXT_PUBLIC_PSI_KEY;
const MESURE_ICI = Boolean(CLE);

/**
 * Le même test, sur le site de Google, l'adresse déjà remplie.
 *
 * Champ vide ou adresse invalide : on envoie à l'accueil de l'outil, où le
 * visiteur tapera son adresse. Un `?url=` vide y afficherait un formulaire en
 * erreur, ce qui ressemble à une panne du lien.
 */
const surGoogle = (adresse: string | null) =>
  adresse
    ? `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(adresse)}&form_factor=mobile`
    : "https://pagespeed.web.dev/";
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

/** 429 : notre quota, pas le site du visiteur. Le distinguer n'est pas un
    détail de formulation — l'ancien message lui disait que son site était
    peut-être inaccessible, ce qui est faux et inquiète pour rien. */
function messageErreur(statut: number | null, textes: Dict["testSite"]) {
  return statut === 429 ? textes.erreurs.quota : textes.erreurs.service;
}

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

    // Sans clé, rien à tenter : le lien du bouton mène déjà chez Google. Ce
    // chemin ne sert qu'au clavier, quand « Entrée » valide le formulaire.
    if (!MESURE_ICI) {
      window.open(surGoogle(url.href), "_blank", "noopener,noreferrer");
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

    let statut: number | null = null;
    try {
      const reponse = await fetch(`${API}?${parametres}`, { signal: controleur.signal });
      statut = reponse.status;
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
        setEtat({
          nom: "erreur",
          message: messageErreur(statut, textes),
          adresse: url.href,
        });
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
            {MESURE_ICI ? (
              <Button
                type="submit"
                size="lg"
                disabled={mesureEnCours}
                className="rounded-md text-base active:translate-y-px"
              >
                {textes.bouton}
              </Button>
            ) : (
              /* Un vrai lien, et non un bouton qui ouvrirait une fenêtre :
                 `window.open` après une saisie passe pour une pop-up et se
                 fait bloquer. Le lien, lui, s'ouvre toujours, se copie, et
                 fonctionne au clic du milieu. */
              <Button
                asChild
                size="lg"
                className="rounded-md text-base active:translate-y-px"
              >
                <a
                  href={surGoogle(normaliser(saisie)?.href ?? null)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {textes.boutonGoogle} <ArrowRight aria-hidden />
                </a>
              </Button>
            )}
          </div>
          <p id={`${id}-note`} className="text-ink-muted mt-3 text-sm leading-relaxed text-pretty">
            {MESURE_ICI ? textes.viePrivee : textes.surGoogle}
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
        {/* Sans clé, le bulletin resterait vide pour toujours : quatre tirets
            qui promettent des chiffres qui ne viendront pas. À la place, ce
            que le test dira — le visiteur sait alors pourquoi cliquer. */}
        {!MESURE_ICI ? (
          <>
            <h3 className="font-display text-ink text-xl leading-tight font-semibold tracking-tight">
              {textes.panneauTitre}
            </h3>
            <p className="text-ink-secondary mt-2 text-sm leading-relaxed">
              {textes.panneauChapo}
            </p>
            <dl className="mt-6 space-y-4">
              {CATEGORIES.map((c) => (
                <div key={c} className="border-rule border-b border-dashed pb-4 last:border-0 last:pb-0">
                  <dt className="text-ink font-medium">{textes.categories[c]}</dt>
                  <dd className="text-ink-secondary mt-1 text-sm leading-relaxed text-pretty">
                    {textes.panneauExplications[c]}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-ink-muted mt-6 text-xs">
              {textes.source} {textes.variation}
            </p>
          </>
        ) : null}
        {MESURE_ICI && etat.nom === "erreur" ? (
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

        {MESURE_ICI && mesureEnCours ? (
          <p className="text-ink flex items-baseline justify-between gap-4 leading-relaxed">
            <span>{textes.enCours}</span>
            <span className="text-ink-muted shrink-0 tabular-nums">{secondes}&nbsp;s</span>
          </p>
        ) : null}

        {MESURE_ICI && resultat ? (
          <p className="text-ink-secondary text-sm">
            {textes.resultatPour}{" "}
            <span className="text-ink font-medium break-all">{resultat.hote}</span>
          </p>
        ) : null}

        {/* Les quatre notes. Avant la première mesure, des tirets : le
            bulletin montre sa forme, pas des chiffres inventés. */}
        {MESURE_ICI ? (
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
        ) : null}

        {MESURE_ICI && resultat ? (
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
        ) : MESURE_ICI && etat.nom === "attente" ? (
          <p className="text-ink-muted mt-6 text-sm leading-relaxed">{textes.vide}</p>
        ) : null}
      </div>
    </div>
  );
}
