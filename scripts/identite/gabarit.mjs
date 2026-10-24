/**
 * L'habillage commun à toutes les pièces 1080 x 1920 : l'affiche et les
 * fiches de communication.
 *
 * Il a d'abord vécu dans `affiche-whatsapp.mjs`. Le jour où les fiches sont
 * arrivées, deux options : recopier l'habillage, ou l'extraire. La recopie a
 * déjà été essayée une fois dans ce dépôt, entre l'affiche et son
 * vérificateur, et le contrôle a fini par mesurer une image que personne ne
 * publiait. D'où ce module : le fond, le grain, l'arc, le cadre, les
 * équerres et la signature n'existent **qu'ici**.
 *
 * Ce qui change d'une pièce à l'autre tient dans un seul trou : `corps`.
 */
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SVG = join(RACINE, "identite", "1-logo", "svg");
export const lireSymbole = (n) => readFileSync(join(SVG, `${n}.svg`), "utf8");

/** Les zones que WhatsApp recouvre, à l'échelle de référence 1080 x 1920. */
export const HAUT = 240;
export const BAS = 260;
export const COTE = 60;

export const SITE = "www.studiosentis.ca";
export const LIEU = "Châteauguay · Montérégie · Grand Montréal";

/** U+202F : l'espace fine insécable, la règle française devant ? et !. */
export const FINE = " ";

export const VARIANTES = [
  {
    cle: "bleu",
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

export const parCle = (cle) => VARIANTES.find((v) => v.cle === cle);

/**
 * Le sourire du logo, à n'importe quelle taille.
 *
 * Le tracé de `logotype.tsx` est "M12.8 18.2 C 14.2 25.6, 25.8 25.6, 27.2
 * 18.2" sur une grille de 40 : largeur 14,4, poignées rentrées de 1,4 et
 * descendues de 7,4. Ce sont ces deux rapports, et eux seuls, qui font la
 * courbe. Les réutiliser garantit que l'arc est le sourire de la marque
 * agrandi, et non une courbe approchée à l'oeil.
 *
 * Le creux d'une cubique dont les deux poignées sont à la même hauteur vaut
 * les trois quarts de cette hauteur, d'où le 0,75 qui remonte les extrémités.
 */
const RENTREE = 1.4 / 14.4;
const CHUTE = 7.4 / 14.4;
export const arcSourire = (largeur, cx, creux) => {
  const poignee = CHUTE * largeur;
  const y = creux - 0.75 * poignee;
  const g = cx - largeur / 2;
  const d = cx + largeur / 2;
  const r = RENTREE * largeur;
  return `M${g} ${y} C${g + r} ${y + poignee}, ${d - r} ${y + poignee}, ${d} ${y}`;
};

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

/**
 * La coque complète. `corps` est le seul contenu qui varie.
 *
 * `creuxArc` descend ou remonte l'arc selon la hauteur du corps : il doit
 * passer dans une bande vide. Posé trop haut, il barre une ligne de texte —
 * c'est arrivé, vu au rendu et corrigé.
 *
 * Note sur les commentaires CSS ci-dessous : ils ne contiennent aucune
 * apostrophe inversée, qui refermerait ce gabarit JavaScript. Les lettres
 * accentuees, elles, ne posent aucun probleme.
 */
export function coque({ v, corps, styleEnPlus = "", creuxArc = 1310, reperes = false }) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
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

  /* Le cadre, pose sur la limite exacte du visible, et ses quatre equerres. */
  .cadre{position:absolute;top:${HAUT}px;bottom:${BAS}px;left:${COTE}px;right:${COTE}px;
         border:1.5px solid ${v.filet};pointer-events:none}
  .coin{position:absolute;width:34px;height:34px;border:0 solid currentColor;
        opacity:.42;pointer-events:none}

  .contenu{position:absolute;top:${HAUT}px;bottom:${BAS}px;left:${COTE}px;right:${COTE}px;
           display:flex;flex-direction:column;align-items:center;
           padding:84px 40px 76px;text-align:center}
  .haut{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
        width:100%}
  .symbole svg{width:170px;height:170px;display:block}

  /* Le fil : il ne decore pas, il pose l'axe et fait descendre le regard. */
  .fil{width:1px;height:58px;margin:34px 0 38px;opacity:.5;
       background:linear-gradient(180deg,transparent,currentColor 45%,transparent)}

  /* Le point d'interrogation est allege d'une graisse. Meme couleur, donc
     meme contraste : c'est une respiration, pas un affaiblissement. */
  .question{font-size:112px;line-height:1.05;font-weight:600;letter-spacing:-.034em}
  .question .pi{font-weight:300;margin-left:-.09em}
  .reponse{font-size:38px;line-height:1.35;font-weight:400;letter-spacing:-.005em;
           white-space:pre-line}

  .bas{display:flex;flex-direction:column;align-items:center;gap:22px}
  .regle{width:64px;height:2px;background:${v.encre};opacity:.4}
  .mot{font-size:40px;font-weight:700;letter-spacing:.2em;text-transform:uppercase}
  .lieu{font-size:23px;color:${v.sourde};letter-spacing:.06em}
  .site{font-size:24px;color:${v.sourde};letter-spacing:.24em;text-transform:uppercase}
  .repere{position:absolute;left:0;right:0;background:rgba(255,0,0,.18);
          border:2px dashed rgba(255,0,0,.6);pointer-events:none}
${styleEnPlus}
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
    <path d="${arcSourire(2600, 540, creuxArc)}" stroke="currentColor" stroke-width="3"/>
  </svg>
  <div class="cadre"></div>
  ${equerres()}
  <div class="contenu">
    <div class="haut">${corps}</div>
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
}
