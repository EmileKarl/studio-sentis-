/**
 * Les fiches de communication : 1080 x 1920, pour un statut WhatsApp.
 *
 *   node scripts/identite/fiches.mjs                 # un échantillon + les planches
 *   node scripts/identite/fiches.mjs --tout          # les 215
 *   node scripts/identite/fiches.mjs --fam mot       # une seule famille
 *   node scripts/identite/fiches.mjs --n 20          # les 20 premières
 *
 * ## Le ressort
 *
 * La fiche pose. Elle ne répond pas. Sur un statut, on ne commente pas une
 * affirmation — on répond à une question, parce qu'on croit savoir. C'est
 * cette réponse en message privé qui est le but : elle ouvre une
 * conversation que personne n'aurait eue devant une publicité.
 *
 * Les réponses sont donc ailleurs : `identite/5-fiches/REPONSES.md`, écrit
 * par ce même script. C'est l'antisèche de celui qui publie.
 *
 * ## L'ajustement du corps
 *
 * 215 fiches de longueurs très différentes, il n'était pas question de
 * régler chaque corps à la main. Toutes les tailles sont donc exprimées en
 * `em` sur une base posée sur `.haut`, et le script **mesure dans le
 * navigateur** : tant que le contenu dépasse sa boîte, la base descend d'un
 * cran. Le script signale toute fiche descendue sous 0,74 — ce n'est pas un
 * problème de rendu à ce moment-là, c'est un texte trop long à réécrire.
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { coque, lireSymbole, VARIANTES, parCle, RACINE } from "./gabarit.mjs";
import * as C from "./fiches-contenu.mjs";
import * as E from "./fiches-enigmes.mjs";
import { DESSINS } from "./fiches-dessins.mjs";
import { DESSINS_2 } from "./fiches-dessins-2.mjs";

const SORTIE = join(RACINE, "identite", "5-fiches");
const PNG = join(SORTIE, "png");

/**
 * Échappement, puis typographie française.
 *
 * Trois règles qu'un studio de design ne peut pas se permettre de rater sur
 * sa propre communication :
 *
 * - l'apostrophe est courbe. La droite est un signe de machine à écrire que
 *   les claviers ont gardé par héritage ; dans un texte composé, elle se
 *   voit ;
 * - les signes doubles — ? ! ; — prennent une espace fine insécable devant.
 *   Le deux-points prend une insécable pleine, pas une fine ;
 * - le point d'interrogation passe d'une graisse en dessous, comme sur
 *   l'affiche. Même couleur, donc même contraste.
 *
 * `\s*` absorbe une espace déjà présente, y compris une fine : la fonction
 * peut donc s'appliquer à un texte déjà bien composé sans le doubler.
 */
const ech = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "\u2019")
    .replace(/\s*([?!;])/g, "\u202f$1")
    .replace(/\s*:/g, "\u00a0:")
    .replace(/([?!])/g, '<span class="pi">$1</span>');

/* ------------------------------------------------------------------ */
/* Le catalogue : chaque fiche porte sa famille, sa mise en page, sa   */
/* réponse privée et un identifiant stable qui sert de nom de fichier. */
/* ------------------------------------------------------------------ */

const num = (n) => String(n).padStart(3, "0");

export const FICHES = [
  ...C.ENIGMES.map(([q, r]) => ({ fam: "devinette", etiq: "Devinette", q, r })),
  ...C.LOCAL.map(([q, r]) => ({ fam: "ici", etiq: "Ici", q, r })),
  ...C.VRAIFAUX.map(([t, verdict, pourquoi]) => ({
    fam: "vraifaux", etiq: "Vrai ou faux", t, r: `${verdict}. ${pourquoi}`,
  })),
  ...C.CHOIX.map(([q, a, b, bonne, pourquoi]) => ({
    fam: "choix", etiq: "A ou B", q, a, b, r: `${bonne}. ${pourquoi}`,
  })),
  ...C.MOTS.map(([mot, def]) => ({ fam: "mot", etiq: "Le mot", mot, r: def })),
  ...C.PHRASES.map((t) => ({ fam: "phrase", t, r: null })),
  ...C.CHIFFRES.map(([n, u, legende]) => ({ fam: "chiffre", n, u, legende, r: null })),
  ...DESSINS.map((d) => ({ fam: "jeu", etiq: "Petit jeu", q: d.q, svg: d.svg, r: d.r })),

  // Seconde vague. Elle s'ajoute **à la fin** : les numéros 001 à 215 sont
  // déjà imprimés sur des fichiers livrés et renvoient à REPONSES.md. Les
  // décaler rendrait l'antisèche fausse pour toutes les fiches déjà en main.
  ...E.SIXMOTS.map((t) => ({ fam: "sixmots", etiq: "Six mots", t, r: null })),
  ...E.LATERALES.map(([mise, pointe, r]) => ({ fam: "laterale", etiq: "Énigme", mise, pointe, r })),
  ...E.LOGIQUES.map(([mise, pointe, r]) => ({ fam: "logique", etiq: "Logique", mise, pointe, r })),
  ...E.CODE.map((e) => (e.length === 3
    ? { fam: "code", etiq: "Code", mise: e[0], pointe: e[1], r: e[2] }
    : { fam: "code", etiq: "Code", q: e[0], r: e[1] })),
  ...E.OEIL.map(([q, r]) => ({ fam: "oeil", etiq: "L’oeil", q, r })),
  ...E.PARADOXES.map(([mise, pointe, r]) => ({ fam: "paradoxe", etiq: "Paradoxe", mise, pointe, r })),
  ...DESSINS_2.map((d) => ({ fam: "jeu", etiq: "Petit jeu", q: d.q, svg: d.svg, r: d.r })),
].map((f, i) => ({ ...f, id: `${num(i + 1)}-${f.fam}` }));

/* ------------------------------------------------------------------ */
/* Les mises en page. Toutes les tailles en `em` : c'est ce qui rend   */
/* l'ajustement automatique possible.                                  */
/* ------------------------------------------------------------------ */

const STYLE = `
  .haut{font-size:40px;justify-content:center;gap:0}
  .pi{font-weight:300;margin-left:-.07em}
  .etiquette{font-size:.62em;font-weight:600;letter-spacing:.28em;text-transform:uppercase;
             opacity:.75;margin-bottom:1.5em}
  .enonce,.demande{font-size:2.1em;line-height:1.14;font-weight:600;letter-spacing:-.028em;
                   text-wrap:balance}
  .demande-petite{font-size:1.5em;line-height:1.2;font-weight:600;letter-spacing:-.022em;
                  text-wrap:balance;margin-bottom:1.1em}
  .invite{font-size:.72em;line-height:1.4;opacity:.82;margin-top:2em;letter-spacing:.01em}
  .duo{display:flex;gap:.7em;margin-top:1.5em}
  .duo span{font-size:.86em;font-weight:600;letter-spacing:.16em;padding:.5em 1.25em;
            border:2px solid currentColor;border-radius:.4em;opacity:.85}
  .options{display:flex;flex-direction:column;gap:.55em;margin-top:1.6em;width:100%}
  .opt{display:flex;gap:.7em;align-items:baseline;text-align:left;font-size:1.02em;
       line-height:1.26;border:1.5px solid currentColor;border-radius:.4em;padding:.72em .9em;
       opacity:.9}
  .opt b{font-weight:700;opacity:.6;flex:none}
  .grandmot{font-size:3.1em;line-height:1;font-weight:600;letter-spacing:-.04em}
  .phrase-seule{font-size:2.35em;line-height:1.16;font-weight:600;letter-spacing:-.03em;
                text-wrap:balance}

  /* Les six mots. Rien autour : le vide fait la moitie du travail. */
  .sixmots{font-size:2.5em;line-height:1.2;font-weight:600;letter-spacing:-.032em;
           text-wrap:balance}

  /* Les enigmes longues : une mise en place, puis la pointe. C'est l'ecart
     de corps entre les deux qui dit ou commence la question. */
  .mise{font-size:1.2em;line-height:1.4;font-weight:400;text-wrap:pretty;opacity:.94}
  .pointe{font-size:2em;line-height:1.14;font-weight:600;letter-spacing:-.028em;
          margin-top:.9em;text-wrap:balance}
  .nombre{font-size:7.2em;line-height:.88;font-weight:600;letter-spacing:-.05em}
  .unite{font-size:.9em;letter-spacing:.24em;text-transform:uppercase;opacity:.8;
         margin-top:.6em}
  .legende{font-size:1.15em;line-height:1.3;font-weight:400;margin-top:1.5em;text-wrap:balance}
  /* Hauteur libre : les figures carrees gardent leur carre, celles qui
     ont besoin de largeur (Ebbinghaus) posent leur propre rapport. */
  .dessin{width:17.5em;height:auto;display:block;margin:0 auto}
  .boite-dessin{opacity:.95}
`;

const INVITE = {
  devinette: "Répondez à ce statut — je donne la réponse.",
  ici: "Répondez à ce statut — je donne la réponse.",
  vraifaux: "Votre verdict en message privé.",
  choix: "A ou B ? Répondez, je dis pourquoi.",
  mot: "Vous savez ce que c'est ?",
  jeu: "Votre compte en message privé.",
  laterale: "Trouvé ? Dites-le-moi en privé.",
  logique: "Votre réponse en message privé.",
  code: "Répondez à ce statut — je donne la réponse.",
  oeil: "Répondez à ce statut — je donne la réponse.",
  // Un paradoxe n'a pas de bonne reponse : on ne demande donc pas LA reponse.
  paradoxe: "Votre avis m'intéresse. En privé.",
};

const corpsDe = (f, v) => {
  const etiq = f.etiq ? `<div class="etiquette">${ech(f.etiq)}</div>` : "";
  const invite = INVITE[f.fam] ? `<div class="invite">${ech(INVITE[f.fam])}</div>` : "";
  switch (f.fam) {
    case "devinette":
    case "ici":
      return `${etiq}<div class="demande">${ech(f.q)}</div>${invite}`;
    case "vraifaux":
      return `${etiq}<div class="enonce">${ech(f.t)}</div>
              <div class="duo"><span>Vrai</span><span>Faux</span></div>${invite}`;
    case "choix":
      return `${etiq}<div class="demande-petite">${ech(f.q)}</div>
              <div class="options">
                <div class="opt"><b>A</b><span>${ech(f.a)}</span></div>
                <div class="opt"><b>B</b><span>${ech(f.b)}</span></div>
              </div>${invite}`;
    case "mot":
      return `${etiq}<div class="grandmot">${ech(f.mot)}</div>${invite}`;
    case "phrase":
      return `<div class="symbole">${lireSymbole(v.symbole)}</div>
              <div class="fil"></div>
              <div class="phrase-seule">${ech(f.t)}</div>`;
    case "chiffre":
      return `<div class="nombre">${ech(f.n)}</div>
              <div class="unite">${ech(f.u)}</div>
              <div class="legende">${ech(f.legende)}</div>`;
    case "jeu":
      return `${etiq}<div class="demande-petite">${ech(f.q)}</div>
              <div class="boite-dessin">${f.svg}</div>${invite}`;
    case "sixmots":
      return `${etiq}<div class="sixmots">${ech(f.t)}</div>`;
    case "oeil":
      return `${etiq}<div class="demande">${ech(f.q)}</div>${invite}`;
    case "laterale":
    case "logique":
    case "paradoxe":
    case "code":
      return f.mise
        ? `${etiq}<div class="mise">${ech(f.mise)}</div>
           <div class="pointe">${ech(f.pointe)}</div>${invite}`
        : `${etiq}<div class="demande">${ech(f.q)}</div>${invite}`;
    default:
      throw new Error(`famille inconnue : ${f.fam}`);
  }
};

/**
 * La coloration tourne avec l'indice : publiées dans l'ordre, les fiches
 * alternent bleu, papier, encre. Une série monochrome lasse au troisième
 * jour.
 */
export const colorationDe = (i) => VARIANTES[i % VARIANTES.length];

export const pageDe = (f, v, reperes = false) =>
  coque({ v, corps: corpsDe(f, v), styleEnPlus: STYLE, reperes, creuxArc: 1420 });

/** Réduit la base jusqu'à ce que le contenu tienne. Renvoie l'échelle. */
const ajuster = (p) =>
  p.evaluate(() => {
    const haut = document.querySelector(".haut");
    const deborde = () => haut.scrollHeight > haut.clientHeight + 1;
    let e = 1;
    while (deborde() && e > 0.5) {
      e -= 0.02;
      haut.style.fontSize = `${(40 * e).toFixed(2)}px`;
    }
    return e;
  });

/* ------------------------------------------------------------------ */

const args = process.argv.slice(2);
const drapeau = (n) => args.includes(`--${n}`);
const valeur = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};

const lanceDirectement =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (lanceDirectement) await rendre();

async function rendre() {
  let choisies = FICHES;
  const fam = valeur("fam", null);
  if (fam) choisies = choisies.filter((f) => f.fam === fam);
  if (!drapeau("tout") && !fam) {
    // Sans argument : une de chaque famille, pour juger vite.
    const vues = new Set();
    choisies = FICHES.filter((f) => !vues.has(f.fam) && vues.add(f.fam));
  }
  const n = Number(valeur("n", 0));
  if (n > 0) choisies = choisies.slice(0, n);

  const forcee = valeur("coloration", null);
  mkdirSync(PNG, { recursive: true });

  const nav = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  const serres = [];

  for (const f of choisies) {
    const i = FICHES.indexOf(f);
    const v = forcee ? parCle(forcee) : colorationDe(i);
    const p = await nav.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    await p.setContent(pageDe(f, v), { waitUntil: "load" });
    const e = await ajuster(p);
    await p.waitForTimeout(90);
    const nom = `${f.id}-${v.cle}.png`;
    await p.locator(".toile").screenshot({ path: join(PNG, nom) });
    await p.close();
    if (e < 0.74) serres.push(`${nom} (${e.toFixed(2)})`);
  }
  await nav.close();

  ecrireReponses();
  console.log(`${choisies.length} fiches dans ${PNG}`);
  if (serres.length) {
    console.log(`\n${serres.length} fiche(s) sous 0,74 — texte à raccourcir :`);
    serres.forEach((s) => console.log("  " + s));
  }
}

function ecrireReponses() {
  const groupes = {};
  for (const f of FICHES) (groupes[f.fam] ??= []).push(f);
  const titres = {
    devinette: "Devinettes", ici: "Ici (Châteauguay, Montérégie)",
    vraifaux: "Vrai ou faux", choix: "A ou B", mot: "Le mot",
    phrase: "Phrases (sans réponse)", chiffre: "Chiffres (sans réponse)",
    jeu: "Petits jeux", sixmots: "Six mots (sans réponse)",
    laterale: "Énigmes de situation", logique: "Logique",
    code: "Développement", oeil: "L’oeil", paradoxe: "Paradoxes",
  };
  let md = `# Les réponses

Antisèche de celui qui publie. **Ne la publiez pas** : la fiche ne vaut que
parce qu'elle ne répond pas.

Le nom de fichier de chaque fiche commence par son numéro. Quelqu'un répond à
\`047-vraifaux-papier.png\` ? Cherchez 047 ici.

Régénéré par \`node scripts/identite/fiches.mjs\`.

`;
  for (const [fam, liste] of Object.entries(groupes)) {
    md += `\n## ${titres[fam] ?? fam}\n\n`;
    for (const f of liste) {
      const pose = f.pointe ? `${f.mise} ${f.pointe}` : (f.q ?? f.t ?? f.mot ?? `${f.n} ${f.u}`);
      md += `**${f.id.split("-")[0]}** — ${pose}\n`;
      md += f.r ? `> ${f.r}\n\n` : `> _Pas de réponse à donner : c'est une affirmation._\n\n`;
    }
  }
  writeFileSync(join(SORTIE, "REPONSES.md"), md, "utf8");
}
