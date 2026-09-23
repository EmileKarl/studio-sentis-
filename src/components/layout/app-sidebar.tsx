"use client";

import {
  Activity,
  ArrowUpRight,
  LayoutGrid,
  ListChecks,
  Palette,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const SECTIONS = [
  {
    label: "Pilotage",
    items: [
      { href: "/nexus/dashboard", label: "Vue d'ensemble", Icon: LayoutGrid, badge: null },
      { href: "/nexus/dashboard#verifications", label: "Vérifications", Icon: ListChecks, badge: "4" },
      { href: "/nexus/dashboard#activite", label: "Activité", Icon: Activity, badge: null },
    ],
  },
  {
    label: "Système",
    items: [
      { href: "/nexus/design-system", label: "Design system", Icon: Palette, badge: null },
      { href: "/nexus/components", label: "Composants", Icon: SlidersHorizontal, badge: "38" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-rule border-b">
        <Link
          href="/nexus"
          className="focus-visible:ring-signal flex items-baseline gap-2 px-2 py-1.5 focus-visible:ring-2 focus-visible:outline-none group-data-[collapsible=icon]:px-0"
        >
          <span className="font-display text-sidebar-foreground text-sm font-bold tracking-[0.18em] uppercase">
            N
          </span>
          <span className="bg-signal size-1.5 rounded-full group-data-[collapsible=icon]:hidden" aria-hidden />
          <span className="text-ink-muted font-mono text-[11px] tracking-[0.18em] uppercase group-data-[collapsible=icon]:hidden">
            Nexus UI
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {SECTIONS.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="font-mono text-[11px] tracking-[0.2em] uppercase">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map(({ href, label, Icon, badge }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === href}
                      tooltip={label}
                    >
                      <Link href={href}>
                        <Icon aria-hidden />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {badge ? (
                      <SidebarMenuBadge className="font-mono tabular-nums">
                        {badge}
                      </SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-rule border-t">
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:flex-col">
          <ThemeToggle />
          <Link
            href="/nexus"
            className="text-ink-muted hover:text-ink focus-visible:ring-signal flex items-center gap-1 rounded-xs px-1 py-1 font-mono text-[11px] transition-colors focus-visible:ring-2 focus-visible:outline-none group-data-[collapsible=icon]:hidden"
          >
            Vitrine <ArrowUpRight className="size-3" aria-hidden />
          </Link>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
