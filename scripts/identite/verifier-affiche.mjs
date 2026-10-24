/**
 * Contraste des affiches, relevé dans le fichier rendu.
 *
 *   node scripts/identite/verifier-affiche.mjs
 *
 * **Pourquoi pas un calcul sur les couleurs de la feuille de style.** Le fond
 * n'est plus un aplat : c'est un dégradé, troublé par un grain. La couleur
 * derrière une ligne de texte n'est donc écrite nulle part — elle se relève,
 * pixel par pixel, là où le texte se trouve.
 *
 * La méthode : on rend l'affiche une seconde fois avec chaque bloc de texte
 * masqué, on lit la couleur moyenne du fond à l'emplacement exact qu'il
 * occupait, et on la compare à la couleur du texte. Le fond mesuré comprend
 * le dégradé et le grain, puisqu'il vient de l'image.
 */
import { chromium } from "playwright";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const { default: affiche } = await import(
  pathToFileURL(join(RACINE, "scripts", "identite", "affiche-whatsapp.mjs")).href
);

const lum = ([r, g, b]) => {
  const f = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contraste = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const nav = await chromium.launch({ executablePath: process.env.CHROME_PATH });
let pireGlobal = { r: 99 };

for (const v of affiche.VARIANTES) {
  const p = await nav.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.setContent(affiche.page(v, false), { waitUntil: "load" });
  await p.waitForTimeout(400);

  const mesures = await p.evaluate(() => {
    const blocs = [...document.querySelectorAll(".slogan, .mot, .lieu, .site")];
    return blocs.map((el) => {
      const b = el.getBoundingClientRect();
      return { classe: el.className, couleur: getComputedStyle(el).color,
               x: Math.round(b.x), y: Math.round(b.y),
               w: Math.round(b.width), h: Math.round(b.height) };
    });
  });

  // Seconde passe, texte masqué : le fond redevient visible là où il était.
  await p.evaluate(() => {
    document.querySelectorAll(".slogan, .mot, .lieu, .site, .regle, .symbole")
      .forEach((e) => (e.style.visibility = "hidden"));
  });
  await p.waitForTimeout(250);
  const nu = await p.locator(".toile").screenshot();

  const fonds = await p.evaluate(async ({ image, zones }) => {
    const img = new Image();
    img.src = "data:image/png;base64," + image;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    return zones.map((z) => {
      const d = ctx.getImageData(z.x, z.y, Math.max(1, z.w), Math.max(1, z.h)).data;
      let r = 0, g = 0, b = 0, n = 0;
      for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
      return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
    });
  }, { image: nu.toString("base64"), zones: mesures });

  console.log(`\n${v.cle}`);
  for (let i = 0; i < mesures.length; i++) {
    const m = mesures[i];
    const [tr, tg, tb, ta] = m.couleur.match(/[\d.]+/g).map(Number);
    const fond = fonds[i];
    // Un texte semi-transparent se compose sur le fond relevé.
    const a = ta === undefined ? 1 : ta;
    const texte = [tr, tg, tb].map((c, k) => Math.round(a * c + (1 - a) * fond[k]));
    const r = +contraste(texte, fond).toFixed(2);
    if (r < pireGlobal.r) pireGlobal = { r, ou: `${v.cle} · ${m.classe}` };
    console.log(`  ${m.classe.padEnd(8)} fond relevé rgb(${fond.join(",")})  ${String(r).padStart(6)}:1  ${r >= 4.5 ? "OK" : "ÉCHEC"}`);
  }
  await p.close();
}
await nav.close();
console.log(`\npire couple : ${pireGlobal.r}:1 (${pireGlobal.ou}) — plancher 4,5`);
process.exit(pireGlobal.r >= 4.5 ? 0 : 1);
