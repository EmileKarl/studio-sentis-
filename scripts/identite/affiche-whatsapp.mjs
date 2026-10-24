/**
 * L'affiche : 2160 x 3840, et son export 1080 x 1920 pour WhatsApp.
 *
 *   node scripts/identite/affiche-whatsapp.mjs
 *
 * Mêmes couleurs, même charte, même promesse. Ce qui change tient en deux
 * familles de décisions.
 *
 * ## Ce qui fait lire l'affiche : elle pose la question avant d'y répondre
 *
 * La première version affichait la promesse en grand : « Le prix et la date,
 * dès le premier échange. » C'est une réponse. Or personne ne s'arrête sur
 * une réponse à une question qu'il ne s'est pas encore posée.
 *
 * Les deux mots en grand sont donc maintenant les deux seules questions
 * qu'un client se pose avant de confier un mandat — **combien**, et
 * **quand**. La promesse descend sous eux, plus petite : elle devient la
 * résolution. L'œil lit la question, bute, et trouve la réponse juste en
 * dessous. C'est ce décalage qui retient, pas la taille du corps.
 *
 * Le point d'interrogation est tracé en graisse 300 quand le mot est en 600.
 * Même couleur, donc même contraste : la nuance est une respiration, pas un
 * affaiblissement. Et l'espace fine insécable qui le précède est la règle
 * française — elle se voit à peine, elle se remarque quand elle manque.
 *
 * ## Ce qui fait lire « affiche » : trois interventions sous le seuil
 *
 * 5. **Un arc**, le sourire du logo agrandi jusqu'à sortir du cadre, à 16 %.
 *    Les proportions ne sont pas redessinées à l'œil : elles sont dérivées du
 *    tracé de `logotype.tsx`. Son creux est posé à 1310 px, dans la bande
 *    vide entre la réponse et la signature : à 1180 il passait derrière la
 *    réponse et la barrait. Il sépare le message de la signature comme une
 *    ligne d'horizon, et n'ajoute aucune forme étrangère à la marque.
 *
 * 6. **Un fil vertical** de 58 px entre le symbole et la question, fondu aux
 *    deux bouts. Il ne décore rien : il pose l'axe central et fait descendre
 *    le regard du symbole vers le texte.
 *
 * 7. **Des équerres** aux quatre angles du cadre, un peu plus franches que le
 *    filet qui les relie. C'est le repère d'imprimeur : ça dit « calé », et
 *    ça n'occupe que 34 px.
 *
 * ## Ce qui venait de la version précédente
 *
 * 1. **Le double de définition.** Le maître fait 2160 x 3840. WhatsApp
 *    recompresse de toute façon, et il le fait mieux en partant d'une image
 *    nette qu'en réencodant une image déjà à sa taille.
 *
 * 2. **Un dégradé dans la même teinte**, qui va du clair vers le sombre et
 *    jamais l'inverse — éclaircir le haut faisait passer le blanc cassé de
 *    4,93 à 3,81:1, sous le plancher.
 *
 * 3. **Un grain fin** à 3,5 %, monochrome, en `overlay`.
 *
 * 4. **Un cadre au filet**, posé exactement sur les zones réservées.
 *
 * Les contrastes ne sont pas calculés sur la couleur théorique : ils sont
 * relevés **dans le PNG rendu**, grain et arc compris, par
 * `verifier-affiche.mjs`.
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SVG = join(RACINE, "identite", "1-logo", "svg");
const SORTIE = join(RACINE, "identite", "4-reseaux");
const lire = (n) => readFileSync(join(SVG, `${n}.svg`), "utf8");

// U+202F, espace fine insécable : la règle française devant le point
// d'interrogation. Un espace ordinaire laisserait le point passer à la ligne.
const FINE = " ";
const QUESTIONS = ["Combien", "Quand"];
const REPONSE = "Le prix et la date,\ndès le premier échange.";
const SITE = "www.studiosentis.ca";
const LIEU = "Châteauguay · Montérégie · Grand Montréal";

/** Les zones que WhatsApp recouvre, à l'échelle de référence 1080 x 1920. */
const HAUT = 240;
const BAS = 260;
const COTE = 60;

/**
 * Le sourire du logo, à n'importe quelle taille.
 *
 * Le tracé de `logotype.tsx` est `M12.8 18.2 C 14.2 25.6, 25.8 25.6, 27.2
 * 18.2` sur une grille de 40 : largeur 14,4, poignées rentrées de 1,4 et
 * descendues de 7,4. Ce sont ces deux rapports, et eux seuls, qui font la
 * courbe. Les réutiliser garantit que l'arc de l'affiche est le sourire de la
 * marque agrandi, et non une courbe approchée à l'oeil.
 *
 * Le creux d'une cubique dont les deux poignées sont à la même hauteur vaut
 * les trois quarts de cette hauteur, d'où le 0,75 qui remonte les extrémités.
 */
const RENTREE = 1.4 / 14.4;
const CHUTE = 7.4 / 14.4;
const arcSourire = (largeur, cx, creux) => {
  const poignee = CHUTE * largeur;
  const y = creux - 0.75 * poignee;
  const g = cx - largeur / 2;
  const d = cx + largeur / 2;
  const r = RENTREE * largeur;
  return `M${g} ${y} C${g + r} ${y + poignee}, ${d - r} ${y + poignee}, ${d} ${y}`;
};

const VARIANTES = [
  {
    cle: "bleu",
    // Le bleu du livre en haut, le même assombri de 9 % en bas.
    fond: "linear-gradient(180deg, #006eb8 0%, #00538a 100%)",
    encre: "#f8f5f2",
    sourde: "rgba(248,245,242,.95)",
    filet: "rgba(248,245,242,.22)",
    symbole: "sentis-symbole-blanc",
  },
  {
    cle: "papier",
    fond: "linear-gradient(180deg, #f8f5f2 0%, #f4f0eb 100%)",
    encre: "#1a1a1a",
    sourde: "#595755",
    filet: "rgba(26,26,26,.16)",
    symbole: "sentis-symbole-couleur",
  },
  {
    cle: "encre",
    fond: "linear-gradient(180deg, #121314 0%, #191b1c 100%)",
    encre: "#f8f5f2",
    sourde: "#9ba0a4",
    filet: "rgba(248,245,242,.14)",
    symbole: "sentis-symbole-couleur-fond-sombre",
  },
];

/** Les quatre angles du cadre, chacun avec les deux bords qui le dessinent. */
const ANGLES = [
  ["top", "left", "border-top-width:2px;border-left-width:2px"],
  ["top", "right", "border-top-width:2px;border-right-width:2px"],
  ["bottom", "left", "border-bottom-width:2px;border-left-width:2px"],
  ["bottom", "right", "border-bottom-width:2px;border-right-width:2px"],
];
const equerres = () =>
  ANGLES.map(
    ([v, h, bords]) =>
      `<div class="coin" style="${v}:${v === "top" ? HAUT : BAS}px;${h}:${COTE}px;${bords}"></div>`,
  ).join("");

const page = (v, reperes) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;background:#000}
  .toile{position:relative;width:1080px;height:1920px;background:${v.fond};color:${v.encre};
         font-family:Inter,system-ui,sans-serif;overflow:hidden;
         font-feature-settings:"cv05" 1,"ss03" 1;
         -webkit-font-smoothing:antialiased}

  /* Le grain. Monochrome, en overlay : il trouble l'aplat sans le recolorer. */
  .grain{position:absolute;inset:0;opacity:.035;mix-blend-mode:overlay;pointer-events:none}

  /* Le sourire de la marque, agrandi jusqu'a sortir du cadre. */
  .arc{position:absolute;inset:0;width:1080px;height:1920px;opacity:.16;pointer-events:none}

  /* Le cadre, posé sur la limite exacte du visible, et ses quatre équerres. */
  .cadre{position:absolute;top:${HAUT}px;bottom:${BAS}px;left:${COTE}px;right:${COTE}px;
         border:1.5px solid ${v.filet};pointer-events:none}
  .coin{position:absolute;width:34px;height:34px;border:0 solid currentColor;
        opacity:.42;pointer-events:none}

  .contenu{position:absolute;top:${HAUT}px;bottom:${BAS}px;left:${COTE}px;right:${COTE}px;
           display:flex;flex-direction:column;align-items:center;
           padding:84px 40px 76px;text-align:center}
  .haut{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center}
  .symbole svg{width:170px;height:170px;display:block}

  /* Le fil : il ne decore pas, il pose l'axe et fait descendre le regard. */
  .fil{width:1px;height:58px;margin:34px 0 38px;opacity:.5;
       background:linear-gradient(180deg,transparent,currentColor 45%,transparent)}

  /* La question porte l'affiche ; le point d'interrogation est allege d'une
     graisse. Meme couleur, donc meme contraste : c'est une respiration et non
     un affaiblissement. Un accent grave fermerait le gabarit JavaScript : ces
     commentaires sont volontairement sans. */
  .question{font-size:132px;line-height:1.02;font-weight:600;letter-spacing:-.035em;
            margin-bottom:54px}
  /* L'espace fine insecable d'Inter porte 0,22 em a ce corps : juste au bon
     endroit dans un paragraphe, trop beant a 132 px. On la ramene au huitieme
     de cadratin de la regle typographique. Le caractere reste le bon ; seule
     sa chasse est corrigee optiquement. */
  .question .pi{font-weight:300;margin-left:-.09em}

  /* La reponse. Les retours a la ligne sont ecrits dans le texte : c'est eux
     qui decident de la coupe, pas une largeur maximale. */
  .reponse{font-size:38px;line-height:1.35;font-weight:400;letter-spacing:-.005em;
           white-space:pre-line}

  .bas{display:flex;flex-direction:column;align-items:center;gap:22px}
  .regle{width:64px;height:2px;background:${v.encre};opacity:.4}
  .mot{font-size:40px;font-weight:700;letter-spacing:.2em;text-transform:uppercase}
  .lieu{font-size:23px;color:${v.sourde};letter-spacing:.06em}
  .site{font-size:24px;color:${v.sourde};letter-spacing:.24em;text-transform:uppercase}
  .repere{position:absolute;left:0;right:0;background:rgba(255,0,0,.18);
          border:2px dashed rgba(255,0,0,.6);pointer-events:none}
</style></head><body>
<div class="toile">
  <svg class="grain" xmlns="http://www.w3.org/2000/svg">
    <filter id="g">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#g)"/>
  </svg>
  <svg class="arc" viewBox="0 0 1080 1920" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="${arcSourire(2600, 540, 1310)}" stroke="currentColor" stroke-width="3"/>
  </svg>
  <div class="cadre"></div>
  ${equerres()}
  <div class="contenu">
    <div class="haut">
      <div class="symbole">${lire(v.symbole)}</div>
      <div class="fil"></div>
      <div class="question">${QUESTIONS.map(
        (q) => `${q}${FINE}<span class="pi">?</span>`,
      ).join("<br>")}</div>
      <div class="reponse">${REPONSE}</div>
    </div>
    <div class="bas">
      <div class="regle"></div>
      <div class="mot">Studio Sentis</div>
      <div class="lieu">${LIEU}</div>
      <div class="site">${SITE}</div>
    </div>
  </div>
  ${reperes ? `<div class="repere" style="top:0;height:${HAUT}px"></div>
               <div class="repere" style="bottom:0;height:${BAS}px"></div>` : ""}
</div></body></html>`;

/**
 * Exporté pour que `verifier-affiche.mjs` mesure **la page réellement rendue**.
 *
 * Une première version en avait fait une copie dans un second fichier. Deux
 * copies d'un même gabarit finissent toujours par diverger, et le contrôle
 * aurait alors mesuré une affiche que personne ne publie. Le fichier ne rend
 * les images que lorsqu'on le lance directement ; importé, il n'expose que
 * son gabarit.
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
