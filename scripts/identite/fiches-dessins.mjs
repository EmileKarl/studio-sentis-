/**
 * Les énigmes visuelles, dessinées à partir de la géométrie de la marque.
 *
 * ## Pourquoi celles-ci sont générées alors que les textes sont écrits
 *
 * Déplacer l'intrus d'une case produit une énigme exactement aussi valable
 * que la précédente. Recombiner deux moitiés de phrase, non — le corpus SEO
 * de ce dépôt l'a prouvé en produisant « gabarits pour entreprise pour
 * café ». La combinaison tient sur la géométrie, pas sur la langue.
 *
 * ## Pourquoi une illusion d'optique sur le statut d'un studio de design
 *
 * Parce qu'elle fait deux choses à la fois. Elle se partage — on envoie une
 * illusion à quelqu'un, on n'envoie pas une publicité. Et elle démontre le
 * métier sans en parler : quelqu'un qui sait que deux bleus identiques
 * paraissent différents selon leur voisinage sait aussi pourquoi votre
 * enseigne ne ressort pas.
 *
 * Chaque réponse est **calculée**, jamais comptée à l'oeil : le nombre de
 * carrés d'une grille vient d'une somme, le nombre de sourires d'un filtre
 * sur la liste qui a servi à les dessiner. Un compte faux dans une devinette
 * publiée coûte la crédibilité qu'elle devait construire.
 */

/** Le symbole, posé à la taille voulue, dans la grille de 40 du logotype. */
const marque = ({ t, rx = 11.4, trait = 2.2, sourire = true, pivot = 0 }) => `
  <g transform="scale(${t / 40})${pivot ? ` rotate(${pivot} 20 20)` : ""}">
    <rect x="2.1" y="2.1" width="35.8" height="35.8" rx="${rx}" fill="none"
          stroke="currentColor" stroke-width="${trait}"/>
    ${sourire ? `<path d="M12.8 18.2 C 14.2 25.6, 25.8 25.6, 27.2 18.2" fill="none"
          stroke="currentColor" stroke-width="${trait}" stroke-linecap="round"/>` : ""}
  </g>`;

const pose = (x, y, contenu) => `<g transform="translate(${x} ${y})">${contenu}</g>`;

/** Suite déterministe : le même indice redonne toujours la même figure. */
const suite = (graine) => {
  let e = graine >>> 0;
  return () => {
    e = (e * 1664525 + 1013904223) >>> 0;
    return e / 4294967296;
  };
};

/** La toile. Carrée par défaut ; large quand la figure l'exige. */
const toile = (contenu, l = 720, h = l) =>
  `<svg class="dessin" viewBox="0 0 ${l} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">${contenu}</svg>`;

const lettre = (x, y, t) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Inter,sans-serif"
         font-size="40" font-weight="600" fill="currentColor" opacity=".55">${t}</text>`;

/* ------------------------------------------------------------------ */
/* 1. Combien de carrés ? Le compte vient d'une somme, pas de l'oeil.  */
/* ------------------------------------------------------------------ */

/** Dans une grille n x m, le nombre de carrés vaut la somme des (n-k+1)(m-k+1). */
const compteCarres = (n, m) => {
  let total = 0;
  for (let k = 1; k <= Math.min(n, m); k++) total += (n - k + 1) * (m - k + 1);
  return total;
};

const grilleCarres = (n, m) => {
  const c = 720;
  const pas = Math.floor(Math.min(c / n, c / m) * 0.86);
  const L = n * pas;
  const H = m * pas;
  const x0 = (c - L) / 2;
  const y0 = (c - H) / 2;
  const traits = [];
  for (let i = 0; i <= n; i++)
    traits.push(`<line x1="${x0 + i * pas}" y1="${y0}" x2="${x0 + i * pas}" y2="${y0 + H}"/>`);
  for (let j = 0; j <= m; j++)
    traits.push(`<line x1="${x0}" y1="${y0 + j * pas}" x2="${x0 + L}" y2="${y0 + j * pas}"/>`);
  return toile(
    `<g stroke="currentColor" stroke-width="4" stroke-linecap="square">${traits.join("")}</g>`,
  );
};

const CARRES = [
  [3, 3], [4, 4], [3, 4], [5, 5], [4, 5], [2, 5], [3, 5], [4, 6], [2, 4], [2, 2],
].map(([n, m]) => ({
  fam: "dessin",
  q: "Combien de carrés voyez-vous ?",
  svg: grilleCarres(n, m),
  r: `${compteCarres(n, m)}. Sur une grille ${n} par ${m}, on additionne les carrés de chaque taille : la plupart des gens ne comptent que les ${n * m} plus petits.`,
}));

/* ------------------------------------------------------------------ */
/* 2. Combien de sourires ? Compté sur la liste qui a servi à dessiner. */
/* ------------------------------------------------------------------ */

const grilleSourires = (cote, graine, part) => {
  const c = 720;
  const pas = c / cote;
  const t = pas * 0.74;
  const marge = (pas - t) / 2;
  const alea = suite(graine);
  const cases = [];
  for (let i = 0; i < cote * cote; i++) cases.push(alea() < part);
  const dessin = cases
    .map((s, i) =>
      pose(
        (i % cote) * pas + marge,
        Math.floor(i / cote) * pas + marge,
        marque({ t, sourire: s }),
      ),
    )
    .join("");
  return { svg: toile(dessin), combien: cases.filter(Boolean).length, total: cases.length };
};

const SOURIRES = [
  [4, 7, 0.35], [4, 21, 0.5], [5, 3, 0.3], [5, 11, 0.42], [5, 29, 0.24],
  [6, 5, 0.28], [6, 13, 0.36], [6, 41, 0.2], [4, 55, 0.6], [5, 67, 0.5],
  [6, 71, 0.45], [4, 83, 0.25],
].map(([cote, graine, part]) => {
  const g = grilleSourires(cote, graine, part);
  return {
    fam: "dessin",
    q: "Combien de sourires ?",
    svg: g.svg,
    r: `${g.combien} sur ${g.total}. Les autres sont des carrés vides.`,
  };
});

/* ------------------------------------------------------------------ */
/* 3. Trouvez l'intrus.                                                */
/* ------------------------------------------------------------------ */

const ECARTS = {
  rayon: { ecart: { rx: 6.4 }, dit: "ses angles sont moins arrondis" },
  trait: { ecart: { trait: 3.1 }, dit: "son trait est plus épais" },
  pivot: { ecart: { pivot: 8 }, dit: "il est légèrement penché" },
  vide: { ecart: { sourire: false }, dit: "il n'a pas de sourire" },
};

const grilleIntrus = (cote, place, genre) => {
  const c = 720;
  const pas = c / cote;
  const t = pas * 0.74;
  const marge = (pas - t) / 2;
  const dessin = Array.from({ length: cote * cote }, (_, i) =>
    pose(
      (i % cote) * pas + marge,
      Math.floor(i / cote) * pas + marge,
      marque({ t, ...(i === place ? ECARTS[genre].ecart : {}) }),
    ),
  ).join("");
  return toile(dessin);
};

const INTRUS = [
  [4, 6, "rayon"], [4, 11, "trait"], [4, 13, "pivot"], [4, 2, "vide"],
  [5, 12, "rayon"], [5, 18, "trait"], [5, 7, "pivot"], [5, 21, "vide"],
  [3, 4, "rayon"], [3, 7, "trait"], [6, 20, "pivot"], [6, 33, "rayon"],
  [5, 3, "trait"], [4, 9, "pivot"], [6, 14, "vide"], [3, 2, "pivot"],
].map(([cote, place, genre]) => ({
  fam: "dessin",
  q: "Trouvez l'intrus.",
  svg: grilleIntrus(cote, place, genre),
  r: `Ligne ${Math.floor(place / cote) + 1}, colonne ${(place % cote) + 1} — ${ECARTS[genre].dit}.`,
}));

/* ------------------------------------------------------------------ */
/* 4. Deux bleus identiques, deux voisinages différents.               */
/* ------------------------------------------------------------------ */

const contrasteSimultane = (fondA, fondB, bleu) => {
  const c = 720;
  return toile(`
    <rect x="0" y="0" width="${c / 2}" height="${c}" fill="${fondA}"/>
    <rect x="${c / 2}" y="0" width="${c / 2}" height="${c}" fill="${fondB}"/>
    <rect x="${c / 4 - 90}" y="${c / 2 - 90}" width="180" height="180" fill="${bleu}"/>
    <rect x="${(3 * c) / 4 - 90}" y="${c / 2 - 90}" width="180" height="180" fill="${bleu}"/>
  `);
};

const COULEURS = [
  ["#f8f5f2", "#1a1a1a"], ["#c6dae6", "#00386b"], ["#e4eee4", "#121314"],
  ["#f4f0eb", "#005fa0"], ["#e6dacd", "#1a1a1a"], ["#9ba0a4", "#f8f5f2"],
].map(([a, b]) => ({
  fam: "dessin",
  q: "Les deux carrés sont-ils de la même couleur ?",
  svg: contrasteSimultane(a, b, "#006eb8"),
  r: "Oui, exactement le même bleu. C'est le contraste simultané : l'oeil juge une couleur par rapport à sa voisine, jamais seule. C'est pour ça qu'une couleur de marque se valide toujours sur ses vrais fonds.",
}));

/* ------------------------------------------------------------------ */
/* 5. Ces lignes sont-elles parallèles ? (mur du café)                 */
/* ------------------------------------------------------------------ */

/**
 * Le mur du café. Deux réglages décident de tout, et la première version les
 * avait tous les deux faux.
 *
 * 1. **Le décalage.** Il se mesure en fraction de tuile, et il doit valoir
 *    une demi-tuile d'une rangée à la suivante. La première version décalait
 *    d'une tuile entière — les tuiles sombres retombaient sur les claires,
 *    ce qui donne un damier régulier et **aucune illusion**. Vu sur la
 *    planche-contact, pas dans le code.
 * 2. **Le mortier.** La ligne entre deux rangées doit être d'une clarté
 *    intermédiaire entre les deux tuiles, sinon le cerveau ne la rattache à
 *    aucune des deux et l'inclinaison ne se produit pas. D'où ce gris neutre
 *    en dur : il tombe entre les deux dans les trois colorations, ce qu'un
 *    `currentColor` atténué ne ferait pas.
 */
const murDuCafe = (rangs, fraction) => {
  const c = 720;
  const h = c / rangs;
  const bloc = h * 1.7;
  const parts = [];
  for (let r = 0; r < rangs; r++) {
    const d = (r % 2) * fraction * bloc;
    for (let x = -bloc * 2; x < c + bloc * 2; x += bloc * 2)
      parts.push(`<rect x="${x + d}" y="${r * h}" width="${bloc}" height="${h}" fill="currentColor"/>`);
    if (r < rangs - 1)
      parts.push(`<line x1="0" y1="${(r + 1) * h}" x2="${c}" y2="${(r + 1) * h}"
                   stroke="#7d7f82" stroke-width="5"/>`);
  }
  return toile(`<g>${parts.join("")}</g>`);
};

const PARALLELES = [
  [8, 0.5], [10, 0.5], [7, 0.4], [12, 0.6],
].map(([r, d]) => ({
  fam: "dessin",
  q: "Les lignes grises sont-elles parallèles ?",
  svg: murDuCafe(r, d),
  r: "Oui, parfaitement. Le décalage des blocs fait pencher les lignes dans l'oeil : c'est l'illusion du mur du café. Même mécanisme que celui qui fait paraître une colonne de texte mal alignée alors qu'elle ne l'est pas.",
}));

/* ------------------------------------------------------------------ */
/* 6. Lequel est le vrai logo ?                                        */
/* ------------------------------------------------------------------ */

const FAUX = [
  { rx: 7.2, dit: "des angles trop vifs" },
  { rx: 15.5, dit: "des angles trop ronds" },
  { trait: 1.5, dit: "un trait trop fin" },
  { trait: 3.2, dit: "un trait trop gras" },
  { pivot: 6, dit: "un aplomb faux" },
];

const quatreLogos = (bonne, faux) => {
  const c = 720;
  const t = 280;
  const places = [[20, 20], [420, 20], [20, 420], [420, 420]];
  const lettres = ["A", "B", "C", "D"];
  let k = 0;
  const parts = places.map(([x, y], i) => {
    const ecart = i === bonne ? {} : faux[k++];
    const { dit, ...geo } = ecart;
    void dit;
    return `${pose(x, y, marque({ t, ...geo }))}
            ${lettre(x + t / 2, y + t + 48, lettres[i])}`;
  });
  return toile(parts.join(""), c);
};

const VRAILOGO = [
  [0, [FAUX[0], FAUX[2], FAUX[4]]],
  [1, [FAUX[1], FAUX[3], FAUX[0]]],
  [2, [FAUX[2], FAUX[4], FAUX[1]]],
  [3, [FAUX[3], FAUX[0], FAUX[2]]],
  [1, [FAUX[4], FAUX[2], FAUX[3]]],
  [2, [FAUX[0], FAUX[1], FAUX[4]]],
  [0, [FAUX[3], FAUX[1], FAUX[2]]],
  [3, [FAUX[4], FAUX[0], FAUX[1]]],
].map(([bonne, faux]) => ({
  fam: "dessin",
  q: "Un seul est le vrai logo. Lequel ?",
  svg: quatreLogos(bonne, faux),
  r: `${["A", "B", "C", "D"][bonne]}. Les trois autres ont ${faux.map((f) => f.dit).join(", ")}. Un écart de quelques dixièmes de millimètre suffit à faire sentir qu'un logo est « presque » — c'est pour ça qu'une charte fixe les valeurs au lieu de les décrire.`,
}));

/* ------------------------------------------------------------------ */
/* 7. Lequel est le plus grand ? (Ebbinghaus)                          */
/* ------------------------------------------------------------------ */

/**
 * Ebbinghaus : deux symboles identiques, deux voisinages opposés.
 *
 * La première version posait les deux grappes côte à côte sur une toile
 * carrée de 720. Avec des voisins de 170 à un rayon de 185, la grappe de
 * gauche s'étendait jusqu'à x = 450 et celle de droite commençait à 387 :
 * **elles se recouvraient**, et le symbole central disparaissait sous ses
 * propres voisins. L'illusion ne pouvait pas se produire. Vu sur la
 * planche-contact, pas dans le code.
 *
 * La toile est donc large, et les rayons satisfont deux inégalités : le
 * voisin ne doit ni mordre le centre (rayon - voisin/2 > centre/2) ni sortir
 * de sa moitié (rayon + voisin/2 < demi-largeur).
 */
const ebbinghaus = (grosVoisin, petitVoisin) => {
  const t = 110;
  const anneau = (cx, cy, taille, nb, rayon) =>
    Array.from({ length: nb }, (_, i) => {
      const a = (i / nb) * Math.PI * 2;
      return pose(cx + Math.cos(a) * rayon - taille / 2, cy + Math.sin(a) * rayon - taille / 2,
        marque({ t: taille, sourire: false }));
    }).join("");
  return toile(`
    ${anneau(235, 215, grosVoisin, 6, 158)}
    ${pose(235 - t / 2, 215 - t / 2, marque({ t }))}
    ${lettre(235, 455, "A")}
    ${anneau(705, 215, petitVoisin, 7, 110)}
    ${pose(705 - t / 2, 215 - t / 2, marque({ t }))}
    ${lettre(705, 455, "B")}
  `, 940, 480);
};

const TAILLES = [
  [110, 46], [104, 40], [116, 50], [100, 44],
].map(([g, p]) => ({
  fam: "dessin",
  q: "Lequel des deux symboles est le plus grand, A ou B ?",
  svg: ebbinghaus(g, p),
  r: "Ni l'un ni l'autre : ils sont identiques, au pixel près. Ce sont leurs voisins qui changent. C'est pour ça qu'un logo doit être validé dans son vrai contexte, jamais seul sur une page blanche.",
}));

/* ------------------------------------------------------------------ */
/* 8. Quelle ligne est la plus longue ? (Müller-Lyer)                  */
/* ------------------------------------------------------------------ */

const mullerLyer = (ouverture, longueur) => {
  const c = 720;
  const y1 = 250;
  const y2 = 470;
  const x0 = (c - longueur) / 2;
  const patte = (x, y, sens, dedans) => {
    const d = sens * ouverture;
    return `<line x1="${x}" y1="${y}" x2="${x + (dedans ? d : -d)}" y2="${y - ouverture}"/>
            <line x1="${x}" y1="${y}" x2="${x + (dedans ? d : -d)}" y2="${y + ouverture}"/>`;
  };
  return toile(`
    <g stroke="currentColor" stroke-width="6" stroke-linecap="round">
      <line x1="${x0}" y1="${y1}" x2="${x0 + longueur}" y2="${y1}"/>
      ${patte(x0, y1, 1, true)}${patte(x0 + longueur, y1, -1, true)}
      <line x1="${x0}" y1="${y2}" x2="${x0 + longueur}" y2="${y2}"/>
      ${patte(x0, y2, 1, false)}${patte(x0 + longueur, y2, -1, false)}
    </g>
    ${lettre(x0 - 46, y1 + 14, "A")}
    ${lettre(x0 - 46, y2 + 14, "B")}
  `);
};

const LONGUEURS = [
  [52, 480], [64, 420], [44, 520], [58, 450],
].map(([o, l]) => ({
  fam: "dessin",
  q: "Quelle ligne est la plus longue, A ou B ?",
  svg: mullerLyer(o, l),
  r: "Elles font exactement la même longueur. Ce sont les pointes qui trompent : l'oeil mesure l'encombrement, pas le trait. Mêmes causes quand un bloc de texte paraît plus large qu'un autre de même largeur.",
}));

export const DESSINS = [
  ...CARRES, ...SOURIRES, ...INTRUS, ...COULEURS,
  ...PARALLELES, ...VRAILOGO, ...TAILLES, ...LONGUEURS,
];
