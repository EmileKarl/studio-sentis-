# -*- coding: utf-8 -*-
"""Table de couleurs : RVB, TSL, CMJN approche, contrastes mesures."""
import json, colorsys
import os, sys
# Tout est relatif a la racine du depot : le script se lance depuis n'importe ou.
RACINE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
IDENTITE = os.path.join(RACINE, "identite")


def rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def hsl(h):
    r, g, b = [c / 255 for c in rgb(h)]
    hh, l, s = colorsys.rgb_to_hls(r, g, b)
    return round(hh * 360), round(s * 100), round(l * 100)

def cmjn(h):
    """Conversion arithmetique sans profil ICC — a valider sur epreuve."""
    r, g, b = [c / 255 for c in rgb(h)]
    k = 1 - max(r, g, b)
    if k >= 1:
        return 0, 0, 0, 100
    c = (1 - r - k) / (1 - k)
    m = (1 - g - k) / (1 - k)
    y = (1 - b - k) / (1 - k)
    return tuple(round(v * 100) for v in (c, m, y, k))

def lum(h):
    def f(c):
        c /= 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = rgb(h)
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)

def contraste(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return round((hi + 0.05) / (lo + 0.05), 2)

PAPIER, ENCRE = "#f8f5f2", "#121314"

GROUPES = {
 "Les quatre couleurs du livre (valeurs source)": [
   ("Blue",         "#006eb8", "la couleur qui signe la marque"),
   ("Lemon Yellow", "#f8ed43", "la note claire et vive"),
   ("Burnt Sienna", "#ae5224", "la note chaude"),
   ("Cobalt Green", "#96d1aa", "la note froide"),
 ],
 "Theme clair — surfaces et texte": [
   ("Papier",        "#f8f5f2", "fond de page"),
   ("Surface",       "#ffffff", "carte posee sur le papier"),
   ("Surface 2",     "#e6dacd", "beige chaud, fond en creux"),
   ("Encre",         "#1a1a1a", "texte principal"),
   ("Encre seconde", "#3d3c3a", "texte secondaire"),
   ("Encre sourde",  "#595755", "legendes"),
   ("Filet",         "#e3dcd4", "trait de separation"),
   ("Filet fort",    "#b9b0a6", "trait appuye"),
 ],
 "Theme clair — signal et accents": [
   ("Signal",        "#006eb8", "le bleu du logo, aplats et grands textes"),
   ("Signal texte",  "#005fa0", "le meme, pour le texte courant et les lavis"),
   ("Accent bleu",   "#005fa0", "pictogramme et titre de section bleue"),
   ("Accent jaune",  "#756e04", "pictogramme et titre de section jaune"),
   ("Accent sienne", "#95461f", "pictogramme et titre de section sienne"),
   ("Accent vert",   "#337449", "pictogramme et titre de section verte"),
 ],
 "Theme clair — lavis de section (couleur du livre a 20 %)": [
   ("Lavis bleu",   "#c6dae6", "fond de section"),
   ("Lavis jaune",  "#f8f3cf", "fond de section"),
   ("Lavis sienne", "#e9d4c9", "fond de section"),
   ("Lavis vert",   "#e4eee4", "fond de section"),
 ],
 "Theme sombre": [
   ("Papier",       "#121314", "fond de page"),
   ("Surface",      "#1b1d1f", "carte"),
   ("Surface 2",    "#262a2d", "fond en creux"),
   ("Encre",        "#f8f5f2", "texte principal"),
   ("Encre seconde","#c5c6c7", "texte secondaire"),
   ("Encre sourde", "#9ba0a4", "legendes"),
   ("Signal",       "#008eed", "le bleu eclairci"),
   ("Signal texte", "#21a6ff", "pour le texte sur lavis"),
 ],
 "Etats": [
   ("Succes",  "#3f6b4a", "confirmation"),
   ("Alerte",  "#8a5e2a", "avertissement"),
   ("Erreur",  "#9c3b2c", "echec"),
   ("Info",    "#44607a", "information"),
 ],
}

sortie = {}
for groupe, lignes in GROUPES.items():
    sombre = "sombre" in groupe
    fond = ENCRE if sombre else PAPIER
    sortie[groupe] = [{
        "nom": n, "hex": h.upper(), "rgb": rgb(h), "hsl": hsl(h),
        "cmjn": cmjn(h), "role": r,
        "contraste_fond": contraste(h, fond),
        "fond_test": "encre" if sombre else "papier",
    } for n, h, r in lignes]

DEST = os.path.join(IDENTITE, "2-charte")
os.makedirs(DEST, exist_ok=True)
chemin = os.path.join(DEST, "palette-studio-sentis.json")
open(chemin, "w", encoding="utf-8").write(json.dumps(sortie, ensure_ascii=False, indent=2) + "\n")
print(chemin, sum(len(v) for v in sortie.values()), "couleurs")
