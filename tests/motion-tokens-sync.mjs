/**
 * Les tokens de motion existent en double : `src/styles/motion.css` pour le CSS,
 * `src/lib/motion.ts` pour Motion, qui a besoin de nombres et de tableaux.
 *
 * Deux copies d'une même valeur divergent toujours. Ce contrôle les compare et
 * échoue à la première différence, pour que la divergence se voie au moment où
 * elle est introduite et non six mois plus tard sur une animation qui « fait
 * bizarre ».
 */
import { readFileSync } from "node:fs";

const css = readFileSync("src/styles/motion.css", "utf8");
const ts = readFileSync("src/lib/motion.ts", "utf8");

/** Ne lit que le premier bloc :root — le second est celui de reduced-motion,
 *  où toutes les valeurs sont volontairement écrasées. */
const rootBlock = css.slice(css.indexOf(":root {"), css.indexOf("@media"));

function cssValue(name) {
  const m = rootBlock.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!m) throw new Error(`Token CSS introuvable : --${name}`);
  return m[1].trim();
}

function tsValue(group, key) {
  const block = ts.slice(ts.indexOf(`export const ${group} = {`));
  // Un tableau se lit jusqu'à son crochet fermant ; un scalaire jusqu'à la
  // virgule. Découper sur la virgule dans les deux cas tronquerait les courbes
  // à leur premier point de contrôle.
  const m = block.match(new RegExp(`\\b${key}:\\s*(\\[[^\\]]*\\]|[^,\\n]+)`));
  if (!m) throw new Error(`Token TS introuvable : ${group}.${key}`);
  return m[1].trim();
}

const failures = [];

function compare(label, cssRaw, tsRaw) {
  if (cssRaw !== tsRaw) {
    failures.push(`${label} — motion.css: ${cssRaw}  ≠  motion.ts: ${tsRaw}`);
  }
}

// Durées : ms côté CSS, secondes côté Motion.
for (const key of ["instant", "fast", "base", "slow", "slower"]) {
  const ms = Number.parseFloat(cssValue(`duration-${key}`));
  compare(`DURATION.${key}`, String(ms / 1000), tsValue("DURATION", key));
}

// Courbes : cubic-bezier(a, b, c, d) contre [a, b, c, d].
for (const [cssName, tsKey] of [["ease-out", "out"], ["ease-in", "in"], ["ease-in-out", "inOut"]]) {
  const points = cssValue(cssName).replace(/cubic-bezier\(|\)/g, "").split(",").map((n) => Number.parseFloat(n));
  const tsPoints = tsValue("EASE", tsKey).replace(/[[\]]/g, "").split(",").map((n) => Number.parseFloat(n));
  compare(`EASE.${tsKey}`, points.join(","), tsPoints.join(","));
}

for (const key of ["tight", "base", "loose"]) {
  const ms = Number.parseFloat(cssValue(`stagger-${key}`));
  compare(`STAGGER.${key}`, String(ms / 1000), tsValue("STAGGER", key));
}

for (const key of ["sm", "md", "lg"]) {
  const px = Number.parseFloat(cssValue(`travel-${key}`));
  compare(`TRAVEL.${key}`, String(px), tsValue("TRAVEL", key));
}

if (failures.length) {
  console.error("Tokens de motion désynchronisés :\n  " + failures.join("\n  "));
  process.exit(1);
}
console.log("Tokens de motion synchronisés entre motion.css et motion.ts.");
