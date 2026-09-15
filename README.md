# NEXUS UI — Digital Starter Kit

Infrastructure de création numérique : un design system, une bibliothèque de
composants et une bibliothèque d'animations, conçus pour être réutilisés d'un
projet à l'autre plutôt que regardés une fois.

Premier projet de **Studio Sentis**. Voir [`PRODUCT.md`](PRODUCT.md) pour le
contexte produit et [`docs/`](docs/) pour l'architecture, la checklist qualité
et le rapport d'audit.

## État

**Niveau 1 — Foundation** du cahier des charges (§17), livré et vérifié.
Les Niveaux 2 et 3 ne sont pas commencés. Le détail page par page est dans
[`docs/audit.md`](docs/audit.md).

| Page | État |
| --- | --- |
| Landing (`/`) | Construite |
| Design System (`/design-system`) | Construite |
| Composants (`/components`) | Construite |
| Motion Lab, Gallery, Dashboard, Settings, Documentation | Prévues |

## Prérequis

Node.js 20+ et npm.

## Installation

```bash
npm install
```

## Lancement

```bash
npm run dev      # développement, http://localhost:3000
npm run build    # build de production
npm run start    # sert le build de production
```

## Contrôle qualité

```bash
npm run lint       # ESLint (doit sortir sans erreur ni avertissement)
npm run typecheck  # TypeScript strict, sans émission
npm run verify     # vérification navigateur : voir ci-dessous
```

`npm run verify` demande un serveur déjà lancé. Il charge les trois pages aux
**neuf largeurs imposées par le §11** (320 à 1440 px), dans les deux thèmes, et
échoue s'il trouve un débordement horizontal, un texte tronqué, une erreur de
console, une cible tactile sous 24 px ou un titre invisible sous
`prefers-reduced-motion`.

```bash
npm run build && npm run start &
npm run verify
# Variables : BASE_URL, CHROME_PATH (Chromium déjà présent), SHOT_DIR
```

Le détecteur de design du skill Impeccable complète ces contrôles :

```bash
.claude/skills/impeccable/scripts/impeccable detect http://localhost:3000/
```

## Déploiement

Cible prévue : Vercel. `npm run build` produit trois pages entièrement
statiques ; aucune variable d'environnement n'est requise à ce stade.

## Architecture

```
src/
├── app/            Routes App Router (une page = un dossier)
├── components/
│   ├── ui/         Primitives shadcn/ui (Radix) + composants Magic UI
│   ├── layout/     Container, Section, en-tête et pied de page
│   └── sections/   Blocs de page composés
├── lib/            Navigation, utilitaires, statistiques de build
└── styles/
    ├── tokens.css  Couleurs, espacements, rayons, ombres, grille
    └── motion.css  Durées, courbes, délais, reduced-motion
tests/
└── responsive-check.mjs
```

Détail et règles dans [`docs/architecture.md`](docs/architecture.md).

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Radix), Magic UI,
Motion, Lucide, next-themes.

GSAP, ScrollTrigger, Lenis et Three.js **ne sont pas installés** : le §4 impose
qu'une bibliothèque ne soit ajoutée que lorsqu'elle apporte une valeur réelle,
et aucune séquence du Niveau 1 ne les justifie. Ils arriveront avec le Motion
Lab.

## Outillage agent

Ce dépôt embarque des skills et un serveur MCP dans `.claude/` et `.mcp.json`.

| Outil | Rôle |
| --- | --- |
| `magicuidesign-mcp` | Registre des composants Magic UI |
| `ui-ux-pro-max` + 6 skills | Données de design : styles, palettes, typographies, UX |
| `impeccable` | 23 commandes de design, détecteur de 61 règles |

Ils sont chargés au démarrage de Claude Code dans le dossier. `uupm-design` est
le skill `design` de UI UX Pro Max, renommé : sous son nom d'origine il masquait
le skill `design` intégré de Claude Code. Le renommage est à réappliquer après
chaque `npx ui-ux-pro-max-cli update`.

Le hook Impeccable (`.claude/settings.local.json`) et le moteur compilé
(`scripts/bin/`) ne sont pas versionnés : voir `.gitignore`.
