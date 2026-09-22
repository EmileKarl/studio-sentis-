# NEXUS UI — Digital Starter Kit

Infrastructure de création numérique : un design system, une bibliothèque de
composants et une bibliothèque d'animations, conçus pour être réutilisés d'un
projet à l'autre plutôt que regardés une fois.

Premier projet de **Studio Sentis**. Voir [`PRODUCT.md`](PRODUCT.md) pour le
contexte produit et [`docs/`](docs/) pour l'architecture, la checklist qualité
et le rapport d'audit.

## État

**Niveau 1 — Foundation** du cahier des charges (§17), livré et vérifié.
**Niveau 3 — Motion & Experience** entamé : la bibliothèque d'animations (§6.7)
et le Motion Lab (§9.4) existent. Le détail page par page est dans
[`docs/audit.md`](docs/audit.md).

| Page | État |
| --- | --- |
| Landing (`/`) | Construite |
| Design System (`/design-system`) | Construite |
| Composants (`/components`) | Construite |
| Motion Lab (`/motion`) | Construite |
| Gallery, Dashboard, Settings, Documentation | Prévues |

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
npm run verify        # vérification navigateur : voir ci-dessous
npm run verify:tokens # les tokens de motion JS et CSS sont-ils identiques ?
```

`npm run verify` demande un serveur déjà lancé. Il charge les trois pages aux
**neuf largeurs imposées par le §11** (320 à 1440 px), dans les deux thèmes, et
échoue s'il trouve un débordement horizontal, un texte tronqué, une erreur de
console, une cible tactile sous 24 px, un titre invisible sous
`prefers-reduced-motion`, ou **un texte laissé transparent alors qu'il est dans
le viewport** — la signature d'une entrée au scroll qui n'est jamais partie.

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

**Motion *est* Framer Motion.** La bibliothèque a été renommée : `motion` et
`framer-motion` sont publiés depuis le même dépôt, dans la même ligne de
version, sur les mêmes internes (`motion-dom`, `motion-utils`). Installer les
deux mettrait deux copies du même moteur dans le bundle — exactement le
« conflit entre plusieurs systèmes d'animation » que le §4 interdit. Le §4 nomme
d'ailleurs « Motion », pas « framer-motion ».

GSAP, ScrollTrigger, Lenis et Three.js **ne sont pas installés.** Le Motion Lab
couvre entrées, stagger, révélation de texte, parallaxe, scroll horizontal,
interactions au curseur, sections épinglées et transitions de page sans eux :
les sections épinglées reposent sur `position: sticky`, qui ne détourne jamais
le scroll de la page. GSAP se justifiera quand une séquence devra synchroniser
plusieurs timelines sur une même piste — et pas avant, par le §4.

## Outillage agent

Ce dépôt embarque des skills et un serveur MCP dans `.claude/` et `.mcp.json`.

| Outil | Rôle |
| --- | --- |
| `magicuidesign-mcp` | Registre des composants Magic UI |
| `ui-ux-pro-max` + 6 skills | Données de design : styles, palettes, typographies, UX |
| `impeccable` | 23 commandes de design, détecteur de 61 règles |
| `21st` (21st.dev) | Registre de composants, thèmes et templates |

Le serveur `21st` **exige une clé d'API** : créez-la sur
<https://21st.dev/mcp>, puis exportez `API_KEY_21ST` dans votre environnement
avant de lancer Claude Code. `.mcp.json` ne contient que le nom de la variable,
jamais la clé.

Ils sont chargés au démarrage de Claude Code dans le dossier. `uupm-design` est
le skill `design` de UI UX Pro Max, renommé : sous son nom d'origine il masquait
le skill `design` intégré de Claude Code. Le renommage est à réappliquer après
chaque `npx ui-ux-pro-max-cli update`.

Le hook Impeccable (`.claude/settings.local.json`) et le moteur compilé
(`scripts/bin/`) ne sont pas versionnés : voir `.gitignore`.
