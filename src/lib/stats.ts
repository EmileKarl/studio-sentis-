import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { NAV } from "@/lib/nav";

/**
 * Les chiffres affichés sur la landing sont comptés sur le disque au moment du
 * build, jamais saisis à la main. Un compteur décoratif qui ne correspond à
 * rien est exactement ce que PRODUCT.md interdit ; celui-ci ne peut pas mentir
 * et se met à jour tout seul quand le projet grossit.
 *
 * Les chemins sont écrits en littéral et non passés en paramètre : Turbopack
 * doit pouvoir les analyser statiquement, sinon il trace tout le projet dans
 * le bundle serveur et y embarque jusqu'au dossier public.
 */
const DECLARATION = /^\s+--[a-z0-9-]+:/gm;

function count(css: string): number {
  return (css.match(DECLARATION) ?? []).length;
}

export type Stat = {
  value: number;
  label: string;
  detail: string;
};

export function getStats(): Stat[] {
  const components = readdirSync(
    join(process.cwd(), "src/components/ui"),
  ).filter((file) => file.endsWith(".tsx")).length;

  const tokens = count(
    readFileSync(join(process.cwd(), "src/styles/tokens.css"), "utf8"),
  );
  const motion = count(
    readFileSync(join(process.cwd(), "src/styles/motion.css"), "utf8"),
  );

  return [
    {
      value: components,
      label: "Composants",
      detail: "Fichiers dans src/components/ui, comptés au build.",
    },
    {
      value: tokens,
      label: "Design tokens",
      detail: "Déclarations dans tokens.css, modes clair et sombre réunis.",
    },
    {
      value: motion,
      label: "Motion tokens",
      detail: "Durées, courbes, délais, stagger et distances.",
    },
    {
      value: NAV.length,
      label: "Pages prévues",
      detail: `${NAV.filter((n) => n.status === "live").length} construites à ce jour.`,
    },
  ];
}
