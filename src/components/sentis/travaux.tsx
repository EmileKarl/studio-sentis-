import { ObjetFlottant3D, Reveal3D } from "@/components/motion";
import { DemoBoulangerie, DemoIdentite, DemoReservation } from "@/components/sentis/demos";
import { BrowserFrame, PhoneFrame } from "@/components/sentis/frames";
import type { Dict } from "@/lib/i18n";

/**
 * La section de réalisations est placée juste après le titre, pas en bas de
 * page. Pour un studio sans clients, c'est la seule preuve disponible : la
 * reléguer sous les tarifs reviendrait à demander qu'on nous croie sur parole
 * avant d'avoir montré quoi que ce soit.
 */
export function Travaux({ dict }: { dict: Dict }) {
  const [web, mobile, identite] = dict.travaux.items;

  return (
    <section
      id="travaux"
      className="bg-surface-2 border-rule border-y py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-(--container-page) px-5 sm:px-8">
        <header className="max-w-(--content-max)">
          <h2 className="font-display text-ink text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            {dict.travaux.titre}
          </h2>
          <p className="text-ink-secondary mt-4 text-lg leading-relaxed text-pretty">
            {dict.travaux.intro}
          </p>
        </header>

        {/* --- Pièce 1 : site vitrine, en grand parce que c'est l'offre phare */}
        <article className="mt-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:items-center lg:gap-12">
            <Reveal3D depuis="gauche" className="order-2 lg:order-1">
              <h3 className="font-display text-ink text-2xl font-semibold tracking-tight text-balance">
                {web.titre}
              </h3>
              <p className="text-ink-secondary mt-3 max-w-(--content-max) leading-relaxed text-pretty">
                {web.corps}
              </p>
              <p className="text-ink-muted mt-4 max-w-(--content-max) font-mono text-xs">
                {web.etiquette} · {web.meta}
              </p>
            </Reveal3D>
            <div className="order-1 min-w-0 lg:order-2">
              <ObjetFlottant3D>
                <BrowserFrame url="lefournil.example">
                  <DemoBoulangerie />
                </BrowserFrame>
              </ObjetFlottant3D>
            </div>
          </div>
        </article>

        {/* --- Pièces 2 et 3 côte à côte : registres opposés, comparaison directe */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-10">
          <article>
            <ObjetFlottant3D amplitude={11} className="flex justify-center py-2">
              <PhoneFrame>
                <DemoReservation />
              </PhoneFrame>
            </ObjetFlottant3D>
            <h3 className="font-display text-ink mt-8 text-2xl font-semibold tracking-tight text-balance">
              {mobile.titre}
            </h3>
            <p className="text-ink-secondary mt-3 max-w-(--content-max) leading-relaxed text-pretty">
              {mobile.corps}
            </p>
            <p className="text-ink-muted mt-4 max-w-(--content-max) font-mono text-xs">
              {mobile.etiquette} · {mobile.meta}
            </p>
          </article>

          <article>
            <ObjetFlottant3D className="flex min-h-[19rem] items-center py-2">
              <div className="border-rule w-full overflow-hidden rounded-md border shadow-sm">
                <DemoIdentite />
              </div>
            </ObjetFlottant3D>
            <h3 className="font-display text-ink mt-8 text-2xl font-semibold tracking-tight text-balance">
              {identite.titre}
            </h3>
            <p className="text-ink-secondary mt-3 max-w-(--content-max) leading-relaxed text-pretty">
              {identite.corps}
            </p>
            <p className="text-ink-muted mt-4 max-w-(--content-max) font-mono text-xs">
              {identite.etiquette} · {identite.meta}
            </p>
          </article>
        </div>

        {/* La mention d'honnêteté est ici, sous les pièces, et pas à la place
            des pièces comme dans la version précédente. */}
        <p className="border-rule text-ink-muted mt-14 max-w-(--content-max) border-t pt-6 text-sm leading-relaxed text-pretty">
          {dict.travaux.mention}
        </p>
      </div>
    </section>
  );
}
