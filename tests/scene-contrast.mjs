/**
 * Contraste du texte posé devant une scène 3D.
 *
 * Les scènes WebGL sont dessinées derrière le texte. Aucun outil du projet ne
 * les voit : le détecteur Impeccable lit le CSS calculé, où le fond reste la
 * couleur de la section ; le contrôle responsive ne regarde que l'opacité. Un
 * fil de fer qui passe derrière une lettre n'apparaît donc nulle part, alors
 * que c'est exactement ce qui abîme la lisibilité.
 *
 * Ce contrôle photographie la boîte de chaque titre **une fois le titre rendu
 * invisible** : ce qui reste est exactement le fond que traverse le texte,
 * scène 3D comprise. Il compare ensuite la couleur CSS réelle du texte au pire
 * pixel de ce fond, et échoue sous 4,5:1.
 *
 * Une première version mesurait des centiles de luminance dans la boîte
 * complète. Elle signalait « Services » à 1,65:1 alors que rien n'allait :
 * dans une boîte large d'une mesure entière, les pixels de glyphe pèsent moins
 * de 8 % et le centile bas retombait sur le fond. Masquer le texte supprime
 * cette ambiguïté.
 *
 * Il demande un serveur déjà lancé (voir README).
 */

import { chromium } from "playwright";
import { PNG } from "pngjs";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const LARGEURS = [
  [1280, 900],
  [390, 844],
];
const PAGES = [
  ["/fr", "accueil"],
  ["/en", "accueil-en"],
  ["/fr/services", "services"],
  ["/fr/realisations", "realisations"],
  ["/fr/a-propos", "a-propos"],
  ["/fr/contact", "contact"],
];

const canal = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const luminance = (r, g, b) =>
  0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const contraste = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const constats = [];
const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
);

for (const theme of ["light", "dark"]) {
  for (const [largeur, hauteur] of LARGEURS) {
  for (const [chemin, nom] of PAGES) {
    const ctx = await browser.newContext({
      viewport: { width: largeur, height: hauteur },
      colorScheme: theme,
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(BASE + chemin, { waitUntil: "networkidle" });
    // Le temps que la scène tourne : on ne veut pas mesurer la seule image de
    // départ, mais un état quelconque de l'animation.
    await page.waitForTimeout(2200);

    // Tous les titres qui ont une scène 3D pour ancêtre.
    const boites = await page.evaluate(() => {
      const out = [];
      let n = 0;
      for (const el of document.querySelectorAll("h1, h2, h3, p, li")) {
        const section = el.closest("section");
        if (!section || !section.querySelector("canvas")) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 40 || r.height < 12) continue;
        if (el.children.length) continue;
        if (!(el.textContent || "").trim()) continue;
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        const marque = `scene-contraste-${n++}`;
        el.setAttribute("data-mesure", marque);
        out.push({
          marque,
          texte: (el.textContent || "").trim().slice(0, 28),
          couleur: getComputedStyle(el).color,
          x: Math.max(0, Math.floor(r.left)),
          y: Math.max(0, Math.floor(r.top)),
          w: Math.floor(r.width),
          h: Math.floor(r.height),
        });
      }
      return out;
    });

    for (const b of boites) {
      if (b.x + b.w > largeur || b.y + b.h > hauteur) continue;
      const rgb = b.couleur.match(/-?\d+(\.\d+)?/g);
      if (!rgb || rgb.length < 3) continue;
      const echelle = b.couleur.startsWith("color(") ? 255 : 1;
      const lTexte = luminance(
        Number(rgb[0]) * echelle,
        Number(rgb[1]) * echelle,
        Number(rgb[2]) * echelle,
      );

      // On efface le titre : ce qui reste dans sa boîte est le fond qu'il
      // traverse. `visibility` plutôt que `display`, pour ne pas déplacer la
      // mise en page et mesurer un autre endroit que celui repéré.
      await page.evaluate((m) => {
        const el = document.querySelector(`[data-mesure="${m}"]`);
        if (el instanceof HTMLElement) el.style.visibility = "hidden";
      }, b.marque);
      const tampon = await page.screenshot({
        clip: { x: b.x, y: b.y, width: b.w, height: b.h },
        type: "png",
      });
      await page.evaluate((m) => {
        const el = document.querySelector(`[data-mesure="${m}"]`);
        if (el instanceof HTMLElement) el.style.visibility = "";
      }, b.marque);

      const png = PNG.sync.read(tampon);
      let pire = Infinity;
      for (let i = 0; i < png.data.length; i += 4) {
        const lf = luminance(png.data[i], png.data[i + 1], png.data[i + 2]);
        const c = contraste(lTexte, lf);
        if (c < pire) pire = c;
      }
      if (pire < 4.5) {
        constats.push(
          `[contraste-scene] ${theme} ${nom} @${largeur}px — « ${b.texte} » à ${pire.toFixed(2)}:1 sur le pire pixel de fond`,
        );
      }
    }
    await ctx.close();
  }
  }
}

await browser.close();

if (constats.length) {
  for (const c of constats) console.log(c);
  console.log(`\n--- ${constats.length} constat(s) ---`);
  process.exit(1);
}
console.log("Texte lisible devant chaque scène 3D.");
