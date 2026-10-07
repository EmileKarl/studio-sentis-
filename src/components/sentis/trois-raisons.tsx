import { ArrowDown, ArrowRight } from "lucide-react";

import { Entree } from "@/components/motion/entree";
import { Section } from "@/components/sentis/parts";
import type { Dict } from "@/lib/i18n";

/**
 * Trois raisons de repousser un projet web, et ce que le studio y répond.
 *
 * La version précédente posait les trois objections dans trois cartes égales
 * sur un lavis bleu — le gabarit « trois colonnes icône-titre-texte » que tout
 * site d'agence reproduit, et un fond de couleur que le client ne voulait
 * plus. Surtout, elle s'arrêtait à l'objection : la réponse vivait dans le
 * dictionnaire (`reponse`) sans jamais être affichée sur la page.
 *
 * Chaque ligne met maintenant l'objection **en face** de sa réponse. L'œil lit
 * la phrase entendue cent fois, en gris, puis ce qui la règle, en noir. C'est
 * la promesse du studio dite dans le seul ordre qui convainc : d'abord le
 * problème du visiteur, dans ses mots, ensuite la réponse.
 */
export function TroisRaisons({ dict }: { dict: Dict }) {
  const objections = dict.probleme.items;
  const reponses = dict.reponse.items;

  return (
    <Section titre={dict.probleme.titre} chapo={dict.probleme.intro}>
      <ol className="border-rule border-t">
        {objections.map((objection, i) => {
          const reponse = reponses[i];
          return (
            <li key={objection.titre} className="border-rule border-b">
              <Entree delai={i * 70}>
                <div className="grid gap-5 py-9 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-12 lg:py-12">
                  <div>
                    <p className="font-display text-ink-muted text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl">
                      {objection.titre}
                    </p>
                    <p className="text-ink-muted mt-3 max-w-[48ch] leading-relaxed text-pretty">
                      {objection.corps}
                    </p>
                  </div>
                  <ArrowRight aria-hidden className="text-accent-bleu hidden size-8 lg:block" />
                  <ArrowDown aria-hidden className="text-accent-bleu size-6 lg:hidden" />
                  {reponse ? (
                    <div>
                      <p className="font-display text-ink text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl">
                        {reponse.titre}
                      </p>
                      <p className="text-ink-secondary mt-3 max-w-[48ch] leading-relaxed text-pretty">
                        {reponse.corps}
                      </p>
                    </div>
                  ) : null}
                </div>
              </Entree>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
