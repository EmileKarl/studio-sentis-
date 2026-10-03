"use client";

import { Bell, Check, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Section } from "@/components/layout/section";
import { SpecBlock } from "@/components/sections/spec-block";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAnimate } from "@/components/ui/text-animate";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const ROWS = [
  { id: "TKN-001", name: "--signal-aa", ratio: "4.7:1", state: "Validé" },
  { id: "TKN-002", name: "--ink-muted", ratio: "5.1:1", state: "Validé" },
  { id: "TKN-003", name: "--warning", ratio: "4.6:1", state: "Corrigé" },
];

export function ComponentsDemo() {
  return (
    <>
      <Section index="A" title="Contrôles" className="bg-surface-2 pt-0">
        <div className="grid gap-6 lg:grid-cols-2">
          <SpecBlock
            name="Button"
            source="ui/button.tsx"
            a11y="Élément <button> natif. cursor-pointer global, anneau de focus visible au clavier, état disabled non focusable."
          >
            <Button className="rounded-xs">Principal</Button>
            <Button variant="outline" className="rounded-xs">Contour</Button>
            <Button variant="ghost" className="rounded-xs">Discret</Button>
            <Button variant="destructive" className="rounded-xs">
              <Trash2 aria-hidden /> Supprimer
            </Button>
            <Button size="icon" variant="outline" aria-label="Rechercher" className="rounded-xs">
              <Search aria-hidden />
            </Button>
          </SpecBlock>

          <SpecBlock
            name="Switch · Checkbox · Radio"
            source="ui/switch.tsx, checkbox.tsx, radio-group.tsx"
            a11y="Chaque contrôle est lié à un <Label> par htmlFor. La zone cliquable inclut le label, ce qui porte la cible tactile au-delà de 24 px."
          >
            <div className="flex items-center gap-2">
              <Switch id="c-notif" />
              <Label htmlFor="c-notif">Notifications</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="c-rm" defaultChecked />
              <Label htmlFor="c-rm">Respecter reduced-motion</Label>
            </div>
            <RadioGroup defaultValue="sys" className="flex gap-4">
              {[["light", "Clair"], ["dark", "Sombre"], ["sys", "Système"]].map(([v, l]) => (
                <div key={v} className="flex items-center gap-2">
                  <RadioGroupItem value={v} id={`c-${v}`} />
                  <Label htmlFor={`c-${v}`}>{l}</Label>
                </div>
              ))}
            </RadioGroup>
          </SpecBlock>

          <SpecBlock
            name="Input · Select · Slider"
            source="ui/input.tsx, select.tsx, slider.tsx"
            a11y="Le Select Radix gère les flèches, Début/Fin, la recherche au clavier et le retour du focus au déclencheur à la fermeture."
          >
            <div className="w-full max-w-xs space-y-2">
              <Label htmlFor="c-search">Recherche</Label>
              <Input id="c-search" placeholder="Filtrer les composants" className="rounded-xs" />
            </div>
            <div className="w-full max-w-xs space-y-2">
              <Label htmlFor="c-density">Densité</Label>
              <Select>
                <SelectTrigger id="c-density" className="rounded-xs">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compacte</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="aere">Aérée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full max-w-xs space-y-2">
              <Label htmlFor="c-motion">Intensité du mouvement</Label>
              <Slider id="c-motion" defaultValue={[60]} max={100} step={10} />
            </div>
          </SpecBlock>

          <SpecBlock
            name="Badge · Avatar · Progress"
            source="ui/badge.tsx, avatar.tsx, progress.tsx"
            a11y="Progress porte role=progressbar et aria-valuenow. Le statut n'est jamais porté par la seule couleur : un mot l'accompagne."
          >
            <Badge>
              <Check aria-hidden /> Validé
            </Badge>
            <Badge variant="outline">Prévu</Badge>
            <Badge variant="destructive">Rejeté</Badge>
            <Avatar>
              <AvatarFallback className="rounded-xs">NX</AvatarFallback>
            </Avatar>
            <div className="w-full max-w-xs space-y-2">
              <Label htmlFor="c-prog">Avancement du Niveau 1</Label>
              <Progress id="c-prog" value={72} />
            </div>
          </SpecBlock>
        </div>
      </Section>

      <Section index="B" title="Navigation, overlays et feedback">
        <div className="grid gap-6 lg:grid-cols-2">
          <SpecBlock
            name="Tabs · Breadcrumb"
            source="ui/tabs.tsx, breadcrumb.tsx"
            a11y="Tabs suit le motif ARIA : flèches pour changer d'onglet, Tab pour entrer dans le panneau. Breadcrumb marque la page courante avec aria-current."
          >
            <div className="w-full">
              <Breadcrumb className="mb-4">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/nexus">NEXUS UI</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Composants</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <Tabs defaultValue="apercu">
                <TabsList>
                  <TabsTrigger value="apercu">Aperçu</TabsTrigger>
                  <TabsTrigger value="etats">États</TabsTrigger>
                </TabsList>
                <TabsContent value="apercu" className="text-ink-secondary max-w-(--content-max) pt-4 text-sm">
                  Le panneau reçoit le focus après la liste d&apos;onglets.
                </TabsContent>
                <TabsContent value="etats" className="text-ink-secondary max-w-(--content-max) pt-4 text-sm">
                  Chargement, vide, erreur et succès sont traités page par page.
                </TabsContent>
              </Tabs>
            </div>
          </SpecBlock>

          <SpecBlock
            name="Dialog · Tooltip · Toast"
            source="ui/dialog.tsx, tooltip.tsx, sonner.tsx"
            a11y="Le Dialog piège le focus, ferme sur Échap et le rend au déclencheur. Le Tooltip s'ouvre aussi au focus clavier, pas seulement au survol."
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xs">Ouvrir la modale</Button>
              </DialogTrigger>
              <DialogContent className="rounded-xs">
                <DialogHeader>
                  <DialogTitle className="font-display">Confirmer</DialogTitle>
                  <DialogDescription>
                    Échap ferme la modale et rend le focus au bouton
                    d&apos;origine.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button className="rounded-xs">Confirmer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications" className="rounded-xs">
                  <Bell aria-hidden />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Trois alertes non lues</TooltipContent>
            </Tooltip>
            <Button
              variant="outline"
              className="rounded-xs"
              onClick={() => toast.success("Tokens revalidés", {
                description: "Aucun échec de contraste détecté.",
              })}
            >
              Déclencher un toast
            </Button>
          </SpecBlock>

          <SpecBlock
            name="Accordion · Alert"
            source="ui/accordion.tsx, alert.tsx"
            a11y="L'en-tête d'accordéon est un bouton portant aria-expanded. L'alerte porte role=alert et son titre précède la description."
          >
            <div className="w-full space-y-4">
              <Alert className="rounded-xs">
                <AlertTitle className="font-display">Portée de cette livraison</AlertTitle>
                <AlertDescription className="max-w-(--content-max)">
                  Niveau 1 (Foundation) du §17. Motion Lab, Gallery, Dashboard,
                  Settings et Documentation ne sont pas construits.
                </AlertDescription>
              </Alert>
              <Accordion type="single" collapsible className="border-rule border-t">
                <AccordionItem value="q1">
                  <AccordionTrigger>Pourquoi pas GSAP tout de suite ?</AccordionTrigger>
                  <AccordionContent className="max-w-(--content-max)">
                    Le §17 l&apos;interdit : « une animation impressionnante sur
                    une mauvaise structure reste une mauvaise expérience ». GSAP
                    arrive au Niveau 3, sur le Motion Lab.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>Pourquoi le scroll horizontal est-il natif ?</AccordionTrigger>
                  <AccordionContent className="max-w-(--content-max)">
                    Scroll-snap natif garde le geste tactile du système et le
                    clavier sans code supplémentaire. ScrollTrigger sera réservé
                    aux séquences que le natif ne sait pas produire.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </SpecBlock>

          <SpecBlock
            name="États de chargement et vide"
            source="ui/skeleton.tsx, card.tsx"
            a11y="Le squelette est aria-hidden et doublé d'un texte de statut en aria-live, sinon le lecteur d'écran n'annonce rien pendant l'attente."
          >
            <div className="w-full space-y-3">
              <div aria-hidden className="space-y-2">
                <Skeleton className="h-4 w-2/3 rounded-xs" />
                <Skeleton className="h-4 w-1/2 rounded-xs" />
              </div>
              <p role="status" className="text-ink-muted text-xs">
                Chargement des tokens…
              </p>
              <Card className="rounded-xs">
                <CardHeader>
                  <CardTitle className="font-display text-base">Aucun résultat</CardTitle>
                </CardHeader>
                <CardContent className="text-ink-secondary text-sm">
                  Aucun composant ne correspond au filtre. Élargissez la
                  recherche ou réinitialisez les critères.
                </CardContent>
              </Card>
            </div>
          </SpecBlock>
        </div>
      </Section>

      <Section index="C" title="Données et motion" className="bg-surface-2">
        <div className="grid gap-6 lg:grid-cols-2">
          <SpecBlock
            name="Table"
            source="ui/table.tsx"
            a11y="En-têtes <th scope=col>, chiffres en tabular-nums, conteneur défilant horizontalement sous 640 px plutôt qu'un tableau qui déborde."
          >
            <div className="w-full min-w-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Réf.</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Contraste</TableHead>
                    <TableHead>État</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ROWS.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-xs">{row.id}</TableCell>
                      <TableCell className="font-mono text-xs">{row.name}</TableCell>
                      <TableCell className="tabular-nums">{row.ratio}</TableCell>
                      <TableCell>
                        <Badge variant={row.state === "Corrigé" ? "outline" : "default"}>
                          {row.state}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SpecBlock>

          <SpecBlock
            name="NumberTicker · TextAnimate"
            source="ui/number-ticker.tsx, text-animate.tsx (Magic UI)"
            a11y="Les deux respectent prefers-reduced-motion via la règle globale de motion.css : la valeur finale est rendue immédiatement, jamais un compteur figé à zéro."
          >
            <div className="w-full space-y-4">
              <p className="font-display text-ink text-5xl font-bold tabular-nums">
                <NumberTicker value={4} decimalPlaces={1} />
                <span className="text-ink-muted text-2xl"> : 1</span>
              </p>
              <p className="text-ink-muted text-xs">
                Ratio de contraste minimal rejeté par le détecteur.
              </p>
              <TextAnimate
                animation="blurInUp"
                by="word"
                once
                className="text-ink-secondary min-w-0 text-sm leading-relaxed"
              >
                Le mouvement sert la compréhension, sinon il est retiré.
              </TextAnimate>
            </div>
          </SpecBlock>
        </div>
      </Section>
    </>
  );
}
