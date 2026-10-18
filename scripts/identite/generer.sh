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

echo "1/7  couleurs"      && $PY scripts/identite/couleurs.py
echo "2/7  palette"       && $PY scripts/identite/palette.py
echo "3/7  logos (SVG)"   && $PY scripts/identite/logos.py
echo "4/7  logos (PNG)"   && node scripts/identite/rendre.mjs
echo "5/7  charte"        && $PY scripts/identite/charte.py && node scripts/identite/charte-pdf.mjs
echo "6/7  applications"  && $PY scripts/identite/applications.py && node scripts/identite/applications-rendu.mjs
# Les captures visent le site EN LIGNE : elles ne sont refaites que sur demande,
# parce qu'elles dependent de ce qui est deploye, pas de ce qui est dans le
# dossier de travail. CAPTURES=1 pour les inclure.
if [ "${CAPTURES:-0}" = "1" ]; then
  echo "7/7  captures"      && node scripts/identite/captures.mjs
else
  echo "7/7  captures       ignorees (CAPTURES=1 pour les refaire)"
fi
echo "fait — identite/"
