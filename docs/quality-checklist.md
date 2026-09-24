# Checklist qualité (§14)

État au terme du Niveau 1. `—` marque un point qui ne peut pas encore être
évalué faute de la page concernée. Voir [`audit.md`](audit.md) pour le détail.

## Design

- [x] Direction artistique cohérente — Swiss editorial, tenue sur les 3 pages
- [x] Palette cohérente — 141 tokens, une seule source
- [x] Typographie cohérente — Archivo / IBM Plex Sans / IBM Plex Mono
- [x] Grilles cohérentes — une gouttière, un `Container`
- [x] Espacements cohérents — échelle de 10 pas
- [x] Composants cohérents — primitives Radix, rayons et filets communs
- [ ] Illustrations pertinentes — aucune illustration produite
- [ ] Patterns maîtrisés — seule la grille de fond est en place
- [x] Mode clair cohérent
- [x] Mode sombre cohérent

## UX

- [x] Navigation intuitive — les pages non construites sont marquées comme telles
- [x] Hiérarchie claire
- [x] Boutons compréhensibles
- [x] États de chargement présents — squelette + `role="status"`
- [x] États d'erreur présents — champ `aria-invalid` + message lié
- [x] États vides présents
- [x] Formulaires utilisables — chaque contrôle lié à son `<Label>`
- [x] Navigation mobile fonctionnelle — tiroir, fermeture au choix d'un lien
- [x] Scroll horizontal compréhensible — consigne écrite, zone focusable
- [x] Animations non bloquantes

## Responsive

Vérifié par `npm run verify` sur 320, 375, 390, 430, 768, 834, 1024, 1280 et
1440 px, dans les deux thèmes, sur les neuf pages.

- [x] Desktop testé
- [x] Tablette testée
- [x] Mobile testé
- [x] Aucun débordement
- [x] Aucun texte coupé
- [x] Aucun bouton hors écran
- [ ] Images adaptées — aucune image dans le projet à ce stade
- [x] Grilles adaptées
- [x] Tableaux adaptés — conteneur défilant, jamais de débordement de page
- [x] Touch fonctionnel — aucune cible sous 24 × 24 px

## Motion

- [x] Animations cohérentes — durées et courbes issues des tokens
- [x] Durées maîtrisées
- [x] Easing cohérent — aucun rebond
- [x] Scroll fluide — comportement natif, pas de scroll détourné
- [x] Scroll horizontal fonctionnel
- [x] Pinned sections fonctionnelles — `position: sticky`, scroll jamais détourné
- [x] Parallaxe maîtrisée — course totale de 28px, plafonnée par construction
- [x] Page transitions fonctionnelles — 240ms, opacité + 8px, sans animation de sortie
- [x] `reduced-motion` pris en compte — traité globalement dans `motion.css`
- [x] Pas de layout shift important — aucune erreur de console, build statique

## Technique

- [x] TypeScript valide — `tsc --noEmit`, 0 erreur
- [x] Lint valide — 0 erreur, 0 avertissement
- [x] Build valide — 0 avertissement
- [x] Console propre — 0 erreur sur 162 chargements
- [x] Pas d'imports inutiles — vérifié par le lint
- [x] Pas de composants inutilisés — 2 composants retirés à ce titre
- [x] Performance acceptable — 3 pages entièrement statiques
- [x] Accessibilité vérifiée — contraste, focus, cibles tactiles, `reduced-motion`
- [ ] Images optimisées — sans objet
- [x] Documentation présente — `docs/` et la page `/nexus/docs`
- [x] README complet
