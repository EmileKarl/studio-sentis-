/**
 * L'affiche : 2160 x 3840, et son export 1080 x 1920 pour WhatsApp.
 *
 *   node scripts/identite/affiche-whatsapp.mjs
 *
 * ## Ce qui fait lire l'affiche : elle pose la question avant d'y répondre
 *
 * La première version affichait la promesse en grand : « Le prix et la date,
 * dès le premier échange. » C'est une réponse. Or personne ne s'arrête sur
 * une réponse à une question qu'il ne s'est pas encore posée.
 *
 * Les deux mots en grand sont donc les deux seules questions qu'un client se
 * pose avant de confier un mandat — **combien**, et **quand**. La promesse
 * descend sous eux, plus petite : elle devient la résolution.
 *
 * ## L'habillage
 *
 * Le fond, le grain, l'arc, le cadre, les équerres et la signature vivent
 * dans `gabarit.mjs`, partagés avec les fiches de communication. Ce fichier
 * ne décrit plus que son propre contenu.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { coque, lireSymbole, VARIANTES, RACINE, FINE } from "./gabarit.mjs";

const SORTIE = join(RACINE, "identite", "4-reseaux");

const QUESTIONS = ["Combien", "Quand"];
const REPONSE = "Le prix et la date,\ndès le premier échange.";

/* L'affiche n'a que deux mots : elle peut se permettre un corps plus gros
   que la valeur par defaut du gabarit, calibree pour des phrases entieres. */
const STYLE = `  .question{font-size:132px;margin-bottom:54px}`;

const corps = (v) => `
      <div class="symbole">${lireSymbole(v.symbole)}</div>
      <div class="fil"></div>
      <div class="question">${QUESTIONS.map(
        (q) => `${q}${FINE}<span class="pi">?</span>`,
      ).join("<br>")}</div>
      <div class="reponse">${REPONSE}</div>`;

export const page = (v, reperes) =>
  coque({ v, corps: corps(v), styleEnPlus: STYLE, reperes });

/**
 * Exporté pour que `verifier-affiche.mjs` mesure **la page réellement
 * rendue**, et non une copie du gabarit qui finirait par diverger.
 */
const affiche = { page, VARIANTES };
export default affiche;

const lanceDirectement =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (lanceDirectement) {
  await rendre();
}

async function rendre() {
  const nav = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  mkdirSync(SORTIE, { recursive: true });

  for (const v of VARIANTES) {
    for (const [suffixe, echelle, reperes] of [
      ["-hd", 2, false], // le maître : 2160 x 3840
      ["", 1, false],    // l'export WhatsApp : 1080 x 1920
      ["-reperes", 1, true],
    ]) {
      const p = await nav.newPage({
        viewport: { width: 1080, height: 1920 },
        deviceScaleFactor: echelle,
      });
      await p.setContent(page(v, reperes), { waitUntil: "load" });
      await p.waitForTimeout(400);
      const nom = `affiche-whatsapp-${v.cle}${suffixe}.png`;
      await p.locator(".toile").screenshot({ path: join(SORTIE, nom) });
      await p.close();
      if (!reperes) console.log(`${nom}  ${1080 * echelle} x ${1920 * echelle}`);
    }
  }
  await nav.close();
}
