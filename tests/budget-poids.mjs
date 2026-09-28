/**
 * Budget de poids par page.
 *
 * Ce contrôle existe à cause de deux régressions qui n'auraient été vues par
 * aucun autre outil du projet :
 *
 * - le site de l'agence préchargeait les **trois familles de polices de la
 *   vitrine NEXUS**, qu'il n'affiche jamais : sept fichiers, 188 ko, sur
 *   chaque page. Rien dans le build, le lint ou le contrôle navigateur ne
 *   regarde ce que coûte une page ;
 * - un module qui importait à la fois `domAnimation` et `domMax` de Motion les
 *   faisait atterrir dans le même morceau, et le chemin critique était passé
 *   de 889 à 932 ko sans que rien ne le signale.
 *
 * Les budgets ci-dessous sont posés un peu au-dessus des valeurs mesurées : ils
 * ne cherchent pas à optimiser, ils cherchent à faire du bruit le jour où une
 * dépendance revient par la porte de derrière. Une page qui grossit
 * volontairement se règle en relevant le budget **et en disant pourquoi**.
 *
 * Les tailles sont non compressées — c'est ce que le navigateur doit analyser,
 * et c'est ce qui coûte le plus cher sur un téléphone d'entrée de gamme.
 *
 * Il demande un serveur déjà lancé (voir README).
 */

import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";

/** Budgets en kilo-octets, par page. */
const BUDGETS = [
  { chemin: "/fr", js: 900, css: 175, polices: 100 },
  { chemin: "/en", js: 900, css: 175, polices: 100 },
  { chemin: "/fr/services", js: 900, css: 175, polices: 100 },
  { chemin: "/fr/realisations", js: 900, css: 175, polices: 100 },
  { chemin: "/fr/a-propos", js: 900, css: 175, polices: 100 },
  // La page contact porte le globe et son trait de côte : 40 ko de plus, et
  // c'est voulu — ils ne sont chargés que là.
  { chemin: "/fr/contact", js: 940, css: 175, polices: 100 },
];

const navigateur = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
);

const constats = [];
const releves = [];

for (const budget of BUDGETS) {
  const ctx = await navigateur.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const poids = { js: 0, css: 0, polices: 0 };
  const attentes = [];

  page.on("response", (r) => {
    attentes.push(
      (async () => {
        const type = r.request().resourceType();
        if (!["script", "stylesheet", "font"].includes(type)) return;
        const corps = await r.body().catch(() => Buffer.alloc(0));
        const taille = corps.length || Number(r.headers()["content-length"] || 0);
        if (type === "script") poids.js += taille;
        else if (type === "stylesheet") poids.css += taille;
        else poids.polices += taille;
      })(),
    );
  });

  await page.goto(BASE + budget.chemin, { waitUntil: "networkidle" });
  // Le décor est monté à l'inactivité du navigateur : sans cette attente, on
  // mesurerait une page qui n'a pas fini de charger ce qu'elle charge.
  await page.waitForTimeout(1500);
  await Promise.all(attentes);

  const ko = (n) => +(n / 1024).toFixed(1);
  const mesure = {
    chemin: budget.chemin,
    js: ko(poids.js),
    css: ko(poids.css),
    polices: ko(poids.polices),
  };
  releves.push(mesure);

  for (const cle of ["js", "css", "polices"]) {
    if (mesure[cle] > budget[cle]) {
      constats.push(
        `[budget] ${budget.chemin} — ${cle} à ${mesure[cle]} ko, budget ${budget[cle]} ko`,
      );
    }
  }
  await ctx.close();
}

await navigateur.close();

console.table(releves);

if (constats.length) {
  for (const c of constats) console.log(c);
  console.log(`\n--- ${constats.length} constat(s) ---`);
  process.exit(1);
}
console.log("Chaque page tient dans son budget.");
