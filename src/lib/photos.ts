import type { StaticImageData } from "next/image";

import agenda from "@/assets/photos/agenda.jpg";
import atelier from "@/assets/photos/atelier.jpg";
import cafeMontreal from "@/assets/photos/cafe-montreal.jpg";
import carnetCrayon from "@/assets/photos/carnet-crayon.jpg";
import cle from "@/assets/photos/cle.jpg";
import portableReferme from "@/assets/photos/portable-referme.jpg";
import posteDeTravail from "@/assets/photos/poste-de-travail.jpg";
import riviereChateauguay from "@/assets/photos/riviere-chateauguay.jpg";

/**
 * Les photographies du site, et d'où elles viennent.
 *
 * Le site n'avait aucune photo, par principe : ni banque d'images, ni bureau
 * qui n'est pas le sien, ni équipe qui n'existe pas. Le client a demandé que
 * le site « parle » avec des images (2026-10-05). Le principe tient toujours,
 * il change seulement de forme : **aucune de ces photos ne montre une
 * personne**, et aucune ne prétend montrer le studio, son bureau ou ses
 * clients. Ce sont des objets — un agenda, une clé, un carnet — et un lieu
 * réel : la rivière Châteauguay, près de l'île Saint-Bernard.
 *
 * Toutes viennent de Wikimedia Commons, avec leur licence vérifiée à la
 * source. Sept sont en CC0 (domaine public, copies Commons de photos
 * Unsplash) ; la rivière est en CC BY 4.0, qui **exige** le nom de l'auteur,
 * la licence et la mention d'une modification — elle est recadrée. Le crédit
 * est affiché sur chaque photo, CC0 compris : rien ne l'impose, mais un site
 * qui dit ne rien inventer dit aussi d'où viennent ses images.
 */
export type Photo = {
  image: StaticImageData;
  /** Ce que montre la photo, pour qui ne la voit pas. Vide si décorative. */
  alt: { fr: string; en: string };
  auteur: string;
  licence: "CC0" | "CC BY 4.0";
  /** Page Commons de l'original, où la licence se vérifie. */
  source: string;
};

export const PHOTOS = {
  agenda: {
    image: agenda,
    alt: { fr: "Un agenda ouvert sur une table", en: "An open planner on a table" },
    auteur: "Eric Rothermel",
    licence: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Monthly_schedule_(Unsplash).jpg",
  },
  atelier: {
    image: atelier,
    alt: {
      fr: "Une tablette graphique sur un bureau, près d'une fenêtre",
      en: "A drawing tablet on a desk by a window",
    },
    auteur: "Norbert Levajsics",
    licence: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Wacom_Cintiq_22HD_workspace_2_(Unsplash).jpg",
  },
  cle: {
    image: cle,
    alt: { fr: "Une clé suspendue à une branche", en: "A key hanging from a branch" },
    auteur: "Katy Belcher",
    licence: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Engraved_key_on_a_branch_(Unsplash).jpg",
  },
  riviere: {
    image: riviereChateauguay,
    alt: {
      fr: "La rivière Châteauguay près de l'île Saint-Bernard, à Châteauguay",
      en: "The Châteauguay River near Île Saint-Bernard, in Châteauguay",
    },
    auteur: "Maxime Laterreur",
    licence: "CC BY 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Rivi%C3%A8re_Ch%C3%A2teauguay_pr%C3%A8s_de_l%27%C3%8Ele_Saint-Bernard,_Ch%C3%A2teauguay,_Qu%C3%A9bec,_Canada.jpg",
  },
  cafe: {
    image: cafeMontreal,
    alt: { fr: "Un café sur une longue table en bois", en: "A coffee on a long wooden table" },
    auteur: "Luke Chesser",
    licence: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Coffee_in_Montreal_(Unsplash).jpg",
  },
  carnet: {
    image: carnetCrayon,
    alt: { fr: "Un carnet et un crayon sur une feuille", en: "A notebook and a pencil on a sheet of paper" },
    auteur: "Helloquence",
    licence: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Field_Notes_and_pencil_(Unsplash).jpg",
  },
  poste: {
    image: posteDeTravail,
    alt: { fr: "Un ordinateur allumé sur un bureau en bois", en: "A computer switched on, on a wooden desk" },
    auteur: "Luke Chesser",
    licence: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Desk_Setup_(Unsplash).jpg",
  },
  portable: {
    image: portableReferme,
    alt: { fr: "Un ordinateur portable à demi refermé", en: "A half-closed laptop" },
    auteur: "Luca Bravo",
    licence: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Half-closed_laptop_(Unsplash).jpg",
  },
} satisfies Record<string, Photo>;

export type CleePhoto = keyof typeof PHOTOS;

/** Le crédit tel qu'il s'affiche, dans la langue de la page. */
export function creditPhoto(photo: Photo, locale: "fr" | "en"): string {
  const modifiee =
    photo.licence === "CC BY 4.0" ? (locale === "fr" ? ", recadrée" : ", cropped") : "";
  return `${locale === "fr" ? "Photo :" : "Photo:"} ${photo.auteur}, ${photo.licence}${modifiee}`;
}
