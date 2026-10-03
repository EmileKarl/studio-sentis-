import { EnTetePage, Zone } from "@/components/sentis/parts";
import type { SectionLegale } from "@/lib/legal";
import { LEGAL_MAJ } from "@/lib/site";

/**
 * Mise en page commune aux deux pages légales.
 *
 * Quatre partis pris, tous pris contre l'habitude du reste du site :
 *
 * 1. **Aucune animation d'entrée.** Partout ailleurs, les blocs arrivent au
 *    défilement. Ici non. On vient sur une page légale pour vérifier un point
 *    précis, souvent parce qu'on hésite à faire confiance ; faire attendre le
 *    texte derrière une animation est, à cet endroit, exactement le mauvais
 *    signal. C'est aussi ce qui la rend imprimable et lisible sans JavaScript
 *    sans passer par le filet `data-entree-animee`.
 * 2. **Des sections numérotées, avec une ancre stable.** `#section-3` ne
 *    dépend ni de la langue ni du libellé : on peut citer un point de la
 *    politique dans un courriel, et le lien continuera de fonctionner après
 *    une reformulation.
 * 3. **Un sommaire collant à partir de `lg`.** Ce n'est pas un ornement, c'est
 *    une correction mesurée : à 1280 px, le conteneur du site fait 1216 px et
 *    la colonne de texte 464 px — 750 px de vide à droite, sur une page qui
 *    défile sur trois mille pixels. Toutes les autres pages remplissent cet
 *    espace avec une scène, une carte ou une colonne d'informations ; celle-ci
 *    n'en a aucune. Le sommaire y met la seule chose qui manquait vraiment à
 *    un document de treize sections : le moyen d'aller droit à la bonne.
 *    Ce sont des ancres nues : il fonctionne sans JavaScript.
 * 4. **Une colonne étroite.** 58 caractères, la mesure du reste du site. Un
 *    texte de loi sur toute la largeur d'un écran de bureau ne se lit pas, il
 *    se survole — et c'est précisément ce que ces pages ne doivent pas
 *    encourager.
 */
export function PageLegale({
  titre,
  chapo,
  sections,
  libelleMaj,
  libelleSommaire,
  locale,
  enTete,
}: {
  titre: string;
  chapo: string;
  sections: SectionLegale[];
  libelleMaj: string;
  libelleSommaire: string;
  locale: string;
  /** Bloc facultatif inséré avant les sections — la fiche d'identité. */
  enTete?: React.ReactNode;
}) {
  // Fuseau explicite : `LEGAL_MAJ` est une date sans heure, donc interprétée à
  // minuit UTC. Sans ce paramètre, un serveur à Montréal l'afficherait la
  // veille — une politique datée d'un jour avant sa révision, ce qui est le
  // genre de détail qu'on ne remarque qu'une fois qu'on nous l'a signalé.
  const dateLisible = new Date(`${LEGAL_MAJ}T00:00:00Z`).toLocaleDateString(
    locale === "en" ? "en-CA" : "fr-CA",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
  );

  return (
    <>
      <EnTetePage titre={titre} chapo={chapo} />

      <section className="py-16 sm:py-20">
        <Zone>
          {/* La colonne de texte est plafonnée à 36rem plutôt que laissée en
              `1fr` : sans ce plafond, elle occuperait 950 px dont seuls 464
              seraient remplis, et le sommaire se retrouverait séparé du texte
              par un demi-écran de vide — on aurait déplacé le trou, pas
              bouché. */}
          <div className="lg:grid lg:grid-cols-[minmax(0,36rem)_minmax(0,15rem)] lg:gap-x-16">
            <div>
              <p className="text-ink-muted text-sm">
                {libelleMaj}{" "}
                <time dateTime={LEGAL_MAJ} className="tabular-nums">
                  {dateLisible}
                </time>
              </p>

              {enTete ? <div className="mt-10">{enTete}</div> : null}

              <div className="mt-14 space-y-14">
                {sections.map((section, i) => (
                  <section
                    key={section.titre}
                    id={`section-${i + 1}`}
                    // `scroll-mt` : l'en-tête du site est fixe, donc une ancre
                    // atterrirait sinon avec son titre caché dessous.
                    className="grid scroll-mt-24 gap-3 md:grid-cols-[auto_1fr] md:gap-8"
                  >
                    <p className="text-ink-muted font-mono text-xs tracking-[0.2em] tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <div className="min-w-0">
                      <h2 className="font-display text-ink max-w-[26ch] text-2xl font-semibold tracking-tight text-balance">
                        {section.titre}
                      </h2>
                      {section.corps.map((paragraphe) => (
                        <p
                          key={paragraphe}
                          className="text-ink-secondary mt-4 max-w-(--content-max) leading-relaxed text-pretty"
                        >
                          {paragraphe}
                        </p>
                      ))}
                      {section.liste ? (
                        <ul className="text-ink-secondary marker:text-ink-muted mt-4 max-w-(--content-max) list-disc space-y-2 pl-5 leading-relaxed">
                          {section.liste.map((item) => (
                            <li key={item} className="text-pretty">
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            {/* Masqué sous `lg` : sur un téléphone, treize entrées avant le
                premier paragraphe repousseraient le texte d'un écran entier
                pour faire gagner un défilement. */}
            <nav
              aria-label={libelleSommaire}
              className="hidden lg:col-start-2 lg:row-start-1 lg:block"
            >
              <div className="border-rule sticky top-24 border-l pl-6">
                <h2 className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
                  {libelleSommaire}
                </h2>
                <ol className="mt-4 space-y-2">
                  {sections.map((section, i) => (
                    <li key={section.titre}>
                      <a
                        href={`#section-${i + 1}`}
                        className="text-ink-secondary hover:text-ink focus-visible:ring-signal inline-flex gap-3 rounded-sm text-sm leading-snug transition-colors focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <span className="text-ink-muted font-mono text-xs tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-pretty">{section.titre}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>
          </div>
        </Zone>
      </section>
    </>
  );
}
