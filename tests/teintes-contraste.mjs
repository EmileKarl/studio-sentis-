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
 * mesure, dans les deux thèmes : chaque teinte contre chaque couleur de texte,
 * puis chaque accent sur le papier, sur son propre fond de section, et sous du
 * blanc en aplat. Il échoue sous 4,5:1.
 *
 * C'est la troisième de ces situations qui a fait assombrir le vert (#15803d
 * ne donnait que 4,30:1 sur son propre fond) et le cyan (4,52:1, de justesse).
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

const COULEURS = ["bleu", "cyan", "violet", "vert"];
const TEINTES = COULEURS.map((c) => `teinte-${c}`);
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

// Les accents, eux, servent de trait et de fond plein. Trois situations à
// couvrir : l'accent posé sur le papier de la page, l'accent posé sur son
// propre fond de section (le cas qui a fait assombrir le vert et le cyan), et
// le texte posé sur l'accent en aplat. Ce dernier ne peut pas être « blanc » :
// en thème sombre les accents s'éclaircissent et le contrôle mesurait du blanc
// sur le cyan à 1,82:1. D'où le token `--accent-contrast`, qui bascule.
for (const [theme, source] of Object.entries(blocs())) {
  const papier = token(source, "paper");
  const contrasteTexte = token(source, "accent-contrast");
  for (const c of COULEURS) {
    const accent = token(source, `accent-${c}`);
    const teinte = token(source, `teinte-${c}`);
    if (!accent) {
      constats.push(`[accent-manquant] ${theme} — --accent-${c} introuvable`);
      continue;
    }
    const paires = [
      [`--accent-${c} sur le papier`, papier && contraste(accent, papier)],
      [`--accent-${c} sur --teinte-${c}`, teinte && contraste(accent, teinte)],
      [
        `--accent-contrast sur --accent-${c}`,
        contrasteTexte && contraste(contrasteTexte, accent),
      ],
    ];
    for (const [quoi, r] of paires) {
      if (typeof r === "number" && r < PLANCHER) {
        constats.push(`[contraste-accent] ${theme} — ${quoi} à ${r.toFixed(2)}:1`);
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
  `Les ${TEINTES.length} teintes portent les ${TEXTES.length} couleurs de texte, et les ${COULEURS.length} accents tiennent sur le papier, sur leur fond et sous leur couleur de contraste — tout au-dessus de ${PLANCHER}:1, dans les deux thèmes.`,
);
