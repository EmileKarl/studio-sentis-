import Image from "next/image";
import type { ReactNode } from "react";

import type { Locale } from "@/lib/i18n";
import { creditPhoto, type Photo } from "@/lib/photos";
import { cn } from "@/lib/utils";

/**
 * Les panneaux des deux séquences horizontales de l'accueil.
 *
 * Ils remplacent des aplats de couleur pleine page. Le client les a jugés
 * « comme un cahier de couleurs » : quatre couleurs franches qui ne disaient
 * rien de plus que le titre posé dessus. Ici chaque panneau a **une photo qui
 * porte le sens** — une clé pour « le site vous appartient », la rivière
 * Châteauguay pour « on peut se rencontrer » — et, sur le manifeste, **un
 * objet qui montre la promesse** au lieu de la répéter.
 *
 * Le texte est posé sur un voile sombre fixe, et non sur `--ink` : dans le
 * thème sombre, l'encre devient claire, et le texte clair d'un panneau photo
 * se retrouverait sur un voile clair. Un panneau photo est sombre dans les
 * deux thèmes, comme un tirage.
 */

/** Le crédit, toujours lisible : sur sa propre pastille sombre, jamais à même la photo. */
function Credit({ photo, locale }: { photo: Photo; locale: Locale }) {
  const texte = creditPhoto(photo, locale);
  const classes =
    "absolute right-3 bottom-3 z-10 rounded-sm bg-[rgb(18_19_20/0.72)] px-2 py-0.5 text-[11px] text-[#f8f5f2]";
  // Une licence CC BY demande un lien vers la source quand c'est possible :
  // sur le web, ça l'est. Le CC0 n'en demande pas ; on garde le crédit en
  // texte, pour ne pas semer des liens dans une séquence qu'on fait défiler.
  return photo.licence === "CC BY 4.0" ? (
    <a
      href={photo.source}
      className={cn(classes, "underline underline-offset-2 hover:no-underline focus-visible:ring-2 focus-visible:ring-[#f8ed43] focus-visible:outline-none")}
    >
      {texte}
    </a>
  ) : (
    <p className={classes}>{texte}</p>
  );
}

/** Manifeste : photo plein cadre, voile, la promesse à gauche, son objet à droite. */
export function PanneauPhoto({
  photo,
  locale,
  titre,
  corps,
  objet,
  decrire = false,
}: {
  photo: Photo;
  locale: Locale;
  titre: string;
  corps: string;
  objet?: ReactNode;
  /**
   * Faut-il décrire la photo aux lecteurs d'écran ? Non, le plus souvent :
   * un agenda ou une clé sont une ambiance, et les annoncer avant le titre
   * serait du bruit. Oui pour la rivière, parce que le lieu est l'argument.
   */
  decrire?: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#121314] text-[#f8f5f2]">
      <Image
        src={photo.image}
        alt={decrire ? photo.alt[locale] : ""}
        fill
        sizes="100vw"
        placeholder="blur"
        className="object-cover"
      />
      {/* Le voile : dense sous le texte, presque absent au-delà, pour que la
          photo se voie. Sur téléphone, le texte est en haut et l'objet en
          dessous : le voile descend du haut. Le contraste du texte posé
          dessus est mesuré au pire pixel, comme pour les scènes 3D. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(18_19_20/0.82)_0%,rgb(18_19_20/0.7)_55%,rgb(18_19_20/0.35)_100%)] lg:bg-[linear-gradient(90deg,rgb(18_19_20/0.88)_0%,rgb(18_19_20/0.8)_45%,rgb(18_19_20/0.32)_66%,rgb(18_19_20/0.06)_88%)]"
      />
      <div className="relative flex h-full flex-col justify-center gap-8 px-6 py-16 sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-20">
        <div className="max-w-[40rem]">
          <h2 className="font-display text-4xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {titre}
          </h2>
          <p className="mt-6 max-w-[40ch] text-base leading-relaxed text-pretty text-[#f8f5f2]/88 sm:text-lg">
            {corps}
          </p>
        </div>
        {objet ? <div className="shrink-0">{objet}</div> : null}
      </div>
      <Credit photo={photo} locale={locale} />
    </div>
  );
}

/**
 * Méthode : une étape par panneau, le papier d'un côté, la photo de l'autre.
 *
 * Une composition différente du manifeste, exprès : deux séquences
 * horizontales de suite au même gabarit se liraient comme une seule, deux fois
 * trop longue. Ici le texte est sur le papier, net, et la photo occupe sa
 * moitié sans voile.
 */
const ACCENT_ETAPE = [
  "text-accent-bleu",
  "text-accent-vert",
  "text-accent-violet",
  "text-accent-cyan",
] as const;

export function PanneauEtape({
  photo,
  locale,
  index,
  numero,
  quand,
  titre,
  corps,
}: {
  photo: Photo;
  locale: Locale;
  index: number;
  numero: string;
  quand: string;
  titre: string;
  corps: string;
}) {
  return (
    <div className="bg-paper text-ink grid h-full w-full grid-rows-[38%_1fr] lg:grid-cols-2 lg:grid-rows-1">
      <div className="relative lg:order-2">
        <Image
          src={photo.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          placeholder="blur"
          className="object-cover"
        />
        <Credit photo={photo} locale={locale} />
      </div>
      <div className="flex flex-col justify-start px-6 pt-8 pb-16 sm:px-12 lg:order-1 lg:justify-center lg:px-20 lg:py-8">
        {/* Le numéro porte une information — l'ordre des étapes — et le
            moment dit quand elle arrive : ce n'est pas un surtitre. */}
        <p className="flex items-baseline gap-4">
          <span
            className={cn(
              "font-display text-6xl leading-none font-semibold tracking-tight tabular-nums sm:text-8xl",
              ACCENT_ETAPE[index % ACCENT_ETAPE.length],
            )}
          >
            {numero}
          </span>
          <span className="text-ink-secondary text-sm font-medium sm:text-base">{quand}</span>
        </p>
        <h2 className="font-display mt-6 max-w-[14ch] text-3xl leading-[1.04] font-semibold tracking-tight text-balance sm:mt-8 sm:text-5xl lg:text-6xl">
          {titre}
        </h2>
        <p className="text-ink-secondary mt-4 max-w-[40ch] text-base leading-relaxed text-pretty sm:mt-6 sm:text-lg">
          {corps}
        </p>
      </div>
    </div>
  );
}
