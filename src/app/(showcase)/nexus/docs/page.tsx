import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Code, Prose, Rule } from "./parts";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Installation, architecture, tokens, composants, animations, responsive, accessibilité et guide de création d'une page sur la base NEXUS UI.",
};

const SOMMAIRE = [
  ["installation", "Installation"],
  ["architecture", "Architecture"],
  ["tokens", "Design tokens"],
  ["marques", "Ajouter une marque"],
  ["composants", "Composants"],
  ["animations", "Animations"],
  ["responsive", "Responsive"],
  ["accessibilite", "Accessibilité"],
  ["performance", "Performance"],
  ["conventions", "Conventions de code"],
  ["nouvelle-page", "Créer une page"],
  ["contribution", "Contribution"],
] as const;

function Bloc({
  id,
  titre,
  children,
}: {
  id: string;
  titre: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-rule scroll-mt-20 border-t pt-8">
      <h2 className="font-display text-ink text-2xl font-semibold tracking-tight">
        {titre}
      </h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

export default function DocsPage() {
  return (
    <>
      <Section
        index="§9.8"
        title="Documentation"
        lead="Comment reprendre cette base pour un projet suivant. Ce document décrit ce qui existe réellement dans le dépôt, y compris les pièges qui ont coûté un cycle de correction — ils sont marqués comme tels."
      />

      <Container className="pb-24">
        <div className="grid gap-12 lg:grid-cols-[14rem_1fr] lg:gap-16">
          <nav aria-label="Sommaire" className="lg:sticky lg:top-20 lg:self-start">
            <p className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
              Sommaire
            </p>
            <ul className="mt-4 space-y-1">
              {SOMMAIRE.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-ink-secondary hover:text-ink focus-visible:ring-signal -mx-1 block rounded-xs px-1 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 space-y-12">
            <Bloc id="installation" titre="Installation">
              <Code>{`npm install
npm run dev      # développement
npm run build    # build de production
npm run start    # sert le build`}</Code>
              <Prose>
                Une seule variable d&apos;environnement est lue&nbsp;:
                <code className="font-mono text-sm"> NEXT_PUBLIC_SITE_URL</code>.
                Tant qu&apos;elle est absente, le site refuse d&apos;être indexé.
                Voir <code className="font-mono text-sm">.env.example</code>.
              </Prose>
              <Prose>Les trois contrôles se lancent séparément&nbsp;:</Prose>
              <Code>{`npm run typecheck      # TypeScript strict
npm run lint           # ESLint, doit sortir sans erreur NI avertissement
npm run verify:tokens  # motion.css et motion.ts sont-ils identiques ?
npm run verify         # navigateur : serveur devant déjà tourner`}</Code>
              <Rule>
                <code className="font-mono text-sm">npm run verify</code> charge
                chaque page aux neuf largeurs du §11, dans les deux thèmes, et
                échoue sur un débordement, un texte tronqué, une requête en 4xx,
                une cible tactile sous 24&nbsp;px, ou un texte laissé
                transparent alors qu&apos;il est visible. Un build vert ne
                remplace pas ce contrôle.
              </Rule>
            </Bloc>

            <Bloc id="architecture" titre="Architecture">
              <Prose>
                Le dépôt sert deux produits sur un seul déploiement. Les groupes
                de routes portent le chrome, la racine ne porte que les
                providers.
              </Prose>
              <Code>{`src/
├── app/
│   ├── layout.tsx          polices, thème, providers — rien d'autre
│   ├── page.tsx            / redirige vers /fr
│   ├── (sentis)/[locale]/  site de l'agence : /fr et /en
│   ├── (showcase)/nexus/   vitrine : /nexus et ses sous-pages
│   └── (app)/nexus/        enveloppe applicative : /nexus/dashboard
├── components/
│   ├── ui/                 primitives vendues (shadcn + Magic UI)
│   ├── layout/             Container, Section, en-têtes, pieds de page
│   ├── motion/             bibliothèque d'animations
│   ├── sections/           blocs composés de la vitrine
│   └── sentis/             chrome propre au site de l'agence
├── lib/                    nav, i18n, site, motion, stats, utils
└── styles/
    ├── tokens.css          couleur, espacement, rayon, ombre, grille
    ├── motion.css          durées, courbes, reduced-motion
    ├── scroll-driven.css   animations natives liées au scroll
    └── sentis.css          peau de la marque Studio Sentis`}</Code>
              <Rule>
                <code className="font-mono text-sm">sections/</code> consomme{" "}
                <code className="font-mono text-sm">ui/</code> et{" "}
                <code className="font-mono text-sm">layout/</code>, jamais
                l&apos;inverse. Une primitive qui importe un bloc composé
                devient impossible à réutiliser ailleurs.
              </Rule>
              <Rule tone="piege">
                Les imports entre pages d&apos;un même groupe de routes sont
                relatifs (<code className="font-mono text-sm">./demo</code>), pas
                aliasés. Un alias{" "}
                <code className="font-mono text-sm">@/app/(showcase)/…</code>{" "}
                casse dès qu&apos;on renomme le groupe, ce qui est arrivé.
              </Rule>
            </Bloc>

            <Bloc id="tokens" titre="Design tokens">
              <Prose>
                Toute valeur visuelle vit dans{" "}
                <code className="font-mono text-sm">src/styles/tokens.css</code>.
                Un composant ne contient jamais de couleur, de rayon ni
                d&apos;ombre en dur.
              </Prose>
              <Rule>
                Aucune couleur n&apos;entre dans les tokens sans avoir été
                mesurée. Chaque paire texte/surface passe au détecteur&nbsp;:
                <code className="font-mono text-sm">
                  {" "}
                  .claude/skills/impeccable/scripts/impeccable detect &lt;fichier&gt;
                </code>
                . Trois couleurs candidates ont été rejetées à ce stade.
              </Rule>
              <Rule>
                La palette de graphiques suit une règle différente et plus
                stricte&nbsp;: elle se valide avec le script du skill{" "}
                <code className="font-mono text-sm">dataviz</code>, qui vérifie
                la bande de clarté, le plancher de chroma, la séparation
                daltonienne et le contraste. La palette d&apos;origine du projet
                échouait trois de ces cinq contrôles.
              </Rule>
              <Rule tone="piege">
                <code className="font-mono text-sm">--content-max</code> est en{" "}
                <code className="font-mono text-sm">ch</code>&nbsp;: l&apos;unité
                se résout sur la police de l&apos;élément qui porte la classe. À
                poser sur le texte lui-même, jamais sur un conteneur dont la
                taille de police diffère.
              </Rule>
            </Bloc>

            <Bloc id="marques" titre="Ajouter une marque">
              <Prose>
                Le site de l&apos;agence est la démonstration que la base sert à
                autre chose qu&apos;elle-même&nbsp;: même architecture de tokens,
                mêmes composants, autre identité. Trois étapes.
              </Prose>
              <Code>{`/* 1. src/styles/<marque>.css — redéfinir les MÊMES noms de tokens */
[data-brand="sentis"] {
  --paper: #fcfaf6;
  --ink: #1a1714;
  --radius: 0.625rem;
  --content-max: 58ch;
}
.dark [data-brand="sentis"] { /* … */ }

/* 2. l'importer dans src/app/globals.css */
@import "../styles/sentis.css";`}</Code>
              <Code>{`// 3. poser l'attribut sur le layout de la marque
<div data-brand="sentis" className={\`\${police.variable} bg-paper text-ink\`}>
  {children}
</div>`}</Code>
              <Rule>
                Redéfinir les tokens existants, jamais en inventer de nouveaux
                pour une marque. Un token propre à une marque ne serait pas lu
                par les composants partagés, et la peau cesserait d&apos;être
                interchangeable.
              </Rule>
            </Bloc>

            <Bloc id="composants" titre="Composants">
              <Prose>
                <code className="font-mono text-sm">src/components/ui/</code>{" "}
                n&apos;est pas écrit à la main&nbsp;: il est peuplé par{" "}
                <code className="font-mono text-sm">npx shadcn@latest add</code>.
                Le modifier signifie qu&apos;une mise à jour du registre
                écrasera le travail.
              </Prose>
              <Rule>
                Une correction dans un composant vendu est permise, mais son
                commentaire doit dire pourquoi. Trois cas existent dans le
                dépôt&nbsp;: un dégradé violet codé en dur, un{" "}
                <code className="font-mono text-sm">setState</code> dans un
                effet, et un compteur rendu à zéro côté serveur.
              </Rule>
              <Rule>
                Un composant qui n&apos;est utilisé nulle part est retiré, pas
                gardé au cas où. Quatre l&apos;ont été&nbsp;: deux pour des
                défauts réels (<code className="font-mono text-sm">Math.random()</code>{" "}
                pendant le rendu, <code className="font-mono text-sm">setState</code>{" "}
                dans un effet), deux parce que rien ne s&apos;en servait.
              </Rule>
            </Bloc>

            <Bloc id="animations" titre="Animations">
              <Prose>
                Durées, courbes, décalages et distances viennent de{" "}
                <code className="font-mono text-sm">motion.css</code>, dont{" "}
                <code className="font-mono text-sm">src/lib/motion.ts</code> est
                le miroir pour Motion, qui a besoin de nombres.{" "}
                <code className="font-mono text-sm">npm run verify:tokens</code>{" "}
                échoue si les deux divergent.
              </Prose>
              <Rule>
                <code className="font-mono text-sm">prefers-reduced-motion</code>{" "}
                est traité une fois, globalement. Un composant ne rend jamais une
                version raccourcie de son animation&nbsp;: il rend l&apos;état
                final.
              </Rule>
              <Rule tone="piege">
                Une plage <code className="font-mono text-sm">useTransform</code>{" "}
                liée au scroll doit tenir dans [0, 1]. Motion confie ces valeurs
                à l&apos;API d&apos;animation du navigateur, qui refuse un offset
                négatif ou supérieur à 1 et lève une erreur à chaque chargement.
              </Rule>
              <Rule tone="piege">
                L&apos;opacité n&apos;est pas un signal d&apos;état pour du
                texte. Atténuer un bloc à{" "}
                <code className="font-mono text-sm">opacity: 0.35</code> fait
                tomber son texte à 1,8:1. Le signal passe par un filet, une
                couleur d&apos;accent ou une bordure.
              </Rule>
            </Bloc>

            <Bloc id="responsive" titre="Responsive">
              <Prose>
                Neuf largeurs sont vérifiées&nbsp;: 320, 375, 390, 430, 768,
                834, 1024, 1280 et 1440&nbsp;px, dans les deux thèmes.{" "}
                <code className="font-mono text-sm">Container</code> porte la
                gouttière unique du projet&nbsp;; c&apos;est lui qui garantit que
                rien ne touche le bord de l&apos;écran.
              </Prose>
              <Rule tone="piege">
                Un élément de grille hérite de{" "}
                <code className="font-mono text-sm">min-width: auto</code>&nbsp;:
                un tableau imposait sa largeur minimale à toute la piste, donc à
                toutes les cartes de la même rangée.{" "}
                <code className="font-mono text-sm">min-w-0</code> sur
                l&apos;élément de grille est le correctif.
              </Rule>
              <Rule tone="piege">
                Un point de rupture est une largeur réelle à tester. À
                exactement 768&nbsp;px, l&apos;en-tête affichait la navigation
                desktop complète pour 822&nbsp;px de contenu.
              </Rule>
            </Bloc>

            <Bloc id="accessibilite" titre="Accessibilité">
              <Prose>
                Ce qui est vérifié automatiquement&nbsp;: contraste des tokens,
                cibles tactiles d&apos;au moins 24&nbsp;px, absence de texte
                transparent dans le viewport, comportement sous mouvement
                réduit, absence d&apos;erreur de console.
              </Prose>
              <Rule>
                Les primitives viennent de Radix&nbsp;: comportement clavier,
                gestion du focus et rôles ARIA sont fournis, pas
                réimplémentés. Un composant maison qui remplace une primitive
                doit reprendre le motif ARIA correspondant.
              </Rule>
              <Rule>
                Une seule exemption est assumée&nbsp;: le contraste d&apos;un
                contrôle désactivé. WCAG&nbsp;1.4.3 exclut explicitement les
                composants d&apos;interface inactifs, et le contrôle automatique
                les ignore pour cette raison.
              </Rule>
            </Bloc>

            <Bloc id="performance" titre="Performance">
              <Prose>
                Toutes les pages sont statiques. GSAP, Lenis et Three.js ne sont
                pas installés&nbsp;: les sections épinglées reposent sur{" "}
                <code className="font-mono text-sm">position: sticky</code> et le
                scroll horizontal sur{" "}
                <code className="font-mono text-sm">scroll-snap</code> natif.
              </Prose>
              <Rule tone="piege">
                Un accès disque dans un composant serveur doit utiliser des
                chemins <strong>littéraux</strong>. Un chemin construit
                dynamiquement empêche l&apos;analyse statique et fait tracer tout
                le projet, dossier <code className="font-mono text-sm">public/</code>{" "}
                compris, dans le bundle serveur.
              </Rule>
            </Bloc>

            <Bloc id="conventions" titre="Conventions de code">
              <Prose>
                TypeScript strict, aucun{" "}
                <code className="font-mono text-sm">any</code>. Composants
                serveur par défaut&nbsp;;{" "}
                <code className="font-mono text-sm">&quot;use client&quot;</code>{" "}
                seulement pour un état, un écouteur ou une API navigateur.
              </Prose>
              <Rule>
                <code className="font-mono text-sm">npm run lint</code> doit
                sortir sans erreur <em>ni avertissement</em>. La règle{" "}
                <code className="font-mono text-sm">react-hooks</code> interdit{" "}
                <code className="font-mono text-sm">setState</code> dans un
                effet&nbsp;: le remplaçant est{" "}
                <code className="font-mono text-sm">useSyncExternalStore</code>,
                utilisé à deux endroits du dépôt.
              </Rule>
              <Rule>
                Les commentaires expliquent <em>pourquoi</em>, pas quoi. Un
                commentaire qui paraphrase la ligne suivante est du bruit&nbsp;;
                un commentaire qui explique une contrainte évite qu&apos;on la
                casse.
              </Rule>
            </Bloc>

            <Bloc id="nouvelle-page" titre="Créer une page">
              <Code>{`1. src/app/(showcase)/nexus/<nom>/page.tsx
   export const metadata = { title, description }

2. Structure : <Section index title lead> pour chaque bloc.
   La gouttière vient de Container, jamais d'un padding local.

3. Partie interactive dans un fichier voisin en "use client",
   importé relativement (./panels), pas via un alias.

4. src/lib/nav.ts : ajouter l'entrée, status "planned" puis "live".
   Le site affiche l'état réel — une page annoncée finie ne l'est pas
   tant que l'entrée n'est pas passée à "live".

5. tests/responsive-check.mjs : ajouter la route à PAGES.

6. npm run lint && npm run typecheck && npm run build
   npm run start &  puis  npm run verify`}</Code>
              <Rule>
                Étape 5 non facultative. Une page absente du contrôle est une
                page dont personne ne saura qu&apos;elle déborde à 320&nbsp;px.
              </Rule>
            </Bloc>

            <Bloc id="contribution" titre="Contribution">
              <Prose>
                L&apos;état réel du projet, ce qui reste ouvert et ce qui a été
                assumé sont dans{" "}
                <Link
                  href="/nexus"
                  className="text-signal-aa underline underline-offset-4"
                >
                  la vitrine
                </Link>{" "}
                et dans les documents du dépôt&nbsp;:{" "}
                <code className="font-mono text-sm">docs/audit.md</code>,{" "}
                <code className="font-mono text-sm">docs/architecture.md</code>{" "}
                et{" "}
                <code className="font-mono text-sm">docs/quality-checklist.md</code>.
              </Prose>
              <Rule>
                Un travail n&apos;est pas terminé parce que le code compile. Le
                cahier des charges le dit, et trois défauts de ce projet
                l&apos;ont confirmé&nbsp;: un titre invisible sans JavaScript,
                des compteurs rendus à zéro, et un dégradé violet en haut de
                chaque page. Aucun n&apos;a été signalé par le build.
              </Rule>
            </Bloc>
          </div>
        </div>
      </Container>
    </>
  );
}
