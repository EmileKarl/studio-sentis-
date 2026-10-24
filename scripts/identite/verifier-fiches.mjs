/**
 * Contraste des fiches, relevé dans le fichier rendu.
 *
 *   node scripts/identite/verifier-fiches.mjs
 *
 * Même méthode que `verifier-affiche.mjs` : le fond n'est pas un aplat — un
 * dégradé, un grain, un arc — donc la couleur derrière une ligne n'est
 * écrite nulle part. On rend la fiche une seconde fois textes masqués, on
 * relève la couleur moyenne du fond à l'emplacement exact de chaque bloc, et
 * on compare.
 *
 * Ce qui est nouveau ici : les blocs en retrait. L'étiquette et l'invite
 * sont posées à une opacité réduite pour créer la hiérarchie. C'est
 * exactement le genre de décision esthétique qui fait passer un texte sous
 * le seuil sans que personne ne s'en aperçoive — d'où leur présence dans la
 * mesure, au même titre que le titre.
 *
 * Le contrôle passe **une fiche de chaque famille dans chaque coloration**,
 * soit toutes les combinaisons de mise en page et de fond. Les autres fiches
 * ne diffèrent que par la longueur du texte, qui ne change pas la couleur.
 */
import { chromium } from "playwright";
import { VARIANTES } from "./gabarit.mjs";
import { FICHES, pageDe } from "./fiches.mjs";

const BLOCS = ".etiquette, .demande, .demande-petite, .enonce, .invite, .opt, " +
  ".duo span, .grandmot, .phrase-seule, .nombre, .unite, .legende, .mot, .lieu, .site";
const MASQUER = `${BLOCS}, .regle, .symbole, .fil, .dessin, .boite-dessin`;

const lum = ([r, g, b]) => {
  const f = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contraste = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/**
 * Le plancher n'est pas unique, parce que la norme ne l'est pas.
 *
 * WCAG AA demande 4,5:1 pour du texte courant, mais 3:1 pour du grand texte
 * — au moins 24 px, ou 18,7 px en gras. Imposer 4,5 partout aurait été plus
 * simple à écrire, et aurait forcé à éclaircir l'étiquette et l'invite bien
 * au-delà de ce que la lisibilité exige : la hiérarchie se serait aplatie
 * pour satisfaire un chiffre que personne ne réclamait.
 *
 * Le gras commence à 700, pas à 600 : les titres de ces fiches sont en 600
 * et comptent donc comme du texte courant s'ils descendent sous 24 px.
 */
const plancherDe = (px, graisse) =>
  px >= 24 || (px >= 18.66 && graisse >= 700) ? 3 : 4.5;
const nav = await chromium.launch({ executablePath: process.env.CHROME_PATH });
let pire = { marge: 99 };
const echecs = [];

// Une fiche par famille : toutes les mises en page, aucune en double.
const vues = new Set();
const temoins = FICHES.filter((f) => !vues.has(f.fam) && vues.add(f.fam));

for (const f of temoins) {
  for (const v of VARIANTES) {
    const p = await nav.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    await p.setContent(pageDe(f, v), { waitUntil: "load" });
    await p.waitForTimeout(120);

    const mesures = await p.evaluate((sel) =>
      [...document.querySelectorAll(sel)]
        .map((el) => {
          const b = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          // L'opacite d'un parent compte autant que celle du bloc lui-meme.
          let o = 1;
          for (let n = el; n && n !== document.documentElement; n = n.parentElement)
            o *= Number(getComputedStyle(n).opacity);
          return {
            classe: el.className || el.tagName.toLowerCase(),
            couleur: s.color, opacite: o,
            px: parseFloat(s.fontSize), graisse: Number(s.fontWeight) || 400,
            x: Math.round(b.x), y: Math.round(b.y),
            w: Math.round(b.width), h: Math.round(b.height),
          };
        })
        .filter((m) => m.w > 2 && m.h > 2), BLOCS);

    await p.evaluate((sel) => {
      document.querySelectorAll(sel).forEach((e) => (e.style.visibility = "hidden"));
    }, MASQUER);
    await p.waitForTimeout(100);
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

    mesures.forEach((m, i) => {
      const [tr, tg, tb, ta] = m.couleur.match(/[\d.]+/g).map(Number);
      const fond = fonds[i];
      const a = (ta === undefined ? 1 : ta) * m.opacite;
      const texte = [tr, tg, tb].map((c, k) => Math.round(a * c + (1 - a) * fond[k]));
      const r = +contraste(texte, fond).toFixed(2);
      const seuil = plancherDe(m.px, m.graisse);
      const ou = `${f.fam} · ${v.cle} · ${m.classe}`;
      // La marge au seuil, et non le rapport brut : un 3,1 sur du grand
      // texte est plus confortable qu'un 4,6 sur du courant.
      const marge = +(r - seuil).toFixed(2);
      if (marge < pire.marge) pire = { marge, r, seuil, ou };
      if (r < seuil) echecs.push(`${ou}  ${r}:1 (seuil ${seuil})`);
    });
    await p.close();
  }
}
await nav.close();

if (echecs.length) {
  console.log(`${echecs.length} bloc(s) sous leur seuil :`);
  [...new Set(echecs)].forEach((e) => console.log("  " + e));
} else {
  console.log(`${temoins.length} mises en page x ${VARIANTES.length} colorations : tout passe.`);
}
console.log(
  `\nle plus juste : ${pire.r}:1 pour un seuil de ${pire.seuil} (${pire.ou})` +
  `\nmarge : +${pire.marge}`,
);
process.exit(echecs.length ? 1 : 0);
