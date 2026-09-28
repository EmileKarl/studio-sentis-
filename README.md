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

Le changement de page a sa propre animation : la page arrivante bascule depuis
l'arrière et se remet d'aplomb en 240 ms. Elle ne se joue qu'à la navigation,
jamais au premier chargement, et sa transformation est effacée à la fin — un
`transform` résiduel ferait de cet élément le bloc conteneur de ses descendants
et les séquences horizontales cesseraient de coller.

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
npm run verify:tokens  # les tokens de motion JS et CSS sont-ils identiques ?
npm run verify:scene   # le texte reste-t-il lisible devant les scènes 3D ?
npm run verify:teintes # les teintes de section portent-elles le texte à 4,5:1 ?
npm run verify:poids   # chaque page tient-elle dans son budget d'octets ?
```

`npm run verify` demande un serveur déjà lancé. Il charge quatorze pages aux
**neuf largeurs imposées par le §11** (320 à 1440 px), dans les deux thèmes, et
échoue s'il trouve un débordement horizontal, un texte tronqué, **du texte
resté invisible une fois JavaScript désactivé** (les entrées au scroll sont
livrées à `opacity: 0` ; une règle sous `<noscript>` les remet à plat, et ce
contrôle vérifie qu'elle est bien là), **une requête en 4xx avec son URL** (c'est ainsi que trois préchargements vers d'anciens
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

## Marque, couleurs et illustrations

Le logotype est **du texte**, pas une image : le nom dans la serif du site avec
« Sentis » souligné de vermillon. Un seul fichier le définit,
[`src/components/sentis/logotype.tsx`](src/components/sentis/logotype.tsx), et
les trois endroits où il apparaît passent par lui — en changer revient à
modifier ce fichier.

L'icône d'onglet, l'icône iOS et l'image de partage sont fabriquées à partir de
cette même lettre, rendue par le même moteur que le site :

```bash
node scripts/generer-images-marque.mjs   # → src/app/icon.png, apple-icon.png, public/og.png
```

Le site tenait sur deux fonds, crème et sable. Il porte maintenant une palette
franche en quatre couleurs — **bleu électrique, cyan, violet, vert** — déclinée
en deux familles :

| Famille | Rôle |
| --- | --- |
| `--teinte-*` | Fonds de section : clairs, mais on voit la couleur |
| `--accent-*` | La même couleur à pleine force : pictogrammes, scènes 3D, panneaux pleins |

Un troisième token, `--accent-contrast`, porte le texte posé **sur** un aplat
d'accent. Il ne pouvait pas être figé à blanc : en thème sombre les accents
s'éclaircissent, et le contrôle a mesuré du blanc sur le cyan clair à 1,82:1.

Aucune valeur n'est choisie à l'œil. `npm run verify:teintes` lit les tokens
dans `sentis.css` et mesure, dans les deux thèmes, chaque teinte contre les
quatre couleurs de texte, puis chaque accent sur le papier, sur son propre fond
et sous sa couleur de contraste. Deux valeurs ont été corrigées par ce calcul :
le vert ne donnait que 4,30:1 sur son propre fond et le cyan 4,52:1 ; les deux
ont été assombris.

Chaque page porte une couleur : bleu sur l'accueil, cyan sur les services,
violet sur les réalisations, vert sur À propos. La scène 3D de la page est de
cette couleur, et ses pictogrammes aussi.

Les illustrations sont dessinées, pas photographiées : quatre pictogrammes de
métier qui se tracent au défilement
([`pictos.tsx`](src/components/sentis/pictos.tsx)) et, sur la page contact, un
**globe terrestre** qui tourne
([`globe-territoire.tsx`](src/components/sentis/globe-territoire.tsx)).

Le globe est en canvas 2D — une projection orthographique tient en quatre
lignes de trigonométrie, WebGL serait de la machinerie pour rien. Tout ce qui
peut y être exact l'est : le trait de côte vient de **Natural Earth** (domaine
public, via `world-atlas`, décodé et simplifié dans
[`src/lib/cotes.ts`](src/lib/cotes.ts) — 14 ko, 5,7 ko compressés) et
Châteauguay est à ses vraies coordonnées. Une seule chose ne l'est pas, et
c'est écrit sous le dessin : **le halo local est symbolique**, parce qu'à cette
échelle la Montérégie mesurerait deux pixels. Les villes desservies sont
listées en toutes lettres à côté, en texte — sur un globe, elles ne tiendraient
pas.

**Il n'y a aucune photographie dans le projet.** C'est un choix assumé tant que
le studio n'a pas les siennes : ni banque d'images, ni bureau qui n'est pas le
sien, ni équipe qui n'existe pas.

## Référencement et poids

**Référencement.** Chaque page pose sa propre balise canonique, ses `hreflang`
(`fr`, `en`, `x-default` sur le français) et ses balises Open Graph, via
[`src/lib/seo.ts`](src/lib/seo.ts). Passer par une fonction n'est pas de
l'élégance : les quatre pages intérieures se contentaient auparavant d'un titre
et d'une description, **héritaient donc de la canonique de la mise en page**, et
déclaraient chacune `rel="canonical"` vers l'accueil — c'est-à-dire « je suis un
doublon de l'accueil, ne m'indexez pas ». Une fonction partagée est la seule
façon qu'une page nouvelle ne puisse pas l'oublier.

S'y ajoutent un fil d'Ariane structuré par page intérieure, les données
`ProfessionalService` de l'accueil, le `sitemap.xml` avec ses alternates et le
garde-fou `noindex` tant que le domaine n'est pas choisi.

**Poids.** Trois mesures, protocole identique avant et après (médiane de cinq
chargements pour le LCP, octets non compressés) :

| | avant | après |
| --- | --- | --- |
| JavaScript, par page | 889 ko | 840 ko |
| CSS | 172 ko | 157 ko |
| Polices | 192 ko (7 fichiers) | 89 ko (2 fichiers) |
| **Total par page** | **1 253 ko** | **1 086 ko** |
| LCP `/fr` | 1 252 ms | 1 108 ms |
| LCP `/fr/a-propos` | 1 052 ms | 244 ms |

Ce qui a produit ces chiffres :

- les **polices de la vitrine NEXUS** étaient déclarées dans la mise en page
  racine, donc préchargées sur toutes les pages du déploiement — trois familles
  que le site de l'agence n'affiche jamais. Elles vivent maintenant dans
  [`src/lib/polices-nexus.ts`](src/lib/polices-nexus.ts), posées par les seules
  mises en page qui s'en servent ;
- **Motion** passe par `LazyMotion` et le composant mince `m` : le site de
  l'agence charge `domAnimation` (le jeu léger), la vitrine `domMax` (elle a des
  animations de mise en page). Les deux jeux sont dans deux fichiers séparés,
  parce qu'un seul module qui importait les deux les mettait dans le même
  morceau ;
- **le décor est différé** : scènes WebGL et globe passent par
  [`differe.tsx`](src/components/motion/differe.tsx), montés à l'inactivité du
  navigateur, et le globe seulement quand son cadre approche. Découper sans
  différer le montage ne change rien — `next/dynamic` va chercher le morceau au
  montage, c'est mesuré.

`npm run verify:poids` fige ces gains : il échoue si une page dépasse son
budget. C'est le seul contrôle du projet qui regarde ce qu'une page coûte.

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
