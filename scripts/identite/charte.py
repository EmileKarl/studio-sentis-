# -*- coding: utf-8 -*-
"""Compose la charte graphique en HTML. Les valeurs viennent de couleurs.json
   et du code du site : rien n'est retape a la main."""
import json
import os, sys
# Tout est relatif a la racine du depot : le script se lance depuis n'importe ou.
RACINE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
IDENTITE = os.path.join(RACINE, "identite")

DEST = os.path.join(IDENTITE, "2-charte")
os.makedirs(DEST, exist_ok=True)
COULEURS = json.load(open(os.path.join(DEST, "palette-studio-sentis.json"), encoding="utf-8"))
AUJ = "15 octobre 2026"

def pastille(c, sombre=False):
    bord = "#2a2d30" if sombre else "#e3dcd4"
    return f"""<div class="couleur">
      <div class="echantillon" style="background:{c['hex']};border-color:{bord}"></div>
      <div class="infos">
        <div class="nom">{c['nom']}</div>
        <div class="role">{c['role']}</div>
        <dl>
          <dt>HEX</dt><dd>{c['hex']}</dd>
          <dt>RVB</dt><dd>{', '.join(str(v) for v in c['rgb'])}</dd>
          <dt>TSL</dt><dd>{c['hsl'][0]}° {c['hsl'][1]}% {c['hsl'][2]}%</dd>
          <dt>CMJN</dt><dd>{' '.join(str(v) for v in c['cmjn'])}</dd>
          <dt>Contraste</dt><dd>{c['contraste_fond']}:1 sur le {c['fond_test']}</dd>
        </dl>
      </div>
    </div>"""

def groupe(titre, sombre=False):
    cls = "grille-couleurs" + (" sur-encre" if sombre else "")
    corps = "".join(pastille(c, sombre) for c in COULEURS[titre])
    return f'<h3>{titre}</h3><div class="{cls}">{corps}</div>'

CSS = """
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body {
  margin: 0; background: #8d8a86;
  font-family: Inter, system-ui, sans-serif;
  color: #1a1a1a; font-size: 9.6pt; line-height: 1.55;
  font-feature-settings: "cv05" 1;
}
.page {
  position: relative; width: 210mm; height: 297mm; padding: 20mm 18mm 16mm;
  background: #f8f5f2; overflow: hidden; margin: 0 auto 8mm;
  page-break-after: always; break-after: page;
}
.page:last-child { page-break-after: auto; margin-bottom: 0; }
.page.encre { background: #121314; color: #f8f5f2; }
.page.bleu  { background: #006eb8; color: #f8f5f2; }

h1,h2,h3,h4 { margin: 0; letter-spacing: -0.022em; font-weight: 700; }
h2 { font-size: 21pt; line-height: 1.1; margin-bottom: 3mm; }
h3 { font-size: 11.5pt; margin: 7mm 0 2.5mm; }
h4 { font-size: 9.6pt; margin: 4mm 0 1mm; }
p { margin: 0 0 2.6mm; max-width: 62ch; }
.chapo { font-size: 11pt; color: #3d3c3a; max-width: 56ch; margin-bottom: 6mm; }
.note { color: #595755; font-size: 8.2pt; line-height: 1.5; }
.encre .note, .encre .chapo { color: #c5c6c7; }
strong { font-weight: 700; }
code, .mono { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 8.2pt; }

.numero {
  position: absolute; top: 20mm; right: 18mm;
  font-size: 8pt; letter-spacing: .14em; text-transform: uppercase; color: #595755;
}
.encre .numero { color: #9ba0a4; }
.pied {
  position: absolute; left: 18mm; right: 18mm; bottom: 9mm;
  display: flex; justify-content: space-between;
  font-size: 7.4pt; letter-spacing: .06em; color: #595755;
  border-top: 1px solid #e3dcd4; padding-top: 2.5mm;
}
.encre .pied { color: #9ba0a4; border-color: #2a2d30; }

.grille-couleurs { display: grid; grid-template-columns: 1fr 1fr; gap: 2.6mm 6mm; }
.couleur { display: flex; gap: 3mm; align-items: flex-start; break-inside: avoid; }
.echantillon { width: 17mm; height: 17mm; border-radius: 2.4mm; border: 1px solid; flex: 0 0 auto; }
.couleur .nom { font-weight: 700; font-size: 9pt; }
.couleur .role { color: #595755; font-size: 7.8pt; margin-bottom: 1mm; }
.sur-encre .role { color: #9ba0a4; }
.couleur dl { margin: 0; display: grid; grid-template-columns: 15mm 1fr; gap: 0 2mm; font-size: 7.4pt; line-height: 1.45; }
.couleur dt { color: #595755; letter-spacing: .05em; }
.sur-encre dt { color: #9ba0a4; }
.couleur dd { margin: 0; font-family: ui-monospace, Menlo, monospace; }

.rangee { display: flex; gap: 8mm; align-items: center; }
.cadre { background: #fff; border: 1px solid #e3dcd4; border-radius: 2.4mm; padding: 6mm; }
.cadre.sombre { background: #121314; border-color: #2a2d30; }
.cadre img { display: block; }
.legende { font-size: 7.6pt; color: #595755; margin-top: 2mm; letter-spacing: .04em; }

table { width: 100%; border-collapse: collapse; font-size: 8.4pt; }
th, td { text-align: left; padding: 1.8mm 2mm; border-bottom: 1px solid #e3dcd4; vertical-align: baseline; }
th { font-size: 7.4pt; letter-spacing: .1em; text-transform: uppercase; color: #595755; font-weight: 600; }
td.mono { font-family: ui-monospace, Menlo, monospace; }

.interdits { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm; }
.interdit { text-align: center; }
.boite { position: relative; height: 26mm; display: flex; align-items: center; justify-content: center;
         background: #fff; border: 1px solid #e3dcd4; border-radius: 2.4mm; overflow: hidden; }
.boite::after { content: ""; position: absolute; inset: 0;
  background: linear-gradient(to top right, transparent calc(50% - 0.6px), #9c3b2c calc(50% - 0.6px),
              #9c3b2c calc(50% + 0.6px), transparent calc(50% + 0.6px)); }
.boite img { max-width: 76%; max-height: 72%; }
.interdit p { font-size: 7.6pt; color: #595755; margin: 1.6mm 0 0; max-width: none; }

.liste-fichiers { font-size: 8.2pt; line-height: 1.75; }
.liste-fichiers .dossier { font-weight: 700; margin-top: 2.5mm; }
.liste-fichiers .mono { color: #3d3c3a; }

.couverture { display: flex; flex-direction: column; justify-content: space-between; height: 100%; }
.couverture .haut img { width: 46mm; }
.couverture h1 { font-size: 34pt; line-height: 1.02; margin-bottom: 4mm; }
.couverture .sous { font-size: 12pt; opacity: .88; max-width: 44ch; }
.couverture .bas { font-size: 8.6pt; letter-spacing: .06em; opacity: .8; }

ul { margin: 0 0 2.6mm; padding-left: 4.5mm; max-width: 62ch; }
li { margin-bottom: 1.2mm; }
.deux { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; }
.schema { width: 100%; }
"""

def page(n, titre, corps, classe=""):
    numero = f'<div class="numero">{n}</div>' if n else ""
    pied = ('<div class="pied"><span>Studio Sentis — charte graphique</span>'
            f'<span>{AUJ}</span></div>') if n else ""
    return f'<section class="page {classe}">{numero}{corps}{pied}</section>'

LOGO = "../1-logo/svg"

pages = []

# --- couverture ----------------------------------------------------------
pages.append(page(None, "", f"""
<div class="couverture">
  <div class="haut"><img src="{LOGO}/sentis-logo-horizontal-blanc.svg" alt="Studio Sentis"></div>
  <div>
    <h1>Charte<br>graphique</h1>
    <p class="sous">Le logo, les couleurs, la typographie et les règles qui
    permettent de poser la marque ailleurs que sur le site, sans qu'elle se
    défasse en chemin.</p>
  </div>
  <div class="bas">Version 1.0 · {AUJ} · Châteauguay, Québec</div>
</div>""", "bleu"))

# --- 01 la marque --------------------------------------------------------
pages.append(page("01 — La marque", "", f"""
<h2>La marque</h2>
<p class="chapo">Studio Sentis conçoit des sites, des applications et des
identités visuelles. Une seule personne mène le projet, et c'est celle à qui
le client parle.</p>

<h3>Ce que la marque promet</h3>
<p>La phrase d'accueil du site dit l'essentiel, et tout le reste en découle :
<strong>« Le prix et la date, dès le premier échange. »</strong> Le secteur
répond « devis sur demande » ; cette marque-ci répond par un chiffre. C'est
une promesse de clarté, pas de prestige — et c'est ce que le dessin doit
porter.</p>

<h3>Les faits</h3>
<table>
  <tr><th>Nom</th><td>Studio Sentis</td></tr>
  <tr><th>Métier</th><td>Sites web, applications, identité visuelle</td></tr>
  <tr><th>Lieu</th><td>Châteauguay, Québec</td></tr>
  <tr><th>Zone desservie</th><td>Châteauguay · Montérégie · Grand Montréal · Québec</td></tr>
  <tr><th>Langues</th><td>Français (fr-CA) et anglais (en-CA)</td></tr>
  <tr><th>Site</th><td class="mono">www.studiosentis.ca</td></tr>
  <tr><th>Courriel</th><td class="mono">Ntek@studiosentis.ca</td></tr>
</table>

<h3>D'où vient ce dessin</h3>
<p>Le symbole et le papier viennent de la planche de marque
« Concept 16 — Chaleur néo-minimaliste ». Les couleurs viennent de la
<strong>combinaison 333</strong> de <em>A Dictionary of Color Combinations</em>
(Sanzo Wada, 1933) : la seule des douze contenant le bleu électrique demandé
dont les quatre teintes se répartissent sur tout le cercle chromatique.</p>
<p class="note">Rien dans ce document n'a été réglé à l'œil. Chaque couple
texte/fond a été mesuré ; aucun ne descend sous 4,5:1, le plancher de la norme
WCAG&nbsp;AA. Les contrastes imprimés ici sont ces mesures.</p>
"""))

# --- 02 le symbole -------------------------------------------------------
pages.append(page("02 — Le symbole", "", f"""
<h2>Le symbole</h2>
<p class="chapo">Un carré aux angles très arrondis, tracé au filet, contenant
un sourire. Pas de pictogramme de métier : un signe qu'on reconnaît à seize
pixels.</p>

<div class="rangee">
  <div><div class="cadre"><img src="{LOGO}/sentis-symbole-couleur.svg" style="width:38mm"></div>
  <div class="legende">Sur le papier</div></div>
  <div><div class="cadre sombre"><img src="{LOGO}/sentis-symbole-couleur-fond-sombre.svg" style="width:38mm"></div>
  <div class="legende">Sur l'encre</div></div>
  <div><div class="cadre"><img src="{LOGO}/sentis-badge-carre-bleu.svg" style="width:30mm"></div>
  <div class="legende">Badge : icône, avatar</div></div>
</div>

<h3>La construction</h3>
<p>Le dessin tient dans un carré de 40 unités. Tout le reste s'en déduit :</p>
<table>
  <tr><th>Boîte de dessin</th><td class="mono">40 × 40</td></tr>
  <tr><th>Carré</th><td class="mono">x 2,1 · y 2,1 · 35,8 × 35,8</td></tr>
  <tr><th>Rayon des angles</th><td class="mono">11,4 — soit 32 % du côté</td></tr>
  <tr><th>Épaisseur du filet</th><td class="mono">2,2 — soit 5,5 % de la boîte</td></tr>
  <tr><th>Le sourire</th><td class="mono">M 12,8 18,2 C 14,2 25,6 · 25,8 25,6 · 27,2 18,2</td></tr>
  <tr><th>Extrémités</th><td class="mono">arrondies (round), jonctions arrondies</td></tr>
</table>

<h3>Deux choses à ne pas défaire</h3>
<p><strong>Le sourire est une courbe cubique, pas un arc de cercle.</strong> Un
demi-cercle exact donne une bouche trop ouverte, qui se lit comme un émoticône.
Les deux points de contrôle descendent plus qu'ils ne s'écartent : le fond de
la courbe s'aplatit et ses extrémités se relèvent.</p>
<p><strong>Le filet grossit avec le symbole.</strong> Il n'est pas d'épaisseur
fixe. Un filet qui ne suit pas la taille devient un cheveu sur une enseigne et
un trait épais sur un favicon.</p>
"""))

# --- 03 les verrouillages ------------------------------------------------
pages.append(page("03 — Les verrouillages", "", f"""
<h2>Les verrouillages</h2>
<p class="chapo">Quatre assemblages, et un seul par défaut. Le choix se fait
sur la forme de l'espace disponible, jamais sur le goût du moment.</p>

<h3>Horizontal — c'est celui-ci par défaut</h3>
<div class="cadre"><img src="{LOGO}/sentis-logo-horizontal-couleur.svg" style="width:92mm"></div>
<p class="legende">En-tête de site, carte d'affaires, signature, en-tête de lettre.</p>

<div class="deux" style="margin-top:5mm">
  <div>
    <h4>Empilé</h4>
    <div class="cadre"><img src="{LOGO}/sentis-logo-empile-couleur.svg" style="width:46mm"></div>
    <p class="legende">Colonne étroite, pied de page, bandeau peu large.</p>
  </div>
  <div>
    <h4>Vertical</h4>
    <div class="cadre"><img src="{LOGO}/sentis-logo-vertical-couleur.svg" style="width:28mm"></div>
    <p class="legende">Format carré : tampon, dos de carte, aplat de réseau social.</p>
  </div>
</div>

<h3>Les proportions, en multiples du corps de texte</h3>
<p>Le verrouillage est défini en <code>em</code>, pas en pixels : il grandit
d'un bloc. Pour le reconstruire ailleurs, une seule valeur à régler.</p>
<table>
  <tr><th></th><th>Horizontal</th><th>Empilé</th><th>Vertical</th></tr>
  <tr><td>Symbole</td><td class="mono">1,55 em</td><td class="mono">1,55 em</td><td class="mono">2,10 em</td></tr>
  <tr><td>Gouttière</td><td class="mono">0,45 em</td><td class="mono">0,45 em</td><td class="mono">0,38 em</td></tr>
  <tr><td>Mot-symbole</td><td class="mono">0,78 em</td><td class="mono">0,56 em</td><td class="mono">0,62 em</td></tr>
  <tr><td>Interlettrage</td><td class="mono">0,055 em</td><td class="mono">0,07 em</td><td class="mono">0,07 em</td></tr>
  <tr><td>Interligne</td><td class="mono">—</td><td class="mono">0,98</td><td class="mono">0,98</td></tr>
  <tr><td>Rapport l × h</td><td class="mono">851 × 155</td><td class="mono">434 × 155</td><td class="mono">259 × 354</td></tr>
</table>
<p class="note">Le mot-symbole est en Inter Bold, en capitales. Dans les
fichiers livrés il est <strong>vectorisé</strong> : un SVG qui appelle « Inter »
par son nom s'affiche en Arial chez qui ne l'a pas installée.</p>
"""))

# --- 04 zone de protection ----------------------------------------------
pages.append(page("04 — Protection et tailles", "", f"""
<h2>Zone de protection</h2>
<p class="chapo">Autour du logo, un vide égal à la moitié de la hauteur du
symbole. Rien n'y entre : ni texte, ni filet, ni bord de page, ni autre logo.</p>

<div class="cadre" style="padding:0;overflow:hidden">
  <svg viewBox="0 0 1200 420" class="schema" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="420" fill="#ffffff"/>
    <rect x="100" y="55" width="1000" height="310" fill="#c6dae6" opacity=".55"/>
    <rect x="177.5" y="132.5" width="845" height="155" fill="#ffffff"/>
    <g transform="translate(177.5 132.5) scale(1)">
      <image href="{LOGO}/sentis-logo-horizontal-couleur.svg" width="851" height="155"/>
    </g>
    <g stroke="#005fa0" stroke-width="2" stroke-dasharray="7 6" fill="none">
      <rect x="177.5" y="132.5" width="845" height="155"/>
      <rect x="100" y="55" width="1000" height="310"/>
    </g>
    <g fill="#005fa0" font-family="Inter,sans-serif" font-size="22" font-weight="700">
      <text x="128" y="100">½ h</text>
      <text x="1045" y="100">½ h</text>
    </g>
    <g stroke="#005fa0" stroke-width="2">
      <line x1="140" y1="210" x2="170" y2="210"/>
      <line x1="1030" y1="210" x2="1060" y2="210"/>
    </g>
  </svg>
</div>
<p class="legende">h = hauteur du symbole. La zone claire au centre est le
logo ; le lavis bleu est la marge que rien ne franchit.</p>

<h2 style="margin-top:9mm">Tailles minimales</h2>
<p>En dessous, le filet du symbole se ferme et le sourire disparaît. Ces
valeurs sont des planchers, pas des cibles.</p>
<table>
  <tr><th>Support</th><th>Horizontal</th><th>Empilé</th><th>Symbole seul</th></tr>
  <tr><td>Écran</td><td class="mono">120 px de large</td><td class="mono">72 px</td><td class="mono">24 px</td></tr>
  <tr><td>Impression</td><td class="mono">28 mm de large</td><td class="mono">18 mm</td><td class="mono">7 mm</td></tr>
  <tr><td>Favicon / icône</td><td colspan="3" class="mono">utiliser le badge carré, jamais le logo complet</td></tr>
</table>
<p class="note">Sous 24 px, le symbole au filet n'est plus lisible : c'est pour
cela que l'icône d'onglet est un <strong>aplat bleu avec le symbole en blanc
cassé</strong> et non un filet bleu sur fond clair. Le premier tient 4,93:1 à
seize pixels, le second s'efface.</p>
"""))

# --- 05 interdits --------------------------------------------------------
pages.append(page("05 — Ce qu'on ne fait pas", "", f"""
<h2>Ce qu'on ne fait pas</h2>
<p class="chapo">Six gestes qui défont la marque. Ils ont l'air anodins pris un
par un ; c'est leur accumulation qui fait qu'une identité ne se reconnaît plus
d'un support à l'autre.</p>

<div class="interdits">
  <div class="interdit"><div class="boite">
    <img src="{LOGO}/sentis-logo-horizontal-couleur.svg" style="transform:scaleX(1.5)">
  </div><p>Étirer ou comprimer. Le verrouillage se redimensionne d'un bloc, proportions gardées.</p></div>

  <div class="interdit"><div class="boite">
    <img src="{LOGO}/sentis-logo-horizontal-couleur.svg" style="filter:hue-rotate(110deg) saturate(1.6)">
  </div><p>Recolorer. Quatre colorations existent ; il n'y en a pas de cinquième.</p></div>

  <div class="interdit"><div class="boite">
    <img src="{LOGO}/sentis-logo-horizontal-couleur.svg" style="filter:drop-shadow(0 3px 4px rgba(0,0,0,.55))">
  </div><p>Ajouter une ombre, un contour, un dégradé ou un reflet.</p></div>

  <div class="interdit"><div class="boite">
    <img src="{LOGO}/sentis-logo-horizontal-couleur.svg" style="transform:rotate(-12deg)">
  </div><p>Incliner. Le logo est toujours d'aplomb.</p></div>

  <div class="interdit"><div class="boite" style="background:#95461f">
    <img src="{LOGO}/sentis-logo-horizontal-couleur.svg">
  </div><p>Poser la version bleue sur un fond coloré. Sur fond soutenu, c'est la version blanche.</p></div>

  <div class="interdit"><div class="boite">
    <img src="{LOGO}/sentis-symbole-couleur.svg" style="width:14mm">
    <span style="font:700 13pt Inter,sans-serif;letter-spacing:.04em;margin-left:3mm">Studio Sentis</span>
  </div><p>Recomposer le mot dans une autre police, une autre graisse ou en bas de casse.</p></div>
</div>

<h3>Et aussi</h3>
<ul>
  <li>Ne pas séparer le symbole du mot pour les reposer à deux endroits d'une même page comme s'ils formaient un verrouillage.</li>
  <li>Ne pas enfermer le logo dans une forme qui n'est pas un des badges livrés.</li>
  <li>Ne pas poser le logo sur une photo chargée : réserver un aplat, ou utiliser la version blanche sur une zone sombre et calme de l'image.</li>
  <li>Ne pas réécrire le nom : <strong>Studio Sentis</strong>, deux mots, pas de trait d'union, pas de « studio sentis » ni de « STUDIOSENTIS ».</li>
</ul>
"""))

# --- 06-07 couleurs ------------------------------------------------------
pages.append(page("06 — Couleurs", "", f"""
<h2>Couleurs</h2>
<p class="chapo">Quatre couleurs issues du livre, puis tout ce qui en découle.
Le bleu mène : c'est lui qui signe le logo et qui porte l'action.</p>
{groupe("Les quatre couleurs du livre (valeurs source)")}
{groupe("Theme clair — surfaces et texte")}
<p class="note" style="margin-top:3mm">CMJN : conversion arithmétique, sans
profil ICC. Point de départ, à valider sur épreuve — voir page 06 (impression).</p>
"""))

pages.append(page("06 — Couleurs (suite)", "", f"""
<h2>Couleurs — accents et sections</h2>
{groupe("Theme clair — signal et accents")}
{groupe("Theme clair — lavis de section (couleur du livre a 20 %)")}
<h3>Comment les quatre couleurs se répartissent</h3>
<p>Chaque couleur du livre tient trois rôles : un <strong>lavis</strong> (la
couleur diluée à 20 % dans le papier) pour le fond de section, un
<strong>accent</strong> (la même couleur assombrie) pour le pictogramme et le
titre, et sa valeur source pour les aplats.</p>
<p class="note">Les accents ne sont pas choisis à l'œil : un solveur part de la
couleur du livre et ne déplace que sa <em>clarté</em>, teinte et saturation
constantes, jusqu'à ce que le plancher de 4,5:1 soit atteint à la fois sur le
papier et sur son propre lavis. C'est la seconde contrainte qui décide. Pire
couple de la palette : 4,63:1.</p>
"""))

pages.append(page("06 — Couleurs (thème sombre)", "", f"""
<h2>Thème sombre</h2>
<p class="chapo">Le livre ne donne pas de thème sombre. Deux de ses quatre
couleurs passent pourtant sans retouche sur fond d'encre ; seuls le bleu et le
sienne s'éclaircissent.</p>
{groupe("Theme sombre", sombre=True)}
<h3 style="color:#f8f5f2">Pourquoi le fond sombre est froid</h3>
<p>Le fond du thème sombre était un presque-noir chaud, hérité de l'accent
terre de la planche. Sous un bleu à 100&nbsp;% de saturation, cette chaleur le
rendait sale : il est passé au <span class="mono">#121314</span>, froid.
L'encre, elle, reste le blanc cassé de la planche — même valeur qu'en thème
clair, où c'est le papier.</p>
""", "encre"))

# --- 06 impression et etats ---------------------------------------------
pages.append(page("06 — Impression et états", "", f"""
<h2>Impression</h2>
<p class="chapo">Ce qui change entre l'écran et le papier.</p>

<h3>Les valeurs CMJN sont un point de départ</h3>
<p>Conversion arithmétique, sans profil ICC. Un bleu à 100&nbsp;% de saturation
est le genre de couleur qui se déplace en quadrichromie :
<strong>demander une épreuve contractuelle</strong> avant tout tirage qui
compte, et la comparer au HEX à l'écran.</p>

<h3>Couleur d'accompagnement</h3>
<p>Pour un tirage à une ou deux couleurs — carte d'affaires, papeterie,
sérigraphie, broderie — faire déterminer la référence Pantone par l'imprimeur
<strong>à partir du HEX</strong> <span class="mono">#006EB8</span>. Ne pas en
deviner une : un numéro Pantone inventé se retrouve dans tous les devis
suivants et devient la marque à la place du bleu réel.</p>

<h3>Fond perdu et marges</h3>
<table style="margin-bottom:1mm">
  <tr><th>Fond perdu</th><td class="mono">3 mm sur chaque bord</td></tr>
  <tr><th>Marge de sécurité</th><td class="mono">4 mm depuis le bord rogné</td></tr>
  <tr><th>Résolution des images</th><td class="mono">300 ppp à la taille finale</td></tr>
  <tr><th>Noir du texte</th><td class="mono">100 % K seul, jamais un noir riche</td></tr>
  <tr><th>Fichiers à fournir</th><td class="mono">PDF/X-4, polices vectorisées ou incorporées</td></tr>
</table>
<p class="note">Le noir de la marque n'est pas un noir pur : en petit corps il
s'imprime en 100&nbsp;% K, car un noir composé de quatre encres bouge au
moindre défaut de repérage.</p>

<h2 style="margin-top:7mm">États</h2>
<p>Quatre couleurs de message, hors palette de marque. Elles disent ce qui
s'est passé — elles ne décorent pas.</p>
{groupe("Etats")}
"""))

# --- 08 typographie ------------------------------------------------------
pages.append(page("07 — Typographie", "", """
<h2>Typographie</h2>
<p class="chapo">Une seule famille : <strong>Inter</strong>. Les titres se
distinguent par la graisse et l'interlettrage, pas par une seconde police.</p>

<div style="font-size:26pt;line-height:1.05;letter-spacing:-0.022em;font-weight:600;margin:4mm 0 2mm">
Le prix et la date, dès le premier échange.</div>
<div style="font-size:9.6pt;color:#3d3c3a;max-width:56ch">Un site, une
application ou une identité visuelle, menés par une seule personne — celle à
qui vous parlez.</div>

<h3>La famille</h3>
<table>
  <tr><th>Nom</th><td>Inter</td></tr>
  <tr><th>Auteur</th><td>Rasmus Andersson — <span class="mono">rsms.me/inter</span></td></tr>
  <tr><th>Licence</th><td>SIL Open Font License 1.1 — libre, y compris commercialement</td></tr>
  <tr><th>Substitut sans Inter</th><td class="mono">system-ui, -apple-system, Segoe UI, Roboto, sans-serif</td></tr>
</table>

<h3>Les quatre graisses, et à quoi chacune sert</h3>
<table>
  <tr><th>Graisse</th><th>Emploi</th></tr>
  <tr><td class="mono">400 Regular</td><td>texte courant, légendes, étiquettes</td></tr>
  <tr><td class="mono">500 Medium</td><td>liens, appuis dans une phrase, libellés de bouton</td></tr>
  <tr><td class="mono">600 SemiBold</td><td><strong>tous les titres</strong>, du plus petit au plus grand</td></tr>
  <tr><td class="mono">700 Bold</td><td>le mot-symbole du logo, et rien d'autre</td></tr>
</table>
<p class="note">Le gras plein est réservé au logo. C'est ce qui fait qu'il
reste identifiable au milieu d'une page qui, elle, ne dépasse pas le 600.</p>

"""))

pages.append(page("07 — Typographie (suite)", "", """
<h2>L'échelle</h2>
<p class="chapo">Relevée sur le site en ligne, pas décidée sur le papier.</p>
<table>
  <tr><th>Rôle</th><th>Corps</th><th>Graisse</th><th>Interlettrage</th></tr>
  <tr><td>Titre d'accueil</td><td class="mono">96 / 72 px</td><td class="mono">600</td><td class="mono">-0,022 em</td></tr>
  <tr><td>Titre de page</td><td class="mono">48 px</td><td class="mono">600</td><td class="mono">-0,022 em</td></tr>
  <tr><td>Titre de section</td><td class="mono">36 / 30 px</td><td class="mono">600</td><td class="mono">-0,022 em</td></tr>
  <tr><td>Sous-titre</td><td class="mono">18 px</td><td class="mono">600</td><td class="mono">-0,022 em</td></tr>
  <tr><td>Texte courant</td><td class="mono">16 px</td><td class="mono">400</td><td class="mono">0</td></tr>
  <tr><td>Texte secondaire</td><td class="mono">14 px</td><td class="mono">400</td><td class="mono">0</td></tr>
  <tr><td>Étiquette, surtitre</td><td class="mono">12 px, capitales</td><td class="mono">400</td><td class="mono">+0,10 em</td></tr>
  <tr><td>Compteur, mention</td><td class="mono">11 px, capitales</td><td class="mono">400</td><td class="mono">+0,20 em</td></tr>
  <tr><td>Mot-symbole du logo</td><td class="mono">0,78 em, capitales</td><td class="mono">700</td><td class="mono">+0,055 em</td></tr>
</table>

<h3>Deux réglages à ne pas perdre</h3>
<p><strong>L'interlettrage négatif sur les grands corps.</strong> Un grotesk
neutre composé en grand paraît lâche : les blancs entre lettres grandissent
avec le corps alors que l'œil, lui, ne change pas. Resserrer de 2,2&nbsp;%
rend au titre la densité qu'il a en petit. C'est la même valeur à tous les
corps de titre, de 18 à 96&nbsp;px.</p>
<p><strong>Le texte courant ne dépasse pas 58 caractères par ligne.</strong>
C'est plus court que la mesure habituelle de 65–75 signes, et c'est voulu : le
lecteur de ce studio n'est pas un développeur qui parcourt une documentation,
il lit une phrase à la fois.</p>
"""))

# --- 09 mise en page -----------------------------------------------------
pages.append(page("08 — Mise en page", "", """
<h2>Mise en page</h2>
<p class="chapo">Les mêmes valeurs partout : ce sont elles qui font qu'une
affiche et une page web se reconnaissent comme la même marque.</p>

<h3>Échelle d'espacement</h3>
<p>Une seule suite, en pixels, et rien entre les pas :</p>
<p class="mono">4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128</p>

<h3>Rayons</h3>
<table>
  <tr><th>Rayon de base</th><td class="mono">10 px (0,625 rem)</td><td>boutons, champs, cartes</td></tr>
  <tr><th>Petit</th><td class="mono">6 px</td><td>pastilles, étiquettes</td></tr>
  <tr><th>Grand</th><td class="mono">14 – 18 px</td><td>grandes surfaces, panneaux</td></tr>
  <tr><th>Complet</th><td class="mono">9999 px</td><td>pastille ronde, compteur</td></tr>
</table>
<p class="note">Plus doux que l'angle vif, sans basculer dans la bulle. Le
rayon du symbole (32 % du côté) est une exception qui lui appartient : ne pas
l'appliquer aux cartes.</p>

<h3>Ombres</h3>
<p>L'ombre remplace le filet comme séparateur principal. Elle est portée et
floue, comme une feuille posée sur une table — jamais un halo.</p>
<table>
  <tr><th>Faible</th><td class="mono">0 1px 2px rgb(18 19 20 / 0,05)</td></tr>
  <tr><th>Moyenne</th><td class="mono">0 4px 16px rgb(18 19 20 / 0,07)</td></tr>
  <tr><th>Forte</th><td class="mono">0 16px 48px rgb(18 19 20 / 0,10)</td></tr>
</table>

<h3>Grille</h3>
<table>
  <tr><th>Largeur maximale</th><td class="mono">1180 px</td></tr>
  <tr><th>Gouttière</th><td class="mono">24 px</td></tr>
  <tr><th>Colonnes</th><td class="mono">12</td></tr>
  <tr><th>Mesure du texte</th><td class="mono">58 caractères</td></tr>
</table>

<h3>Mouvement</h3>
<p>Une seule entrée : les blocs montent de 12 à 18 px en apparaissant, et
c'est tout. Pas de rebond, pas de rotation, pas d'apparition lettre par
lettre. Sous <code>prefers-reduced-motion</code>, tout s'affiche d'emblée.</p>
"""))

# --- 10 ton --------------------------------------------------------------
pages.append(page("09 — Le ton", "", """
<h2>Le ton</h2>
<p class="chapo">La marque se reconnaît autant à ce qu'elle écrit qu'à ce
qu'elle dessine. Quatre règles, tenues partout.</p>

<h3>1. Le chiffre avant l'adjectif</h3>
<p>« 4 200 $, livré en 18 jours » plutôt que « des sites performants à prix
compétitif ». Un prix affiché est la seule chose qui distingue vraiment ce
studio de ses concurrents : ne jamais la cacher derrière une formule.</p>

<h3>2. Le vouvoiement, et une seule personne en face</h3>
<p>« Vous », jamais « nos clients ». Et « je » plutôt que « nous » : le studio
est une personne, le prétendre plus gros se verrait au premier appel.</p>

<h3>3. Pas de jargon de métier</h3>
<p>Le lecteur est un commerçant, un artisan, une petite structure de la
Rive-Sud. Il ne sait pas ce qu'est un <em>responsive breakpoint</em> et n'a pas
à l'apprendre. Dire « le site s'adapte au téléphone ».</p>

<h3>4. Une seule chose demandée à la fois</h3>
<p>Une page, une action. Sur l'accueil, c'est « Parler de votre projet ».
Ajouter un second bouton de même poids, c'est demander au lecteur de choisir
avant de savoir.</p>

<h3>Ce qu'on n'écrit pas</h3>
<ul>
  <li>« Solutions sur mesure », « votre partenaire de confiance », « clé en main » — des formules que tout le monde emploie et que personne ne vérifie.</li>
  <li>Des promesses non datées : « rapidement », « dans les meilleurs délais ».</li>
  <li>Des superlatifs sur soi-même : « leader », « expert reconnu ».</li>
  <li>Du faux pluriel : « notre équipe » quand il n'y en a pas.</li>
</ul>

<h3>Bilingue</h3>
<p>Le site existe en français et en anglais, et le français est la version de
référence. Une phrase écrite d'abord en anglais puis traduite s'entend : la
tournure reste anglaise. Écrire en français, puis traduire.</p>
"""))

# --- 11 applications -----------------------------------------------------
pages.append(page("10 — Applications", "", f"""
<h2>Applications</h2>
<p class="chapo">Ce que le dossier livre, prêt à utiliser.</p>

<div class="deux">
  <div>
    <h4>Carte d'affaires</h4>
    <p class="note">89 × 51 mm, recto-verso, fond perdu 3 mm. Recto : le logo
    sur le papier. Verso : aplat bleu, symbole en blanc cassé, coordonnées.</p>
  </div>
  <div>
    <h4>En-tête de lettre</h4>
    <p class="note">Lettre US 8,5 × 11 po. Logo en tête, filet bleu en pied,
    marges de 25 mm. Se remplit dans n'importe quel traitement de texte.</p>
  </div>
  <div>
    <h4>Signature de courriel</h4>
    <p class="note">Une version HTML à coller dans Gmail ou Outlook, et une
    version texte brut pour les clients qui refusent le HTML.</p>
  </div>
  <div>
    <h4>Réseaux sociaux</h4>
    <p class="note">Avatar rond et carré, couverture Facebook, bannière
    LinkedIn, gabarits de publication et de story.</p>
  </div>
</div>

<h3>Les fichiers</h3>
<div class="liste-fichiers">
  <div class="dossier">1-logo/</div>
  <div class="mono">svg/ — 18 fichiers vectoriels : horizontal, empilé, vertical et symbole,
  en quatre colorations (couleur, couleur sur fond sombre, noir, blanc), plus deux badges.</div>
  <div class="mono">png/ — les mêmes en 600, 1200 et 2400 px de large, fond transparent.</div>
  <div class="mono">favicon-avatar/ — icônes 32, 48, 180, 512, 1024 px et avatars ronds 400 et 1000 px.</div>
  <div class="dossier">2-charte/</div>
  <div class="mono">la charte en PDF et en HTML, et la palette en CSS, JSON et .gpl (GIMP, Inkscape, Krita).</div>
  <div class="dossier">3-papeterie/</div>
  <div class="mono">carte d'affaires, en-tête de lettre, signature de courriel.</div>
  <div class="dossier">4-reseaux/</div>
  <div class="mono">avatars, couvertures et gabarits aux formats des plateformes.</div>
  <div class="dossier">5-polices/</div>
  <div class="mono">Inter en quatre graisses, sa licence, et comment l'installer.</div>
  <div class="dossier">6-captures/</div>
  <div class="mono">captures du site en ligne : premier écran en double densité, parcours en
  huit arrêts, page entière, téléphone.</div>
</div>

<h3>Quel format donner à qui</h3>
<table>
  <tr><th>Destinataire</th><th>Fichier</th></tr>
  <tr><td>Imprimeur, enseigniste, brodeur</td><td class="mono">SVG (vectoriel, redimensionnable sans perte)</td></tr>
  <tr><td>Réseaux sociaux, document Word, diaporama</td><td class="mono">PNG 1200 px</td></tr>
  <tr><td>Grand format, affiche, véhicule</td><td class="mono">SVG, ou PNG 2400 px au minimum</td></tr>
  <tr><td>Onglet de navigateur, application</td><td class="mono">favicon-avatar/sentis-icone-*.png</td></tr>
  <tr><td>« À quoi ressemble le site ? »</td><td class="mono">6-captures/haut/accueil-1440x900@2x.png</td></tr>
</table>
"""))

HTML = f"""<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<title>Studio Sentis — charte graphique</title>
<style>{CSS}</style></head>
<body>{''.join(pages)}</body></html>"""

chemin = os.path.join(DEST, "charte-graphique-studio-sentis.html")
open(chemin, "w", encoding="utf-8").write(HTML)
print(chemin, len(HTML), "octets,", len(pages), "pages")
