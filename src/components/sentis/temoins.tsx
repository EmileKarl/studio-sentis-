import type { Dict } from "@/lib/i18n";
import { PLACES_LANCEMENT, PLACES_PRISES, RABAIS_LANCEMENT } from "@/lib/site";

/**
 * Les témoins des en-têtes : une promesse du studio, tenue en direct.
 *
 * Ils remplacent les nuages de points WebGL qui tournaient à côté des titres.
 * Un volume abstrait ne disait rien de la page qu'il ornait, coûtait une scène
 * 3D par page, et la « poussière » d'À propos était presque invisible. Chaque
 * témoin montre plutôt ce que la page promet, calculé au moment où on la lit :
 *
 *   À propos      une page de Cahier Canada datée d'aujourd'hui
 *   Services      le prix et la date de livraison si l'on commençait ce jour
 *   Réalisations  le prochain numéro servi, dans l'ordre d'arrivée
 *   Contact       l'heure à Châteauguay et la date limite de réponse
 *
 * **Rien au rendu serveur pour ce qui dépend de l'heure** — voir
 * `temoin-heure.ts`.
 *
 * **Un fichier par témoin, et ce n'est pas de la manie.** Réunis dans un seul
 * module client, ils étaient recopiés dans le paquet de chaque page ; et comme
 * chaque page précharge les autres par le menu, le visiteur téléchargeait les
 * quatre, quatre fois. Séparés, et importés **directement** par chaque page —
 * un fichier qui les ré-exporterait tous les ferait de nouveau voyager
 * ensemble —, chaque page n'emporte que le sien. Le ticket, qui ne dépend d'aucune heure,
 * reste ici, rendu au serveur, sans une ligne de JavaScript.
 */

/**
 * Réalisations : le ticket de file d'attente.
 *
 * Les places partent dans l'ordre d'arrivée, et c'est exactement ce que dit un
 * distributeur de numéros — à la boulangerie, à la SAAQ, au comptoir. Le
 * numéro n'est pas écrit à la main : il vaut `PLACES_PRISES + 1`.
 *
 * Il ne dépend d'aucune heure, donc il est rendu au serveur. Le seul
 * mouvement est sa sortie de la fente, une fois, au chargement, en CSS.
 */
export function TemoinTicket({
  ticket,
}: {
  ticket: Dict["pages"]["realisations"]["ticket"];
}) {
  const complet = PLACES_PRISES >= PLACES_LANCEMENT;
  const numero = String(PLACES_PRISES + 1).padStart(2, "0");

  return (
    <div className="w-[15rem] sm:w-[16rem]">
      {/* La fente du distributeur. Le ticket en sort par-dessous ; le
          conteneur coupe ce qui est encore dans la machine. */}
      <div aria-hidden className="bg-ink relative z-10 mx-[-0.75rem] h-2.5 rounded-full" />
      <div className="overflow-hidden px-1 pb-6">
        <div className="temoin-objet ticket-encoches ticket-sortie bg-accent-violet text-accent-contrast rounded-b-md px-6 pt-5 pb-6">
          {complet ? (
            <p className="font-display py-6 text-xl font-semibold text-balance">
              {ticket.complet}
            </p>
          ) : (
            <>
              <p className="text-xs font-medium">{ticket.libelle}</p>
              <p className="font-display mt-1 flex items-baseline gap-2 font-semibold tabular-nums">
                <span className="text-7xl leading-none tracking-tight">{numero}</span>
                <span className="text-sm font-medium">
                  {ticket.sur} {PLACES_LANCEMENT}
                </span>
              </p>
              {/* La perforation, à la hauteur des encoches. */}
              <div
                aria-hidden
                className="border-accent-contrast/50 mx-[-1.5rem] mt-5 mb-4 border-t-2 border-dashed"
              />
              <p className="font-display text-2xl leading-none font-semibold tabular-nums">
                −{RABAIS_LANCEMENT}&nbsp;%
              </p>
              <p className="mt-1.5 text-sm">{ticket.rabais}</p>
              <p className="mt-3 text-xs font-medium">{ticket.ordre}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
