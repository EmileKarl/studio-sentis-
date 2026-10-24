/**
 * L'affiche : 2160 x 3840, et son export 1080 x 1920 pour WhatsApp.
 *
 *   node scripts/identite/affiche-whatsapp.mjs
 *
 * Même composition que la première version, mêmes couleurs, même slogan. Ce
 * qui change tient en quatre choses, et aucune n'ajoute de couleur :
 *
 * 1. **Le double de définition.** Le maître fait 2160 x 3840. WhatsApp
 *    recompresse de toute façon, et il le fait mieux en partant d'une image
 *    nette qu'en réencodant une image déjà à sa taille. Le maître sert aussi
 *    pour l'impression et pour les autres plateformes.
 *
 * 2. **Un dégradé dans la même teinte.** C'est le seul levier qui donne de la
 *    profondeur à un aplat sans y ajouter de couleur : la teinte et la
 *    saturation ne bougent pas, seule la clarté descend vers le bas. Il va
 *    **du clair vers le sombre et jamais l'inverse** — éclaircir le haut
 *    faisait passer le blanc cassé de 4,93 à 3,81:1, sous le plancher. Mesuré
 *    avant d'être écrit.
 *
 * 3. **Un grain fin**, à 3,5 % d'opacité. C'est ce qui sépare un aplat
 *    numérique d'un aplat imprimé. Il est monochrome et posé en `overlay` :
 *    il ne déplace pas la couleur, il la trouble.
 *
 * 4. **Un cadre au filet**, posé exactement sur les zones réservées de
 *    WhatsApp. Il fait lire « affiche » plutôt que « image », et comme il
 *    épouse la limite du visible, il ne se fait jamais couper.
 *
 * Les contrastes ne sont pas calculés sur la couleur théorique : ils sont
 * relevés **dans le PNG rendu**, grain compris, par `verifier-affiche.mjs`.
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SVG = join(RACINE, "identite", "1-logo", "svg");
const SORTIE = join(RACINE, "identite", "4-reseaux");
const lire = (n) => readFileSync(join(SVG, `${n}.svg`), "utf8");

const SLOGAN = "Le prix et la date,\ndès le premier échange.";
const SITE = "www.studiosentis.ca";
const LIEU = "Châteauguay · Montérégie · Grand Montréal";

/** Les zones que WhatsApp recouvre, à l'échelle de référence 1080 x 1920. */
const HAUT = 240;
const BAS = 260;
// 60 et non 76 : mesuré au navigateur, la boîte de contenu doit faire 880 px
// pour que le slogan tienne sur ses deux lignes à 78 px. À 800 px il passait
// sur trois, et la coupe ne tombait plus sur la virgule.
const COTE = 60;

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

const page = (v, reperes) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;background:#000}
  .toile{position:relative;width:1080px;height:1920px;background:${v.fond};color:${v.encre};
         font-family:Inter,system-ui,sans-serif;overflow:hidden;
         font-feature-settings:"cv05" 1,"ss03" 1;
         -webkit-font-smoothing:antialiased}

  /* Le grain. Monochrome, en overlay : il trouble l'aplat sans le recolorer. */
  .grain{position:absolute;inset:0;opacity:.035;mix-blend-mode:overlay;pointer-events:none}

  /* Le cadre, posé sur la limite exacte du visible. */
  .cadre{position:absolute;top:${HAUT}px;bottom:${BAS}px;left:${COTE}px;right:${COTE}px;
         border:1.5px solid ${v.filet};pointer-events:none}

  .contenu{position:absolute;top:${HAUT}px;bottom:${BAS}px;left:${COTE}px;right:${COTE}px;
           display:flex;flex-direction:column;align-items:center;
           padding:84px 40px 76px;text-align:center}
  .haut{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:92px}
  .symbole svg{width:252px;height:252px;display:block}
    /* Pas de largeur maximale : les deux retours à la ligne sont ecrits dans
     le texte, c'est eux qui decident de la coupe. Une largeur maximale
     ajoutait une troisieme ligne par-dessus. Un accent grave fermerait le
     gabarit JavaScript : ce commentaire est volontairement sans. */
  .slogan{font-size:78px;line-height:1.1;font-weight:600;letter-spacing:-.028em;
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
  <div class="cadre"></div>
  <div class="contenu">
    <div class="haut">
      <div class="symbole">${lire(v.symbole)}</div>
      <div class="slogan">${SLOGAN}</div>
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
