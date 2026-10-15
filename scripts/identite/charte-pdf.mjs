/**
 * Imprime la charte en PDF, et verifie d'abord qu'aucune page ne deborde.
 *
 * La verification n'est pas un confort : une page de charte qui deborde perd
 * sa derniere ligne a l'impression sans que rien ne le signale a l'ecran.
 *
 *   node scripts/identite/charte-pdf.mjs
 */
import { chromium } from "playwright";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SRC = join(RACINE, "identite", "2-charte", "charte-graphique-studio-sentis.html");
const PDF = join(RACINE, "identite", "2-charte", "charte-graphique-studio-sentis.pdf");

const navigateur = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const page = await navigateur.newPage({ viewport: { width: 794, height: 1123 } });
await page.goto("file://" + SRC, { waitUntil: "networkidle" });

const debordements = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll(".page").forEach((p, i) => {
    // Sans pied de page — la couverture — la limite est le bas de la page.
    const pied = p.querySelector(".pied");
    const limite = pied
      ? pied.getBoundingClientRect().top
      : p.getBoundingClientRect().bottom;
    let depasse = 0, coupable = "";
    p.querySelectorAll("*").forEach((e) => {
      if (e.closest(".pied") || e.closest(".numero")) return;
      const bas = e.getBoundingClientRect().bottom;
      if (bas > limite + 1 && bas - limite > depasse) {
        depasse = bas - limite;
        coupable = (e.textContent || "").trim().slice(0, 50);
      }
    });
    if (depasse > 0) out.push({ page: i + 1, depasse: Math.round(depasse), coupable });
  });
  return out;
});

if (debordements.length) {
  for (const d of debordements) console.error(`page ${d.page} : +${d.depasse} px — « ${d.coupable} »`);
  await navigateur.close();
  process.exit(1);
}

await page.pdf({ path: PDF, format: "A4", printBackground: true, preferCSSPageSize: true,
                 margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await navigateur.close();
console.log("aucune page ne deborde —", PDF);
