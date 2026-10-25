"use client";

import { Send } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";

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
import { envoyerSoumission, type EtatSoumission } from "@/lib/soumission";

type Champ = "nom" | "courriel" | "message";
type Erreurs = Partial<Record<Champ, string>>;

const DEPART: EtatSoumission = { etat: "repos" };

/**
 * Formulaire de demande de soumission.
 *
 * ## Il envoie vraiment, maintenant
 *
 * La version précédente composait un `mailto:` et remettait le message au
 * logiciel de courriel du visiteur. Sur un téléphone, où beaucoup de gens
 * lisent leur courriel dans le navigateur sans logiciel configuré, le bouton
 * ne faisait **rien** — et ces demandes-là étaient perdues sans que personne
 * ne le sache. L'envoi passe désormais par une action serveur et le SMTP du
 * studio.
 *
 * ## Le `mailto:` n'a pas disparu pour autant
 *
 * Il devient le filet. Si le serveur tombe, ou tant que les identifiants
 * SMTP ne sont pas posés, le formulaire propose d'ouvrir le message déjà
 * rempli dans le logiciel du visiteur. Un formulaire qui dit « réessayez
 * plus tard » perd la demande ; celui-ci la garde.
 *
 * ## Deux validations, pas une
 *
 * Celle du navigateur donne la réponse immédiate et met le focus sur le
 * champ fautif — sans cela, sur un formulaire long, l'erreur se produit hors
 * de l'écran et personne ne comprend pourquoi rien ne se passe. Celle du
 * serveur fait foi : elle est la seule qu'un robot ne peut pas contourner.
 */
export function FormulaireSoumission({
  dict,
  envoiActif,
}: {
  dict: Dict;
  /**
   * Faux tant que les identifiants SMTP ne sont pas posés chez l'hébergeur.
   *
   * Sans ce drapeau, le formulaire enverrait quand même, l'action répondrait
   * « non configuré », et **chaque visiteur verrait une erreur** avant
   * d'obtenir le filet. Ce serait pire que l'ancien comportement. Lu sur le
   * serveur au rendu de la page : le jour où la variable existe, le
   * formulaire bascule tout seul au déploiement suivant.
   */
  envoiActif: boolean;
}) {
  const c = dict.pages.contact;
  const [etat, agir, enCours] = useActionState(envoyerSoumission, DEPART);
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  /** Le corps du dernier envoi, pour le filet `mailto:` en cas de panne. */
  const [dernierCorps, setDernierCorps] = useState("");
  const [dernierNom, setDernierNom] = useState("");
  const horodatage = useRef<HTMLInputElement>(null);
  /**
   * Verrou anti-double-envoi.
   *
   * Sans lui, deux clics rapides sur « Envoyer » posent deux fois
   * `window.location.href`. Sur la plupart des systèmes le second écrase le
   * premier et ça ne se voit pas ; sur certains clients de messagerie, deux
   * navigations `mailto:` successives ouvrent **deux brouillons**, et le
   * visiteur croit avoir écrit deux fois. C'est le défaut classique du bouton
   * d'envoi, et il existe même quand l'envoi n'est pas une requête réseau.
   *
   * `useRef` et non `useState` : la navigation part dans le même tour que le
   * clic, avant qu'un rendu ait eu lieu, donc un état n'aurait pas encore
   * changé quand le second clic arrive. Une référence, elle, est à jour tout
   * de suite.
   */
  // Le temps de remplissage, posé au montage. Un robot qui envoie le
  // formulaire en moins de deux secondes et demie n'a rien lu. Le champ reste
  // vide sans JavaScript, et l'action ne vérifie alors rien plutôt que de
  // bloquer quelqu'un.
  useEffect(() => {
    if (horodatage.current) horodatage.current.value = String(Date.now());
  }, []);

  function verifier(event: React.FormEvent<HTMLFormElement>) {
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
      // On annule l'action serveur : rien ne part tant que c'est incomplet.
      event.preventDefault();
      document.getElementById(premier)?.focus();
      return;
    }

    // Gardé pour le filet : si l'envoi échoue, on sait quoi mettre dans le
    // brouillon sans redemander au visiteur de tout retaper.
    setDernierNom(nom);
    const corps = (
      [
        `${c.champs.nom} : ${nom}`,
        `${c.champs.entreprise} : ${String(data.get("entreprise") ?? "")}`,
        `${c.champs.courriel} : ${courriel}`,
        `${c.champs.telephone} : ${String(data.get("telephone") ?? "")}`,
        `${c.champs.service} : ${service}`,
        `${c.champs.budget} : ${budget}`,
        "",
        message,
      ].join("\n")
    );
    setDernierCorps(corps);

    // Envoi inactif : on reprend exactement l'ancien chemin — le message part
    // dans le logiciel du visiteur, et l'action serveur n'est jamais appelée.
    if (!envoiActif) {
      event.preventDefault();
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        `${c.titre} — ${nom}`,
      )}&body=${encodeURIComponent(corps)}`;
    }
  }

  const lienDeRepli = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `${c.titre} — ${dernierNom}`,
  )}&body=${encodeURIComponent(dernierCorps)}`;

  // Le serveur a le dernier mot sur la validité : ses champs fautifs
  // s'ajoutent à ceux que le navigateur avait laissés passer.
  const fautif = (champ: Champ) =>
    Boolean(erreurs[champ]) || (etat.etat === "invalide" && etat.champs.includes(champ));

  if (etat.etat === "envoye") {
    return (
      <div className="border-rule bg-surface rounded-md border p-8">
        <p className="text-2xl font-semibold">{c.succesTitre}</p>
        <p className="text-ink-muted mt-3 max-w-(--content-max)">{c.succesTexte}</p>
        <Button
          type="button"
          variant="outline"
          className="mt-6 rounded-md"
          onClick={() => window.location.reload()}
        >
          {c.succesRecommencer}
        </Button>
      </div>
    );
  }

  return (
    <form action={agir} onSubmit={verifier} noValidate className="space-y-6">
      {/* Le piege a robots : invisible a l'oeil et au lecteur d'ecran, hors
          du parcours au clavier. Un humain ne le remplit jamais. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="site">Ne remplissez pas ce champ</label>
        <input id="site" name="site" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={horodatage} type="hidden" name="horodatage" />

      <div className="grid gap-6 sm:grid-cols-2">
        <Champ id="nom" label={c.champs.nom} erreur={fautif("nom") ? c.erreurs.nom : undefined} requis>
          <Input
            id="nom"
            name="nom"
            autoComplete="name"
            aria-invalid={fautif("nom")}
            aria-describedby={fautif("nom") ? "nom-erreur" : undefined}
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
        <Champ id="courriel" label={c.champs.courriel} erreur={fautif("courriel") ? c.erreurs.courriel : undefined} requis>
          <Input
            id="courriel"
            name="courriel"
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={fautif("courriel")}
            aria-describedby={fautif("courriel") ? "courriel-erreur" : undefined}
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
          <Select name="service" value={service} onValueChange={setService}>
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
          <Select name="budget" value={budget} onValueChange={setBudget}>
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

      <Champ id="message" label={c.champs.message} erreur={fautif("message") ? c.erreurs.message : undefined} requis>
        <Textarea
          id="message"
          name="message"
          rows={6}
          aria-invalid={fautif("message")}
          aria-describedby={fautif("message") ? "message-erreur" : undefined}
          className="rounded-md"
        />
      </Champ>

      {/* Le filet. Le serveur est tombe, ou les identifiants SMTP ne sont pas
          encore poses : plutot que de perdre la demande, on la remet au
          logiciel de courriel du visiteur, deja remplie. */}
      {(etat.etat === "panne" || etat.etat === "non-configure") && (
        <div role="alert" className="border-rule bg-surface rounded-md border p-5">
          <p className="font-semibold">{c.echecTitre}</p>
          <p className="text-ink-muted mt-2 text-sm">{c.echecTexte}</p>
          <Button asChild variant="outline" className="mt-4 rounded-md">
            <a href={lienDeRepli}>{c.echecBouton}</a>
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={enCours}
          aria-busy={enCours}
          className="rounded-md text-base"
        >
          <Send aria-hidden /> {enCours ? c.envoiEnCours : c.envoyer}
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
