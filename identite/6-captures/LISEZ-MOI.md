# Captures du site

Prises sur **le site en ligne**, `www.studiosentis.ca`, pas sur une maquette.
Sept pages : accueil, services, réalisations, à propos, demande de soumission,
plus l'accueil et les services en anglais.

## Les quatre séries, et laquelle prendre

| Dossier | Quoi | Quand s'en servir |
|---|---|---|
| `haut/` | Le premier écran, 1440 × 900, **double densité**, PNG | Flyer, publication, présentation. C'est la série de qualité. |
| `parcours/` | Huit arrêts en descendant la page, JPEG | Montrer une page longue sans la dérouler. |
| `complet/` | La page entière d'un seul tenant, JPEG | Un coup d'œil, une pièce jointe. |
| `mobile/` | iPhone 13 : premier écran en double densité, page entière en JPEG | Prouver que le site tient dans un téléphone. |

**Dans le doute : `haut/`.** C'est ce que le visiteur voit avant de faire
défiler, et c'est le seul dossier en double densité — celui qui reste net
imprimé ou affiché en grand.

## Pourquoi un « parcours » et pas seulement la page entière

L'accueil fait 13 342 px de haut, et son carrousel défile **en position
collante** : la capture pleine page le montre une fois, suivi du vide dans
lequel il défile. Les huit arrêts, eux, le montrent avancer panneau par
panneau — c'est ce que le visiteur voit réellement.

## Ce que les captures datent

Trois choses sur ces images sont calculées au moment de la lecture et seront
fausses demain :

- le compte à rebours de réponse (« 22 h 41 »),
- la date de livraison annoncée dans la grille de prix,
- la date du jour sur la page À propos.

Pour une impression qui doit durer, refaire les captures le jour même :

```bash
node scripts/identite/captures.mjs
```

## Un avertissement sur la page Réalisations

Elle est **vide**, volontairement : « Aucune pour l'instant. Les dix premiers
projets rempliront cette page, à −25 %. » C'est une page honnête, mais ce
n'est pas une page à mettre dans un flyer. Y revenir une fois les premiers
projets livrés.
