/**
 * Fabrique les images de marque : icône d'onglet, icône iOS, image de partage.
 *
 * Pourquoi un script plutôt que des fichiers dessinés à la main : le logotype
 * du studio est du texte composé dans la Fraunces, pas un dessin. Le seul moyen
 * d'obtenir une icône qui soit *exactement* la même lettre que celle de
 * l'en-tête, c'est de la faire rendre par le même moteur que le site, puis de
 * la photographier. Si la marque change, on relance ce script.
 *
 *   node scripts/generer-images-marque.mjs
 *
 * Il écrit :
 *   src/app/icon.png          512 × 512  — icône d'onglet (convention Next)
 *   src/app/apple-icon.png    180 × 180  — écran d'accueil iOS
 *   public/og.png            1200 × 630  — aperçu au partage (Open Graph)
 *
 * Il a besoin d'un Chromium. `CHROME_PATH` permet d'en désigner un déjà
 * présent plutôt que de laisser Playwright en télécharger un.
 */

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const RACINE = resolve(import.meta.dirname, "..");

// Les couleurs sont recopiées de `src/styles/sentis.css`. Ce sont des images
// figées : elles ne peuvent pas suivre les tokens au moment du rendu, donc
// toute modification de la palette demande de relancer ce script.
const PAPIER = "#fcfaf6";
const ENCRE = "#1a1714";
const VERMILLON = "#be2f16";

const POLICE = `
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Source+Sans+3:wght@400&display=swap" rel="stylesheet">
`;

/**
 * L'icône : la lettre seule, soulignée de vermillon.
 *
 * Le trait est volontairement épais — 8 % du côté. Sous 20 px, un filet fin
 * disparaît complètement et il ne reste qu'un « S » anonyme ; à cette
 * épaisseur, la barre colorée reste lisible et c'est elle qui signe.
 */
const icone = (taille) => `<!doctype html><html><head><meta charset="utf-8">${POLICE}
<style>
  html,body{margin:0;padding:0}
  body{width:${taille}px;height:${taille}px;background:${PAPIER};
       display:flex;align-items:center;justify-content:center}
  .s{font-family:Fraunces,Georgia,serif;font-weight:700;color:${ENCRE};
     font-size:${Math.round(taille * 0.72)}px;line-height:1;
     padding-bottom:${Math.round(taille * 0.06)}px;
     box-shadow:inset 0 -${Math.round(taille * 0.08)}px 0 ${VERMILLON}}
</style></head><body><span class="s">S</span></body></html>`;

/**
 * L'aperçu au partage : ce que voient Facebook, LinkedIn, WhatsApp et iMessage.
 *
 * Pas de slogan en plusieurs langues : l'image est servie telle quelle aux deux
 * versions du site. On y met ce qui est vrai dans les deux — le nom, le métier,
 * le lieu.
 */
const partage = () => `<!doctype html><html><head><meta charset="utf-8">${POLICE}
<style>
  html,body{margin:0;padding:0}
  body{width:1200px;height:630px;background:${PAPIER};color:${ENCRE};
       font-family:"Source Sans 3",system-ui,sans-serif;
       display:flex;flex-direction:column;justify-content:center;
       padding:0 88px;position:relative;overflow:hidden}
  /* La même trame que le héros du site, en fond. */
  .trame{position:absolute;inset:0;
     background-image:linear-gradient(#e0d9cb 1px,transparent 1px),
                      linear-gradient(90deg,#e0d9cb 1px,transparent 1px);
     background-size:72px 72px;
     -webkit-mask-image:radial-gradient(ellipse at 72% 50%,#fff,transparent 70%)}
  .lieu{position:relative;font-family:ui-monospace,monospace;font-size:20px;
        letter-spacing:.24em;color:#6e6659;margin-bottom:26px}
  .nom{position:relative;font-family:Fraunces,Georgia,serif;font-weight:700;
       font-size:104px;letter-spacing:-.03em;line-height:1}
  .nom u{text-decoration:none;box-shadow:inset 0 -.11em 0 ${VERMILLON}}
  .quoi{position:relative;font-size:32px;color:#4a443c;margin-top:30px;max-width:24ch;line-height:1.35}
  .barre{position:absolute;left:0;right:0;bottom:0;height:14px;background:${VERMILLON}}
</style></head><body>
  <div class="trame"></div>
  <p class="lieu">CHÂTEAUGUAY · QUÉBEC</p>
  <p class="nom">Studio <u>Sentis</u></p>
  <p class="quoi">Sites web, applications et identité visuelle.</p>
  <div class="barre"></div>
</body></html>`;

const navigateur = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
);

async function photographier(html, largeur, hauteur, sortie) {
  const page = await navigateur.newPage({
    viewport: { width: largeur, height: hauteur },
    deviceScaleFactor: 1,
  });
  await page.setContent(html, { waitUntil: "networkidle" });
  // Le temps que la Fraunces soit vraiment appliquée : photographier trop tôt
  // fige la police de repli, et l'icône ne serait plus la lettre du site.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
  const chemin = resolve(RACINE, sortie);
  mkdirSync(dirname(chemin), { recursive: true });
  await page.screenshot({ path: chemin, type: "png" });
  await page.close();
  console.log("écrit", sortie);
}

await photographier(icone(512), 512, 512, "src/app/icon.png");
await photographier(icone(180), 180, 180, "src/app/apple-icon.png");
await photographier(partage(), 1200, 630, "public/og.png");

await navigateur.close();
