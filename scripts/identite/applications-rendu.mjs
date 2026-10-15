/**
 * Imprime la papeterie en PDF et sort les gabarits de reseaux sociaux en PNG,
 * chacun a la taille exacte attendue par sa plateforme.
 *
 *   node scripts/identite/applications-rendu.mjs
 */
import { chromium } from "playwright";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const I = (...p) => join(RACINE, "identite", ...p);

const navigateur = await chromium.launch({ executablePath: process.env.CHROME_PATH });

// --- impression ----------------------------------------------------------
for (const [src, out, taille] of [
  [I("3-papeterie", "carte-affaires.html"), I("3-papeterie", "carte-affaires-recto-verso.pdf"),
   { width: "95mm", height: "57mm" }],
  [I("3-papeterie", "entete-lettre.html"), I("3-papeterie", "entete-lettre.pdf"),
   { width: "8.5in", height: "11in" }],
]) {
  const p = await navigateur.newPage({ viewport: { width: 1000, height: 1400 } });
  await p.goto("file://" + src, { waitUntil: "networkidle" });
  await p.pdf({ path: out, ...taille, printBackground: true, preferCSSPageSize: true,
                margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await p.close();
  console.log(out);
}

// --- ecran ---------------------------------------------------------------
// Deux sorties quand la plateforme recadre : le fichier propre, et un second
// avec la zone sure en pointille, pour verifier avant de televerser.
const ECRANS = [
  ["facebook-couverture-1640x856", 1640, 856, true],
  ["linkedin-banniere-1584x396", 1584, 396, false],
  ["publication-carree-1080x1080", 1080, 1080, false],
  ["publication-portrait-1080x1350", 1080, 1350, false],
  ["story-1080x1920", 1080, 1920, true],
];
for (const [base, w, h, aReperes] of ECRANS) {
  for (const reperes of aReperes ? [false, true] : [false]) {
    const p = await navigateur.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await p.goto("file://" + I("4-reseaux", `${base}.html`), { waitUntil: "networkidle" });
    if (!reperes) await p.addStyleTag({ content: "[data-repere]{display:none!important}" });
    const out = I("4-reseaux", `${base}${reperes ? "-reperes" : ""}.png`);
    await p.locator(".toile").screenshot({ path: out });
    await p.close();
    console.log(out);
  }
}
await navigateur.close();
