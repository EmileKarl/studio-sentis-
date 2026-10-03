import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

/**
 * Les trois polices de la vitrine NEXUS.
 *
 * Elles étaient déclarées dans la mise en page racine, donc préchargées sur
 * **toutes** les pages du déploiement. Mesuré sur `/fr` : sept fichiers de
 * police pour 188 ko, dont la majorité pour des familles que le site de
 * l'agence n'affiche jamais — il compose en Fraunces et Source Sans 3.
 *
 * Les voici isolées, pour que seules les pages qui s'en servent les paient.
 * Un module partagé plutôt qu'une déclaration dans chaque mise en page :
 * `next/font` exige un appel au niveau du module, et deux appels distincts
 * produiraient deux jeux de classes pour les mêmes fichiers.
 */
export const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

export const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/** À poser sur l'élément qui enveloppe la vitrine. */
export const POLICES_NEXUS = `${archivo.variable} ${plexSans.variable} ${plexMono.variable}`;
