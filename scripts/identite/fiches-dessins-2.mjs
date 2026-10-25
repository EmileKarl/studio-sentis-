/**
 * Les énigmes visuelles de la seconde vague.
 *
 * La première série comptait et comparait. Celle-ci demande au cerveau de
 * fabriquer quelque chose qui n'existe pas, ou de choisir entre deux
 * lectures également valables d'un même dessin.
 *
 * C'est le registre le plus utile pour un studio de design, parce qu'il
 * démontre la thèse du métier sans l'énoncer : **ce qu'on voit n'est pas ce
 * qui est dessiné.** Quelqu'un qui vient de voir un triangle blanc là où
 * aucun trait n'a été tracé comprend tout seul pourquoi on valide une
 * enseigne sur place plutôt que sur un écran.
 *
 * Tous les comptes sont calculés. Le nombre de triangles d'une figure
 * subdivisée vient de la formule ⌊n(n+2)(2n+1)/8⌋, vérifiée aux petits
 * rangs : 1, 5, 13, 27, 48.
 *
 * Ce qui n'a **pas** été fait : le triangle de Penrose. C'est la figure
 * impossible la plus connue, et elle aurait complété la série — mais elle
 * demande de redessiner par-dessus le premier barreau pour simuler un ordre
 * de profondeur contradictoire, et une version approximative ne ressemble
 * pas à une figure impossible : elle ressemble à une erreur. Kanizsa et
 * Necker couvrent déjà le même registre, correctement.
 */

const pt = (cx, cy, r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
const rad = (d) => (d * Math.PI) / 180;
const toile = (contenu, l = 720, h = l) =>
  `<svg class="dessin" viewBox="0 0 ${l} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">${contenu}</svg>`;
const lettre = (x, y, t) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Inter,sans-serif"
         font-size="38" font-weight="600" fill="currentColor" opacity=".6">${t}</text>`;
const marque = ({ t, rx = 11.4, trait = 2.2, sourire = true, pivot = 0 }) => `
  <g transform="scale(${t / 40})${pivot ? ` rotate(${pivot} 20 20)` : ""}">
    <rect x="2.1" y="2.1" width="35.8" height="35.8" rx="${rx}" fill="none"
          stroke="currentColor" stroke-width="${trait}"/>
    ${sourire ? `<path d="M12.8 18.2 C 14.2 25.6, 25.8 25.6, 27.2 18.2" fill="none"
          stroke="currentColor" stroke-width="${trait}" stroke-linecap="round"/>` : ""}
  </g>`;
const pose = (x, y, c) => `<g transform="translate(${x} ${y})">${c}</g>`;

/* ------------------------------------------------------------------ */
/* 1. Kanizsa : le triangle que personne n'a dessiné.                  */
/* ------------------------------------------------------------------ */

const pacman = (cx, cy, r, vers, demi) => {
  const [x1, y1] = pt(cx, cy, r, vers + demi);
  const [x2, y2] = pt(cx, cy, r, vers - demi);
  return `<path d="M${x1} ${y1} A${r} ${r} 0 1 0 ${x2} ${y2} L${cx} ${cy} Z" fill="currentColor"/>`;
};

const kanizsa = (rayon, ecart, pointeEnHaut) => {
  const c = 720;
  const base = pointeEnHaut ? -90 : 90;
  const parts = [0, 120, 240].map((d) => {
    const a = rad(base + d);
    const [cx, cy] = pt(c / 2, c / 2, ecart, a);
    return pacman(cx, cy, rayon, a + Math.PI, rad(30));
  });
  return toile(parts.join(""));
};

const KANIZSA = [
  [96, 215, true], [88, 195, false], [104, 230, true], [82, 180, false],
].map(([r, e, haut]) => ({
  fam: "dessin",
  q: "Combien de triangles sont dessinés ?",
  svg: kanizsa(r, e, haut),
  r: "Aucun. Pas un seul trait de triangle n'est tracé : il n'y a que trois disques entaillés. Le triangle blanc que vous voyez, bords et tout, est fabriqué par votre cerveau — c'est le triangle de Kanizsa. Même mécanisme que celui qui vous fait voir une colonne là où il n'y a que des blancs alignés.",
}));

/* ------------------------------------------------------------------ */
/* 2. Combien de triangles ? Le compte vient d'une formule.            */
/* ------------------------------------------------------------------ */

/** Triangle subdivisé en n rangs : ⌊n(n+2)(2n+1)/8⌋. Donne 1, 5, 13, 27, 48. */
const compteTriangles = (n) => Math.floor((n * (n + 2) * (2 * n + 1)) / 8);

const triangleSubdivise = (n) => {
  const c = 720;
  const S = 640;
  const H = (S * Math.sqrt(3)) / 2;
  const x0 = c / 2;
  const y0 = (c - H) / 2;
  const s = S / n;
  const h = H / n;
  const traits = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      const ax = x0 - (i * s) / 2 + j * s;
      const ay = y0 + i * h;
      const bx = x0 - ((i + 1) * s) / 2 + j * s;
      const by = y0 + (i + 1) * h;
      traits.push(`<path d="M${ax} ${ay} L${bx} ${by} L${bx + s} ${by} Z"/>`);
    }
  }
  return toile(
    `<g stroke="currentColor" stroke-width="4" stroke-linejoin="round">${traits.join("")}</g>`,
  );
};

const TRIANGLES = [2, 3, 4, 5, 6].map((n) => ({
  fam: "dessin",
  q: "Combien de triangles voyez-vous ?",
  svg: triangleSubdivise(n),
  r: `${compteTriangles(n)}. Il faut compter les petits, mais aussi ceux que forment plusieurs petits réunis, et le grand. Sur ${n} rangs, la formule donne ${compteTriangles(n)}.`,
}));

/* ------------------------------------------------------------------ */
/* 3. La grille d'Hermann : des points qui n'y sont pas.               */
/* ------------------------------------------------------------------ */

const grilleHermann = (cote, ecart) => {
  const c = 720;
  const pas = c / cote;
  const t = pas - ecart;
  const parts = [];
  for (let i = 0; i < cote; i++)
    for (let j = 0; j < cote; j++)
      parts.push(`<rect x="${i * pas + ecart / 2}" y="${j * pas + ecart / 2}"
                   width="${t}" height="${t}" fill="currentColor"/>`);
  return toile(parts.join(""));
};

const HERMANN = [
  [6, 22], [7, 20], [5, 26], [8, 18],
].map(([n, e]) => ({
  fam: "dessin",
  q: "Voyez-vous des points gris aux croisements ?",
  svg: grilleHermann(n, e),
  r: "Ils n'existent pas. Les croisements sont exactement de la même couleur que le reste des couloirs — regardez-en un directement, il disparaît. C'est la grille d'Hermann : l'oeil accentue les contrastes en périphérie et invente les taches. C'est aussi pourquoi une grille de vignettes trop serrée fatigue.",
}));

/* ------------------------------------------------------------------ */
/* 4. Poggendorff : quelle ligne continue l'autre ?                    */
/* ------------------------------------------------------------------ */

/**
 * Poggendorff. Une oblique passe derrière une bande ; deux segments sortent
 * de l'autre côté, et il faut dire lequel la prolonge.
 *
 * Les deux segments de droite doivent avoir **exactement la même pente** que
 * celui de gauche, et ne différer que par leur hauteur. La première version
 * les traçait horizontaux — aucun des deux ne prolongeait quoi que ce soit,
 * et l'énigme n'avait pas de bonne réponse.
 */
const poggendorff = (pente, ecart, bonneEnHaut) => {
  const c = 720;
  const xg = 120;
  const xd = c - 120;
  const bandeG = c / 2 - ecart / 2;
  const bandeD = c / 2 + ecart / 2;
  const y0 = c / 2 + 150;
  const yEn = (x) => y0 - pente * (x - xg);
  const decalage = bonneEnHaut ? 70 : -70;
  const vraie = [yEn(bandeD), yEn(xd)];
  const fausse = [vraie[0] + decalage, vraie[1] + decalage];
  const [haut, bas] = vraie[0] < fausse[0] ? [vraie, fausse] : [fausse, vraie];
  return toile(`
    <rect x="${bandeG}" y="0" width="${ecart}" height="${c}" fill="currentColor" opacity=".14"/>
    <g stroke="currentColor" stroke-width="7" stroke-linecap="round">
      <line x1="${xg}" y1="${y0}" x2="${bandeG}" y2="${yEn(bandeG)}"/>
      <line x1="${bandeD}" y1="${haut[0]}" x2="${xd}" y2="${haut[1]}"/>
      <line x1="${bandeD}" y1="${bas[0]}" x2="${xd}" y2="${bas[1]}"/>
    </g>
    ${lettre(xd + 44, haut[1] + 13, "A")}
    ${lettre(xd + 44, bas[1] + 13, "B")}
  `);
};

const POGGENDORFF = [
  [0.42, 150, true], [0.5, 170, false], [0.36, 130, true], [0.46, 190, false],
].map(([p, e, haut]) => ({
  fam: "dessin",
  q: "Quelle ligne prolonge celle de gauche, A ou B ?",
  svg: poggendorff(p, e, haut),
  r: `${haut ? "A" : "B"}. Presque tout le monde se trompe : la bande masquante fait dériver le prolongement dans l'oeil. C'est l'illusion de Poggendorff. Posez une règle sur l'écran pour vérifier.`,
}));

/* ------------------------------------------------------------------ */
/* 5. Ponzo : deux barres identiques sur des rails qui se rejoignent.  */
/* ------------------------------------------------------------------ */

/**
 * Ponzo. Deux barres identiques entre deux rails qui se rejoignent : celle
 * du haut paraît plus longue, parce que les rails la font lire comme plus
 * lointaine.
 *
 * L'illusion exige que la barre du haut **remplisse presque** l'écart entre
 * les rails et que celle du bas y flotte. La première version plaçait la
 * barre du haut à une hauteur fixe : avec les longueurs les plus grandes,
 * elle dépassait les rails, et une barre qui sort du couloir ne peut plus
 * être lue comme lointaine. La hauteur est donc calculée à partir de la
 * longueur, pour laisser 18 px de part et d'autre.
 */
const HAUT_RAIL = 70;
const BAS_RAIL = 660;
const ECART_HAUT = 70;
const ECART_BAS = 330;
/** L'inverse de l'ecart entre les rails : a quelle hauteur poser la barre. */
const hauteurPour = (longueur) =>
  HAUT_RAIL +
  ((longueur / 2 + 18 - ECART_HAUT) * (BAS_RAIL - HAUT_RAIL)) / (ECART_BAS - ECART_HAUT);

const ponzo = (longueur, basY) => {
  const c = 720;
  const cx = c / 2;
  const hautY = hauteurPour(longueur);
  return toile(`
    <g stroke="currentColor" stroke-width="5" opacity=".55">
      <line x1="${cx - ECART_HAUT}" y1="${HAUT_RAIL}" x2="${cx - ECART_BAS}" y2="${BAS_RAIL}"/>
      <line x1="${cx + ECART_HAUT}" y1="${HAUT_RAIL}" x2="${cx + ECART_BAS}" y2="${BAS_RAIL}"/>
    </g>
    <g stroke="currentColor" stroke-width="16" stroke-linecap="round">
      <line x1="${cx - longueur / 2}" y1="${hautY}" x2="${cx + longueur / 2}" y2="${hautY}"/>
      <line x1="${cx - longueur / 2}" y1="${basY}" x2="${cx + longueur / 2}" y2="${basY}"/>
    </g>
    ${lettre(cx - longueur / 2 - 46, hautY + 13, "A")}
    ${lettre(cx - longueur / 2 - 46, basY + 13, "B")}
  `);
};

const PONZO = [
  [250, 560], [230, 590], [270, 540], [240, 575],
].map(([l, b]) => ({
  fam: "dessin",
  q: "Quelle barre est la plus longue, A ou B ?",
  svg: ponzo(l, b),
  r: "Elles sont identiques, au pixel près. Les rails qui se rejoignent font lire la barre du haut comme étant plus loin — donc plus grande, puisqu'elle occupe autant de place. C'est l'illusion de Ponzo, et c'est le mécanisme de la perspective.",
}));

/* ------------------------------------------------------------------ */
/* 6. Necker : un cube qui refuse de choisir.                          */
/* ------------------------------------------------------------------ */

const necker = (cote, fuite) => {
  const c = 720;
  const d = fuite;
  const x = (c - cote - d) / 2;
  const y = (c - cote - d) / 2;
  const av = [[x, y + d], [x + cote, y + d], [x + cote, y + cote + d], [x, y + cote + d]];
  const ar = [[x + d, y], [x + cote + d, y], [x + cote + d, y + cote], [x + d, y + cote]];
  const poly = (p) => `<path d="M${p.map((q) => q.join(" ")).join(" L")} Z"
      stroke="currentColor" stroke-width="5" fill="none"/>`;
  const arete = (a, b) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"
      stroke="currentColor" stroke-width="5"/>`;
  return toile(`${poly(av)}${poly(ar)}${av.map((p, i) => arete(p, ar[i])).join("")}`);
};

const NECKER = [
  [340, 150], [300, 190], [380, 130],
].map(([c, f]) => ({
  fam: "dessin",
  q: "Ce cube, le voyez-vous d'en haut ou d'en dessous ?",
  svg: necker(c, f),
  r: "Les deux, et aucun n'est le bon. Aucune arête n'est cachée, donc rien dans le dessin ne dit quelle face est devant : votre cerveau choisit, puis change d'avis. C'est le cube de Necker. Fixez-le dix secondes, il bascule tout seul.",
}));

/* ------------------------------------------------------------------ */
/* 7. Quelle figure vient ensuite ?                                    */
/* ------------------------------------------------------------------ */

/**
 * Les suites. Chaque règle porte **explicitement** sa bonne réponse et ses
 * deux leurres, au lieu de les dériver de la série.
 *
 * La première version prenait la règle aux rangs 4, 6 et 2 pour fabriquer
 * les trois propositions. Deux désastres : pour la règle du sourire, qui
 * alterne, les rangs 4, 6 et 2 donnent tous les trois le même dessin — une
 * question à trois bonnes réponses identiques ; pour celle du rayon, le rang
 * 6 donnait un rayon **négatif**. Une dérivation astucieuse ne vaut rien si
 * elle produit des énigmes sans réponse.
 */
const REGLES = {
  pivot: {
    serie: (k) => ({ pivot: k * 45 }),
    bonne: { pivot: 180 },
    faux: [{ pivot: 225 }, { pivot: 135 }],
    dit: "le symbole tourne de 45 degrés à chaque case",
  },
  rayon: {
    serie: (k) => ({ rx: 14 - k * 2.6 }),
    bonne: { rx: 3.6 },
    faux: [{ rx: 8.8 }, { rx: 0.8 }],
    dit: "les angles s'affûtent d'un cran régulier à chaque case",
  },
  trait: {
    serie: (k) => ({ trait: 1.3 + k * 0.6 }),
    bonne: { trait: 3.7 },
    faux: [{ trait: 2.5 }, { trait: 5.2 }],
    dit: "le trait s'épaissit d'un cran régulier à chaque case",
  },
  sourire: {
    serie: (k) => ({ sourire: k % 2 === 0 }),
    bonne: { sourire: true },
    faux: [{ sourire: false }, { sourire: true, pivot: 90 }],
    dit: "le sourire revient une case sur deux, et la case suivante est une case paire",
  },
};

const sequence = (genre, bonne) => {
  const L = 940;
  const H = 560;
  const t = 128;
  const regle = REGLES[genre];
  const serie = [0, 1, 2, 3].map((k) =>
    pose(40 + k * 200, 60, marque({ t, ...regle.serie(k) })),
  );
  const creux = `<rect x="${40 + 4 * 200}" y="60" width="${t}" height="${t}" rx="18"
      stroke="currentColor" stroke-width="4" stroke-dasharray="10 9" fill="none"/>
    <text x="${40 + 4 * 200 + t / 2}" y="${60 + t / 2 + 20}" text-anchor="middle"
      font-family="Inter,sans-serif" font-size="58" font-weight="600"
      fill="currentColor" opacity=".5">?</text>`;
  const propositions = [regle.bonne, ...regle.faux];
  const ordre = [0, 1, 2];
  for (let i = 0; i < bonne; i++) ordre.unshift(ordre.pop());
  const choix = ordre.map((p, k) => {
    const x = 150 + k * 250;
    return `${pose(x, 330, marque({ t, ...propositions[p] }))}
            ${lettre(x + t / 2, 330 + t + 52, ["A", "B", "C"][k])}`;
  });
  return toile(`${serie.join("")}${creux}${choix.join("")}`, L, H);
};

const SEQUENCES = [
  ["pivot", 0], ["pivot", 2], ["rayon", 1], ["rayon", 0],
  ["trait", 2], ["trait", 1], ["sourire", 0], ["sourire", 2],
].map(([genre, bonne]) => ({
  fam: "dessin",
  q: "Quelle figure complète la suite ?",
  svg: sequence(genre, bonne),
  r: `${["A", "B", "C"][bonne]}. La règle : ${REGLES[genre].dit}. Les deux leurres sont cette même règle prise un cran trop tôt ou un cran trop loin.`,
}));

export const DESSINS_2 = [
  ...KANIZSA, ...TRIANGLES, ...HERMANN, ...POGGENDORFF,
  ...PONZO, ...NECKER, ...SEQUENCES,
];
