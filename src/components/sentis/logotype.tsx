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
 *   tracé au filet, dans le bleu électrique de la marque ;
 * - **un mot-symbole** en capitales, en Inter, sur une ligne dans l'en-tête
 *   et empilé là où la largeur manque.
 *
 * Quatre décisions de mise en œuvre, toutes dictées par l'usage réel :
 *
 * 1. **Le symbole est un SVG en ligne, pas un fichier image.** Il suit donc
 *    `currentColor` et les tokens, ce qui lui permet de basculer seul en thème
 *    sombre et sur fond d'encre, sans qu'aucune variante soit à maintenir.
 * 2. **Plus de police dédiée au logo.** Les versions précédentes chargeaient
 *    un sous-ensemble d'Outfit pour six lettres. La planche demandant Inter
 *    pour tout le site, le mot-symbole est composé dans la police que la page
 *    charge déjà : mille kilo-octets d'économie deviennent un fichier de moins
 *    à régénérer quand le nom change.
 3. **Le symbole est bleu, pas terre.** La planche le voulait dans son accent
 *    terracotta. Le client a demandé un bleu électrique, et le jeton
 *    `--signal` porte désormais le `Blue` de la combinaison 333 du livre de
 *    Sanzo Wada : #006eb8, saturation 100 %. Le gain n'est pas qu'esthétique —
 *    le terracotta ne tenait que 2,16:1 sur le papier et ne pouvait donc pas
 *    porter de trait fin ; ce bleu-là tient 4,93:1.
 * 4. **Le mot-symbole est sur une ligne dans l'en-tête.** Le verrouillage
 *    empilé de la planche y faisait une boîte plus haute que les liens de
 *    navigation et que le bouton : le logo flottait au-dessus d'une rangée
 *    dont il devrait faire partie. Les tailles sont réglées pour que
 *    l'ensemble tienne dans la même bande optique que le reste — c'est
 *    mesuré au navigateur, pas estimé.
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

export function Logotype({
  className,
  empile = false,
}: {
  className?: string;
  /**
   * Mot-symbole sur deux lignes, comme le verrouillage empilé de la planche.
   *
   * Par défaut il est **sur une seule ligne**. Les deux existent sur la
   * planche, mais dans un en-tête le verrouillage empilé est le mauvais choix :
   * deux lignes de capitales font une boîte plus haute que les liens de
   * navigation et que le bouton, et le logo se met à flotter au-dessus d'une
   * rangée dont il devrait faire partie. Sur une ligne, l'ensemble tient dans
   * la même bande optique que le reste de l'en-tête.
   *
   * L'empilé reste disponible pour les surfaces où la largeur manque — une
   * colonne étroite de pied de page, un carré — et c'est là qu'il sert.
   */
  empile?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-[0.45em] ${className ?? ""}`}>
      {/* Le symbole est dimensionné en `em`, donc il suit la taille du texte
          qui l'accompagne : une seule valeur à régler pour que le verrouillage
          grandisse ou rétrécisse d'un bloc. */}
      {/* `text-signal` et non `text-signal-aa` : le symbole porte le **bleu du
          livre tel quel** (#006eb8, saturation 100 %), pas sa version
          assombrie pour le texte courant. C'est le bleu électrique demandé, et
          il n'a pas à être adouci : mesuré, il donne 4,93:1 sur le papier et
          5,40:1 sur l'encre du thème sombre, au-dessus du plancher dans les
          deux cas. Le jeton bascule seul d'un thème à l'autre ; aucune
          variante du logo à maintenir. */}
      <Symbole className="text-signal size-[1.55em] shrink-0" />
      <span
        className={
          empile
            ? // `leading-[0.98]` : deux lignes de capitales n'ont ni jambage ni
              // hampe, donc l'interligne normal y creuse un trou que l'œil lit
              // comme une séparation entre deux mots sans rapport.
              "block text-[0.56em] leading-[0.98] font-bold tracking-[0.07em] uppercase"
            : "block text-[0.78em] leading-none font-bold tracking-[0.055em] uppercase whitespace-nowrap"
        }
      >
        <span className={empile ? "block" : undefined}>Studio</span>
        {empile ? null : " "}
        <span className={empile ? "block" : undefined}>Sentis</span>
      </span>
    </span>
  );
}
