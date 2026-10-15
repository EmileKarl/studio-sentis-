# -*- coding: utf-8 -*-
"""Papeterie et reseaux sociaux. Un fichier HTML par piece, rendu ensuite en
   PDF (impression) ou en PNG (ecran) par Chromium."""
import os, sys
# Tout est relatif a la racine du depot : le script se lance depuis n'importe ou.
RACINE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
IDENTITE = os.path.join(RACINE, "identite")

PAP = os.path.join(IDENTITE, "3-papeterie")
RES = os.path.join(IDENTITE, "4-reseaux")
for d in (PAP, RES):
    os.makedirs(d, exist_ok=True)

BLEU, ENCRE, PAPIER, BEIGE = "#006eb8", "#1a1a1a", "#f8f5f2", "#e6dacd"
GRIS = "#3d3c3a"
SITE = "www.studiosentis.ca"
COURRIEL = "Emiletchesseu@gmail.com"
VILLE = "Châteauguay, Québec"
PROMESSE = "Le prix et la date, dès le premier échange."
# Le nom de la personne n'est écrit nulle part dans le dépôt : il reste un
# champ à remplir plutôt qu'un nom inventé sur une carte d'affaires.
NOM = "Prénom Nom"
ROLE = "Design et développement"

BASE = """
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: Inter, system-ui, sans-serif; color: %s; }
.mono { font-family: ui-monospace, Menlo, monospace; }
""" % ENCRE

def ecrire(chemin, html):
    open(chemin, "w", encoding="utf-8").write(html)
    return chemin

# =========================================================================
# Carte d'affaires — 89 x 51 mm + 3 mm de fond perdu = 95 x 57 mm
# =========================================================================
CARTE = f"""<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Studio Sentis — carte d'affaires</title><style>{BASE}
@page {{ size: 95mm 57mm; margin: 0; }}
.carte {{ position: relative; width: 95mm; height: 57mm; overflow: hidden;
         page-break-after: always; break-after: page; }}
.carte:last-child {{ page-break-after: auto; }}
/* Le trait de coupe est a 3 mm : tout ce qui compte reste a 7 mm du bord
   du fichier, soit 4 mm du bord rogne. */
.util {{ position: absolute; inset: 7mm; }}
.recto {{ background: {PAPIER}; }}
.recto .logo {{ width: 42mm; }}
.recto .nom {{ font-size: 10pt; font-weight: 600; letter-spacing: -0.01em; margin-top: 9mm; }}
.recto .role {{ font-size: 7.6pt; color: {GRIS}; margin-top: 0.6mm; }}
.recto .coord {{ position: absolute; left: 0; bottom: 0; font-size: 7.4pt; line-height: 1.5; color: {GRIS}; }}
.recto .coord b {{ color: {ENCRE}; font-weight: 500; }}
.verso {{ background: {BLEU}; color: {PAPIER}; }}
.verso .centre {{ position: absolute; inset: 0; display: flex; flex-direction: column;
                 align-items: center; justify-content: center; gap: 5mm; }}
.verso img {{ width: 17mm; }}
.verso .phrase {{ font-size: 9.4pt; font-weight: 600; letter-spacing: -0.022em;
                 text-align: center; max-width: 60mm; line-height: 1.25; }}
.verso .site {{ position: absolute; left: 0; right: 0; bottom: 0; text-align: center;
               font-size: 7.4pt; letter-spacing: 0.1em; text-transform: uppercase; opacity: .9; }}
</style></head><body>
<section class="carte recto">
  <div class="util">
    <img class="logo" src="../1-logo/svg/sentis-logo-horizontal-couleur.svg" alt="Studio Sentis">
    <div class="nom">{NOM}</div>
    <div class="role">{ROLE}</div>
    <div class="coord">
      <div class="mono"><b>{COURRIEL}</b></div>
      <div class="mono">{SITE}</div>
      <div>{VILLE}</div>
    </div>
  </div>
</section>
<section class="carte verso">
  <div class="centre">
    <img src="../1-logo/svg/sentis-symbole-blanc.svg" alt="">
    <div class="phrase">{PROMESSE}</div>
  </div>
  <div class="util"><div class="site">{SITE}</div></div>
</section>
</body></html>"""
ecrire(os.path.join(PAP, "carte-affaires.html"), CARTE)

# =========================================================================
# En-tete de lettre — format lettre US 8,5 x 11 po
# =========================================================================
LETTRE = f"""<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Studio Sentis — en-tête de lettre</title><style>{BASE}
@page {{ size: 8.5in 11in; margin: 0; }}
.feuille {{ position: relative; width: 8.5in; height: 11in; background: {PAPIER};
           padding: 25mm 25mm 30mm; font-size: 10.5pt; line-height: 1.6; }}
.tete {{ display: flex; justify-content: space-between; align-items: flex-start;
        padding-bottom: 7mm; border-bottom: 1px solid #e3dcd4; }}
.tete img {{ width: 46mm; }}
.tete .coord {{ text-align: right; font-size: 8pt; line-height: 1.6; color: {GRIS}; }}
.corps {{ margin-top: 12mm; max-width: 58ch; }}
.corps .date {{ color: {GRIS}; font-size: 9.5pt; }}
.corps h1 {{ font-size: 15pt; font-weight: 600; letter-spacing: -0.022em; margin: 8mm 0 4mm; }}
.corps p {{ margin: 0 0 4mm; }}
.gris {{ color: #8f8a85; }}
.pied {{ position: absolute; left: 25mm; right: 25mm; bottom: 14mm;
        display: flex; justify-content: space-between; align-items: center;
        font-size: 7.6pt; color: {GRIS}; letter-spacing: .04em;
        border-top: 1px solid #e3dcd4; padding-top: 3mm; }}
.barre {{ position: absolute; left: 0; right: 0; bottom: 0; height: 6mm; background: {BLEU}; }}
</style></head><body>
<section class="feuille">
  <div class="tete">
    <img src="../1-logo/svg/sentis-logo-horizontal-couleur.svg" alt="Studio Sentis">
    <div class="coord">
      <div class="mono">{COURRIEL}</div>
      <div class="mono">{SITE}</div>
      <div>{VILLE}</div>
    </div>
  </div>
  <div class="corps">
    <div class="date gris">Châteauguay, le [date]</div>
    <h1 class="gris">[Objet de la lettre]</h1>
    <p class="gris">[Madame, Monsieur,]</p>
    <p class="gris">[Corps de la lettre. Les marges, la police et le filet sont
    posés : il n'y a qu'à écrire. Le texte courant est en Inter Regular,
    10,5&nbsp;pt, sur une mesure de 58 caractères.]</p>
    <p class="gris">[Salutation.]</p>
  </div>
  <div class="pied"><span>Studio Sentis — {VILLE}</span><span class="mono">{SITE}</span></div>
  <div class="barre"></div>
</section>
</body></html>"""
ecrire(os.path.join(PAP, "entete-lettre.html"), LETTRE)

# =========================================================================
# Signature de courriel — tableau HTML, parce que Outlook ne fait pas de flex
# =========================================================================
SIGNATURE = f"""<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Studio Sentis — signature de courriel</title></head>
<body style="margin:0;padding:24px;background:#ffffff">
<!-- =====================================================================
     A copier de la ligne suivante jusqu'au commentaire de fin, puis a coller
     dans Gmail (Parametres > Signature) ou Outlook (Nouveau message >
     Signature). Les styles sont en ligne : c'est la seule facon qu'une
     signature survive aux clients de messagerie, qui retirent les feuilles
     de style. Le logo est une image hebergee par le site : tant qu'il reste
     en ligne, la signature s'affiche partout.
     ===================================================================== -->
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Inter,Helvetica,Arial,sans-serif;color:#1a1a1a">
  <tr>
    <td style="padding-right:16px;border-right:2px solid #006eb8;vertical-align:top">
      <img src="https://{SITE}/icon.png" width="44" height="44" alt="Studio Sentis"
           style="display:block;border:0;border-radius:10px">
    </td>
    <td style="padding-left:16px;vertical-align:top;font-size:13px;line-height:1.5">
      <div style="font-weight:600;font-size:14px;letter-spacing:-0.01em">{NOM}</div>
      <div style="color:#3d3c3a">Studio Sentis — {ROLE}</div>
      <div style="height:8px;line-height:8px">&nbsp;</div>
      <div><a href="mailto:{COURRIEL}" style="color:#005fa0;text-decoration:none">{COURRIEL}</a></div>
      <div><a href="https://{SITE}" style="color:#005fa0;text-decoration:none">{SITE}</a></div>
      <div style="color:#595755;font-size:12px;padding-top:2px">{VILLE}</div>
    </td>
  </tr>
</table>
<!-- ===================== fin de la signature ========================= -->
</body></html>"""
ecrire(os.path.join(PAP, "signature-courriel.html"), SIGNATURE)

TEXTE = f"""--
{NOM}
Studio Sentis — {ROLE}
{COURRIEL}
{SITE}
{VILLE}
"""
ecrire(os.path.join(PAP, "signature-courriel-texte-brut.txt"), TEXTE)

# =========================================================================
# Reseaux sociaux
# =========================================================================
def banniere(l, h, titre, zone_sure=None, corps=None):
    sure = ""
    if zone_sure:
        sl, sh = zone_sure
        sure = (f'<div style="position:absolute;left:50%;top:50%;width:{sl}px;height:{sh}px;'
                f'transform:translate(-50%,-50%);outline:1px dashed rgba(255,255,255,.35);'
                f'pointer-events:none" data-repere></div>')
    return f"""<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>{titre}</title><style>{BASE}
html,body {{ background: {BLEU}; }}
.toile {{ position: relative; width: {l}px; height: {h}px; background: {BLEU};
         color: {PAPIER}; overflow: hidden; }}
.contenu {{ position: absolute; inset: 0; display: flex; flex-direction: column;
           align-items: center; justify-content: center; text-align: center; }}
</style></head><body><div class="toile">{corps}{sure}</div></body></html>"""

# Couverture Facebook : 1640 x 856, mais le telephone n'en montre que 820 x 312
# au centre. Tout ce qui compte tient dans ce rectangle.
fb = banniere(1640, 856, "Couverture Facebook", (820, 312), f"""
<div class="contenu">
  <img src="../1-logo/svg/sentis-logo-horizontal-blanc.svg" style="width:430px">
  <div style="font-size:27px;font-weight:600;letter-spacing:-0.022em;margin-top:26px">{PROMESSE}</div>
  <div style="font-size:17px;letter-spacing:.2em;text-transform:uppercase;opacity:.85;margin-top:18px">{SITE}</div>
</div>""")
ecrire(os.path.join(RES, "facebook-couverture-1640x856.html"), fb)

li = banniere(1584, 396, "Bannière LinkedIn", None, f"""
<div class="contenu" style="align-items:flex-start;padding-left:110px;text-align:left">
  <img src="../1-logo/svg/sentis-logo-horizontal-blanc.svg" style="width:360px">
  <div style="font-size:24px;font-weight:600;letter-spacing:-0.022em;margin-top:20px">{PROMESSE}</div>
</div>""")
ecrire(os.path.join(RES, "linkedin-banniere-1584x396.html"), li)

carre = banniere(1080, 1080, "Publication carrée", None, f"""
<div class="contenu" style="padding:90px">
  <img src="../1-logo/svg/sentis-symbole-blanc.svg" style="width:150px">
  <div style="font-size:60px;font-weight:600;letter-spacing:-0.022em;line-height:1.14;margin-top:56px">{PROMESSE}</div>
  <div style="font-size:26px;letter-spacing:.2em;text-transform:uppercase;opacity:.85;margin-top:48px">{SITE}</div>
</div>""")
ecrire(os.path.join(RES, "publication-carree-1080x1080.html"), carre)

portrait = banniere(1080, 1350, "Publication portrait", None, f"""
<div class="contenu" style="padding:100px;justify-content:space-between;align-items:flex-start;text-align:left">
  <img src="../1-logo/svg/sentis-logo-horizontal-blanc.svg" style="width:360px">
  <div>
    <div style="font-size:40px;letter-spacing:.2em;text-transform:uppercase;opacity:.8;margin-bottom:28px">Titre court</div>
    <div style="font-size:66px;font-weight:600;letter-spacing:-0.022em;line-height:1.12">{PROMESSE}</div>
  </div>
  <div style="font-size:28px;letter-spacing:.2em;text-transform:uppercase;opacity:.85">{SITE}</div>
</div>""")
ecrire(os.path.join(RES, "publication-portrait-1080x1350.html"), portrait)

story = banniere(1080, 1920, "Story", (1080, 1420), f"""
<div class="contenu" style="padding:160px 100px">
  <img src="../1-logo/svg/sentis-symbole-blanc.svg" style="width:170px">
  <div style="font-size:70px;font-weight:600;letter-spacing:-0.022em;line-height:1.12;margin-top:70px">{PROMESSE}</div>
  <div style="font-size:30px;letter-spacing:.2em;text-transform:uppercase;opacity:.85;margin-top:60px">{SITE}</div>
</div>""")
ecrire(os.path.join(RES, "story-1080x1920.html"), story)

print("papeterie et reseaux ecrits")
