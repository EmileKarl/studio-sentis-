# Studio Sentis

Ce dépôt sert deux produits sur un seul déploiement :

| Chemin | Produit |
| --- | --- |
| `/fr`, `/en` et leurs quatre sous-pages | **Site de Studio Sentis** — agence à Châteauguay, Québec |
| `/nexus/**` | **NEXUS UI** — le starter kit, et la pièce de portfolio de l'agence |

Le site de l'agence tient en cinq pages, servies dans les deux langues :

| Page | Rôle |
| --- | --- |
| `/[locale]` | Accueil. Héros plein écran, puis alternance de séquences horizontales et de sections verticales |
| `/[locale]/services` | Les quatre offres, avec ce qui est livré dans chacune |
| `/[locale]/realisations` | Les trois pièces de démonstration, rendues vivantes dans leurs cadres d'appareil |
| `/[locale]/a-propos` | D'où vient le studio et ce que ça change pour le client |
| `/[locale]/contact` | Demande de soumission |

« Soumission » et non « devis » : c'est le terme employé au Québec.

Chaque page porte un volume 3D qui lui est propre — treillis sur l'accueil,
anneau sur les services, nuage sur À propos, onde sur le contact — tourné en
continu **et** par le défilement. Ils sont rendus en WebGL, sans bibliothèque
3D : le programme tient en une quarantaine de lignes de GLSL, là où Three.js
coûterait environ 150 ko compressés à une agence qui vend des sites rapides.

La racine `/` redirige vers `/fr` : le domaine appartient à l'agence, la
vitrine technique en est une section.

Les deux partagent une seule architecture de tokens et une seule bibliothèque
de composants ; seule la peau change (`src/styles/sentis.css`, activée par
`data-brand="sentis"`). C'est la démonstration la plus directe de ce que le
starter kit sait faire : **un système, deux identités.**

Contexte produit et positionnement : [`PRODUCT.md`](PRODUCT.md). Grille de
prix proposée : [`docs/offre.md`](docs/offre.md).

---

## NEXUS UI — Digital Starter Kit

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
| Landing (`/nexus`) | Construite |
| Design System (`/nexus/design-system`) | Construite |
| Composants (`/nexus/components`) | Construite |
| Motion Lab (`/nexus/motion`) | Construite |
| Défilement (`/nexus/scroll`) | Construite |
| Gallery (`/nexus/gallery`) | Construite |
| Dashboard (`/nexus/dashboard`) | Construite |
| Documentation (`/nexus/docs`) | Construite |
| Settings | Écartée, voir `docs/audit.md` |

## Prérequis

Node.js 20+ et npm.

## Configuration

Une seule variable, documentée dans [`.env.example`](.env.example) :

```bash
NEXT_PUBLIC_SITE_URL=https://votre-domaine.ca
```

**Tant qu'elle n'est pas définie, le site refuse d'être indexé** : `robots.txt`
interdit tout, chaque page porte `noindex, nofollow`, et le sitemap pointe vers
`example.invalid`. C'est délibéré — un site indexé sous une fausse adresse doit
ensuite être désindexé à la main. Le domaine de Studio Sentis n'est pas encore
choisi ; aucune adresse n'est écrite en dur dans le code.

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
npm run verify:scene  # le texte reste-t-il lisible devant les scènes 3D ?
```

`npm run verify` demande un serveur déjà lancé. Il charge quatorze pages aux
**neuf largeurs imposées par le §11** (320 à 1440 px), dans les deux thèmes, et
échoue s'il trouve un débordement horizontal, un texte tronqué, **une requête
en 4xx avec son URL** (c'est ainsi que trois préchargements vers d'anciens
chemins ont été trouvés), une cible tactile sous 24 px, un titre invisible sous
`prefers-reduced-motion`, ou **un texte laissé transparent alors qu'il est dans
le viewport** — la signature d'une entrée au scroll qui n'est jamais partie.

```bash
npm run build && npm run start &
npm run verify
# Variables : BASE_URL, CHROME_PATH (Chromium déjà présent), SHOT_DIR
```

`npm run verify:scene` photographie la boîte de chaque texte posé devant une
scène 3D **titre masqué**, ce qui isole le fond réel — fil de fer compris — et
compare la couleur CSS du texte au pire pixel de ce fond, à 1280 px et à 390 px,
dans les deux thèmes. Aucun autre outil ne voit ces pixels : le détecteur lit le
CSS calculé, où le fond reste la couleur de la section. C'est ce contrôle qui a
imposé d'atténuer et de descendre les scènes sur téléphone, où le chapô des
Services tombait à 4,11:1 en thème sombre.

Le détecteur de design du skill Impeccable complète ces contrôles :

```bash
.claude/skills/impeccable/scripts/impeccable detect http://localhost:3000/
```

## Déploiement

Cible prévue : Vercel. `npm run build` produit vingt-quatre routes
entièrement statiques, dont dix-sept pages de contenu. Aucune variable
d'environnement n'est requise pour construire, mais sans
`NEXT_PUBLIC_SITE_URL` le site se sert lui-même en `noindex` avec un
`Disallow: /` — le garde-fou est volontaire, le domaine n'étant pas choisi.

## Architecture

```
src/
├── app/
│   ├── page.tsx        Redirige / vers /fr
│   ├── (sentis)/       Site de l'agence, segment [locale] : /fr et /en
│   │                   + services, realisations, a-propos, contact
│   ├── (showcase)/     Vitrine NEXUS sous /nexus
│   └── (app)/          Enveloppe applicative : /nexus/dashboard
├── components/
│   ├── ui/         Primitives shadcn/ui (Radix) + composants Magic UI
│   ├── motion/     Animations, dont les scènes WebGL et les objets CSS 3D
│   ├── sentis/     Chrome propre au site de l'agence
│   ├── layout/     Container, Section, en-tête et pied de page
│   └── sections/   Blocs de page composés
├── lib/            i18n (tout le texte du site), navigation, utilitaires
└── styles/
    ├── tokens.css  Couleurs, espacements, rayons, ombres, grille
    ├── motion.css  Durées, courbes, délais, reduced-motion
    └── sentis.css  Peau de la marque Studio Sentis
tests/
├── responsive-check.mjs
├── motion-tokens-sync.mjs
└── scene-contrast.mjs
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
jamais la clé. Le serveur MCP demande en plus une autorisation interactive
(`/mcp`) ; la CLI `@21st-dev/cli`, elle, fonctionne avec la seule variable.

`.21st/` contient le contexte de design généré par `21st init --design-context`
— il sert à rendre les recherches 21st conscientes des tokens et des composants
déjà installés. Aucun secret n'y est écrit.

Ils sont chargés au démarrage de Claude Code dans le dossier. `uupm-design` est
le skill `design` de UI UX Pro Max, renommé : sous son nom d'origine il masquait
le skill `design` intégré de Claude Code. Le renommage est à réappliquer après
chaque `npx ui-ux-pro-max-cli update`.

Le hook Impeccable (`.claude/settings.local.json`) et le moteur compilé
(`scripts/bin/`) ne sont pas versionnés : voir `.gitignore`.
