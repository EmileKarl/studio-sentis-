import { policeLogo } from "@/lib/polices-marque";

/**
 * Le logotype du studio.
 *
 * Deuxième version. La première posait le nom dans la serif du site avec
 * « Sentis » souligné d'un trait vermillon. Le client l'a écartée au profit de
 * quelque chose de **plus simple, plus doux et plus futuriste** : le trait
 * était un geste de crayon, donc un signe d'atelier, quand il veut un signe de
 * studio numérique.
 *
 * Ce qui change, et pourquoi :
 *
 * - **Une géométrique, pas une serif.** Outfit est construite au compas : le
 *   « o », le « e » et le « s » sont des cercles à peine corrigés. C'est ce
 *   qui donne à la fois la douceur (aucun angle vif, aucune empattement) et le
 *   caractère contemporain. Une serif ne peut pas être « futuriste » sans se
 *   contredire.
 * - **Bas de casse.** Une capitale initiale annonce un nom propre ; le bas de
 *   casse intégral annonce une marque. C'est aussi ce qui allège le plus la
 *   silhouette du mot.
 * - **Graisse légère, approche ouverte.** Le poids 300 et l'interlettrage
 *   élargi laissent passer le fond entre les lettres. C'est le levier qui fait
 *   « soft » sans rien arrondir de plus.
 * - **Plus de trait, plus de couleur.** « Plus simple » veut dire un mot et
 *   rien d'autre. La hiérarchie est portée par la taille et par l'opacité du
 *   mot « studio », pas par un accent.
 *
 * **Coût : 1 088 octets.** La police est auto-hébergée et réduite à ses dix
 * glyphes — les lettres du nom et l'espace. Cette version de Next n'expose pas
 * l'option `text` du chargeur Google, qui aurait fait ce travail ; sans elle,
 * afficher six lettres coûtait un jeu latin complet, environ quinze
 * kilo-octets, et faisait sauter le budget de polices du projet
 * (`npm run verify:poids`). Ce n'est pas une dépense qu'un logo justifie.
 * Voir `src/fonts/README.md` pour la régénération et la licence.
 *
 * Pour changer de marque plus tard, il n'y a toujours que ce fichier à
 * toucher : les trois endroits où le nom apparaît — en-tête, tiroir mobile,
 * pied de page — passent tous par ici.
 */
export function Logotype({ className }: { className?: string }) {
  return (
    <span
      className={`${policeLogo.className} ${className ?? ""} inline-flex items-baseline gap-[0.35em] leading-none font-light lowercase`}
    >
      {/* `text-ink-muted` et non une opacité. Le contrôle navigateur a levé
          vingt constats sur un `opacity-55` : sa règle attrape tout texte sous
          90 % d'opacité, parce que c'est ainsi que se manifeste une animation
          d'entrée restée bloquée. Elle a raison sur le fond — une opacité
          arbitraire échappe aux barrières de contraste, qui mesurent des
          couleurs. Le token, lui, est mesuré : `npm run verify:teintes`
          vérifie qu'il tient 4,5:1 sur chaque fond du site. */}
      <span className="text-ink-muted text-[0.62em] tracking-[0.34em]">studio</span>
      <span className="tracking-[0.13em]">sentis</span>
    </span>
  );
}
