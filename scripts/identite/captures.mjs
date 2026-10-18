/**
 * Captures d'ecran du site, pour montrer le travail.
 *
 *   node scripts/identite/captures.mjs [https://www.studiosentis.ca]
 *
 * Quatre series, parce qu'elles ne servent pas a la meme chose :
 *
 *   haut/      le premier ecran, 1440 x 900 en double densite. C'est ce qu'on
 *              met dans un flyer ou une publication : ce que le visiteur voit
 *              avant de faire defiler.
 *   parcours/  huit arrets reguliers en descendant la page. C'est la serie
 *              utile pour une page longue, et la seule qui rende justice aux
 *              sections collantes : la capture pleine page les montre une
 *              fois, suivies du vide dans lequel elles defilent.
 *   complet/   la page entiere, en densite simple. Pour un coup d'oeil, ou
 *              pour la joindre a un courriel.
 *   mobile/    le premier ecran du telephone en double densite, et la page
 *              entiere en densite simple.
 *
 * La densite n'est doublee que la ou l'image sera regardee de pres. Une page
 * d'accueil entiere en double densite pese 5,5 Mo et personne ne zoome dedans.
 *
 * Meme raison pour le format : PNG la ou l'image servira telle quelle — le
 * premier ecran, qui finira dans un flyer — et JPEG pour les series longues.
 * Compare a l'ecran, le JPEG de qualite 90 ne se distingue pas du PNG sur ces
 * pages, et le dossier passe de 23 a 9 Mo.
 *
 * Le defilement est force jusqu'en bas avant chaque capture : les entrees se
 * declenchent au chargement, mais les images sont differees. Sans ce passage,
 * la capture sort avec des trous gris.
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SORTIE = join(RACINE, "identite", "6-captures");
const SITE = process.argv[2] ?? "https://www.studiosentis.ca";
const ARRETS = 8;

const PAGES = [
  ["accueil", "/fr"],
  ["services", "/fr/services"],
  ["realisations", "/fr/realisations"],
  ["a-propos", "/fr/a-propos"],
  ["soumission", "/fr/contact"],
  ["accueil-en", "/en"],
  ["services-en", "/en/services"],
];

for (const d of ["haut", "parcours", "complet", "mobile"]) {
  mkdirSync(join(SORTIE, d), { recursive: true });
}

/** Descend jusqu'en bas puis remonte : c'est ce qui charge les images. */
async function toutCharger(page) {
  await page.evaluate(async () => {
    await new Promise((fini) => {
      let y = 0;
      const pas = () => {
        y += window.innerHeight * 0.8;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(pas, 90);
        else fini();
      };
      pas();
    });
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);
  await page.evaluate(() => Promise.all(
    [...document.images].filter((i) => !i.complete)
      .map((i) => new Promise((r) => { i.onload = i.onerror = r; }))
  ));
}

const navigateur = await chromium.launch({ executablePath: process.env.CHROME_PATH });
let faits = 0;

for (const [nom, chemin] of PAGES) {
  // --- bureau, double densite : le premier ecran ------------------------
  const net = await navigateur.newPage({
    viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2,
  });
  await net.goto(SITE + chemin, { waitUntil: "networkidle" });
  await toutCharger(net);
  await net.screenshot({ path: join(SORTIE, "haut", `${nom}-1440x900@2x.png`) });
  await net.close();
  faits++;

  // --- bureau, densite simple : le parcours et la page entiere ----------
  const page = await navigateur.newPage({
    viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1,
  });
  await page.goto(SITE + chemin, { waitUntil: "networkidle" });
  await toutCharger(page);

  const hauteur = await page.evaluate(() => document.documentElement.scrollHeight);
  const course = Math.max(0, hauteur - 900);
  for (let i = 0; i < ARRETS; i++) {
    const y = Math.round((course * i) / (ARRETS - 1));
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(450);
    await page.screenshot({
      path: join(SORTIE, "parcours", `${nom}-${String(i + 1).padStart(2, "0")}.jpg`),
      quality: 90,
    });
    faits++;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(SORTIE, "complet", `${nom}-1440.jpg`),
                          fullPage: true, quality: 90 });
  await page.close();
  faits++;

  // --- telephone --------------------------------------------------------
  const tel = await navigateur.newPage({ ...devices["iPhone 13"], deviceScaleFactor: 2 });
  await tel.goto(SITE + chemin, { waitUntil: "networkidle" });
  await toutCharger(tel);
  await tel.screenshot({ path: join(SORTIE, "mobile", `${nom}-390x844@2x.png`) });
  await tel.close();
  faits++;

  const telLong = await navigateur.newPage({ ...devices["iPhone 13"], deviceScaleFactor: 1 });
  await telLong.goto(SITE + chemin, { waitUntil: "networkidle" });
  await toutCharger(telLong);
  await telLong.screenshot({ path: join(SORTIE, "mobile", `${nom}-390-complet.jpg`),
                             fullPage: true, quality: 90 });
  await telLong.close();
  faits++;

  console.log(`${nom} — ${hauteur} px de haut`);
}
await navigateur.close();
console.log(`${faits} captures dans ${SORTIE}`);
