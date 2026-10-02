import type { Locale } from "@/lib/i18n";

/**
 * Textes légaux du site.
 *
 * Ils vivent à part de `i18n.ts` pour deux raisons. La première tient au
 * volume : deux cents lignes de texte de loi au milieu des libellés de boutons
 * rendent les deux illisibles. La seconde est technique : `DICT` est figé par
 * `as const`, ce qui transforme chaque tableau en tuple littéral, et
 * l'inférence devient fragile dès qu'on parcourt une structure profonde dont
 * les deux langues n'ont pas exactement la même forme. Ici le type est écrit à
 * la main : si une section manque en anglais, la compilation le dit.
 *
 * Sur le fond, ces pages ne sont pas un formulaire recopié. Elles décrivent ce
 * que ce site fait réellement, ce qui se trouve être remarquablement peu :
 *
 * - aucune mesure d'audience, aucun témoin de suivi, aucun pixel, aucun
 *   réseau publicitaire (vérifiable : `grep -rn "gtag\|analytics\|fbq" src/`
 *   ne renvoie rien) ;
 * - le formulaire de soumission **n'envoie rien à ce site**. Il compose un
 *   message et le remet au logiciel de courrier du visiteur. Aucun serveur du
 *   studio ne reçoit, ne voit ni n'enregistre quoi que ce soit ;
 * - la seule chose écrite sur l'appareil est la préférence de thème
 *   (clair / sombre / système), posée par le visiteur lui-même.
 *
 * Dire cela honnêtement vaut mieux, juridiquement comme commercialement, que
 * la page de consentement générique qu'on colle sur un site qui, lui, traque.
 *
 * Références : Loi 25 (Loi modernisant des dispositions législatives en
 * matière de protection des renseignements personnels), qui modifie la Loi sur
 * la protection des renseignements personnels dans le secteur privé ; Charte
 * de la langue française pour la primauté du français.
 */

/** Une section d'une page légale : un titre, des paragraphes, parfois une liste. */
export interface SectionLegale {
  titre: string;
  corps: string[];
  /** Puces, quand l'énumération est plus claire que la phrase. */
  liste?: string[];
}

export interface PageLegale {
  titre: string;
  chapo: string;
  sections: SectionLegale[];
}

export interface TextesLegaux {
  /** Libellé de la ligne « dernière mise à jour ». */
  maj: string;
  /** Titre du sommaire latéral. */
  sommaire: string;
  mentions: PageLegale & {
    identiteTitre: string;
    /** Libellés de la fiche d'identité de l'exploitant. */
    identite: {
      nomLegal: string;
      neq: string;
      adresse: string;
      hebergeur: string;
      courriel: string;
    };
    /** Affiché à la place d'une valeur qui n'est pas encore connue. */
    trou: string;
    /** Avertissement affiché tant qu'il reste un trou. */
    trouNote: string;
  };
  confidentialite: PageLegale;
}

export const TEXTES_LEGAUX: Record<Locale, TextesLegaux> = {
  fr: {
    maj: "Dernière mise à jour",
    sommaire: "Sommaire",

    mentions: {
      titre: "Mentions légales",
      chapo:
        "Qui édite ce site, ce qu'il contient, et ce que les prix affichés engagent.",
      identiteTitre: "Éditeur du site",
      identite: {
        nomLegal: "Nom légal",
        neq: "Numéro d'entreprise du Québec (NEQ)",
        adresse: "Établissement",
        hebergeur: "Hébergement",
        courriel: "Courriel",
      },
      trou: "à compléter",
      trouNote:
        "Les renseignements marqués « à compléter » ne sont pas encore inscrits : ils seront ajoutés dès l'immatriculation au Registraire des entreprises et le choix de l'hébergeur. Tant qu'il en reste un, cette page demande aux moteurs de recherche de ne pas l'indexer.",
      sections: [
        {
          titre: "Ce que présente ce site",
          corps: [
            "La section Réalisations est vide, et c'est délibéré : le studio n'a pas encore livré de mandat, et n'emprunte ni logo ni témoignage pour faire croire le contraire. Elle porte à la place une offre de lancement dont les conditions y figurent en entier.",
            "Les démonstrations visibles ailleurs sur ce site — notamment sur la page d'accueil — sont des exercices conçus par le studio pour montrer ce qu'il sait construire. Ce ne sont pas des mandats livrés, et aucune entreprise réelle n'y est présentée comme cliente. Ce site est lui-même la première pièce du studio.",
            "Les noms d'entreprises qui apparaissent dans ces démonstrations sont fictifs. Toute ressemblance avec une entreprise existante serait fortuite ; signalez-la et elle sera corrigée.",
          ],
        },
        {
          titre: "Prix affichés",
          corps: [
            "Les montants indiqués sur la page Services sont des prix de départ, donnés à titre indicatif pour un projet aux caractéristiques courantes. Ils ne constituent pas une offre au sens du Code civil du Québec.",
            "Seule une soumission écrite, datée et signée engage le studio sur un prix et sur une date. C'est aussi ce qui vous protège : un chiffre affiché sur une page peut changer, une soumission acceptée ne change plus.",
          ],
        },
        {
          titre: "Propriété intellectuelle",
          corps: [
            "Les textes, illustrations, animations et le code de ce site appartiennent au studio, à l'exception des composants tiers cités ci-dessous, qui restent la propriété de leurs auteurs et sont utilisés selon leurs licences respectives.",
            "Ce qui est livré à un client lui appartient. Le code, les fichiers sources de l'identité visuelle et le nom de domaine sont transférés à la livraison, sans redevance ni location. C'est un engagement commercial du studio, et il figure au contrat.",
          ],
        },
        {
          titre: "Logiciels tiers",
          corps: [
            "Ce site est construit sur des logiciels libres, cités par honnêteté autant que par obligation de licence :",
          ],
          liste: [
            "Next.js et React, sous licence MIT",
            "Tailwind CSS, sous licence MIT",
            "Motion, sous licence MIT",
            "Radix UI et shadcn/ui, sous licence MIT",
            "Les polices Inter, Archivo et IBM Plex, sous licence SIL Open Font License",
            "Les pictogrammes Lucide, sous licence ISC",
            "Le trait de côte du globe, dérivé des données Natural Earth, dans le domaine public",
          ],
        },
        {
          titre: "Langue",
          corps: [
            "Ce site est conçu en français et traduit en anglais, conformément à la Charte de la langue française. En cas de divergence entre les deux versions d'un texte contractuel ou légal, la version française prévaut.",
          ],
        },
        {
          titre: "Responsabilité",
          corps: [
            "Le contenu de ce site est tenu à jour avec soin, mais il décrit une offre qui évolue. Une erreur ou une information périmée peut s'y trouver ; elle sera corrigée sur signalement.",
            "Le studio met en œuvre les moyens raisonnables pour que le site reste accessible, sans pouvoir le garantir : un site dépend d'un hébergeur, d'un réseau et d'un navigateur qui ne lui appartiennent pas.",
          ],
        },
        {
          titre: "Droit applicable",
          corps: [
            "Ce site et les relations qu'il engage sont régis par les lois applicables au Québec et au Canada. Tout différend relève des tribunaux compétents du Québec.",
          ],
        },
      ],
    },

    confidentialite: {
      titre: "Politique de confidentialité",
      chapo:
        "Ce site ne mesure rien, ne suit personne et ne reçoit aucune donnée. Voici comment le vérifier, et ce qu'il advient de ce que vous m'écrivez.",
      sections: [
        {
          titre: "Ce que ce site ne fait pas",
          corps: [
            "Aucune mesure d'audience, aucun témoin de suivi, aucun pixel de réseau social, aucun réseau publicitaire, aucun profilage. Le site ne sait pas qui le consulte, ni combien de personnes le font.",
            "La seule chose écrite sur votre appareil est votre préférence d'affichage — thème clair, sombre ou automatique — que vous posez vous-même en cliquant sur le sélecteur du menu. Elle reste sur votre appareil, ne m'est jamais transmise, et s'efface avec les données de votre navigateur.",
            "C'est vérifiable sans me croire sur parole : l'onglet Réseau des outils de développement de votre navigateur montre les requêtes que fait cette page, et aucune ne part vers un service de mesure.",
          ],
        },
        {
          titre: "Le formulaire n'envoie rien à ce site",
          corps: [
            "Le formulaire de demande de soumission ne transmet rien à un serveur du studio, parce qu'il n'y en a pas pour le recevoir. Quand vous cliquez sur « Envoyer », il assemble votre message et l'ouvre dans votre propre logiciel de courrier, où vous pouvez encore le relire, le modifier ou l'abandonner.",
            "Tant que vous n'avez pas envoyé ce courriel depuis votre logiciel, rien n'a quitté votre appareil et je n'ai connaissance de rien. Ce que vous tapez dans les champs n'est enregistré nulle part entre-temps.",
          ],
        },
        {
          titre: "Ce que je reçois, si vous m'écrivez",
          corps: [
            "Si vous choisissez de m'envoyer ce message, je reçois un courriel contenant ce que vous y avez mis :",
          ],
          liste: [
            "votre nom",
            "le nom de votre entreprise, si vous l'indiquez",
            "votre adresse courriel",
            "votre numéro de téléphone, si vous l'indiquez",
            "le service qui vous intéresse et la fourchette de budget que vous avez choisie",
            "la description de votre projet, et tout ce que vous décidez d'y ajouter",
          ],
        },
        {
          titre: "Pourquoi je les demande",
          corps: [
            "Pour vous répondre, comprendre votre projet, préparer une soumission et, si nous travaillons ensemble, exécuter le mandat. Rien d'autre. Ces renseignements ne servent à aucune prospection : je n'envoie pas d'infolettre et je n'inscris personne à une liste.",
            "Vous me les transmettez parce que vous me sollicitez : c'est votre démarche qui autorise le traitement, et vous pouvez y mettre fin à tout moment.",
          ],
        },
        {
          titre: "Où ils sont conservés, et hors du Québec",
          corps: [
            "Mon adresse professionnelle est actuellement une adresse Gmail. Vos messages transitent donc par les serveurs de Google et y sont conservés ; Google exploite des centres de données hors du Québec, notamment aux États-Unis, où le cadre juridique de protection des renseignements personnels diffère de celui du Québec.",
            "La Loi 25 exige que cette communication hors Québec soit dite clairement plutôt qu'enfouie : c'est fait. Si cela vous pose un problème, écrivez-moi par tout autre moyen, ou appelez — les renseignements sensibles n'ont pas à passer par un formulaire.",
            "Les documents de travail d'un mandat en cours sont conservés sur mes appareils, protégés par mot de passe et chiffrement de disque.",
          ],
        },
        {
          titre: "Combien de temps",
          corps: [
            "Une demande restée sans suite est supprimée au plus tard vingt-quatre mois après le dernier échange.",
            "Le dossier d'un mandat réalisé est conservé le temps du mandat, puis six ans après la fin de l'année d'imposition concernée, durée pendant laquelle les obligations fiscales et comptables m'imposent de pouvoir produire les pièces. Passé ce délai, il est détruit.",
          ],
        },
        {
          titre: "À qui ils sont communiqués",
          corps: [
            "À personne. Vos renseignements ne sont ni vendus, ni loués, ni échangés, ni transmis à un partenaire commercial.",
            "Si un mandat exigeait l'intervention d'un tiers — un imprimeur pour une carte d'affaires, un hébergeur pour mettre un site en ligne —, je vous le dirais avant, et seul le nécessaire lui serait transmis.",
          ],
        },
        {
          titre: "Ce que vous pouvez exiger",
          corps: [
            "La loi québécoise vous donne des droits sur les renseignements qui vous concernent, et je m'engage à y répondre dans les trente jours :",
          ],
          liste: [
            "savoir quels renseignements je détiens sur vous et en obtenir copie",
            "les faire corriger s'ils sont inexacts, incomplets ou équivoques",
            "en demander la suppression lorsque leur conservation n'est plus justifiée",
            "obtenir les renseignements que vous m'avez fournis dans un format technologique structuré et couramment utilisé",
            "retirer votre demande, ce qui met fin au traitement",
          ],
        },
        {
          titre: "Si ma réponse ne vous satisfait pas",
          corps: [
            "Vous pouvez porter plainte auprès de la Commission d'accès à l'information du Québec, qui surveille l'application de la loi et peut être saisie sans frais. Vous n'avez pas à me demander la permission ni à m'en informer.",
          ],
        },
        {
          titre: "Responsable de la protection des renseignements personnels",
          corps: [
            "Le studio est une personne seule : celle qui répond à vos courriels est aussi celle qui est responsable de la protection des renseignements personnels, au sens de la loi. Toute demande relative à cette politique se fait à l'adresse courriel indiquée en bas de page, et je réponds moi-même.",
          ],
        },
        {
          titre: "En cas d'incident",
          corps: [
            "Si un incident de confidentialité présentait un risque de préjudice sérieux, je vous en aviserais ainsi que la Commission d'accès à l'information, avec diligence, et je tiens le registre des incidents que la loi exige. Vu ce qui précède — aucun serveur, aucune base de données, aucun stockage sur ce site —, la surface exposée se limite à ma boîte de courriel.",
          ],
        },
        {
          titre: "Décisions automatisées",
          corps: [
            "Aucune décision vous concernant n'est prise automatiquement, et aucun profil n'est constitué. Vos soumissions sont chiffrées par une personne qui lit votre message.",
          ],
        },
        {
          titre: "Modifications",
          corps: [
            "Cette politique changera quand le site changera — le jour où un formulaire enverra réellement à un serveur, ou qu'une mesure d'audience apparaîtra, il faudra la réécrire. La date de dernière mise à jour figure en tête de page ; c'est elle qui fait foi.",
          ],
        },
      ],
    },
  },

  en: {
    maj: "Last updated",
    sommaire: "Contents",

    mentions: {
      titre: "Legal notice",
      chapo:
        "Who publishes this site, what it contains, and what the prices shown commit anyone to.",
      identiteTitre: "Publisher",
      identite: {
        nomLegal: "Legal name",
        neq: "Quebec enterprise number (NEQ)",
        adresse: "Place of business",
        hebergeur: "Hosting",
        courriel: "Email",
      },
      trou: "to be completed",
      trouNote:
        "Details marked “to be completed” are not on record yet: they will be added once the business is registered with the Registraire des entreprises and a host is chosen. While any remain, this page asks search engines not to index it.",
      sections: [
        {
          titre: "What this site shows",
          corps: [
            "The Work section is empty, and deliberately so: the studio has not yet delivered a mandate, and borrows neither logos nor testimonials to suggest otherwise. It carries a launch offer instead, whose conditions are set out there in full.",
            "The demonstrations visible elsewhere on this site — on the home page in particular — are exercises built by the studio to show what it can build. They are not delivered mandates, and no real company is presented as a client. This site is the studio's first exhibit.",
            "Company names appearing in those demonstrations are fictional. Any resemblance to a real business would be accidental; point it out and it will be corrected.",
          ],
        },
        {
          titre: "Prices shown",
          corps: [
            "The amounts on the Services page are starting prices, given as an indication for a project with ordinary characteristics. They are not an offer within the meaning of the Civil Code of Québec.",
            "Only a written, dated and signed quote commits the studio to a price and a date. That protects you too: a number on a page can change, an accepted quote cannot.",
          ],
        },
        {
          titre: "Intellectual property",
          corps: [
            "The text, illustrations, animations and code of this site belong to the studio, except for the third-party components listed below, which remain their authors' property and are used under their respective licences.",
            "What is delivered to a client belongs to that client. Code, visual identity source files and the domain name are transferred on delivery, with no royalty and no rental. That is a commercial commitment of the studio, and it is written into the contract.",
          ],
        },
        {
          titre: "Third-party software",
          corps: [
            "This site is built on free software, credited out of honesty as much as licence obligation:",
          ],
          liste: [
            "Next.js and React, MIT licence",
            "Tailwind CSS, MIT licence",
            "Motion, MIT licence",
            "Radix UI and shadcn/ui, MIT licence",
            "The Inter, Archivo and IBM Plex typefaces, SIL Open Font License",
            "The Lucide icons, ISC licence",
            "The globe's coastline, derived from Natural Earth data, public domain",
          ],
        },
        {
          titre: "Language",
          corps: [
            "This site is designed in French and translated into English, in keeping with the Charter of the French Language. Where the two versions of a contractual or legal text diverge, the French version prevails.",
          ],
        },
        {
          titre: "Liability",
          corps: [
            "The content of this site is kept current with care, but it describes an offering that evolves. An error or an out-of-date detail may appear; it will be corrected once reported.",
            "The studio takes reasonable steps to keep the site available, without being able to guarantee it: a site depends on a host, a network and a browser that are not its own.",
          ],
        },
        {
          titre: "Governing law",
          corps: [
            "This site and the relationships it engages are governed by the laws applicable in Quebec and Canada. Any dispute falls to the competent courts of Quebec.",
          ],
        },
      ],
    },

    confidentialite: {
      titre: "Privacy policy",
      chapo:
        "This site measures nothing, tracks no one and receives no data. Here is how to check that, and what happens to what you write to me.",
      sections: [
        {
          titre: "What this site does not do",
          corps: [
            "No analytics, no tracking cookies, no social network pixel, no ad network, no profiling. The site does not know who visits it, or how many people do.",
            "The only thing written to your device is your display preference — light, dark or automatic — which you set yourself using the switch in the menu. It stays on your device, is never sent to me, and disappears when you clear your browser data.",
            "You do not have to take my word for it: the Network tab of your browser's developer tools shows every request this page makes, and none goes to a measurement service.",
          ],
        },
        {
          titre: "The form sends nothing to this site",
          corps: [
            "The quote request form transmits nothing to a studio server, because there is none to receive it. When you press Send, it assembles your message and opens it in your own mail application, where you can still reread it, change it or drop it.",
            "Until you send that email from your own software, nothing has left your device and I know nothing about it. What you type into the fields is stored nowhere in the meantime.",
          ],
        },
        {
          titre: "What I receive, if you write to me",
          corps: [
            "If you choose to send that message, I receive an email containing what you put in it:",
          ],
          liste: [
            "your name",
            "your company name, if you give it",
            "your email address",
            "your phone number, if you give it",
            "the service you are interested in and the budget range you selected",
            "your description of the project, and anything else you choose to add",
          ],
        },
        {
          titre: "Why I ask for them",
          corps: [
            "To reply to you, understand your project, prepare a quote and, if we work together, carry out the mandate. Nothing else. None of it feeds any prospecting: I send no newsletter and add no one to a list.",
            "You give them to me because you approached me: your own step is what authorises the processing, and you can end it at any time.",
          ],
        },
        {
          titre: "Where they are kept, including outside Quebec",
          corps: [
            "My working address is currently a Gmail address. Your messages therefore pass through and are stored on Google's servers; Google operates data centres outside Quebec, notably in the United States, where the legal framework for personal information differs from Quebec's.",
            "Law 25 requires this communication outside Quebec to be stated plainly rather than buried: here it is. If that is a problem for you, write to me by any other means, or call — sensitive information does not have to go through a form.",
            "Working documents for an active mandate are kept on my own devices, behind a password and full-disk encryption.",
          ],
        },
        {
          titre: "For how long",
          corps: [
            "A request that goes nowhere is deleted no later than twenty-four months after the last exchange.",
            "The file for a completed mandate is kept for the duration of the mandate, then for six years after the end of the relevant tax year — the period during which tax and accounting obligations require me to be able to produce the records. After that it is destroyed.",
          ],
        },
        {
          titre: "Who they are shared with",
          corps: [
            "No one. Your information is not sold, rented, traded or passed to a commercial partner.",
            "If a mandate required a third party — a printer for a business card, a host to put a site online — I would tell you beforehand, and only what was necessary would be passed on.",
          ],
        },
        {
          titre: "What you can require",
          corps: [
            "Quebec law gives you rights over the information that concerns you, and I undertake to answer within thirty days:",
          ],
          liste: [
            "to know what information I hold about you and obtain a copy",
            "to have it corrected if it is inaccurate, incomplete or ambiguous",
            "to ask for its deletion where keeping it is no longer justified",
            "to obtain the information you gave me in a structured, commonly used technological format",
            "to withdraw your request, which ends the processing",
          ],
        },
        {
          titre: "If my answer does not satisfy you",
          corps: [
            "You may complain to the Commission d'accès à l'information du Québec, which oversees the application of the law and can be petitioned free of charge. You need neither my permission nor to tell me.",
          ],
        },
        {
          titre: "Person responsible for the protection of personal information",
          corps: [
            "The studio is one person: whoever answers your email is also the person responsible for the protection of personal information under the law. Any request concerning this policy goes to the email address in the footer, and I answer it myself.",
          ],
        },
        {
          titre: "In case of an incident",
          corps: [
            "If a confidentiality incident presented a risk of serious injury, I would notify you and the Commission d'accès à l'information promptly, and I keep the incident register the law requires. Given the above — no server, no database, no storage on this site — the exposed surface is limited to my mailbox.",
          ],
        },
        {
          titre: "Automated decisions",
          corps: [
            "No decision concerning you is made automatically, and no profile is built. Your quotes are priced by a person who reads your message.",
          ],
        },
        {
          titre: "Changes",
          corps: [
            "This policy will change when the site changes — the day a form actually posts to a server, or an analytics script appears, it will have to be rewritten. The last-updated date at the top of the page is the one that counts.",
          ],
        },
      ],
    },
  },
};
