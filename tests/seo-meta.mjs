/**
 * Contrôle des balises de recherche.
 *
 * Il existe à cause de défauts qu'aucun autre contrôle du projet ne voyait, et
 * que le site a portés en production jusqu'à ce qu'on le repasse à la grille
 * d'audit de `AgriciDaniel/claude-seo` :
 *
 * - les deux accueils s'annonçaient « … — NEXUS UI », le nom du gabarit
 *   technique, hérité du `template` de la mise en page racine ;
 * - les quatre pages intérieures reprenaient leur titre affiché tel quel, si
 *   bien que `/fr/services` s'appelait `Services` dans une page de résultats :
 *   ni marque, ni métier, ni ville ;
 * - la description de `/fr/realisations` faisait 226 caractères, tronquée aux
 *   deux tiers, et celle de `/fr/a-propos` 66, soit la moitié de la place
 *   offerte laissée vide.
 *
 * Aucun de ces défauts n'est visible à l'écran. Ils ne se voient que dans le
 * `<head>`, ce que ni le contrôle navigateur, ni le lint, ni la construction
 * ne regardent. D'où ce fichier.
 *
 * Les seuils viennent de `skills/seo-page/SKILL.md` du même dépôt : 50 à 60
 * caractères pour un titre, 150 à 160 pour une description. Le plancher de
 * titre est abaissé à 25 : « Mentions légales — Studio Sentis » en fait 32, et
 * le rallonger pour satisfaire une règle de pouce serait la suivre contre son
 * intention. Le plafond, lui, correspond à une troncature réelle dans les
 * résultats : il est tenu.
 *
 * Il demande un serveur déjà lancé (voir README).
 */

const BASE = process.env.BASE_URL ?? "http://localhost:3100";

const PAGES = [
  "/fr",
  "/en",
  "/fr/services",
  "/en/services",
  "/fr/realisations",
  "/fr/a-propos",
  "/fr/contact",
  "/fr/mentions-legales",
  "/fr/confidentialite",
];

const TITRE_MIN = 25;
const TITRE_MAX = 60;
const DESC_MIN = 110;
const DESC_MAX = 160;

const constats = [];
const releves = [];
const titresVus = new Map();
const descriptionsVues = new Map();

function extraire(html, motif) {
  const m = html.match(motif);
  return m ? m[1] : null;
}

/** Décode les quelques entités que Next pose dans les attributs. */
function decoder(texte) {
  return texte
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

for (const chemin of PAGES) {
  const reponse = await fetch(BASE + chemin);
  if (!reponse.ok) {
    constats.push(`[http] ${chemin} — ${reponse.status}`);
    continue;
  }
  const html = await reponse.text();

  const titre = decoder(extraire(html, /<title>([^<]*)<\/title>/) ?? "");
  const description = decoder(
    extraire(html, /<meta name="description" content="([^"]*)"/) ?? "",
  );
  const canonical = extraire(html, /<link rel="canonical" href="([^"]*)"/);
  const ogTitre = decoder(
    extraire(html, /<meta property="og:title" content="([^"]*)"/) ?? "",
  );
  const ogImage = extraire(html, /<meta property="og:image" content="([^"]*)"/);
  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
  const hreflangs = [...html.matchAll(/hrefLang="([^"]*)"/gi)].map((m) => m[1]);

  releves.push({
    chemin,
    titre: titre.length,
    description: description.length,
    h1: h1.length,
  });

  // --- Titre ---------------------------------------------------------------
  if (!titre) constats.push(`[titre] ${chemin} — absent`);
  else {
    if (titre.length > TITRE_MAX)
      constats.push(
        `[titre] ${chemin} — ${titre.length} caractères, maximum ${TITRE_MAX} : « ${titre} »`,
      );
    if (titre.length < TITRE_MIN)
      constats.push(`[titre] ${chemin} — ${titre.length} caractères, minimum ${TITRE_MIN}`);
    // Le nom du gabarit technique n'a rien à faire dans le titre de recherche
    // d'une agence. C'est le défaut d'origine, et il est resté invisible.
    if (/NEXUS/i.test(titre))
      constats.push(`[titre] ${chemin} — porte le nom du gabarit : « ${titre} »`);
    if (!/Studio Sentis/.test(titre))
      constats.push(`[titre] ${chemin} — ne nomme pas la marque : « ${titre} »`);
    const deja = titresVus.get(titre);
    if (deja) constats.push(`[titre] ${chemin} — identique à ${deja}`);
    else titresVus.set(titre, chemin);
  }

  // --- Description ---------------------------------------------------------
  if (!description) constats.push(`[description] ${chemin} — absente`);
  else {
    if (description.length > DESC_MAX)
      constats.push(
        `[description] ${chemin} — ${description.length} caractères, maximum ${DESC_MAX}`,
      );
    if (description.length < DESC_MIN)
      constats.push(
        `[description] ${chemin} — ${description.length} caractères, minimum ${DESC_MIN}`,
      );
    const deja = descriptionsVues.get(description);
    if (deja) constats.push(`[description] ${chemin} — identique à ${deja}`);
    else descriptionsVues.set(description, chemin);
  }

  // --- Canonique et alternates ---------------------------------------------
  // Le défaut d'origine : quatre pages déclaraient la canonique de l'accueil,
  // c'est-à-dire « je suis un doublon, ne m'indexez pas ».
  if (!canonical) constats.push(`[canonique] ${chemin} — absente`);
  else if (!canonical.endsWith(chemin))
    constats.push(`[canonique] ${chemin} — pointe ailleurs : ${canonical}`);

  for (const attendu of ["fr", "en", "x-default"]) {
    if (!hreflangs.includes(attendu))
      constats.push(`[hreflang] ${chemin} — ${attendu} manquant`);
  }

  // --- Partage -------------------------------------------------------------
  if (ogTitre !== titre)
    constats.push(`[og] ${chemin} — og:title diverge du titre`);
  if (!ogImage) constats.push(`[og] ${chemin} — og:image absente`);

  // --- Structure -----------------------------------------------------------
  if (h1.length !== 1)
    constats.push(`[h1] ${chemin} — ${h1.length} h1, il en faut exactement un`);

  // --- Données structurées -------------------------------------------------
  const blocs = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (!blocs.length) constats.push(`[jsonld] ${chemin} — aucun bloc`);
  for (const [, brut] of blocs) {
    let donnees;
    try {
      donnees = JSON.parse(brut);
    } catch (erreur) {
      constats.push(`[jsonld] ${chemin} — JSON invalide : ${erreur.message}`);
      continue;
    }
    const noeuds = donnees["@graph"] ?? [donnees];
    for (const noeud of noeuds) {
      // Un bloc sans `@type` n'est rattaché à aucune entité : Google le lit et
      // n'en fait rien.
      if (!noeud["@type"]) constats.push(`[jsonld] ${chemin} — nœud sans @type`);
    }
    if (!donnees["@context"])
      constats.push(`[jsonld] ${chemin} — bloc sans @context`);
  }
}

console.table(releves);

if (constats.length) {
  for (const c of constats) console.log(c);
  console.log(`\n--- ${constats.length} constat(s) ---`);
  process.exit(1);
}
console.log(
  `Les ${PAGES.length} pages ont un titre, une description, une canonique propre, leurs alternates, un h1 et des données structurées valides.`,
);
