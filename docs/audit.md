# Rapport d'audit — Niveau 1 (Foundation)

Établi selon le §13 phase 14 : comparaison du projet au cahier des charges.
Portée auditée : les trois pages construites (`/`, `/design-system`,
`/components`).

## 1. Ce qui est terminé

| Exigence | État |
| --- | --- |
| §4 Stack (Next.js, React, TypeScript, Tailwind, shadcn/ui, Lucide) | Faite |
| §5 Design system (couleurs, typo, espacements, rayons, ombres, grille, motion) | Faite — 141 tokens, 31 tokens de motion |
| §6 Bibliothèque de composants | Partielle — 38 primitives installées, catégories Contenu et Data display incomplètes |
| §9.1 Landing | Faite |
| §9.2 Design System | Faite |
| §9.3 Composants | Faite pour les familles couvertes |
| §10 Clair / sombre / système, avec persistance | Faite |
| §11 Responsive sur les 9 largeurs | Faite et vérifiée |
| §12 Architecture | Faite, avec `src/` en écart documenté |

## 2. Ce qui a été testé

| Contrôle | Outil | Résultat |
| --- | --- | --- |
| TypeScript strict | `tsc --noEmit` | 0 erreur |
| Lint | `eslint` | 0 erreur, 0 avertissement |
| Build production | `next build` | Succès, 0 avertissement |
| Débordement horizontal | `npm run verify` — 3 pages × 9 largeurs × 2 thèmes | 0 |
| Texte tronqué | idem | 0 |
| Erreurs de console | idem | 0 |
| Cibles tactiles ≥ 24 px | idem, à 375 px | 0 |
| `prefers-reduced-motion` | idem | Titre entièrement visible |
| Contraste des tokens | Détecteur Impeccable, par paire | Toutes les paires ≥ 4,5:1 |
| Anti-patterns de design | Détecteur Impeccable, 61 règles, sur pages rendues | 28 constats, triés en §4 |

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

## 4. Problèmes restants

Aucun n'est bloquant. Ils sont listés parce que le §13 exige qu'ils le soient.

| Constat | Occurrences | Décision |
| --- | --- | --- |
| `nested-cards` — carte dans une carte | 13, page Composants | **Inhérent.** Une galerie de composants ne peut pas montrer un composant `Card` sans l'encadrer dans un bloc de démonstration. À revoir si le motif apparaît hors galerie. |
| `cramped-padding` — enfants au ras d'une bordure | 7 | **Assumé.** Grilles à filet unique (`gap-px`) : les cellules ont leur padding, c'est la grille porteuse qui n'en a pas. C'est le procédé suisse recherché. |
| `layout-transition` — `transition: height` | 3 | **Réel, non corrigé.** Vient de l'accordéon shadcn. Le passage à `grid-template-rows` demande de modifier un composant vendu ; à traiter avec la revue des primitives. |
| `low-contrast` sur le bouton « Désactivé » | 1 | **Exemption assumée.** WCAG 1.4.3 exclut explicitement les composants d'interface inactifs. |

## 5. Ce qui n'est pas fait

- **§9.4 à §9.8** : Motion Lab, Gallery, Dashboard, Settings, Documentation.
- **§7** : GSAP, ScrollTrigger, sections épinglées, parallaxe, transitions de
  page, interactions au curseur. Le scroll horizontal existe, en natif.
- **§3.1** : le dossier de recherche visuelle n'est pas rédigé. La direction
  artistique a été choisie et justifiée, mais sans moodboard ni analyse de
  références écrite.
- **§6** : familles Contenu (pricing, timeline, galerie, blog, équipe) et Data
  display (graphiques, flux d'activité, filtres) non couvertes.
- **§12** : `tests/components/`, `tests/pages/`, `tests/accessibility/` — seul
  le contrôle responsive et accessibilité existe.
- **Bilinguisme FR + EN** exigé par `PRODUCT.md` : le projet est en français
  uniquement. Aucune infrastructure i18n n'est posée.

## 6. Fichiers importants

| Fichier | Rôle |
| --- | --- |
| `src/styles/tokens.css` | Autorité sur toute valeur visuelle |
| `src/styles/motion.css` | Autorité sur le mouvement + `prefers-reduced-motion` global |
| `src/lib/nav.ts` | Source unique des pages et de leur état d'avancement |
| `src/lib/stats.ts` | Chiffres comptés au build |
| `tests/responsive-check.mjs` | Contrôle des 9 largeurs × 2 thèmes |

## 7. Commandes

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run verify     # serveur devant tourner
```
