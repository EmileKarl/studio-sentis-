/**
 * Vérification responsive et accessibilité (§11, §13 phases 9, 10 et 12).
 *
 * Charge chaque page aux neuf largeurs imposées par le cahier des charges,
 * dans les deux thèmes, et échoue s'il trouve :
 *   - un débordement horizontal du document ou d'un élément ;
 *   - un texte tronqué hors d'un conteneur prévu pour défiler ;
 *   - une erreur de console ;
 *   - un texte laissé transparent alors qu'il est dans le viewport ;
 *   - une cible tactile sous 24x24 px ;
 *   - un titre resté invisible sous prefers-reduced-motion.
 *
 * Usage :  npm run build && npm run start &  puis  npm run verify
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const PAGES = [
  ["/fr", "sentis-fr"],
  ["/en", "sentis-en"],
  ["/nexus", "nexus-accueil"],
  ["/nexus/design-system", "nexus-design-system"],
  ["/nexus/components", "nexus-composants"],
  ["/nexus/motion", "nexus-motion"],
  ["/nexus/gallery", "nexus-gallery"],
  ["/nexus/dashboard", "nexus-dashboard"],
  ["/nexus/docs", "nexus-docs"],
];
// §11 — les neuf largeurs imposées par le cahier des charges.
const WIDTHS = [1440, 1280, 1024, 834, 768, 430, 390, 375, 320];
const SHOT_AT = new Set([1440, 768, 375]);

const SHOTS = process.env.SHOT_DIR ?? "tests/__screenshots__";
mkdirSync(SHOTS, { recursive: true });

// CHROME_PATH permet de pointer un Chromium déjà présent (CI, conteneur)
// plutôt que de laisser Playwright en télécharger un.
const launchOptions = process.env.CHROME_PATH
  ? { executablePath: process.env.CHROME_PATH }
  : {};
const browser = await chromium.launch(launchOptions);
const findings = [];

for (const theme of ["light", "dark"]) {
  for (const [path, name] of PAGES) {
    for (const width of WIDTHS) {
      const ctx = await browser.newContext({
        viewport: { width, height: 900 },
        colorScheme: theme,
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      const consoleErrors = [];
      page.on("console", (m) => {
        if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) {
          consoleErrors.push(m.text());
        }
      });
      page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
      // « Failed to load resource » sans l'URL n'est pas un diagnostic : on
      // enregistre la requête qui a échoué, pas seulement le fait qu'elle a
      // échoué.
      page.on("response", (r) => {
        if (r.status() >= 400) consoleErrors.push(`HTTP ${r.status()} ${r.url()}`);
      });
      page.on("requestfailed", (r) => {
        consoleErrors.push(`requête échouée ${r.url()} (${r.failure()?.errorText})`);
      });

      await page.goto(BASE + path, { waitUntil: "networkidle" });
      await page.waitForTimeout(350);

      // 1. débordement horizontal du document
      const overflow = await page.evaluate(() => {
        const d = document.documentElement;
        return { scroll: d.scrollWidth, client: d.clientWidth };
      });
      if (overflow.scroll > overflow.client + 1) {
        findings.push(
          `[overflow-page] ${theme} ${name} @${width}px — scrollWidth ${overflow.scroll} > ${overflow.client}`,
        );
      }

      // 2. éléments qui dépassent le viewport
      const wide = await page.evaluate((w) => {
        const out = [];
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          const style = getComputedStyle(el);
          if (style.position === "fixed") continue;
          // ignore les conteneurs à défilement horizontal volontaire
          let p = el.parentElement, inScroller = false;
          while (p) {
            const ps = getComputedStyle(p);
            if (["auto", "scroll", "hidden", "clip"].includes(ps.overflowX)) { inScroller = true; break; }
            p = p.parentElement;
          }
          if (inScroller) continue;
          if (r.right > w + 1 || r.left < -1) {
            out.push(`${el.tagName.toLowerCase()}.${(el.className || "").toString().slice(0, 40)} right=${Math.round(r.right)} left=${Math.round(r.left)}`);
          }
        }
        return out.slice(0, 4);
      }, width);
      for (const w of wide) findings.push(`[overflow-el] ${theme} ${name} @${width}px — ${w}`);

      // 3. texte tronqué / mots qui dépassent leur bloc
      const clipped = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll("p,h1,h2,h3,h4,span,a,button,td,th,li,dt,dd,code")) {
          if (!el.firstChild || el.children.length > 0) continue;
          if (el.scrollWidth > el.clientWidth + 2) {
            const s = getComputedStyle(el);
            if (s.overflow === "hidden" || s.textOverflow === "ellipsis") continue;
            if (s.whiteSpace === "nowrap") continue;
            out.push(`${el.tagName.toLowerCase()} "${(el.textContent || "").trim().slice(0, 30)}" ${el.scrollWidth}>${el.clientWidth}`);
          }
        }
        return out.slice(0, 4);
      });
      for (const c of clipped) findings.push(`[text-clip] ${theme} ${name} @${width}px — ${c}`);

      for (const e of consoleErrors) findings.push(`[console] ${theme} ${name} @${width}px — ${e}`);

      if (SHOT_AT.has(width)) {
        await page.screenshot({
          path: `${SHOTS}/${name}-${theme}-${width}.png`,
          fullPage: width === 1440,
        });
      }
      await ctx.close();
    }
  }
}

// 4. aucun texte ne reste invisible PENDANT qu'il est dans le viewport.
//
// Une entrée au scroll qui ne part pas laisse du contenu à opacity:0 sans rien
// casser d'autre : ni le build, ni le lint, ni une capture ne le signalent.
// C'est ce qui a laissé passer un h1 rendu à opacity:0 et des compteurs figés.
// On descend donc la page par écrans, en laissant le temps aux animations de
// se jouer, et on refuse tout texte transparent alors qu'il est visible.
for (const [path, name] of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });

  const steps = await page.evaluate(() => Math.ceil(document.body.scrollHeight / 700));
  for (let i = 0; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * 700);
    await page.waitForTimeout(700);
    const invisible = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll("p,h1,h2,h3,h4,li,dd,dt,span,a,button")) {
        const txt = (el.textContent || "").trim();
        if (!txt || el.children.length) continue;
        if (el.closest(".sr-only")) continue;
        if (el.className.toString().includes("sr-only")) continue;
        // WCAG 1.4.3 exempte les composants d'interface inactifs : un contrôle
        // désactivé est atténué exprès, c'est ce qui le signale comme tel.
        if (el.closest("[disabled], [aria-disabled='true'], :disabled")) continue;
        const r = el.getBoundingClientRect();
        // uniquement ce qui est réellement dans le viewport
        if (r.bottom < 40 || r.top > window.innerHeight - 40) continue;
        if (r.width === 0 || r.height === 0) continue;
        let opacity = 1, node = el;
        while (node && node !== document.body) {
          opacity *= parseFloat(getComputedStyle(node).opacity);
          node = node.parentElement;
        }
        if (opacity < 0.9) out.push(`${Math.round(opacity * 100)}% "${txt.slice(0, 34)}"`);
      }
      return [...new Set(out)].slice(0, 3);
    });
    for (const v of invisible) {
      findings.push(`[invisible-in-view] ${name} @scroll ${i * 700}px — ${v}`);
    }
  }
  await ctx.close();
}

// 5. zones tactiles < 24px sur mobile (§11)
const ctx = await browser.newContext({ viewport: { width: 375, height: 800 }, hasTouch: true });
const page = await ctx.newPage();
await page.goto(BASE + "/fr", { waitUntil: "networkidle" });
const small = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll("a,button,[role=button],[role=radio],input,select")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (el.closest(".sr-only")) continue;
    if (el.className && el.className.toString().includes("sr-only")) continue;
    if (r.width < 24 || r.height < 24) out.push(`${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
  }
  return out.slice(0, 6);
});
for (const s of small) findings.push(`[touch-target] sentis-fr @375px — ${s}`);
await ctx.close();

// 6. reduced-motion : rien ne doit rester invisible
const rm = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
const rmPage = await rm.newPage();
await rmPage.goto(BASE + "/fr", { waitUntil: "networkidle" });
await rmPage.waitForTimeout(400);
const invisible = await rmPage.evaluate(() => {
  const h1 = document.querySelector("h1");
  if (!h1) return "h1 introuvable";
  const spans = [...h1.querySelectorAll("span")];
  const hidden = spans.filter((s) => parseFloat(getComputedStyle(s).opacity) < 0.9);
  return hidden.length ? `${hidden.length}/${spans.length} fragments du h1 restent sous opacity 0.9` : null;
});
if (invisible) findings.push(`[reduced-motion] sentis-fr — ${invisible}`);
await rm.close();

await browser.close();

console.log(findings.length ? findings.join("\n") : "AUCUN PROBLEME DETECTE");
console.log(`\n--- ${findings.length} constat(s) ---`);
process.exit(findings.length ? 1 : 0);
