"use client";

import { AlertTriangle, RotateCw, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { Stat } from "@/lib/stats";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/** Une seule série : un axe, pas de légende — le titre nomme la mesure. */
const CHART_CONFIG = {
  constats: { label: "Constats", color: "var(--chart-1)" },
} satisfies ChartConfig;

const RUNS = [
  { run: "r01", constats: 124 },
  { run: "r02", constats: 55 },
  { run: "r03", constats: 18 },
  { run: "r04", constats: 10 },
  { run: "r05", constats: 3 },
  { run: "r06", constats: 0 },
  { run: "r07", constats: 18 },
  { run: "r08", constats: 0 },
];

type Row = {
  id: string;
  controle: string;
  portee: string;
  constats: number;
  etat: "vert" | "corrige" | "assume";
};

const ROWS: Row[] = [
  { id: "C-01", controle: "TypeScript strict", portee: "src/**", constats: 0, etat: "vert" },
  { id: "C-02", controle: "ESLint", portee: "src/**, tests/**", constats: 0, etat: "vert" },
  { id: "C-03", controle: "Build production", portee: "6 routes", constats: 0, etat: "vert" },
  { id: "C-04", controle: "Débordement horizontal", portee: "5 pages × 9 largeurs × 2 thèmes", constats: 0, etat: "vert" },
  { id: "C-05", controle: "Cibles tactiles ≥ 24 px", portee: "375 px", constats: 0, etat: "corrige" },
  { id: "C-06", controle: "Texte invisible dans le viewport", portee: "5 pages", constats: 0, etat: "corrige" },
  { id: "C-07", controle: "Contraste des tokens", portee: "toutes les paires texte/surface", constats: 0, etat: "corrige" },
  { id: "C-08", controle: "Synchronisation des tokens de motion", portee: "motion.css ↔ motion.ts", constats: 0, etat: "vert" },
  { id: "C-09", controle: "Cartes imbriquées", portee: "Composants, Motion Lab", constats: 27, etat: "assume" },
  { id: "C-10", controle: "Padding au ras d'une bordure", portee: "grilles à filet unique", constats: 9, etat: "assume" },
  { id: "C-11", controle: "transition: height", portee: "accordéon shadcn", constats: 4, etat: "assume" },
  { id: "C-12", controle: "Contraste d'un contrôle désactivé", portee: "Design System", constats: 1, etat: "assume" },
];

const ETATS: Record<Row["etat"], { label: string; className: string }> = {
  vert: { label: "Au vert", className: "bg-success/12 text-success border-success/30" },
  corrige: { label: "Corrigé", className: "bg-info/12 text-info border-info/30" },
  assume: { label: "Assumé", className: "bg-warning/12 text-warning border-warning/30" },
};

type Etat = "ok" | "chargement" | "erreur";

export function DashboardPanels({ stats }: { stats: Stat[] }) {
  const [query, setQuery] = useState("");
  const [filtre, setFiltre] = useState<Row["etat"] | "tous">("tous");
  const [etat, setEtat] = useState<Etat>("ok");

  const rows = useMemo(
    () =>
      ROWS.filter(
        (row) =>
          (filtre === "tous" || row.etat === filtre) &&
          (query === "" ||
            `${row.id} ${row.controle} ${row.portee}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      ),
    [query, filtre],
  );

  return (
    <div className="min-w-0 space-y-6">
      <h1 className="font-display text-ink text-2xl font-semibold tracking-tight">
        Vue d&apos;ensemble
      </h1>

      {/* --- Statistiques ------------------------------------------------ */}
      <dl className="border-rule grid grid-cols-1 gap-px border sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-paper p-5">
            <dt className="text-ink-muted font-mono text-[11px] tracking-[0.18em] uppercase">
              {stat.label}
            </dt>
            <dd className="font-display text-ink mt-2 text-3xl font-bold tabular-nums">
              {stat.value}
            </dd>
            <p className="text-ink-muted mt-1 text-xs leading-relaxed text-pretty">
              {stat.detail}
            </p>
          </div>
        ))}
      </dl>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* --- Graphique ------------------------------------------------- */}
        <section
          id="verifications"
          aria-labelledby="h-chart"
          className="border-rule bg-paper min-w-0 border p-5"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="h-chart" className="font-display text-ink text-lg font-semibold tracking-tight">
              Constats par exécution de vérification
            </h2>
            <Badge variant="outline" className="font-mono text-[11px]">
              données de démonstration
            </Badge>
          </div>
          <p className="text-ink-secondary mt-1 max-w-(--content-max) text-sm">
            Une seule mesure, un seul axe. Le titre nomme la série, donc aucune
            légende n&apos;est nécessaire.
          </p>

          <ChartContainer config={CHART_CONFIG} className="mt-6 h-56 w-full">
            <AreaChart data={RUNS} margin={{ left: 4, right: 12, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="fill-constats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-constats)" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="var(--color-constats)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              {/* Grille et axes récessifs : ils situent, ils ne s'exposent pas. */}
              <CartesianGrid vertical={false} stroke="var(--rule)" />
              <XAxis
                dataKey="run"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="var(--ink-muted)"
                fontSize={11}
              />
              <YAxis
                width={28}
                tickLine={false}
                axisLine={false}
                stroke="var(--ink-muted)"
                fontSize={11}
              />
              <ChartTooltip cursor={{ stroke: "var(--rule-strong)" }} content={<ChartTooltipContent />} />
              <Area
                dataKey="constats"
                type="monotone"
                stroke="var(--color-constats)"
                strokeWidth={2}
                fill="url(#fill-constats)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--paper)" }}
              />
            </AreaChart>
          </ChartContainer>

          <p className="text-ink-secondary mt-4 max-w-(--content-max) text-sm leading-relaxed text-pretty">
            La remontée à r07 est l&apos;ajout du Motion Lab : une plage de
            transformation sortie de [0, 1] levait une erreur à chaque
            chargement. Corrigée en r08.
          </p>
        </section>

        {/* --- Activité ---------------------------------------------------- */}
        <section
          id="activite"
          aria-labelledby="h-activite"
          className="border-rule bg-paper min-w-0 border p-5"
        >
          <h2 id="h-activite" className="font-display text-ink text-lg font-semibold tracking-tight">
            Activité récente
          </h2>
          <ol className="mt-5 space-y-0">
            {[
              ["r08", "Palette de graphiques revalidée", "L'ancien jeu échouait la bande de clarté, le plancher de chroma et la séparation en vision normale. Remplacé et revérifié sur les deux thèmes."],
              ["r07", "Motion Lab ajouté", "Neuf familles d'animation, une erreur runtime détectée et corrigée."],
              ["r06", "Contrôle « texte invisible » ajouté", "Descend chaque page par écrans et refuse tout texte transparent dans le viewport."],
              ["r05", "Sections épinglées", "L'état actif est passé de l'opacité à un filet d'accent : le texte tombait à 1,8:1."],
            ].map(([ref, titre, corps]) => (
              <li key={ref} className="border-rule flex gap-4 border-b py-4 first:pt-0 last:border-b-0 last:pb-0">
                <span className="text-signal-aa font-mono text-xs tabular-nums">{ref}</span>
                <div className="min-w-0">
                  <p className="text-ink text-sm font-medium text-pretty">{titre}</p>
                  <p className="text-ink-secondary mt-1 text-xs leading-relaxed text-pretty">
                    {corps}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* --- Tableau et ses états réels ------------------------------------ */}
      <section aria-labelledby="h-table" className="border-rule bg-paper min-w-0 border">
        <div className="border-rule flex flex-wrap items-end justify-between gap-4 border-b p-5">
          <div>
            <h2 id="h-table" className="font-display text-ink text-lg font-semibold tracking-tight">
              Contrôles qualité
            </h2>
            <p className="text-ink-secondary mt-1 max-w-(--content-max) text-sm">
              Filtrez, videz le filtre, ou forcez l&apos;état de chargement et
              d&apos;erreur : les trois sont de vrais rendus, pas des maquettes.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="q" className="font-mono text-[11px] tracking-[0.18em] uppercase">
                Filtrer
              </Label>
              <Input
                id="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nom ou portée"
                className="h-8 w-44 rounded-xs"
              />
            </div>
            <div
              role="radiogroup"
              aria-label="Filtrer par état"
              className="border-rule flex gap-0.5 rounded-xs border p-0.5"
            >
              {(["tous", "vert", "corrige", "assume"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={filtre === key}
                  onClick={() => setFiltre(key)}
                  className={cn(
                    "focus-visible:ring-signal rounded-xs px-2.5 py-1 font-mono text-[11px] transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    filtre === key
                      ? "bg-ink text-paper"
                      : "text-ink-secondary hover:bg-surface-2 hover:text-ink",
                  )}
                >
                  {key === "tous" ? "Tous" : ETATS[key].label}
                </button>
              ))}
            </div>
            <div className="flex gap-0.5">
              {(["ok", "chargement", "erreur"] as const).map((key) => (
                <Button
                  key={key}
                  type="button"
                  size="sm"
                  variant={etat === key ? "default" : "outline"}
                  className="h-8 rounded-xs font-mono text-[11px]"
                  onClick={() => setEtat(key)}
                >
                  {key}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {etat === "chargement" ? (
          <div className="p-5">
            <div aria-hidden className="space-y-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-xs" />
              ))}
            </div>
            <p role="status" className="text-ink-muted mt-4 text-xs">
              Chargement des contrôles…
            </p>
          </div>
        ) : etat === "erreur" ? (
          <div role="alert" className="flex flex-col items-start gap-3 p-8">
            <AlertTriangle className="text-error size-5" aria-hidden />
            <div>
              <p className="font-display text-ink text-base font-semibold">
                Impossible de charger les contrôles
              </p>
              <p className="text-ink-secondary mt-1 max-w-(--content-max) text-sm text-pretty">
                La dernière exécution n&apos;a pas produit de rapport. Les
                résultats précédents restent consultables dans l&apos;historique.
              </p>
            </div>
            <Button size="sm" className="rounded-xs" onClick={() => setEtat("ok")}>
              <RotateCw aria-hidden /> Réessayer
            </Button>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-start gap-3 p-8">
            <SearchX className="text-ink-muted size-5" aria-hidden />
            <div>
              <p className="font-display text-ink text-base font-semibold">
                Aucun contrôle ne correspond
              </p>
              <p className="text-ink-secondary mt-1 max-w-(--content-max) text-sm text-pretty">
                Aucun résultat pour « {query || ETATS[filtre as Row["etat"]]?.label} ».
                Élargissez la recherche ou réinitialisez le filtre.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xs"
              onClick={() => {
                setQuery("");
                setFiltre("tous");
              }}
            >
              Réinitialiser
            </Button>
          </div>
        ) : (
          <div className="w-full min-w-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Réf.</TableHead>
                  <TableHead>Contrôle</TableHead>
                  <TableHead>Portée</TableHead>
                  <TableHead className="text-right">Constats</TableHead>
                  <TableHead>État</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs">{row.id}</TableCell>
                    <TableCell className="text-sm">{row.controle}</TableCell>
                    {/* Contenu long : il s'enroule au lieu d'élargir le tableau. */}
                    <TableCell className="text-ink-secondary max-w-[22rem] text-xs text-pretty">
                      {row.portee}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {row.constats}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-mono text-[11px]", ETATS[row.etat].className)}>
                        {ETATS[row.etat].label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <p aria-live="polite" className="border-rule text-ink-muted border-t px-5 py-2.5 font-mono text-xs">
          {etat === "ok" ? `${rows.length} contrôle(s) sur ${ROWS.length}` : `état : ${etat}`}
        </p>
      </section>
    </div>
  );
}
