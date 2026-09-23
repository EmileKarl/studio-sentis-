import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ScrollProgress } from "@/components/ui/scroll-progress";

/** Chrome des pages vitrine : barre de progression, en-tête, pied de page. */
export default function ShowcaseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenu"
        className="focus-visible:ring-signal bg-ink text-paper sr-only rounded-xs px-4 py-2 focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:ring-2"
      >
        Aller au contenu
      </a>
      <ScrollProgress />
      <SiteHeader />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
