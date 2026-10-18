import type { ReactNode } from "react";

/**
 * Transition de page, en profondeur.
 *
 * `template.tsx` est remonté à chaque navigation, contrairement à
 * `layout.tsx` : c'est ce qui permet de rejouer l'animation à chaque page.
 *
 * **Ce fichier n'a plus de JavaScript**, et c'est tout l'intérêt. Sa version
 * précédente pilotait l'animation avec Motion ; comme ce composant est monté
 * sur toutes les pages, c'est lui qui faisait entrer la bibliothèque
 * d'animation dans les mentions légales, une page qui n'anime rien.
 *
 * Trois précautions, qui tenaient en trente lignes de JavaScript et tiennent
 * maintenant dans la règle CSS, dans `scroll-driven.css` :
 *
 * 1. **Rien d'invisible dans le HTML livré.** L'ancienne version devait
 *    attendre l'hydratation pour ne pas poser `opacity: 0` au rendu serveur —
 *    sans quoi un visiteur sans JavaScript voyait une page vide. Une
 *    animation CSS ne se déclenche que si le navigateur la joue : sans
 *    JavaScript, la page s'affiche telle quelle.
 * 2. **Aucune transformation résiduelle**, grâce à `backwards`. Un
 *    `transform` restant ferait de cet élément le bloc conteneur de ses
 *    descendants positionnés, et les séquences horizontales, qui tiennent sur
 *    `position: sticky`, ne colleraient plus.
 * 3. **`prefers-reduced-motion` coupe tout**, dans la même feuille.
 *
 * 240 ms, pas davantage : une transition de page se paie à chaque clic et ne
 * s'admire qu'une fois.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="transition-page">
      <div>{children}</div>
    </div>
  );
}
