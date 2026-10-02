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
 *
 * ---
 *
 * **Refonte, deuxième version.** La première mettait l'offre entière — chiffres,
 * compte à rebours, bouton, et les deux listes de l'échange — dans une seule
 * grille à deux colonnes sur un lavis terracotta. Trois défauts, dans l'ordre
 * de gravité :
 *
 * 1. Les deux listes « ce que je donne / ce que je demande » sont la partie la
 *    plus engageante de la page, et elles se lisaient en colonne étroite à
 *    côté d'un bouton qui captait l'attention. Elles ont maintenant leur propre
 *    section, en pleine largeur, avec un titre qui dit ce qu'on y lit.
 * 2. Rien ne donnait de volume aux « dix places ». Un nombre dans une
 *    définition se lit ; dix pastilles se comptent. Elles sont toutes vides, et
 *    la légende le dit en clair — afficher des places prises serait le seul
 *    mensonge d'une page dont tout l'argument est de ne pas en faire.
 * 3. Une seule couleur pour toute la page. La combinaison 333 du livre de
 *    Sanzo Wada en donne quatre, et chacune a ici un rôle : le bleu de la
 *    marque porte l'offre, le vert ce que le studio donne, le sienna ce qu'il
 *    demande, le jaune les conditions — un fond de mise en garde, qui est
 *    exactement ce qu'elles sont.
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

  // Les deux faces de l'échange, chacune avec sa couleur du livre. Le vert
  // pour ce qui est donné, le sienna pour ce qui est demandé : deux teintes
  // opposées sur le cercle, ce qui est exactement le rapport entre les deux
  // listes. Les classes sont écrites en entier — Tailwind ne génère pas une
  // classe qu'il ne voit pas écrite dans le source.
  const faces = [
    {
      bloc: o.jeDonne,
      fond: "bg-teinte-vert",
      filet: "border-accent-vert",
      puce: "marker:text-accent-vert",
      depuis: "droite" as const,
    },
    {
      bloc: o.jeDemande,
      fond: "bg-teinte-violet",
      filet: "border-accent-violet",
      puce: "marker:text-accent-violet",
      depuis: "bas" as const,
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

      <Section tone="bleu">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
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
                <dd className="font-display text-accent-bleu text-4xl font-semibold tabular-nums">
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

          {/* Les dix places, comptables à l'œil.
              Le bloc entier est `aria-hidden` et la phrase sous lui porte la
              même information en mots : dix pastilles identiques annoncées une
              par une à la voix seraient dix fois « liste, élément » pour rien.
              Les pastilles sont vides parce que les places le sont. */}
          <Reveal3D
            depuis="droite"
            distance={80}
            // `self-start` sur l'enveloppe et non sur la carte : c'est
            // l'enveloppe qui est l'enfant de la grille, et une classe de
            // placement posée sur l'élément animé n'aurait aucun effet.
            className="self-start"
            classeAnimee="bg-paper border-rule rounded-lg border p-6 sm:p-8"
          >
            <>
              <h3 className="font-display text-ink text-xl font-semibold text-balance">
                {o.libellePlaces}
              </h3>
              <ul aria-hidden className="mt-6 grid grid-cols-5 gap-3 sm:gap-4">
                {Array.from({ length: PLACES_LANCEMENT }, (_, i) => (
                  <li
                    key={i}
                    className="border-accent-bleu text-accent-bleu flex aspect-square items-center justify-center rounded-full border-2 border-dashed font-mono text-sm tabular-nums"
                  >
                    {i + 1}
                  </li>
                ))}
              </ul>
              <p className="text-ink-secondary mt-6 leading-relaxed text-pretty">
                {o.placesEtat}
              </p>
            </>
          </Reveal3D>
        </div>
      </Section>

      {/* L'échange, en pleine largeur et sous son propre titre. C'est la partie
          qui décide : un rabais de 25 % sans sa contrepartie écrite ressemble à
          une vitrine, et une contrepartie reléguée dans une colonne étroite
          ressemble à une clause qu'on espère non lue. */}
      <Section titre={o.echangeTitre} chapo={o.echangeChapo}>
        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {faces.map((face, i) => (
            <Reveal3D
              key={face.bloc.titre}
              depuis={face.depuis}
              distance={80}
              delay={i * 0.08}
              classeAnimee={`${face.fond} ${face.filet} h-full rounded-lg border-t-2 p-6 sm:p-8`}
            >
              <>
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
              </>
            </Reveal3D>
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
