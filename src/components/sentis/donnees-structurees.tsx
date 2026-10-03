/**
 * Rendu d'un bloc JSON-LD.
 *
 * Un seul endroit sérialise les données structurées du site, pour que la
 * façon dont elles sont injectées — et la raison pour laquelle c'est sans
 * danger ici — soit écrite une fois.
 */
export function DonneesStructurees({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Le contenu vient du dictionnaire du site et de `src/lib/site.ts`,
      // jamais d'une saisie de visiteur : rien d'externe ne transite par ici.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
