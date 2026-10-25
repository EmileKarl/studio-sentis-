# Les fiches de communication

377 fiches au format 1080 × 1920, pour un statut WhatsApp.

## Le ressort : la fiche pose, elle ne répond pas

On ne commente pas une affirmation. On répond à une question, parce qu'on
croit savoir. C'est cette réponse en message privé qui est le but : elle
ouvre une conversation que personne n'aurait eue devant une publicité.

Les réponses sont donc ailleurs : **`REPONSES.md`**, dans ce dossier. C'est
votre antisèche. Quelqu'un répond à `047-vraifaux-papier.png` ? Vous cherchez
**047** dans le fichier.

**Ne publiez jamais la réponse sur la fiche.** Elle ne vaut que parce qu'elle
manque.

## Les quatorze familles

**Première vague — on répond en dix secondes.**

| Famille | Ce qu'elle fait | Nombre |
|---|---|---|
| `devinette` | Une question de métier qu'un non-spécialiste peut tenter | 30 |
| `vraifaux` | Une affirmation à trancher | 25 |
| `choix` | Deux chemins, un seul bon | 18 |
| `mot` | Un mot du métier, seul, sans explication | 32 |
| `phrase` | Un aphorisme. Ni question ni réponse | 35 |
| `chiffre` | Un chiffre nu et une ligne | 7 |
| `ici` | Châteauguay, Montérégie | 4 |

**Seconde vague — il faut s'asseoir.**

| Famille | Ce qu'elle fait | Nombre |
|---|---|---|
| `sixmots` | Une histoire complète en six mots. Rien d'autre | 38 |
| `laterale` | Une énigme de situation. Une mise en place, une pointe | 20 |
| `logique` | Un problème qui a une réponse exacte, et contre-intuitive | 17 |
| `code` | Une question de développement, du flottant au cache | 25 |
| `oeil` | Ce que la perception fait sans qu'on le lui demande | 18 |
| `paradoxe` | Une phrase qui se mord la queue | 12 |

**Et les jeux visuels**, répartis sur les deux vagues :

| | Nombre |
|---|---|
| `jeu` — compter, comparer, trouver l'intrus, voir ce qui n'existe pas | 96 |

## Les six mots

Le modèle est la nouvelle attribuée à Hemingway — *For sale: baby shoes,
never worn.* Six mots, une vie entière, et un trou que le lecteur comble tout
seul. C'est ce trou qui fait écrire les gens.

Elle n'est pas reprise ici : trop connue pour intriguer, et la recopier
serait emprunter une émotion qu'on n'a pas fabriquée. Les trente-huit sont
écrites pour ce studio, et la moitié ne parle pas du métier — une série qui
ne parlerait que de logos cesserait vite d'être une histoire pour redevenir
une publicité.

**Six mots exactement**, pas « environ six ». Le compte est vérifié au
chargement : une histoire de sept mots arrête le script. Elle en a déjà
arrêté une.

## Comment publier

Les fiches sont numérotées et **la coloration tourne** : bleu, papier, encre,
bleu… Publiées dans l'ordre, la série alterne d'elle-même. Une suite
monochrome lasse au troisième jour.

Quelques repères, pas une règle :

- **une par jour** suffit. Deux, c'est déjà une campagne ;
- gardez les `jeu` pour les jours creux : ce sont les plus partagés, parce
  qu'on envoie une illusion à quelqu'un, on n'envoie pas une publicité ;
- une `phrase` et un `sixmots` ne demandent rien. Ils servent à espacer les
  questions — et un statut qui ne demande rien se regarde plus longtemps ;
- les `laterale` et les `logique` prennent du temps à résoudre. Ne les posez
  pas deux jours de suite : laissez aux gens le temps de revenir ;
- les `paradoxe` n'ont pas de bonne réponse. C'est le seul endroit où vous
  pouvez discuter plutôt que corriger ;
- quand quelqu'un répond, **répondez vraiment** : la réponse dans
  `REPONSES.md` est écrite pour être recopiée telle quelle, ou dite avec vos
  mots.

## Refaire les fiches

```bash
node scripts/identite/fiches.mjs --tout        # les 215 PNG
node scripts/identite/fiches.mjs --fam mot     # une seule famille
node scripts/identite/fiches.mjs --n 20        # les 20 premières
node scripts/identite/planches.mjs             # les 11 planches-contact
node scripts/identite/verifier-fiches.mjs      # le contrôle de contraste
```

Les PNG ne sont pas suivis par git : 54 Mo qui se régénèrent en une commande
à partir du corpus et du gabarit, eux suivis. Les planches-contact et
`REPONSES.md`, oui.

## Ce que le triangle de Penrose n'est pas

La figure impossible la plus connue aurait complété la série, et elle a été
écartée. Elle demande de redessiner par-dessus le premier barreau pour
simuler un ordre de profondeur contradictoire ; une version approximative ne
ressemble pas à une figure impossible, elle ressemble à une erreur. Kanizsa
et Necker couvrent déjà le même registre — voir ce qui n'existe pas, et ne
pas pouvoir choisir — correctement.

## Ce qui a été mesuré

**Le contraste**, relevé dans le PNG rendu et non calculé sur les couleurs de
la feuille de style : le fond est un dégradé troublé par un grain et traversé
par un arc, donc la couleur derrière une ligne n'est écrite nulle part.

Le contrôle applique la règle WCAG à **deux seuils** — 4,5:1 pour du texte
courant, 3:1 au-delà de 24 px — plutôt qu'un 4,5 forfaitaire. Un seuil unique
aurait forcé à éclaircir l'étiquette et l'invite bien au-delà de ce que la
lisibilité exige, et aplati la hiérarchie pour satisfaire un chiffre que
personne ne réclamait.

Première mesure : l'étiquette tombait à **2,66:1** sur le bleu. Corrigé.
Aujourd'hui le plus juste est à **3,67:1** pour un seuil de 3, sur les
quatorze mises en page et les trois colorations.

**Les comptes et les réponses** sont calculés : le nombre de carrés d'une
grille vient d'une somme, celui des triangles d'une figure subdivisée de la
formule ⌊n(n+2)(2n+1)/8⌋, celui des sourires d'un filtre sur la liste qui a
servi à les dessiner. Les nombres cités dans les fiches `code` — 42 pliages,
192 chiffres, 45 poignées de main, 16 777 216 couleurs — ont tous été
recalculés.

**Le corps du texte** est ajusté dans le navigateur, fiche par fiche : tant
que le contenu dépasse sa boîte, la base descend d'un cran. Aucune des 215
n'est descendue sous le seuil d'alerte.

**Les comptes des énigmes** sont calculés, jamais comptés à l'oeil. Le nombre
de carrés d'une grille vient d'une somme ; le nombre de sourires, d'un filtre
sur la liste qui a servi à les dessiner.

## Cinq erreurs corrigées sur planche-contact

Aucune ne se voyait dans le code. Toutes sautaient aux yeux sur l'image.

- **Le mur du café** décalait d'une tuile entière au lieu d'une demi. Les
  tuiles sombres retombaient sur les claires : un damier régulier, et aucune
  illusion.
- **Ebbinghaus** posait ses deux grappes à 450 et 387 sur une toile de 720 :
  elles se recouvraient, et le symbole central disparaissait sous ses propres
  voisins.
- **Poggendorff** traçait ses deux segments de droite à l'horizontale alors
  que celui de gauche était oblique : aucun des deux ne le prolongeait, et
  l'énigme n'avait pas de bonne réponse.
- **Ponzo** plaçait la barre du haut à une hauteur fixe. Aux grandes
  longueurs elle dépassait les rails — et une barre qui sort du couloir ne
  peut plus être lue comme lointaine.
- **Les suites** dérivaient leurs trois propositions de la règle aux rangs 4,
  6 et 2. Pour la règle du sourire, qui alterne, les trois donnaient le même
  dessin : une question à trois bonnes réponses identiques. Pour celle du
  rayon, le rang 6 donnait un rayon négatif.

C'est la raison d'être d'une planche-contact. Une dérivation astucieuse ne
vaut rien si elle produit des énigmes sans réponse — et c'est l'image, pas la
relecture du code, qui le dit.
