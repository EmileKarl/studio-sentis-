/**
 * Rend les SVG du logo en PNG, avec Chromium : le meme moteur que celui qui
 * affichera le logo sur le web, donc pas d'ecart entre l'apercu et le fichier
 * livre. Fond transparent.
 *
 *   node scripts/identite/rendre.mjs
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SVG = join(RACINE, "identite", "1-logo", "svg");
const PNG = join(RACINE, "identite", "1-logo", "png");
const ICONES = join(RACINE, "identite", "1-logo", "favicon-avatar");

const VARIANTES = ["couleur", "couleur-fond-sombre", "noir", "blanc"];
const taches = [];
for (const v of VARIANTES) {
  for (const verrou of ["horizontal", "empile", "vertical"]) {
    taches.push({ svg: join(SVG, `sentis-logo-${verrou}-${v}.svg`),
                  largeurs: [600, 1200, 2400], sortie: PNG,
                  nom: `sentis-logo-${verrou}-${v}-{w}.png` });
  }
  taches.push({ svg: join(SVG, `sentis-symbole-${v}.svg`),
                largeurs: [512, 1024], sortie: PNG,
                nom: `sentis-symbole-${v}-{w}.png` });
}
// Le badge porte son fond dans le SVG : l'icone d'onglet est un aplat bleu, pas
// un filet bleu, parce qu'a seize pixels un filet disparait.
taches.push({ svg: join(SVG, "sentis-badge-carre-bleu.svg"),
              largeurs: [32, 48, 180, 512, 1024], sortie: ICONES,
              nom: "sentis-icone-{w}.png" });
taches.push({ svg: join(SVG, "sentis-badge-rond-bleu.svg"),
              largeurs: [400, 1000], sortie: ICONES,
              nom: "sentis-avatar-rond-{w}.png" });

const navigateur = await chromium.launch({ executablePath: process.env.CHROME_PATH });
let faits = 0;
for (const t of taches) {
  const svg = readFileSync(t.svg, "utf8");
  const [, w0, h0] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  for (const largeur of t.largeurs) {
    const hauteur = Math.round((h0 * largeur) / w0);
    const page = await navigateur.newPage({
      viewport: { width: Math.round(largeur), height: hauteur },
      deviceScaleFactor: 1,
    });
    await page.setContent(
      `<!doctype html><meta charset="utf-8">
       <style>html,body{margin:0;padding:0;background:transparent}
       svg{display:block;width:${Math.round(largeur)}px;height:${hauteur}px}</style>${svg}`,
      { waitUntil: "load" }
    );
    mkdirSync(t.sortie, { recursive: true });
    await page.screenshot({
      path: join(t.sortie, t.nom.replace("{w}", Math.round(largeur))),
      omitBackground: true,
    });
    await page.close();
    faits++;
  }
}
await navigateur.close();
console.log(`${faits} PNG ecrits`);
