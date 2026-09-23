import type { Metadata } from "next";

import { DashboardPanels } from "./panels";
import { DashboardTopbar } from "./topbar";
import { getStats } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Démonstration du design system dans une interface applicative : barre latérale, statistiques, graphique, tableau filtrable, activité et états réels.",
};

export default function DashboardPage() {
  // Les quatre premières valeurs sont comptées sur le disque au build, comme
  // sur la landing. Les séries du graphique sont des données de démonstration,
  // et la page le dit à l'endroit où elles s'affichent.
  const stats = getStats();

  return (
    <>
      <DashboardTopbar />
      <div className="min-w-0 p-4 sm:p-6 lg:p-8">
        <DashboardPanels stats={stats} />
      </div>
    </>
  );
}
