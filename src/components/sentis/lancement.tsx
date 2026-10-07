import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CompteARebours } from "@/components/sentis/compte-a-rebours";
import { Carte3D, Couche3D } from "@/components/motion/carte-3d";
import { Entree } from "@/components/motion/entree";
import { TexteProgressif } from "@/components/motion/texte-progressif";
import { Section, Zone } from "@/components/sentis/parts";
import { Button } from "@/components/ui/button";
import type { Dict, Locale } from "@/lib/i18n";
import { FIN_OFFRE, PLACES_LANCEMENT, PLACES_PRISES } from "@/lib/site";

/**
 * La page Réalisations d'un studio qui n'a pas encore de réalisations.
 *
 * Le raisonnement du client est juste : une page « Réalisations » qui ne montre
 * aucune réalisation est plus crédible qu'une page qui en invente, parce que
 * tout le monde reconnaît une maquette de studio qui commence.
 *
 * **C'est une promotion, pas un concours.** La distinction n'est pas de style :
 * au Québec, un concours publicitaire — tirage, hasard, prix à gagner — relève
 * de la Régie des alcools, des courses et des jeux, avec déclaration, droits à
 * payer et règlement à publier au-delà d'un certain montant. Un rabais accordé
 * dans l'ordre d'arrivée n'est rien de tout cela. Les conditions le disent
 * explicitement, pour qu'aucun visiteur ne croie participer à un tirage.
 *
 * ---
 *
 * **Sixième version.** La cinquième montrait la grille du portfolio avant
 * les projets : un grand cadre 01 et neuf cadres en pointillé. Le client l'a
 * jugée trop grande pour ce qu'elle disait, et il avait raison : le ticket de
 * l'en-tête dit déjà « 01 sur 10, −25 %, dans l'ordre d'arrivée ». Restent le
 * constat en grand, l'échange et ses conditions, écrites en entier parce
 * qu'une offre dont les limites se cachent est exactement ce que ce studio dit
 * ne pas faire.
 */
export function Lancement({ dict, locale }: { dict: Dict; locale: Locale }) {
  const p = dict.pages.realisations;
  const o = p.offre;
  const cadres = p.cadres;

  const complet = PLACES_PRISES >= PLACES_LANCEMENT;
  const prochain = PLACES_PRISES + 1;
  const numeroProchain = String(prochain).padStart(2, "0");

  // `timeZone` explicite, et ce n'est pas de la prudence gratuite : sans lui,
  // le 31 décembre 23 h 59 heure de l'Est s'affichait « 1 janvier » parce que
  // la page est construite sur un serveur en UTC.
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

  // Le vert pour ce qui est donné, le sienna pour ce qui est demandé : deux
  // teintes opposées sur le cercle du livre, ce qui est le rapport exact entre
  // les deux listes. Elles tiennent dans les puces ; les tuiles, elles, sont
  // blanches — plus de lavis de couleur sur le site (demande du client,
  // 2026-10-05). Classes écrites en entier : Tailwind ne génère pas une
  // classe qu'il ne voit pas écrite dans le source.
  const faces = [
    {
      bloc: o.jeDonne,
      fond: "bg-surface border-rule border",
      puce: "marker:text-accent-vert",
    },
    {
      bloc: o.jeDemande,
      fond: "bg-surface border-rule border",
      puce: "marker:text-accent-violet",
    },
  ];

  return (
    <>
      {/* Le constat, en grand, sur le papier nu. Les cadres numérotés qui
          l'accompagnaient ont été retirés à la demande du client : ils
          prenaient la moitié de la page pour redire ce que le ticket de
          l'en-tête dit déjà — dix places, la première libre. Le constat
          garde son effet validé, une ligne allumée à la fois au défilement,
          mais à la taille d'un énoncé et non d'un paragraphe. */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <h2 className="font-display text-ink text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:col-span-4">
            {p.vide.titre}
          </h2>
          <div className="min-w-0 lg:col-span-8">
            <TexteProgressif
              texte={p.vide.corps.map((l) => [...l])}
              className="[&_p]:font-display [&_p]:first:mt-0 [&_p]:text-2xl [&_p]:leading-snug [&_p]:font-semibold [&_p]:tracking-tight sm:[&_p]:text-3xl"
            />
            {complet ? null : (
              <Button
                asChild
                size="lg"
                className="mt-10 rounded-md text-base active:translate-y-px"
              >
                <Link href={`/${locale}/contact`}>
                  {cadres.cta} {numeroProchain} <ArrowRight aria-hidden />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </Section>

      {/* L'échange, en deux volumes, puis les conditions en entier. Un rabais
          de 25 % sans sa contrepartie écrite ressemble à une vitrine ; une
          contrepartie reléguée en petit ressemble à une clause qu'on espère
          non lue. */}
      <Section titre={o.titre} chapo={o.corps}>
        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {faces.map((face, i) => (
            <Entree key={face.bloc.titre} delai={i * 70} className="h-full">
              <Carte3D
                className={`${face.fond} h-full rounded-2xl p-6 sm:p-8`}
              >
                <Couche3D z={40}>
                  <h3 className="font-display text-ink text-xl font-semibold text-balance">
                    {face.bloc.titre}
                  </h3>
                </Couche3D>
                <ul
                  className={`text-ink-secondary mt-4 list-disc space-y-2.5 pl-5 leading-relaxed [transform:translateZ(10px)] ${face.puce}`}
                >
                  {face.bloc.items.map((item) => (
                    <li key={item} className="text-pretty">
                      {item}
                    </li>
                  ))}
                </ul>
              </Carte3D>
            </Entree>
          ))}
        </div>

        {/* Les conditions : un titre court en gras, une ligne. Le titre suffit
            à savoir si la ligne concerne, et l'ensemble se lit de biais. Pas
            de numéros : leur ordre ne porte aucune information. */}
        <div className="border-rule mt-14 border-t pt-10 sm:mt-16">
          <h3 className="font-display text-ink text-xl font-semibold tracking-tight">
            {o.conditions.titre}
          </h3>
          <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
            {o.conditions.items.map((item) => (
              <div key={item.cle}>
                <dt className="text-ink text-sm font-semibold">{item.cle}</dt>
                <dd className="text-ink-secondary mt-1 text-sm leading-relaxed text-pretty">
                  {item.texte}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10">
            <CompteARebours dict={dict} />
            {dateFin ? (
              <p className="text-ink-muted mt-3 text-sm">
                <time dateTime={FIN_OFFRE}>{dateFin}</time>
              </p>
            ) : null}
          </div>
        </div>
      </Section>

      {/* La page se ferme sur l'encre, comme Services et À propos. */}
      <section className="bg-ink py-20 sm:py-24">
        <Zone>
          <h2 className="font-display text-paper max-w-[20ch] text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {o.finTitre}
          </h2>
          <p className="text-paper/70 mt-4 max-w-(--content-max) text-lg leading-relaxed text-pretty">
            {o.ctaNote}
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="bg-paper text-ink hover:bg-paper/90 rounded-md text-base active:translate-y-px"
            >
              <Link href={`/${locale}/contact`}>
                {complet ? dict.nav.soumission : `${cadres.cta} ${numeroProchain}`}{" "}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </Zone>
      </section>
    </>
  );
}
