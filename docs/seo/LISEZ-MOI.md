# Référencement — ce qu'il y a dans ce dossier

| Fichier | Quoi |
|---|---|
| `plan-seo.md` | **Commencer par là.** Ce qui est déjà bon, ce qui bloque, les pages à créer, l'ordre. |
| `presence-externe.md` | Les fiches et annuaires à remplir, avec le texte déjà écrit. À faire à la main. |
| `termes-prioritaires.csv` | 5 563 expressions : celles qui décident de l'architecture du site. |
| `termes.csv.gz` | Le corpus entier, 113 691 expressions. `gunzip` pour l'ouvrir. |

Le corpus se refabrique : `python3 scripts/seo/termes.py`.

## Ce que ces chiffres ne disent pas

Aucune de ces expressions n'a de **volume de recherche** attaché, et je n'en ai
inventé aucun. Le corpus est une grammaire : un verbe, un objet, une
précision, un lieu, un secteur. Elle produit mécaniquement cent mille chaînes,
dont une partie seulement correspond à ce que des gens tapent réellement.

Le volume se relève, gratuitement, dans le Planificateur de mots-clés de Google
Ads, ou dans Search Console une fois le site vérifié. Tant que ce relevé n'est
pas fait, aucune ligne de ces fichiers ne doit être présentée — à un client, ou
à soi-même — comme « un mot-clé à fort volume ».

## Et le reste de la demande

Trois choses demandées ne sont pas ici, et c'est délibéré :

- **Les 100 000 mots dans les textes du site.** Ils déclasseraient le site au
  lieu de le classer. La raison, avec les règles de Google en cause, est au
  point 3 de `plan-seo.md`.
- **Des liens posés sur d'autres sites.** Fabriquer des liens est sanctionné,
  et je n'ai aucun compte pour publier au nom du studio. Ce qui est légitime —
  les citations, les profils, les liens de clients — est dans
  `presence-externe.md`.
- **Les quatre pages de service.** C'est le vrai travail, et il reste à faire.
  Le plan les décrit une par une : adresse, titre, contenu, données
  structurées, liens internes.
