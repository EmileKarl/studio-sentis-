import { Skeleton } from "@/components/ui/skeleton";

/**
 * État de chargement réel de la route, pas une maquette : Next l'affiche
 * pendant que le segment se résout.
 */
export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div aria-hidden className="space-y-6">
        <div className="border-rule grid grid-cols-1 gap-px border sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-paper space-y-2 p-5">
              <Skeleton className="h-3 w-24 rounded-xs" />
              <Skeleton className="h-8 w-16 rounded-xs" />
              <Skeleton className="h-3 w-full rounded-xs" />
            </div>
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <Skeleton className="h-80 w-full rounded-xs" />
          <Skeleton className="h-80 w-full rounded-xs" />
        </div>
      </div>
      <p role="status" className="text-ink-muted mt-6 font-mono text-xs">
        Chargement du tableau de bord…
      </p>
    </div>
  );
}
