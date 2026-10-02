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
| Pages légales (Loi 25, Charte de la langue française) | Faites — mentions légales et politique de confidentialité, FR et EN, avis au point de collecte sous le formulaire |

## 2. Ce qui a été testé

| Contrôle | Outil | Résultat |
| --- | --- | --- |
| TypeScript strict | `tsc --noEmit` | 0 erreur |
| Lint | `eslint` | 0 erreur, 0 avertissement |
| Build production | `next build` | Succès, 0 avertissement |
| Tokens de motion synchronisés | `npm run verify:tokens` | Identiques (contrôle prouvé capable d'échouer) |
| Page lisible sans JavaScript | `npm run verify` — 6 pages chargées JS désactivé | 0 constat (contrôle prouvé capable d'échouer : règle `<noscript>` retirée, 12 constats) |
| Budget de poids par page | `npm run verify:poids` — 6 pages, JS + CSS + polices | 0 constat (contrôle prouvé capable d'échouer : budget abaissé à 700 ko, 1 constat) |
| Contraste de la palette | `npm run verify:teintes` — 4 teintes × 4 couleurs de texte, plus 4 accents × 3 situations, × 2 thèmes | 0 constat (contrôle prouvé capable d'échouer : teinte assombrie, 2 constats). Il a corrigé quatre valeurs avant livraison, voir ci-dessous |
| Texte lisible devant les scènes 3D | `npm run verify:scene` — 6 pages × 2 largeurs × 2 thèmes, titre masqué | 0 constat (contrôle prouvé capable d'échouer : opacité poussée à 4, 8 constats) |
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

### Défauts de référencement et de poids

| # | Problème | Correctif |
| --- | --- | --- |
| 48 | **Les quatre pages intérieures se désindexaient elles-mêmes.** Ne définissant que leur titre et leur description, elles héritaient de la canonique de la mise en page : `/fr/services` déclarait `rel="canonical"` vers `/fr`. Traduction pour un moteur : « cette page est un doublon de l'accueil » | `src/lib/seo.ts` : une fonction que toute page nouvelle doit appeler, qui pose canonique, `hreflang` et Open Graph propres à la page |
| 49 | Même cause, mêmes effets sur les balises Open Graph : partagées, les quatre pages annonçaient le titre et l'URL de l'accueil | idem |
| 50 | `<html lang="fr">` sur **tout le site anglais** : la mise en page racine sert /fr et /en et ne connaît pas la langue | Le conteneur du site porte `lang`, et un script le corrige sur le document avant la peinture. **Compromis assumé** : la solution propre est une mise en page racine par groupe de routes, ce qui demande de déplacer la redirection de `/`, le 404 et les conventions d'icônes |
| 51 | Le site de l'agence préchargeait les **trois familles de polices de la vitrine** — sept fichiers, 188 ko sur chaque page, pour des familles qu'il n'affiche jamais | Polices isolées dans leur module, posées par les seules mises en page concernées : 2 fichiers, 89 ko |
| 52 | Premier essai d'isolation : `not-found.tsx` importait ces polices. Or il fait partie de l'arbre de **toutes** les routes — elles étaient de nouveau préchargées partout, et la mesure n'a pas bougé d'un octet | Le 404 compose avec les polices du système |
| 53 | Un module unique important `domAnimation` **et** `domMax` de Motion les plaçait dans le même morceau : le site de l'agence payait le jeu complet. Chemin critique passé de 889 à 932 ko | Deux fichiers, un par jeu |
| 54 | `next/dynamic` seul n'a rien changé : le morceau est cherché au **montage** du composant, c'est-à-dire tout de suite | Montage repoussé à `requestIdleCallback` ; le globe attend en plus que son cadre approche |
| 55 | L'initialiseur paresseux de « monter quand visible » testait `IntersectionObserver`, absent au serveur et présent au client : premier rendu divergent, **erreur React #418**, 18 constats au contrôle navigateur | `useSyncExternalStore`, fait exactement pour cela |

Les n° 48 et 50 ne pouvaient être trouvés qu'en lisant le HTML servi. Aucun des
outils du projet ne regardait les balises de référencement, et aucun ne
regardait ce qu'une page coûte — d'où `npm run verify:poids`.

### Globe de la page contact

| # | Problème | Correctif |
| --- | --- | --- |
| 45 | Le schéma plat qu'il remplace inventait sa géographie — fleuve et île dessinés à main levée. Il portait la mention « pas à l'échelle », mais un site qui refuse d'inventer n'avait pas à dessiner un continent approximatif | Trait de côte réel (Natural Earth, domaine public), Châteauguay à ses coordonnées, et la seule approximation restante — le halo local — nommée sur le dessin |
| 46 | L'étiquette « Châteauguay » se posait à 12 px du point, donc par-dessus ses propres anneaux, et traversait les côtes au fil de la rotation | Reculée au-delà du halo, sur un fond opaque |
| 47 | TypeScript perdait le rétrécissement de type du contexte de canvas dans la fonction de tracé, remontée à la compilation | Contexte recopié dans une constante |

### Défauts de la palette vive

| # | Problème | Correctif |
| --- | --- | --- |
| 42 | Le vert #15803d ne donnait que **4,30:1** sur son propre fond de section, et le cyan #0e7490 passait de justesse à 4,52:1 | Les deux assombris, à 6,52:1 et 6,55:1 sur le papier |
| 43 | Du blanc posé sur un aplat d'accent tombait à **1,82:1 en thème sombre** : les accents s'y éclaircissent, le blanc ne suit pas. Une classe `text-white` écrite en dur sur un panneau plein aurait livré cela tel quel | Token `--accent-contrast`, qui bascule du blanc au presque-noir selon le thème ; le contrôle mesure cette paire et non « du blanc » |
| 44 | Sur téléphone en thème sombre, le tore cyan ramenait le chapô des Services à **4,27:1** : une couleur vive éclaire bien plus le fond qu'un gris, à opacité égale | Opacité des scènes sur écran étroit descendue de 35 % à 24 % |

### Défauts des scènes 3D

| # | Problème | Correctif |
| --- | --- | --- |
| 41 | **Sans JavaScript, le site était blanc.** Les entrées au scroll sont rendues côté serveur à `opacity: 0` pour ne pas clignoter ; sans JS elles ne repassent jamais à 1. Le titre du héros, les cartes, la grille de prix, l'appel final : tout le texte était livré, et invisible. C'est le défaut n° 4 revenu par une autre porte, et plus large | Une règle sous `<noscript>` remet à plat toute enveloppe marquée `data-entree-animee`. Contrôle ajouté à `npm run verify` : chaque page est chargée une fois avec JavaScript désactivé |
| 36 | La couleur de la scène était lue avec `couleur / 255` quelle que soit l'écriture rendue par le navigateur. Dès qu'un modificateur d'opacité Tailwind passait par `color-mix`, `getComputedStyle` renvoyait `color(srgb 0.71 0.67 0.6 / 0.7)` : les trois valeurs, divisées par 255, donnaient du noir. L'onde de la section encre **assombrissait** le fond au lieu de l'éclaircir | Les deux écritures sont reconnues ; `color(...)` est lue en flottants |
| 37 | L'anneau est tracé dans le plan XY, normale vers la caméra. Avec la part de défilement à plein, il arrivait déjà tourné de 69° et se lisait comme un tube, pas comme un tore | Assiette posée presque de face et part de défilement bornée à 0,45 sur les en-têtes |
| 38 | Le prisme CSS débordait sa colonne : ses faces sont en position absolue, donc la boîte ne les mesurait pas, et la page entière partait hors du viewport en tournant | Largeur explicite de 1,7 × la taille |
| 39 | Sur téléphone, l'anneau passait derrière le chapô. Mesuré : **4,11:1** sur les Services en thème sombre, sous le plancher de 4,5 | Sous 640 px la scène descend sous le bloc de texte et son opacité tombe à 35 % ; les deux valeurs sont celles qui font passer le contrôle |
| 40 | La première version du contrôle de contraste mesurait des centiles de luminance dans la boîte du titre. Elle accusait « Services » à 1,65:1 alors que rien n'allait : dans une boîte large d'une mesure entière, les pixels de glyphe pèsent moins de 8 % | Le titre est rendu invisible avant la photo ; on compare sa couleur CSS au pire pixel du fond |

Le n° 36 n'a été vu par aucun outil : ni le build, ni le lint, ni le détecteur,
ni le contrôle responsive. Il a fallu regarder une capture de la section encre
et trouver l'onde plus sombre que son fond.

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

### Défauts trouvés en construisant les pages légales

| # | Problème | Correctif |
| --- | --- | --- |
| 56 | Une page d'identité d'entreprise ne peut pas être remplie au jugé, et une page à moitié fausse indexée est pire qu'une page absente | `EXPLOITANT` lu depuis l'environnement ; chaque valeur absente s'affiche « à compléter », la page se déclare `noindex` à elle seule et sort du sitemap. Vérifié dans les deux sens : reconstruit avec les quatre variables, le `noindex` disparaît, la page entre au sitemap et les valeurs remplacent les trous |
| 57 | Déclarer dans le sitemap une page qu'on demande par ailleurs de ne pas indexer — contradiction que la Search Console remonte en erreur | `sitemap.ts` n'ajoute `/mentions-legales` que si l'identité est complète |
| 58 | 750 px de vide à droite sur 1216 : la colonne de texte fait 464 px, et ces pages n'ont ni scène, ni carte, ni colonne d'informations pour remplir le reste comme partout ailleurs | Sommaire collant à partir de `lg`, colonne de texte plafonnée à 36rem pour qu'il ne reste pas un demi-écran entre les deux. Ancres nues : il fonctionne sans JavaScript, ce qui est vérifié au navigateur |
| 59 | `LEGAL_MAJ` est une date sans heure, donc minuit UTC : un serveur à Montréal aurait daté la politique de la veille | `toLocaleDateString` avec `timeZone: "UTC"` explicite |
| 60 | Crédit de polices écrit de mémoire — « Fraunces et Inter » — alors que le site compose en Fraunces et Source Sans 3 | Vérifié dans les imports `next/font` avant publication ; la liste porte les quatre familles réellement chargées plus Lucide |
| 61 | `.env.example` était exclu par `.gitignore` (`.env*`) alors que le README y renvoie : lien mort pour quiconque clone, et aucune trace des variables attendues | Exception `!.env.example` ; le gabarit est versionné, il ne contient que des exemples |
| 62 | Une année de copyright au pied de page serait figée au jour de la construction, ces pages étant statiques : « © 2026 » affiché en 2028 | Pas d'année du tout. Mieux vaut ne rien dater que dater faux |

### Défauts trouvés en repassant le site à la grille de `AgriciDaniel/claude-seo`

Le dépôt a été cloné et ses contrôles exécutés contre le site servi en local
(`agentic_check.py`, `parse_html.py`, plus les seuils de `skills/seo-page`).
Aucun de ces défauts n'est visible à l'écran : ils vivent tous dans le `<head>`
ou dans le balisage, que ni le contrôle navigateur, ni le lint, ni la
construction ne regardaient.

| # | Problème | Correctif |
| --- | --- | --- |
| 63 | Les deux accueils s'annonçaient « … — NEXUS UI » : le nom du gabarit technique dans le titre de recherche de l'agence, hérité du `template` de la mise en page racine. 92 caractères pour `/fr`, tronqué au tiers | `title: { absolute }`, forme qui ignore tout `template` ancestral, et titres réécrits à 60 caractères ou moins |
| 64 | Les quatre pages intérieures reprenaient leur titre affiché : `<title>Services</title>`, seul, sans marque, sans métier, sans ville. Même défaut sur `og:title` | Titres de recherche séparés des titres affichés, dans `DICT[locale].seo`, par chemin |
| 65 | Description de `/fr/realisations` à 226 caractères — tronquée aux deux tiers — et celle de `/fr/a-propos` à 66, soit la moitié de la place laissée vide. Aucune description intérieure ne nommait la ville | Descriptions dédiées, 110 à 160 caractères, ville sur les pages commerciales |
| 66 | L'entité d'entreprise n'existait que sur l'accueil : les pages intérieures ne portaient qu'un `BreadcrumbList`. Un moteur arrivant sur `/fr/services` depuis une recherche n'y trouvait rien sur l'entreprise | `@graph` avec `@id` stables (`…/#studio`, `…/#site`) ; chaque page pose un `WebPage`/`AboutPage`/`ContactPage`/`CollectionPage` qui s'y rattache au lieu de redéclarer l'entreprise |
| 67 | **Le balisage contredisait la page** : « 85 $ / mois » à l'écran, `price: "85"` dans les données structurées, soit un prix unique | `UnitPriceSpecification` avec `unitCode: "MON"` ; le texte affiché reste la source |
| 68 | `areaServed` nommait quatre lieux sans les identifier — « Châteauguay » désigne aussi une rivière et une circonscription | `sameAs` Wikipédia et Wikidata, chaque identifiant vérifié contre l'API de Wikipédia avant d'être écrit (le premier que j'avais supposé, Q140130, n'était pas la bonne ville) |
| 69 | L'entité n'avait ni `image`, ni `logo`, ni `priceRange`, et la page Services aucun nœud `Service` | Ajoutés ; un `Service` par métier, avec `provider` et zone |
| 70 | Aucune politique explicite envers les robots d'IA : tout reposait sur le groupe `*`, qui confond les robots qui citent avec un lien et ceux qui entraînent sans retour | Groupes nommés dans `robots.ts`, séparés en deux familles, les deux autorisées, avec une constante pour fermer la seconde |
| 71 | `/llms.txt` absent — vérifié par la catégorie « Agentic Browsing » de Lighthouse | Publié, régénéré depuis le dictionnaire. **Sans lui prêter de valeur de référencement** : Google documente que sa recherche l'ignore |

Le contrôle `npm run verify:seo` fige l'ensemble. Il a été vérifié capable
d'échouer : servi le `<head>` d'avant correction, il remonte 132 constats.

Il a aussi attrapé, dès sa première exécution, une description que je venais
d'écrire à 163 caractères. C'est le genre de défaut qu'on ne voit pas en se
relisant.

### Mesuré et laissé tel quel

| Constat | Décision |
| --- | --- |
| Les intitulés de section du pied de page sont des `h2` (« Menu », « Châteauguay, Québec · Français et anglais ») | **Gardé.** Ils gonflent la liste des `h2` du document, mais ils donnent à un lecteur d'écran un titre pour chaque bloc du pied. Google ne classe pas sur le nombre de `h2` ; l'échange serait perdant. |
| La vitrine `/nexus` est indexable et occupe neuf entrées du plan du site | **Laissé au client.** C'est une démonstration de capacité, donc du contenu de portfolio légitime ; c'est aussi neuf pages hors sujet pour une agence locale. Le trancher relève du positionnement, pas de la technique. |
| Livraison Markdown par négociation de contenu (`Accept: text/markdown`), en-tête `Content-Signal` | **Non fait.** Le dépôt d'audit note lui-même qu'aucun agent consommateur n'est confirmé les demander. |

### Marque, page de lancement et suite du SEO

| # | Problème | Correctif |
| --- | --- | --- |
| 72 | **Le générateur d'images de marque tombait en silence sur une police de repli.** Il chargeait Fraunces par `<link>` vers fonts.googleapis.com ; dans un environnement où cette requête échoue — proxy dont le certificat n'est pas reconnu par Chromium — `document.fonts.ready` se résout quand même et la capture part. Les icônes et l'image de partage livrées jusqu'ici **n'étaient pas dans la police du site**, et rien ne pouvait le montrer sans comparer les lettres | Polices lues sur le disque et encodées en base64 dans la page ; `document.fonts.check` interrogé avant chaque capture, et le script s'arrête si une police manque |
| 73 | La barre de page active flottait à mi-hauteur de l'en-tête au lieu de se poser sur son filet | Lien à pleine hauteur (`h-16`, `items-stretch`) et barre à `-bottom-px`. Écart mesuré au navigateur : 0 px |
| 74 | Le nouveau logotype posait « studio » à `opacity-55`. Le contrôle navigateur a levé 20 constats : sa règle attrape tout texte sous 90 % d'opacité, parce que c'est ainsi que se manifeste une entrée au défilement restée bloquée | `text-ink-muted`, un token mesuré par `verify:teintes`, au lieu d'une opacité qui échappe aux barrières de contraste |
| 75 | La date de fin de l'offre s'affichait « 1 janvier 2027 » pour le 31 décembre 23 h 59 heure de l'Est : la page est construite sur un serveur en UTC. **Défaut déjà corrigé sur la date des pages légales, et réintroduit ici** | `timeZone: "America/Toronto"` explicite |
| 76 | Le titre de l'accueil, élément LCP de la page, était animé en opacité : le navigateur n'enregistre le LCP qu'à la visibilité réelle, donc l'animation repoussait la mesure. 1 148 ms sur un téléphone, contre 148 ms sur une page intérieure | Option `sansFondu` de `Reveal3D` : la position s'anime, l'opacité non. Mesuré à 920 ms après |
| 77 | Aucune pré-navigation : `next/link` préchargeait la charge utile React, pas le rendu | Règles de spéculation en `eagerness: "moderate"` — au survol, donc sur un geste d'intention, et non les cinq pages dès l'arrivée |
| 78 | La page Réalisations présentait trois démonstrations comme des pièces de portfolio | Remplacées par l'offre de lancement, à la demande du client. Les textes qui en dépendaient ont suivi : mentions légales, `llms.txt`, description de recherche |

### Vérifié et non retenu

| Constat de l'outil | Décision |
| --- | --- |
| `preload_check.py` : « marquer l'image LCP en `fetchpriority="high"` » | **Sans objet, mesuré.** Le LCP est du texte sur les trois pages testées — `H1` sur l'accueil, `P` ailleurs. Le site n'a aucune image dans la zone visible. |
| `content_quality.py` : seuil à 60 | **Passé partout.** Accueil 89, Services 94, À propos 86, Réalisations 86. Vider la page Réalisations ne l'a pas rendue maigre. |
| `--teinte-vert` (Olive Yellow) se détache mal du papier crème | **Laissé tel quel, et c'est un jugement, pas un défaut.** Les quatre teintes sont à la même distance de luminance du papier — 1,130 à 1,134:1. L'olive ne se distingue pas moins ; elle partage seulement la famille de teinte du crème. L'écraser par une valeur inventée reviendrait à sortir de la combinaison Wada que le client a demandée. |
| `--teinte-violet` (Lilac) lit comme un rose plutôt qu'un lavande | **Laissé tel quel.** C'est la teinte de `Lilac` dans le livre. Un choix de direction, à trancher par le client, pas par le contraste. |
| Livraison Markdown, en-tête `Content-Signal` | **Toujours non fait.** Le dépôt d'audit note lui-même qu'aucun agent consommateur n'est confirmé les demander. |

### Couleur des animations et lecture guidée

| # | Problème | Correctif |
| --- | --- | --- |
| 79 | La scène de chaque page était **monochrome**, et la poussière d'À propos est devenue presque invisible au passage à la palette Sanzo Wada : sa couleur, l'olive, est la plus proche du papier crème | Le nuancier du shader passe à trois couleurs, réparties sur la graine déjà portée par chaque sommet. Aucune géométrie ni attribut de plus. Une page qui ne déclare qu'une couleur voit les trois uniformes prendre la même valeur : le mélange est alors un no-op et les autres scènes ne bougent pas d'un pixel |
| 80 | **La lecture des couleurs supplémentaires échouait en silence.** `color` est une vraie propriété CSS, donc toujours sérialisée en `rgb(...)` ; une **propriété personnalisée** garde le flux de jetons écrit à la source, donc `#016e5e` sort tel quel. L'expression numérique y trouvait « 016 » et « 5 » — deux nombres — et la scène retombait sur sa couleur unique sans que rien ne le signale | Lecture de l'hexadécimal ajoutée, prouvée sur les quatre écritures (`#rgb`, `#rrggbb`, `rgb()`, `color(srgb …)`) |
| 81 | À opacité égale, `poussiere` sortait à 0,37 quand `treillis` sortait à 0,60 : le moteur applique aux points un facteur 0,62 que les lignes n'ont pas, et cette variante n'a **aucune arête** | Opacité par volume plutôt qu'uniforme. Le plafond n'est pas choisi à l'œil : `verify:scene` mesure le texte devant chaque scène, en 1280 et 390 px, dans les deux thèmes |
| 82 | Les faces du prisme d'À propos étaient toutes du même papier translucide : en tournant, l'objet ne faisait défiler aucune couleur | Une teinte de section par face. Les **teintes** et non les accents : ce sont les seules valeurs de la palette mesurées pour porter du texte |
| 83 | Le bloc « Une page vide, et c'est voulu » porte l'argument central de la page Réalisations et devait être lu jusqu'au bout ; rien n'y incitait | `TexteProgressif` : les mots s'allument au défilement. **Ce qui s'anime est la couleur, pas l'opacité** — un fondu ferait échouer la règle `invisible-in-view`, et à juste titre, puisqu'une opacité arbitraire échappe aux mesures de contraste. Les deux bornes sont des tokens mesurés (`--ink-muted` 4,8:1, `--ink` 15:1), donc aucune image de l'animation n'est illisible |
| 84 | Première plage de défilement trop courte : le bloc était entièrement allumé après sept cents pixels, soit moins d'un écran. L'effet existait mais ne durait pas assez pour tenir le lecteur — toute sa raison d'être | Plage élargie à `start 0.95 → end 0.42` |

| 85 | **L'effet du texte progressif ne se voyait pas.** Il fonctionnait — sonde à l'appui, les mots passaient bien de `rgb(110,102,89)` à `rgb(26,23,20)` au fil du défilement — mais les deux tokens sont trop proches sur un fond crème. Le client, qui l'avait demandé, ne l'a pas trouvé sur la page : un effet qu'on doit chercher n'existe pas | Trois arrêts au lieu de deux : le front de vague passe par l'accent de la page. Les trois sont des tokens mesurés (4,8:1, 5,9:1, 15:1), donc aucune image de l'animation n'est illisible. Fenêtre par mot élargie de six à douze mots, pour que le front se lise comme un mouvement et non comme un scintillement |
| 86 | Ma première sonde concluait à tort que « tous les mots sont à l'encre à toutes les positions » : elle lisait `p span`, ce qui attrapait aussi le logotype du pied de page, et `ps[ps.length-1]` désignait un paragraphe non animé | Sonde reprise sur des index explicites. Noté ici parce qu'une mesure fausse coûte plus cher qu'une absence de mesure : elle a failli faire réécrire un composant qui marchait |

| 87 | **L'effet mot à mot était distrayant.** Devenu visible grâce au front coloré (n° 85), il révélait son vrai défaut : une vague qui traverse les mots **au milieu d'une phrase** coupe la lecture au lieu de la porter. Le client l'a dit en un mot, « trop distrait », et il avait raison — un effet de lecture qui attire l'œil sur lui-même a échoué, quelle que soit sa justesse technique | Refait sur le principe des paroles défilantes : **une ligne à la fois est allumée, les autres sont en retrait**. L'unité devient la ligne et non le mot, donc rien ne bouge à l'intérieur d'une phrase. Plus d'accent coloré : c'est lui qui distrayait. Reste un plateau — la courbe monte, tient, redescend — sans lequel la ligne active clignoterait au moindre mouvement de molette |
| 88 | Un découpage automatique du texte en phrases se casse sur « Marie L. » et sur « : » | Les lignes sont écrites à la main dans le dictionnaire. C'est le rythme de lecture qui décide d'une coupe, pas la ponctuation — aucune expression régulière ne sait faire ce choix |

### Décision rendue

Trois volumes ont été comparés en mouvement sur une page d'aperçu temporaire.
Le client a retenu **A (double hélice) et B (constellation)** ; le ruban de
Möbius est écarté et il n'en reste rien dans le code.

| Page | Avant | Après |
| --- | --- | --- |
| Services | `anneau` | `helice` |
| Réalisations | `treillis` | `constellation` |

La couleur dominante de chaque page **ne change pas** — cyan pour Services,
violet pour Réalisations : c'est elle qui dit qu'on a changé de page avant
d'avoir lu le titre, et elle survit au changement de volume.

La page d'aperçu est supprimée. `anneau` reste dans le moteur sans être posé
sur aucune page : il fait partie du jeu de base (treillis, onde, anneau,
poussière) que la bibliothèque de mouvement documente, et `treillis` sert
toujours au héros de l'accueil.

### Passage à la planche « Concept 16 »

| # | Problème | Correctif |
| --- | --- | --- |
| 89 | **La planche de marque affirme un contraste qui n'existe pas** : « BLANC SUR ACCENT — contraste valide ». Mesuré : **2,34:1**, plancher 4,5. Appliqué tel quel, tout texte blanc sur le terracotta aurait été illisible | `--signal-contrast: #1a1a1a`. Le noir sur l'accent donne 7,42:1 ; c'est ce couple-là que la planche aurait dû nommer |
| 90 | Trois des cinq couleurs ne portent pas de texte sur le papier (beige 1,27:1, accent 2,16:1, gris souple 2,85:1) | Assombries à teinte et saturation constantes jusqu'au plancher, jamais remplacées. La planche reste reconnaissable, et les deux couleurs reprennent leur valeur d'origine en thème sombre |
| 91 | `--signal` et `--accent-*` portent la même couleur à deux valeurs, et j'avais posé le même `--accent-contrast` sur les deux : noir sur l'accent **foncé** donnait 2,80:1 | Deux valeurs, deux contrastes opposés — clair sur l'accent foncé (5,73:1), noir sur l'accent clair (7,42:1) |
| 92 | Les contrôles de contraste lisent les tokens un par un : une indirection `var(--accent-terre)` leur renvoie un flux de jetons au lieu d'une couleur, et quatre accents sont sortis « introuvables » | Valeurs écrites en clair. Un token de couleur doit être une couleur |
| 93 | L'accent terre est bien plus clair que le violet qu'il remplace : à opacité inchangée, le chapô du héros tombait à **2,69:1** sur le pire pixel de fond en thème sombre | Opacité de la scène descendue par paliers mesurés — 0,38 donnait 3,16:1, 0,24 donnait 4,47:1 — jusqu'à 0,20, où `verify:scene` repasse |

**Effet de bord mesuré :** une seule famille au lieu de deux, plus la
suppression du sous-ensemble dédié au logo, font passer les polices d'une page
de **89,8 à 47,3 ko**.

**Ce que la direction coûte, et c'est dit sans détour :** la planche n'a qu'un
accent, donc les quatre couleurs de section issues de Sanzo Wada disparaissent,
et les pictogrammes des quatre services perdent leur couleur propre. Les
sections se distinguent désormais par la chaleur et la valeur. C'est une
conséquence de l'identité choisie, pas un oubli.

## 4. Problèmes restants

Aucun n'est bloquant. Ils sont listés parce que le §13 exige qu'ils le soient.

| Constat | Occurrences | Décision |
| --- | --- | --- |
| `em-dash-overuse` — tirets cadratins | 3 pages | **Réel, partiellement traité.** Tic d'écriture qui fatigue la lecture. Une passe a été faite sur la page Design System ; les autres restent à relire. |
| `nested-cards` — carte dans une carte | 34 sur Composants, Motion Lab et Dashboard | **Inhérent.** Une galerie de composants ne peut pas montrer un composant `Card` sans l'encadrer dans un bloc de démonstration. À revoir si le motif apparaît hors galerie. |
| `cramped-padding` — enfants au ras d'une bordure | 7 sur la vitrine, 9 sur le site de l'agence | **Assumé, mesuré.** Deux causes distinctes. Sur la vitrine : grilles à filet unique (`gap-px`), les cellules ont leur padding, c'est la grille porteuse qui n'en a pas — le procédé suisse recherché. Sur le site de l'agence : les boutons shadcn ont une hauteur fixe et zéro padding vertical ; mesuré au navigateur, le lien d'appel à l'action fait 32 px de haut pour 14 px de texte et le bouton d'envoi 36 px pour 16 px, soit 9 à 10 px de part et d'autre. La règle lit le padding, pas l'espace réel. |
| `layout-transition` — `transition: height` | 3 sur la vitrine, 1 par page sur le site de l'agence | **Réel, non corrigé.** Vient de `transition-all` sur le bouton shadcn et de l'accordéon. Le passage à `grid-template-rows` demande de modifier un composant vendu ; à traiter avec la revue des primitives. |
| `nested-cards` sur les cartes en section teintée | 3 sur À propos, 3 sur l'accueil | **Non localisé, et je le dis plutôt que de l'appeler faux positif.** Le compte suit exactement le nombre de cartes posées dans une section teintée, et il a monté quand ces cartes ont reçu une entrée 3D. Mais la chaîne d'ancêtres d'une carte, relevée au navigateur, ne contient aucune boîte décorée : l'enveloppe d'animation ne porte que `perspective`, le `li` et le `ul` sont nus, et la section sable n'a ni rayon ni ombre. Un essai de suppression d'un niveau de `div` (les classes de carte portées par l'élément animé lui-même) n'a rien changé au compte. Visuellement, les captures ne montrent aucune carte dans une carte. Reste ouvert. |
| `nested-cards` sur les pages de réalisations | 1 sur `/fr`, 3 sur `/fr/realisations` | **Inhérent, vérifié.** Sonde DOM à l'appui : les seules occurrences restantes sont les cartes produits de la démo boulangerie à l'intérieur du cadre de navigateur, et l'écran du téléphone à l'intérieur de son châssis. Un cadre d'appareil n'est pas une carte, mais il en a la forme calculée. |
| `low-contrast` sur le bouton « Désactivé » | 1 | **Exemption assumée.** WCAG 1.4.3 exclut explicitement les composants d'interface inactifs. |

## 5. Ce qui n'est pas fait

- **§9.7 Settings** : écartée délibérément (voir plus haut).
- **Envoi du formulaire de contact** : le formulaire existe, valide ses champs
  et compose un courriel prérempli, faute de service d'envoi choisi. Un visiteur
  sans client de messagerie configuré reste donc sans chemin — c'est écrit
  sous le formulaire, ce n'est pas réglé.
- **Photographies** : aucune. Le studio n'a pas encore les siennes, et le site
  n'en emprunte pas. Les emplacements existent (les cadres d'appareil des
  réalisations), le jour où il y en aura.
- **Logo** : c'est un logotype typographique, pas une marque dessinée. Choisi
  comme solution la plus simple, à remplacer quand le studio aura tranché.
- ~~**Pages légales**~~ : **fait.** `/mentions-legales` et `/confidentialite`
  existent dans les deux langues, l'avis au point de collecte est sous le
  formulaire, et le texte décrit ce que le site fait réellement plutôt qu'un
  formulaire recopié. Ce qui reste manquant n'est pas du code mais des faits
  administratifs : nom légal, NEQ, adresse, hébergeur. Tant qu'ils manquent, la
  page les affiche comme des trous et se retire des moteurs (voir §3, n° 56).
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
- **Three.js** : toujours pas installé, et c'est maintenant un choix motivé.
  Les scènes 3D du site sont écrites en WebGL brut, une quarantaine de lignes de
  GLSL et un nuage de points généré en JavaScript. Three.js coûterait environ
  150 ko compressés au chargement pour un studio dont l'argument commercial est
  de livrer des sites rapides. Il redeviendra justifié le jour où une scène
  demandera des matériaux, des lumières ou un modèle importé.
- **Lenis** : non installé, aucune justification à ce jour.
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
| `src/lib/legal.ts` | Textes des deux pages légales, FR et EN, typés à la main |
| `src/lib/seo.ts` | Titres, descriptions, canoniques, hreflang et `@graph` de chaque page |
| `tests/seo-meta.mjs` | Contrôle des balises de recherche sur les 9 pages |
| `src/lib/site.ts` | Identité publique, identité de l'exploitant, `LEGAL_MAJ` |
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
npm run verify:scene
npm run verify:teintes
npm run verify:poids
npm run verify:seo
```
