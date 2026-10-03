import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CompteARebours } from "@/components/sentis/compte-a-rebours";
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
 *
 * ---
 *
 * **Troisième version, et celle-ci est une refonte de la hiérarchie et du
 * mouvement, pas du texte.**
 *
 * La deuxième posait l'offre dans une grille à deux colonnes : le bloc de
 * texte et son bouton d'un côté, la carte des dix places de l'autre. Les deux
 * se disputaient le regard, et le résultat est qu'aucun ne gagnait. Une page
 * dont l'unique but est de faire écrire un premier client doit **culminer**,
 * et une grille à deux colonnes ne culmine pas : elle répartit.
 *
 * La bande de l'offre est donc une colonne unique, et l'ordre est celui dont
 * un visiteur a besoin, pas celui du texte source :
 *
 *   1. il y a dix places, et elles sont toutes libres  → rareté, et honnêteté
 *   2. c'est −25 %, et ça se termine à telle date      → les deux faits
 *   3. prendre une place                               → la sortie
 *
 * Côté mouvement, trois décisions, prises avec le cadre et non à l'habitude :
 *
 * - **Les entrées passent de `Reveal3D` à `Entree`.** L'ancienne inclinait
 *   chaque bloc de 12° et le reculait de 80 px pendant 700 ms. Posée sur un
 *   paragraphe, une inclinaison 3D ne répond à aucune question — et le cadre
 *   demande d'abord à quoi sert une animation. La nouvelle fait 240 ms, une
 *   opacité et seize pixels, en CSS donc hors du fil principal.
 * - **Les dix places s'allument une par une**, à 40 ms d'intervalle. C'est le
 *   seul mouvement de la page qui fasse quelque chose : il fait compter.
 * - **Le compte à rebours n'anime rien.** Ses chiffres changent chaque
 *   seconde ; les animer serait du bruit sur la seule information de la page
 *   qui bouge toute seule.
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

  // Les deux faces de l'échange, chacune avec sa couleur du livre : le vert
  // pour ce qui est donné, le sienna pour ce qui est demandé. Deux teintes
  // opposées sur le cercle, ce qui est le rapport exact entre les deux listes.
  // Les classes sont écrites en entier — Tailwind ne génère pas une classe
  // qu'il ne voit pas écrite dans le source.
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
      <Section>
        <div className="max-w-(--content-max)">
          <h2 className="font-display text-ink text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            {p.vide.titre}
          </h2>
          {/* Les lignes s'allument une à une au défilement, à la manière des
              paroles sur un lecteur de musique. C'est l'argument central de la
              page — pourquoi elle est vide — et il doit être lu jusqu'au bout ;
              voir `TexteProgressif` pour ce que cela implique en contraste.
              Le fond reste le papier nu : c'est le plus long passage de texte
              du site, et aucun lavis n'y gagnerait ce qu'il coûterait en
              lisibilité. */}
          <TexteProgressif texte={p.vide.corps.map((l) => [...l])} />
        </div>
      </Section>

      {/* La bande de l'offre : une colonne, un sommet.

          `max-w-4xl` **sans** `mx-auto` : mesuré, un centrage posait le bord
          gauche de cette bande à 192 px quand toutes les autres sections de la
          page commencent à 32. L'œil suit un bord gauche en descendant une
          page, et celui-là sautait de 160 px sans qu'aucune raison ne le
          justifie. La largeur maximale sert à tenir la mesure de lecture, pas
          à recentrer la colonne. */}
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

          {/* Les dix places, en pleine largeur. Elles ne sont plus un encadré
              posé à côté du texte : elles sont ce que la bande montre. */}
          <div className="mt-12 sm:mt-14">
            <PlacesLancement titre={o.libellePlaces} etat={o.placesEtat} />
          </div>

          {/* Les deux faits, côte à côte, séparés par un filet plutôt que par
              une carte : ce sont deux lignes du même contrat, pas deux objets.
              Le rabais est le chiffre qu'on retient ; l'échéance est celle qui
              fait agir. */}
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

      {/* L'échange, en pleine largeur et sous son propre titre. C'est la partie
          qui décide : un rabais de 25 % sans sa contrepartie écrite ressemble à
          une vitrine, et une contrepartie reléguée dans une colonne étroite
          ressemble à une clause qu'on espère non lue. */}
      <Section titre={o.echangeTitre} chapo={o.echangeChapo}>
        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {faces.map((face, i) => (
            <Entree key={face.bloc.titre} delai={i * 70} className="h-full">
              <div
                className={`${face.fond} ${face.filet} h-full rounded-lg border-t-2 p-6 sm:p-8`}
              >
                <h3 className="font-display text-ink text-xl font-semibold text-balance">
                  {face.bloc.titre}
                </h3>
                <ul
                  className={`text-ink-secondary mt-4 list-disc space-y-2.5 pl-5 leading-relaxed ${face.puce}`}
                >
                  {face.bloc.items.map((item) => (
                    <li key={item} className="text-pretty">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Entree>
          ))}
        </div>
      </Section>

      {/* Les conditions ne sont pas repliées derrière un « voir les détails ».
          Une offre dont les limites se cachent est exactement ce que ce studio
          dit ne pas faire ailleurs sur le site. Elles prennent le lavis jaune
          du livre, qui est la couleur d'un avis — elles en sont un. */}
      <section className="bg-teinte-cyan border-rule border-y py-16 sm:py-20">
        <Zone>
          <h2 className="font-display text-ink text-2xl font-semibold tracking-tight">
            {o.conditions.titre}
          </h2>
          <ol className="text-ink-secondary marker:text-accent-cyan mt-6 max-w-(--content-max) list-decimal space-y-3 pl-5 leading-relaxed">
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
