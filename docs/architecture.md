# Architecture

## Principe

Une seule règle gouverne l'organisation : **une valeur visuelle ne doit exister
qu'à un seul endroit**. Changer la direction artistique du projet doit se faire
dans `src/styles/`, sans toucher un composant.

## Arborescence

```
src/
├── app/
│   ├── layout.tsx              Racine : polices, thème, chrome, providers
│   ├── globals.css             Importe les tokens, pointe le @theme Tailwind
│   ├── page.tsx                Landing (§9.1)
│   ├── design-system/page.tsx  §9.2
│   └── components/
│       ├── page.tsx            §9.3 — partie serveur
│       └── demo.tsx            §9.3 — partie client (état, toasts, overlays)
├── components/
│   ├── ui/                     Primitives vendues : shadcn/ui + Magic UI
│   ├── layout/                 Container, Section, SiteHeader, SiteFooter
│   ├── sections/               Blocs composés propres au projet
│   └── theme-provider.tsx
├── lib/
│   ├── nav.ts                  Source unique des pages et de leur état
│   ├── stats.ts                Chiffres comptés sur le disque au build
│   └── utils.ts                cn()
└── styles/
    ├── tokens.css              Couleur, espacement, rayon, ombre, grille
    └── motion.css              Durées, courbes, stagger, reduced-motion
```

Le cahier des charges (§12) place `app/`, `components/`, `lib/` et `styles/` à
la racine. Ils sont ici sous `src/` : l'organisation interne est identique, mais
la racine du dépôt reste lisible malgré `.claude/`, `docs/` et `tests/`.

## Règles

### Ce qui va dans `components/ui/`

Rien d'écrit à la main. Ce dossier est peuplé par `npx shadcn@latest add`. Le
modifier signifie qu'une mise à jour du registre écrasera le travail — sauf
correction de défaut, et alors le commentaire doit dire pourquoi. Deux fichiers
sont dans ce cas aujourd'hui :

- `scroll-progress.tsx` : le dégradé violet→rose→orange d'origine est le tell le
  plus reconnaissable d'une interface générée, que le §2.10 interdit.
- Deux composants ont été **supprimés** plutôt que corrigés : `terminal.tsx`
  (`setState` dans un effet) et `dot-pattern.tsx` (`Math.random()` pendant le
  rendu — instable entre deux rendus et source de désynchronisation serveur /
  client).

### Ce qui va dans `components/layout/`

Les éléments de structure réutilisés par toutes les pages. `Container` porte la
gouttière unique du projet : c'est lui, et lui seul, qui garantit que rien ne
touche le bord de l'écran.

### Ce qui va dans `components/sections/`

Les blocs composés propres à NEXUS UI. Ils consomment `ui/` et `layout/`, jamais
l'inverse.

### Composants serveur et client

Par défaut serveur. `"use client"` seulement quand le composant a un état, un
écouteur ou une API navigateur. La page Composants est coupée en deux pour
cette raison : l'enveloppe et les métadonnées restent serveur, les démos
interactives passent client.

### Accès disque

`lib/stats.ts` lit le disque au build. Les chemins doivent rester **littéraux**
et non paramétrés : Turbopack analyse statiquement ces appels, et un chemin
construit dynamiquement fait tracer tout le projet — dossier `public/` compris —
dans le bundle serveur.

## Pièges rencontrés

Ces trois-là ont coûté un cycle de correction chacun ; ils sont documentés pour
ne pas être refaits.

1. **`min-width: auto` sur un élément de grille.** Un `article` contenant un
   tableau imposait sa largeur minimale (314 px) à toute la piste, donc à toutes
   les cartes de la même rangée, et faisait déborder la page sous 375 px.
   `min-w-0` sur l'élément de grille est le correctif.

2. **`ch` se résout sur la police de l'élément qui le porte.** `--content-max:
   68ch` posé sur un conteneur en 16 px laisse passer ~93 caractères d'un texte
   en 14 px. La mesure va sur le texte, jamais sur son conteneur.

3. **Le point de rupture `md` (768 px) est une largeur réelle à tester.** À
   exactement 768 px, l'en-tête affichait la navigation desktop complète : logo
   + 6 entrées + sélecteur de thème = 822 px. La navigation est passée à `lg`.
