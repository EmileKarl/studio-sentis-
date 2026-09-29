# Polices auto-hébergées

## `outfit-logo-300.woff2`

Outfit Light (300), **réduite aux dix glyphes du logotype** — les lettres de
« studio sentis » et l'espace. 1 088 octets, contre environ quinze kilo-octets
pour un jeu latin complet.

Ce sous-ensemble existe parce que `next/font/google` de cette version n'expose
pas l'option `text` : demander la police à Google aurait chargé deux cents
glyphes pour en afficher dix, et fait sauter le budget de polices du projet
(`npm run verify:poids`, plafond 100 ko, déjà à 88,7). Une famille entière
pour six lettres n'est pas une dépense qu'un logo justifie.

Régénération, si le nom de la marque change :

```bash
# 1. Relever l'URL du fichier .ttf servi par Google pour la graisse voulue
curl -s -H "User-Agent: Mozilla/5.0" \
  "https://fonts.googleapis.com/css2?family=Outfit:wght@300&display=swap"

# 2. Le télécharger, puis le réduire aux seuls caractères utilisés
pip install "fonttools[woff]" brotli
pyftsubset outfit.ttf --text="studio sentis" --flavor=woff2 \
  --layout-features='' --no-hinting --desubroutinize \
  --output-file=src/fonts/outfit-logo-300.woff2
```

**Le `--text` doit contenir exactement les caractères affichés.** Une lettre
oubliée ne provoque pas d'erreur : elle s'affiche dans la police de repli, et
le logo se casse en silence.

### Licence

Outfit est publiée sous **SIL Open Font License 1.1**, qui autorise la
redistribution, la modification et l'auto-hébergement à la condition que la
licence accompagne les fichiers. Elle est ici : [`Outfit-OFL.txt`](Outfit-OFL.txt).
Un sous-ensemble est une œuvre dérivée au sens de l'OFL ; il reste sous la même
licence, et le nom réservé de la famille n'a pas été modifié.

La police est aussi créditée dans les mentions légales du site, avec les
autres logiciels tiers.
