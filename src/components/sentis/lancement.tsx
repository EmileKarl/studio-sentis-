import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CompteARebours } from "@/components/sentis/compte-a-rebours";
import { Reveal3D } from "@/components/motion";
import { TexteProgressif } from "@/components/motion/texte-progressif";
import { Section, Zone } from "@/components/sentis/parts";
import { Button } from "@/components/ui/button";
import type { Dict, Locale } from "@/lib/i18n";
import { FIN_OFFRE, PLACES_LANCEMENT, RABAIS_LANCEMENT } from "@/lib/site";

/**
 * La page Réalisations d'un studio qui n'a pas encore de réalisations.
 *
 * Elle remplace trois démonstrations présentées comme des pièces de
 * portfolio. Le raisonnement du client est juste : une page « Réalisations »
 * qui ne montre aucune réalisation est plus crédible qu'une page qui en
 * invente, parce que tout le monde reconnaît une maquette de studio qui
 * commence.
 *
 * Ce qui la remplace n'est pas un vide décoratif mais une offre, avec ses
 * conditions écrites en entier. Le manque devient l'argument : la page dit
 * pourquoi elle est vide, ce qu'il faut pour la remplir, et ce que ça vaut à
 * celui qui s'y met le premier.
 *
 * **C'est une promotion, pas un concours.** La distinction n'est pas de style :
 * au Québec, un concours publicitaire — tirage, hasard, prix à gagner — relève
 * de la Régie des alcools, des courses et des jeux, avec déclaration, droits à
 * payer et règlement à publier au-delà d'un certain montant. Un rabais accordé
 * dans l'ordre d'arrivée n'est rien de tout cela. Les conditions le disent
 * explicitement, pour qu'aucun visiteur ne croie participer à un tirage.
 */
export function Lancement({ dict, locale }: { dict: Dict; locale: Locale }) {
  const p = dict.pages.realisations;
  const o = p.offre;

  // Affichée une seule fois, en clair, hors du bloc qui défile : c'est ce que
  // lira un lecteur d'écran, et c'est ce qui engage le studio.
  // `timeZone` explicite, et ce n'est pas de la prudence gratuite : sans lui,
  // le 31 décembre 23 h 59 heure de l'Est s'affichait « 1 janvier » parce que
  // la page est construite sur un serveur en UTC. Le projet avait déjà corrigé
  // exactement ce défaut sur la date des pages légales ; il est revenu ici, sur
  // la seule page du site qui promet une échéance.
  const dateFin = FIN_OFFRE
    ? new Date(FIN_OFFRE).toLocaleDateString(
        locale === "en" ? "en-CA" : "fr-CA",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "America/Toronto",
        },
      )
    : null;

  return (
    <>
      <Section>
        <div className="max-w-(--content-max)">
          <h2 className="font-display text-ink text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            {p.vide.titre}
          </h2>
          {/* Les trois paragraphes s'allument mot à mot au défilement. C'est
              l'argument central de la page — pourquoi elle est vide — et il
              doit être lu jusqu'au bout ; voir `TexteProgressif` pour ce que
              cela implique en contraste. */}
          <TexteProgressif texte={[...p.vide.corps]} />
        </div>
      </Section>

      <Section tone="violet">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
              {o.surtitre}
            </p>
            <h2 className="font-display text-ink mt-4 max-w-[16ch] text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
              {o.titre}
            </h2>
            <p className="text-ink-secondary mt-5 max-w-(--content-max) text-lg leading-relaxed text-pretty">
              {o.corps}
            </p>

            {/* Les deux chiffres qui portent l'offre, sortis du texte courant :
                ce sont eux qu'on retient, et ce sont eux qui doivent tenir sur
                une capture d'écran envoyée à un associé. */}
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <dt className="text-ink-muted text-sm">{o.libelleRabais}</dt>
                <dd className="font-display text-accent-violet text-4xl font-semibold tabular-nums">
                  −{RABAIS_LANCEMENT}&nbsp;%
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted text-sm">{o.libellePlaces}</dt>
                <dd className="font-display text-ink text-4xl font-semibold tabular-nums">
                  {PLACES_LANCEMENT}
                </dd>
              </div>
            </dl>

            <div className="mt-10">
              <CompteARebours dict={dict} />
              {dateFin ? (
                <p className="text-ink-muted mt-3 text-sm">
                  <time dateTime={FIN_OFFRE}>{dateFin}</time>
                </p>
              ) : null}
            </div>

            <div className="mt-10">
              <Button asChild size="lg" className="rounded-md text-base">
                <Link href={`/${locale}/contact`}>
                  {o.cta} <ArrowRight aria-hidden />
                </Link>
              </Button>
              <p className="text-ink-secondary mt-4 max-w-(--content-max) text-sm leading-relaxed">
                {o.ctaNote}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {[o.jeDonne, o.jeDemande].map((bloc, i) => (
              <Reveal3D
                key={bloc.titre}
                depuis={i === 0 ? "droite" : "bas"}
                distance={80}
                delay={i * 0.08}
                classeAnimee="bg-paper rounded-lg p-6 shadow-sm"
              >
                <>
                  <h3 className="font-display text-ink text-xl font-semibold text-balance">
                    {bloc.titre}
                  </h3>
                  <ul className="text-ink-secondary marker:text-accent-violet mt-4 list-disc space-y-2 pl-5 leading-relaxed">
                    {bloc.items.map((item) => (
                      <li key={item} className="text-pretty">
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              </Reveal3D>
            ))}
          </div>
        </div>
      </Section>

      {/* Les conditions ne sont pas repliées derrière un « voir les détails ».
          Une offre dont les limites se cachent est exactement ce que ce studio
          dit ne pas faire ailleurs sur le site. */}
      <section className="border-rule border-t py-16 sm:py-20">
        <Zone>
          <h2 className="font-display text-ink text-2xl font-semibold tracking-tight">
            {o.conditions.titre}
          </h2>
          <ol className="text-ink-secondary mt-6 max-w-(--content-max) list-decimal space-y-3 pl-5 leading-relaxed">
            {o.conditions.items.map((item) => (
              <li key={item} className="text-pretty">
                {item}
              </li>
            ))}
          </ol>
        </Zone>
      </section>
    </>
  );
}
