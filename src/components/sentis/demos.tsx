/**
 * Démonstrations de savoir-faire.
 *
 * Ce ne sont PAS des projets clients, et la page le dit à l'endroit où elles
 * s'affichent. Ce sont des pièces conçues pour montrer ce que le studio sait
 * produire, dans trois registres volontairement différents : une agence qui ne
 * sait faire qu'une seule chose n'a pas de portfolio, elle a un style.
 *
 * Chaque pièce porte sa propre palette, en variables locales : rien ne fuit
 * vers les tokens du site, et l'écart entre les trois est précisément ce qui
 * est démontré.
 */

/* ------------------------------------------------------------------ 1. Web */
export function DemoBoulangerie() {
  return (
    <div
      style={{
        // chaleureux, appétissant, éditorial
        ["--c-bg" as string]: "#fbf4e9",
        ["--c-ink" as string]: "#2e1c10",
        ["--c-soft" as string]: "#6b5342",
        ["--c-acc" as string]: "#b6482a",
        ["--c-card" as string]: "#f2e6d3",
      }}
      className="bg-[var(--c-bg)] px-6 py-5 text-[var(--c-ink)]"
    >
      <div className="flex items-center justify-between">
        <p className="font-serif text-[17px] font-bold tracking-tight">
          Le Fournil
        </p>
        <nav className="hidden items-center gap-4 text-[12px] text-[var(--c-soft)] sm:flex">
          <span>Pains</span>
          <span>Viennoiseries</span>
          <span>Commandes</span>
          <span className="rounded-full bg-[var(--c-acc)] px-3 py-1.5 text-white">
            Réserver
          </span>
        </nav>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-[1.1fr_1fr] sm:items-end">
        <div>
          <h3 className="font-serif text-[28px] leading-[1.05] font-bold tracking-tight sm:text-[36px]">
            Le pain sort du four à&nbsp;6&nbsp;h&nbsp;30.
          </h3>
          <p className="mt-3 max-w-[34ch] text-[14px] leading-relaxed text-[var(--c-soft)]">
            Levain naturel, farines du Québec, cuisson au feu de bois. Commandez
            la veille, on garde votre miche au chaud.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="rounded-full bg-[var(--c-ink)] px-4 py-2 text-[12px] font-medium text-[var(--c-bg)]">
              Voir la carte
            </span>
            <span className="rounded-full border border-[var(--c-ink)]/25 px-4 py-2 text-[12px]">
              Nous trouver
            </span>
          </div>
          <p className="mt-3 text-[12px] text-[var(--c-soft)]">
            Ouvert du mardi au dimanche, 6&nbsp;h&nbsp;30 – 18&nbsp;h.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            ["Miche au levain", "7,50 $", "#c9a227"],
            ["Croissant beurre", "3,25 $", "#d98032"],
            ["Pain de seigle", "6,00 $", "#8a5a3b"],
          ].map(([nom, prix, teinte]) => (
            <div
              key={nom}
              className="overflow-hidden rounded-lg bg-[var(--c-card)]"
            >
              <div
                aria-hidden
                className="h-12"
                style={{
                  background: `linear-gradient(170deg, ${teinte}, ${teinte}cc)`,
                }}
              />
              <div className="px-2 py-2">
                <p className="text-[11px] leading-tight font-semibold">{nom}</p>
                <p className="mt-0.5 text-[11px] text-[var(--c-soft)]">{prix}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- 2. Mobile */
export function DemoReservation() {
  const jours = [
    ["LUN", "14"],
    ["MAR", "15"],
    ["MER", "16"],
    ["JEU", "17"],
  ];
  const heures = [
    ["9:00", "libre"],
    ["10:30", "pris"],
    ["12:00", "libre"],
    ["13:30", "choisi"],
    ["15:00", "libre"],
    ["16:30", "pris"],
  ];

  return (
    <div
      style={{
        // calme, soigné, contrasté — registre « service à la personne »
        ["--c-bg" as string]: "#f6f7f4",
        ["--c-ink" as string]: "#15251d",
        ["--c-soft" as string]: "#5b6b63",
        ["--c-acc" as string]: "#1d6b4f",
        ["--c-line" as string]: "#dfe4de",
      }}
      className="bg-[var(--c-bg)] px-4 pt-9 pb-4 text-[var(--c-ink)]"
    >
      <p className="text-[11px] tracking-[0.2em] text-[var(--c-soft)] uppercase">
        Salon Véra
      </p>
      <h3 className="mt-1 text-[21px] leading-tight font-semibold tracking-tight">
        Choisissez votre heure
      </h3>
      <p className="mt-1 text-[12px] text-[var(--c-soft)]">
        Coupe et brushing · 45 min · 55 $
      </p>

      <div className="mt-4 flex gap-1.5">
        {jours.map(([j, n], i) => (
          <div
            key={j}
            className={
              i === 2
                ? "flex-1 rounded-xl bg-[var(--c-acc)] py-2 text-center text-white"
                : "flex-1 rounded-xl border border-[var(--c-line)] bg-white py-2 text-center"
            }
          >
            {/* Couleur explicite plutôt qu'une opacité : atténuer du texte par
                l'opacité fait chuter son contraste sous le seuil lisible. */}
            <p
              className={
                i === 2
                  ? "text-[11px] tracking-wider text-white"
                  : "text-[11px] tracking-wider text-[#5b6b63]"
              }
            >
              {j}
            </p>
            <p className="mt-0.5 text-[13px] font-semibold">{n}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {heures.map(([h, etat]) => (
          <div
            key={h}
            className={
              etat === "choisi"
                ? "rounded-lg bg-[var(--c-acc)] py-2 text-center text-[13px] font-semibold text-white"
                : etat === "pris"
                  ? "rounded-lg border border-[var(--c-line)] py-2 text-center text-[13px] text-[#5b6b63] line-through"
                  : "rounded-lg border border-[var(--c-line)] bg-white py-2 text-center text-[13px]"
            }
          >
            {h}
          </div>
        ))}
      </div>
      <p className="mt-2 text-[12px] text-[var(--c-soft)]">
        Les heures barrées sont déjà réservées.
      </p>

      <div className="mt-4 rounded-xl bg-[var(--c-ink)] px-4 py-3 text-center text-[12px] font-semibold text-white">
        Confirmer · mercredi 13 h 30
      </div>
    </div>
  );
}

/* ------------------------------------------------------- 3. Identité / infographie */
export function DemoIdentite() {
  const palette = [
    ["#12130f", "Encre"],
    ["#e4c200", "Signal"],
    ["#7b8079", "Acier"],
    ["#f1f0eb", "Atelier"],
  ];

  return (
    <div
      style={{
        // franc, industriel, à l'opposé des deux autres
        ["--c-bg" as string]: "#f1f0eb",
        ["--c-ink" as string]: "#12130f",
        ["--c-acc" as string]: "#e4c200",
      }}
      className="bg-[var(--c-bg)] p-5 text-[var(--c-ink)]"
    >
      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="grid size-20 place-items-center bg-[var(--c-ink)]">
          <span className="text-[32px] leading-none font-black tracking-[-0.06em] text-[var(--c-acc)]">
            RS
          </span>
        </div>
        <div>
          <p className="text-[24px] leading-none font-black tracking-[-0.04em] uppercase">
            Rive-Sud Mécanique
          </p>
          <p className="mt-1.5 text-[12px] tracking-[0.24em] text-[#4e5049] uppercase">
            Entretien · Freins · Pneus
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {palette.map(([hex, nom]) => (
          <div key={hex} className="overflow-hidden border border-black/10">
            <div aria-hidden className="h-9" style={{ background: hex }} />
            <div className="bg-white px-1.5 py-1">
              <p className="text-[11px] font-semibold">{nom}</p>
              <p className="font-mono text-[11px] text-[#5a5c55]">{hex}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-black/10 pt-3">
        <p className="text-[11px] tracking-[0.2em] text-[#5a5c55] uppercase">
          Caractère
        </p>
        <p className="mt-1 text-[28px] leading-none font-black tracking-[-0.04em]">
          Aa Bb Cc 0123
        </p>
        <p className="mt-2 max-w-[52ch] text-[13px] leading-relaxed text-[#4e5049]">
          Une graisse noire pour l&apos;enseigne et les plaques, une grasse
          normale pour les factures et la signalétique d&apos;atelier.
        </p>
      </div>
    </div>
  );
}
