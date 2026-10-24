# Les fiches de communication

215 fiches au format 1080 × 1920, pour un statut WhatsApp.

## Le ressort : la fiche pose, elle ne répond pas

On ne commente pas une affirmation. On répond à une question, parce qu'on
croit savoir. C'est cette réponse en message privé qui est le but : elle
ouvre une conversation que personne n'aurait eue devant une publicité.

Les réponses sont donc ailleurs : **`REPONSES.md`**, dans ce dossier. C'est
votre antisèche. Quelqu'un répond à `047-vraifaux-papier.png` ? Vous cherchez
**047** dans le fichier.

**Ne publiez jamais la réponse sur la fiche.** Elle ne vaut que parce qu'elle
manque.

## Les huit familles

| Famille | Ce qu'elle fait | Nombre |
|---|---|---|
| `devinette` | Une question de métier qu'un non-spécialiste peut tenter | 30 |
| `vraifaux` | Une affirmation à trancher | 25 |
| `choix` | Deux chemins, un seul bon | 18 |
| `mot` | Un mot du métier, seul, sans explication | 32 |
| `phrase` | Un aphorisme. Ni question ni réponse | 35 |
| `chiffre` | Un chiffre nu et une ligne | 7 |
| `ici` | Châteauguay, Montérégie | 4 |
| `jeu` | Une énigme visuelle, dessinée avec la géométrie du logo | 64 |

## Comment publier

Les fiches sont numérotées et **la coloration tourne** : bleu, papier, encre,
bleu… Publiées dans l'ordre, la série alterne d'elle-même. Une suite
monochrome lasse au troisième jour.

Quelques repères, pas une règle :

- **une par jour** suffit. Deux, c'est déjà une campagne ;
- gardez les `jeu` pour les jours creux : ce sont les plus partagés, parce
  qu'on envoie une illusion à quelqu'un, on n'envoie pas une publicité ;
- une `phrase` ne demande rien. Elle sert à espacer les questions ;
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

Les PNG ne sont pas suivis par git : 30 Mo qui se régénèrent en une commande
à partir du corpus et du gabarit, eux suivis. Les planches-contact et
`REPONSES.md`, oui.

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
Aujourd'hui le plus juste est à **3,67:1** pour un seuil de 3.

**Le corps du texte** est ajusté dans le navigateur, fiche par fiche : tant
que le contenu dépasse sa boîte, la base descend d'un cran. Aucune des 215
n'est descendue sous le seuil d'alerte.

**Les comptes des énigmes** sont calculés, jamais comptés à l'oeil. Le nombre
de carrés d'une grille vient d'une somme ; le nombre de sourires, d'un filtre
sur la liste qui a servi à les dessiner.

## Deux erreurs corrigées sur planche-contact

Elles ne se voyaient pas dans le code, seulement en regardant les images.

- **Le mur du café** décalait d'une tuile entière au lieu d'une demi. Les
  tuiles sombres retombaient sur les claires : un damier régulier, et aucune
  illusion.
- **Ebbinghaus** posait ses deux grappes à 450 et 387 sur une toile de 720 :
  elles se recouvraient, et le symbole central disparaissait sous ses propres
  voisins.

C'est la raison d'être d'une planche-contact.
