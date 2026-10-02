/**
 * Le logotype du studio.
 *
 * Troisième version, et la première qui ne soit pas de mon invention : elle
 * applique la planche de marque « Concept 16 — Chaleur néo-minimaliste »
 * fournie par le client.
 *
 * Ce qu'elle pose :
 *
 * - **un symbole** — un carré aux angles très arrondis contenant un sourire —
 *   tracé au filet, dans l'accent terre ;
 * - **un mot-symbole** en capitales, sur deux lignes, en Inter.
 *
 * Trois décisions de mise en œuvre, toutes dictées par l'usage réel :
 *
 * 1. **Le symbole est un SVG en ligne, pas un fichier image.** Il suit donc
 *    `currentColor` et les tokens, ce qui lui permet de basculer seul en thème
 *    sombre et sur fond d'encre, sans qu'aucune variante soit à maintenir.
 * 2. **Plus de police dédiée au logo.** Les versions précédentes chargeaient
 *    un sous-ensemble d'Outfit pour six lettres. La planche demandant Inter
 *    pour tout le site, le mot-symbole est composé dans la police que la page
 *    charge déjà : mille kilo-octets d'économie deviennent un fichier de moins
 *    à régénérer quand le nom change.
 * 3. **Le mot-symbole est sur deux lignes**, comme le verrouillage principal
 *    de la planche. Sur une seule, « STUDIO SENTIS » en capitales espacées
 *    occupe deux cent quarante pixels dans un en-tête qui en fait mille deux
 *    cents : il écrase la navigation.
 *
 * Pour changer de marque plus tard, il n'y a toujours que ce fichier à
 * toucher : les trois endroits où le nom apparaît — en-tête, tiroir mobile,
 * pied de page — passent tous par ici.
 */

/**
 * Le symbole seul.
 *
 * Le sourire est une courbe cubique et non un arc de cercle : un demi-cercle
 * exact donne une bouche trop ouverte, qui lit comme un émoticône. Les deux
 * points de contrôle descendent plus qu'ils ne s'écartent, ce qui aplatit le
 * fond de la courbe et relève ses extrémités — c'est le dessin de la planche.
 */
export function Symbole({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      className={className}
      // `vectorEffect` non : à ces tailles le filet doit grossir avec le
      // symbole, sinon il devient un cheveu sur l'enseigne et un trait épais
      // sur le favicon.
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="2.1"
        y="2.1"
        width="35.8"
        height="35.8"
        rx="11.4"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M12.8 18.2 C 14.2 25.6, 25.8 25.6, 27.2 18.2"
        stroke="currentColor"
        strokeWidth="2.2"
      />
    </svg>
  );
}

export function Logotype({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[0.55em] ${className ?? ""}`}>
      <Symbole className="text-signal-aa size-[2.1em] shrink-0" />
      {/* `leading-[0.98]` : deux lignes de capitales n'ont ni jambage ni
          hampe, donc l'interligne normal y creuse un trou que l'œil lit comme
          une séparation entre deux mots sans rapport. */}
      <span className="block text-[0.52em] leading-[0.98] font-bold tracking-[0.07em] uppercase">
        <span className="block">Studio</span>
        <span className="block">Sentis</span>
      </span>
    </span>
  );
}
