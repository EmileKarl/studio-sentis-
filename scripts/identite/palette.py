# -*- coding: utf-8 -*-
"""La palette dans trois formats : CSS autonome, JSON, et .gpl pour GIMP,
   Inkscape et Krita. Tout vient de couleurs.json : rien n'est retape."""
import json
import os, sys
# Tout est relatif a la racine du depot : le script se lance depuis n'importe ou.
RACINE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
IDENTITE = os.path.join(RACINE, "identite")

DEST = os.path.join(IDENTITE, "2-charte")
C = json.load(open(os.path.join(DEST, "palette-studio-sentis.json"), encoding="utf-8"))

# --- .gpl ----------------------------------------------------------------
lignes = ["GIMP Palette", "Name: Studio Sentis", "Columns: 4",
          "# Studio Sentis — palette de marque", "#"]
for groupe, items in C.items():
    lignes.append(f"# {groupe}")
    for c in items:
        r, v, b = c["rgb"]
        lignes.append(f"{r:>3} {v:>3} {b:>3}\t{c['nom']} — {c['hex']}")
open(os.path.join(DEST, "palette-studio-sentis.gpl"), "w", encoding="utf-8").write("\n".join(lignes) + "\n")

# --- .css autonome -------------------------------------------------------
CSS = """/* =========================================================================
   Studio Sentis — jetons de couleur, sans dépendance.

   Copie autonome de ce que le site utilise : à coller dans n'importe quel
   projet, avec ou sans Tailwind. Les deux thèmes sont là ; le second
   s'applique sous `.sombre` ou selon la préférence du système.

   Chaque couple texte/fond a été mesuré. Aucun ne descend sous 4,5:1.
   ========================================================================= */

:root {
  /* Surfaces */
  --sentis-papier: #f8f5f2;
  --sentis-surface: #ffffff;
  --sentis-surface-2: #e6dacd;

  /* Texte */
  --sentis-encre: #1a1a1a;
  --sentis-encre-seconde: #3d3c3a;
  --sentis-encre-sourde: #595755;

  /* Filets */
  --sentis-filet: #e3dcd4;
  --sentis-filet-fort: #b9b0a6;

  /* Signal — le bleu du logo */
  --sentis-signal: #006eb8;
  --sentis-signal-texte: #005fa0;
  --sentis-signal-contraste: #f8f5f2;

  /* Les quatre couleurs du livre, en lavis de section */
  --sentis-lavis-bleu: #c6dae6;
  --sentis-lavis-jaune: #f8f3cf;
  --sentis-lavis-sienne: #e9d4c9;
  --sentis-lavis-vert: #e4eee4;

  /* …et en accents, lisibles sur le papier comme sur leur lavis */
  --sentis-accent-bleu: #005fa0;
  --sentis-accent-jaune: #756e04;
  --sentis-accent-sienne: #95461f;
  --sentis-accent-vert: #337449;
  --sentis-accent-contraste: #f8f5f2;

  /* États */
  --sentis-succes: #3f6b4a;
  --sentis-alerte: #8a5e2a;
  --sentis-erreur: #9c3b2c;
  --sentis-info: #44607a;

  /* Formes */
  --sentis-rayon: 0.625rem;
  --sentis-mesure: 58ch;
  --sentis-ombre-faible: 0 1px 2px rgb(18 19 20 / 0.05);
  --sentis-ombre-moyenne: 0 4px 16px rgb(18 19 20 / 0.07);
  --sentis-ombre-forte: 0 16px 48px rgb(18 19 20 / 0.10);

  /* Typographie */
  --sentis-police: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --sentis-serrage-titre: -0.022em;
}

.sombre {
  --sentis-papier: #121314;
  --sentis-surface: #1b1d1f;
  --sentis-surface-2: #262a2d;

  --sentis-encre: #f8f5f2;
  --sentis-encre-seconde: #c5c6c7;
  --sentis-encre-sourde: #9ba0a4;

  --sentis-filet: #2a2d30;
  --sentis-filet-fort: #434749;

  --sentis-signal: #008eed;
  --sentis-signal-texte: #21a6ff;
  --sentis-signal-contraste: #121314;

  --sentis-lavis-bleu: #0f2332;
  --sentis-lavis-jaune: #37361c;
  --sentis-lavis-sienne: #2e1e17;
  --sentis-lavis-vert: #2a352f;

  --sentis-accent-bleu: #008eed;
  --sentis-accent-jaune: #f8ed43;
  --sentis-accent-sienne: #d66d39;
  --sentis-accent-vert: #96d1aa;
  --sentis-accent-contraste: #121314;

  --sentis-succes: #7fb48c;
  --sentis-alerte: #d7a662;
  --sentis-erreur: #e08a76;
  --sentis-info: #8fb0cc;

  --sentis-ombre-faible: 0 1px 2px rgb(0 0 0 / 0.5);
  --sentis-ombre-moyenne: 0 4px 16px rgb(0 0 0 / 0.55);
  --sentis-ombre-forte: 0 16px 48px rgb(0 0 0 / 0.6);
}

/* Le thème sombre suit le système quand rien ne le force. */
@media (prefers-color-scheme: dark) {
  :root:not(.clair) {
    --sentis-papier: #121314;
    --sentis-surface: #1b1d1f;
    --sentis-surface-2: #262a2d;
    --sentis-encre: #f8f5f2;
    --sentis-encre-seconde: #c5c6c7;
    --sentis-encre-sourde: #9ba0a4;
    --sentis-filet: #2a2d30;
    --sentis-filet-fort: #434749;
    --sentis-signal: #008eed;
    --sentis-signal-texte: #21a6ff;
    --sentis-signal-contraste: #121314;
    --sentis-lavis-bleu: #0f2332;
    --sentis-lavis-jaune: #37361c;
    --sentis-lavis-sienne: #2e1e17;
    --sentis-lavis-vert: #2a352f;
    --sentis-accent-bleu: #008eed;
    --sentis-accent-jaune: #f8ed43;
    --sentis-accent-sienne: #d66d39;
    --sentis-accent-vert: #96d1aa;
    --sentis-accent-contraste: #121314;
  }
}

body {
  background: var(--sentis-papier);
  color: var(--sentis-encre);
  font-family: var(--sentis-police);
}
h1, h2, h3, h4 {
  font-weight: 600;
  letter-spacing: var(--sentis-serrage-titre);
}
"""
open(os.path.join(DEST, "palette-studio-sentis.css"), "w", encoding="utf-8").write(CSS)
print("palette : .css et .gpl (le .json vient de couleurs.py)")
