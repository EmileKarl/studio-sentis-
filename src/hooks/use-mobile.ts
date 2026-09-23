import * as React from "react"

const MOBILE_BREAKPOINT = 768
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

/**
 * Réécrit par rapport à la version livrée par shadcn, qui appelait setState
 * directement dans un effet : cela déclenche un rendu en cascade, et le hook
 * rendait « false » au premier passage avant de basculer — un flash de mise en
 * page sur mobile.
 *
 * useSyncExternalStore s'abonne à la media query sans état local : le rendu
 * serveur reçoit « false » explicitement, le client lit la valeur réelle dès
 * le premier rendu, et React garde les deux cohérents.
 */
function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}
