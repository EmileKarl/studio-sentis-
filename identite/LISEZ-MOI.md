# Identité de Studio Sentis

Tout ce qu'il faut pour poser la marque ailleurs que sur le site : le logo, les
couleurs, la typographie, la papeterie et les gabarits de réseaux sociaux.

Rien ici n'a été réinventé. Le dessin du symbole, les couleurs et les
proportions du verrouillage sont **extraits du code du site en production** —
`src/components/sentis/logotype.tsx` et `src/styles/sentis.css`. Si le site
change, ce dossier se régénère ; il ne se retouche pas à la main.

---

## Par où commencer

**Ouvrir `2-charte/charte-graphique-studio-sentis.pdf`.** Quinze pages : d'où
vient le dessin, comment le poser, ce qu'il ne faut pas en faire, et toutes les
valeurs de couleur et de typographie.

**Pour envoyer le logo à quelqu'un aujourd'hui :**

| Qui demande | Quoi lui envoyer |
|---|---|
| Imprimeur, enseigniste, brodeur, sérigraphe | `1-logo/svg/sentis-logo-horizontal-couleur.svg` |
| Réseau social, document Word, diaporama | `1-logo/png/sentis-logo-horizontal-couleur-1200.png` |
| Grand format, affiche, lettrage de véhicule | le SVG, ou à défaut le PNG 2400 px |
| Photo de profil | `1-logo/favicon-avatar/sentis-avatar-rond-1000.png` |
| Onglet de navigateur, application | `1-logo/favicon-avatar/sentis-icone-512.png` |

Dans le doute : **le SVG**. Il se redimensionne sans jamais perdre en netteté,
et c'est le seul format qu'un imprimeur acceptera pour du grand format.

---

## Ce qu'il y a dans chaque dossier

### `1-logo/`

**`svg/`** — 18 fichiers vectoriels. Trois verrouillages (horizontal, empilé,
vertical) plus le symbole seul, chacun en quatre colorations :

- `-couleur` — symbole bleu, mot en noir. **C'est celui-ci par défaut**, sur
  fond clair.
- `-couleur-fond-sombre` — bleu éclairci, mot en blanc cassé. Sur fond sombre.
- `-noir` — tout en noir. Télécopie, tampon, gravure, document une couleur.
- `-blanc` — tout en blanc cassé. Sur une photo, sur un aplat de couleur.

Plus deux badges prêts à l'emploi : `sentis-badge-carre-bleu.svg` (icône) et
`sentis-badge-rond-bleu.svg` (avatar).

Le mot « STUDIO SENTIS » y est **vectorisé**, pas écrit en texte : le fichier
s'affiche pareil chez tout le monde, même sans la police installée.

**`png/`** — les mêmes, en 600, 1200 et 2400 px de large, **fond
transparent**. Pour tout ce qui n'accepte pas le SVG.

**`favicon-avatar/`** — icônes carrées 32, 48, 180, 512 et 1024 px, avatars
ronds 400 et 1000 px.

### `2-charte/`

La charte en PDF et en HTML, et la palette dans trois formats :

- `palette-studio-sentis.css` — à coller dans n'importe quel projet web, avec
  ou sans Tailwind. Les deux thèmes sont dedans.
- `palette-studio-sentis.json` — pour un script, un gabarit, un outil.
- `palette-studio-sentis.gpl` — à importer dans GIMP, Inkscape ou Krita.

### `3-papeterie/`

- `carte-affaires-recto-verso.pdf` — 89 × 51 mm, fond perdu de 3 mm. Deux
  pages : recto puis verso.
- `entete-lettre.pdf` — format lettre 8,5 × 11 po.
- `signature-courriel.html` — à ouvrir dans un navigateur, sélectionner la
  signature, copier, coller dans Gmail ou Outlook.
- `signature-courriel-texte-brut.txt` — pour les messageries sans HTML.

Les fichiers `.html` à côté sont les sources : les modifier puis réimprimer en
PDF depuis le navigateur.

> **Un champ reste à remplir.** Le nom de la personne apparaît comme
> « Prénom Nom » sur la carte, la lettre et la signature : il n'est écrit nulle
> part dans le code du site, et je n'allais pas en inventer un sur une carte
> d'affaires. Chercher `Prénom Nom` dans les trois fichiers `.html`.

### `4-reseaux/`

Les gabarits aux dimensions des plateformes, en PNG prêts à téléverser et en
HTML modifiables :

| Fichier | Où |
|---|---|
| `facebook-couverture-1640x856.png` | couverture de page Facebook |
| `linkedin-banniere-1584x396.png` | bannière LinkedIn |
| `publication-carree-1080x1080.png` | publication Facebook, Instagram, LinkedIn |
| `publication-portrait-1080x1350.png` | publication Instagram (format qui occupe le plus d'écran) |
| `story-1080x1920.png` | story Instagram, Facebook, TikTok |

Les fichiers `-reperes` montrent en pointillé la **zone sûre** : sur Facebook,
le téléphone ne montre que le centre de la couverture ; rien d'important ne
doit sortir du pointillé.

### `5-polices/`

Inter en quatre graisses, sa licence, et comment l'installer.

---

## Les trois règles qui comptent le plus

1. **Ne pas déformer.** Le logo se redimensionne d'un bloc, en gardant ses
   proportions. Étiré ou comprimé, il ne se rattrape pas.
2. **Laisser de l'air.** Autour du logo, un vide égal à la moitié de la hauteur
   du symbole. Rien n'y entre : ni texte, ni filet, ni bord de page.
3. **Ne pas recolorer.** Quatre colorations existent. Il n'y en a pas de
   cinquième, et le bleu est `#006EB8` — pas « un bleu ».

Le reste est en page 05 de la charte.

---

## Les couleurs, en un coup d'œil

| | HEX | Rôle |
|---|---|---|
| Bleu de la marque | `#006EB8` | le logo, l'action, les aplats |
| Bleu pour le texte | `#005FA0` | liens et texte, sur fond clair |
| Encre | `#1A1A1A` | tout le texte |
| Papier | `#F8F5F2` | le fond |
| Beige | `#E6DACD` | surfaces en creux |

Les quatre couleurs de la marque viennent de la combinaison 333 de
*A Dictionary of Color Combinations* (Sanzo Wada, 1933). Le tableau complet,
avec les valeurs RVB, TSL, CMJN et les contrastes mesurés, est aux pages 06 de
la charte.

**Avant d'imprimer :** les valeurs CMJN sont une conversion arithmétique, sans
profil ICC. Demander une épreuve, et faire déterminer la référence Pantone par
l'imprimeur à partir du HEX — ne pas en deviner une.

---

## Refabriquer ce dossier

Il n'est pas dessiné à la main : il se régénère depuis le code de la marque.

```bash
bash scripts/identite/generer.sh
```

Il faut `python3` avec `fonttools` et `uharfbuzz`, `node` avec `playwright`, et
`Inter-Bold.otf` — celui de `identite/5-polices/` fait l'affaire.

La chaîne s'arrête d'elle-même si une page de la charte déborde, et refuse de
composer le mot-symbole dans une police de repli. Un logo dans la mauvaise
police est pire qu'un logo manquant.

**Ce qu'il faut toucher pour changer quelque chose :**

| Changer | Où |
|---|---|
| le dessin du symbole | `src/components/sentis/logotype.tsx`, puis reporter dans `scripts/identite/logos.py` |
| une couleur | `src/styles/sentis.css`, puis `scripts/identite/couleurs.py` |
| le texte de la charte | `scripts/identite/charte.py` |
| la carte, la lettre, la signature | `scripts/identite/applications.py` |

Les deux premières lignes demandent de reporter la valeur à deux endroits :
c'est voulu. Le site suit des jetons qui basculent avec le thème ; ces
fichiers-ci sont figés, parce qu'un imprimeur ne lit pas de variables CSS.
