#!/usr/bin/env bash
# Refabrique tout le dossier identite/ a partir du code de la marque.
#
#   bash scripts/identite/generer.sh
#
# Il lui faut : python3 avec fonttools et uharfbuzz, node avec playwright,
# et Inter-Bold.otf (voir logos.py pour les emplacements cherches).
set -euo pipefail
cd "$(dirname "$0")/../.."
PY=${PYTHON:-python3}

echo "1/6  couleurs"      && $PY scripts/identite/couleurs.py
echo "2/6  palette"       && $PY scripts/identite/palette.py
echo "3/6  logos (SVG)"   && $PY scripts/identite/logos.py
echo "4/6  logos (PNG)"   && node scripts/identite/rendre.mjs
echo "5/6  charte"        && $PY scripts/identite/charte.py && node scripts/identite/charte-pdf.mjs
echo "6/6  applications"  && $PY scripts/identite/applications.py && node scripts/identite/applications-rendu.mjs
echo "fait — identite/"
