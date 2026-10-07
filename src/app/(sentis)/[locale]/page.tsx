import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { HorizontalTrack, Reveal3D } from "@/components/motion";
import { Scene3DDifferee } from "@/components/motion/differe";
import { ConfigurateurPrix } from "@/components/sentis/configurateur-prix";
import { CouverturePrix } from "@/components/sentis/couverture-prix";
import { HeroPleinEcran } from "@/components/sentis/hero-plein-ecran";
import {
  ObjetDevis,
  ObjetFil,
  ObjetHorloge,
  ObjetTitre,
} from "@/components/sentis/objets-manifeste";
import { PanneauEtape, PanneauPhoto } from "@/components/sentis/panneaux-accueil";
import { Section, Zone } from "@/components/sentis/parts";
import { TestSite } from "@/components/sentis/test-site";
import { TroisRaisons } from "@/components/sentis/trois-raisons";
import { Button } from "@/components/ui/button";
import { DICT, isLocale } from "@/lib/i18n";
import { PHOTOS } from "@/lib/photos";
import { metadonneesPage } from "@/lib/seo";
import { LocalBusinessJsonLd } from "@/components/sentis/local-business";

/**
 * Les photos des deux séquences, dans l'ordre des panneaux. Aucune ne montre
 * une personne ; voir `src/lib/photos.ts` pour leur provenance et leur
 * licence.
 */
const PHOTOS_MANIFESTE = [PHOTOS.agenda, PHOTOS.atelier, PHOTOS.cle, PHOTOS.riviere] as const;
const PHOTOS_METHODE = [PHOTOS.cafe, PHOTOS.carnet, PHOTOS.poste, PHOTOS.portable] as const;

/** Les forfaits que le devis du manifeste laisse choisir : un par métier vendu au forfait. */
const FORFAITS_DEVIS: readonly string[] = ["une-page", "vitrine", "identite"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return metadonneesPage({
    locale,
    chemin: "",
  });
}

export default async function SentisHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = DICT[locale];
  const p = d.pages.accueil;

  return (
    <>
      <LocalBusinessJsonLd locale={locale} />

      <HeroPleinEcran dict={d} locale={locale} />

      {/* --- Séquence horizontale : le manifeste, qui EST une progression ---
          Une photo par promesse, et un objet qui la montre. Voir
          `panneaux-accueil.tsx` et `objets-manifeste.tsx`. */}
      <HorizontalTrack
        label={locale === "fr" ? "Nos engagements, séquence horizontale" : "Our commitments, horizontal sequence"}
        panels={p.manifeste.map((m, i) => (
          <PanneauPhoto
            key={m.titre}
            photo={PHOTOS_MANIFESTE[i % PHOTOS_MANIFESTE.length]}
            locale={locale}
            titre={m.titre}
            corps={m.corps}
            decrire={i === 3}
            objet={
              i === 0 ? (
                <ObjetDevis
                  locale={locale}
                  textes={p.objets.devis}
                  forfaits={d.prix.forfaits.filter((f) => FORFAITS_DEVIS.includes(f.cle))}
                />
              ) : i === 1 ? (
                <ObjetFil textes={p.objets.fil} />
              ) : i === 2 ? (
                <ObjetTitre textes={p.objets.titre} />
              ) : (
                <ObjetHorloge locale={locale} textes={p.objets.horloge} />
              )
            }
          />
        ))}
      />

      {/* --- Retour au vertical : l'objection, et ce qui la règle --- */}
      <TroisRaisons dict={d} />

      {/* --- Séquence horizontale : le déroulé d'un projet ---
          Gardée horizontale, à la demande du client ; le papier d'un côté, la
          photo de l'autre, et le moment de chaque étape à côté de son
          numéro. */}
      <HorizontalTrack
        label={locale === "fr" ? "Déroulé d'un projet, séquence horizontale" : "How a project runs, horizontal sequence"}
        panels={d.methode.etapes.map((e, i) => (
          <PanneauEtape
            key={e.n}
            photo={PHOTOS_METHODE[i % PHOTOS_METHODE.length]}
            locale={locale}
            index={i}
            numero={e.n}
            quand={e.quand}
            titre={e.titre}
            corps={e.corps}
          />
        ))}
      />

      {/* --- Vertical : le visiteur teste son propre site ---
          Remplace l'aperçu des démonstrations. Voir `test-site.tsx`. */}
      <section className="border-rule border-t py-20 sm:py-28">
        <Zone>
          <TestSite locale={locale} textes={d.testSite} />
        </Zone>
      </section>

      {/* --- Vertical : les prix, argument central ---
          Un configurateur plutôt qu'une grille : c'est la seule forme qui
          tienne sur la page la promesse faite partout ailleurs sur le site —
          le prix **et la date**, tout de suite. Voir
          `src/components/sentis/configurateur-prix.tsx`. */}
      <Section id="prix" titre={d.prix.titre} chapo={d.prix.intro} tone="blanc">
        <ConfigurateurPrix dict={d} locale={locale} />

        <CouverturePrix dict={d} />
      </Section>

      {/* --- Appel final --- */}
      <section className="bg-ink text-paper relative overflow-hidden py-24 sm:py-32">
        {/* L'onde est le seul décor de cette section : pas de filet, pas de
            carte, rien qui concurrence le seul bouton de la page. */}
        <Scene3DDifferee
          variante="onde"
          alpha={0.55}
          vitesse={0.8}
          decalage={0.3}
          zoom={0.92}
          className="text-rule-strong"
        />
        <Zone className="relative">
          {/* `sansFondu` : ce titre est le dernier appel de la page, et le
              contrôle navigateur l'a trouvé à 0 % d'opacité alors qu'il était
              dans le viewport — l'entrée au défilement n'avait pas encore
              couru. Le texte qui porte la conversion ne doit dépendre d'aucune
              animation pour être lu. Il s'anime en position, pas en opacité. */}
          <Reveal3D depuis="bas" distance={70} angle={9} sansFondu>
            <h2 className="font-display max-w-[18ch] text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
              {d.contact.titre}
            </h2>
          </Reveal3D>
          <p className="mt-6 max-w-(--content-max) text-lg leading-relaxed text-pretty">
            {d.contact.corps}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-paper text-ink hover:bg-paper/90 mt-10 rounded-md text-base"
          >
            <Link href={`/${locale}/contact`}>
              {d.nav.soumission} <ArrowRight aria-hidden />
            </Link>
          </Button>
        </Zone>
      </section>
    </>
  );
}
