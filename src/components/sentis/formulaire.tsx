"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Dict } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/site";

type Erreurs = Partial<Record<"nom" | "courriel" | "message", string>>;

/**
 * Formulaire de demande de soumission.
 *
 * Il n'y a pas encore de service d'envoi de courriel pour ce site : plutôt que
 * de simuler un envoi qui n'arriverait nulle part — le pire des deux mondes,
 * puisque le visiteur croit avoir écrit — le formulaire compose le message et
 * le remet au logiciel de courrier du visiteur. La page le dit avant qu'il
 * clique, et l'adresse directe reste affichée pour ceux qui préfèrent.
 *
 * La validation est côté client et le champ fautif reçoit le focus : sans
 * cela, sur un formulaire long, l'erreur se produit hors de l'écran et
 * personne ne comprend pourquoi rien ne se passe.
 */
export function FormulaireSoumission({ dict }: { dict: Dict }) {
  const c = dict.pages.contact;
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");

  function soumettre(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nom = String(data.get("nom") ?? "").trim();
    const courriel = String(data.get("courriel") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const trouvees: Erreurs = {};
    if (!nom) trouvees.nom = c.erreurs.nom;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(courriel)) trouvees.courriel = c.erreurs.courriel;
    if (message.length < 10) trouvees.message = c.erreurs.message;

    setErreurs(trouvees);
    const premier = Object.keys(trouvees)[0];
    if (premier) {
      document.getElementById(premier)?.focus();
      return;
    }

    const corps = [
      `${c.champs.nom} : ${nom}`,
      `${c.champs.entreprise} : ${String(data.get("entreprise") ?? "")}`,
      `${c.champs.courriel} : ${courriel}`,
      `${c.champs.telephone} : ${String(data.get("telephone") ?? "")}`,
      `${c.champs.service} : ${service}`,
      `${c.champs.budget} : ${budget}`,
      "",
      message,
    ].join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `${c.titre} — ${nom}`,
    )}&body=${encodeURIComponent(corps)}`;
  }

  return (
    <form onSubmit={soumettre} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Champ id="nom" label={c.champs.nom} erreur={erreurs.nom} requis>
          <Input
            id="nom"
            name="nom"
            autoComplete="name"
            aria-invalid={Boolean(erreurs.nom)}
            aria-describedby={erreurs.nom ? "nom-erreur" : undefined}
            className="rounded-md"
          />
        </Champ>
        <Champ id="entreprise" label={c.champs.entreprise} note={c.champs.optionnel}>
          <Input
            id="entreprise"
            name="entreprise"
            autoComplete="organization"
            className="rounded-md"
          />
        </Champ>
        <Champ id="courriel" label={c.champs.courriel} erreur={erreurs.courriel} requis>
          <Input
            id="courriel"
            name="courriel"
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(erreurs.courriel)}
            aria-describedby={erreurs.courriel ? "courriel-erreur" : undefined}
            className="rounded-md"
          />
        </Champ>
        <Champ id="telephone" label={c.champs.telephone} note={c.champs.optionnel}>
          <Input
            id="telephone"
            name="telephone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className="rounded-md"
          />
        </Champ>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Champ id="service" label={c.champs.service}>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger id="service" className="w-full rounded-md">
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              {c.services.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Champ>
        <Champ id="budget" label={c.champs.budget} note={c.champs.optionnel}>
          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger id="budget" className="w-full rounded-md">
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              {c.budgets.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Champ>
      </div>

      <Champ id="message" label={c.champs.message} erreur={erreurs.message} requis>
        <Textarea
          id="message"
          name="message"
          rows={6}
          aria-invalid={Boolean(erreurs.message)}
          aria-describedby={erreurs.message ? "message-erreur" : undefined}
          className="rounded-md"
        />
      </Champ>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" className="rounded-md text-base">
          <Send aria-hidden /> {c.envoyer}
        </Button>
        <p className="text-ink-muted max-w-(--content-max) text-sm">{c.ouverture}</p>
      </div>
    </form>
  );
}

function Champ({
  id,
  label,
  note,
  erreur,
  requis,
  children,
}: {
  id: string;
  label: string;
  note?: string;
  erreur?: string;
  requis?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-baseline gap-2">
        {label}
        {requis ? (
          <span className="text-signal-aa" aria-hidden>
            *
          </span>
        ) : null}
        {note ? <span className="text-ink-muted text-xs">({note})</span> : null}
      </Label>
      {/* aria-invalid et aria-describedby sont posés explicitement sur chaque
          contrôle à l'appel : les poser ici obligerait à cloner l'enfant, ce
          qui casse silencieusement dès qu'on change de composant. */}
      {children}
      {erreur ? (
        <p id={`${id}-erreur`} role="alert" className="text-error text-sm">
          {erreur}
        </p>
      ) : null}
    </div>
  );
}
