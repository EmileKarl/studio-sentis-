export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Le français est la langue de référence, pas une traduction parmi d'autres.
 * Au Québec, les communications commerciales sont encadrées par la Charte de
 * la langue française : le site est conçu en français, puis traduit. L'anglais
 * existe parce que le Grand Montréal le parle, pas par symétrie.
 */
export const DICT = {
  fr: {
    meta: {
      title: "Studio Sentis — sites web, applications et identité visuelle à Châteauguay",
      description:
        "Le prix et la date dès le premier échange. Un seul interlocuteur, du logo à l'application. Châteauguay, Montérégie et Grand Montréal.",
    },
    nav: {
      accueil: "Accueil",
      services: "Services",
      realisations: "Réalisations",
      apropos: "À propos",
      contactCourt: "Contact",
      soumission: "Demander une soumission",
      offre: "Ce que je fais",
      prix: "Prix",
      methode: "Comment ça se passe",
      contact: "Parler du projet",
      langue: "English",
      autre: "en",
      menu: "Menu",
      fermer: "Fermer",
    },
    pages: {
      accueil: {
        manifeste: [
          {
            titre: "Le prix. La date. Dès le premier échange.",
            corps: "Pas de « soumission sur demande » pour un site vitrine. Les montants sont affichés, et la date est au contrat.",
          },
          {
            titre: "Une seule personne, du logo à l'application.",
            corps: "Celle à qui vous parlez est celle qui travaille. Pas de vendeur, pas de chef de projet, pas de version déformée de votre demande.",
          },
          {
            titre: "Le site vous appartient.",
            corps: "Le code et le nom de domaine sont à vous. Vous n'êtes locataire d'aucune plateforme dont l'abonnement grimpe.",
          },
          {
            titre: "Châteauguay. On peut se rencontrer.",
            corps: "Montérégie et Grand Montréal. Quelqu'un à appeler, qui connaît votre projet, et qui répond.",
          },
        ],
        etapesTitre: "Quatre étapes, et vous savez où vous allez",
      },
      services: {
        titre: "Services",
        chapo: "Quatre métiers, un seul interlocuteur. Chaque service peut être commandé seul ou combiné aux autres — c'est là qu'il devient intéressant.",
        items: [
          {
            nom: "Sites web",
            resume: "Du site une page au site vitrine complet.",
            detail: "Présenter votre activité, être trouvé par les gens qui vous cherchent, être joint sans friction. Bilingue français-anglais dès la conception, parce qu'au Québec ce n'est pas une option.",
            livrables: ["Conception et intégration", "Bilingue FR/EN", "Fiche Google Business", "Vous modifiez le contenu vous-même", "Hébergement et suivi"],
          },
          {
            nom: "Applications web et mobile",
            resume: "Un outil sur mesure quand l'existant ne suit pas.",
            detail: "Quand un logiciel du commerce ne correspond pas à votre façon de travailler et qu'il vous impose la sienne. On commence par un cadrage payant à prix fixe : périmètre écrit, maquette cliquable, soumission ferme.",
            livrables: ["Cadrage et maquette cliquable", "Développement web ou mobile", "Reprise de vos données", "Formation à l'usage", "Évolutions au fil de l'eau"],
          },
          {
            nom: "Identité visuelle",
            resume: "Logo, couleurs, typographie et déclinaisons.",
            detail: "Une identité qui tient aussi bien sur une enseigne d'atelier que sur une facture, un camion ou un fil Instagram. Livrée avec son guide d'usage, pour que vous puissiez la confier à quelqu'un d'autre sans qu'elle se déforme.",
            livrables: ["Logo et monogramme", "Palette et typographie", "Carte, enseigne, réseaux sociaux", "Guide d'usage", "Fichiers sources"],
          },
          {
            nom: "Informatique et marketing",
            resume: "Dépannage, maintenance, accompagnement.",
            detail: "Le reste : un poste qui ne démarre plus, une boîte courriel à configurer, une campagne à lancer, un référencement local à redresser. Facturé à l'heure ou au forfait mensuel, jamais à l'aveugle.",
            livrables: ["Dépannage sur place ou à distance", "Configuration courriel et postes", "Référencement local", "Campagnes et publications", "Suivi mensuel"],
          },
        ],
        ctaTitre: "Une idée du budget avant d'appeler ?",
        ctaCorps: "Les forfaits sont affichés, en dollars canadiens. Vous saurez à quoi vous attendre avant même de m'écrire.",
        ctaLien: "Voir les prix",
      },
      realisations: {
        titre: "Réalisations",
        chapo: "Studio Sentis démarre. Plutôt que d'emprunter des logos ou d'inventer des témoignages, voici trois pièces conçues pour montrer trois registres — rendues en direct par votre navigateur, pas exportées en image.",
      },
      apropos: {
        titre: "À propos",
        chapo: "Un studio de Châteauguay, qui commence, et qui préfère le dire.",
        histoire: [
          {
            titre: "Pourquoi un studio de plus",
            corps: "Parce que la plupart des petites entreprises d'ici renoncent à leur projet numérique pour trois raisons qui n'ont rien à voir avec le numérique : elles ne savent pas combien ça va coûter, à qui elles parlent, ni quand ce sera fini. Ce sont trois problèmes de méthode, pas de technologie.",
          },
          {
            titre: "Ce que ça change concrètement",
            corps: "Les prix sont affichés. Vous parlez à la personne qui fait le travail. La date est au contrat. Ces trois engagements ne tiennent que parce que je travaille sur une base technique que j'ai construite et que je réutilise d'un projet à l'autre — sans elle, un prix ferme serait une promesse en l'air.",
          },
          {
            titre: "Ce que je ne prétends pas",
            corps: "Pas de clients à citer pour l'instant, pas d'années d'expérience à afficher, pas de récompenses. Vous jugerez sur ce site, sur les pièces de démonstration et sur notre premier échange. C'est moins confortable qu'un mur de logos, mais c'est vérifiable.",
          },
        ],
        valeursTitre: "Trois principes de travail",
        valeurs: [
          { titre: "Rien d'inventé", corps: "Aucun faux témoignage, aucun logo client emprunté, aucun compteur décoratif. Ce qui est écrit est vrai ou n'est pas écrit." },
          { titre: "Vous restez autonome", corps: "Le site livré se modifie sans moi, et vous apprenez à le faire. Un prestataire dont on dépend à vie n'est pas un partenaire." },
          { titre: "Vérifié, pas supposé", corps: "Contrastes, lisibilité, téléphone et grand écran : chaque livraison passe des contrôles automatiques avant d'arriver chez vous." },
        ],
      },
      contact: {
        titre: "Demander une soumission",
        chapo: "Décrivez votre projet en quelques lignes. Je réponds sous 48 heures avec un prix et une date, ou avec les questions qui me manquent pour les donner.",
        champs: {
          nom: "Votre nom",
          entreprise: "Entreprise",
          courriel: "Courriel",
          telephone: "Téléphone",
          service: "Ce qui vous intéresse",
          budget: "Budget envisagé",
          message: "Votre projet en quelques lignes",
          optionnel: "facultatif",
        },
        services: ["Site web", "Application web ou mobile", "Identité visuelle", "Informatique ou marketing", "Je ne sais pas encore"],
        budgets: ["Moins de 2 000 $", "2 000 $ à 5 000 $", "5 000 $ à 15 000 $", "Plus de 15 000 $", "À déterminer"],
        envoyer: "Envoyer la demande",
        erreurs: {
          nom: "Indiquez votre nom.",
          courriel: "Indiquez une adresse courriel valide.",
          message: "Décrivez votre projet, même brièvement.",
        },
        ouverture: "Votre logiciel de courriel va s'ouvrir avec le message pré-rempli. Vérifiez-le, puis envoyez.",
        direct: "Ou écrivez directement à",
        infosTitre: "Coordonnées",
        infos: [
          ["Courriel", "Emiletchesseu@gmail.com"],
          ["Secteur", "Châteauguay, Montérégie, Grand Montréal"],
          ["Langues", "Français et anglais"],
          ["Réponse", "Sous 48 heures, jours ouvrables"],
        ],
      },
    },
    hero: {
      lieu: "Châteauguay · Montérégie · Grand Montréal",
      titre: "Le prix et la date, dès le premier échange.",
      chapo:
        "Un site, une application ou une identité visuelle, menés par une seule personne — celle à qui vous parlez. Vous savez ce que ça coûte et quand c'est livré avant de vous engager.",
      cta: "Parler de votre projet",
      ctaSecondaire: "Voir les prix",
    },
    probleme: {
      titre: "Trois raisons de repousser un projet web",
      intro:
        "Ce sont celles qu'on entend le plus souvent, et elles sont légitimes.",
      items: [
        {
          titre: "« Je ne sais pas combien ça va coûter »",
          corps:
            "Le secteur répond « devis sur demande ». Vous devez appeler, expliquer, attendre, et recommencer ailleurs pour comparer.",
        },
        {
          titre: "« Je ne sais pas à qui je parle »",
          corps:
            "Un commercial vend, un chef de projet transmet, quelqu'un d'autre exécute. Votre demande se perd entre les trois.",
        },
        {
          titre: "« Je ne sais pas quand ce sera fini »",
          corps:
            "Le délai est vague au départ, puis il glisse. Vous n'avez aucun moyen de planifier autour.",
        },
      ],
    },
    reponse: {
      titre: "Ce que je change",
      items: [
        {
          titre: "Le prix est affiché",
          corps:
            "Les forfaits sont sur cette page, montants en dollars canadiens. Pas de « devis sur demande » pour un site vitrine.",
        },
        {
          titre: "Vous parlez à la personne qui travaille",
          corps:
            "Du premier message à la livraison. Pas d'intermédiaire, pas de transmission, pas de version déformée de votre demande.",
        },
        {
          titre: "La date est au devis",
          corps:
            "Un délai daté, pas une fourchette. Il est tenable parce que je travaille sur une base que j'ai construite et que je réutilise.",
        },
      ],
    },
    services: {
      titre: "Ce que je fais",
      items: [
        {
          titre: "Sites web",
          corps:
            "Du site une page au site vitrine complet : présenter votre activité, être trouvé, être joint. Bilingue français-anglais.",
        },
        {
          titre: "Applications web et mobile",
          corps:
            "Un outil sur mesure quand un logiciel existant ne correspond pas à votre façon de travailler.",
        },
        {
          titre: "Identité visuelle",
          corps:
            "Logo, couleurs, typographie et déclinaisons : carte d'affaires, enseigne, réseaux sociaux.",
        },
      ],
      autres:
        "Aussi : dépannage informatique, maintenance et accompagnement marketing. Demandez.",
    },
    prix: {
      titre: "Prix",
      intro:
        "Montants en dollars canadiens, taxes en sus. Un forfait couvre le travail annoncé : si le projet change en cours de route, on en reparle avant, pas sur la facture.",
      forfaits: [
        { nom: "Présence essentielle", detail: "Site une page, bilingue, mobile, fiche Google", prix: "1 800 $", delai: "10 jours ouvrables" },
        { nom: "Vitrine complète", detail: "5 pages, bilingue, vous modifiez le contenu vous-même", prix: "3 900 $", delai: "3 semaines" },
        { nom: "Identité visuelle", detail: "Logo, palette, typographie, déclinaisons, guide d'usage", prix: "2 400 $", delai: "2 semaines" },
        { nom: "Identité + vitrine", detail: "Les deux menés d'un seul tenant", prix: "5 700 $", delai: "4 semaines" },
        { nom: "Cadrage d'application", detail: "Périmètre écrit, maquette cliquable, devis ferme — déduit si le projet se fait", prix: "1 200 $", delai: "1 semaine" },
        { nom: "Suivi mensuel", detail: "Hébergement, mises à jour, sauvegardes, petites modifications", prix: "85 $ / mois", delai: "sans engagement" },
      ],
      note: "Une application sur mesure ne reçoit pas de forfait : personne ne peut chiffrer honnêtement ce qui n'est pas encore défini. Le cadrage, lui, a un prix fixe — et vous repartez avec un document utilisable même si vous ne poursuivez pas avec moi.",
    },
    versus: {
      titre: "Et pourquoi pas un outil en ligne ?",
      intro:
        "C'est une vraie question, et pour certains projets la réponse est : allez-y. Voici ce qui change quand vous passez par quelqu'un.",
      items: [
        { titre: "Le site vous appartient", corps: "Le code et le nom de domaine sont à vous. Vous n'êtes locataire d'aucune plateforme." },
        { titre: "Le coût n'augmente pas tout seul", corps: "Un abonnement grimpe avec le temps et les options. Votre site, non." },
        { titre: "Les obligations linguistiques sont respectées", corps: "Au Québec, un site commercial doit être en français. C'est intégré dès la conception, pas rajouté après coup." },
        { titre: "Vous avez quelqu'un à appeler", corps: "Dans votre région, qui connaît votre projet, et qui répond." },
      ],
    },
    methode: {
      titre: "Comment ça se passe",
      etapes: [
        { n: "01", titre: "On se parle", corps: "30 minutes, sur place ou en visio. Vous décrivez votre activité et ce dont vous avez besoin. Aucun engagement." },
        { n: "02", titre: "Vous recevez un prix et une date", corps: "Par écrit, sous 48 heures. Le montant est ferme, la date aussi." },
        { n: "03", titre: "Je construis, vous voyez avancer", corps: "Un lien de suivi dès le premier jour. Vous commentez au fur et à mesure, pas à la fin." },
        { n: "04", titre: "Je livre, et vous prenez la main", corps: "Le site est à vous. Une heure de prise en main pour que vous puissiez le modifier seul." },
      ],
    },
    travaux: {
      titre: "Ce que je sais faire",
      intro:
        "Trois pièces conçues pour montrer trois registres différents. Elles ne sont pas des captures d'écran : ce sont des interfaces réelles, rendues par votre navigateur en ce moment même.",
      mention:
        "Démonstrations réalisées par Studio Sentis. Ce ne sont pas des projets clients — le studio démarre et n'en a pas encore. Les entreprises citées sont fictives.",
      items: [
        {
          etiquette: "Site vitrine",
          titre: "Boulangerie Le Fournil",
          corps:
            "Un commerce de quartier : horaires lisibles d'un coup d'œil, produits et prix visibles sans cliquer, réservation en un bouton.",
          meta: "Registre chaleureux · serif éditoriale · prix affichés",
        },
        {
          etiquette: "Application mobile",
          titre: "Salon Véra — prise de rendez-vous",
          corps:
            "Choisir un jour, choisir une heure, confirmer. Les créneaux déjà pris sont barrés plutôt que cachés : on comprend tout de suite ce qu'il reste.",
          meta: "Registre calme · états visibles · une seule action par écran",
        },
        {
          etiquette: "Identité visuelle",
          titre: "Rive-Sud Mécanique",
          corps:
            "Monogramme, palette et caractère typographique, pensés pour tenir aussi bien sur une enseigne d'atelier que sur une facture.",
          meta: "Registre franc · contraste élevé · lisible de loin",
        },
      ],
    },
    contact: {
      titre: "Parlons de votre projet",
      corps:
        "Décrivez en deux lignes ce que vous voulez faire. Je réponds sous 48 heures avec un prix et une date, ou avec les questions qui me manquent pour les donner.",
      courriel: "Écrire un courriel",
      note: "Châteauguay, Québec · Français et anglais",
    },
    pied: {
      droits: "Studio Sentis — Châteauguay, Québec",
      mention: "Site construit sur NEXUS UI.",
    },
  },

  en: {
    meta: {
      title: "Studio Sentis — websites, apps and visual identity in Châteauguay",
      description:
        "A price and a date from the first conversation. One person, from logo to application. Châteauguay, Montérégie and Greater Montreal.",
    },
    nav: {
      accueil: "Home",
      services: "Services",
      realisations: "Work",
      apropos: "About",
      contactCourt: "Contact",
      soumission: "Request a quote",
      offre: "What I do",
      prix: "Pricing",
      methode: "How it works",
      contact: "Discuss your project",
      langue: "Français",
      autre: "fr",
      menu: "Menu",
      fermer: "Close",
    },
    pages: {
      accueil: {
        manifeste: [
          {
            titre: "The price. The date. From the first conversation.",
            corps: "No \"quote on request\" for a brochure site. The amounts are published, and the date is in the contract.",
          },
          {
            titre: "One person, from logo to application.",
            corps: "The person you talk to is the person doing the work. No salesperson, no project manager, no distorted version of your request.",
          },
          {
            titre: "The site belongs to you.",
            corps: "The code and the domain name are yours. You are not renting from a platform whose subscription keeps climbing.",
          },
          {
            titre: "Châteauguay. We can meet.",
            corps: "Montérégie and Greater Montreal. Someone to call, who knows your project, and who answers.",
          },
        ],
        etapesTitre: "Four steps, and you know where you stand",
      },
      services: {
        titre: "Services",
        chapo: "Four crafts, one point of contact. Each service stands alone or combines with the others — which is where it gets interesting.",
        items: [
          {
            nom: "Websites",
            resume: "From a one-page site to a full brochure site.",
            detail: "Present your business, get found by the people looking for you, get reached without friction. Bilingual French and English from the design stage, because in Quebec that is not optional.",
            livrables: ["Design and build", "Bilingual FR/EN", "Google Business listing", "You edit the content yourself", "Hosting and care"],
          },
          {
            nom: "Web and mobile applications",
            resume: "A custom tool when off-the-shelf software doesn't fit.",
            detail: "For when commercial software doesn't match how you work and imposes its own way instead. We start with a paid fixed-price scoping: written scope, clickable mockup, firm quote.",
            livrables: ["Scoping and clickable mockup", "Web or mobile build", "Data migration", "Training", "Ongoing changes"],
          },
          {
            nom: "Visual identity",
            resume: "Logo, colours, typography and applications.",
            detail: "An identity that holds up on a workshop sign as well as on an invoice, a van or an Instagram feed. Delivered with its usage guide, so you can hand it to someone else without it falling apart.",
            livrables: ["Logo and monogram", "Palette and typography", "Card, signage, social media", "Usage guide", "Source files"],
          },
          {
            nom: "IT and marketing",
            resume: "Support, maintenance, day-to-day help.",
            detail: "The rest: a machine that won't boot, an email account to set up, a campaign to launch, local search to straighten out. Billed hourly or on a monthly package, never blind.",
            livrables: ["On-site or remote support", "Email and workstation setup", "Local search", "Campaigns and posts", "Monthly care"],
          },
        ],
        ctaTitre: "Want a sense of the budget first?",
        ctaCorps: "The packages are published, in Canadian dollars. You will know what to expect before you even write to me.",
        ctaLien: "See pricing",
      },
      realisations: {
        titre: "Work",
        chapo: "Studio Sentis is starting out. Rather than borrow logos or invent testimonials, here are three pieces built to show three registers — rendered live by your browser, not exported as images.",
      },
      apropos: {
        titre: "About",
        chapo: "A studio in Châteauguay, starting out, and saying so.",
        histoire: [
          {
            titre: "Why one more studio",
            corps: "Because most small businesses here give up on their digital project for three reasons that have nothing to do with technology: they don't know what it will cost, who they are talking to, or when it will be done. Those are method problems, not technical ones.",
          },
          {
            titre: "What actually changes",
            corps: "Prices are published. You talk to the person doing the work. The date is in the contract. Those three commitments only hold because I work from a technical base I built and reuse from one project to the next — without it, a firm price would be an empty promise.",
          },
          {
            titre: "What I don't claim",
            corps: "No clients to name yet, no years of experience to display, no awards. You will judge on this site, on the demonstration pieces, and on our first conversation. That is less comfortable than a wall of logos, but it can be checked.",
          },
        ],
        valeursTitre: "Three working principles",
        valeurs: [
          { titre: "Nothing invented", corps: "No fake testimonials, no borrowed client logos, no decorative counters. What is written is true or it isn't written." },
          { titre: "You stay independent", corps: "The site you receive can be edited without me, and you learn how. A supplier you depend on for life is not a partner." },
          { titre: "Checked, not assumed", corps: "Contrast, legibility, phone and wide screen: every delivery passes automated checks before it reaches you." },
        ],
      },
      contact: {
        titre: "Request a quote",
        chapo: "Describe your project in a few lines. I reply within 48 hours with a price and a date, or with the questions I need answered to give them.",
        champs: {
          nom: "Your name",
          entreprise: "Company",
          courriel: "Email",
          telephone: "Phone",
          service: "What you're interested in",
          budget: "Budget in mind",
          message: "Your project in a few lines",
          optionnel: "optional",
        },
        services: ["Website", "Web or mobile app", "Visual identity", "IT or marketing", "Not sure yet"],
        budgets: ["Under $2,000", "$2,000 to $5,000", "$5,000 to $15,000", "Over $15,000", "To be determined"],
        envoyer: "Send the request",
        erreurs: {
          nom: "Please enter your name.",
          courriel: "Please enter a valid email address.",
          message: "Describe your project, even briefly.",
        },
        ouverture: "Your email program will open with the message pre-filled. Check it, then send.",
        direct: "Or write directly to",
        infosTitre: "Details",
        infos: [
          ["Email", "Emiletchesseu@gmail.com"],
          ["Area", "Châteauguay, Montérégie, Greater Montreal"],
          ["Languages", "French and English"],
          ["Response", "Within 48 hours, business days"],
        ],
      },
    },
    hero: {
      lieu: "Châteauguay · Montérégie · Greater Montreal",
      titre: "A price and a date, from the first conversation.",
      chapo:
        "A website, an application or a visual identity, handled by one person — the one you talk to. You know the cost and the delivery date before you commit.",
      cta: "Discuss your project",
      ctaSecondaire: "See pricing",
    },
    probleme: {
      titre: "Three reasons projects get postponed",
      intro: "These are the ones we hear most, and they are fair.",
      items: [
        { titre: "“I don't know what it will cost”", corps: "The industry answers “quote on request”. You have to call, explain, wait, then start over elsewhere to compare." },
        { titre: "“I don't know who I'm talking to”", corps: "A salesperson sells, a project manager relays, someone else builds. Your request gets lost between the three." },
        { titre: "“I don't know when it will be done”", corps: "The timeline starts vague, then slips. You have no way to plan around it." },
      ],
    },
    reponse: {
      titre: "What I change",
      items: [
        { titre: "The price is published", corps: "Packages are on this page, in Canadian dollars. No “quote on request” for a brochure site." },
        { titre: "You talk to the person doing the work", corps: "From first message to delivery. No middle layer, no relay, no distorted version of your request." },
        { titre: "The date is in the quote", corps: "A dated deadline, not a range. It holds because I work from a base I built and reuse." },
      ],
    },
    services: {
      titre: "What I do",
      items: [
        { titre: "Websites", corps: "From a one-page site to a full brochure site: present your business, get found, get reached. Bilingual French and English." },
        { titre: "Web and mobile applications", corps: "A custom tool for when existing software doesn't match how you actually work." },
        { titre: "Visual identity", corps: "Logo, colours, typography and applications: business card, signage, social media." },
      ],
      autres: "Also: IT support, maintenance and marketing help. Just ask.",
    },
    prix: {
      titre: "Pricing",
      intro:
        "Canadian dollars, taxes extra. A package covers the stated work: if the project changes along the way, we talk about it first, not on the invoice.",
      forfaits: [
        { nom: "Essential presence", detail: "One-page site, bilingual, mobile, Google Business listing", prix: "$1,800", delai: "10 business days" },
        { nom: "Full brochure site", detail: "5 pages, bilingual, you edit the content yourself", prix: "$3,900", delai: "3 weeks" },
        { nom: "Visual identity", detail: "Logo, palette, typography, applications, usage guide", prix: "$2,400", delai: "2 weeks" },
        { nom: "Identity + site", detail: "Both, run as one project", prix: "$5,700", delai: "4 weeks" },
        { nom: "Application scoping", detail: "Written scope, clickable mockup, firm quote — deducted if the project goes ahead", prix: "$1,200", delai: "1 week" },
        { nom: "Monthly care", detail: "Hosting, updates, backups, small changes", prix: "$85 / month", delai: "no commitment" },
      ],
      note: "A custom application gets no fixed package: nobody can honestly price what isn't defined yet. The scoping does have a fixed price — and you leave with a document you can use even if you don't continue with me.",
    },
    versus: {
      titre: "So why not an online builder?",
      intro: "It's a fair question, and for some projects the answer is: go ahead. Here's what changes when you work with someone.",
      items: [
        { titre: "The site is yours", corps: "The code and the domain name belong to you. You're not renting from a platform." },
        { titre: "The cost doesn't climb on its own", corps: "A subscription grows with time and add-ons. Your site doesn't." },
        { titre: "Language requirements are met", corps: "In Quebec a commercial site must be available in French. That's built in from the start, not bolted on later." },
        { titre: "You have someone to call", corps: "In your region, who knows your project, and who answers." },
      ],
    },
    methode: {
      titre: "How it works",
      etapes: [
        { n: "01", titre: "We talk", corps: "30 minutes, in person or by video. You describe your business and what you need. No commitment." },
        { n: "02", titre: "You get a price and a date", corps: "In writing, within 48 hours. The amount is firm, and so is the date." },
        { n: "03", titre: "I build, you watch it happen", corps: "A preview link from day one. You comment as it goes, not at the end." },
        { n: "04", titre: "I hand it over", corps: "The site is yours. One hour of training so you can edit it on your own." },
      ],
    },
    travaux: {
      titre: "What I can do",
      intro:
        "Three pieces built to show three different registers. They are not screenshots: these are real interfaces, rendered by your browser right now.",
      mention:
        "Demonstrations built by Studio Sentis. These are not client projects — the studio is starting out and has none yet. The businesses shown are fictional.",
      items: [
        {
          etiquette: "Brochure site",
          titre: "Le Fournil bakery",
          corps:
            "A neighbourhood shop: opening hours readable at a glance, products and prices visible without a click, booking in one button.",
          meta: "Warm register · editorial serif · prices shown",
        },
        {
          etiquette: "Mobile app",
          titre: "Salon Véra — booking",
          corps:
            "Pick a day, pick a time, confirm. Taken slots are struck through rather than hidden, so what is left reads immediately.",
          meta: "Calm register · visible states · one action per screen",
        },
        {
          etiquette: "Visual identity",
          titre: "Rive-Sud Mécanique",
          corps:
            "Monogram, palette and typeface, built to hold up on a workshop sign as well as on an invoice.",
          meta: "Blunt register · high contrast · legible from a distance",
        },
      ],
    },
    contact: {
      titre: "Let's talk about your project",
      corps:
        "Describe in two lines what you want to build. I reply within 48 hours with a price and a date, or with the questions I need answered to give them.",
      courriel: "Send an email",
      note: "Châteauguay, Quebec · French and English",
    },
    pied: {
      droits: "Studio Sentis — Châteauguay, Quebec",
      mention: "Built on NEXUS UI.",
    },
  },
} as const;

export type Dict = (typeof DICT)[Locale];
