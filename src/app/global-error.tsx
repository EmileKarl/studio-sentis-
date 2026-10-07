"use client";

/**
 * Le dernier filet : une erreur dans la mise en page racine elle-même.
 *
 * `error.tsx` ne rattrape que ce qui casse **sous** une mise en page. Si c'est
 * la racine qui lève — un fournisseur de thème, la police, le script
 * d'hydratation — il ne s'affiche jamais, et le visiteur reçoit la page
 * d'erreur par défaut de Next : en production, un écran blanc portant
 * « Application error: a client-side exception has occurred ». C'est le pire
 * message possible, parce qu'il ne dit rien au visiteur et ne propose rien.
 *
 * Ce composant remplace la racine entière, d'où le `<html>` et le `<body>` :
 * il n'y a plus de mise en page au-dessus de lui pour les fournir.
 *
 * **Aucune dépendance au reste du site, et c'est délibéré.** Pas de jetons de
 * couleur, pas de police de marque, pas de composant partagé, pas de
 * dictionnaire : tout cela vient de la racine, c'est-à-dire exactement de ce
 * qui vient de casser. Les styles sont écrits en ligne pour que cette page
 * s'affiche même si la feuille de style ne s'est pas chargée. Elle est bilingue
 * parce qu'à ce niveau la langue du visiteur n'est plus connue.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: "2rem 1.25rem",
          background: "#f8f5f2",
          color: "#1a1a1a",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          lineHeight: 1.6,
        }}
      >
        <main style={{ maxWidth: "46ch" }}>
          <p
            style={{
              margin: 0,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "0.8rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#595755",
            }}
          >
            Erreur
          </p>
          <h1
            style={{
              margin: "0.75rem 0 0",
              fontSize: "1.75rem",
              lineHeight: 1.2,
              letterSpacing: "-0.022em",
            }}
          >
            Quelque chose s&apos;est cassé de notre côté
          </h1>
          <p style={{ margin: "0.75rem 0 0", color: "#3d3c3a" }}>
            Ce n&apos;est pas vous. Réessayez — et si ça recommence, écrivez-moi,
            je veux le savoir.
          </p>
          <p style={{ margin: "0.5rem 0 0", color: "#3d3c3a" }} lang="en">
            Something broke on our side. It isn&apos;t you. Try again — and if it
            happens twice, write to me, I want to know.
          </p>

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                border: 0,
                borderRadius: "0.5rem",
                padding: "0.7rem 1.1rem",
                font: "inherit",
                fontWeight: 600,
                cursor: "pointer",
                background: "#1a1a1a",
                color: "#f8f5f2",
              }}
            >
              Réessayer / Try again
            </button>
            <a
              href="mailto:Emiletchesseu@gmail.com"
              style={{
                borderRadius: "0.5rem",
                padding: "0.7rem 1.1rem",
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid #b9b0a6",
                color: "#1a1a1a",
              }}
            >
              Écrire au studio
            </a>
          </div>

          {/* L'empreinte que Next attache à l'erreur. Elle ne dit rien au
              visiteur, mais c'est la seule chose qui permet de retrouver
              l'incident dans les journaux quand il l'envoie dans un courriel. */}
          {error.digest ? (
            <p
              style={{
                marginTop: "2rem",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: "0.75rem",
                color: "#595755",
              }}
            >
              Référence : {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
