/**
 * Règles de spéculation : la page suivante est prête avant le clic.
 *
 * `next/link` préchargeait déjà la **charge utile React** des pages visibles.
 * Ce n'est pas la même chose qu'un rendu : au clic, le navigateur devait encore
 * construire la page. Les règles de spéculation lui demandent de la **rendre
 * entièrement** à l'avance, dans un onglet caché, si bien que le clic n'a plus
 * qu'à révéler un document déjà peint.
 *
 * `eagerness: "moderate"` et non `"eager"`, et c'est le cœur de l'arbitrage :
 *
 * - `eager` rendrait les cinq pages dès l'arrivée. Sur un forfait mobile, c'est
 *   faire télécharger et exécuter cinq pages à quelqu'un qui n'en lira
 *   peut-être qu'une. Un studio qui vend des sites légers ne peut pas se le
 *   permettre en première page ;
 * - `moderate` attend le survol ou l'appui prolongé — un geste d'intention. Le
 *   rendu part deux à trois cents millisecondes avant le clic, ce qui suffit
 *   pour un site statique de cette taille.
 *
 * Le navigateur garde la main : il ignore ces règles s'il manque de mémoire, si
 * la connexion est mesurée, ou si le visiteur a activé l'économiseur de
 * données. Les navigateurs qui ne les connaissent pas ignorent la balise.
 *
 * Aucune requête ne sort du domaine : les règles ne visent que les pages de ce
 * site, ce qui est cohérent avec la politique de confidentialité.
 */
export function PreNavigation({ locale }: { locale: string }) {
  const regles = {
    prerender: [
      {
        where: {
          href_matches: `/${locale}/*`,
        },
        eagerness: "moderate",
      },
    ],
  };

  return (
    <script
      type="speculationrules"
      // Contenu statique construit ici même, jamais d'une saisie externe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(regles) }}
    />
  );
}
