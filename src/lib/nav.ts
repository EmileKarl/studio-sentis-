export type NavItem = {
  href: string;
  label: string;
  description: string;
  status: "live" | "planned";
};

/** Pages du cahier des charges §9. `status` dit la vérité sur l'avancement. */
export const NAV: NavItem[] = [
  {
    href: "/design-system",
    label: "Design System",
    description: "Couleurs, typographie, espacements, rayons, ombres, motion.",
    status: "live",
  },
  {
    href: "/components",
    label: "Composants",
    description: "Boutons, formulaires, navigation, cartes, overlays, feedback.",
    status: "live",
  },
  {
    href: "/motion",
    label: "Motion Lab",
    description: "Fade, stagger, reveal, scroll, parallaxe, transitions de page.",
    status: "live",
  },
  {
    href: "/gallery",
    label: "Gallery",
    description: "Grilles, patterns, compositions, variantes de sections.",
    status: "live",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Sidebar, statistiques, graphiques, tableaux, filtres.",
    status: "live",
  },
  {
    href: "/docs",
    label: "Documentation",
    description: "Installation, architecture, conventions, contribution.",
    status: "planned",
  },
];

export const LIVE_NAV = NAV.filter((item) => item.status === "live");
