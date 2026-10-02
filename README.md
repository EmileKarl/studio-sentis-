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

Variables documentées dans [`.env.example`](.env.example) :

```bash
NEXT_PUBLIC_SITE_URL=https://votre-domaine.ca

# Identité de l'exploitant, affichée dans les mentions légales
NEXT_PUBLIC_NOM_LEGAL="Raison sociale telle qu'immatriculée"
NEXT_PUBLIC_NEQ=1234567890
NEXT_PUBLIC_ADRESSE="123 rue Exemple, Châteauguay (Québec) J6J 0A0"
NEXT_PUBLIC_HEBERGEUR="Nom de l'hébergeur"
```

**Tant que `NEXT_PUBLIC_SITE_URL` n'est pas définie, le site refuse d'être
indexé** : `robots.txt` interdit tout, chaque page porte `noindex, nofollow`, et
le sitemap pointe vers `example.invalid`. C'est délibéré — un site indexé sous
une fausse adresse doit ensuite être désindexé à la main. Le domaine de Studio
Sentis n'est pas encore choisi ; aucune adresse n'est écrite en dur dans le
code.

Les quatre variables d'identité obéissent au même principe. Tant qu'il en manque
une, `/mentions-legales` affiche le champ correspondant comme un trou explicite
(« à compléter »), porte `noindex` **à elle seule**, et sort du sitemap. Un
document qui engage l'entreprise ne doit pas pouvoir être indexé à moitié faux,
et un nom légal ou un NEQ ne s'invente pas. Le comportement est vérifié dans les
deux sens : construit avec les quatre variables, la page perd son `noindex`,
entre au sitemap et affiche les valeurs.

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

## Marque — Concept 16, « Chaleur néo-minimaliste »

Le site applique la planche de marque fournie par le client. Cinq couleurs, une
police, un symbole.

| | | |
| --- | --- | --- |
| blanc cassé | `#f8f5f2` | papier |
| beige chaud | `#e6dacd` | surface de section |
| gris souple | `#949291` | texte en thème sombre |
| accent terre | `#c8a284` | aplats, et texte en thème sombre |
| noir | `#1a1a1a` | encre |

**Un point de la planche est faux, et il est corrigé.** Elle annonce « blanc sur
accent — contraste valide » : mesuré, c'est **2,34:1**, pour un plancher à 4,5.
Du blanc sur le terracotta serait illisible. Le couple qui tient est le **noir
sur l'accent, à 7,42:1** ; c'est lui qui est en place.

Trois des cinq couleurs ne peuvent pas porter de texte sur le papier — le beige
à 1,27:1, l'accent à 2,16:1, le gris souple à 2,85:1. Ce sont des couleurs de
**surface** et de **marque**, pas d'interface, et une planche n'a pas à s'en
excuser. Partout où il en fallait une version lisible, elle est **assombrie à
teinte et saturation constantes** jusqu'au plancher, jamais remplacée : le gris
souple devient `--ink-muted`, l'accent terre devient `--signal-aa`. La planche
reste reconnaissable.

En **thème sombre**, que la planche ne couvre pas, le gris souple et l'accent
terre reprennent leur valeur d'origine sans retouche : leur clarté médiane, qui
ne passait pas sur le blanc cassé, donne 5,99:1 et 7,92:1 sur l'encre.

Un piège qui a coûté une itération : `--signal` et `--accent-*` portent la même
couleur à deux valeurs. `--signal` est l'accent clair de la planche et reçoit du
**noir** ; `--accent-*` est sa version assombrie, qui porte le texte, et reçoit
du **clair**. Même couleur, deux contrastes opposés.

### Ce que le changement de direction coûte

La planche n'a **qu'un accent**. Les quatre couleurs de section issues de Sanzo
Wada disparaissent : les sections se distinguent désormais par la **chaleur et
la valeur**, pas par la teinte. Les quatre noms de tokens `--teinte-*` et
`--accent-*` sont conservés — une dizaine de composants les nomment — mais ils
désignent quatre pas entre le blanc cassé et le beige chaud, et les quatre
accents pointent sur la même valeur. **Les pictogrammes des quatre services
perdent donc leur couleur propre.** C'est la conséquence directe d'une identité
à un accent, pas un oubli.

### Logotype

Un **symbole** — carré très arrondi contenant un sourire, tracé au filet — et un
**mot-symbole** en capitales sur deux lignes.
([`logotype.tsx`](src/components/sentis/logotype.tsx), un seul fichier à
toucher.)

Le symbole est un **SVG en ligne**, donc il suit `currentColor` et bascule seul
en thème sombre, sans variante à maintenir. Le mot-symbole est composé dans
Inter, que la page charge déjà : plus de police dédiée au logo.

### Typographie

**Inter pour tout**, en remplacement du couple Fraunces + Source Sans 3. Les
titres se distinguent par la graisse et un interlettrage resserré, pas par une
seconde police. Les capitales de la planche sont réservées aux libellés courts :
un titre de phrase entière en capitales se lit moins bien, et le site en a
plusieurs.

Effet de bord mesuré : les polices d'une page passent de **89,8 à 47,3 ko**.

`node scripts/generer-images-marque.mjs` refabrique l'icône d'onglet, l'icône
iOS et l'image de partage. Le symbole y est tracé avec **les mêmes coordonnées
que le composant**, donc l'icône est le dessin de l'en-tête et non une
approximation. L'icône est l'**inversion** de la planche — symbole clair sur
carré d'encre : à seize pixels, un filet terracotta sur blanc cassé donne 2,16:1
et disparaît.

## Référencement et poids## Référencement et poids

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

## Balises de recherche

Les titres et descriptions destinés aux moteurs ne sont **pas** ceux affichés à
l'écran. Ils vivent dans `DICT[locale].seo`, par chemin
([`src/lib/i18n.ts`](src/lib/i18n.ts)), et `metadonneesPage`
([`src/lib/seo.ts`](src/lib/seo.ts)) les pose.

Cette séparation vient d'un défaut mesuré. Le h1 de la page Services dit
« Services » : juste à l'écran, où le menu et le logo disent déjà le reste, et
absurde dans une page de résultats, où le titre apparaissait seul —
`<title>Services</title>`, sans marque, sans métier, sans ville. Les quatre
pages intérieures avaient ce défaut. Les deux accueils, eux, s'annonçaient
« … — NEXUS UI » : le nom du gabarit technique, hérité du `template` de la mise
en page racine.

Le titre est donc posé en `title: { absolute }`, forme qui ignore explicitement
tout `template` ancestral.

`npm run verify:seo` fige tout cela. Sur les neuf pages du site, il vérifie :

| Contrôle | Règle |
| --- | --- |
| Titre | 25 à 60 caractères, unique, nomme la marque, ne nomme pas le gabarit |
| Description | 110 à 160 caractères, unique |
| Canonique | pointe sur la page elle-même |
| Alternates | `fr`, `en` et `x-default` présents |
| Partage | `og:title` identique au titre, `og:image` présente |
| Structure | exactement un `h1` |
| Données structurées | JSON valide, chaque nœud a son `@type`, chaque bloc son `@context` |

Le plafond de 60 caractères correspond à une troncature réelle dans les
résultats ; le plancher de 25 est plus bas que les 50 recommandés parce que
« Mentions légales — Studio Sentis » en fait 32 et que le rallonger reviendrait
à suivre une règle de pouce contre son intention.

Le contrôle a été **vérifié capable d'échouer** : servi le `<head>` tel qu'il
était avant correction, il remonte 132 constats et sort en erreur.

## Performance

Deux mesures, faites au navigateur sur un gabarit de téléphone :

- **LCP de l'accueil : 1 148 → 920 ms.** Le titre de la page en était l'élément
  le plus grand, et il était animé en opacité : le navigateur n'enregistre le
  LCP qu'au moment où l'élément devient réellement visible, donc l'animation
  repoussait la mesure de toute sa durée. L'option `sansFondu` de `Reveal3D`
  anime la position sans l'opacité. À réserver à l'élément LCP d'une page.
- **Pré-navigation.** `next/link` préchargeait la charge utile React ; les
  règles de spéculation demandent le **rendu complet** de la page suivante.
  `eagerness: "moderate"` et non `eager` : au survol, donc sur un geste
  d'intention, plutôt que les cinq pages dès l'arrivée — un studio qui vend des
  sites légers ne peut pas faire télécharger cinq pages à qui n'en lira qu'une.

Ce que l'outil d'audit recommandait et qui **ne s'applique pas ici** :
`fetchpriority="high"` sur l'image LCP. Mesure à l'appui, le LCP est du texte
sur les trois pages testées ; le site n'a aucune image dans la zone visible.

## Données structurées

Un seul `@graph` par page, dont les nœuds se rattachent par `@id` :

- l'accueil décrit l'entreprise (`ProfessionalService`, `@id` `…/#studio`) et le
  site (`WebSite`, `…/#site`) ;
- chaque page intérieure pose un `WebPage` — ou `AboutPage`, `ContactPage`,
  `CollectionPage` — qui renvoie à ces deux `@id` au lieu de redéclarer
  l'entreprise. Deux déclarations indépendantes du même commerce, si elles
  divergent d'un caractère, valent moins qu'une seule ;
- la page Services ajoute un nœud `Service` par métier, avec son `provider` et
  sa zone.

Trois corrections y ont été faites, chacune sur un fait vérifiable :

- **le forfait mensuel mentait.** La page affiche « 85 $ / mois » ; le balisage
  réduisait ce texte à ses chiffres et annonçait un prix unique de 85 $. Un prix
  récurrent se déclare avec une `UnitPriceSpecification` ;
- **`areaServed` nommait des lieux sans les identifier.** « Châteauguay »
  désigne aussi une rivière et une circonscription. Chaque zone porte désormais
  ses `sameAs` Wikipédia et Wikidata, **vérifiés contre l'API de Wikipédia**, pas
  écrits de mémoire ;
- l'entité porte enfin son `image`, son `logo` et son `priceRange`.

## Robots d'IA et llms.txt

[`src/app/robots.ts`](src/app/robots.ts) nomme les robots d'IA au lieu de les
laisser au groupe fourre-tout, et les sépare en deux familles : ceux qui lisent
pour **citer** avec un lien (OAI-SearchBot, Claude-SearchBot, PerplexityBot) et
ceux qui lisent pour **entraîner** sans lien retour (GPTBot, ClaudeBot, CCBot,
Google-Extended, Applebot-Extended). Les deux sont autorisés ; la constante
`ENTRAINEMENT` suffit à fermer la seconde famille le jour où cette réponse
change.

[`/llms.txt`](src/app/llms.txt/route.ts) est publié, **et ce n'est pas un levier
de référencement.** Google écrit dans sa documentation que sa recherche ignore
ces fichiers ; une étude de journaux de serveur mesure 0,1 % du trafic des
robots d'IA dessus. Il est là parce que la catégorie « Agentic Browsing » de
Lighthouse le vérifie et qu'un agent à qui l'on donne l'adresse du studio y
trouve en quinze lignes ce qu'il devrait sinon deviner. Il est régénéré depuis
le dictionnaire, donc il ne peut pas diverger du site.

## Pages légales

Deux pages, [`/mentions-legales`](src/app/(sentis)/[locale]/mentions-legales) et
[`/confidentialite`](src/app/(sentis)/[locale]/confidentialite), dont le texte
vit dans [`src/lib/legal.ts`](src/lib/legal.ts).

La politique de confidentialité n'est pas un formulaire recopié : elle décrit ce
que ce site fait réellement, ce qui se trouve être remarquablement peu.

- **Aucune mesure d'audience, aucun témoin de suivi, aucun pixel.** Vérifiable :
  `grep -rn "gtag\|analytics\|fbq\|plausible" src/` ne renvoie rien.
- **Le formulaire n'envoie rien à un serveur.** Il compose un message et le
  remet au logiciel de courrier du visiteur — voir
  [`formulaire.tsx`](src/components/sentis/formulaire.tsx). Rien n'est stocké
  entre-temps, rien ne part tant que le visiteur n'a pas envoyé lui-même.
- **La seule écriture sur l'appareil** est la préférence de thème, posée par le
  visiteur via le sélecteur du menu (`next-themes`, `localStorage`).
- **La communication hors Québec est dite**, parce qu'elle existe : l'adresse de
  contact est une adresse Gmail, donc les messages reposent sur des serveurs de
  Google hors de la province. La Loi 25 demande que ce soit écrit clairement
  plutôt qu'enfoui.

L'avis au point de collecte est sous le formulaire, pas seulement dans la page
dédiée : la loi vise le moment où la personne remplit le champ.

Trois détails de construction, chacun réglant un défaut précis :

- **Pas d'animation d'entrée** sur ces deux pages. On y vient pour vérifier un
  point, souvent parce qu'on hésite à faire confiance ; faire attendre le texte
  derrière une animation est, à cet endroit, le mauvais signal. Elles sont donc
  aussi imprimables et lisibles sans JavaScript sans passer par le filet
  `data-entree-animee`.
- **Des ancres stables** (`#section-3`), indépendantes de la langue et du
  libellé : un point cité dans un courriel reste atteignable après une
  reformulation. Le sommaire latéral est fait d'ancres nues — il fonctionne sans
  JavaScript, ce qui est vérifié.
- **La date de révision** vit dans `LEGAL_MAJ`
  ([`src/lib/site.ts`](src/lib/site.ts)), à un seul endroit pour les deux
  langues. Elle est formatée en UTC explicite : sans cela, un serveur à Montréal
  daterait la politique de la veille.

**À relever `LEGAL_MAJ` chaque fois que le texte change.** C'est la seule
information de ces pages qu'un visiteur peut vérifier.

## Dépannage

**`SyntaxError: Unexpected non-whitespace character after JSON` au lancement,
avec un `page: '/fr/…'`**

Ce n'est pas le code du site : cette erreur vient de `JSON.parse`, et rien ici
n'appelle `JSON.parse`. C'est un manifeste de Next, dans `.next/`, qui contient
**deux documents JSON collés** — le message le dit littéralement : du JSON
valide s'arrête à une position donnée, et d'autres octets suivent.

Cela arrive quand deux processus Next écrivent le même dossier `.next` : un
serveur de développement resté ouvert dans un autre terminal, ou un
`npm run build` lancé pendant qu'un `npm run dev` tourne. Un `307` inattendu sur
une page qui existe est le second symptôme du même dossier périmé.

D'abord constater, plutôt que d'effacer à l'aveugle :

```bash
node -e "const {readdirSync,readFileSync}=require('fs');const {join}=require('path');
(function w(d){for(const e of readdirSync(d,{withFileTypes:true})){const p=join(d,e.name);
if(e.isDirectory())w(p);else if(e.name.endsWith('.json')){try{JSON.parse(readFileSync(p,'utf8'))}
catch(err){console.log('CORROMPU',p,err.message)}}}})('.next')"
```

Puis :

```bash
pkill -f "next dev"; pkill -f next-server   # ou fermer les autres terminaux
rm -rf .next
npm run dev
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
