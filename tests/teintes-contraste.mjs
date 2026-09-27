/**
 * Contraste des teintes de section.
 *
 * Les quatre teintes pâles de `sentis.css` portent du texte. Une valeur
 * ajustée « à l'œil » plus tard, pour que ce soit un peu plus coloré, peut
 * faire passer `--ink-muted` sous le plancher sans que rien ne le signale : le
 * détecteur ne relit pas les fichiers de tokens, et le contrôle navigateur ne
 * visite pas les pages qui n'existent pas encore.
 *
 * Ce contrôle lit les tokens dans le CSS — la source, pas une copie — et
 * mesure chaque teinte contre chaque couleur de texte, dans les deux thèmes.
 * Il échoue sous 4,5:1.
 *
 * Il ne demande ni serveur ni navigateur : `node tests/teintes-contraste.mjs`.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const CSS = readFileSync(
  resolve(import.meta.dirname, "../src/styles/sentis.css"),
  "utf8",
);

/** Découpe le fichier en ses deux blocs : thème clair, puis thème sombre. */
function blocs() {
  const debutSombre = CSS.indexOf('.dark [data-brand="sentis"]');
  if (debutSombre < 0) throw new Error("bloc sombre introuvable dans sentis.css");
  return { clair: CSS.slice(0, debutSombre), sombre: CSS.slice(debutSombre) };
}

function token(source, nom) {
  const m = source.match(new RegExp(`--${nom}:\\s*(#[0-9a-fA-F]{6})`));
  return m ? m[1] : null;
}

const canal = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
function luminance(hex) {
  const n = hex.slice(1);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}
const contraste = (a, b) => {
  const [la, lb] = [luminance(a), luminance(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

const TEINTES = ["teinte-sauge", "teinte-ciel", "teinte-argile", "teinte-ocre"];
const TEXTES = ["ink", "ink-secondary", "ink-muted", "signal-aa"];
const PLANCHER = 4.5;

const constats = [];
for (const [theme, source] of Object.entries(blocs())) {
  for (const t of TEINTES) {
    const fond = token(source, t);
    if (!fond) {
      constats.push(`[teinte-manquante] ${theme} — --${t} introuvable`);
      continue;
    }
    for (const nomTexte of TEXTES) {
      const texte = token(source, nomTexte);
      if (!texte) {
        constats.push(`[token-manquant] ${theme} — --${nomTexte} introuvable`);
        continue;
      }
      const r = contraste(texte, fond);
      if (r < PLANCHER) {
        constats.push(
          `[contraste-teinte] ${theme} — --${nomTexte} sur --${t} à ${r.toFixed(2)}:1`,
        );
      }
    }
  }
}

if (constats.length) {
  for (const c of constats) console.log(c);
  console.log(`\n--- ${constats.length} constat(s) ---`);
  process.exit(1);
}
console.log(
  `Les ${TEINTES.length} teintes portent les ${TEXTES.length} couleurs de texte au-dessus de ${PLANCHER}:1, dans les deux thèmes.`,
);
