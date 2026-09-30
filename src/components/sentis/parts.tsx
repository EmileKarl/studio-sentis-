import type { ReactNode } from "react";

import { Reveal3D, type Variante3D } from "@/components/motion";
import { Scene3DDifferee } from "@/components/motion/differe";

import { cn } from "@/lib/utils";

/** Conteneur et rythme communs à toutes les pages du site. */
export function Zone({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-(--container-page) px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/**
 * Fonds de section.
 *
 * Le site n'avait que deux fonds, crème et sable : juste, mais monotone sur
 * cinq pages. Ces teintes très pâles donnent une couleur propre à chaque
 * section. Elles sont définies et mesurées dans `src/styles/sentis.css`, et
 * `npm run verify:teintes` refuse toute valeur qui ferait passer une couleur de
 * texte sous 4,5:1.
 */
const FONDS = {
  paper: "",
  sand: "bg-surface-2 border-rule border-y",
  bleu: "bg-teinte-bleu border-rule border-y",
  cyan: "bg-teinte-cyan border-rule border-y",
  violet: "bg-teinte-violet border-rule border-y",
  vert: "bg-teinte-vert border-rule border-y",
} as const;

export type Fond = keyof typeof FONDS;

export function Section({
  id,
  titre,
  chapo,
  tone = "paper",
  children,
}: {
  id?: string;
  titre?: string;
  chapo?: string;
  tone?: Fond;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", FONDS[tone])}>
      <Zone>
        {titre ? (
          <header className="mb-12 max-w-(--content-max)">
            <h2 className="font-display text-ink text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
              {titre}
            </h2>
            {chapo ? (
              <p className="text-ink-secondary mt-4 text-lg leading-relaxed text-pretty">
                {chapo}
              </p>
            ) : null}
          </header>
        ) : null}
        {children}
      </Zone>
    </section>
  );
}

/**
 * Le volume de chaque page, et sa couleur.
 *
 * La scène sait mélanger trois couleurs, réparties sur la graine de chaque
 * sommet (voir `scene-3d.tsx`). Une page qui ne pose que `text-*` reste
 * monochrome ; celle qui pose en plus `--scene-2` et `--scene-3` obtient un
 * dégradé qui traverse le nuage.
 *
 * **À propos** et **Réalisations** en profitent ; l'accueil et Contact gardent
 * leur couleur unique. Ce n'est pas une inconséquence : la couleur dominante
 * reste celle de la page — cyan pour Services, violet pour Réalisations — et
 * c'est elle qui dit qu'on a changé de page avant d'avoir lu le titre. Le
 * dégradé ne fait que l'enrichir.
 */
const MASQUE =
  "[mask-image:radial-gradient(ellipse_at_80%_50%,white,transparent_72%)]";

/**
 * Opacité par volume.
 *
 * Elle n'est pas uniforme parce que les volumes ne se valent pas à l'écran :
 * `poussiere` n'a **aucune arête**, seulement des points, et le moteur
 * applique aux points un facteur 0,62 que les lignes n'ont pas. À opacité
 * égale, la poussière sortait donc à 0,37 quand le treillis sortait à 0,60 —
 * c'est ce qui la rendait presque invisible, et ce que le client a vu.
 *
 * Le plafond n'est pas choisi à l'œil : `npm run verify:scene` mesure le
 * contraste du texte devant chaque scène, en 1280 et en 390 px, dans les deux
 * thèmes, et refuse toute valeur qui ferait passer un texte sous 4,5:1.
 */
const ALPHA_SCENE: Record<Variante3D, number> = {
  treillis: 0.6,
  anneau: 0.6,
  poussiere: 1,
  onde: 0.6,
  helice: 0.6,
  // Comme la poussière, la constellation est surtout faite de points, et le
  // moteur leur applique un facteur que les lignes n'ont pas.
  constellation: 0.85,
};

const COULEUR_SCENE: Record<Variante3D, string> = {
  treillis: `text-accent-violet ${MASQUE}`,
  anneau: `text-accent-cyan ${MASQUE}`,
  // Vert → cyan → violet : l'olive part du plus proche du papier et le dégradé
  // l'emmène vers les deux teintes les plus franches de la palette.
  poussiere: `text-accent-vert [--scene-2:var(--accent-cyan)] [--scene-3:var(--accent-violet)] ${MASQUE}`,
  onde: `text-accent-bleu ${MASQUE}`,
  // Services garde son cyan et Réalisations son violet : les volumes changent,
  // la couleur de la page ne bouge pas. C'est elle qui dit qu'on a changé de
  // page avant d'avoir lu le titre.
  helice: `text-accent-cyan ${MASQUE}`,
  constellation: `text-accent-violet [--scene-2:var(--accent-bleu)] [--scene-3:var(--accent-cyan)] ${MASQUE}`,
};

/**
 * En-tête de page intérieure : plus court qu'un héros, mais pas plat.
 *
 * Pas de surtitre en capitales au-dessus du h1 : il répétait le titre mot pour
 * mot (« Réalisations » au-dessus de « Réalisations ») et l'état actif du menu
 * dit déjà où l'on se trouve.
 */
export function EnTetePage({
  titre,
  chapo,
  scene,
}: {
  titre: string;
  chapo?: string;
  /**
   * Chaque page intérieure a son volume : c'est ce qui fait qu'on sait avoir
   * changé de page avant même d'avoir lu le titre.
   */
  scene?: Variante3D;
}) {
  return (
    <section className="border-rule relative overflow-hidden border-b py-16 sm:py-24">
      {scene ? (
        <Scene3DDifferee
          variante={scene}
          // Une couleur par volume, donc une par page : c'est ce qui fait
          // qu'on sait avoir changé de page avant d'avoir lu le titre.
          // La scène lit sa couleur sur son propre style calculé, il suffit
          // donc de lui donner la classe du token.
          className={COULEUR_SCENE[scene]}
          alpha={ALPHA_SCENE[scene]}
          decalage={0.42}
          zoom={0.82}
          scroll={0.45}
        />
      ) : null}
      <Zone className="relative">
        <Reveal3D depuis="bas" distance={80} angle={10}>
          <h1 className="font-display text-ink max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
            {titre}
          </h1>
        </Reveal3D>
        {chapo ? (
          <p className="text-ink-secondary mt-6 max-w-(--content-max) text-lg leading-relaxed text-pretty">
            {chapo}
          </p>
        ) : null}
      </Zone>
    </section>
  );
}

/** Panneau plein écran d'une séquence horizontale, aux couleurs de Sentis. */
export function PanneauSentis({
  tone = "paper",
  titre,
  corps,
}: {
  tone?:
    | Fond
    | "ink"
    | "signal"
    | "bleuPlein"
    | "cyanPlein"
    | "violetPlein"
    | "vertPlein";
  titre: string;
  corps: string;
}) {
  // Les deux fonds soutenus renversent le texte ; les teintes pâles le gardent
  // en encre, exactement comme le reste du site.
  const soutenu =
    tone === "ink" || tone === "signal" || String(tone).endsWith("Plein");
  const fondsPanneau: Record<string, string> = {
    ink: "bg-ink text-paper",
    signal: "bg-signal-aa text-white",
    paper: "bg-paper text-ink",
    sand: "bg-surface-2 text-ink",
    bleu: "bg-teinte-bleu text-ink",
    cyan: "bg-teinte-cyan text-ink",
    violet: "bg-teinte-violet text-ink",
    vert: "bg-teinte-vert text-ink",
    // Les aplats : le texte y passe sur `--accent-contrast`, qui bascule du
    // blanc au presque-noir selon le thème. Écrire `text-white` en dur aurait
    // donné 1,8:1 en thème sombre.
    bleuPlein: "bg-accent-bleu text-accent-contrast",
    cyanPlein: "bg-accent-cyan text-accent-contrast",
    violetPlein: "bg-accent-violet text-accent-contrast",
    vertPlein: "bg-accent-vert text-accent-contrast",
  };
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col justify-center px-6 sm:px-12 lg:px-20",
        fondsPanneau[tone],
      )}
    >
      <h2
        className={cn(
          "font-display max-w-[15ch] text-4xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl",
          soutenu ? "text-inherit" : "text-ink",
        )}
      >
        {titre}
      </h2>
      <p
        className={cn(
          "mt-7 max-w-[40ch] text-base leading-relaxed text-pretty sm:text-lg",
          soutenu ? "text-inherit" : "text-ink-secondary",
        )}
      >
        {corps}
      </p>
    </div>
  );
}
