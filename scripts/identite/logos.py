# -*- coding: utf-8 -*-
"""
Fabrique les fichiers de logo de Studio Sentis.

Le dessin n'est pas reinvente ici : les coordonnees du symbole sont celles de
src/components/sentis/logotype.tsx, et les proportions du verrouillage sont
celles des classes du meme fichier (symbole 1,55em, gouttiere 0,45em,
mot-symbole 0,78em / 0,055em d'interlettrage ; empile 0,56em / 0,07em).

Le mot-symbole est converti en **courbes** : un SVG qui appelle « Inter » par
son nom s'affiche en Arial chez qui ne l'a pas installee. Le texte est compose
par HarfBuzz (meme moteur que le navigateur), donc le crenage est celui du
site, pas une approximation.
"""
import json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import uharfbuzz as hb
import os, sys
# Tout est relatif a la racine du depot : le script se lance depuis n'importe ou.
RACINE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
IDENTITE = os.path.join(RACINE, "identite")

# Inter Bold, pour vectoriser le mot-symbole. INTER_BOLD permet d'en designer
# une autre copie ; sinon on cherche aux endroits habituels. Le script
# s'arrete plutot que de composer dans une police de repli : un logo dans la
# mauvaise police est pire qu'un logo manquant.
CANDIDATS = [
    os.environ.get("INTER_BOLD"),
    os.path.join(RACINE, "scripts", "polices", "Inter-Bold.otf"),
    os.path.join(IDENTITE, "5-polices", "Inter-Bold.otf"),
    "/usr/share/fonts/opentype/inter/Inter-Bold.otf",
    os.path.expanduser("~/Library/Fonts/Inter-Bold.otf"),
    "C:/Windows/Fonts/Inter-Bold.otf",
]
POLICE = next((c for c in CANDIDATS if c and os.path.exists(c)), None)
if not POLICE:
    raise SystemExit(
        "Inter-Bold.otf introuvable. Le poser dans identite/5-polices/ ou "
        "designer le fichier par la variable d'environnement INTER_BOLD."
    )

SORTIE = os.path.join(IDENTITE, "1-logo", "svg")
os.makedirs(SORTIE, exist_ok=True)

# --- couleurs, recopiees de src/styles/sentis.css -------------------------
BLEU        = "#006eb8"   # --signal, theme clair : la valeur du livre
BLEU_SOMBRE = "#008eed"   # --signal, theme sombre
NOIR        = "#1a1a1a"   # --ink
BLANC_CASSE = "#f8f5f2"   # --paper clair / --ink sombre

EM = 100.0                       # l'unite de reference du verrouillage
SYM = 1.55 * EM                  # size-[1.55em]
GAP = 0.45 * EM                  # gap-[0.45em]
CORPS_LIGNE = 0.78 * EM          # text-[0.78em]
TRACK_LIGNE = 0.055              # tracking-[0.055em]
CORPS_EMPILE = 0.56 * EM         # text-[0.56em]
TRACK_EMPILE = 0.07              # tracking-[0.07em]
INTERLIGNE_EMPILE = 0.98         # leading-[0.98]

# --- la police ------------------------------------------------------------
tt = TTFont(POLICE)
UPM = tt["head"].unitsPerEm
CAP = tt["OS/2"].sCapHeight
glyphes = tt.getGlyphSet()
with open(POLICE, "rb") as f:
    octets = f.read()
visage = hb.Face(octets)
police_hb = hb.Font(visage)


def composer(texte, corps, track_em):
    """Rend `texte` en une liste de (chemin SVG, dx) et renvoie la chasse."""
    tampon = hb.Buffer()
    tampon.add_str(texte)
    tampon.guess_segment_properties()
    hb.shape(police_hb, tampon, {"kern": True, "liga": True})
    echelle = corps / UPM
    track = track_em * corps
    noms = tt.getGlyphOrder()
    morceaux, x = [], 0.0
    for info, pos in zip(tampon.glyph_infos, tampon.glyph_positions):
        nom = noms[info.codepoint]
        stylo = SVGPathPen(glyphes)
        glyphes[nom].draw(stylo)
        d = stylo.getCommands()
        if d:
            ox = x + pos.x_offset * echelle
            oy = pos.y_offset * echelle
            morceaux.append((d, ox, oy, echelle))
        x += pos.x_advance * echelle + track
    # l'interlettrage CSS s'ajoute aussi apres la derniere lettre : on le retire
    return morceaux, x - track


def chemins(morceaux, base_x, base_y, couleur):
    """Place les glyphes : y inverse, car la police monte et le SVG descend."""
    out = []
    for d, ox, oy, ech in morceaux:
        tx = base_x + ox
        ty = base_y - oy
        out.append(
            f'<path fill="{couleur}" transform="translate({tx:.3f} {ty:.3f}) '
            f'scale({ech:.6f} {-ech:.6f})" d="{d}"/>'
        )
    return "\n    ".join(out)


def symbole(x, y, taille, couleur):
    """Le symbole, aux coordonnees exactes du composant (viewBox 0 0 40 40)."""
    k = taille / 40.0
    return (
        f'<g transform="translate({x:.3f} {y:.3f}) scale({k:.6f})" fill="none" '
        f'stroke="{couleur}" stroke-width="2.2" stroke-linecap="round" '
        f'stroke-linejoin="round">\n'
        f'    <rect x="2.1" y="2.1" width="35.8" height="35.8" rx="11.4"/>\n'
        f'    <path d="M12.8 18.2 C 14.2 25.6, 25.8 25.6, 27.2 18.2"/>\n'
        f'  </g>'
    )


def doc(largeur, hauteur, titre, corps, fond=None):
    rect = f'<rect width="{largeur:.3f}" height="{hauteur:.3f}" fill="{fond}"/>\n  ' if fond else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {largeur:.3f} {hauteur:.3f}" '
        f'width="{largeur:.3f}" height="{hauteur:.3f}" role="img" aria-label="{titre}">\n'
        f'  <title>{titre}</title>\n  {rect}{corps}\n</svg>\n'
    )


def ecrire(nom, contenu):
    chemin = os.path.join(SORTIE, nom)
    with open(chemin, "w", encoding="utf-8") as f:
        f.write(contenu)
    return chemin


# --- 1. verrouillage horizontal ------------------------------------------
morceaux_h, chasse_h = composer("STUDIO SENTIS", CORPS_LIGNE, TRACK_LIGNE)
cap_h = CORPS_LIGNE * CAP / UPM
L_H = SYM + GAP + chasse_h
H_H = SYM
base_y_h = (H_H + cap_h) / 2          # hauteur de capitale centree sur le symbole

# --- 2. verrouillage empile (mot-symbole sur deux lignes) -----------------
m_studio, c_studio = composer("STUDIO", CORPS_EMPILE, TRACK_EMPILE)
m_sentis, c_sentis = composer("SENTIS", CORPS_EMPILE, TRACK_EMPILE)
cap_e = CORPS_EMPILE * CAP / UPM
interligne = CORPS_EMPILE * INTERLIGNE_EMPILE
chasse_e = max(c_studio, c_sentis)
L_E = SYM + GAP + chasse_e
H_E = SYM
bloc = interligne + cap_e             # du haut des capitales de la 1re ligne au bas de la 2e
y1 = (H_E - bloc) / 2 + cap_e
y2 = y1 + interligne

# --- 3. verrouillage vertical (ajout, absent du site) ---------------------
# Le site n'en a pas besoin : il n'a que des bandes horizontales. Un carre en a
# besoin — tampon, dos de carte, aplat de reseau social. Le mot-symbole y passe
# sur deux lignes et le symbole grossit, sinon le nom fait trois fois sa largeur
# et le verrouillage se lit comme deux objets poses l'un sur l'autre.
SYM_V = 2.1 * EM
CORPS_V = 0.62 * EM
TRACK_V = 0.07
m_v1, c_v1 = composer("STUDIO", CORPS_V, TRACK_V)
m_v2, c_v2 = composer("SENTIS", CORPS_V, TRACK_V)
cap_v = CORPS_V * CAP / UPM
inter_v = CORPS_V * 0.98
chasse_v = max(c_v1, c_v2)
L_V = max(SYM_V, chasse_v)
ECART_V = 0.38 * EM
H_V = SYM_V + ECART_V + cap_v + inter_v
yv1 = SYM_V + ECART_V + cap_v
yv2 = yv1 + inter_v

variantes = {
    "couleur":      (BLEU,        NOIR,        None),
    "couleur-fond-sombre": (BLEU_SOMBRE, BLANC_CASSE, None),
    "noir":         (NOIR,        NOIR,        None),
    "blanc":        (BLANC_CASSE, BLANC_CASSE, None),
}

ecrits = []
for suffixe, (c_sym, c_mot, fond) in variantes.items():
    # horizontal
    corps = symbole(0, 0, SYM, c_sym) + "\n  " + chemins(morceaux_h, SYM + GAP, base_y_h, c_mot)
    ecrits.append(ecrire(f"sentis-logo-horizontal-{suffixe}.svg",
                         doc(L_H, H_H, "Studio Sentis", corps, fond)))
    # empile
    corps = (symbole(0, 0, SYM, c_sym) + "\n  "
             + chemins(m_studio, SYM + GAP, y1, c_mot) + "\n    "
             + chemins(m_sentis, SYM + GAP, y2, c_mot))
    ecrits.append(ecrire(f"sentis-logo-empile-{suffixe}.svg",
                         doc(L_E, H_E, "Studio Sentis", corps, fond)))
    # vertical (ajout)
    corps = (symbole((L_V - SYM_V) / 2, 0, SYM_V, c_sym) + "\n  "
             + chemins(m_v1, (L_V - c_v1) / 2, yv1, c_mot) + "\n    "
             + chemins(m_v2, (L_V - c_v2) / 2, yv2, c_mot))
    ecrits.append(ecrire(f"sentis-logo-vertical-{suffixe}.svg",
                         doc(L_V, H_V, "Studio Sentis", corps, fond)))
    # symbole seul
    ecrits.append(ecrire(f"sentis-symbole-{suffixe}.svg",
                         doc(SYM, SYM, "Studio Sentis", symbole(0, 0, SYM, c_sym), fond)))

# --- 4. le badge : symbole clair sur carre bleu (icone, avatar) -----------
cote = 1000.0
marge = cote * 0.17
corps = symbole(marge, marge, cote - 2 * marge, BLANC_CASSE)
ecrits.append(ecrire("sentis-badge-carre-bleu.svg", doc(cote, cote, "Studio Sentis", corps, BLEU)))
rond = (f'<circle cx="{cote/2}" cy="{cote/2}" r="{cote/2}" fill="{BLEU}"/>\n  '
        + symbole(marge, marge, cote - 2 * marge, BLANC_CASSE))
ecrits.append(ecrire("sentis-badge-rond-bleu.svg", doc(cote, cote, "Studio Sentis", rond)))

print(json.dumps({
    "unitsPerEm": UPM, "capHeight": CAP,
    "horizontal": [round(L_H, 2), round(H_H, 2)],
    "empile":     [round(L_E, 2), round(H_E, 2)],
    "vertical":   [round(L_V, 2), round(H_V, 2)],
    "fichiers": len(ecrits),
}, ensure_ascii=False, indent=2))
