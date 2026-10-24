/**
 * Le statut WhatsApp : 1080 x 1920, trois colorations.
 *
 *   node scripts/identite/statut-whatsapp.mjs
 *
 * **Les zones réservées de WhatsApp ne sont pas une marge de confort.** En
 * haut, l'application pose la photo de profil, le nom et l'heure ; en bas, la
 * barre « Répondre » et les boutons. Un visuel qui ignore ces deux bandes se
 * fait manger ses coins. Mesurées sur un écran de 1080 x 1920 : environ
 * 240 px en haut, 260 px en bas. Tout ce qui compte tient entre les deux.
 *
 * Le logo vient des fichiers du dossier d'identité — pas d'un dessin refait
 * pour l'occasion. Si le logo change, ce visuel change avec lui.
 *
 * Les versions `-reperes` montrent les deux bandes en pointillé. Elles
 * servent à vérifier, pas à publier.
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SVG = join(RACINE, "identite", "1-logo", "svg");
const SORTIE = join(RACINE, "identite", "4-reseaux");
const lire = (n) => readFileSync(join(SVG, `${n}.svg`), "utf8");

const SLOGAN = "Le prix et la date,\ndès le premier échange.";
const SITE = "www.studiosentis.ca";
const LIEU = "Châteauguay · Montérégie · Grand Montréal";

// Les trois colorations de la charte, et rien de plus : le bleu du livre, le
// papier, l'encre. Le symbole prend la couleur qui tient sur son fond.
const VARIANTES = [
  // Le blanc cassé à 95 % d'opacité, et pas 72 : mesuré, 72 % donnait 3,30:1
  // sur ce bleu, sous le plancher de 4,5. À 95 % il tient 4,60:1. C'est le
  // genre d'écart qu'on ne voit pas à l'écran et qui se paie sur un téléphone
  // au soleil.
  { cle: "bleu", fond: "#006eb8", encre: "#f8f5f2", sourde: "rgba(248,245,242,.95)", symbole: "sentis-symbole-blanc" },
  { cle: "papier", fond: "#f8f5f2", encre: "#1a1a1a", sourde: "#595755", symbole: "sentis-symbole-couleur" },
  { cle: "encre", fond: "#121314", encre: "#f8f5f2", sourde: "#9ba0a4", symbole: "sentis-symbole-couleur-fond-sombre" },
];

const page = (v, reperes) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  .toile{position:relative;width:1080px;height:1920px;background:${v.fond};color:${v.encre};
         font-family:Inter,system-ui,sans-serif;overflow:hidden;
         display:flex;flex-direction:column;align-items:center;
         /* Les zones réservées, en padding : le contenu ne peut pas y entrer. */
         padding:240px 96px 260px}
  .haut{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:88px;text-align:center}
  .symbole svg{width:240px;height:240px;display:block}
  .slogan{font-size:76px;line-height:1.14;font-weight:600;letter-spacing:-.022em;white-space:pre-line;max-width:17ch}
  .bas{display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center}
  .mot{font-size:40px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
  .lieu{font-size:25px;color:${v.sourde};letter-spacing:.02em}
  .site{font-size:27px;color:${v.sourde};letter-spacing:.2em;text-transform:uppercase}
  .filet{width:96px;height:4px;border-radius:2px;background:${v.encre};opacity:.35}
  .repere{position:absolute;left:0;right:0;border:2px dashed rgba(255,0,0,.55);pointer-events:none}
</style></head><body>
<div class="toile">
  <div class="haut">
    <div class="symbole">${lire(v.symbole)}</div>
    <div class="slogan">${SLOGAN}</div>
  </div>
  <div class="bas">
    <div class="filet"></div>
    <div class="mot">Studio Sentis</div>
    <div class="lieu">${LIEU}</div>
    <div class="site">${SITE}</div>
  </div>
  ${reperes ? `<div class="repere" style="top:0;height:240px"></div>
               <div class="repere" style="bottom:0;height:260px"></div>` : ""}
</div></body></html>`;

const nav = await chromium.launch({ executablePath: process.env.CHROME_PATH });
mkdirSync(SORTIE, { recursive: true });
for (const v of VARIANTES) {
  for (const reperes of [false, true]) {
    const p = await nav.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    await p.setContent(page(v, reperes), { waitUntil: "load" });
    await p.waitForTimeout(250);
    const nom = `statut-whatsapp-${v.cle}${reperes ? "-reperes" : ""}.png`;
    await p.locator(".toile").screenshot({ path: join(SORTIE, nom) });
    await p.close();
    if (!reperes) console.log(join(SORTIE, nom));
  }
}
await nav.close();
