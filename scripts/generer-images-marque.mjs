/**
 * Fabrique les images de marque : icône d'onglet, icône iOS, image de partage.
 *
 *   node scripts/generer-images-marque.mjs
 *
 * Il écrit :
 *   src/app/icon.png          512 × 512  — icône d'onglet (convention Next)
 *   src/app/apple-icon.png    180 × 180  — écran d'accueil iOS
 *   public/og.png            1200 × 630  — aperçu au partage (Open Graph)
 *
 * **Troisième marque.** Elle applique la planche « Concept 16 — Chaleur
 * néo-minimaliste » : le symbole au filet — un carré très arrondi contenant un
 * sourire — et le mot-symbole en capitales dans Inter.
 *
 * Le symbole est tracé **en SVG dans la page**, avec exactement les mêmes
 * coordonnées que `src/components/sentis/logotype.tsx`. C'est ce qui garantit
 * que l'icône d'onglet est le même dessin que celui de l'en-tête, et non une
 * approximation. Si le symbole change, les deux fichiers changent ensemble.
 *
 * **L'icône est l'inversion de la planche** — symbole clair sur carré d'encre —
 * et non la version claire. À seize pixels dans une barre d'onglets, un filet
 * terracotta sur blanc cassé donne 2,16:1 et disparaît ; le carré sombre porte
 * l'icône et le symbole la signe.
 *
 * **La police est lue sur le disque, pas demandée à Google.** La version
 * précédente la chargeait par `<link>`, et quand cette requête échoue — proxy
 * dont le certificat n'est pas reconnu par Chromium, machine hors ligne —
 * `document.fonts.ready` se résout quand même : l'image sortait dans une
 * police de repli sans que rien ne le signale. `verifierPolice` interroge
 * désormais `document.fonts.check` avant la capture et arrête le script.
 *
 * Il a besoin d'un Chromium. `CHROME_PATH` permet d'en désigner un déjà
 * présent plutôt que de laisser Playwright en télécharger un.
 */

import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const RACINE = resolve(import.meta.dirname, "..");

// Les cinq couleurs de la planche, recopiées de `src/styles/sentis.css`. Ce
// sont des images figées : elles ne suivent pas les tokens au rendu, donc tout
// changement de palette demande de relancer ce script.
const BLANC_CASSE = "#f8f5f2";
const BEIGE = "#e6dacd";
const ACCENT = "#c8a284";
const ACCENT_TEXTE = "#805839";
const NOIR = "#1a1a1a";
const GRIS_TEXTE = "#464444";

const POLICES = [
  { famille: "InterOG", fichier: "scripts/polices/inter-og.woff2" },
];

const POLICE = POLICES.map(({ famille, fichier }) => {
  const donnees = readFileSync(resolve(RACINE, fichier)).toString("base64");
  return `<style>@font-face{font-family:"${famille}";font-weight:400 700;font-style:normal;font-display:block;src:url(data:font/woff2;base64,${donnees}) format("woff2")}</style>`;
}).join("\n");

/**
 * Le symbole, aux coordonnées exactes du composant.
 *
 * `taille` est le côté du carré de dessin ; l'épaisseur du filet suit, sinon
 * le symbole devient un cheveu sur l'enseigne et un trait épais sur le favicon.
 */
const symbole = (taille, couleur) => `
  <svg width="${taille}" height="${taille}" viewBox="0 0 40 40" fill="none"
       stroke-linecap="round" stroke-linejoin="round">
    <rect x="2.1" y="2.1" width="35.8" height="35.8" rx="11.4"
          stroke="${couleur}" stroke-width="2.2"/>
    <path d="M12.8 18.2 C 14.2 25.6, 25.8 25.6, 27.2 18.2"
          stroke="${couleur}" stroke-width="2.2"/>
  </svg>`;

const icone = (taille) => `<!doctype html><html><head><meta charset="utf-8">${POLICE}
<style>
  html,body{margin:0;padding:0}
  body{width:${taille}px;height:${taille}px;background:${NOIR};
       display:flex;align-items:center;justify-content:center}
</style></head><body>${symbole(Math.round(taille * 0.66), BLANC_CASSE)}</body></html>`;

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
  body{width:1200px;height:630px;background:${BLANC_CASSE};color:${NOIR};
       font-family:InterOG,system-ui,sans-serif;
       display:flex;flex-direction:column;justify-content:center;
       padding:0 88px;position:relative;overflow:hidden}
  /* Un aplat de beige chaud en biais, seule respiration de la planche. */
  .biais{position:absolute;right:-120px;top:-120px;width:620px;height:620px;
         background:${BEIGE};border-radius:180px;transform:rotate(18deg)}
  .marque{position:relative;display:flex;align-items:center;gap:26px;margin-bottom:46px}
  .mot{font-weight:700;font-size:40px;line-height:.98;letter-spacing:.07em;text-transform:uppercase}
  .quoi{position:relative;font-weight:700;font-size:56px;line-height:1.14;letter-spacing:-.022em;max-width:17ch}
  .lieu{position:relative;font-size:26px;color:${GRIS_TEXTE};margin-top:34px}
  .barre{position:absolute;left:0;right:0;bottom:0;height:12px;background:${ACCENT}}
</style></head><body>
  <div class="biais"></div>
  <div class="marque">${symbole(84, ACCENT_TEXTE)}<div class="mot">Studio<br>Sentis</div></div>
  <p class="quoi">Sites web, applications et identité visuelle.</p>
  <p class="lieu">Châteauguay · Québec</p>
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
  await page.setContent(html, { waitUntil: "load" });

  // `document.fonts.check` ne dit vrai que d'une police **déjà chargée**. Les
  // données étant locales, on demande leur chargement explicitement avant de
  // vérifier, sans quoi le garde-fou refuserait une police présente.
  await page.evaluate(() =>
    Promise.all([...document.fonts].map((f) => f.load())).then(
      () => document.fonts.ready,
    ),
  );

  const manquantes = await page.evaluate(
    (familles) => familles.filter((f) => !document.fonts.check(`16px "${f}"`)),
    POLICES.map((p) => p.famille),
  );
  if (manquantes.length) {
    throw new Error(
      `Polices absentes au moment de la capture : ${manquantes.join(", ")}. ` +
        "L'image aurait été rendue dans une police de repli — capture annulée.",
    );
  }
  await page.waitForTimeout(150);

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
