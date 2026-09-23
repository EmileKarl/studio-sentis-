export type NavItem = {
  href: string;
  label: string;
  description: string;
  status: "live" | "planned";
};

/** Pages du cahier des charges §9. `status` dit la vérité sur l'avancement. */
export const NAV: NavItem[] = [
  {
    href: "/nexus/design-system",
    label: "Design System",
    description: "Couleurs, typographie, espacements, rayons, ombres, motion.",
    status: "live",
  },
  {
    href: "/nexus/components",
    label: "Composants",
    description: "Boutons, formulaires, navigation, cartes, overlays, feedback.",
    status: "live",
  },
  {
    href: "/nexus/motion",
    label: "Motion Lab",
    description: "Fade, stagger, reveal, scroll, parallaxe, transitions de page.",
    status: "live",
  },
  {
    href: "/nexus/gallery",
    label: "Gallery",
    description: "Grilles, patterns, compositions, variantes de sections.",
    status: "live",
  },
  {
    href: "/nexus/dashboard",
    label: "Dashboard",
    description: "Sidebar, statistiques, graphiques, tableaux, filtres.",
    status: "live",
  },
  {
    href: "/nexus/docs",
    label: "Documentation",
    description: "Installation, architecture, conventions, contribution.",
    status: "planned",
  },
];

export const LIVE_NAV = NAV.filter((item) => item.status === "live");
