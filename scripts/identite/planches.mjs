/**
 * Les planches-contact : toutes les fiches, vingt par feuille.
 *
 *   node scripts/identite/planches.mjs
 *
 * 215 fichiers dans un dossier ne se regardent pas. Une planche-contact se
 * regarde : c'est le geste du photographe qui tire ses négatifs en petit
 * pour choisir lesquels agrandir. Chaque vignette porte son numéro, qui est
 * aussi le début de son nom de fichier et l'entrée de `REPONSES.md`.
 *
 * Les vignettes sont les PNG réellement produits, pas un nouveau rendu : une
 * planche qui montrerait autre chose que les fichiers livrés ne servirait à
 * rien. Il faut donc avoir lancé `fiches.mjs --tout` avant.
 */
import { chromium } from "playwright";
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { RACINE } from "./gabarit.mjs";

const SORTIE = join(RACINE, "identite", "5-fiches");
const PNG = join(SORTIE, "png");
const PAR_FEUILLE = 20;

const fichiers = readdirSync(PNG).filter((n) => n.endsWith(".png")).sort();
if (!fichiers.length) {
  console.error("aucun PNG — lancez d'abord : node scripts/identite/fiches.mjs --tout");
  process.exit(1);
}

const feuille = (lot, no, total) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
  *{box-sizing:border-box}
  body{margin:0;background:#f8f5f2;color:#1a1a1a;font-family:Inter,system-ui,sans-serif;
       padding:40px 36px 30px;width:1240px}
  .tete{display:flex;justify-content:space-between;align-items:baseline;
        border-bottom:1.5px solid rgba(26,26,26,.22);padding-bottom:14px;margin-bottom:26px}
  .tete b{font-size:22px;font-weight:700;letter-spacing:.2em;text-transform:uppercase}
  .tete span{font-size:16px;color:#595755;letter-spacing:.06em}
  .grille{display:grid;grid-template-columns:repeat(5,1fr);gap:22px}
  figure{margin:0}
  img{width:100%;display:block;border:1px solid rgba(26,26,26,.16)}
  figcaption{font-size:13px;color:#595755;margin-top:7px;letter-spacing:.04em;
             white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
</style></head><body>
  <div class="tete"><b>Studio Sentis — fiches</b>
    <span>planche ${no} sur ${total} · ${fichiers.length} fiches au total</span></div>
  <div class="grille">
    ${lot.map((n) => `<figure><img src="png/${n}"><figcaption>${n.replace(/\.png$/, "")}</figcaption></figure>`).join("")}
  </div>
</body></html>`;

const lots = [];
for (let i = 0; i < fichiers.length; i += PAR_FEUILLE) lots.push(fichiers.slice(i, i + PAR_FEUILLE));

mkdirSync(SORTIE, { recursive: true });
const nav = await chromium.launch({ executablePath: process.env.CHROME_PATH });
for (const [i, lot] of lots.entries()) {
  const no = String(i + 1).padStart(2, "0");
  const html = join(SORTIE, `.planche-${no}.html`);
  writeFileSync(html, feuille(lot, i + 1, lots.length), "utf8");
  const p = await nav.newPage({ viewport: { width: 1240, height: 1000 }, deviceScaleFactor: 1 });
  await p.goto(pathToFileURL(html).href, { waitUntil: "load" });
  await p.waitForTimeout(250);
  await p.screenshot({ path: join(SORTIE, `planche-${no}.png`), fullPage: true });
  await p.close();
}
await nav.close();
console.log(`${lots.length} planches dans ${SORTIE}`);
