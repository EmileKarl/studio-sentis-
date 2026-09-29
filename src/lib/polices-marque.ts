import localFont from "next/font/local";

/**
 * La police du logotype, auto-hébergée et réduite à ses dix glyphes.
 *
 * `next/font/local` plutôt que `next/font/google` : cette version de Next
 * n'expose pas l'option `text` du chargeur Google, qui aurait permis de
 * demander un sous-ensemble. Sans elle, afficher six lettres coûtait un jeu
 * latin complet — environ quinze kilo-octets — et faisait sauter le budget de
 * polices du projet. Le fichier livré ici en fait mille quatre-vingt-huit.
 *
 * Voir `src/fonts/README.md` pour la commande de régénération et la licence.
 */
export const policeLogo = localFont({
  src: "../fonts/outfit-logo-300.woff2",
  weight: "300",
  style: "normal",
  display: "swap",
  // Le logotype est dans l'en-tête, donc au-dessus de la ligne de flottaison
  // sur toutes les pages : il vaut son préchargement.
  preload: true,
  // Repli aligné sur la sans du site, pour que la substitution pendant le
  // `swap` ne fasse pas sauter la mise en page de l'en-tête.
  fallback: ["var(--font-sans)", "system-ui", "sans-serif"],
  adjustFontFallback: false,
});
