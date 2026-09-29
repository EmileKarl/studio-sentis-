/**
 * Fabrique les images de marque : icône d'onglet, icône iOS, image de partage.
 *
 * Pourquoi un script plutôt que des fichiers dessinés à la main : le logotype
 * du studio est du texte composé, pas un dessin. Le seul moyen d'obtenir une
 * icône qui soit *exactement* la même lettre que celle de l'en-tête, c'est de
 * la faire rendre par le même moteur que le site, puis de la photographier.
 * Si la marque change, on relance ce script.
 *
 * **Deuxième marque.** La première composait « Studio Sentis » dans la
 * Fraunces avec un soulignement vermillon. Le client l'a écartée pour quelque
 * chose de plus simple, plus doux et plus futuriste : bas de casse intégral,
 * géométrique (Outfit), approche ouverte, aucun accent de couleur.
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
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const RACINE = resolve(import.meta.dirname, "..");

// Les couleurs sont recopiées de `src/styles/sentis.css`. Ce sont des images
// figées : elles ne peuvent pas suivre les tokens au moment du rendu, donc
// toute modification de la palette demande de relancer ce script.
const PAPIER = "#fcfaf6";
const ENCRE = "#1a1714";
const FILET = "#e0d9cb";
const GRIS = "#6e6659";
const GRIS_TEXTE = "#4a443c";

// Aucune couleur d'accent dans ces images, et c'est délibéré : ce sont des
// fichiers figés, alors que la palette de section du site, elle, bouge. Une
// image de partage teintée d'un accent qui a changé depuis se remarque tout
// de suite, et on ne la regénère jamais au bon moment.

/**
 * Les polices sont lues **sur le disque**, pas demandées à Google.
 *
 * Ce n'est pas une préférence, c'est la correction d'un défaut : la version
 * précédente de ce script chargeait Fraunces par une balise `<link>` vers
 * fonts.googleapis.com. Quand cette requête échoue — proxy d'entreprise dont
 * le certificat n'est pas reconnu par Chromium, machine hors ligne, panne —
 * `document.fonts.ready` se résout quand même, la capture part, et l'image
 * sort **dans une police de repli sans que rien ne le signale**. Les icônes
 * livrées jusqu'ici n'étaient pas dans la police du site, et personne ne
 * pouvait le voir sans comparer les lettres côte à côte.
 *
 * Deux garde-fous désormais :
 *
 * 1. les fichiers sont locaux, encodés en base64 dans la page — aucune
 *    requête réseau, donc rien à échouer ;
 * 2. `verifierPolice` interroge `document.fonts.check` **avant** la capture et
 *    arrête le script si la police n'est pas là. Un échec bruyant vaut mieux
 *    qu'une icône fausse qu'on découvre en production.
 *
 * Les trois fichiers sont des sous-ensembles réduits aux caractères employés
 * ici — voir `scripts/polices/` et `src/fonts/README.md` pour les regénérer.
 * Les licences OFL les accompagnent, comme elles l'exigent.
 */
const POLICES = [
  { famille: "OutfitLogo", graisse: 400, fichier: "src/fonts/outfit-logo-300.woff2" },
  { famille: "OutfitIcone", graisse: 400, fichier: "scripts/polices/outfit-icone-500.woff2" },
  { famille: "SourceOG", graisse: 400, fichier: "scripts/polices/source-sans-3-400-og.woff2" },
];

const POLICE = POLICES.map(({ famille, graisse, fichier }) => {
  const donnees = readFileSync(resolve(RACINE, fichier)).toString("base64");
  return `<style>@font-face{font-family:"${famille}";font-weight:${graisse};font-style:normal;font-display:block;src:url(data:font/woff2;base64,${donnees}) format("woff2")}</style>`;
}).join("\n");

/**
 * L'icône : la lettre seule, en réserve sur un carré d'encre.
 *
 * Le fond plein n'est pas décoratif, il est fonctionnel. Un « s » géométrique
 * léger posé sur le papier crème disparaît à seize pixels dans une barre
 * d'onglets ; en réserve sur l'encre, c'est la forme du carré qui porte
 * l'icône et la lettre qui la signe. La graisse est relevée à 500 pour la
 * même raison — la 300 de l'en-tête est trop fine à cette taille.
 */
const icone = (taille) => `<!doctype html><html><head><meta charset="utf-8">${POLICE}
<style>
  html,body{margin:0;padding:0}
  body{width:${taille}px;height:${taille}px;background:${ENCRE};
       display:flex;align-items:center;justify-content:center}
  .s{font-family:OutfitIcone,system-ui,sans-serif;color:${PAPIER};
     font-size:${Math.round(taille * 0.62)}px;line-height:1;
     letter-spacing:0}
</style></head><body><span class="s">s</span></body></html>`;

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
       font-family:SourceOG,system-ui,sans-serif;
       display:flex;flex-direction:column;justify-content:center;
       padding:0 88px;position:relative;overflow:hidden}
  /* La même trame que le héros du site, en fond. */
  .trame{position:absolute;inset:0;
     background-image:linear-gradient(${FILET} 1px,transparent 1px),
                      linear-gradient(90deg,${FILET} 1px,transparent 1px);
     background-size:72px 72px;
     -webkit-mask-image:radial-gradient(ellipse at 72% 50%,#fff,transparent 70%)}
  .lieu{position:relative;font-family:ui-monospace,monospace;font-size:20px;
        letter-spacing:.24em;color:${GRIS};margin-bottom:30px}
  /* Le mot-symbole, aux proportions exactes de l'en-tête : bas de casse,
     graisse 300, « studio » à 62 % et très ouvert, « sentis » à pleine taille. */
  .nom{position:relative;font-family:OutfitLogo,system-ui,sans-serif;
       display:flex;align-items:baseline;gap:.35em;line-height:1;font-size:104px}
  .nom .petit{font-size:.62em;letter-spacing:.34em;opacity:.55}
  .nom .grand{letter-spacing:.13em}
  .quoi{position:relative;font-size:32px;color:${GRIS_TEXTE};margin-top:38px;max-width:24ch;line-height:1.35}
  .barre{position:absolute;left:0;right:0;bottom:0;height:10px;background:${ENCRE}}
</style></head><body>
  <div class="trame"></div>
  <p class="lieu">CHÂTEAUGUAY · QUÉBEC</p>
  <p class="nom"><span class="petit">studio</span><span class="grand">sentis</span></p>
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
  await page.setContent(html, { waitUntil: "load" });
  // `document.fonts.check` ne dit vrai que d'une police **déjà chargée**. Les
  // trois sont déclarées en `font-display: block` sur des données locales : on
  // demande donc leur chargement explicitement avant de vérifier, sans quoi le
  // garde-fou refuserait des polices parfaitement présentes.
  await page.evaluate(() =>
    Promise.all([...document.fonts].map((f) => f.load())).then(
      () => document.fonts.ready,
    ),
  );

  // Le garde-fou : si une police n'est pas réellement disponible, on s'arrête.
  // Sans lui, la capture part quand même et l'image sort dans une police de
  // repli — le défaut exact qu'avait la version précédente de ce script.
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
