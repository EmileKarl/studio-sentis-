"use client";

import { useSyncExternalStore } from "react";

/**
 * L'heure, au client seulement.
 *
 * Les pages sont construites une fois puis servies des semaines : une date
 * calculée au build serait fausse dès le lendemain. Le premier rendu reçoit
 * donc `null` et réserve la place ; l'heure n'arrive qu'au client.
 * `useSyncExternalStore` plutôt qu'un effet qui appelle `setState` : le projet
 * a déjà payé l'erreur d'hydratation #418 pour ce motif.
 */
/** Abonnement à l'heure : un battement par minute suffit, rien n'affiche de secondes. */
function abonner(rappel: () => void) {
  const id = setInterval(rappel, 15_000);
  return () => clearInterval(id);
}
/** L'instant arrondi à la minute : stable entre deux battements, donc sans
 *  rendu inutile — `useSyncExternalStore` exige un instantané stable. */
const lireMinute = () => Math.floor(Date.now() / 60_000) * 60_000;
const rienAuServeur = () => null;

export function useMinute(): number | null {
  return useSyncExternalStore(abonner, lireMinute, rienAuServeur);
}
