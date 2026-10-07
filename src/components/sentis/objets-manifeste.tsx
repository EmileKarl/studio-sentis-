"use client";

import { useEffect, useId, useRef, useState } from "react";

import { useMinute } from "@/components/sentis/temoin-heure";
import { ajouterJoursOuvrables, formaterJour, heureAuStudio, jourAuStudio } from "@/lib/dates";
import type { Dict, Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Les objets posés sur les photos du manifeste.
 *
 * Chaque panneau dit une promesse ; son objet la **montre**, avec les chiffres
 * réels du site plutôt qu'avec une illustration :
 *
 *   Le prix. La date.        un devis : on choisit, le prix et la date suivent
 *   Une seule personne       un fil : Logo, Site, Application, Suivi, une main
 *   Le site vous appartient  un titre : on tape le nom de son commerce
 *   Châteauguay              l'heure qu'il est là-bas, maintenant
 *
 * Ils sont posés sur une photo sombre dans les deux thèmes ; leurs couleurs
 * fixes (`#f8f5f2`, `#f8ed43`) sont celles de la planche et du livre de Wada,
 * pas des jetons qui basculeraient au thème sombre.
 */

const CARTE =
  "temoin-objet bg-surface text-ink w-full max-w-[19rem] rounded-md border border-white/10 p-5 sm:max-w-none sm:w-[21rem]";

/**
 * La plaque des objets écrits en clair (le fil, l'horloge). Ils sont posés à
 * droite, là où le voile s'efface pour laisser voir la photo — sur un ciel,
 * une fenêtre. Sans plaque, du texte clair sur un ciel clair. Une plaque
 * sombre et unie, sans flou : elle sert la lecture, pas l'effet.
 */
const PLAQUE = "rounded-xl bg-[rgb(18_19_20/0.74)] px-5 py-5 sm:px-6";

type Forfait = Dict["prix"]["forfaits"][number];

/* ------------------------------------------------------------------------ */

/** « Le prix. La date. » — un devis qui se calcule pendant qu'on choisit. */
export function ObjetDevis({
  locale,
  textes,
  forfaits,
}: {
  locale: Locale;
  textes: Dict["pages"]["accueil"]["objets"]["devis"];
  forfaits: readonly Forfait[];
}) {
  const [cle, setCle] = useState(forfaits[1]?.cle ?? forfaits[0]?.cle);
  const maintenant = useMinute();
  const forfait = forfaits.find((f) => f.cle === cle) ?? forfaits[0];
  const date =
    maintenant === null
      ? null
      : formaterJour(ajouterJoursOuvrables(jourAuStudio(maintenant), forfait.jours), locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
        });

  return (
    <figure className={CARTE}>
      <p className="font-display text-base font-semibold">{textes.titre}</p>
      <div role="group" aria-label={textes.choix} className="mt-3 flex flex-wrap gap-1.5">
        {forfaits.map((f) => (
          <button
            key={f.cle}
            type="button"
            aria-pressed={f.cle === cle}
            onClick={() => setCle(f.cle)}
            className={cn(
              "focus-visible:ring-signal rounded-full border px-3 py-1.5 text-sm transition-colors duration-(--duration-fast) ease-(--ease-out) focus-visible:ring-2 focus-visible:outline-none active:translate-y-px",
              f.cle === cle
                ? "border-ink bg-ink text-paper"
                : "border-rule-strong text-ink-secondary hover:border-ink hover:text-ink",
            )}
          >
            {f.nom}
          </button>
        ))}
      </div>
      {/* Le prix et la date changent ensemble : une seule annonce polie
          pour les deux, pas deux qui se marchent dessus. */}
      <div aria-live="polite" className="border-rule mt-4 flex items-end justify-between gap-4 border-t border-dashed pt-4">
        <p className="font-display text-3xl leading-none font-semibold tabular-nums">{forfait.prix}</p>
        <p className="text-right text-sm leading-snug">
          <span className="text-ink-secondary block">{textes.livre}</span>
          <span className="text-accent-vert block min-h-5 font-semibold">{date}</span>
        </p>
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * « Une seule personne, du logo à l'application » — un fil, un seul point
 * qui le parcourt.
 *
 * Le point part une fois, quand le panneau arrive dans le champ, et s'arrête
 * au bout : il raconte un trajet, pas une attente. Aucune boucle, donc rien à
 * mettre en pause (WCAG 2.2.2). Sous `prefers-reduced-motion`, la règle
 * globale ramène les durées à zéro : le point est déjà au bout, tout est
 * allumé.
 *
 * `IntersectionObserver` voit bien le panneau arriver alors qu'il glisse par
 * une transformation : il mesure la géométrie rendue, transformations
 * comprises.
 */
export function ObjetFil({ textes }: { textes: Dict["pages"]["accueil"]["objets"]["fil"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [parti, setParti] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (!entree.isIntersecting) return;
        setParti(true);
        observateur.disconnect();
      },
      { threshold: 0.6 },
    );
    observateur.observe(element);
    return () => observateur.disconnect();
  }, []);

  const n = textes.etapes.length;

  return (
    <div ref={ref} data-parti={parti} className={cn("group/fil w-full max-w-[19rem] sm:max-w-none sm:w-[26rem]", PLAQUE)}>
      <div aria-hidden className="relative h-20">
        <span className="absolute top-1/2 right-2 left-2 h-px bg-[#f8f5f2]/35" />
        {/* Le trait parcouru, qui suit le point. */}
        <span className="absolute top-1/2 left-2 h-0.5 w-[calc(100%-1rem)] origin-left -translate-y-px scale-x-0 bg-[#f8ed43] transition-transform duration-[2400ms] ease-(--ease-in-out) group-data-[parti=true]/fil:scale-x-100" />
        <ol className="absolute inset-0 flex items-center justify-between">
          {textes.etapes.map((etape, i) => (
            <li key={etape} className="relative flex flex-col items-center">
              <span
                style={{ transitionDelay: `${(i / (n - 1)) * 2400}ms` }}
                className="block size-3.5 rounded-full border-2 border-[#f8f5f2] bg-[#121314] transition-colors duration-(--duration-base) group-data-[parti=true]/fil:border-[#f8ed43] group-data-[parti=true]/fil:bg-[#f8ed43]"
              />
              <span className="absolute top-6 text-sm font-medium whitespace-nowrap text-[#f8f5f2]">
                {etape}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-6 text-sm text-[#f8f5f2]/88">{textes.legende}</p>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

/** Un nom de commerce en nom de domaine plausible, pour l'exemple seulement. */
function enDomaine(nom: string): string {
  const base = nom
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "et")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${base || "votre-commerce"}.ca`;
}

/**
 * « Le site vous appartient » — un titre de propriété qu'on remplit soi-même.
 *
 * C'est le seul objet qui demande quelque chose au visiteur, et c'est voulu :
 * lire « vous êtes propriétaire » et voir son propre nom écrit dans la case
 * ne produisent pas le même effet. Rien n'est envoyé nulle part ; le champ
 * vit dans la page et s'oublie en la quittant. La note dit que le domaine est
 * un exemple : promettre qu'un nom est libre sans l'avoir vérifié serait
 * exactement le genre de promesse que ce site s'interdit.
 */
export function ObjetTitre({ textes }: { textes: Dict["pages"]["accueil"]["objets"]["titre"] }) {
  const id = useId();
  const [nom, setNom] = useState("");
  const domaine = enDomaine(nom.trim() || textes.exemple);

  return (
    <figure className={CARTE}>
      <label htmlFor={id} className="text-sm font-medium">
        {textes.label}
      </label>
      <input
        id={id}
        type="text"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder={textes.exemple}
        maxLength={60}
        autoComplete="organization"
        spellCheck={false}
        className="border-rule-strong bg-paper text-ink placeholder:text-ink-muted focus-visible:ring-signal mt-2 w-full rounded-md border px-3 py-2 text-base focus-visible:ring-2 focus-visible:outline-none"
      />
      <dl className="mt-4 text-sm">
        <div className="border-rule flex items-baseline justify-between gap-4 border-b border-dashed py-2">
          <dt className="text-ink-secondary shrink-0">{textes.domaine}</dt>
          <dd className="min-w-0 truncate font-medium">{domaine}</dd>
        </div>
        <div className="border-rule flex items-baseline justify-between gap-4 border-b border-dashed py-2">
          <dt className="text-ink-secondary">{textes.proprietaire}</dt>
          <dd className="text-accent-vert font-semibold">{textes.vous}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-2">
          <dt className="text-ink-secondary">{textes.code}</dt>
          <dd className="text-accent-vert font-semibold">{textes.aVous}</dd>
        </div>
      </dl>
      <figcaption className="text-ink-muted mt-2 text-xs leading-relaxed">{textes.note}</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------------ */

/** « Châteauguay. On peut se rencontrer. » — l'heure qu'il est là-bas. */
export function ObjetHorloge({
  locale,
  textes,
}: {
  locale: Locale;
  textes: Dict["pages"]["accueil"]["objets"]["horloge"];
}) {
  const maintenant = useMinute();
  const heure = maintenant === null ? null : heureAuStudio(maintenant, locale);

  return (
    <div className={cn("text-[#f8f5f2] lg:text-right", PLAQUE)}>
      {/* L'heure change seule : hors de l'arbre d'accessibilité, comme sur
          le reçu de la page Contact. */}
      <p aria-hidden className="min-h-[4.5rem]">
        <span className="font-display block text-6xl leading-none font-semibold tracking-tight whitespace-nowrap tabular-nums sm:text-7xl">
          {heure}
        </span>
        <span className="mt-2 block text-sm text-[#f8f5f2]/88">{heure ? textes.heure : null}</span>
      </p>
      <p className="mt-6 text-base font-medium">{textes.lieux}</p>
      <p className="mt-1 text-sm text-[#f8f5f2]/88">{textes.rencontre}</p>
    </div>
  );
}
