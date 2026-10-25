"use server";

/**
 * L'envoi réel d'une demande de soumission, par le SMTP de Zoho.
 *
 * ## Ce que ça remplace, et pourquoi
 *
 * Le formulaire composait un `mailto:` : il remettait le message au logiciel
 * de courriel du visiteur, et c'est lui qui devait l'envoyer. Deux défauts,
 * dont un invisible.
 *
 * Le visible : sur un téléphone, beaucoup de gens lisent leur courriel dans
 * le navigateur, sans logiciel configuré. Pour eux, le bouton ne faisait
 * **rien** — ou ouvrait une application inutilisable. Ils partaient.
 *
 * L'invisible : même avec un logiciel configuré, ce qui se passe après le
 * clic se passe hors du site. Impossible de savoir si la demande a été
 * envoyée. C'est la seule mesure qui compte sur ce site, et elle était
 * structurellement hors de portée.
 *
 * ## Ce que l'action renvoie, et ce qu'elle ne renvoie pas
 *
 * Des **codes**, jamais des phrases. Le texte affiché vit dans `i18n.ts`, du
 * côté client, dans la langue de la page. Une action serveur qui renverrait
 * « Votre demande est partie » obligerait à y dupliquer les deux langues,
 * et la troisième serait oubliée.
 *
 * ## Tant que les identifiants ne sont pas posés
 *
 * Sans `ZOHO_SMTP_UTILISATEUR` ni `ZOHO_SMTP_MOTDEPASSE`, l'action répond
 * `non-configure` au lieu d'échouer. Le formulaire retombe alors sur le
 * `mailto:` d'avant. C'est volontaire : le site reste utilisable entre le
 * déploiement de ce code et le moment où le mot de passe d'application est
 * créé chez Zoho, sans que personne ne voie une erreur.
 */

import nodemailer from "nodemailer";
import * as z from "zod";

import { CONTACT_EMAIL } from "@/lib/site";

export type EtatSoumission =
  | { etat: "repos" }
  | { etat: "envoye" }
  | { etat: "invalide"; champs: string[] }
  | { etat: "panne" }
  | { etat: "non-configure" };

const texte = (max: number) => z.string().trim().max(max);

const Demande = z.object({
  nom: texte(120).min(1),
  entreprise: texte(160).optional(),
  courriel: z.email().max(254),
  telephone: texte(40).optional(),
  service: texte(120).optional(),
  budget: texte(120).optional(),
  message: texte(6000).min(10),
});

/**
 * Un en-tête de courriel se termine par un retour à la ligne. Un nom qui en
 * contiendrait un pourrait donc injecter un en-tête de son choix — un `Bcc:`,
 * par exemple. Nodemailer encode déjà ses en-têtes, mais on ne fait pas
 * reposer une protection sur une seule couche : les caractères de contrôle
 * sautent avant d'arriver là.
 */
const sansSautDeLigne = (v: string) => v.replace(/[\r\n\t\u0000-\u001f]+/g, " ").trim();

const DELAI_MINIMAL = 2500;

export async function envoyerSoumission(
  _precedent: EtatSoumission,
  donnees: FormData,
): Promise<EtatSoumission> {
  // Le piège à robots. Un humain ne voit pas ce champ et ne le remplit
  // jamais ; un robot remplit tout ce qu'il trouve. On répond « envoyé »
  // plutôt qu'une erreur : dire au robot qu'il a été repéré, c'est l'aider à
  // s'ajuster.
  if (String(donnees.get("site") ?? "")) return { etat: "envoye" };

  // Le temps de remplissage. Absent si le visiteur n'a pas de JavaScript :
  // dans ce cas on ne vérifie rien plutôt que de bloquer quelqu'un.
  const depuis = Number(donnees.get("horodatage") ?? 0);
  if (depuis > 0 && Date.now() - depuis < DELAI_MINIMAL) return { etat: "envoye" };

  const lu = Demande.safeParse(Object.fromEntries(donnees));
  if (!lu.success) {
    const champs = [...new Set(lu.error.issues.map((i) => String(i.path[0])))];
    return { etat: "invalide", champs };
  }
  const d = lu.data;

  const utilisateur = process.env.ZOHO_SMTP_UTILISATEUR;
  const motDePasse = process.env.ZOHO_SMTP_MOTDEPASSE;
  if (!utilisateur || !motDePasse) return { etat: "non-configure" };

  const corps = [
    `Nom        : ${d.nom}`,
    `Entreprise : ${d.entreprise || "—"}`,
    `Courriel   : ${d.courriel}`,
    `Téléphone  : ${d.telephone || "—"}`,
    `Service    : ${d.service || "—"}`,
    `Budget     : ${d.budget || "—"}`,
    "",
    d.message,
    "",
    "—",
    "Envoyé par le formulaire de www.studiosentis.ca",
  ].join("\n");

  try {
    const transport = nodemailer.createTransport({
      // Le centre de données canadien. L'hôte reste paramétrable : si le
      // compte déménage, c'est une variable à changer, pas un déploiement.
      host: process.env.ZOHO_SMTP_HOTE ?? "smtp.zohocloud.ca",
      port: 465,
      secure: true,
      auth: { user: utilisateur, pass: motDePasse },
      // Sans ces bornes, un SMTP qui ne répond pas tient la requête près de
      // deux minutes par défaut : le visiteur attend devant un bouton gris,
      // puis s'en va. Mieux vaut échouer en dix secondes et lui montrer le
      // filet.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });

    await transport.sendMail({
      // L'expéditeur DOIT être l'adresse authentifiée : un SMTP n'envoie pas
      // au nom de quelqu'un d'autre, et essayer ferait classer le courriel
      // en indésirable. Le visiteur est mis en `replyTo` — répondre dans la
      // boîte suffit alors pour lui écrire.
      from: `"Studio Sentis — formulaire" <${utilisateur}>`,
      to: CONTACT_EMAIL,
      replyTo: `"${sansSautDeLigne(d.nom)}" <${d.courriel}>`,
      subject: sansSautDeLigne(
        `Soumission — ${d.nom}${d.service ? ` · ${d.service}` : ""}`,
      ),
      text: corps,
    });
    return { etat: "envoye" };
  } catch (erreur) {
    // Le détail va dans les journaux de Vercel, pas chez le visiteur : un
    // message SMTP peut contenir le nom d'utilisateur du compte.
    console.error("Envoi de soumission impossible :", erreur);
    return { etat: "panne" };
  }
}
