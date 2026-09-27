/**
 * Le logotype du studio.
 *
 * C'est un logotype, pas un symbole : le nom lui-même, dans la serif du site,
 * avec « Sentis » souligné d'un trait vermillon — le geste du crayon qui
 * marque ce qui compte. Aucun fichier image, aucune police supplémentaire :
 * la marque est faite de ce que la page charge déjà.
 *
 * Le trait est dessiné avec `box-shadow: inset` plutôt qu'avec
 * `text-decoration` ou une bordure :
 *
 * - `text-decoration: underline` passe sous la ligne de base et vient couper
 *   les jambages des lettres. Ici, le « S » majuscule et le « t » n'ont pas de
 *   descendante, mais la règle vaut pour tout le nom si le texte change.
 * - une bordure basse s'appliquerait à la boîte entière, donc aussi sous le
 *   mot « Studio », qui doit rester nu.
 *
 * `currentColor` pour le nom, token pour le trait : le logotype suit donc
 * automatiquement le thème clair, le thème sombre et le fond encre, sans
 * qu'aucune variante ait à être maintenue à part.
 *
 * Pour changer de marque plus tard, il n'y a que ce fichier à toucher : les
 * trois endroits où le nom apparaît (en-tête, tiroir mobile, pied de page)
 * passent tous par ici.
 */
export function Logotype({ className }: { className?: string }) {
  return (
    <span className={className}>
      Studio{" "}
      <span className="shadow-[inset_0_-0.12em_0_var(--signal)]">Sentis</span>
    </span>
  );
}
