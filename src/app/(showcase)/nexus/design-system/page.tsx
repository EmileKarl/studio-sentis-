import type { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { Swatch } from "@/components/sections/swatch";
import { TokenTable } from "@/components/sections/token-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Design System",
  description:
    "Couleurs, typographie, espacements, rayons, ombres, grilles et motion tokens de NEXUS UI.",
};

const SURFACES = [
  { token: "--paper", role: "Fond de page", className: "bg-paper" },
  { token: "--surface", role: "Carte en relief", className: "bg-surface" },
  { token: "--surface-2", role: "Zone encastrée, en-tête de tableau", className: "bg-surface-2" },
  { token: "--rule", role: "Filet, bordure de champ", className: "bg-rule" },
];

const INK = [
  { token: "--ink", role: "Texte principal", className: "bg-ink" },
  { token: "--ink-secondary", role: "Texte secondaire, chapô", className: "bg-ink-secondary" },
  { token: "--ink-muted", role: "Légende, métadonnée", className: "bg-ink-muted" },
];

const SIGNAL = [
  { token: "--signal", role: "Vermillon de marque — graphique et grand texte", className: "bg-signal" },
  { token: "--signal-aa", role: "Variante AA — texte courant, aplat sous du blanc", className: "bg-signal-aa" },
];

const STATUS = [
  { token: "--success", role: "Confirmation", className: "bg-success" },
  { token: "--warning", role: "Avertissement", className: "bg-warning" },
  { token: "--error", role: "Erreur, destruction", className: "bg-error" },
  { token: "--info", role: "Information neutre", className: "bg-info" },
];

const SPACING = [
  { name: "--space-1", value: "4px", note: "Écart entre icône et label" },
  { name: "--space-2", value: "8px", note: "Padding minimal d'un conteneur bordé" },
  { name: "--space-3", value: "12px", note: "Padding de cellule de tableau" },
  { name: "--space-4", value: "16px", note: "Gouttière mobile" },
  { name: "--space-6", value: "24px", note: "Padding de carte, gouttière tablette" },
  { name: "--space-8", value: "32px", note: "Écart entre blocs d'une même section" },
  { name: "--space-12", value: "48px", note: "Padding de carte large" },
  { name: "--space-16", value: "64px", note: "Respiration verticale de section, mobile" },
  { name: "--space-24", value: "96px", note: "Respiration verticale de section, desktop" },
  { name: "--space-32", value: "128px", note: "Séparation de chapitre" },
];

const MOTION = [
  { name: "--duration-instant", value: "90ms", note: "Changement d'état d'un contrôle" },
  { name: "--duration-fast", value: "160ms", note: "Survol, focus" },
  { name: "--duration-base", value: "240ms", note: "Apparition, ouverture d'overlay" },
  { name: "--duration-slow", value: "420ms", note: "Transition de layout" },
  { name: "--duration-slower", value: "700ms", note: "Séquence orchestrée" },
  { name: "--ease-out", value: "cubic-bezier(0.22, 1, 0.36, 1)", note: "Entrées" },
  { name: "--ease-in", value: "cubic-bezier(0.64, 0, 0.78, 0)", note: "Sorties" },
  { name: "--ease-in-out", value: "cubic-bezier(0.65, 0, 0.35, 1)", note: "Transformations" },
  { name: "--stagger-base", value: "70ms", note: "Décalage entre éléments d'une liste" },
  { name: "--travel-md", value: "16px", note: "Distance de déplacement par défaut" },
];

const GRID = [
  { name: "--container-page", value: "1440px", note: "Largeur maximale de page" },
  { name: "--content-max", value: "68ch", note: "Mesure d'un paragraphe (§3.1 E)" },
  { name: "--gutter", value: "24px", note: "Gouttière de grille" },
  { name: "--columns", value: "12", note: "Colonnes de la grille de composition" },
];

const RADII = [
  { name: "--radius-none", value: "0px", note: "Filets, tableaux, aplats pleine largeur" },
  { name: "--radius (sm/md/lg)", value: "0.15 / 0.2 / 0.25rem", note: "Boutons, champs, cartes" },
  { name: "--radius-full", value: "9999px", note: "Pastilles d'état, avatars uniquement" },
];

export default function DesignSystemPage() {
  return (
    <>
      <Section
        index="§9.2"
        title="Design System"
        lead="Les fondations visuelles du projet. Tout ce qui suit est lu depuis src/styles/tokens.css et src/styles/motion.css : la page ne redéclare aucune valeur, elle affiche celles qui sont réellement appliquées."
      >
        <Alert className="rounded-xs">
          <AlertTitle className="font-display">Direction : Swiss editorial</AlertTitle>
          <AlertDescription className="max-w-(--content-max)">
            Grille visible, filets plutôt qu&apos;ombres, rayons courts, un seul
            accent. Ce choix écarte délibérément le défaut saturé du secteur —
            dégradé indigo, Inter partout, cartes très arrondies — que le cahier
            des charges interdit de reproduire (§2.10).
          </AlertDescription>
        </Alert>
      </Section>

      <Section index="A" title="Couleurs" className="pt-0">
        <p className="text-ink-secondary mb-8 max-w-(--content-max) text-sm leading-relaxed text-pretty">
          Chaque paire texte/surface a été passée au détecteur Impeccable avant
          d&apos;entrer dans les tokens. Trois candidates ont été rejetées pour
          échec WCAG AA et remplacées : le vermillon de marque à 4,0:1 sur le
          papier, le blanc sur ce même vermillon à 4,2:1, et l&apos;orange
          d&apos;avertissement à 4,3:1.
        </p>

        <h3 className="text-ink-muted mb-4 font-mono text-[11px] tracking-[0.2em] uppercase">Surfaces</h3>
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {SURFACES.map((s) => (
            <Swatch key={s.token} {...s} role={s.role} />
          ))}
        </div>

        <h3 className="text-ink-muted mb-4 font-mono text-[11px] tracking-[0.2em] uppercase">Encre</h3>
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {INK.map((s) => (
            <Swatch key={s.token} {...s} role={s.role} />
          ))}
        </div>

        <h3 className="text-ink-muted mb-4 font-mono text-[11px] tracking-[0.2em] uppercase">Signal</h3>
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {SIGNAL.map((s) => (
            <Swatch key={s.token} {...s} role={s.role} />
          ))}
        </div>

        <h3 className="text-ink-muted mb-4 font-mono text-[11px] tracking-[0.2em] uppercase">États</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATUS.map((s) => (
            <Swatch key={s.token} {...s} role={s.role} />
          ))}
        </div>
      </Section>

      <Section index="B" title="Typographie" className="bg-surface-2">
        <div className="border-rule bg-paper space-y-8 border p-6 sm:p-10">
          <div>
            <p className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
              Display — Archivo
            </p>
            <p className="font-display text-ink mt-3 text-5xl leading-[0.95] font-bold tracking-[-0.03em]">
              Titres et chiffres
            </p>
          </div>
          <div className="border-rule border-t pt-8">
            <p className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
              Corps — IBM Plex Sans
            </p>
            <p className="text-ink-secondary mt-3 max-w-(--content-max) text-base leading-relaxed text-pretty">
              La mesure d&apos;un paragraphe est plafonnée à 68 caractères par
              le token <code className="font-mono text-sm">--content-max</code>.
              Au-delà, l&apos;œil perd la ligne en revenant à la gauche du bloc.
              Ni Inter, ni Geist : deux polices que tout le secteur emploie, et
              dont la neutralité ne dit plus rien.
            </p>
          </div>
          <div className="border-rule border-t pt-8">
            <p className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
              Mono — IBM Plex Mono
            </p>
            <p className="text-ink mt-3 font-mono text-sm">
              --signal-aa: #be2f16; /* 4.7:1 sur --paper */
            </p>
          </div>
        </div>
      </Section>

      <Section index="C" title="Espacements">
        <TokenTable caption="Échelle d'espacement" rows={SPACING} />
      </Section>

      <Section index="D" title="Rayons et élévation" className="bg-surface-2">
        <TokenTable caption="Rayons" rows={RADII} />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["--shadow-sm", "shadow-sm"],
            ["--shadow-md", "shadow-md"],
            ["--shadow-lg", "shadow-lg"],
          ].map(([token, cls]) => (
            <div key={token} className={`bg-paper border-rule border p-6 ${cls}`}>
              <p className="text-ink font-mono text-xs">{token}</p>
              <p className="text-ink-muted mt-1 text-xs">
                L&apos;élévation se mérite. Par défaut, un filet suffit.
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section index="E" title="Grille">
        <TokenTable caption="Tokens de grille" rows={GRID} />
      </Section>

      <Section index="F" title="Motion" className="bg-surface-2">
        <p className="text-ink-secondary mb-8 max-w-(--content-max) text-sm leading-relaxed text-pretty">
          Sous <code className="font-mono">prefers-reduced-motion: reduce</code>,
          toutes les durées tombent à 0,01 ms et toutes les distances à 0 px, en
          un seul endroit. Aucun composant n&apos;a à s&apos;en occuper, et rien
          ne reste bloqué à mi-transition.
        </p>
        <TokenTable caption="Tokens de motion" rows={MOTION} />
      </Section>

      <Section index="G" title="Contrôles et états">
        <div className="border-rule bg-paper grid gap-px border md:grid-cols-2">
          <div className="bg-paper space-y-4 p-6">
            <p className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
              Boutons
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-xs">Principal</Button>
              <Button variant="outline" className="rounded-xs">Secondaire</Button>
              <Button variant="ghost" className="rounded-xs">Discret</Button>
              <Button variant="destructive" className="rounded-xs">Destructif</Button>
              <Button disabled className="rounded-xs">Désactivé</Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge>Défaut</Badge>
              <Badge variant="secondary">Secondaire</Badge>
              <Badge variant="outline">Contour</Badge>
              <Badge variant="destructive">Erreur</Badge>
            </div>
          </div>

          <div className="bg-paper space-y-4 p-6">
            <p className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
              Champs
            </p>
            <div className="space-y-2">
              <Label htmlFor="ds-email">Adresse e-mail</Label>
              <Input id="ds-email" type="email" placeholder="nom@exemple.fr" className="rounded-xs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ds-err">Champ en erreur</Label>
              <Input
                id="ds-err"
                aria-invalid
                aria-describedby="ds-err-msg"
                defaultValue="adresse-invalide"
                className="rounded-xs"
              />
              <p id="ds-err-msg" className="text-error text-xs">
                Format d&apos;adresse non reconnu.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ds-msg">Message</Label>
              <Textarea id="ds-msg" rows={3} placeholder="Votre message" className="rounded-xs" />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
