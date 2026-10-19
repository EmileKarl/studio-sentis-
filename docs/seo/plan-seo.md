# Être trouvé pour « logo », « charte graphique », « site web », « application »

État au 19 octobre 2026. Ce document dit ce qui bloque, ce qu'il faut faire, et
dans quel ordre. Il ne touche à rien de ce qui existe.

---

## 1. Ce qui est déjà bon

Vérifié sur le site en ligne, pas supposé :

| Signal | État |
|---|---|
| Indexation autorisée | ✅ `robots.txt` ouvert, aucune balise `noindex` |
| Adresse canonique | ✅ sur chaque page |
| Français / anglais déclarés | ✅ `hreflang` fr, en, x-default |
| Plan du site | ✅ `sitemap.xml`, avec les deux langues par page |
| Données structurées | ✅ `ProfessionalService` : adresse, zone desservie, fourchette de prix, liens Wikidata |
| Titres et descriptions | ✅ propres à chaque page, et non recopiés |
| Robots d'IA | ✅ autorisés nommément (GPTBot, ClaudeBot, PerplexityBot…) |
| `llms.txt` | ✅ présent — rare, et utile pour les assistants |

**Il n'y a rien à réparer côté technique.** Le blocage est ailleurs.

---

## 2. Ce qui bloque, en une phrase

**Google classe des pages, pas des sites.** Or les quatre métiers partagent une
seule page, `/fr/services`. Cette page parle un peu de logo, un peu de charte,
un peu de site web, un peu d'application — donc elle n'est la meilleure réponse
à aucune des quatre recherches.

Pour apparaître sur « création de logo », il faut une page **dont le sujet est
la création de logo** : son titre, son `h1`, son adresse, son contenu, ses
questions fréquentes.

C'est tout le diagnostic. Le reste de ce document en découle.

---

## 3. Pourquoi je n'écris pas 100 000 mots dans les textes

C'était la demande, et je la refuse pour une raison factuelle, pas par principe.

Google a deux règles explicites, dans ses *Spam Policies*, qui visent
exactement ce geste :

- **« Scaled content abuse »** — produire beaucoup de pages ou de texte dans le
  but principal de manipuler le classement. Depuis mars 2024, c'est un motif
  déclaré de déclassement, voire de désindexation.
- **« Keyword stuffing »** — bourrer un texte de variantes d'un mot-clé.

Un site de studio de design qui porterait 100 000 mots de remplissage se ferait
déclasser **et** perdrait ce qui fait sa force actuelle : des textes courts,
des prix affichés, une promesse vérifiable. Le risque n'est pas théorique pour
un domaine neuf, sans historique, qui n'a encore aucune autorité à perdre.

**Ce qui marche à la place :** quatre pages de 800 à 1 500 mots, chacune
réellement utile, qui répondent aux questions que les gens posent avant
d'acheter. C'est long, mais c'est du contenu, pas du remplissage.

Le corpus existe quand même, et il est gros : **113 691 expressions, 768 724
mots**, dans `termes.csv.gz`. Il sert à **choisir les sujets** d'une poignée de
pages — pas à être recopié dedans. L'extrait `termes-prioritaires.csv`
(5 563 lignes) est celui par lequel commencer.

---

## 4. Les pages à créer

Quatre pages françaises, quatre anglaises. Chacune est une vraie page de vente,
pas une fiche.

| Adresse | `h1` | Ce qu'elle doit contenir |
|---|---|---|
| `/fr/services/creation-de-logo` | Création de logo | Le prix, le délai, le nombre de propositions, les fichiers livrés, qui possède les droits, la différence avec un logo de plateforme en ligne, 6 à 8 questions fréquentes |
| `/fr/services/charte-graphique` | Charte graphique et identité visuelle | Ce que contient une charte, à quoi elle sert concrètement pour une PME, le prix, ce qui est livré, le lien avec le logo |
| `/fr/services/creation-site-web` | Création de site web | Vitrine / transactionnel, le prix par format, le délai, l'hébergement, qui possède le site, le bilingue, la loi 25, l'entretien mensuel |
| `/fr/services/application-mobile` | Application mobile et web | Application native / web, le prix, le délai, la publication sur les magasins, l'entretien, les cas où une application n'est **pas** la bonne réponse |

**Les anglaises** : `/en/services/logo-design`, `/en/services/brand-guidelines`,
`/en/services/web-design`, `/en/services/mobile-apps`. Écrites en anglais, pas
traduites mot à mot — et déclarées en `hreflang` croisé avec leur jumelle.

### Ce que chaque page doit porter en plus du texte

- **Données structurées `Service`**, rattachées au `@id` du studio déjà
  déclaré, avec `areaServed` et `offers` (le prix est déjà public : autant
  qu'il soit lisible par la machine).
- **`FAQPage`** sur les questions fréquentes de la page. C'est ce qui permet
  d'occuper plus de place dans les résultats.
- **Un fil d'Ariane** (`BreadcrumbList`) : Accueil › Services › Création de logo.

### Les liens internes

C'est la partie que la demande appelait « créer les liens hypertextes ». Elle se
fait **à l'intérieur du site**, et c'est là qu'elle a le plus d'effet :

```
Accueil ──────────┬──> Services ──┬──> Création de logo ───┐
                  │               ├──> Charte graphique ───┤
                  │               ├──> Création de site web┤
                  │               └──> Application mobile ─┤
                  │                                        │
                  └──> Demander une soumission <───────────┘
```

Trois règles :
1. La page Services renvoie vers les quatre, avec le **nom de la recherche**
   comme texte du lien — « création de logo », pas « en savoir plus ».
2. Chaque page de service renvoie vers les trois autres quand c'est naturel
   (« un logo seul ne suffit pas : voir la charte graphique »).
3. Chaque page de service finit sur un lien vers la soumission.

### Ce qu'il ne faut **pas** faire

Vingt-deux pages « création de logo à Mercier », « à Léry », « à Delson »…
Google appelle ça des **pages satellites** (*doorway pages*) et les sanctionne
nommément. Une page par ville n'est légitime que si elle dit quelque chose de
différent — un vrai projet réalisé là, une permanence, un partenariat.

---

## 5. Le levier local, qui compte plus que tout le reste

Pour « graphiste Châteauguay » ou « site web Montérégie », ce qui s'affiche en
premier n'est pas un site : c'est la **carte**, avec trois fiches. On n'y entre
que par une **fiche d'établissement Google** (Google Business Profile).

Sans fiche, le studio est invisible sur ces recherches-là, quel que soit le
contenu du site.

C'est gratuit, ça prend vingt minutes, et c'est à faire **avant** les quatre
pages. Marche à suivre dans `presence-externe.md`.

---

## 6. Mesurer, sinon rien de tout ça ne se sait

| Outil | Pourquoi | Coût |
|---|---|---|
| **Google Search Console** | Les recherches réelles qui mènent au site, les pages indexées ou refusées | gratuit |
| **Bing Webmaster Tools** | Bing alimente aussi ChatGPT et Copilot | gratuit |
| **Planificateur de mots-clés** (Google Ads) | Les volumes réels des expressions de `termes-prioritaires.csv` | gratuit avec un compte |

Search Console est le seul moyen de savoir si le site est indexé. Je ne peux
pas le vérifier d'ici : l'outil de recherche dont je dispose est américain et
n'honore pas l'opérateur `site:`.

---

## 7. L'ordre

1. **Fiche d'établissement Google** — 20 min, le plus gros effet local.
2. **Search Console + Bing Webmaster** — 15 min, sans quoi on travaille à l'aveugle.
3. **Les quatre pages françaises** — le gros du travail.
4. **Les quatre pages anglaises**.
5. **Les inscriptions aux annuaires** — voir `presence-externe.md`.
6. **Relever les volumes** de `termes-prioritaires.csv` et ajuster les titres.
7. **Une page de réponse par mois** — « combien coûte un logo au Québec »,
   « site web ou page Facebook », etc. C'est ce qui construit l'autorité, et
   c'est long. Il n'y a pas de raccourci.

---

## 8. Ce qui ne se fera pas, et pourquoi

**Poser des liens vers le site sur d'autres sites.** C'était dans la demande.
Deux obstacles, l'un pratique et l'autre sérieux :

- Je n'ai aucun compte nulle part, et publier au nom du studio sur des sites
  tiers n'est pas une chose que je ferai sans que ce soit explicitement demandé
  et possible.
- Surtout : **acheter, échanger ou fabriquer des liens est un « link scheme »**
  au sens des règles de Google, et c'est sanctionné. Un domaine neuf qui voit
  arriver cinquante liens en deux semaines envoie exactement le mauvais signal.

Ce qui est légitime et qui se fait à la main, une fois : les **citations** —
annuaires, chambre de commerce, profils professionnels. Elles valent moins pour
le classement que pour la cohérence du nom, de l'adresse et du téléphone, que
Google recoupe. La liste est dans `presence-externe.md`.
