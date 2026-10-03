import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CompteARebours } from "@/components/sentis/compte-a-rebours";
import { Carte3D, Couche3D } from "@/components/motion/carte-3d";
import { Entree } from "@/components/motion/entree";
import { TexteProgressif } from "@/components/motion/texte-progressif";
import { PlacesLancement } from "@/components/sentis/places-lancement";
import { Section, Zone } from "@/components/sentis/parts";
import { Button } from "@/components/ui/button";
import type { Dict, Locale } from "@/lib/i18n";
import { FIN_OFFRE, RABAIS_LANCEMENT } from "@/lib/site";

/**
 * La page Réalisations d'un studio qui n'a pas encore de réalisations.
 *
 * Le raisonnement du client est juste : une page « Réalisations » qui ne montre
 * aucune réalisation est plus crédible qu'une page qui en invente, parce que
 * tout le monde reconnaît une maquette de studio qui commence. Ce qui la
 * remplace n'est pas un vide décoratif mais une offre, avec ses conditions
 * écrites en entier.
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
 * **Quatrième version, et c'est une coupe.** Mesuré sur la précédente :
 * **459 mots sur 3 673 px**, vingt et un blocs de texte courant. Le client a
 * nommé le défaut en un mot — « comme un blog ».
 *
 * Ce qui a été coupé, et pourquoi :
 *
 * - **Le constat passe de douze lignes à cinq.** C'était trois strophes qui
 *   disaient la même chose trois fois : les maquettes inventées, le faux
 *   témoignage, les démonstrations d'ailleurs sur le site. La troisième
 *   strophe expliquait une nuance que personne n'avait demandée. Les lignes
 *   restantes sont les plus dures, et elles s'allument toujours une à une au
 *   défilement — l'effet que le client avait validé reste, c'est la longueur
 *   qui part.
 * - **Les conditions passent de cinq phrases à cinq entrées.** Elles étaient
 *   une liste numérotée de phrases complètes, c'est-à-dire exactement la forme
 *   qu'on saute. Elles deviennent cinq blocs titre + ligne : même contenu,
 *   lisible de biais, et le titre suffit à savoir si la ligne concerne.
 * - **L'échange devient deux objets en volume** plutôt que deux cartes plates.
 *
 * La troisième dimension est réelle et non suggérée : les tuiles sont des
 * objets en perspective dont le contenu flotte en avant du fond. C'est la
 * parallaxe entre ces deux plans qui donne l'épaisseur — une carte qui
 * s'incline sans elle reste une image plate qu'on penche.
 */
export function Lancement({ dict, locale }: { dict: Dict; locale: Locale }) {
  const p = dict.pages.realisations;
  const o = p.offre;

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

  // Le vert pour ce qui est donné, le sienna pour ce qui est demandé : deux
  // teintes opposées sur le cercle du livre, ce qui est le rapport exact entre
  // les deux listes. Classes écrites en entier — Tailwind ne génère pas une
  // classe qu'il ne voit pas écrite dans le source.
  const faces = [
    {
      bloc: o.jeDonne,
      fond: "bg-teinte-vert",
      filet: "border-accent-vert",
      puce: "marker:text-accent-vert",
    },
    {
      bloc: o.jeDemande,
      fond: "bg-teinte-violet",
      filet: "border-accent-violet",
      puce: "marker:text-accent-violet",
    },
  ];

  return (
    <>
      {/* Le constat, court et en grand. C'est l'argument de la page — pourquoi
          elle est vide — et il tient maintenant sur un écran. Les lignes
          s'allument une à une au défilement, à la manière des paroles sur un
          lecteur de musique ; le fond reste le papier nu, parce qu'aucun lavis
          n'y gagnerait ce qu'il coûterait en lisibilité. */}
      <Section>
        <div className="max-w-(--content-max)">
          <h2 className="font-display text-ink text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            {p.vide.titre}
          </h2>
          <TexteProgressif texte={p.vide.corps.map((l) => [...l])} />
        </div>
      </Section>

      {/* La bande de l'offre : une colonne, un sommet.

          `max-w-4xl` **sans** `mx-auto` : mesuré, un centrage posait le bord
          gauche de cette bande à 192 px quand toutes les autres sections de la
          page commencent à 32. L'œil suit un bord gauche en descendant une
          page, et celui-là sautait de 160 px sans qu'aucune raison ne le
          justifie. */}
      <Section tone="bleu">
        <div className="max-w-4xl">
          <Entree>
            <p className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
              {o.surtitre}
            </p>
            <h2 className="font-display text-ink mt-4 max-w-[14ch] text-4xl leading-[1.03] font-semibold tracking-tight text-balance sm:text-6xl">
              {o.titre}
            </h2>
            <p className="text-ink-secondary mt-6 max-w-(--content-max) text-lg leading-relaxed text-pretty">
              {o.corps}
            </p>
          </Entree>

          {/* Les dix places, en pleine largeur : elles ne sont pas un encadré
              posé à côté du texte, elles sont ce que la bande montre. */}
          <div className="mt-12 sm:mt-14">
            <PlacesLancement titre={o.libellePlaces} etat={o.placesEtat} />
          </div>

          {/* Les deux faits, séparés par un filet plutôt que par une carte : ce
              sont deux lignes du même contrat, pas deux objets. */}
          <Entree delai={60}>
            <div className="border-rule mt-12 grid gap-8 border-t pt-8 sm:mt-14 sm:grid-cols-2 sm:gap-12">
              <div>
                <p className="text-ink-muted text-sm">{o.libelleRabais}</p>
                <p className="font-display text-accent-bleu mt-2 text-5xl leading-none font-semibold tabular-nums sm:text-6xl">
                  −{RABAIS_LANCEMENT}&nbsp;%
                </p>
              </div>
              <div>
                <CompteARebours dict={dict} />
                {dateFin ? (
                  <p className="text-ink-muted mt-3 text-sm">
                    <time dateTime={FIN_OFFRE}>{dateFin}</time>
                  </p>
                ) : null}
              </div>
            </div>
          </Entree>

          <Entree delai={120}>
            <div className="mt-12 sm:mt-14">
              <Button asChild size="lg" className="rounded-md text-base">
                <Link href={`/${locale}/contact`}>
                  {o.cta} <ArrowRight aria-hidden />
                </Link>
              </Button>
              <p className="text-ink-secondary mt-4 max-w-(--content-max) text-sm leading-relaxed">
                {o.ctaNote}
              </p>
            </div>
          </Entree>
        </div>
      </Section>

      {/* L'échange, en deux volumes. Un rabais de 25 % sans sa contrepartie
          écrite ressemble à une vitrine ; une contrepartie reléguée dans une
          colonne étroite ressemble à une clause qu'on espère non lue. */}
      <Section titre={o.echangeTitre} chapo={o.echangeChapo}>
        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {faces.map((face, i) => (
            <Entree key={face.bloc.titre} delai={i * 70} className="h-full">
              <Carte3D
                className={`${face.fond} ${face.filet} h-full rounded-2xl border-t-2 p-6 sm:p-8`}
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
      </Section>

      {/* Les conditions, en cinq blocs plutôt qu'en cinq phrases.

          Elles ne sont pas repliées derrière un « voir les détails » : une
          offre dont les limites se cachent est exactement ce que ce studio dit
          ne pas faire ailleurs. Mais une liste numérotée de phrases complètes
          est la forme qu'on saute. En blocs titre + ligne, le titre suffit à
          savoir si la ligne concerne, et l'ensemble se lit de biais.

          Le lavis jaune du livre est la couleur d'un avis — elles en sont un. */}
      <section className="bg-teinte-cyan border-rule border-y py-16 sm:py-20">
        <Zone>
          <h2 className="font-display text-ink text-2xl font-semibold tracking-tight">
            {o.conditions.titre}
          </h2>
          <ol className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {o.conditions.items.map((item, i) => (
              <li key={item.cle} className="max-w-(--content-max)">
                <p className="text-accent-cyan font-mono text-[11px] tracking-[0.2em] tabular-nums uppercase">
                  {String(i + 1).padStart(2, "0")} · {item.cle}
                </p>
                <p className="text-ink-secondary mt-2 text-sm leading-relaxed text-pretty">
                  {item.texte}
                </p>
              </li>
            ))}
          </ol>
        </Zone>
      </section>
    </>
  );
}
