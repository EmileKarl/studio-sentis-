# Rapport d'audit — NEXUS UI et site Studio Sentis

Établi selon le §13 phase 14 : comparaison du projet au cahier des charges.
Portée auditée : les dix-sept pages construites — le site de l'agence sur cinq
pages en deux langues (`/fr`, `/fr/services`, `/fr/realisations`,
`/fr/a-propos`, `/fr/contact`, et leurs équivalents `/en`), plus `/nexus` et
ses six sous-pages pour la vitrine.

## 1. Ce qui est terminé

| Exigence | État |
| --- | --- |
| §4 Stack (Next.js, React, TypeScript, Tailwind, shadcn/ui, Lucide) | Faite |
| §5 Design system (couleurs, typo, espacements, rayons, ombres, grille, motion) | Faite — 141 tokens, 31 tokens de motion |
| §6 Bibliothèque de composants | Partielle — 38 primitives installées, catégories Contenu et Data display incomplètes |
| §9.1 Landing | Faite |
| §9.2 Design System | Faite |
| §9.3 Composants | Faite pour les familles couvertes |
| §9.4 Motion Lab | Faite |
| §6.7 Composants de motion | Faite — Reveal, Stagger, TextReveal, Parallax, Magnetic, TiltCard, CursorFollow, PinnedSequence, HorizontalRail, Counter, transition de page |
| §7 Architecture des animations | Faite sauf séquences GSAP |
| §9.5 Gallery | Faite |
| §9.6 Dashboard | Faite |
| §9.8 Documentation | Faite |
| Défilement alterné (hors cahier des charges, demandé par le client) | Fait |
| §9.7 Settings | **Écartée.** Elle démontrerait des formulaires et des préférences que la page Composants montre déjà ; le temps est allé au site de l'agence, qui ouvre la porte commerciale. |
| §3.1 G Patterns | Faite — quatre trames SVG en currentColor |
| §3.1 H Grilles et compositions | Faite — cinq compositions, recomposition animée |
| §10 Clair / sombre / système, avec persistance | Faite |
| §11 Responsive sur les 9 largeurs | Faite et vérifiée |
| §12 Architecture | Faite, avec `src/` en écart documenté |

## 2. Ce qui a été testé

| Contrôle | Outil | Résultat |
| --- | --- | --- |
| TypeScript strict | `tsc --noEmit` | 0 erreur |
| Lint | `eslint` | 0 erreur, 0 avertissement |
| Build production | `next build` | Succès, 0 avertissement |
| Tokens de motion synchronisés | `npm run verify:tokens` | Identiques (contrôle prouvé capable d'échouer) |
| Palette de graphiques | Validateur dataviz, modes clair et sombre | 5 contrôles sur 5, dans les deux thèmes |
| Revue UI 21st | `21st review` | 7 fichiers, 0 constat |
| Débordement horizontal | `npm run verify` — 14 pages × 9 largeurs × 2 thèmes | 0 |
| Texte tronqué | idem | 0 |
| Erreurs de console | idem | 0 |
| Cibles tactiles ≥ 24 px | idem, à 375 px | 0 |
| `prefers-reduced-motion` | idem | Titre entièrement visible |
| Texte transparent dans le viewport | idem, page descendue par écrans | 0 |
| Contraste des tokens | Détecteur Impeccable, par paire | Toutes les paires ≥ 4,5:1 |
| Anti-patterns de design | Détecteur Impeccable, 61 règles, sur pages rendues | 28 constats sur la vitrine et 39 sur le site de l'agence, triés en §4 ; il en reste 13 sur le site de l'agence, tous assumés |

## 3. Problèmes trouvés et corrigés

| # | Problème | Correctif |
| --- | --- | --- |
| 1 | Vermillon de marque à 4,0:1 sur le papier, blanc sur vermillon à 4,2:1, orange d'avertissement à 4,3:1 — échec WCAG AA | Palette assombrie puis re-testée ; token `--signal-aa` séparé du vermillon de marque |
| 2 | Dégradé violet→rose→orange codé en dur dans `ScrollProgress` (Magic UI), en haut de chaque page | Remplacé par l'accent du projet |
| 3 | Eyebrow en capitales espacées au-dessus du h1 — motif « AI SaaS hero » interdit par le §2.10 | Supprimé |
| 4 | Le h1 était rendu côté serveur en `opacity: 0` par `TextAnimate` : invisible sans JavaScript, sur l'élément LCP | Titre en texte simple ; le mouvement est passé sur le chapô |
| 5 | Compteurs rendus à `0` côté serveur — chiffre faux sans JavaScript et pour l'indexation | Composant `Counter` : vraie valeur au serveur, compteur animé après hydratation |
| 6 | `NumberTicker` forçait `text-black dark:text-white`, court-circuitant les tokens | Forcé sur `text-ink` |
| 7 | Débordement horizontal de la page Composants sous 375 px | `min-w-0` sur l'élément de grille |
| 8 | En-tête débordant à exactement 768 px | Navigation desktop passée au point de rupture `lg` |
| 9 | Cibles tactiles à 17–20 px de haut (logo, liens de pied de page et de cartes) | Padding porté à ≥ 24 px |
| 10 | Lignes de 200 et 93 caractères | Mesure appliquée au texte ; `--content-max` documenté |
| 11 | `Math.random()` pendant le rendu (`dot-pattern`), `setState` dans un effet (`terminal`) | Composants retirés |
| 12 | Accès disque paramétré traçant tout le projet dans le bundle serveur | Chemins rendus littéraux |

### Défauts propres au Motion Lab

| # | Problème | Correctif |
| --- | --- | --- |
| 13 | `Offsets must be monotonically non-decreasing` à chaque chargement de `/motion` : les plages de `useTransform` des étapes épinglées sortaient de [0, 1] (−0,08 sur la première, 1,08 sur la dernière). Motion confie une valeur liée au scroll à l'API d'animation du navigateur, qui refuse ces offsets. | Le fondu se prend à l'intérieur de la tranche de chaque étape |
| 14 | Étapes épinglées atténuées à `opacity: 0.35` → texte à **1,8:1**, très en dessous de 4,5:1 | L'état actif passe sur un filet d'accent ; le texte reste à pleine opacité |
| 15 | Kicker en capitales espacées au-dessus du titre de la section épinglée — le motif retiré du hero, réintroduit | Supprimé |

Le n° 14 n'a été vu ni par le build, ni par le lint, ni par le contrôle
navigateur : seul le détecteur Impeccable calcule le contraste effectif à
travers une pile d'opacités. Le n° 13 a été vu par le contrôle navigateur
seul. Aucun des deux outils ne remplace l'autre.

### Défauts propres à la Gallery et au Dashboard

| # | Problème | Correctif |
| --- | --- | --- |
| 16 | La palette de graphiques du projet échouait **trois contrôles sur cinq** : `--ink` sans chroma (se lit comme du gris), et ambre ↔ vert à ΔE 14,8 en vision normale, donc indiscernables même avec une vision des couleurs complète | Deux jeux re-déclinés et validés, clair et sombre séparément |
| 17 | Texte fonctionnel à 10px, sous le plancher de 11px, en 16 endroits | Relevé à 11px dans tout le projet |
| 18 | Hiérarchie typographique plate sur le Dashboard : h1 14px, corps 14px, h2 16px | Titre de page sorti de la barre supérieure ; corps 14 / h2 18 / h1 24 |
| 19 | En-têtes collants translucides : le contenu défilant dessous faisait tomber le contraste du titre à 1,3:1 | En-têtes rendus opaques, séparés par un filet |
| 20 | `setState` dans un effet et flash de mise en page dans le hook `use-mobile` livré par shadcn | Réécrit avec `useSyncExternalStore` |
| 21 | Kicker en capitales espacées au-dessus d'un titre, **troisième occurrence** | Déplacé sous le titre, en casse normale |

Le n° 16 n'aurait été trouvé par aucun contrôle visuel : il fallait exécuter le
validateur. C'est la raison pour laquelle le skill dataviz interdit de juger une
palette à l'œil.

### Défauts du site Sentis multipage

| # | Problème | Correctif |
| --- | --- | --- |
| 26 | `setState` appelé dans un effet pour refermer le tiroir mobile à la navigation — la règle `react-hooks/set-state-in-effect` la refuse, et le rendu se faisait en deux passes | Le tiroir se referme depuis le `onClick` du lien lui-même |
| 27 | Le titre anglais du héros débordait la page de 21 px à 320 px : « conversation. » mesure 301 px à 48 px de corps, pour 280 px disponibles | Un cran de corps en dessous de 360 px |
| 28 | `Reveal` ne se déclenchait qu'au quart visible (`amount: 0.25`) : un bloc de texte plus haut que l'écran occupait le viewport à opacité 0, et restait blanc tant qu'on n'avait pas descendu | Déclenchement dès l'entrée du bloc (`amount: "some"`) |
| 29 | Surtitre en capitales espacées répétant le h1 mot pour mot (« Réalisations » au-dessus de « Réalisations ») sur les quatre pages intérieures — **quatrième occurrence** du motif | `EnTetePage` n'accepte plus de surtitre ; l'état actif du menu dit déjà où l'on est |
| 30 | Les panneaux de séquence horizontale étaient des `h3` juste après le `h1` : plan du document troué, navigation par titres cassée pour un lecteur d'écran | Panneaux passés en `h2` |
| 31 | Étiquette de pièce (« Site vitrine ») posée en capitales au-dessus du titre de chaque réalisation — le même tic, en cinquième occurrence | Fondue dans la ligne de méta, sous le texte |
| 32 | Horaires d'ouverture en capitales espacées au-dessus du titre, à l'intérieur même de la démo boulangerie | Descendus sous les boutons, en casse normale |
| 33 | Ligne de méta à 98 caractères après fusion de l'étiquette et de la méta | Mesure bornée à `--content-max` |
| 34 | Bouton « Confirmer » de la démo de réservation sans padding horizontal : le texte touchait le bord du bouton dès que l'écran rétrécissait | `px-4` |
| 35 | Cadre d'appareil posé dans une carte (bordure + rayon + ombre autour d'une bordure + rayon) : deux boîtes pour un seul objet | Cartes de présentation supprimées, la section sable sert de plateau |

Le n° 29 est la quatrième fois que le surtitre en capitales revient dans ce
projet, et le n° 31 la cinquième. Le motif ne revient pas par accident : c'est
le réflexe par défaut quand on compose un en-tête. Seul le détecteur l'attrape.

### Défauts du site Sentis (version une page) et de la Documentation

| # | Problème | Correctif |
| --- | --- | --- |
| 22 | Titre anglais de 48 caractères contre 43 en français : 28 % de la hauteur d'écran à 72 px | Taille maximale calée sur la langue la plus longue |
| 23 | Le contrôle navigateur signalait « Failed to load resource » sans dire laquelle | Il rapporte désormais l'URL et le code, ce qui a immédiatement révélé trois préchargements vers d'anciens chemins |
| 24 | Quatre composants vendus installés et jamais utilisés | Retirés — deux portaient de vrais défauts, deux ne servaient à rien |
| 25 | Un `<code>` en ligne contenant un chemin long poussait la page entière hors du viewport sous 430 px | Règle globale `:not(pre) > code { overflow-wrap: anywhere }` |

## 4. Problèmes restants

Aucun n'est bloquant. Ils sont listés parce que le §13 exige qu'ils le soient.

| Constat | Occurrences | Décision |
| --- | --- | --- |
| `em-dash-overuse` — tirets cadratins | 3 pages | **Réel, partiellement traité.** Tic d'écriture qui fatigue la lecture. Une passe a été faite sur la page Design System ; les autres restent à relire. |
| `nested-cards` — carte dans une carte | 34 sur Composants, Motion Lab et Dashboard | **Inhérent.** Une galerie de composants ne peut pas montrer un composant `Card` sans l'encadrer dans un bloc de démonstration. À revoir si le motif apparaît hors galerie. |
| `cramped-padding` — enfants au ras d'une bordure | 7 sur la vitrine, 9 sur le site de l'agence | **Assumé, mesuré.** Deux causes distinctes. Sur la vitrine : grilles à filet unique (`gap-px`), les cellules ont leur padding, c'est la grille porteuse qui n'en a pas — le procédé suisse recherché. Sur le site de l'agence : les boutons shadcn ont une hauteur fixe et zéro padding vertical ; mesuré au navigateur, le lien d'appel à l'action fait 32 px de haut pour 14 px de texte et le bouton d'envoi 36 px pour 16 px, soit 9 à 10 px de part et d'autre. La règle lit le padding, pas l'espace réel. |
| `layout-transition` — `transition: height` | 3 sur la vitrine, 1 par page sur le site de l'agence | **Réel, non corrigé.** Vient de `transition-all` sur le bouton shadcn et de l'accordéon. Le passage à `grid-template-rows` demande de modifier un composant vendu ; à traiter avec la revue des primitives. |
| `nested-cards` sur les pages de réalisations | 1 sur `/fr`, 3 sur `/fr/realisations` | **Inhérent, vérifié.** Sonde DOM à l'appui : les seules occurrences restantes sont les cartes produits de la démo boulangerie à l'intérieur du cadre de navigateur, et l'écran du téléphone à l'intérieur de son châssis. Un cadre d'appareil n'est pas une carte, mais il en a la forme calculée. |
| `low-contrast` sur le bouton « Désactivé » | 1 | **Exemption assumée.** WCAG 1.4.3 exclut explicitement les composants d'interface inactifs. |

## 5. Ce qui n'est pas fait

- **§9.7 Settings** : écartée délibérément (voir plus haut).
- **Envoi du formulaire de contact** : le formulaire existe, valide ses champs
  et compose un courriel prérempli, faute de service d'envoi choisi. Un visiteur
  sans client de messagerie configuré reste donc sans chemin — c'est écrit
  sous le formulaire, ce n'est pas réglé.
- **Nom de domaine** : non fourni. Le site reste non indexable tant qu'il
  manque — garde-fou vérifié dans les deux états.
- **Grille de prix** : affichée sur le site mais **non validée** contre le
  marché local, et le temps réel de livraison n'a pas été mesuré. Voir
  `docs/offre.md`.
- **21st.dev** : les deux récupérations de code du palier gratuit ont été
  dépensées sans résultat — `Activity Feed` dépend d'une primitive shadcn
  absente du style de registre `radix-nova`, et `Insight Cards` exige un
  abonnement Marketplace. Aucun code 21st n'est donc entré dans le projet ; la
  recherche contextuelle et `21st review` ont en revanche servi.
- **§4 / §7.2** : GSAP et ScrollTrigger ne sont pas installés. Toutes les
  familles d'animation du §7 sont couvertes sans eux — les sections épinglées
  par `position: sticky`, le scroll horizontal en natif. C'est un écart assumé
  au §4, qui les nomme dans la stack ; il se referme dès qu'une séquence devra
  synchroniser plusieurs timelines sur une même piste.
- **Lenis, Three.js** : non installés, aucune justification à ce jour.
- **§3.1** : le dossier de recherche visuelle n'est pas rédigé. La direction
  artistique a été choisie et justifiée, mais sans moodboard ni analyse de
  références écrite.
- **§6** : familles Contenu (pricing, timeline, galerie, blog, équipe) et Data
  display (graphiques, flux d'activité, filtres) non couvertes.
- **§12** : `tests/components/`, `tests/pages/`, `tests/accessibility/` — seul
  le contrôle responsive et accessibilité existe.
- **Bilinguisme FR + EN** exigé par `PRODUCT.md` : fait pour le site de
  l'agence — segment `[locale]`, dictionnaire typé, `hreflang`. La vitrine
  `/nexus` reste en français uniquement.

## 6. Fichiers importants

| Fichier | Rôle |
| --- | --- |
| `src/styles/tokens.css` | Autorité sur toute valeur visuelle |
| `src/styles/motion.css` | Autorité sur le mouvement + `prefers-reduced-motion` global |
| `src/lib/nav.ts` | Source unique des pages et de leur état d'avancement |
| `src/lib/stats.ts` | Chiffres comptés au build |
| `src/lib/motion.ts` | Tokens de motion côté JS, miroir de `motion.css` |
| `src/components/motion/` | Bibliothèque d'animations (§6.7) |
| `src/lib/i18n.ts` | Tout le texte du site de l'agence, FR et EN |
| `src/components/sentis/parts.tsx` | Zone, Section, en-tête de page, panneau de séquence |
| `src/components/sentis/formulaire.tsx` | Demande de soumission |
| `tests/responsive-check.mjs` | Contrôle des 9 largeurs × 2 thèmes |
| `tests/motion-tokens-sync.mjs` | Empêche `motion.css` et `motion.ts` de diverger |

## 7. Commandes

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run verify        # serveur devant tourner
npm run verify:tokens
```
